"use client"

import type { RefObject } from "react"
import Link from "next/link"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import type { MobileMenuDictionary } from "@/components/mobile-menu"

export default function MobileMenuSheet({
  locale,
  dictionary,
  open,
  onOpenChange,
  triggerRef,
}: {
  locale: string
  dictionary: MobileMenuDictionary
  open: boolean
  onOpenChange: (open: boolean) => void
  triggerRef: RefObject<HTMLButtonElement | null>
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        // The trigger lives outside the lazily loaded Sheet, so return focus to it by hand.
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          triggerRef.current?.focus()
        }}
      >
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
          <Link href={`/${locale}/blog`} className="text-lg font-medium transition-colors hover:text-primary">
            {dictionary.navigation.blog}
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
