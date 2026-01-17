"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, CheckCircle2, Sparkles, Building2, ArrowRight, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { SectionHeader } from "@/components/ui/section-header"

interface ImageData {
  title: string;
  description: string;
  detailedDescription?: string;
  features?: string[];
  benefits?: string[];
  applications?: string[];
  seoKeywords?: string;
}

interface DictionaryType {
  title: string;
  subtitle: string;
  images: ImageData[];
  navigation: {
    previous: string;
    next: string;
  };
  modal: {
    features: string;
    benefits: string;
    applications: string;
    close: string;
    learnMore: string;
  };
  companyNameShort?: string;
}

export default function Gallery({ dictionary }: { dictionary: DictionaryType }) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<'features' | 'benefits' | 'applications'>('features')

  const galleryImages = useMemo(() => [
    {
      src: "https://matbud.net/images/gallery/SSP.webp",
      alt: "Systemy Sygnalizacji Pożarowej SSP/SAP - Instalacja i serwis",
      title: dictionary.images[0].title,
      description: dictionary.images[0].description,
      data: dictionary.images[0],
    },
    {
      src: "https://matbud.net/images/gallery/smokedamper.webp",
      alt: "Systemy Oddymiania Naturalnego - Klapy dymowe i okna oddymiające",
      title: dictionary.images[1].title,
      description: dictionary.images[1].description,
      data: dictionary.images[1],
    },
    {
      src: "https://matbud.net/images/gallery/smokedetector.webp",
      alt: "Systemy Oddymiania Mechanicznego - Wentylatory oddymiające",
      title: dictionary.images[2].title,
      description: dictionary.images[2].description,
      data: dictionary.images[2],
    },
    {
      src: "https://matbud.net/images/gallery/EvacuationLights.webp",
      alt: "Oświetlenie Awaryjne i Ewakuacyjne - Systemy oświetlenia bezpieczeństwa",
      title: dictionary.images[3].title,
      description: dictionary.images[3].description,
      data: dictionary.images[3],
    },
    {
      src: "https://matbud.net/images/gallery/firedoors.webp",
      alt: "Drzwi Przeciwpożarowe - Montaż i serwis drzwi i bram przeciwpożarowych",
      title: dictionary.images[4].title,
      description: dictionary.images[4].description,
      data: dictionary.images[4],
    },
    {
      src: "https://matbud.net/images/gallery/sound.webp",
      alt: "Systemy Dźwiękowe Ostrzegawcze DSO - Instalacja i konserwacja",
      title: dictionary.images[5].title,
      description: dictionary.images[5].description,
      data: dictionary.images[5],
    },
  ], [dictionary.images])

  const handlePrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? galleryImages.length - 1 : selectedImage - 1)
      setActiveTab('features') // Reset tab when changing images
    }
  }

  const handleNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === galleryImages.length - 1 ? 0 : selectedImage + 1)
      setActiveTab('features') // Reset tab when changing images
    }
  }

  useEffect(() => {
    if (selectedImage !== null) {
      setActiveTab('features')
    }
  }, [selectedImage])

  const generateStructuredData = () => {
    if (selectedImage === null) return null
    
    const currentImage = galleryImages[selectedImage]
    const service = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": currentImage.title,
      "description": currentImage.data.detailedDescription || currentImage.description,
      "provider": {
        "@type": "Organization",
        "name": "Matbud Systemy Ppoż. Sp. z o.o.",
        "url": "https://matbud.net"
      },
      "serviceType": "Fire Safety Systems",
      "areaServed": {
        "@type": "Country",
        "name": "Poland"
      }
    }
    
    return JSON.stringify(service)
  }

  useEffect(() => {
    if (selectedImage !== null && typeof window !== 'undefined') {
      const currentImage = galleryImages[selectedImage]
      const originalTitle = document.title
      
      requestAnimationFrame(() => {
        document.title = `${currentImage.title} | ${dictionary.companyNameShort || 'Matbud Systemy Ppoż.'}`
        
        let metaDescription = document.querySelector('meta[name="description"]')
        if (!metaDescription) {
          metaDescription = document.createElement('meta')
          metaDescription.setAttribute('name', 'description')
          document.head.appendChild(metaDescription)
        }
        metaDescription.setAttribute('content', currentImage.data.detailedDescription || currentImage.description)
      })
      
      return () => {
        requestAnimationFrame(() => {
          document.title = originalTitle
        })
      }
    }
  }, [selectedImage, galleryImages, dictionary.companyNameShort])

  const currentImageData = selectedImage !== null ? galleryImages[selectedImage] : null
  const modalLabels = dictionary.modal!

  return (
    <>
      <section id="gallery" className="py-16 md:py-24">
        <div className="container">
          <SectionHeader title={dictionary.title} subtitle={dictionary.subtitle} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <article
                key={index}
                className="relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg group"
                onClick={() => setSelectedImage(index)}
                itemScope
                itemType="https://schema.org/Service"
              >
                <Image
                  src={image.src || "https://matbud.net/placeholder.svg"}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1400px) 33vw, 400px"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  style={image.src?.includes('sound.webp') ? { objectPosition: '100% center' } : {}}
                  itemProp="image"
                  loading={index < 1 ? "eager" : "lazy"}
                  quality={index < 1 ? 35 : 30}
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-white font-semibold text-lg mb-2" itemProp="name">{image.title}</h3>
                  <p className="text-white/90 text-sm line-clamp-2" itemProp="description">{image.description}</p>
                  <div className="mt-2 flex items-center text-white/80 text-sm">
                    <span>{modalLabels.learnMore}</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={selectedImage !== null} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-5xl p-0 gap-0 overflow-hidden">
          {/* Structured Data for SEO */}
          {selectedImage !== null && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: generateStructuredData() || '' }}
            />
          )}
          
          <DialogTitle className="sr-only">
            {selectedImage !== null && currentImageData 
              ? `${currentImageData.title} - ${dictionary.title}`
              : dictionary.title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {selectedImage !== null && currentImageData 
              ? (currentImageData.data.detailedDescription || currentImageData.description)
              : dictionary.subtitle}
          </DialogDescription>

          {selectedImage !== null && currentImageData && (
            <>

              <Card className="border-0 shadow-none">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Image Section - Left Side */}
                  <div className="relative h-64 md:h-[500px] bg-gradient-to-br from-muted/50 to-muted overflow-hidden">
                    <Image
                      src={currentImageData.src || "https://matbud.net/placeholder.svg"}
                      alt={currentImageData.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 500px"
                      className="object-cover"
                      priority
                      quality={35}
                      decoding="async"
                    />
                    
                    {/* Navigation Buttons */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/95 hover:bg-background border border-border shadow-lg z-10 backdrop-blur-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePrevious()
                      }}
                      aria-label={dictionary.navigation.previous}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/95 hover:bg-background border border-border shadow-lg z-10 backdrop-blur-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleNext()
                      }}
                      aria-label={dictionary.navigation.next}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Content Section - Right Side */}
                  <CardContent className="p-6 md:p-8 flex flex-col h-full max-h-[500px]">
                    {/* Header */}
                    <div className="space-y-3 mb-6">
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                        {currentImageData.title}
                      </h2>
                      <p className="text-sm text-foreground/70 leading-relaxed">
                        {currentImageData.data.detailedDescription || currentImageData.description}
                      </p>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex gap-2 mb-4 border-b border-border flex-shrink-0">
                      {currentImageData.data.features && currentImageData.data.features.length > 0 && (
                        <button
                          onClick={() => setActiveTab('features')}
                          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-[1px] ${
                            activeTab === 'features'
                              ? 'border-primary text-primary'
                              : 'border-transparent text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <Sparkles className="h-4 w-4 inline mr-2" />
                          {modalLabels.features}
                        </button>
                      )}
                      {currentImageData.data.benefits && currentImageData.data.benefits.length > 0 && (
                        <button
                          onClick={() => setActiveTab('benefits')}
                          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-[1px] ${
                            activeTab === 'benefits'
                              ? 'border-primary text-primary'
                              : 'border-transparent text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <Shield className="h-4 w-4 inline mr-2" />
                          {modalLabels.benefits}
                        </button>
                      )}
                      {currentImageData.data.applications && currentImageData.data.applications.length > 0 && (
                        <button
                          onClick={() => setActiveTab('applications')}
                          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-[1px] ${
                            activeTab === 'applications'
                              ? 'border-primary text-primary'
                              : 'border-transparent text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <Building2 className="h-4 w-4 inline mr-2" />
                          {modalLabels.applications}
                        </button>
                      )}
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-y-auto pr-2">
                      {activeTab === 'features' && currentImageData.data.features && (
                        <ul className="space-y-2.5">
                          {currentImageData.data.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-foreground/80 leading-relaxed">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {activeTab === 'benefits' && currentImageData.data.benefits && (
                        <ul className="space-y-2.5">
                          {currentImageData.data.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-foreground/80 leading-relaxed">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {activeTab === 'applications' && currentImageData.data.applications && (
                        <div className="flex flex-wrap gap-2">
                          {currentImageData.data.applications.map((application, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs py-1.5 px-3">
                              {application}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* SEO Keywords (hidden but accessible) */}
                    {currentImageData.data.seoKeywords && (
                      <div className="sr-only" aria-hidden="true">
                        <meta name="keywords" content={currentImageData.data.seoKeywords} />
                      </div>
                    )}
                  </CardContent>
                </div>
              </Card>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
