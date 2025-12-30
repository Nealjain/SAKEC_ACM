import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Mail, Linkedin, Github } from 'lucide-react'
import { getTeamMemberById, type TeamMember } from '@/lib/team'
import { Card, CardContent } from '@/components/ui/card'

export default function TeamMemberProfile() {
  const { id } = useParams<{ id: string }>()
  const [member, setMember] = useState<TeamMember | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMember() {
      if (!id) return
      const data = await getTeamMemberById(id)
      setMember(data)
      setLoading(false)
    }
    fetchMember()
  }, [id])

  if (loading) {
    return (
      <div className="text-gray-900 min-h-screen pt-20 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!member) {
    return (
      <div className="text-gray-900 min-h-screen pt-20 flex items-center justify-center flex-col gap-4">
        <div className="text-xl">Member not found</div>
        <Link to="/team" className="text-blue-600 hover:underline">
          Back to Team
        </Link>
      </div>
    )
  }

  return (
    <div className="text-gray-900 min-h-screen pt-20 pb-20">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 py-16 mb-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff15_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="max-w-6xl mx-auto px-4 relative">
          <Link
            to="/team"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Team
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{member.name}</h1>
          <p className="text-xl text-white/90">{member.position}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Image Card */}
          <div className="md:col-span-1">
            <Card className="bg-gray-800/90 backdrop-blur-sm border-gray-700 overflow-hidden shadow-xl sticky top-24">
              <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-b from-gray-700 to-gray-800">
                <img
                  src={member.image_url || '/placeholder.svg'}
                  alt={member.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold text-white mb-2">{member.name}</h1>
                <p className="text-blue-400 font-semibold mb-2">{member.position}</p>
                <p className="text-gray-300 text-sm mb-4">
                  {member.year} • {member.department}
                </p>

                {/* Social Links */}
                <div className="flex gap-3 mt-4">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="p-2 bg-gray-700 hover:bg-blue-500 text-white rounded-lg transition-colors"
                      title="Email"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                  )}
                  {member.linkedin_url && (
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-700 hover:bg-blue-500 text-white rounded-lg transition-colors"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {member.github_url && (
                    <a
                      href={member.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-700 hover:bg-blue-500 text-white rounded-lg transition-colors"
                      title="GitHub"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Personal Quote - Always show if available */}
            {member.personal_quote && (
              <Card className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <span className="text-6xl text-white/30 leading-none">"</span>
                    <p className="text-white text-xl md:text-2xl italic flex-1 pt-2">
                      {member.personal_quote}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white/60 backdrop-blur-sm border-gray-200 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{member.year}</div>
                  <div className="text-sm text-gray-600">Academic Year</div>
                </CardContent>
              </Card>
              <Card className="bg-white/60 backdrop-blur-sm border-gray-200 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-lg font-bold text-purple-600 mb-2">{member.department}</div>
                  <div className="text-sm text-gray-600">Department</div>
                </CardContent>
              </Card>
            </div>

            {/* About Section */}
            {member.about_us ? (
              <Card className="bg-white/60 backdrop-blur-sm border-gray-200 shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <span className="w-1 h-8 bg-blue-600 rounded-full"></span>
                    About Me
                  </h2>
                  <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                    {member.about_us}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/60 backdrop-blur-sm border-gray-200 shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <span className="w-1 h-8 bg-blue-600 rounded-full"></span>
                    About Me
                  </h2>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {member.name} is a dedicated member of the SAKEC ACM Student Chapter, serving as {member.position}. 
                    As a {member.year} student in the {member.department} department, they contribute to the chapter's 
                    mission of advancing computing as a science and profession.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Skills Section */}
            {member.skills && member.skills.length > 0 ? (
              <Card className="bg-white/60 backdrop-blur-sm border-gray-200 shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <span className="w-1 h-8 bg-purple-600 rounded-full"></span>
                    Skills & Expertise
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {member.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-shadow"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/60 backdrop-blur-sm border-gray-200 shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <span className="w-1 h-8 bg-purple-600 rounded-full"></span>
                    Role & Responsibilities
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2">Leadership</h3>
                      <p className="text-gray-700 text-sm">Contributing to team coordination and chapter activities</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h3 className="font-semibold text-purple-900 mb-2">Innovation</h3>
                      <p className="text-gray-700 text-sm">Driving technical excellence and creative solutions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Achievements Section */}
            {member.achievements && member.achievements.length > 0 ? (
              <Card className="bg-white/60 backdrop-blur-sm border-gray-200 shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <span className="w-1 h-8 bg-green-600 rounded-full"></span>
                    Achievements & Milestones
                  </h2>
                  <ul className="space-y-4">
                    {member.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                        <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </span>
                        <span className="text-gray-700 text-lg">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/60 backdrop-blur-sm border-gray-200 shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <span className="w-1 h-8 bg-green-600 rounded-full"></span>
                    Contributions
                  </h2>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    As {member.position}, {member.name} plays a vital role in organizing events, 
                    fostering collaboration, and promoting technical excellence within the ACM chapter.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
