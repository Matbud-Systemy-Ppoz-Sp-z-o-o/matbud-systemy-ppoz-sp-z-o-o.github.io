"use client"

import dynamic from "next/dynamic"
import { i18n } from "@/lib/i18n-config-client"

// The dropdown (and its Radix dependency) is only downloaded when there is more than one language.
const LanguageMenu = dynamic(() => import("@/components/language-menu"))

export function LanguageSwitcher({ locale }: { locale: string }) {
  if (i18n.locales.length <= 1) {
    return null
  }

  return <LanguageMenu locale={locale} />
}
