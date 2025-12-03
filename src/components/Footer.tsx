import { Link } from "react-router-dom"
import { Github, Linkedin, Mail, MapPin, Phone, Instagram } from "lucide-react"

interface FooterProps {
    className?: string;
}

export default function Footer({ className = '' }: FooterProps) {
    return (
        <footer className={`text-gray-900 bg-white/40 backdrop-blur-md border-t border-black/5 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About Section */}
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-2xl font-bold mb-4">SAKEC ACM</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            Empowering students through technology, innovation, and collaborative learning. Join us in our mission to
                            advance computing as a science and profession.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://www.instagram.com/acm_sakec?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="text-gray-600 hover:text-blue-600 transition-colors" target="_blank" rel="noopener noreferrer">
                                <Instagram size={20} />
                            </a>
                            <a href="https://www.linkedin.com/company/sakec-acm-student-chapter/" className="text-gray-600 hover:text-blue-600 transition-colors" target="_blank" rel="noopener noreferrer">
                                <Linkedin size={20} />
                            </a>
                            <a href="https://github.com/sakec-acm" className="text-gray-600 hover:text-blue-600 transition-colors" target="_blank" rel="noopener noreferrer">
                                <Github size={20} />
                            </a>
                            <a href="mailto:support@sakec.acm.org" className="text-gray-600 hover:text-blue-600 transition-colors">
                                <Mail size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/about" className="text-gray-700 hover:text-black transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/events" className="text-gray-700 hover:text-black transition-colors">
                                    Events
                                </Link>
                            </li>
                            <li>
                                <Link to="/team" className="text-gray-700 hover:text-black transition-colors">
                                    Our Team
                                </Link>
                            </li>
                            <li>
                                <Link to="/gallery" className="text-gray-700 hover:text-black transition-colors">
                                    Gallery
                                </Link>
                            </li>
                            <li>
                                <Link to="/blog" className="text-gray-700 hover:text-black transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-700 hover:text-black transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link to="/nfc/283006fb-63d7-40bf-bf62-e3751c767499" className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-1">
                                    <span>NFC Profile</span>
                                    <span className="text-xs bg-purple-600 px-1.5 py-0.5 rounded">NEW</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact</h4>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2 text-gray-700">
                                <MapPin size={16} />
                                <span className="text-sm">Shah & Anchor Kutchhi Engineering College</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-700">
                                <Mail size={16} />
                                <span className="text-sm">support@sakec.acm.org</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-700">
                                <Phone size={16} />
                                <span className="text-sm">+91 98765 43210</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-300 mt-8 pt-8 text-center">
                    <p className="text-gray-700 text-sm">© 2025 SAKEC ACM Student Chapter. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
