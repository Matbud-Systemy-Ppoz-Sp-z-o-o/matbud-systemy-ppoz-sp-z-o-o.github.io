"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { i18n } from "@/lib/i18n-config-client"

export default function LanguageMenu({ locale }: { locale: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Remove the locale part from the pathname
  const pathnameWithoutLocale = pathname.replace(`/${locale}`, "") || "/"

  const languageNames: Record<string, string> = {
    pl: "🇵🇱 Polski",
    // en: "🇬🇧 English",
    // es: "🇪🇸 Español",
    //de: "🇩🇪 Deutsch",
    //ru: "🇷🇺 Русский",
    //cz: "🇨🇿 Česky",
    //sk: "🇸🇰 Slovenská",
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Select language">
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {i18n.locales.map((lang) => (
          <DropdownMenuItem key={lang} asChild>
            <Link
              href={`/${lang}${pathnameWithoutLocale}`}
              className={locale === lang ? "font-bold" : ""}
              onClick={() => setIsOpen(false)}
            >
              {languageNames[lang] || lang}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

