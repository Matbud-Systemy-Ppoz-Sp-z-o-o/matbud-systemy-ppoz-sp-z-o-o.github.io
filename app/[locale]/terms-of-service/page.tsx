import type { Metadata } from "next"
import { getDictionary } from "@/lib/dictionaries"
import { generateMetadata as generateSEOMetadata } from "@/lib/seo"
import { StructuredData } from "@/components/structured-data"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const locale = resolvedParams.locale
  const dict = await getDictionary(locale)
  
  return generateSEOMetadata({
    title: `${dict.termsOfService.title} | ${dict.common.companyName}`,
    description: dict.termsOfService.introduction,
    locale,
    path: "terms-of-service",
    type: "website",
  })
}

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function TermsOfServicePage({ params }: PageProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale
  
  const dict = await getDictionary(locale)

  return (
    <section className="container py-12 md:py-24">
      <StructuredData
        type="breadcrumb"
        data={[
          { name: dict.breadcrumbs.home, url: `https://matbud.net/${locale}` },
          { name: dict.termsOfService.title, url: `https://matbud.net/${locale}/terms-of-service` },
        ]}
      />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">{dict.termsOfService.title}</h1>
          <p className="text-muted-foreground">
            {dict.termsOfService.lastUpdated}: {dict.termsOfService.lastUpdatedDate}
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-card border rounded-lg p-6 md:p-8">
          <p className="text-lg leading-relaxed text-muted-foreground">{dict.termsOfService.introduction}</p>
        </div>
      </div>
    </section>
  )
} 