"use client"

import { useRef, useState } from "react"
import dynamic from "next/dynamic"
import { Menu } from "lucide-react"
import { buttonVariants } from "@/components/ui/button-variants"

const loadMobileMenuSheet = () => import("@/components/mobile-menu-sheet")

// The trigger is server-rendered (no layout shift); the Sheet and its Radix Dialog dependency
// are only downloaded when the menu is about to be opened.
const MobileMenuSheet = dynamic(loadMobileMenuSheet, { ssr: false })

export interface MobileMenuDictionary {
  navigation: {
    services: string;
    about: string;
    contact: string;
    careers: string;
    blog: string;
  };
  common: {
    menu: string;
  };
}

export default function MobileMenu({ locale, dictionary }: { locale: string; dictionary: MobileMenuDictionary }) {
  const [open, setOpen] = useState(false)
  const [sheetMounted, setSheetMounted] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <button
        ref={triggerRef}
        className={buttonVariants({ variant: "outline", size: "icon", className: "md:hidden" })}
        aria-label={dictionary.common.menu}
        aria-haspopup="dialog"
        aria-expanded={open}
        onPointerEnter={loadMobileMenuSheet}
        onTouchStart={loadMobileMenuSheet}
        onClick={() => {
          setSheetMounted(true)
          setOpen(true)
        }}
      >
        <Menu className="h-5 w-5" />
      </button>
      {sheetMounted && (
        <MobileMenuSheet
          locale={locale}
          dictionary={dictionary}
          open={open}
          onOpenChange={setOpen}
          triggerRef={triggerRef}
        />
      )}
    </>
  )
}
