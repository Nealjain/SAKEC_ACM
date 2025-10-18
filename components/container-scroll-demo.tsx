"use client";
import React, { useState, useEffect } from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const images = [
  "https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/blog-photos/treak_group.JPG",
  "https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/event-photos/Trek%20to%20'Kothaligadh%20Fort'/trek2020_1.jpg",
  "https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/event-photos/PYTHON%20PROGRAMMING%20LEARN%20IT%20WELL%20(PP)/python4.jpg",
  "https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/event-photos/Triumph/triumph4.jpg",
  "https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/event-photos/Android/an3.jpg",
  "https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/event-photos/IoT%20(1)/iot3.jpg",
];

export default function ContainerScrollDemo() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Ready to Start Your <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Journey?
              </span>
            </h1>
          </>
        }
      >
        <div className="relative w-full h-full overflow-hidden rounded-2xl">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt="SAKEC ACM Student Chapter"
              height={720}
              width={1400}
              className="mx-auto rounded-2xl object-cover h-full w-full object-center"
              draggable={false}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.7 }}
            />
          </AnimatePresence>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex 
                    ? 'bg-white w-6' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </ContainerScroll>

      {/* Join Now Button */}
      <div className="flex justify-center -mt-32 md:-mt-40 relative z-20">
        <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg px-12 py-6 shadow-2xl">
          <Link href="/why-join">Join Now</Link>
        </Button>
      </div>
    </div>
  );
}
