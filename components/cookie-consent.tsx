"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { buttonVariants } from "@/components/ui/button-variants"

interface Dictionary {
  title: string;
  description: string;
  necessaryOnly: string;
  acceptAll: string;
  close: string;
}

export function CookieConsent({ dictionary }: { dictionary: Dictionary }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const checkCookieConsent = () => {
      const consent = localStorage.getItem("cookie-consent")
      if (!consent) {
        setIsVisible(true)
      }
    }

    checkCookieConsent()
  }, [])

  const acceptNecessary = () => {
    localStorage.setItem("cookie-consent", "necessary")
    setIsVisible(false)
  }

  if (!isVisible || !dictionary) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-background border-t shadow-lg">
      <div className="container flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1 pr-8">
          <h3 className="text-lg font-semibold mb-2">{dictionary.title}</h3>
          <p className="text-muted-foreground">{dictionary.description}</p>
        </div>

        <button
          className={buttonVariants({
            variant: "ghost",
            size: "icon",
            className: "absolute right-4 top-4 md:relative md:right-0 md:top-0",
          })}
          onClick={acceptNecessary}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">{dictionary.close}</span>
        </button>
      </div>
    </div>
  )
}