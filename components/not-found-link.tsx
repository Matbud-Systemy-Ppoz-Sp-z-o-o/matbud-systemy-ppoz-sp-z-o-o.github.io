"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { i18n } from "@/lib/i18n-config-client"

interface NotFoundLinkProps {
  children: React.ReactNode
  className?: string
  fallbackLocale?: string
}

export function NotFoundLink({ children, className, fallbackLocale }: NotFoundLinkProps) {
  const pathname = usePathname()
  
  // Extract locale from pathname
  let locale = fallbackLocale || i18n.defaultLocale
  if (pathname) {
    const pathMatch = pathname.match(/^\/(pl|en)(?:\/|$)/)
    if (pathMatch) {
      locale = pathMatch[1]
    }
  }
  
  // Ensure locale is valid
  if (!i18n.locales.includes(locale as any)) {
    locale = i18n.defaultLocale
  }
  
  return (
    <Link href={`/${locale}`} className={className}>
      {children}
    </Link>
  )
}

