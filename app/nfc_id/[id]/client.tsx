"use client"

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Linkedin, Github, Mail, MapPin, GraduationCap, Quote, User, Award, Code, ExternalLink, Home } from "lucide-react"
import NFCPreloader from "@/components/nfc-preloader"
import { createClient } from "@/lib/supabase/client"
import type { TeamMember } from "@/lib/team"

export default function NFCProfileClient({ params }: { params: { id: string } }) {
    const { id } = params
    const [loading, setLoading] = useState(true)
    const [showPreloader, setShowPreloader] = useState(false)
    const [member, setMember] = useState<TeamMember | null>(null)

    useEffect(() => {
        // Check if preloader has been shown in this session
        const hasSeenPreloader = sessionStorage.getItem('nfc_preloader_shown')

        if (!hasSeenPreloader) {
            setShowPreloader(true)
        }

        async function fetchMember() {
            try {
                const supabase = createClient()
                const { data, error } = await supabase
                    .from('team_members')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (error || !data) {
                    console.error('Error fetching member:', error)
                    setMember(null)
                } else {
                    setMember(data)
                }
            } catch (error) {
                console.error('Error:', error)
                setMember(null)
            } finally {
                setLoading(false)
            }
        }

        fetchMember()
    }, [id])

    const handlePreloaderComplete = () => {
        setShowPreloader(false)
        // Mark preloader as shown for this session
        sessionStorage.setItem('nfc_preloader_shown', 'true')
    }

    if (showPreloader) {
        return <NFCPreloader onComplete={handlePreloaderComplete} />
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading profile...</p>
                </div>
            </div>
        )
    }

    if (!member) {
        return notFound()
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
            {/* Hero Section with Image Background */}
            <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                    <Image
                        src={member.image_url || "/placeholder.svg"}
                        alt={member.name}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />
                </div>

                {/* SAKEC ACM Logo/Badge & Home Button */}
                <div className="absolute top-4 left-4 right-4 md:top-6 md:left-6 md:right-6 flex justify-between items-center gap-2 z-10">
                    <div className="px-3 py-1.5 md:px-4 md:py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
                        <p className="text-white text-xs md:text-sm font-bold whitespace-nowrap">SAKEC ACM</p>
                    </div>
                    <Button
                        asChild
                        size="sm"
                        className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white text-xs md:text-sm"
                    >
                        <Link href="/">
                            <Home className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                            <span className="hidden sm:inline">Main Site</span>
                            <span className="sm:hidden">Home</span>
                        </Link>
                    </Button>
                </div>

                {/* Member Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 z-10">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 md:mb-3 text-white drop-shadow-lg break-words">
                            {member.name}
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl text-blue-400 font-semibold mb-2">
                            {member.position}
                        </p>
                        <div className="flex flex-wrap gap-2 md:gap-4 text-sm md:text-base text-gray-300">
                            {member.year && (
                                <div className="flex items-center gap-1 md:gap-2">
                                    <GraduationCap className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                                    <span>{member.year}</span>
                                </div>
                            )}
                            {member.department && (
                                <div className="flex items-center gap-1 md:gap-2">
                                    <MapPin className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                                    <span>{member.department}</span>
                                </div>
                            )}
                            {member.PRN && (
                                <div className="text-xs md:text-sm text-gray-400">
                                    PRN: {member.PRN}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    {/* Left Column - Contact & Social */}
                    <div className="lg:col-span-1 space-y-4 md:space-y-6">
                        {/* Contact Card */}
                        <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold mb-4 text-white">Connect</h3>

                                {/* Social Links */}
                                <div className="space-y-3 mb-6">
                                    {member.linkedin_url && (
                                        <Link
                                            href={member.linkedin_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-all group"
                                        >
                                            <Linkedin className="w-5 h-5 text-blue-400" />
                                            <span className="text-gray-300 group-hover:text-white">LinkedIn</span>
                                            <ExternalLink className="w-4 h-4 ml-auto text-gray-500 group-hover:text-gray-300" />
                                        </Link>
                                    )}

                                    {member.github_url && (
                                        <Link
                                            href={member.github_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-all group"
                                        >
                                            <Github className="w-5 h-5 text-gray-300" />
                                            <span className="text-gray-300 group-hover:text-white">GitHub</span>
                                            <ExternalLink className="w-4 h-4 ml-auto text-gray-500 group-hover:text-gray-300" />
                                        </Link>
                                    )}

                                    {member.email && (
                                        <Link
                                            href={`mailto:${member.email}`}
                                            className="flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-all group"
                                        >
                                            <Mail className="w-5 h-5 text-green-400 flex-shrink-0" />
                                            <span className="text-gray-300 group-hover:text-white text-sm break-all">
                                                {member.email}
                                            </span>
                                        </Link>
                                    )}
                                </div>

                                {/* Contact Button */}
                                {member.email && (
                                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                        <Link href={`mailto:${member.email}`}>
                                            <Mail className="w-4 h-4 mr-2" />
                                            Send Email
                                        </Link>
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <Button asChild variant="outline" className="w-full border-gray-700 text-white hover:bg-gray-800">
                                <Link href={`/team/${member.id}`}>
                                    View Full Profile
                                </Link>
                            </Button>

                            <Button asChild variant="outline" className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                                <Link href="/">
                                    <Home className="w-4 h-4 mr-2" />
                                    Visit Main Site
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="lg:col-span-2 space-y-4 md:space-y-6">
                        {/* Personal Quote */}
                        {member.personal_quote && (
                            <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-3">
                                        <Quote className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                                        <div>
                                            <p className="text-gray-300 text-lg italic leading-relaxed">
                                                "{member.personal_quote}"
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* About */}
                        {member.about_us && (
                            <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <User className="w-5 h-5 text-green-400" />
                                        <h3 className="text-xl font-bold">About</h3>
                                    </div>
                                    <p className="text-gray-300 leading-relaxed">{member.about_us}</p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Skills */}
                        {member.skills && member.skills.length > 0 && (
                            <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Code className="w-5 h-5 text-purple-400" />
                                        <h3 className="text-xl font-bold">Skills</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {member.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 text-gray-300 rounded-lg text-sm font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Achievements */}
                        {member.achievements && member.achievements.length > 0 && (
                            <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Award className="w-5 h-5 text-yellow-400" />
                                        <h3 className="text-xl font-bold">Achievements</h3>
                                    </div>
                                    <ul className="space-y-3">
                                        {member.achievements.map((achievement, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2 flex-shrink-0" />
                                                <span className="text-gray-300">{achievement}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-gray-800 text-center">
                    <p className="text-gray-500 text-sm">
                        Powered by SAKEC ACM Chapter
                    </p>
                </div>
            </div>
        </div>
    )
}
