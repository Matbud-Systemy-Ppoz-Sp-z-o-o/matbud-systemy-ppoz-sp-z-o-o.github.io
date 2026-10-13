"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  attribute?: string
}

const initialState: {
  theme: Theme
  setTheme: (theme: Theme) => void
} = {
  theme: "dark",
  setTheme: () => null,
}

const ThemeProviderContext = createContext(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  attribute = "class",
  ...props
}: ThemeProviderProps) {
  // Read the stored theme synchronously on the client. No markup depends on
  // `theme` (the toggle uses `dark:` classes), so this can't cause a hydration mismatch.
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme
    const storedTheme = localStorage.getItem("theme") as Theme
    return storedTheme && ["light", "dark", "system"].includes(storedTheme) ? storedTheme : "dark"
  })

  useEffect(() => {
    // Use requestAnimationFrame to batch DOM updates and avoid forced reflows
    const frameId = requestAnimationFrame(() => {
      const root = window.document.documentElement

      // Determine the theme to apply
      const themeToApply = theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches 
          ? "dark" 
          : "light"
        : theme

      // Batch DOM updates to avoid forced reflows
      if (attribute === "class") {
        root.classList.remove("light", "dark")
        root.classList.add(themeToApply)
      } else {
        root.removeAttribute(attribute)
        root.setAttribute(attribute, themeToApply)
      }
    })

    return () => cancelAnimationFrame(frameId)
  }, [theme, attribute])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme)
      // Persist theme to localStorage
      localStorage.setItem("theme", newTheme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
