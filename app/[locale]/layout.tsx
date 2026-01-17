import type { ReactNode } from "react"
import { notFound } from "next/navigation"
import dynamic from "next/dynamic"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Header } from "@/components/header"
import { i18n } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import { getCities } from "@/lib/cities"
import { StructuredData } from "@/components/structured-data"

const Footer = dynamic(() => import("@/components/footer").then(mod => ({ default: mod.Footer })), {
  loading: () => (
    <footer className="bg-muted py-12 border-t">
      <div className="container">
        <div className="animate-pulse h-32 bg-muted rounded" />
      </div>
    </footer>
  ),
})
const CookieConsent = dynamic(() => import("@/components/cookie-consent").then(mod => ({ default: mod.CookieConsent })), {
  loading: () => null,
})

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: { locale: string }
}) {
  const resolvedParams = await Promise.resolve(params)
  const locale = resolvedParams.locale

  const isValidLocale = i18n.locales.some((cur) => cur === locale)
  if (!isValidLocale) notFound()

  const [dict, cities] = await Promise.all([
    getDictionary(locale),
    getCities(locale),
  ])

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <StructuredData type="localBusiness" locale={locale} />
      <Header locale={locale} dictionary={dict} />
      <main>{children}</main>
      <Footer locale={locale} dictionary={dict} cities={cities} />
      <CookieConsent dictionary={dict.cookieConsent} />
      <Toaster />
    </ThemeProvider>
  )
}