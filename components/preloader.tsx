"use client"

import { useEffect, useState } from "react"

export default function Preloader() {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Only show preloader on initial page load, not on navigation
    const hasLoaded = sessionStorage.getItem('hasLoaded')
    
    if (hasLoaded) {
      setLoading(false)
      return
    }

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => {
            setLoading(false)
            sessionStorage.setItem('hasLoaded', 'true')
          }, 500)
          return 100
        }
        return prev + 2
      })
    }, 50)

    return () => clearInterval(timer)
  }, [])

  if (!loading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">SAKEC ACM</h1>
          <p className="text-gray-400">Student Chapter</p>
        </div>

        <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-white transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
        </div>

        <div className="mt-4 text-white text-sm">{progress}%</div>
      </div>
    </div>
  )
}
