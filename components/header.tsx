"use client"

import Link from "next/link"
import Image from "next/image"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import MobileMenu from "@/components/mobile-menu"

interface Dictionary {
  navigation: {
    services: string;
    about: string;
    contact: string;
    careers: string;
    blog: string;
  };
  common: {
    companyName: string;
    companyNameShort: string;
    themeToggle: string;
    menu: string;
  };
}

export function Header({ locale, dictionary }: { locale: string; dictionary: Dictionary }) {
  const navLink =
    "relative text-sm font-medium text-foreground/80 transition-colors hover:text-primary after:absolute after:inset-x-0 after:-bottom-1.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-200 hover:after:scale-x-100"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-2 rounded-sm">
          <Image src="/logo.svg" alt={dictionary.common.companyName} width={37} height={40} priority />
          <span className="font-display font-bold text-xl tracking-tight hidden sm:inline-block">{dictionary.common.companyNameShort}</span>
        </Link>

        <nav className="hidden md:flex gap-7">
          <Link href={`/${locale}#services`} className={navLink}>
            {dictionary.navigation.services}
          </Link>
          <Link href={`/${locale}#about`} className={navLink}>
            {dictionary.navigation.about}
          </Link>
          <Link href={`/${locale}/blog`} className={navLink}>
            {dictionary.navigation.blog}
          </Link>
          <Link href={`/${locale}/careers`} className={navLink}>
            {dictionary.navigation.careers}
          </Link>
          <Link href={`/${locale}#contact`} className={navLink}>
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
