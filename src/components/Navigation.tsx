import { useState } from "react"
import { Link } from "react-router-dom"
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
        { label: 'Email', link: 'mailto:support@sakec.acm.org' }
    ]

    return (
        <>
            {/* Desktop Navigation */}
            <div className="hidden md:flex fixed top-4 md:top-10 left-0 right-0 z-50 px-4 md:px-8 items-center justify-between pointer-events-none">
                {/* Logo on the left with glass effect */}
                <Link to="/" className="flex items-center backdrop-blur-md bg-white/40 border border-black/5 rounded-xl md:rounded-2xl px-3 md:px-4 py-1.5 md:py-2 hover:bg-white/60 hover:border-black/10 transition-all duration-300 pointer-events-auto">
                    <img
                        src="/logo.png"
                        alt="SAKEC ACM Logo"
                        className="h-12 md:h-16 w-auto object-cover"
                        style={{ objectPosition: 'center', clipPath: 'inset(15% 0 15% 0)' }}
                    />
                </Link>

                {/* Menu pill on the right */}
                <div className="pointer-events-auto">
                    <Menu setActive={setActive}>
                        <Link to="/">
                            <MenuItem setActive={setActive} active={active} item="Home">
                                <div className="text-sm grid grid-cols-1 gap-10 p-4">
                                    <div className="flex space-x-2">
                                        <img
                                            src="https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/event-photos/Trek%20to%20'Kothaligadh%20Fort'/trek2020_1.jpg"
                                            width={140}
                                            height={70}
                                            alt="Home"
                                            className="shrink-0 rounded-md shadow-2xl object-cover h-[70px]"
                                        />
                                        <div>
                                            <h4 className="text-xl font-bold mb-1 text-gray-900">Home</h4>
                                            <p className="text-gray-600 text-sm max-w-[10rem]">
                                                Welcome to SAKEC ACM Student Chapter
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </MenuItem>
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

                        <Link to="/gallery">
                            <MenuItem setActive={setActive} active={active} item="Gallery">
                                <div className="text-sm grid grid-cols-1 gap-10 p-4">
                                    <div className="flex space-x-2">
                                        <img
                                            src="https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/event-photos/Triumph/triumph4.jpg"
                                            width={140}
                                            height={70}
                                            alt="Gallery"
                                            className="shrink-0 rounded-md shadow-2xl object-cover h-[70px]"
                                        />
                                        <div>
                                            <h4 className="text-xl font-bold mb-1 text-gray-900">Gallery</h4>
                                            <p className="text-gray-600 text-sm max-w-[10rem]">
                                                Explore our event highlights and memories
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </MenuItem>
                        </Link>

                        <Link to="/blog">
                            <MenuItem setActive={setActive} active={active} item="Blog">
                                <div className="text-sm grid grid-cols-1 gap-10 p-4">
                                    <div className="flex space-x-2">
                                        <img
                                            src="https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/blog-photos/treak_group.JPG"
                                            width={140}
                                            height={70}
                                            alt="Blog"
                                            className="shrink-0 rounded-md shadow-2xl object-cover h-[70px]"
                                        />
                                        <div>
                                            <h4 className="text-xl font-bold mb-1 text-gray-900">Blog</h4>
                                            <p className="text-gray-600 text-sm max-w-[10rem]">
                                                Read our latest articles and tech insights
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </MenuItem>
                        </Link>

                        <Link to="/contact">
                            <MenuItem setActive={setActive} active={active} item="Contact">
                                <div className="text-sm grid grid-cols-1 gap-10 p-4">
                                    <div className="flex space-x-2">
                                        <img
                                            src="https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/event-photos/CSRA%20-Gaushala/csrGaushala2.jpg"
                                            width={140}
                                            height={70}
                                            alt="Contact"
                                            className="shrink-0 rounded-md shadow-2xl object-cover h-[70px]"
                                        />
                                        <div>
                                            <h4 className="text-xl font-bold mb-1 text-gray-900">Contact</h4>
                                            <p className="text-gray-600 text-sm max-w-[10rem]">
                                                Get in touch with us for any queries
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </MenuItem>
                        </Link>
                    </Menu>
                </div>
            </div>

            {/* Mobile Navigation */}
            <MobileMenu items={mobileMenuItems} socialItems={socialItems} />
        </>
    )
}
