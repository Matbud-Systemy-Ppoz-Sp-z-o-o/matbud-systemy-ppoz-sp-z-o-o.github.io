"use client"

import Image from "next/image"
import { useEffect, useState, useRef, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Testimonial {
  quote: string
  name: string
  position: string
}

interface Dictionary {
  title: string
  subtitle: string
  testimonials: Testimonial[]
  clientLogoAlt: string
  companyLogoAlt: string
  navigation: {
    previous: string
    next: string
  }
}

export default function Clients({ dictionary }: { dictionary: Dictionary }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const slideRef = useRef<HTMLDivElement>(null)

  const clients = [
    { logo: "/logo.svg", name: "Client 1", testimonial: dictionary.testimonials[0] },
    { logo: "/logo.svg", name: "Client 2", testimonial: dictionary.testimonials[1] },
    { logo: "/logo.svg", name: "Client 3", testimonial: dictionary.testimonials[2] },
    { logo: "/logo.svg", name: "Client 4", testimonial: dictionary.testimonials[3] },
    { logo: "/logo.svg", name: "Client 5", testimonial: dictionary.testimonials[4] },
  ]

  const totalSlides = clients.length

  const handlePrevious = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))
  }

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1))
  }, [totalSlides])

  useEffect(() => {
    if (slideRef.current) {
      slideRef.current.style.transform = `translateX(-${currentSlide * 100}%)`
    }
  }, [currentSlide])

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext()
    }, 5000)

    return () => clearInterval(interval)
  }, [currentSlide, handleNext])

  return (
    <section id="clients" className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">{dictionary.title}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{dictionary.subtitle}</p>
        </div>

        <div className="relative overflow-hidden">
          <div ref={slideRef} className="flex transition-transform duration-500 ease-in-out">
            {clients.map((client, index) => (
              <div key={index} className="w-full flex-shrink-0 px-4 md:px-12">
                <div className="bg-muted/50 rounded-lg p-6 md:p-8 flex flex-col items-center text-center">
                  <div className="relative w-24 h-24 mb-6">
                    <Image src={client.logo || "https://matbud.net/placeholder.svg"} alt={dictionary.clientLogoAlt} fill className="object-contain" />
                  </div>
                  <blockquote className="mb-4 text-lg italic">&quot;{client.testimonial.quote}&quot;</blockquote>
                  <div>
                    <p className="font-semibold">{client.testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{client.testimonial.position}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">{dictionary.navigation.previous}</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
            onClick={handleNext}
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">{dictionary.navigation.next}</span>
          </Button>
        </div>

        <div className="flex justify-center mt-6 gap-2">
          {clients.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${index === currentSlide ? "bg-primary" : "bg-muted-foreground/30"}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-8">
          {clients.map((client, index) => (
            <div key={index} className="flex justify-center">
              <div className="relative w-24 h-24">
                <Image
                  src={client.logo || "https://matbud.net/placeholder.svg"}
                  alt={dictionary.companyLogoAlt}
                  fill
                  className="object-contain grayscale hover:grayscale-0 transition-all"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
