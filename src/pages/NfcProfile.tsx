import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Linkedin, Github, Mail, Award, Code } from 'lucide-react'
import { getTeamMemberById } from '../lib/team'
import type { TeamMember } from '../lib/types'

export default function NfcProfile() {
  const { id } = useParams<{ id: string }>()
  const [member, setMember] = useState<TeamMember | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      getTeamMemberById(id).then((data) => {
        setMember(data)
        setLoading(false)
      })
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-900">Loading profile...</div>
      </div>
    )
  }

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">Profile Not Found</h1>
          <p className="text-gray-700">This NFC card is not registered.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-gray-200 shadow-xl">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Profile Image */}
            {member.image_url && (
              <div className="relative">
                <img
                  src={member.image_url}
                  alt={member.name}
                  className="w-48 h-48 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full p-3 shadow-lg">
                  <Award size={24} />
                </div>
              </div>
            )}

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gray-900">{member.name}</h1>
              <p className="text-2xl text-blue-600 mb-4 font-semibold">{member.position}</p>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-6">
                {member.department && (
                  <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    {member.department}
                  </span>
                )}
                {member.year && (
                  <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    Year: {member.year}
                  </span>
                )}
              </div>

              {member.personal_quote && (
                <blockquote className="italic text-gray-700 bg-blue-50 border-l-4 border-blue-500 pl-4 py-3 my-6 rounded-r-lg">
                  "{member.personal_quote}"
                </blockquote>
              )}

              {member.about_us && (
                <p className="text-gray-800 mb-6 leading-relaxed text-lg">{member.about_us}</p>
              )}

              {/* Social Links */}
              <div className="flex gap-3 justify-center md:justify-start">
                {member.linkedin_url && (
                  <a
                    href={member.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-105"
                    title="LinkedIn"
                  >
                    <Linkedin size={24} />
                  </a>
                )}
                {member.github_url && (
                  <a
                    href={member.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-105"
                    title="GitHub"
                  >
                    <Github size={24} />
                  </a>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-105"
                    title="Email"
                  >
                    <Mail size={24} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Skills */}
          {member.skills && member.skills.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Code className="text-blue-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {member.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {member.achievements && member.achievements.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Award className="text-yellow-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Achievements</h2>
              </div>
              <ul className="space-y-3">
                {member.achievements.map((achievement, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                    <span className="text-yellow-600 mt-1 font-bold">•</span>
                    <span className="text-gray-800">{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
