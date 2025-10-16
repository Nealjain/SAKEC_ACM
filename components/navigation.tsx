"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  type NavItem = {
    href?: string
    label: string
    hasDropdown?: boolean
    items?: Array<{ href: string; label: string }>
  }

  const navItems: NavItem[] = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/events", label: "Events" },
    { 
      label: "Team",
      hasDropdown: true,
      items: [
        { href: "/team", label: "Current Team" },
        { href: "/team/alumni", label: "Alumni" },
      ] 
    },
    { href: "/gallery", label: "Gallery" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
    { href: "/why-join", label: "Why Join Us" },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-black/20 backdrop-blur-xl border-b border-white/10" : "bg-black/10 backdrop-blur-lg"
      }`}
      style={{
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2" prefetch={true}>
            <img src="/new logo.png" alt="ACM Logo" className="h-15 w-60" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              item.hasDropdown ? (
                <DropdownMenu key={`dropdown-${index}`}>
                  <DropdownMenuTrigger className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium flex items-center gap-1 focus:outline-none">
                    {item.label} <ChevronDown size={16} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-black/90 backdrop-blur-xl border-gray-800">
                    {item.items?.map((subItem, subIndex) => (
                      <DropdownMenuItem key={`subitem-${subIndex}-${subItem.href}`} className="focus:bg-gray-800 focus:text-white">
                        <Link 
                          href={subItem.href} 
                          className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium w-full py-1"
                          prefetch={true}
                        >
                          {subItem.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={`nav-${index}`}
                  href={item.href || "#"}
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium"
                  prefetch={true}
                >
                  {item.label}
                </Link>
              )
            ))}
          </div>

          {/* Mobile menu button */}
          <Button variant="ghost" size="sm" className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item, index) => (
                item.hasDropdown ? (
                  <div key={`mobile-dropdown-${index}`} className="space-y-1">
                    <div className="block px-3 py-2 text-gray-300 font-medium">
                      {item.label}
                    </div>
                    <div className="pl-6 space-y-1 border-l border-gray-800 ml-3">
                      {item.items?.map((subItem, subIndex) => (
                        <Link
                          key={`mobile-subitem-${subIndex}-${subItem.href}`}
                          href={subItem.href}
                          className="block px-3 py-2 text-gray-400 hover:text-white transition-colors duration-200"
                          onClick={() => setIsOpen(false)}
                          prefetch={true}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={`mobile-nav-${index}`}
                    href={item.href || "#"}
                    className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                    prefetch={true}
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
