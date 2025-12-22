import type { ReactNode } from "react"
import { notFound } from "next/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CookieConsent } from "@/components/cookie-consent"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { i18n } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import { getCities } from "@/lib/cities"

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

  // Validate that the incoming `locale` parameter is valid
  const isValidLocale = i18n.locales.some((cur) => cur === locale)
  if (!isValidLocale) notFound()

  const dict = await getDictionary(locale)
  const cities = await getCities(locale)

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <Header locale={locale} dictionary={dict} />
      <main>{children}</main>
      <Footer locale={locale} dictionary={dict} cities={cities} />
      <CookieConsent locale={locale} dictionary={dict.cookieConsent} />
      <Toaster />
    </ThemeProvider>
  )
}