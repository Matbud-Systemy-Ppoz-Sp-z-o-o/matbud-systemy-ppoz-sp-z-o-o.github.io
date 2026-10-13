"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, CheckCircle2, Sparkles, Building2, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { GalleryDictionary, GalleryImage } from "@/components/gallery"

// Split out of gallery.tsx so the dialog (and Radix Dialog) is only downloaded once a visitor opens an image.
export default function GalleryDialog({
  dictionary,
  galleryImages,
  selectedImage,
  setSelectedImage,
}: {
  dictionary: GalleryDictionary
  galleryImages: GalleryImage[]
  selectedImage: number | null
  setSelectedImage: (index: number | null) => void
}) {
  const [activeTab, setActiveTab] = useState<'features' | 'benefits' | 'applications'>('features')

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

  // The page's own title/description, saved while an image is open and put back on close.
  const pageMeta = useRef<{ title: string; description: string | null } | null>(null)

  useEffect(() => {
    let metaDescription = document.querySelector('meta[name="description"]')

    if (selectedImage === null) {
      if (pageMeta.current) {
        document.title = pageMeta.current.title
        if (pageMeta.current.description !== null) metaDescription?.setAttribute('content', pageMeta.current.description)
        pageMeta.current = null
      }
      return
    }

    pageMeta.current ??= { title: document.title, description: metaDescription?.getAttribute('content') ?? null }

    const currentImage = galleryImages[selectedImage]
    document.title = `${currentImage.title} | ${dictionary.companyNameShort || 'Matbud Systemy Ppoż.'}`

    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
    }
    metaDescription.setAttribute('content', currentImage.data.detailedDescription || currentImage.description)
  }, [selectedImage, galleryImages, dictionary.companyNameShort])

  const currentImageData = selectedImage !== null ? galleryImages[selectedImage] : null
  const modalLabels = dictionary.modal!

  return (
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
                <div className="relative h-64 md:h-[500px] bg-linear-to-br from-muted/50 to-muted overflow-hidden">
                  <Image
                    src={currentImageData.src || "https://matbud.net/placeholder.svg"}
                    alt={currentImageData.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-cover"
                    priority
                    decoding="async"
                  />
                  
                  {/* Navigation Buttons */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/95 hover:bg-background border border-border shadow-lg z-10 backdrop-blur-xs"
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/95 hover:bg-background border border-border shadow-lg z-10 backdrop-blur-xs"
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
                  <div className="flex gap-2 mb-4 border-b border-border shrink-0">
                    {currentImageData.data.features && currentImageData.data.features.length > 0 && (
                      <button
                        onClick={() => setActiveTab('features')}
                        className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
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
                        className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
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
                        className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
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
                            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                            <span className="text-sm text-foreground/80 leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {activeTab === 'benefits' && currentImageData.data.benefits && (
                      <ul className="space-y-2.5">
                        {currentImageData.data.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <Zap className="h-4 w-4 text-primary mt-0.5 shrink-0" />
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
  )
}
