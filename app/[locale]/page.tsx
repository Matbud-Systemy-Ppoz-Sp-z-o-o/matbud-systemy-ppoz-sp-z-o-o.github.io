import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { getDictionary } from "@/lib/dictionaries"
import { generateMetadata as generateSEOMetadata } from "@/lib/seo"
import { StructuredData } from "@/components/structured-data"
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
      <StructuredData
        type="breadcrumb"
        data={[
          { name: dict.breadcrumbs.home, url: `https://matbud.net/${locale}` },
        ]}
      />
      <Hero dictionary={dict.hero} />
      <Services dictionary={dict.services} />
      <AboutUs dictionary={dict.aboutUs} />
      <Gallery dictionary={{ ...dict.gallery, companyNameShort: dict.common.companyNameShort }} />
      <Contact dictionary={dict.contact} />
    </>
  )
}