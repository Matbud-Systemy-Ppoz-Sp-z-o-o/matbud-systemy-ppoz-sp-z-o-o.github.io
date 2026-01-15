import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { getDictionary } from "@/lib/dictionaries"
import Hero from "@/components/hero"

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

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params)
  const locale = resolvedParams.locale
  const dict = await getDictionary(locale)
  
  const title = `${dict.common.companyName} | ${dict.common.pageTitle}`
  const description = dict.common.pageDescription
  
  return {
    title,
    description,
    keywords: dict.common.keywords,
    openGraph: {
      title,
      description,
      type: "website",
      locale: locale === "pl" ? "pl_PL" : "en_US",
      url: "https://matbud.net",
      siteName: dict.common.siteName,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export default async function Home({
  params,
}: {
  params: { locale: string }
}) {
  const resolvedParams = await Promise.resolve(params)
  const locale = resolvedParams.locale
  const dict = await getDictionary(locale)
  
  return (
    <>
      <Hero dictionary={dict.hero} />
      <Services dictionary={dict.services} />
      <AboutUs dictionary={dict.aboutUs} />
      <Gallery dictionary={dict.gallery} />
      <Contact dictionary={dict.contact} />
    </>
  )
}