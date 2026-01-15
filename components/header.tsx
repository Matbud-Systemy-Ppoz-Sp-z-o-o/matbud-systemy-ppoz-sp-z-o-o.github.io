"use client"

import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"

const MobileMenu = dynamic(() => import("@/components/mobile-menu"), {
  ssr: false,
  loading: () => null,
})

interface Dictionary {
  navigation: {
    services: string;
    about: string;
    contact: string;
    careers: string;
  };
  common: {
    companyName: string;
    companyNameShort: string;
    themeToggle: string;
    menu: string;
  };
}

export function Header({ locale, dictionary }: { locale: string; dictionary: Dictionary }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <Image src="/logo.svg" alt={dictionary.common.companyName} width={40} height={40} className="h-10 w-auto" priority />
          <span className="font-bold text-xl hidden sm:inline-block">{dictionary.common.companyNameShort}</span>
        </Link>

        <nav className="hidden md:flex gap-6">
          <Link href={`/${locale}#services`} className="text-sm font-medium transition-colors hover:text-primary">
            {dictionary.navigation.services}
          </Link>
          <Link href={`/${locale}#about`} className="text-sm font-medium transition-colors hover:text-primary">
            {dictionary.navigation.about}
          </Link>
          <Link href={`/${locale}/careers`} className="text-sm font-medium transition-colors hover:text-primary">
            {dictionary.navigation.careers}
          </Link>
          <Link href={`/${locale}#contact`} className="text-sm font-medium transition-colors hover:text-primary">
            {dictionary.navigation.contact}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle dictionary={dictionary} />
          <LanguageSwitcher locale={locale} />
          <MobileMenu locale={locale} dictionary={dictionary} />
        </div>
      </div>
    </header>
  )
}
