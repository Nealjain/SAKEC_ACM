import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PreloaderProps {
  onComplete?: () => void
}

const PRELOADER_SESSION_KEY = 'sakec-acm-preloader-shown'

export default function Preloader({ onComplete }: PreloaderProps) {
  const [show, setShow] = useState(() => {
    // Check session storage on initial render
    return !sessionStorage.getItem(PRELOADER_SESSION_KEY)
  })

  useEffect(() => {
    if (show) {
      // Mark as shown in session storage
      sessionStorage.setItem(PRELOADER_SESSION_KEY, 'true')

      // Minimum display time for the preloader
      const timer = setTimeout(() => {
        setShow(false)
        if (onComplete) {
          // Small delay to allow exit animation to start
          setTimeout(onComplete, 200)
        }
      }, 2000)

      return () => clearTimeout(timer)
    } else {
      // If not showing (already visited), call onComplete immediately
      if (onComplete) {
        onComplete()
      }
    }
  }, []) // Empty dependency array to run only once on mount

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
        >
          {/* Dotted background matching theme */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#00000008_1px,transparent_1px)] bg-[size:24px_24px]" />

          <div className="flex flex-col items-center gap-6 relative z-10">
            {/* Simple spinner */}
            <motion.div
              className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />

            {/* Loading text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center"
            >
              <p className="text-gray-900 font-medium text-lg">Loading</p>
              <p className="text-gray-600 text-sm mt-1">Please wait...</p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
