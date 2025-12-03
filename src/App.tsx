import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import ScrollToTop from './components/scroll-to-top'
import Preloader from './components/preloader'
import PageTransition from './components/PageTransition'
import Home from './pages/Home'
import About from './pages/About'
import Team from './pages/Team'
import TeamMemberProfile from './pages/TeamMemberProfile'
import Alumni from './pages/Alumni'
import Events from './pages/Events'
import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import NfcProfile from './pages/NfcProfile'

import { DottedSurface } from './components/ui/dotted-surface'
import { useCopyProtection } from './hooks/useCopyProtection'

function AppContent() {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/team" element={<Team />} />
          <Route path="/team/:id" element={<TeamMemberProfile />} />
          <Route path="/team/alumni" element={<Alumni />} />
          <Route path="/events" element={<Events />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/nfc/:id" element={<NfcProfile />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

function App() {
  useCopyProtection()
  const [showContent, setShowContent] = React.useState(false)

  const handlePreloaderComplete = () => {
    setShowContent(true)
  }

  return (
    <>
      <Preloader onComplete={handlePreloaderComplete} />
      <PageTransition />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={showContent ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="min-h-screen text-gray-900 relative"
      >
        <DottedSurface />
        <ScrollToTop />
        <Navigation />
        <AppContent />
        <Footer />
      </motion.div>
    </>
  )
}

export default App
