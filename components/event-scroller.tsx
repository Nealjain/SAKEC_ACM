"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { getEvents } from "@/lib/events"
import type { Event } from "@/lib/events"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function EventScroller() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const pinContainerRef = useRef<HTMLDivElement>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await getEvents()
        // Get only the first 3 events for the scroller
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
    if (!scrollerRef.current || !pinContainerRef.current || events.length === 0) return

    let currentIndex = 0
    let isAnimating = false
    let isInView = false
    let lastScrollTime = 0
    let isLocked = false

    // Kill any existing ScrollTriggers to prevent conflicts
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())

    const ctx = gsap.context(() => {
      const sections = document.querySelectorAll('.event-section')
      const texts = document.querySelectorAll('.event-text')
      const images = document.querySelectorAll('.event-image')

      // Hide all sections initially
      gsap.set(sections, { opacity: 0 })
      gsap.set(texts, { y: 50, opacity: 0 })
      gsap.set(images, { scale: 0.8, opacity: 0 })

      // Show first section immediately
      gsap.set(sections[0], { opacity: 1 })
      gsap.set(texts[0], { y: 0, opacity: 1 })
      gsap.set(images[0], { scale: 1, opacity: 1 })

      // Create ScrollTrigger to detect when section is in view and lock it
      ScrollTrigger.create({
        trigger: scrollerRef.current,
        start: "top 50%",
        end: "bottom 50%",
        onEnter: () => {
          isInView = true
          isLocked = true
          currentIndex = 0
          document.body.setAttribute('data-event-scroller-active', 'true')
        },
        onLeave: () => {
          isInView = false
          isLocked = false
          document.body.removeAttribute('data-event-scroller-active')
        },
        onEnterBack: () => {
          isInView = true
          isLocked = true
          currentIndex = sections.length - 1
          document.body.setAttribute('data-event-scroller-active', 'true')
        },
        onLeaveBack: () => {
          isInView = false
          isLocked = false
          document.body.removeAttribute('data-event-scroller-active')
        },
      })

      const showSection = (index: number) => {
        if (isAnimating || index < 0 || index >= sections.length) return
        isAnimating = true

        // Hide all sections
        gsap.to(sections, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
        })

        // Show target section
        gsap.to(sections[index], {
          opacity: 1,
          duration: 0.6,
          delay: 0.3,
          ease: "power2.inOut",
        })

        // Animate text
        const text = sections[index].querySelector('.event-text')
        if (text) {
          gsap.fromTo(text,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, delay: 0.4, ease: "power2.out" }
          )
        }

        // Animate image
        const image = sections[index].querySelector('.event-image')
        if (image) {
          gsap.fromTo(image,
            { scale: 0.9, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.9, delay: 0.4, ease: "power2.out" }
          )
        }

        currentIndex = index

        // Unlock after all animations complete
        setTimeout(() => {
          isAnimating = false
        }, 1500) // Total time: 0.9s animation + 0.4s delay + 0.2s buffer
      }

      // Wheel event handler for scroll-based navigation
      const handleWheel = (e: WheelEvent) => {
        const now = Date.now()

        // Only handle wheel events when section is fully in view
        if (!isInView) {
          return
        }

        if (isAnimating) {
          e.preventDefault()
          e.stopPropagation()
          return
        }

        // Throttle wheel events (prevent too rapid scrolling)
        if (now - lastScrollTime < 1000) {
          e.preventDefault()
          e.stopPropagation()
          return
        }

        const delta = e.deltaY

        if (delta > 0) {
          // Scrolling down
          if (currentIndex < sections.length - 1) {
            // Still have events to show - prevent scroll and show next event
            e.preventDefault()
            e.stopPropagation()
            lastScrollTime = now
            showSection(currentIndex + 1)
          } else {
            // On last event - unlock and allow scroll to next section
            isLocked = false
            isInView = false
            document.body.removeAttribute('data-event-scroller-active')
          }
        } else if (delta < 0) {
          // Scrolling up
          if (currentIndex > 0) {
            // Still have previous events - prevent scroll and show previous event
            e.preventDefault()
            e.stopPropagation()
            lastScrollTime = now
            showSection(currentIndex - 1)
          } else {
            // On first event - unlock and allow scroll to previous section
            isLocked = false
            isInView = false
            document.body.removeAttribute('data-event-scroller-active')
          }
        }
      }

      // Add wheel event listener to window for better capture
      window.addEventListener('wheel', handleWheel, { passive: false })

      // Cleanup
      return () => {
        window.removeEventListener('wheel', handleWheel)
        document.body.removeAttribute('data-event-scroller-active')
      }
    }, scrollerRef)

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [events])

  // Define gradient colors for each event - matching website theme
  const eventColors = [
    "from-gray-800 to-gray-900",
    "from-gray-800 to-black",
    "from-gray-900 to-black"
  ]

  const accentColors = [
    "border-blue-500/30",
    "border-purple-500/30",
    "border-pink-500/30"
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
    <section ref={scrollerRef} className="relative bg-neutral-900 h-screen">
      <div
        ref={pinContainerRef}
        className="h-screen w-full overflow-hidden bg-neutral-900 relative"
      >
        {/* Navigation indicators */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
          {events.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-white/30 transition-all duration-300"
            />
          ))}
        </div>

        {events.map((event, index) => (
          <div
            key={event.id}
            className={`event-section absolute inset-0 flex flex-col lg:flex-row ${index === 0 ? 'opacity-100' : 'opacity-0'}`}
          >
            {/* Left side - Text content */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
              <div className="w-full max-w-2xl event-text">
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
                <div className="mt-8 flex gap-4">
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
            </div>

            {/* Right side - Image panel */}
            <div className="hidden lg:block flex-1 relative">
              <div className={`event-image h-full w-full bg-gradient-to-br ${eventColors[index]} transition-all duration-700 border-l-4 ${accentColors[index]}`}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="h-full w-full flex items-center justify-center relative">
                  <div className="text-center z-10">
                    <div className="text-9xl font-black text-white/10 mb-4">
                      0{index + 1}
                    </div>
                    <div className="text-2xl font-bold text-white/40 mb-2">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="text-white/30">
                      {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric' })}
                    </div>
                  </div>
                  {/* Decorative grid pattern */}
                  <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                  }}></div>
                </div>
              </div>
            </div>

            {/* Mobile image preview */}
            <div className="lg:hidden absolute bottom-0 left-0 right-0 h-48">
              <div className={`event-image h-full w-full bg-gradient-to-br ${eventColors[index]} transition-all duration-700 rounded-t-3xl border-t-4 ${accentColors[index]}`}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="h-full w-full flex items-center justify-center relative">
                  <div className="text-center z-10">
                    <div className="text-5xl font-black text-white/10 mb-2">
                      0{index + 1}
                    </div>
                    <div className="text-lg font-bold text-white/40 mb-1">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="text-white/30 text-sm">
                      {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric' })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}