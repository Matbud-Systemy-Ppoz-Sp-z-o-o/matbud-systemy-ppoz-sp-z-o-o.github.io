import type { Metadata } from "next"
import { getDictionary } from "@/lib/dictionaries"
import { generateMetadata as generateSEOMetadata } from "@/lib/seo"
import { StructuredData } from "@/components/structured-data"
import Hero from "@/components/hero"
import Services from "@/components/services"
import AboutUs from "@/components/about-us"
import Gallery from "@/components/gallery"
import Contact from "@/components/contact"
import LatestBlogs from "@/components/latest-blogs"

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
      <LatestBlogs locale={locale} dictionary={dict.latestBlogs} />
      <Contact dictionary={dict.contact} />
    </>
  )
}