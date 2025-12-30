import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { HoveredLink, Menu, MenuItem } from "@/components/ui/navbar-menu"
import MobileMenu from "@/components/mobile-menu"
import { supabase } from "@/lib/supabase/client"
import { Event } from "@/lib/types"

export default function Navigation() {
    const [active, setActive] = useState<string | null>(null)
    const [latestEvent, setLatestEvent] = useState<Event | null>(null)

    useEffect(() => {
        const fetchLatestEvent = async () => {
            const { data } = await supabase
                .from('events')
                .select('*')
                .order('date', { ascending: false })
                .limit(1)
                .single()

            if (data) {
                setLatestEvent(data as Event)
            }
        }
        fetchLatestEvent()
    }, [])

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
        { label: 'Contact', link: '/contact' },
        { label: 'Join Now', link: '/join' }
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
                <div className="pointer-events-auto flex items-center">
                    <Menu setActive={setActive}>
                        <Link to="/">
                            <MenuItem setActive={setActive} active={active} item="Home">
                                <div className="text-sm grid grid-cols-1 gap-10 p-4">
                                    <div className="flex space-x-2">
                                        <img
                                            src="https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/blog-photos/treak_group.JPG"
                                            width={140}
                                            height={70}
                                            alt="Home Preview"
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

                        <Link to="/events">
                            <MenuItem setActive={setActive} active={active} item="Events">
                                <div className="text-sm grid grid-cols-1 gap-10 p-4">
                                    {latestEvent ? (
                                        <div className="flex space-x-2">
                                            {latestEvent.image_url && (
                                                <img
                                                    src={latestEvent.image_url}
                                                    width={140}
                                                    height={70}
                                                    alt={latestEvent.title}
                                                    className="shrink-0 rounded-md shadow-2xl object-cover h-[70px]"
                                                />
                                            )}
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] uppercase tracking-wider bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-semibold">Latest</span>
                                                    <h4 className="text-lg font-bold text-gray-900 line-clamp-1">{latestEvent.title}</h4>
                                                </div>
                                                <p className="text-gray-500 text-xs mb-1">
                                                    {new Date(latestEvent.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                                </p>
                                                <p className="text-gray-600 text-sm max-w-[10rem] line-clamp-2">
                                                    {latestEvent.description || "Check out our latest event!"}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col space-y-4 text-sm w-[15rem]">
                                            <p className="text-gray-600">Explore our events</p>
                                            <div className="h-[70px] bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                                                Loading events...
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </MenuItem>
                        </Link>

                        <Link to="/gallery">
                            <MenuItem setActive={setActive} active={active} item="Gallery">
                                <div className="text-sm grid grid-cols-1 gap-10 p-4">
                                    <div className="flex space-x-2">
                                        <img
                                            src="https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/blog-photos/treak_banner_photo.jpeg"
                                            width={140}
                                            height={70}
                                            alt="Gallery Preview"
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
                                            src="https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/blog-photos/Sakec.aictelab11.jpg"
                                            width={140}
                                            height={70}
                                            alt="Blog Preview"
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
                                            src="https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/blog-photos/Sakec.aictelab1.jpg"
                                            width={140}
                                            height={70}
                                            alt="Contact Preview"
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
