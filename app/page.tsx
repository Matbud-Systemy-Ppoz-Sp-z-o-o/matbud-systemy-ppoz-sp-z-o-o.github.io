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
import { getCities } from "@/lib/cities"

// Shared loading component to reduce bundle size
const SectionLoader = () => (
  <div className="py-16 md:py-24">
    <div className="container">
      <div className="animate-pulse h-64 bg-muted rounded-lg" />
    </div>
  </div>
)

// Dynamically import below-the-fold components to reduce initial bundle size
const Services = dynamic(() => import("@/components/services"), {
  loading: SectionLoader,
})
const AboutUs = dynamic(() => import("@/components/about-us"), {
  loading: SectionLoader,
})
const Gallery = dynamic(() => import("@/components/gallery"), {
  loading: SectionLoader,
})
const Contact = dynamic(() => import("@/components/contact"), {
  loading: SectionLoader,
})
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
      <Header locale={locale} dictionary={dict} />
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

