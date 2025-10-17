import { getTeamMembers } from "@/lib/team"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Linkedin, Github, Mail, ArrowLeft, MapPin, GraduationCap, Quote, User } from "lucide-react"
import TerminalBackground from "@/components/terminal-background"

// Generate static params for all team members
export async function generateStaticParams() {
  const members = await getTeamMembers()
  return members.map((member) => ({
    id: member.id,
  }))
}

export default async function TeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const members = await getTeamMembers()
  const member = members.find((m) => m.id === id)

  if (!member) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 relative">
      {/* Terminal Background */}
      <TerminalBackground opacity={0.8} className="!fixed" />
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-8 text-gray-400 hover:text-white">
          <Link href="/team">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Team
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900 border-gray-800 overflow-hidden sticky top-24">
              <div className="relative w-full aspect-[3/4] bg-gradient-to-b from-gray-800 to-gray-900">
                <Image
                  src={member.image_url || "/placeholder.svg"}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  priority
                />
              </div>
              
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold mb-2">{member.name}</h1>
                  <p className="text-blue-400 font-semibold text-lg mb-1">{member.position}</p>
                  {member.PRN && (
                    <p className="text-gray-500 text-sm font-mono">PRN: {member.PRN}</p>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  {member.year && (
                    <div className="flex items-center text-gray-300">
                      <GraduationCap className="w-4 h-4 mr-3 text-blue-400" />
                      <span className="text-sm">{member.year}</span>
                    </div>
                  )}

                  {member.department && (
                    <div className="flex items-center text-gray-300">
                      <MapPin className="w-4 h-4 mr-3 text-blue-400" />
                      <span className="text-sm">{member.department}</span>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                {(member.linkedin_url || member.github_url || member.email) && (
                  <div className="flex justify-center gap-3 mb-6">
                    {member.linkedin_url && (
                      <Link
                        href={member.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-gray-800 rounded-full text-gray-400 hover:text-blue-400 hover:bg-gray-700 transition-all"
                      >
                        <Linkedin className="w-5 h-5" />
                      </Link>
                    )}

                    {member.github_url && (
                      <Link
                        href={member.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-gray-800 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
                      >
                        <Github className="w-5 h-5" />
                      </Link>
                    )}

                    {member.email && (
                      <Link
                        href={`mailto:${member.email}`}
                        className="p-3 bg-gray-800 rounded-full text-gray-400 hover:text-green-400 hover:bg-gray-700 transition-all"
                      >
                        <Mail className="w-5 h-5" />
                      </Link>
                    )}
                  </div>
                )}

                {/* Contact Button */}
                {member.email && (
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Link href={`mailto:${member.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Contact {member.name.split(" ")[0]}
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Quote */}
            {member.personal_quote && (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Quote className="w-5 h-5 text-blue-400" />
                    <h2 className="text-xl font-bold">Personal Quote</h2>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-blue-400">
                    <p className="text-gray-300 italic text-lg">"{member.personal_quote}"</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* About */}
            {member.about_us && (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-green-400" />
                    <h2 className="text-xl font-bold">About</h2>
                  </div>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 leading-relaxed">{member.about_us}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* If no additional info */}
            {!member.personal_quote && !member.about_us && (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-12 text-center">
                  <p className="text-gray-400">No additional information available.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
