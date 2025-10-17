"use client"

import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Linkedin, Github, Mail, ArrowLeft, MapPin, Calendar, GraduationCap, FileText, Quote, User } from "lucide-react"
import { slugify } from "@/lib/utils"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"

export default function AlumniMemberClient({ params }: { params: { slug: string } }) {
  const [member, setMember] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { slug } = params

  useEffect(() => {
    async function fetchMember() {
      setLoading(true)
      const { data: members } = await supabase.from("alumni_members").select("*")
      const foundMember = members?.find((m) => slugify(m.name) === slug)
      setMember(foundMember || null)
      setLoading(false)
    }
    
    fetchMember()
  }, [slug])

  if (loading) {
    return <div className="text-white min-h-screen pt-20 flex items-center justify-center">Loading...</div>
  }

  if (!member) {
    return notFound()
  }

  return (
    <div className="text-white min-h-screen pt-20">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-8 text-gray-400 hover:text-white">
          <Link href="/team/alumni">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Alumni
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Image and Basic Info */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900 border-gray-800 sticky top-24">
              <CardContent className="p-6">
                <div className="relative w-full mb-6 rounded-lg overflow-hidden" style={{ aspectRatio: '3 / 4' }}>
                  <Image
                    src={member.image_url || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>

                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold mb-2">{member.name}</h1>
                  <p className="text-blue-400 font-medium text-lg">{member.position}</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-300">
                    <GraduationCap className="w-4 h-4 mr-3" />
                    <span className="text-sm">Graduated: {member.graduation_year}</span>
                  </div>

                  <div className="flex items-center text-gray-300">
                    <MapPin className="w-4 h-4 mr-3" />
                    <span className="text-sm">{member.current_company || "Not specified"}</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex justify-center space-x-4 mb-6">
                  {member.linkedin_url && (
                    <Link
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-blue-400 hover:bg-gray-700 transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </Link>
                  )}

                  {member.github_url && (
                    <Link
                      href={member.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                    >
                      <Github className="w-5 h-5" />
                    </Link>
                  )}

                  {member.email && (
                    <Link
                      href={`mailto:${member.email}`}
                      className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-green-400 hover:bg-gray-700 transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                    </Link>
                  )}
                </div>

                {/* Contact Button */}
                {member.email && (
                  <Button asChild className="w-full bg-white text-black hover:bg-gray-200">
                    <Link href={`mailto:${member.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Contact {member.name.split(" ")[0]}
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            {member.about && (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center"><User className="w-5 h-5 mr-2 text-green-400" />About</h2>
                  <div className="prose prose-invert max-w-none">
                    <p>{member.about}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}