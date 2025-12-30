import type { Metadata } from "next"
import { getDictionary } from "@/lib/dictionaries"
import Hero from "@/components/hero"
import Services from "@/components/services"
import AboutUs from "@/components/about-us"
// import Certificates from "@/components/certificates"
// import Clients from "@/components/clients"
import Gallery from "@/components/gallery"
// import LatestBlogs from "@/components/latest-blogs"
import Contact from "@/components/contact"

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params)
  const locale = resolvedParams.locale
  const dict = await getDictionary(locale)
  
  const title = `${dict.common.companyName} | ${dict.common.pageTitle}`;
  const description = dict.common.pageDescription;
  
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
      {/* <Certificates dictionary={dict.certificates} /> */}
      {/* <Clients dictionary={dict.clients} /> */}
      <Contact dictionary={dict.contact} />
      {/* <LatestBlogs locale={locale} dictionary={dict.latestBlogs} /> */}
    </>
  )
}