"use client"

import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

interface NfcProfileClientProps {
  imageUrl?: string
  name: string
}

export default function NfcProfileClient({ imageUrl, name }: NfcProfileClientProps) {
  const [isImageOpen, setIsImageOpen] = useState(false)

  if (!imageUrl) return null

  return (
    <>
      {/* Clickable Profile Picture */}
      <button
        onClick={() => setIsImageOpen(true)}
        className="relative group cursor-pointer"
      >
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-900 bg-gray-800 transition-transform group-hover:scale-105">
          <Image
            src={imageUrl}
            alt={name}
            width={128}
            height={128}
            className="object-cover w-full h-full"
          />
        </div>
        {/* Hover Overlay */}
        <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
            />
          </svg>
        </div>
      </button>

      {/* Full Size Image Modal */}
      <AnimatePresence>
        {isImageOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsImageOpen(false)}
            className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsImageOpen(false)}
              className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[90vh] cursor-default"
            >
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={imageUrl}
                  alt={name}
                  width={1200}
                  height={1200}
                  className="object-contain w-full h-full"
                  priority
                />
              </div>
              
              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <p className="text-white text-xl font-semibold">{name}</p>
                <p className="text-gray-300 text-sm">Profile Picture</p>
              </div>
            </motion.div>

            {/* Instructions */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400 text-sm">
              Click anywhere to close
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
