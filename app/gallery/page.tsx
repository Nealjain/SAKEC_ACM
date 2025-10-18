"use client"

import { useState, useEffect, Suspense } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { getEventGalleries, searchEventGalleries } from "@/lib/gallery"
import type { EventGallery } from "@/lib/gallery"

function GalleryContent() {
  const [eventGalleries, setEventGalleries] = useState<EventGallery[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const galleries = await getEventGalleries()
        const cleanedGalleries = galleries.map((gallery) => ({
          ...gallery,
          event_name: gallery.event_name.trim().replace(/\n+/g, " "),
          event_date: gallery.event_date.startsWith("5343") ? "2024-01-15" : gallery.event_date,
        }))
        setEventGalleries(cleanedGalleries)
      } catch (error) {
        // Error loading gallery data
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleSearch = async (term: string) => {
    setSearchTerm(term)
    setLoading(true)

    try {
      const filteredGalleries = await searchEventGalleries(term)
      const cleanedGalleries = filteredGalleries.map((gallery) => ({
        ...gallery,
        event_name: gallery.event_name.trim().replace(/\n+/g, " "),
        event_date: gallery.event_date.startsWith("5343") ? "2024-01-15" : gallery.event_date,
      }))
      setEventGalleries(cleanedGalleries)
    } catch (error) {
      // Error searching galleries
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <GallerySkeleton />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20">
      {/* Search Bar */}
      <div className="mb-8">
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Event Galleries */}
      {eventGalleries.length > 0 ? (
        <div className="space-y-12">
          {eventGalleries.map((gallery) => (
            <div key={gallery.id} className="space-y-6">
              {/* Event Header */}
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">{gallery.event_name}</h2>
                {gallery.description && <p className="text-gray-400 max-w-2xl mx-auto">{gallery.description}</p>}
                <p className="text-sm text-gray-500 mt-2">{new Date(gallery.event_date).toLocaleDateString()}</p>
              </div>

              {/* 4 Images Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[gallery.image_1, gallery.image_2, gallery.image_3, gallery.image_4].map((imageUrl, index) => (
                  <div
                    key={index}
                    className="relative overflow-hidden rounded-lg bg-gray-800 min-h-[256px]"
                    style={{ minHeight: "256px", backgroundColor: "#1f2937" }}
                  >
                    <img
                      src={imageUrl || "/placeholder.svg?height=256&width=256&text=Event+Photo"}
                      alt={`${gallery.event_name} - Image ${index + 1}`}
                      className="w-full h-64 object-cover block"
                      style={{
                        display: "block",
                        width: "100%",
                        height: "256px",
                        objectFit: "cover",
                        backgroundColor: "#374151",
                      }}
                      crossOrigin="anonymous"
                      onLoad={() => {}}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = `/placeholder.svg?height=256&width=256&text=Event+Photo`
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No images found in this category.</p>
        </div>
      )}

      {/* Stats */}
      <div className="mt-12 text-center">
        <p className="text-gray-400">
          Showing {eventGalleries.length * 4} images from {eventGalleries.length} events
        </p>
      </div>
    </div>
  )
}

function GallerySkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 pb-20">
      {/* Category Filter Skeleton */}
      <div className="mb-8 flex flex-wrap gap-2 justify-center">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-8 w-20 bg-gray-800 rounded animate-pulse" />
        ))}
      </div>

      {/* Gallery Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(12)].map((_, i) => (
          <Card key={i} className="bg-gray-900 border-gray-800">
            <div className="aspect-square bg-gray-800 animate-pulse" />
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function GalleryPage() {
  return (
    <div className="text-white min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Gallery</h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            Explore moments from our events, workshops, and activities through our photo gallery
          </p>
        </div>
      </section>

      <Suspense fallback={<GallerySkeleton />}>
        <GalleryContent />
      </Suspense>
    </div>
  )
}
