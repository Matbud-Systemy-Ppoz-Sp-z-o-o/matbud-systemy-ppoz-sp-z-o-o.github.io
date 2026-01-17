import type React from "react"
import type { Metadata } from "next"
import { getDictionary } from "@/lib/dictionaries"
import { i18n } from "@/lib/i18n-config"
import { generateMetadata as generateSEOMetadata } from "@/lib/seo"
import { StructuredData } from "@/components/structured-data"

import "@/app/globals.css"

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary(i18n.defaultLocale)
  
  const baseMetadata = generateSEOMetadata({
    title: dict.common.defaultTitle,
    description: dict.common.defaultDescription,
    keywords: dict.common.keywords,
    locale: i18n.defaultLocale,
    path: "",
    type: "website",
  })
  
  return {
    ...baseMetadata,
    title: {
      default: dict.common.defaultTitle,
      template: dict.common.titleTemplate,
    },
    authors: [{ name: dict.common.companyName }],
    creator: dict.common.companyName,
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://matbud.net" />
        <link rel="dns-prefetch" href="https://maps.googleapis.com" />
        <link rel="preconnect" href="https://matbud.net" crossOrigin="anonymous" />
        <link
          rel="preload"
          href="https://matbud.net/images/gallery/hero.webp"
          as="image"
          fetchPriority="high"
        />
        <link
          rel="preload"
          href="/logo_pelne_tlo_w_tarczy.svg"
          as="image"
          fetchPriority="high"
        />
        <StructuredData type="organization" />
        <StructuredData type="website" />
      </head>
      <body>{children}</body>
    </html>
  )
}

