import type React from "react"
import type { Metadata } from "next"
import { Archivo, Inter } from "next/font/google"
import { getDictionary } from "@/lib/dictionaries"
import { i18n } from "@/lib/i18n-config"
import { generateMetadata as generateSEOMetadata } from "@/lib/seo"
import { StructuredData } from "@/components/structured-data"

import "@/app/globals.css"

// Display face — sturdy, engineered grotesk for headings/wordmark.
// latin-ext covers Polish diacritics (ą ć ę ł ń ó ś ź ż).
const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-archivo",
  display: "swap",
})

// Body face — neutral, highly legible humanist sans.
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
})

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
    <html lang="pl" className={`${archivo.variable} ${inter.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Apply the saved theme before first paint so there's no flash of the wrong theme. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");document.documentElement.classList.add(t==="light"?"light":t==="system"&&!matchMedia("(prefers-color-scheme: dark)").matches?"light":"dark")}catch(e){document.documentElement.classList.add("dark")}`,
          }}
        />
        <link rel="dns-prefetch" href="https://matbud.net" />
        <link rel="dns-prefetch" href="https://maps.googleapis.com" />
        <link rel="preconnect" href="https://matbud.net" />
        <StructuredData type="organization" />
        <StructuredData type="website" />
      </head>
      <body>{children}</body>
    </html>
  )
}

