import {
  generateOrganizationSchema,
  generateLocalBusinessSchema,
  generateBreadcrumbSchema,
  generateArticleSchema,
  generateWebSiteSchema,
} from "@/lib/seo"

interface StructuredDataProps {
  type: "organization" | "localBusiness" | "breadcrumb" | "article" | "website"
  data?: any
  locale?: string
}

export function StructuredData({ type, data, locale = "pl" }: StructuredDataProps) {
  let schema: any

  switch (type) {
    case "organization":
      schema = generateOrganizationSchema()
      break
    case "localBusiness":
      schema = generateLocalBusinessSchema(locale)
      break
    case "breadcrumb":
      if (!data || !Array.isArray(data)) {
        return null
      }
      schema = generateBreadcrumbSchema(data)
      break
    case "article":
      if (!data) {
        return null
      }
      schema = generateArticleSchema(
        data.title,
        data.description,
        data.url,
        data.image,
        data.publishedTime,
        data.modifiedTime,
        data.author
      )
      break
    case "website":
      schema = generateWebSiteSchema()
      break
    default:
      return null
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
