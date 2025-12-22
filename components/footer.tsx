"use client"

import Link from "next/link"
import Image from "next/image"
import type { City } from "@/lib/cities"

// Define a type for the dictionary prop
interface Dictionary {
  footer: {
    description: string
    quickLinks: string
    locations: string
    contact: string
    allRightsReserved: string
    privacyPolicy: string
    termsOfService: string
    companyLogoAlt: string
    address: string
    phone: string
    email: string
  }
  navigation: {
    services: string
    about: string
    certificates: string
    clients: string
    blog: string
    careers: string
    contact: string
  }
  common: {
    companyName: string
    companyNameShort: string
  }
}

export function Footer({
  locale,
  dictionary,
  cities,
}: {
  locale: string
  dictionary: Dictionary
  cities?: City[]
}) {
  // Limit to 8 cities for the footer
  // const footerCities = cities?.slice(0, 8) || []

  return (
    <footer className="bg-muted py-12 border-t">
      <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <Link href={`/${locale}`} className="flex items-center gap-2 mb-4">
            <Image src="/matbud/logo.svg" alt={dictionary.footer.companyLogoAlt} width={40} height={40} className="h-10 w-auto" />
            <span className="font-bold text-xl">{dictionary.common.companyNameShort}</span>
          </Link>
          <p className="text-muted-foreground">{dictionary.footer.description}</p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4">{dictionary.footer.quickLinks}</h3>
          <ul className="space-y-2">
            <li>
              <Link href={`/${locale}#services`} className="text-muted-foreground hover:text-primary transition-colors">
                {dictionary.navigation.services}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}#about`} className="text-muted-foreground hover:text-primary transition-colors">
                {dictionary.navigation.about}
              </Link>
            </li>
            <li>
              <Link
                href={`/${locale}#certificates`}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {dictionary.navigation.certificates}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}#clients`} className="text-muted-foreground hover:text-primary transition-colors">
                {dictionary.navigation.clients}
              </Link>
            </li>
            {/* <li>
              <Link href={`/${locale}/blog`} className="text-muted-foreground hover:text-primary transition-colors">
                {dictionary.navigation.blog}
              </Link>
            </li> */}
            <li>
              <Link href={`/${locale}/careers`} className="text-muted-foreground hover:text-primary transition-colors">
                {dictionary.navigation.careers}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}#contact`} className="text-muted-foreground hover:text-primary transition-colors">
                {dictionary.navigation.contact}
              </Link>
            </li>
          </ul>
        </div>

        {/* <div>
          <h3 className="font-semibold text-lg mb-4">{dictionary.footer.locations}</h3>
          <ul className="space-y-2">
            {footerCities.map((city) => (
              <li key={city.slug}>
                <Link
                  href={`/${locale}/${city.slug}`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {city.name}
                </Link>
              </li>
            ))}
          </ul>
        </div> */}

        <div>
          <h3 className="font-semibold text-lg mb-4">{dictionary.footer.contact}</h3>
          <address className="not-italic space-y-2 text-muted-foreground">
            <p>{dictionary.footer.address}</p>
            <p className="mt-4">
              <a href={`tel:${dictionary.footer.phone}`} className="hover:text-primary transition-colors">
                {dictionary.footer.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${dictionary.footer.email}`} className="hover:text-primary transition-colors">
                {dictionary.footer.email}
              </a>
            </p>
          </address>
        </div>
      </div>

      <div className="container mt-8 pt-8 border-t">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {dictionary.common.companyName} {dictionary.footer.allRightsReserved}
          </p>
          <div className="flex gap-4">
            <a
              href="https://matbud.net/images/rodo.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {dictionary.footer.privacyPolicy}
            </a>
            {/* <Link
              href={`/${locale}/terms-of-service`}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {dictionary.footer.termsOfService}
            </Link> */}
          </div>
        </div>
      </div>
    </footer>
  )
}

