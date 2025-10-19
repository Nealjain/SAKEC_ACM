"use client"

import { useState } from "react"
import Link from "next/link"
import { X } from "lucide-react"

interface MenuItem {
  label: string
  link: string
}

interface MobileMenuProps {
  items: MenuItem[]
  socialItems?: { label: string; link: string }[]
}

export default function MobileMenu({ items, socialItems = [] }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <>
      {/* Logo and Hamburger - Always visible */}
      <div className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between p-4 md:hidden pointer-events-none">
        <Link 
          href="/" 
          className="pointer-events-auto backdrop-blur-md bg-white/[0.02] border border-white/[0.08] rounded-xl px-3 py-1.5 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300" 
          onClick={closeMenu}
        >
          <img src="/new logo.png" alt="SAKEC ACM Logo" className="h-8 w-auto" />
        </Link>

        <button
          onClick={toggleMenu}
          className="pointer-events-auto relative z-[10000] w-10 h-10 flex flex-col items-center justify-center gap-1.5 focus:outline-none"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <span
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${
              isOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${
              isOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Menu Overlay */}
      <div
        className={`fixed inset-0 z-[9998] md:hidden transition-all duration-500 ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Background */}
        <div
          className={`absolute inset-0 bg-black/95 backdrop-blur-xl transition-opacity duration-500 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeMenu}
        />

        {/* Menu Content */}
        <div
          className={`relative h-full flex flex-col justify-center items-center px-6 transition-all duration-500 ${
            isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
        >
          {/* List Layout for Menu Items */}
          <nav className="w-full max-w-md">
            <div className="flex flex-col gap-3">
              {items.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.link}
                  onClick={closeMenu}
                  className="text-white text-lg font-semibold py-4 px-6 rounded-lg border border-gray-800 hover:border-purple-500 hover:bg-purple-500/10 hover:text-purple-400 transition-all duration-300"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Social Links */}
          {socialItems.length > 0 && (
            <div className="mt-8 flex flex-col items-center gap-3">
              <p className="text-purple-400 text-xs font-semibold uppercase tracking-wider">
                Connect
              </p>
              <div className="flex gap-4">
                {socialItems.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors text-xs"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
