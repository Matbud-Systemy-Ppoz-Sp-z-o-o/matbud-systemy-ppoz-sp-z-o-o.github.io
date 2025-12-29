"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog"

interface ImageData {
  title: string;
  description: string;
}

interface DictionaryType {
  title: string;
  subtitle: string;
  images: ImageData[];
  navigation: {
    previous: string;
    next: string;
  };
}

export default function Gallery({ dictionary }: { dictionary: DictionaryType }) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const galleryImages = [
    {
      src: "https://matbud.net/images/gallery/SSP.jpeg",
      alt: "Fire Alarm System Installation",
      title: dictionary.images[0].title,
      description: dictionary.images[0].description,
    },
    {
      src: "https://matbud.net/images/gallery/smokedamper.jpeg",
      alt: "Natural Smoke Extraction Systems",
      title: dictionary.images[1].title,
      description: dictionary.images[1].description,
    },
    {
      src: "https://matbud.net/images/gallery/smokedetector.jpeg",
      alt: "Mechanical Smoke Extraction Systems",
      title: dictionary.images[2].title,
      description: dictionary.images[2].description,
    },
    {
      src: "https://matbud.net/images/gallery/EvacuationLights.jpeg",
      alt: "Emergency Evacuation Lighting",
      title: dictionary.images[3].title,
      description: dictionary.images[3].description,
    },
    {
      src: "https://matbud.net/images/gallery/firedoors.jpeg",
      alt: "Fire Doors Installation",
      title: dictionary.images[4].title,
      description: dictionary.images[4].description,
    },
    {
      src: "https://matbud.net/images/gallery/sound.jpeg",
      alt: "Sound Warning Systems DSO",
      title: dictionary.images[5].title,
      description: dictionary.images[5].description,
    },
  ]

  const handlePrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? galleryImages.length - 1 : selectedImage - 1)
    }
  }

  const handleNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === galleryImages.length - 1 ? 0 : selectedImage + 1)
    }
  }

  return (
    <section id="gallery" className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-foreground">{dictionary.title}</h2>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">{dictionary.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg group"
              onClick={() => setSelectedImage(index)}
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                style={image.src?.includes('sound.jpeg') ? { objectPosition: '100% center' } : {}}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <h3 className="text-white font-semibold text-lg">{image.title}</h3>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={selectedImage !== null} onOpenChange={(open) => !open && setSelectedImage(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none" aria-labelledby="gallery-dialog-title">
            <DialogTitle className="sr-only">
              {dictionary.title}
            </DialogTitle>
            <div className="relative bg-background/95 backdrop-blur-sm p-2 rounded-lg border border-border/50">
              {selectedImage !== null && (
                <>
                  <div className="relative h-[80vh] max-h-[600px]">
                    <Image
                      src={galleryImages[selectedImage].src || "/placeholder.svg"}
                      alt={galleryImages[selectedImage].alt}
                      fill
                      className="object-contain"
                    />

                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background border border-border/50 shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePrevious()
                      }}
                    >
                      <ChevronLeft className="h-8 w-8" />
                      <span className="sr-only">{dictionary.navigation.previous}</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background border border-border/50 shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleNext()
                      }}
                    >
                      <ChevronRight className="h-8 w-8" />
                      <span className="sr-only">{dictionary.navigation.next}</span>
                    </Button>
                  </div>

                  <div className="p-4 bg-background/50 backdrop-blur-sm rounded-b-lg">
                    <h3 className="text-xl font-semibold mb-2 text-foreground">{galleryImages[selectedImage].title}</h3>
                    <p className="text-foreground/80">{galleryImages[selectedImage].description}</p>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}

