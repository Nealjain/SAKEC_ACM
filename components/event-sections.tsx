"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { getEvents } from "@/lib/events"
import type { Event } from "@/lib/events"

export default function EventSections() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

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

  // Detect which section is in view
  useEffect(() => {
    if (events.length === 0) return

    const handleScroll = () => {
      sectionRefs.current.forEach((section, index) => {
        if (!section) return
        const rect = section.getBoundingClientRect()
        // Check if section is centered in viewport
        if (rect.top <= 100 && rect.bottom >= window.innerHeight - 100) {
          if (activeSection !== index && !isTransitioning) {
            setActiveSection(index)
          }
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [events.length, activeSection, isTransitioning])

  // Wheel event handler for section locking
  useEffect(() => {
    if (events.length === 0) return

    let lastWheelTime = 0

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now()
      
      // Throttle - increased to 1 second for better control
      if (now - lastWheelTime < 1000) {
        e.preventDefault()
        return
      }
      
      // Check if any event section is in view
      let inEventSection = false
      sectionRefs.current.forEach((section) => {
        if (!section) return
        const rect = section.getBoundingClientRect()
        if (rect.top <= 100 && rect.bottom >= window.innerHeight - 100) {
          inEventSection = true
        }
      })

      if (!inEventSection) return // Not in event sections

      if (isTransitioning) {
        e.preventDefault()
        return
      }

      const delta = e.deltaY

      if (Math.abs(delta) < 10) return

      if (delta > 0 && activeSection < events.length - 1) {
        // Scroll down - next section
        e.preventDefault()
        lastWheelTime = now
        setIsTransitioning(true)
        setActiveSection(prev => prev + 1)
        
        // Scroll to next section
        setTimeout(() => {
          const nextSection = sectionRefs.current[activeSection + 1]
          if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 100)
        
        setTimeout(() => setIsTransitioning(false), 2000)
      } else if (delta < 0 && activeSection > 0) {
        // Scroll up - previous section
        e.preventDefault()
        lastWheelTime = now
        setIsTransitioning(true)
        setActiveSection(prev => prev - 1)
        
        // Scroll to previous section
        setTimeout(() => {
          const prevSection = sectionRefs.current[activeSection - 1]
          if (prevSection) {
            prevSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 100)
        
        setTimeout(() => setIsTransitioning(false), 2000)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    
    return () => {
      window.removeEventListener('wheel', handleWheel)
    }
  }, [events.length, activeSection, isTransitioning])

  if (loading) {
    return (
      <section className="relative h-screen flex items-center justify-center">
        <div className="text-white">Loading events...</div>
      </section>
    )
  }

  if (events.length === 0) {
    return (
      <section className="relative h-screen flex items-center justify-center">
        <div className="text-white">No events available</div>
      </section>
    )
  }

  return (
    <>
      {events.map((event, index) => (
        <section 
          key={event.id}
          ref={(el) => { sectionRefs.current[index] = el }}
          className="snap-section relative h-screen flex items-center justify-center overflow-hidden"
        >
          {/* Animated overlay for this section */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px),
                linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              animation: 'gridMove 20s linear infinite',
              animationDelay: `${index * 2}s`
            }}></div>
          </div>

          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${(Math.random() * 100)}%`,
                  top: `${(Math.random() * 100)}%`,
                  opacity: Math.random() * 0.3 + 0.1,
                  animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 5 + index}s`
                }}
              />
            ))}
          </div>

          {/* Content with transition */}
          <div className={`relative z-10 max-w-7xl mx-auto px-4 w-full transition-all duration-1000 ${
            activeSection === index 
              ? 'opacity-100 translate-y-0' 
              : activeSection > index 
                ? 'opacity-0 -translate-y-10' 
                : 'opacity-0 translate-y-10'
          }`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Text content */}
              <div className="text-center lg:text-left">
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
                <p className="text-lg leading-relaxed text-gray-400 md:text-xl mb-8">
                  {event.description}
                </p>
                <div className="flex gap-4">
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
                  {new Date(event.date) > new Date() && event.registration_link && (
                    <a 
                      href={event.registration_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 rounded-full bg-purple-600 px-8 py-4 font-semibold text-white transition-all hover:bg-purple-700"
                    >
                      Register Now
                    </a>
                  )}
                </div>
              </div>

              {/* Right side - Date display */}
              <div className="flex items-center justify-center">
                <div className="text-center">
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
            </div>
          </div>

          {/* Scroll indicator (only on last event) */}
          {index === events.length - 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-sm animate-bounce">
              Scroll to continue
            </div>
          )}

          {/* Progress indicator - only show on active section */}
          {activeSection === index && (
            <div className="absolute right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
              {events.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    i === index ? 'bg-white h-8' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          )}
        </section>
      ))}
    </>
  )
}
