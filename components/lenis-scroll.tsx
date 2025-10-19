"use client"

export default function LenisScroll({ children }: { children: React.ReactNode }) {
  // Disabled Lenis to prevent conflicts with Framer Motion parallax
  // Using native browser smooth scrolling instead
  return <>{children}</>
}
