"use client"

import { useEffect, useRef } from "react"
import Lenis from "lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function LenisScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.8,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    lenisRef.current = lenis

    // Connect Lenis with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    // Snap to sections
    const sections = document.querySelectorAll('.snap-section')
    let isSnapping = false
    let snapTimeout: NodeJS.Timeout
    let lastScrollY = 0

    const snapToSection = () => {
      if (isSnapping) return
      
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      
      // Don't snap if scroll hasn't changed
      if (Math.abs(scrollY - lastScrollY) < 10) return
      lastScrollY = scrollY
      
      // Find the closest section
      let closestSection: Element | null = null
      let closestDistance = Infinity
      
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        const sectionTop = scrollY + rect.top
        const distance = Math.abs(scrollY - sectionTop)
        
        if (distance < closestDistance) {
          closestDistance = distance
          closestSection = section
        }
      })
      
      // Snap to closest section if we're close enough
      if (closestSection && closestDistance < windowHeight * 0.4) {
        isSnapping = true
        const rect = closestSection.getBoundingClientRect()
        const targetScroll = scrollY + rect.top
        
        lenis.scrollTo(targetScroll, {
          duration: 1.2,
          easing: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
          onComplete: () => {
            isSnapping = false
          }
        })
      }
    }

    // Debounced snap on scroll stop
    const handleScroll = () => {
      // Don't snap if EventScroller is active
      if (document.body.getAttribute('data-event-scroller-active') === 'true') {
        return
      }
      
      clearTimeout(snapTimeout)
      snapTimeout = setTimeout(() => {
        snapToSection()
      }, 150)
    }

    lenis.on('scroll', handleScroll)
    
    // Force snap to nearest section on wheel end
    let wheelTimeout: NodeJS.Timeout
    const handleWheel = () => {
      clearTimeout(wheelTimeout)
      wheelTimeout = setTimeout(() => {
        if (document.body.getAttribute('data-event-scroller-active') !== 'true') {
          snapToSection()
        }
      }, 300)
    }
    
    window.addEventListener('wheel', handleWheel, { passive: true })

    // Cleanup
    return () => {
      clearTimeout(snapTimeout)
      clearTimeout(wheelTimeout)
      window.removeEventListener('wheel', handleWheel)
      lenis.destroy()
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000)
      })
    }
  }, [])

  return <div className="lenis-wrapper">{children}</div>
}
