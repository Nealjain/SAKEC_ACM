import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Mail, 
  Linkedin, 
  Github, 
  User, 
  Briefcase,
  GraduationCap,
  Quote,
  Home
} from "lucide-react"
import { createServerClient } from "@/lib/supabase/server"
import NfcPreloader from "@/components/nfc-preloader"
import NfcProfileClient from "@/components/nfc-profile-client"

interface NfcProfilePageProps {
  params: {
    id: string
  }
}

async function getTeamMember(id: string) {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return null
  }

  return data
}

export default async function NfcProfilePage({ params }: NfcProfilePageProps) {
  const { id } = await params
  const member = await getTeamMember(id)

  if (!member) {
    notFound()
  }

  return (
    <>
      <NfcPreloader />
      
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]" />
        </div>

        {/* Content */}
        <div className="relative z-10 container max-w-4xl mx-auto px-4 py-8">
          {/* Header with Back Button */}
          <div className="flex items-center justify-between mb-8">
            <Button asChild variant="ghost" className="text-gray-400 hover:text-white">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Back to Main Site
              </Link>
            </Button>
            
            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
              NFC Profile
            </Badge>
          </div>

          {/* Profile Card */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl overflow-hidden">
            <CardContent className="p-0">
              {/* Header Section with Gradient */}
              <div className="relative h-32 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600">
                <div className="absolute inset-0 bg-black/20" />
              </div>

              {/* Profile Content */}
              <div className="relative px-6 pb-8">
                {/* Profile Picture - Clickable */}
                <div className="flex justify-center -mt-16 mb-6">
                  {member.image_url ? (
                    <NfcProfileClient imageUrl={member.image_url} name={member.name} />
                  ) : (
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-900 bg-gray-800">
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-16 h-16 text-gray-400" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Name and Position */}
                <div className="text-center mb-6">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
                    {member.name}
                  </h1>
                  <p className="text-xl text-gray-300 mb-2">{member.position}</p>
                  {member.department && (
                    <Badge variant="outline" className="border-gray-700 text-gray-400">
                      {member.department}
                    </Badge>
                  )}
                </div>

                {/* Personal Quote */}
                {member.personal_quote && (
                  <div className="mb-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <Quote className="w-6 h-6 text-purple-400 mb-2" />
                    <p className="text-gray-300 italic text-center">
                      "{member.personal_quote}"
                    </p>
                  </div>
                )}

                {/* About Section */}
                {member.about_us && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                      <User className="w-5 h-5 text-purple-400" />
                      About
                    </h2>
                    <p className="text-gray-300 leading-relaxed">
                      {member.about_us}
                    </p>
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {member.year && (
                    <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg">
                      <GraduationCap className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-sm text-gray-400">Year</p>
                        <p className="text-white font-medium">{member.year}</p>
                      </div>
                    </div>
                  )}
                  
                  {member.PRN && (
                    <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg">
                      <Briefcase className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-sm text-gray-400">PRN</p>
                        <p className="text-white font-medium">{member.PRN}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold mb-4">Connect</h2>
                  
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-3 p-4 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-400">Email</p>
                        <p className="text-white group-hover:text-purple-400 transition-colors">
                          {member.email}
                        </p>
                      </div>
                    </a>
                  )}

                  {member.linkedin_url && (
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
                        <Linkedin className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-400">LinkedIn</p>
                        <p className="text-white group-hover:text-blue-400 transition-colors">
                          View Profile
                        </p>
                      </div>
                    </a>
                  )}

                  {member.github_url && (
                    <a
                      href={member.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center">
                        <Github className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-400">GitHub</p>
                        <p className="text-white group-hover:text-gray-300 transition-colors">
                          View Profile
                        </p>
                      </div>
                    </a>
                  )}
                </div>

                {/* CTA Section */}
                <div className="mt-8 p-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg border border-purple-500/30 text-center">
                  <h3 className="text-lg font-semibold mb-2">SAKEC ACM Student Chapter</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Empowering students through technology and innovation
                  </p>
                  <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <Link href="/">
                      Visit Main Website
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-500 text-sm">
            <p>Scanned via NFC • SAKEC ACM Chapter</p>
          </div>
        </div>
      </div>
    </>
  )
}
