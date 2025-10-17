"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"

interface NFCPreloaderProps {
  onComplete: () => void
}

export default function NFCPreloader({ onComplete }: NFCPreloaderProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 2000) // 2 seconds

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      <div className="text-center px-4">
        {/* Welcome Text */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Welcome to
          </motion.h1>
          <motion.h2
            className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            SAKEC ACM
          </motion.h2>
        </motion.div>

        {/* Animated underline */}
        <motion.div
          className="mt-8 mx-auto h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "300px", opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        />
      </div>
    </motion.div>
  )
}
