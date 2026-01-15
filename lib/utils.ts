import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString)
  const localeMap: Record<string, string> = {
    pl: "pl-PL",
    en: "en-US",
  }
  const intlLocale = localeMap[locale] || "pl-PL"
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }

  try {
    return date.toLocaleDateString(intlLocale, options)
  } catch {
    return date.toLocaleDateString("pl-PL", options)
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

