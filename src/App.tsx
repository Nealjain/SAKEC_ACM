import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import ScrollToTop from './components/scroll-to-top'
import Home from './pages/Home'
import About from './pages/About'
import Team from './pages/Team'
import Alumni from './pages/Alumni'
import Events from './pages/Events'
import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import NfcProfile from './pages/NfcProfile'

import { DottedSurface } from './components/ui/dotted-surface'

function App() {
  return (
    <div className="min-h-screen text-gray-900 relative">
      <DottedSurface />
      <ScrollToTop />
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/team" element={<Team />} />
        <Route path="/team/alumni" element={<Alumni />} />
        <Route path="/events" element={<Events />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/nfc/:id" element={<NfcProfile />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
