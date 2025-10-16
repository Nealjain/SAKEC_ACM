"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { CarouselImage, fallbackCarouselImages } from "@/lib/carousel"

interface CardCarouselProps {
  images?: CarouselImage[]
  autoplayDelay?: number
}

export default function HeroCarousel({
  images = fallbackCarouselImages,
  autoplayDelay = 3000,
}: CardCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, autoplayDelay)
    return () => clearInterval(interval)
  }, [images.length, autoplayDelay])

  return (
    <div className="relative w-full max-w-full mx-auto">
      <div className="overflow-hidden rounded-xl h-[1200px] lg:h-[800px]">
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((item, index) => (
            <div key={index} className="w-full h-full flex-shrink-0 relative">
              <Image src={item.src || "/placeholder.svg"} alt={item.alt} fill className="object-contain" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
