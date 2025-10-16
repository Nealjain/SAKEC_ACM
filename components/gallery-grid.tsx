"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import Lightbox from "./lightbox"
import type { GalleryItem } from "@/lib/gallery"

interface GalleryGridProps {
  items: GalleryItem[]
}

export default function GalleryGrid({ items }: GalleryGridProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % items.length)
  }

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No images found in this category.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item, index) => (
          <Card
            key={item.id}
            className="bg-gray-900 border-gray-800 overflow-hidden cursor-pointer group hover:border-gray-700 transition-all duration-300"
            onClick={() => openLightbox(index)}
          >
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={item.image_url || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                  <h3 className="font-semibold mb-1 text-sm">{item.title}</h3>
                  <p className="text-xs text-gray-300">{item.category}</p>
                </div>
              </div>

              {/* Category badge */}
              <div className="absolute top-2 left-2">
                <span className="px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded-full">
                  {item.category}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Lightbox
        images={items}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onNext={nextImage}
        onPrevious={previousImage}
      />
    </>
  )
}
