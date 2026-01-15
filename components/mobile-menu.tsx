"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"

interface Dictionary {
  navigation: {
    services: string;
    about: string;
    contact: string;
    careers: string;
  };
  common: {
    menu: string;
  };
}

export default function MobileMenu({ locale, dictionary }: { locale: string; dictionary: Dictionary }) {
  return (
    <Sheet>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="outline" size="icon" aria-label={dictionary.common.menu}>
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetTitle className="sr-only">
          {dictionary.common.menu}
        </SheetTitle>
        <div className="flex flex-col gap-6 mt-8">
          <Link href={`/${locale}#services`} className="text-lg font-medium transition-colors hover:text-primary">
            {dictionary.navigation.services}
          </Link>
          <Link href={`/${locale}#about`} className="text-lg font-medium transition-colors hover:text-primary">
            {dictionary.navigation.about}
          </Link>
          <Link href={`/${locale}/careers`} className="text-lg font-medium transition-colors hover:text-primary">
            {dictionary.navigation.careers}
          </Link>
          <Link href={`/${locale}#contact`} className="text-lg font-medium transition-colors hover:text-primary">
            {dictionary.navigation.contact}
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}
