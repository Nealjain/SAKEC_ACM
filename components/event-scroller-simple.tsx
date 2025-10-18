"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { getEvents } from "@/lib/events"
import type { Event } from "@/lib/events"

export default function EventScrollerSimple() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await getEvents()
        setEvents(fetchedEvents.slice(0, 3))
      } catch (error) {
        // Error fetching events
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  useEffect(() => {
    if (events.length === 0) return

    let lastWheelTime = 0

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now()
      
      // Throttle to prevent too many events
      if (now - lastWheelTime < 100) return
      
      if (!containerRef.current) return
      
      const rect = containerRef.current.getBoundingClientRect()
      const isInView = rect.top < window.innerHeight && rect.bottom > 0
      
      if (!isInView) return

      if (isTransitioning) {
        e.preventDefault()
        return
      }

      const delta = e.deltaY
      
      if (Math.abs(delta) < 10) return // Ignore tiny scrolls

      if (delta > 0 && currentIndex < events.length - 1) {
        // Scroll down - next event
        e.preventDefault()
        lastWheelTime = now
        setIsTransitioning(true)
        setCurrentIndex(prev => prev + 1)
        setTimeout(() => setIsTransitioning(false), 1000)
      } else if (delta < 0 && currentIndex > 0) {
        // Scroll up - previous event
        e.preventDefault()
        lastWheelTime = now
        setIsTransitioning(true)
        setCurrentIndex(prev => prev - 1)
        setTimeout(() => setIsTransitioning(false), 1000)
      }
    }

    // Add to window for better capture
    window.addEventListener('wheel', handleWheel, { passive: false })
    
    return () => {
      window.removeEventListener('wheel', handleWheel)
    }
  }, [events.length, currentIndex, isTransitioning])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return
      
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        if (currentIndex < events.length - 1) {
          setIsTransitioning(true)
          setCurrentIndex(prev => prev + 1)
          setTimeout(() => setIsTransitioning(false), 1000)
        }
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        if (currentIndex > 0) {
          setIsTransitioning(true)
          setCurrentIndex(prev => prev - 1)
          setTimeout(() => setIsTransitioning(false), 1000)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, isTransitioning, events.length])

  const eventColors = [
    "from-black via-gray-900 to-black",
    "from-black via-gray-900 to-black",
    "from-black via-gray-900 to-black"
  ]
  
  const accentColors = [
    "border-white/20",
    "border-white/20",
    "border-white/20"
  ]

  if (loading) {
    return (
      <section className="relative bg-neutral-900 h-screen flex items-center justify-center">
        <div className="text-white">Loading events...</div>
      </section>
    )
  }

  if (events.length === 0) {
    return (
      <section className="relative bg-neutral-900 h-screen flex items-center justify-center">
        <div className="text-white">No events available</div>
      </section>
    )
  }

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden">
      <div className="h-screen w-full relative">
        {/* Global animated background overlay */}
        <div className="absolute inset-0">
          {/* Animated grid pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px),
                linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              animation: 'gridMove 20s linear infinite'
            }}></div>
          </div>
          
          {/* Floating particles */}
          <div className="absolute inset-0">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.3 + 0.1,
                  animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              />
            ))}
          </div>
        </div>
        {/* Navigation indicators with smooth transitions */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isTransitioning && index !== currentIndex) {
                  setIsTransitioning(true)
                  setCurrentIndex(index)
                  setTimeout(() => setIsTransitioning(false), 1000)
                }
              }}
              className={`transition-all duration-500 ease-out rounded-full ${
                index === currentIndex 
                  ? 'bg-white w-2 h-12 shadow-lg shadow-white/50' 
                  : 'bg-white/30 w-2 h-2 hover:bg-white/50 hover:h-4'
              }`}
              aria-label={`Go to event ${index + 1}`}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-50">
          <div 
            className="h-full bg-white transition-all duration-1000 ease-out"
            style={{ width: `${((currentIndex + 1) / events.length) * 100}%` }}
          />
        </div>

        {events.map((event, index) => (
          <div
            key={event.id}
            className={`absolute inset-0 flex flex-col lg:flex-row transition-all duration-1000 ease-out ${
              index === currentIndex 
                ? 'opacity-100 z-10 translate-y-0' 
                : index < currentIndex 
                  ? 'opacity-0 z-0 -translate-y-full' 
                  : 'opacity-0 z-0 translate-y-full'
            }`}
          >
            {/* Left side - Text content with transparent background */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-16 relative z-20">
              <div className={`w-full max-w-2xl transition-all duration-1000 ease-out ${
                index === currentIndex 
                  ? 'translate-y-0 opacity-100 scale-100' 
                  : 'translate-y-20 opacity-0 scale-95'
              }`}
              style={{ transitionDelay: index === currentIndex ? '200ms' : '0ms' }}
              >
                <div className="mb-4">
                  <span className="inline-block rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                    Event {index + 1} of {events.length}
                  </span>
                </div>
                <h2 className="mb-4 text-4xl font-extrabold leading-tight text-white md:text-6xl">
                  {event.title}
                </h2>
                <h3 className="mb-6 text-xl font-semibold text-gray-300 md:text-2xl">
                  {event.location}
                </h3>
                <p className="text-lg leading-relaxed text-gray-400 md:text-xl">
                  {event.description}
                </p>
                <div className="mt-8">
                  <Link 
                    href="/blog"
                    className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-black transition-all hover:bg-gray-200"
                  >
                    Learn More
                    <svg
                      className="h-5 w-5 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right side - Date display */}
            <div className="hidden lg:flex flex-1 relative items-center justify-center z-20">
              <div className={`text-center transition-all duration-1000 ease-out ${
                index === currentIndex 
                  ? 'scale-100 opacity-100 rotate-0' 
                  : 'scale-75 opacity-0 rotate-12'
              }`}
              style={{ transitionDelay: index === currentIndex ? '400ms' : '0ms' }}
              >
                <div className="text-9xl font-black text-white/5 mb-4 select-none">
                  0{index + 1}
                </div>
                <div className="text-2xl font-bold text-white/60 mb-2">
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="text-white/40">
                  {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Mobile date display */}
            <div className="lg:hidden absolute bottom-20 left-0 right-0 z-20">
              <div className="text-center">
                <div className="text-5xl font-black text-white/5 mb-2 select-none">
                  0{index + 1}
                </div>
                <div className="text-lg font-bold text-white/60 mb-1">
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="text-white/40 text-sm">
                  {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 text-center">
          <div className="text-white/50 text-sm mb-2">
            {currentIndex < events.length - 1 ? 'Scroll or use arrow keys' : 'Scroll to continue'}
          </div>
          <div className="flex gap-2 justify-center">
            {currentIndex > 0 && (
              <button
                onClick={() => {
                  if (!isTransitioning) {
                    setIsTransitioning(true)
                    setCurrentIndex(prev => prev - 1)
                    setTimeout(() => setIsTransitioning(false), 1000)
                  }
                }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm transition-colors"
              >
                ← Previous
              </button>
            )}
            {currentIndex < events.length - 1 && (
              <button
                onClick={() => {
                  if (!isTransitioning) {
                    setIsTransitioning(true)
                    setCurrentIndex(prev => prev + 1)
                    setTimeout(() => setIsTransitioning(false), 1000)
                  }
                }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm transition-colors"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
