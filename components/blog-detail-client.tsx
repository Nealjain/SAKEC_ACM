"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, User, Share2, Bookmark } from "lucide-react"
import type { BlogPost } from "@/lib/blog"

interface BlogDetailClientProps {
  post: BlogPost
}

export default function BlogDetailClient({ post }: BlogDetailClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [saved, setSaved] = useState(false)

  // Get all available images (1-4), fallback to image_url for backward compatibility
  const images = [
    post.image_1 || post.image_url,
    post.image_2,
    post.image_3,
    post.image_4
  ].filter(Boolean) as string[]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: post.excerpt || post.title,
      url: window.location.href
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        // Share cancelled
      }
    } else {
      navigator.clipboard.writeText(shareData.url)
      alert('Link copied to clipboard!')
    }
  }

  const handleSave = () => {
    setSaved(!saved)
    const savedPosts = JSON.parse(localStorage.getItem('savedBlogPosts') || '[]')
    
    if (!saved) {
      savedPosts.push(post.id)
      localStorage.setItem('savedBlogPosts', JSON.stringify(savedPosts))
    } else {
      const filtered = savedPosts.filter((id: string) => id !== post.id)
      localStorage.setItem('savedBlogPosts', JSON.stringify(filtered))
    }
  }

  const getAuthorName = () => {
    if (typeof post.author === 'object' && post.author?.name) {
      return post.author.name
    }
    return "Anonymous"
  }

  const getAuthorPosition = () => {
    if (typeof post.author === 'object' && post.author?.position) {
      return post.author.position
    }
    return "ACM Chapter Member"
  }

  return (
    <>
      {/* Share and Save Buttons */}
      <div className="flex items-center gap-2 mb-8">
        <Button 
          variant="outline" 
          size="sm" 
          className="border-gray-700 text-white bg-transparent gap-2"
          onClick={handleShare}
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className={`border-gray-700 gap-2 ${
            saved ? 'bg-purple-600 text-white hover:bg-purple-700' : 'text-white bg-transparent'
          }`}
          onClick={handleSave}
        >
          <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          {saved ? 'Saved' : 'Save'}
        </Button>
      </div>

      {/* Image Carousel */}
      {images.length > 0 && (
        <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden bg-gray-900 group">
          <Image 
            src={images[currentImageIndex]} 
            alt={post.title || "Blog post image"} 
            fill 
            className="object-cover" 
          />
          
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              
              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {images.length}
              </div>
              
              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentImageIndex 
                        ? 'bg-white w-6' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

    </>
  )
}
