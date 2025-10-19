"use client"

import { useState } from "react"
import Link from "next/link"
import { HoveredLink, Menu, MenuItem, ProductItem } from "@/components/ui/navbar-menu"
import MobileMenu from "@/components/mobile-menu"

export default function Navigation() {
  const [active, setActive] = useState<string | null>(null)

  const mobileMenuItems = [
    { label: 'Home', link: '/' },
    { 
      label: 'About',
      submenu: [
        { label: 'About ACM', link: '/about' },
        { label: 'Why Join Us', link: '/why-join' }
      ]
    },
    { 
      label: 'Team',
      submenu: [
        { label: 'Current Team', link: '/team' },
        { label: 'Alumni', link: '/team/alumni' }
      ]
    },
    { label: 'Events', link: '/events' },
    { label: 'Gallery', link: '/gallery' },
    { label: 'Blog', link: '/blog' },
    { label: 'Contact', link: '/contact' }
  ]

  const socialItems = [
    { label: 'Instagram', link: 'https://instagram.com/sakecacm' },
    { label: 'LinkedIn', link: 'https://linkedin.com/company/sakecacm' },
    { label: 'GitHub', link: 'https://github.com/sakecacm' },
    { label: 'Email', link: 'mailto:acm@sakec.ac.in' }
  ]

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex fixed top-4 md:top-10 left-0 right-0 z-50 px-4 md:px-8 items-center justify-between">
        {/* Logo on the left with glass effect */}
        <Link href="/" className="flex items-center backdrop-blur-md bg-white/[0.02] border border-white/[0.08] rounded-xl md:rounded-2xl px-3 md:px-4 py-1.5 md:py-2 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300">
          <img src="/new logo.png" alt="ACM Logo" className="h-8 md:h-12 w-auto" />
        </Link>

        {/* Menu pill on the right */}
        <Menu setActive={setActive}>
          <Link href="/">
            <MenuItem setActive={setActive} active={active} item="Home" />
          </Link>
          
          <MenuItem setActive={setActive} active={active} item="About">
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/about">About ACM</HoveredLink>
              <HoveredLink href="/why-join">Why Join Us</HoveredLink>
            </div>
          </MenuItem>

          <MenuItem setActive={setActive} active={active} item="Team">
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/team">Current Team</HoveredLink>
              <HoveredLink href="/team/alumni">Alumni</HoveredLink>
            </div>
          </MenuItem>

          <MenuItem setActive={setActive} active={active} item="Events">
            <div className="text-sm grid grid-cols-2 gap-10 p-4">
              <ProductItem
                title="Upcoming Events"
                href="/events"
                src="https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/event-photos/Trek%20to%20'Kothaligadh%20Fort'/trek2020_1.jpg"
                description="Check out our latest tech events and workshops"
              />
              <ProductItem
                title="Past Events"
                href="/events"
                src="https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/event-photos/PYTHON%20PROGRAMMING%20LEARN%20IT%20WELL%20(PP)/python4.jpg"
                description="Explore our event gallery and highlights"
              />
            </div>
          </MenuItem>

          <Link href="/gallery">
            <MenuItem setActive={setActive} active={active} item="Gallery" />
          </Link>

          <Link href="/blog">
            <MenuItem setActive={setActive} active={active} item="Blog" />
          </Link>

          <Link href="/contact">
            <MenuItem setActive={setActive} active={active} item="Contact" />
          </Link>
        </Menu>
      </div>

      {/* Mobile Navigation */}
      <MobileMenu items={mobileMenuItems} socialItems={socialItems} />
    </>
  )
}
