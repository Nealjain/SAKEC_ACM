import { Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import ScrollToTop from './components/scroll-to-top'
import PageTransition from './components/PageTransition'
import Preloader from './components/preloader'
import AnnouncementPopup from './components/AnnouncementPopup'
import NewsletterPopup from './components/NewsletterPopup'
import Home from './pages/Home'
import About from './pages/About'
import Team from './pages/Team'
import WhyJoin from './pages/WhyJoin'
import TeamMemberProfile from './pages/TeamMemberProfile'
import Alumni from './pages/Alumni'
import Events from './pages/Events'
import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import NfcProfile from './pages/NfcProfile'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import EventRegistration from './pages/EventRegistration'
import Unsubscribe from './pages/Unsubscribe'
import JoinNow from './pages/JoinNow'

import { DottedSurface } from './components/ui/dotted-surface'
import { useCopyProtection } from './hooks/useCopyProtection'

function AppContent() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  // Admin routes without navigation/footer
  if (isAdminRoute) {
    return (
      <Routes location={location}>
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    )
  }

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
          <Route path="/join" element={<JoinNow />} />
          <Route path="/why-join" element={<WhyJoin />} />
          <Route path="/team" element={<Team />} />
          <Route path="/team/:id" element={<TeamMemberProfile />} />
          <Route path="/team/alumni" element={<Alumni />} />
          <Route path="/events" element={<Events />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/nfc/:id" element={<NfcProfile />} />
          <Route path="/event-register/:formId" element={<EventRegistration />} />
          <Route path="/unsubscribe" element={<Unsubscribe />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

function App() {
  useCopyProtection()
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  if (isAdminRoute) {
    return <AppContent />
  }

  return (
    <>
      <Preloader />
      <AnnouncementPopup />
      <NewsletterPopup />
      <PageTransition />
      <div className="min-h-screen text-gray-900 relative overflow-x-hidden">
        <DottedSurface />
        <ScrollToTop />
        <Navigation />
        <AppContent />
        <Footer />
      </div>
    </>
  )
}

export default App
