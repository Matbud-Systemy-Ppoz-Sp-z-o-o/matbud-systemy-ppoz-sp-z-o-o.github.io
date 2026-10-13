"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import dynamic from "next/dynamic"
import { ArrowRight } from "lucide-react"
import { SectionHeader } from "@/components/ui/section-header"

const loadGalleryDialog = () => import("@/components/gallery-dialog")

// The dialog isn't needed for first paint: prefetch it when the pointer reaches the grid.
const GalleryDialog = dynamic(loadGalleryDialog, { ssr: false })

interface ImageData {
  title: string;
  description: string;
  detailedDescription?: string;
  features?: string[];
  benefits?: string[];
  applications?: string[];
  seoKeywords?: string;
}

export interface GalleryDictionary {
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

export type GalleryImage = {
  src: string;
  alt: string;
  title: string;
  description: string;
  data: ImageData;
}

export default function Gallery({ dictionary }: { dictionary: GalleryDictionary }) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  // Mount the dialog on first open and keep it mounted so its close animation still plays.
  const [dialogMounted, setDialogMounted] = useState(false)

  const galleryImages = useMemo<GalleryImage[]>(() => [
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

  const modalLabels = dictionary.modal

  const openImage = (index: number) => {
    setDialogMounted(true)
    setSelectedImage(index)
  }

  return (
    <>
      <section id="gallery" className="py-16 md:py-24">
        <div className="container">
          <SectionHeader title={dictionary.title} subtitle={dictionary.subtitle} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" onPointerEnter={loadGalleryDialog}>
            {galleryImages.map((image, index) => (
              <article
                key={index}
                className="relative aspect-4/3 cursor-pointer overflow-hidden rounded-xl ring-1 ring-border transition-shadow duration-300 hover:shadow-lg group"
                onClick={() => openImage(index)}
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
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
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

      {dialogMounted && (
        <GalleryDialog
          dictionary={dictionary}
          galleryImages={galleryImages}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
      )}
    </>
  )
}
