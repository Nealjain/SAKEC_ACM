"use client";

import { useState, useEffect } from "react";
import { getCarouselImages, fallbackCarouselImages, CarouselImage } from "@/lib/carousel";
import HeroCarousel from "@/components/hero-carousel";

export default function CarouselContainer() {
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>(fallbackCarouselImages);
  
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const images = await getCarouselImages();
        if (images && images.length > 0) {
          setCarouselImages(images);
        }
      } catch (error) {
        // Fall back to default images already set in state
      }
    };
    
    fetchImages();
  }, []);

  return <HeroCarousel images={carouselImages} />;
}