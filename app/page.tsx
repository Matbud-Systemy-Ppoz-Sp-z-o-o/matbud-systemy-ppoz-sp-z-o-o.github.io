import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { getDictionary } from "@/lib/dictionaries"
import { generateMetadata as generateSEOMetadata } from "@/lib/seo"
import { StructuredData } from "@/components/structured-data"
import { i18n } from "@/lib/i18n-config"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Toaster } from "@/components/ui/toaster"
import Hero from "@/components/hero"
import Services from "@/components/services"
import AboutUs from "@/components/about-us"
import Gallery from "@/components/gallery"
import Contact from "@/components/contact"
import { Footer } from "@/components/footer"
import { getCities } from "@/lib/cities"

const CookieConsent = dynamic(() => import("@/components/cookie-consent").then(mod => ({ default: mod.CookieConsent })), {
  loading: () => null,
})

export async function generateMetadata(): Promise<Metadata> {
  const locale = i18n.defaultLocale
  const dict = await getDictionary(locale)
  
  const title = `${dict.common.companyName} | ${dict.common.pageTitle}`
  const description = dict.common.pageDescription
  
  return generateSEOMetadata({
    title,
    description,
    keywords: dict.common.keywords,
    locale,
    path: "",
    type: "website",
    image: "https://matbud.net/images/gallery/hero.webp",
  })
}

export default async function RootPage() {
  const locale = i18n.defaultLocale
  const [dict, cities] = await Promise.all([
    getDictionary(locale),
    getCities(locale),
  ])
  
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <StructuredData type="localBusiness" locale={locale} />
      <StructuredData
        type="breadcrumb"
        data={[
          { name: dict.breadcrumbs.home, url: `https://matbud.net/${locale}` },
        ]}
      />
      <Header
        locale={locale}
        dictionary={{
          // Header is a client component: pass only what it renders, not the whole dictionary.
          navigation: dict.navigation,
          common: {
            companyName: dict.common.companyName,
            companyNameShort: dict.common.companyNameShort,
            themeToggle: dict.common.themeToggle,
            menu: dict.common.menu,
          },
        }}
      />
      <main>
        <Hero dictionary={dict.hero} />
        <Services dictionary={dict.services} />
        <AboutUs dictionary={dict.aboutUs} />
        <Gallery dictionary={{ ...dict.gallery, companyNameShort: dict.common.companyNameShort }} />
        <Contact dictionary={dict.contact} />
      </main>
      <Footer locale={locale} dictionary={dict} cities={cities} />
      <CookieConsent dictionary={dict.cookieConsent} />
      <Toaster />
    </ThemeProvider>
  )
}

