import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { getDictionary } from "@/lib/dictionaries"
import { i18n } from "@/lib/i18n-config"

import "@/app/globals.css"

const inter = Inter({ subsets: ["latin"] })

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary(i18n.defaultLocale)
  
  return {
    title: {
      default: dict.common.defaultTitle,
      template: dict.common.titleTemplate,
    },
    description: dict.common.defaultDescription,
    keywords: dict.common.keywords,
    authors: [{ name: dict.common.companyName }],
    creator: dict.common.companyName,
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },
    openGraph: {
      type: "website",
      locale: "pl",
      url: "https://matbud.net",
      title: dict.common.defaultTitle,
      description: dict.common.defaultDescription,
      siteName: dict.common.siteName,
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
        <link
          rel="preload"
          href="https://matbud.net/images/gallery/hero.jpeg"
          as="image"
          fetchPriority="high"
        />
        <link
          rel="preload"
          href="/logo_pelne_tlo_w_tarczy.svg"
          as="image"
          fetchPriority="high"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}

