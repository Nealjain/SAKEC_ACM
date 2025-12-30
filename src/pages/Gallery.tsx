import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { ZoomParallax } from '@/components/ui/zoom-parallax'
import { GlowCard } from '@/components/ui/spotlight-card'

interface EventGallery {
  id: string
  event_name: string
  description: string | null
  event_date: string
  image_1: string
  image_2: string
  image_3: string
  image_4: string
  is_featured: boolean
}

export default function Gallery() {
  const [eventGalleries, setEventGalleries] = useState<EventGallery[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    async function fetchEventGalleries() {
      const { data, error } = await supabase
        .from('event_galleries')
        .select('*')
        .order('event_date', { ascending: false })

      if (!error && data) {
        setEventGalleries(data)
      }
      setLoading(false)
    }

    fetchEventGalleries()
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const handleImageClick = useCallback((image: string) => {
    // Only allow lightbox on desktop
    if (!isMobile) {
      setSelectedImage(image)
    }
  }, [isMobile])

  // Get first 7 images for the parallax hero
  const parallaxImages = eventGalleries
    .slice(0, 2)
    .flatMap((event) => [
      { src: event.image_1, alt: event.event_name },
      { src: event.image_2, alt: event.event_name },
      { src: event.image_3, alt: event.event_name },
      { src: event.image_4, alt: event.event_name },
    ])
    .slice(0, 7)

  if (loading) {
    return (
      <div className="text-gray-900 min-h-screen pt-20 flex items-center justify-center">
        <div className="text-xl">Loading gallery...</div>
      </div>
    )
  }

  return (
    <div className="text-gray-900 min-h-screen">
      {/* Static Hero Title */}
      <section className="pt-32 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900">
            Gallery
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
            Moments captured from our events and activities
          </p>
        </div>
      </section>

      {/* Zoom Parallax Section */}
      {parallaxImages.length > 0 && (
        <div className="relative">
          <ZoomParallax images={parallaxImages} />
        </div>
      )}

      {/* Event Galleries Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Event Galleries</h2>
          <p className="text-xl text-gray-700">Browse through our memorable moments</p>
        </div>

        {eventGalleries.length === 0 ? (
          <p className="text-gray-700 text-center py-12">
            No gallery items available yet.
          </p>
        ) : (
          <div className="space-y-16">
            {eventGalleries.map((event, eventIndex) => {
              const images = [event.image_1, event.image_2, event.image_3, event.image_4].filter(Boolean)
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: eventIndex * 0.1 }}
                  className="space-y-6"
                >
                  {/* Event Header */}
                  <div className="border-l-4 border-blue-600 pl-6 bg-white/60 backdrop-blur-sm rounded-r-lg py-4 shadow-sm">
                    <h2 className="text-3xl font-bold mb-2 text-gray-900">{event.event_name}</h2>
                    {event.description && (
                      <p className="text-gray-700 mb-2">{event.description}</p>
                    )}
                    <p className="text-sm text-gray-600">
                      {new Date(event.event_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  {/* Event Photos Grid - 4x4 Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                    {images.map((image, imageIndex) => (
                      <motion.div
                        key={imageIndex}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: imageIndex * 0.05 }}
                        className={isMobile ? '' : 'cursor-pointer'}
                        onClick={() => handleImageClick(image)}
                        style={{ touchAction: isMobile ? 'pan-y' : 'auto' }}
                      >
                        <GlowCard
                          glowColor={
                            ['blue', 'purple', 'green', 'orange'][
                              imageIndex % 4
                            ] as 'blue' | 'purple' | 'green' | 'orange'
                          }
                          customSize
                          className="w-full aspect-square p-0 overflow-hidden"
                        >
                          <img
                            src={image}
                            alt={`${event.event_name} - Photo ${imageIndex + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                            style={{ 
                              pointerEvents: isMobile ? 'none' : 'auto',
                              userSelect: 'none',
                              WebkitUserSelect: 'none',
                              WebkitTouchCallout: 'none'
                            }}
                            onContextMenu={(e) => e.preventDefault()}
                            draggable={false}
                          />
                        </GlowCard>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  )
}
