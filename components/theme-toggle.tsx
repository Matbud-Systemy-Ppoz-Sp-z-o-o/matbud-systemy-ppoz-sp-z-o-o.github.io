"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { buttonVariants } from "@/components/ui/button-variants"

interface ThemeToggleProps {
  dictionary: {
    common: {
      themeToggle: string
    }
  }
}

export function ThemeToggle({ dictionary }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()

  return (
    <button className={buttonVariants({ variant: "ghost", size: "icon" })} onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">{dictionary.common.themeToggle}</span>
    </button>
  )
}

