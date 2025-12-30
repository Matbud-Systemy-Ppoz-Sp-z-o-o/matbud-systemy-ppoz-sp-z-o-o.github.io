"use client"

import Link from "next/link"
import { MapPin } from "lucide-react"
import type { City } from "@/lib/cities"

interface Dictionary {
  title: string
  subtitle: string
}

interface CitiesProps {
  cities: City[]
  locale: string
  dictionary: Dictionary
}

export default function Cities({ cities, locale, dictionary }: CitiesProps) {
  // Group cities alphabetically
  const groupedCities = cities.reduce((acc, city) => {
    const firstLetter = city.name.charAt(0).toUpperCase()
    if (!acc[firstLetter]) {
      acc[firstLetter] = []
    }
    acc[firstLetter].push(city)
    return acc
  }, {} as Record<string, City[]>)

  const sortedGroups = Object.keys(groupedCities).sort()

  return (
    <section id="cities" className="py-16 md:py-24 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">{dictionary.title}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{dictionary.subtitle}</p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedGroups.map((letter) => (
              <div key={letter} className="space-y-3">
                <h3 className="text-lg font-semibold text-primary border-b border-border pb-2">
                  {letter}
                </h3>
                <ul className="space-y-2">
                  {groupedCities[letter]
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((city) => (
                      <li key={city.slug}>
                        <Link
                          href={`/${locale}/${city.slug}`}
                          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                        >
                          <MapPin className="h-4 w-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                          <span>{city.name}</span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

