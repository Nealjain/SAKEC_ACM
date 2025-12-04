import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const directions = [
  { x: '-100%', y: 0 }, // left
  { x: '100%', y: 0 },  // right
  { x: 0, y: '-100%' }, // top
  { x: 0, y: '100%' },  // bottom
]

const getPageName = (pathname: string): string => {
  const path = pathname.split('/')[1] || 'home'
  return path.charAt(0).toUpperCase() + path.slice(1)
}

export default function PageTransition() {
  const location = useLocation()
  const [show, setShow] = useState(false)
  const [pageName, setPageName] = useState('')
  const [direction, setDirection] = useState(directions[0])
  const prevPathname = useRef(location.pathname)

  useEffect(() => {
    // Only show transition if the main path changed (not query params or hash)
    const currentPath = location.pathname.split('?')[0]
    const previousPath = prevPathname.current.split('?')[0]

    if (currentPath === previousPath) {
      return
    }

    prevPathname.current = location.pathname

    // Pick random direction
    const randomDirection = directions[Math.floor(Math.random() * directions.length)]
    setDirection(randomDirection)

    // Get page name
    setPageName(getPageName(location.pathname))

    // Show transition
    setShow(true)

    const timer = setTimeout(() => {
      setShow(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [location.pathname])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: direction.x, y: direction.y }}
          animate={{ x: 0, y: 0 }}
          exit={{
            x: direction.x === '-100%' ? '100%' : direction.x === '100%' ? '-100%' : direction.x,
            y: direction.y === '-100%' ? '100%' : direction.y === '100%' ? '-100%' : direction.y
          }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-white pointer-events-none"
        >
          {/* Dotted background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#00000008_1px,transparent_1px)] bg-[size:24px_24px]" />

          {/* Page name */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 relative z-10"
          >
            {pageName}
          </motion.h1>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
