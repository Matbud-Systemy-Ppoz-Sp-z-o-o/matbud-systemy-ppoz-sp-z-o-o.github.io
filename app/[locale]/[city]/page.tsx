import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionaries";
import { getCities } from "@/lib/cities";
import { Shield, Bell, Droplets, FileCheck, Wrench, Building, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import GoogleMaps from "@/components/google-maps";

// Type definition for the specific route parameters
type CityParams = {
  locale: string;
  city: string;
};

// Interface for page props
interface PageProps {
  params: Promise<{ locale: string; city: string }>;
}

// Disable dynamic params - only allow pre-generated routes
export const dynamicParams = false;

// Generates static paths for all city pages during the build
export async function generateStaticParams(): Promise<CityParams[]> {
  const cities = await getCities();
  const locales = ["pl", "en"];

  // Handle case where cities might be undefined or empty
  // Return at least one placeholder to satisfy Next.js static export requirements
  if (!cities || cities.length === 0) {
    // Return a placeholder that will trigger 404 (cities are disabled)
    return [{ locale: "pl", city: "placeholder" }];
  }

  // Create paths for each locale and city combination
  return locales.flatMap(locale =>
    cities.map(city => ({
      locale,
      city: city.slug
    }))
  );
}

// Generates metadata (like title, description) for each city page
// Uses the PageProps interface to satisfy Next.js type constraints
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const cities = await getCities();
  const { city } = await params;

  // Find the specific city data based on the slug from params
  const cityData = cities.find(c => c.slug === city);

  // Handle case where city data is not found
  if (!cityData) {
    return {
      title: "City Not Found",
    };
  }

  // Return dynamic metadata based on the city data
  const title = `Systemy Przeciwpożarowe w ${cityData.name} | Instalacja i Serwis PPOŻ | Matbud Systemy Ppoż`;
  const description = `Profesjonalne systemy przeciwpożarowe ${cityData.conjugation}. Instalacja, konserwacja i serwis systemów sygnalizacji pożaru (SSP), oddymiania, oświetlenia awaryjnego. Certyfikowani technicy, audyty zgodności. Serwis 24/7 w ${cityData.name} i okolicach.`;
  
  return {
    title,
    description,
    keywords: [
      `systemy przeciwpożarowe ${cityData.name}`,
      `ochrona przeciwpożarowa ${cityData.name}`,
      `instalacje ppoż ${cityData.name}`,
      `serwis systemów przeciwpożarowych ${cityData.name}`,
      `systemy sygnalizacji pożaru ${cityData.name}`,
      `oddymianie ${cityData.name}`,
      `oświetlenie awaryjne ${cityData.name}`,
      `konserwacja ppoż ${cityData.name}`,
      `audyt przeciwpożarowy ${cityData.name}`,
      `certyfikacja ppoż ${cityData.name}`,
    ],
    openGraph: {
      title,
      description,
      type: "website",
      locale: "pl_PL",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// The main page component - this is an async Server Component
// Uses the PageProps interface to satisfy Next.js type constraints
export default async function CityPage({ params }: PageProps) {
  const { locale, city } = await params;

  // Fetch dictionary and city data concurrently
  const [dict, cities] = await Promise.all([
    getDictionary(locale),
    getCities(locale)
  ]);

  // Find the specific city data using the slug
  const cityData = cities.find(c => c.slug === city);

  // If no city data is found for the given slug, render the 404 page
  if (!cityData) {
    notFound();
  }

  // Helper function to replace {city} placeholder in dictionary strings
  const replaceCity = (text: string | undefined): string => {
    // Handle potential undefined text gracefully
    if (text === undefined) return "";
    return text.replace(/{city}/g, cityData.conjugation);
  };

  // Helper function to trim text to a certain number of words
  function trimWords(text: string | undefined, maxWords: number): string {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > maxWords ? words.slice(0, maxWords).join(" ") + "..." : text;
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-dark to-primary dark:from-black/70 dark:via-black/50 dark:to-black/30 py-16 md:py-24 text-white">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight">
                {replaceCity(dict.cityPage?.title)}
              </h1>
              <p className="text-xl">{replaceCity(dict.cityPage?.intro)}</p>
              <div className="pt-4">
                <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100">
                  <Link href="#contact-form">
                    {replaceCity(dict.cityPage?.ctaButton)}
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg">
              <Image
                src="https://matbud.net/images/gallery/cities.jpeg"
                alt={`Profesjonalne systemy przeciwpożarowe i instalacje PPOŻ w ${cityData.name} - Matbud Systemy Ppoż`}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              {replaceCity(dict.cityPage?.servicesTitle)}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {replaceCity(dict.cityPage?.servicesDescription)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {dict.services.services.map((service, index) => {
              const serviceIcons = [
                { icon: <Shield className="h-10 w-10 text-primary" />, name: "Fire Alarm Systems" },
                { icon: <Droplets className="h-10 w-10 text-primary" />, name: "Sprinkler Systems" },
                { icon: <Bell className="h-10 w-10 text-primary" />, name: "Emergency Lighting" },
                { icon: <FileCheck className="h-10 w-10 text-primary" />, name: "Fire Safety Inspections" },
                { icon: <Wrench className="h-10 w-10 text-primary" />, name: "Maintenance Services" },
                { icon: <Building className="h-10 w-10 text-primary" />, name: "Building Compliance" },
              ];

              return (
                <Card key={index} className="border-2 border-muted hover:border-primary/50 transition-colors h-full flex flex-col">
                  <CardHeader className="flex-shrink-0">
                    <div className="mb-4">{serviceIcons[index].icon}</div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <CardDescription className="text-sm">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm flex-1">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex}>{feature}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-lg text-muted-foreground italic max-w-3xl mx-auto">
              {dict.services.closingMessage}
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-20 bg-muted/50">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
             <h2 className="text-3xl font-bold mb-6">
                {replaceCity(dict.cityPage?.whyChooseTitle)}
             </h2>
             <p className="text-lg mb-12 text-muted-foreground">{replaceCity(dict.cityPage?.whyChooseDescription)}</p>

             <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
                {/* Stat 1: Experience */}
                <div className="bg-card p-6 rounded-lg shadow-sm text-center border">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary/20">
                    {/* Dynamically use value from dictionary if available */}
                    <span className="text-primary text-2xl font-bold">{dict.aboutUs?.stats?.[0]?.value ?? '25+'}</span>
                  </div>
                  <h3 className="font-semibold mb-1">{dict.aboutUs?.stats?.[0]?.label ?? 'Lat Doświadczenia'}</h3>
                </div>

                {/* Stat 2: Completed Projects */}
                <div className="bg-card p-6 rounded-lg shadow-sm text-center border">
                   <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary/20">
                     <span className="text-primary text-xl font-bold">5,000+</span>
                   </div>
                   <h3 className="font-semibold mb-1">{dict.aboutUs?.stats?.[1]?.label ?? 'Zrealizowanych projektów'}</h3>
                 </div>

                {/* Stat 3: Support */}
                <div className="bg-card p-6 rounded-lg shadow-sm text-center border">
                   <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary/20">
                      <span className="text-primary text-2xl font-bold">24/7</span>
                   </div>
                   <h3 className="font-semibold mb-1">{dict.cityPage?.support ?? 'Wsparcie Techniczne'}</h3>
                 </div>
             </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-16 md:py-20">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {replaceCity(dict.cityPage?.contactTitle)}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{dict.cityPage?.contactSubtitle}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* Contact Info Side */}
              <div className="bg-card p-6 md:p-8 rounded-lg shadow-md border h-full flex flex-col">
                <h3 className="text-xl font-semibold mb-6">{dict.contact?.contactInfo?.title ?? 'Informacje Kontaktowe'}</h3>

                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-medium">{dict.contact?.contactInfo?.addressTitle ?? 'Adres Biura'}</h4>
                      <address className="not-italic text-muted-foreground">
                        Słocin 36F<br />
                        62-065 Grodzisk Wielkopolski
                      </address>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                       <h4 className="font-medium">{dict.contact?.contactInfo?.phoneTitle ?? 'Telefon'}</h4>
                       <p className="text-muted-foreground">
                         <a href="tel:+48614481028" className="hover:text-primary transition-colors duration-200">
                           +48 61 448 10 28
                         </a>
                       </p>
                     </div>
                   </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-medium">{dict.contact?.contactInfo?.emailTitle ?? 'Email'}</h4>
                      <p className="text-muted-foreground">
                        <a
                          href="mailto:matbud@m-so.pl"
                          className="hover:text-primary transition-colors duration-200"
                        >
                          matbud@m-so.pl
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div className="mt-8">
                    <h4 className="font-medium mb-4">{dict.contact?.contactInfo?.hoursTitle ?? 'Godziny Pracy'}</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex justify-between">
                        <span>{dict.contact?.contactInfo?.weekdays ?? 'Poniedziałek - Piątek'}</span>
                        <span>8:00 - 16:00</span>
                      </li>
                      <li className="flex justify-between">
                        <span>{dict.contact?.contactInfo?.saturday ?? 'Sobota'} - {dict.contact?.contactInfo?.sunday ?? 'Niedziela'}</span>
                        <span>{dict.contact?.contactInfo?.closed ?? 'Zamknięte'}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Google Maps Side */}
              <div className="h-full">
                <GoogleMaps className="h-full" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
