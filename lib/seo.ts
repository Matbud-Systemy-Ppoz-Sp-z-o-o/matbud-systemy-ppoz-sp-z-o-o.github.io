import { Metadata } from "next"
import { i18n } from "./i18n-config"

export const baseUrl = "https://matbud.net"

export interface SEOConfig {
  title: string
  description: string
  keywords?: string | string[]
  locale?: string
  path?: string
  image?: string
  type?: "website" | "article"
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  noindex?: boolean
  nofollow?: boolean
}

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords,
    locale = i18n.defaultLocale,
    path = "",
    image,
    type = "website",
    publishedTime,
    modifiedTime,
    authors,
    noindex = false,
    nofollow = false,
  } = config

  const url = `${baseUrl}/${locale}${path ? `/${path}` : ""}`.replace(/\/+/g, "/")
  const ogImage = image || `${baseUrl}/logo_pelne_tlo_w_tarczy.svg`

  // Generate alternate language URLs
  const alternates: { languages?: Record<string, string> } = {}
  if (i18n.locales.length > 1) {
    alternates.languages = {}
    i18n.locales.forEach((loc) => {
      const altPath = path ? `/${path}` : ""
      alternates.languages![loc] = `${baseUrl}/${loc}${altPath}`.replace(/\/+/g, "/")
    })
  }

  const metadata: Metadata = {
    title,
    description,
    keywords: Array.isArray(keywords) ? keywords.join(", ") : keywords,
    alternates: {
      canonical: url,
      ...alternates,
    },
    openGraph: {
      type: type === "article" ? "article" : "website",
      locale: locale === "pl" ? "pl_PL" : "en_US",
      url,
      title,
      description,
      siteName: "Matbud - Systemy Ppoż Sp. z o.o.",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        authors: authors || [],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      // Add verification codes here when available
      // google: "your-google-verification-code",
      // yandex: "your-yandex-verification-code",
      // bing: "your-bing-verification-code",
    },
  }

  return metadata
}

// Structured Data Generators
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Matbud Systemy Ppoż. Sp. z o.o.",
    alternateName: "Matbud Systemy Ppoż.",
    url: baseUrl,
    logo: `${baseUrl}/logo_pelne_tlo_w_tarczy.svg`,
    description:
      "Profesjonalne systemy przeciwpożarowe, instalacja SSP, oddymianie, oświetlenie awaryjne. Serwis, konserwacja i audyty PPOŻ w całej Polsce.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Słocin 36F",
      addressLocality: "Grodzisk Wielkopolski",
      postalCode: "62-065",
      addressCountry: "PL",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+48-61-448-10-28",
      contactType: "customer service",
      email: "matbud@m-so.pl",
      areaServed: "PL",
      availableLanguage: ["Polish"],
    },
    sameAs: [
      // Add social media profiles when available
      // "https://www.facebook.com/matbud",
      // "https://www.linkedin.com/company/matbud",
    ],
    foundingDate: "1993",
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      value: "10-50",
    },
  }
}

export function generateLocalBusinessSchema(locale: string = "pl") {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/#organization`,
    name: "Matbud Systemy Ppoż. Sp. z o.o.",
    image: `${baseUrl}/logo_pelne_tlo_w_tarczy.svg`,
    description:
      locale === "pl"
        ? "Profesjonalne systemy przeciwpożarowe, instalacja SSP, oddymianie, oświetlenie awaryjne. Serwis, konserwacja i audyty PPOŻ w całej Polsce."
        : "Professional fire protection systems, SSP installation, smoke extraction, emergency lighting. Service, maintenance and PPOŻ audits throughout Poland.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Słocin 36F",
      addressLocality: "Grodzisk Wielkopolski",
      postalCode: "62-065",
      addressCountry: "PL",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 52.2276,
      longitude: 16.3654,
    },
    telephone: "+48-61-448-10-28",
    email: "matbud@m-so.pl",
    url: baseUrl,
    priceRange: "$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "16:00",
      },
    ],
    areaServed: {
      "@type": "Country",
      name: "Poland",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Fire Protection Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Systemy Sygnalizacji Pożaru (SSP)",
            description: "Instalacja i serwis systemów sygnalizacji pożaru",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Systemy Oddymiania",
            description: "Instalacja i serwis systemów oddymiania",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Oświetlenie Awaryjne",
            description: "Instalacja i serwis oświetlenia awaryjnego",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Konserwacja Systemów PPOŻ",
            description: "Regularna konserwacja i serwis systemów przeciwpożarowych",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Audyty Przeciwpożarowe",
            description: "Profesjonalne audyty bezpieczeństwa przeciwpożarowego",
          },
        },
      ],
    },
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateArticleSchema(
  title: string,
  description: string,
  url: string,
  image: string,
  publishedTime: string,
  modifiedTime?: string,
  author?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: image,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      "@type": "Organization",
      name: author || "Matbud Systemy Ppoż. Sp. z o.o.",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Matbud Systemy Ppoż. Sp. z o.o.",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo_pelne_tlo_w_tarczy.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  }
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Matbud - Systemy Ppoż Sp. z o.o.",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}
