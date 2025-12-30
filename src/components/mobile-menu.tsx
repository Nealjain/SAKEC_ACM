import { useState } from "react"
import { Link } from "react-router-dom"
import { ChevronDown } from "lucide-react"

interface MenuItem {
  label: string
  link?: string
  submenu?: { label: string; link: string }[]
}

interface MobileMenuProps {
  items: MenuItem[]
  socialItems?: { label: string; link: string }[]
}

export default function MobileMenu({ items, socialItems = [] }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => {
    setIsOpen(false)
    setExpandedItems([])
  }

  const toggleSubmenu = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    )
  }

  return (
    <>
      {/* Logo and Hamburger - Always visible */}
      <div className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 md:hidden pointer-events-none">
        <Link
          to="/"
          className="pointer-events-auto backdrop-blur-md bg-white/80 border border-black/10 rounded-xl px-3 py-1.5 hover:bg-white/90 hover:border-black/20 transition-all duration-300 shadow-lg"
          onClick={closeMenu}
        >
          <img
            src="/logo.png"
            alt="SAKEC ACM Logo"
            className="h-14 w-auto object-cover"
            style={{ objectPosition: 'center', clipPath: 'inset(15% 0 15% 0)' }}
          />
        </Link>

        <button
          onClick={toggleMenu}
          className="pointer-events-auto relative z-[101] w-11 h-11 flex flex-col items-center justify-center gap-1.5 focus:outline-none backdrop-blur-md bg-white/80 border border-black/10 rounded-lg hover:bg-white/90 hover:border-black/20 transition-all shadow-lg"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <span
            className={`w-6 h-0.5 bg-gray-900 rounded-full transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""
              }`}
          />
          <span
            className={`w-6 h-0.5 bg-gray-900 rounded-full transition-all duration-300 ${isOpen ? "opacity-0" : ""
              }`}
          />
          <span
            className={`w-6 h-0.5 bg-gray-900 rounded-full transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
          />
        </button>
      </div>

      {/* Menu Overlay */}
      <div
        className={`fixed inset-0 z-[99] md:hidden transition-all duration-500 ${isOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
      >
        {/* Background */}
        <div
          className={`absolute inset-0 bg-white/95 backdrop-blur-xl transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0"
            }`}
          onClick={closeMenu}
        />

        {/* Menu Content */}
        <div
          className={`relative h-full flex flex-col justify-start items-center px-6 pt-24 pb-8 overflow-y-auto transition-all duration-500 ${isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
            }`}
        >
          {/* List Layout for Menu Items */}
          <nav className="w-full max-w-md flex-shrink-0">
            <div className="flex flex-col gap-3">
              {items.map((item, idx) => (
                <div key={idx}>
                  {item.submenu ? (
                    // Item with submenu
                    <div>
                      <button
                        onClick={() => toggleSubmenu(item.label)}
                        className="w-full text-gray-900 text-lg font-semibold py-4 px-6 rounded-lg border border-gray-200 hover:border-gray-900 hover:bg-gray-50 transition-all duration-300 flex items-center justify-between"
                      >
                        {item.label}
                        <ChevronDown
                          className={`w-5 h-5 transition-transform duration-300 ${expandedItems.includes(item.label) ? 'rotate-180' : ''
                            }`}
                        />
                      </button>
                      {/* Submenu */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ${expandedItems.includes(item.label)
                          ? 'max-h-96 mt-2'
                          : 'max-h-0'
                          }`}
                      >
                        <div className="flex flex-col gap-2 pl-4">
                          {item.submenu.map((subitem, subidx) => (
                            <Link
                              key={subidx}
                              to={subitem.link}
                              onClick={closeMenu}
                              className="text-gray-700 text-base py-3 px-4 rounded-lg border border-gray-200/50 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
                            >
                              {subitem.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Regular item without submenu
                    <Link
                      to={item.link!}
                      onClick={closeMenu}
                      className="text-gray-900 text-lg font-semibold py-4 px-6 rounded-lg border border-gray-200 hover:border-gray-900 hover:bg-gray-50 transition-all duration-300 block"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* Social Links */}
          {socialItems.length > 0 && (
            <div className="mt-8 flex flex-col items-center gap-3">
              <p className="text-gray-900 text-xs font-semibold uppercase tracking-wider">
                Connect
              </p>
              <div className="flex gap-4">
                {socialItems.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900 transition-colors text-xs"
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
