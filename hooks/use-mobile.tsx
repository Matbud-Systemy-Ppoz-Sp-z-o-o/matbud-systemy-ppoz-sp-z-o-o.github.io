"use client"

import { useState, useEffect } from "react"

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window !== "undefined") {
      // Use matchMedia instead of innerWidth to avoid forced reflows
      const mediaQuery = window.matchMedia("(max-width: 767px)")
      
      const updateIsMobile = (e: MediaQueryList | MediaQueryListEvent) => {
        setIsMobile(e.matches)
      }

      // Initial check
      updateIsMobile(mediaQuery)

      // Use modern addEventListener API for MediaQueryList
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", updateIsMobile)
        return () => mediaQuery.removeEventListener("change", updateIsMobile)
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(updateIsMobile)
        return () => mediaQuery.removeListener(updateIsMobile)
      }
    }
  }, [])

  return isMobile
}

