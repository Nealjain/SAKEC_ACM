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
        <div className="text-xl">Loading profile...</div>
      </div>
    )
  }

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-gray-400">This NFC card is not registered.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl p-8 border border-white/10">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Profile Image */}
            {member.image_url && (
              <img
                src={member.image_url}
                alt={member.name}
                className="w-48 h-48 rounded-full object-cover border-4 border-blue-500"
              />
            )}

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2">{member.name}</h1>
              <p className="text-2xl text-blue-400 mb-4">{member.position}</p>

              {member.department && (
                <p className="text-gray-400 mb-2">{member.department}</p>
              )}
              {member.year && (
                <p className="text-gray-400 mb-4">Year: {member.year}</p>
              )}

              {member.personal_quote && (
                <blockquote className="italic text-gray-300 border-l-4 border-blue-500 pl-4 my-6">
                  "{member.personal_quote}"
                </blockquote>
              )}

              {member.about_us && (
                <p className="text-gray-300 mb-6">{member.about_us}</p>
              )}

              {/* Social Links */}
              <div className="flex gap-4 justify-center md:justify-start mb-6">
                {member.linkedin_url && (
                  <a
                    href={member.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <Linkedin size={24} />
                  </a>
                )}
                {member.github_url && (
                  <a
                    href={member.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <Github size={24} />
                  </a>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="p-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    <Mail size={24} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Skills */}
          {member.skills && member.skills.length > 0 && (
            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Code className="text-blue-400" size={24} />
                <h2 className="text-2xl font-bold">Skills</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {member.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-lg text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {member.achievements && member.achievements.length > 0 && (
            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Award className="text-yellow-400" size={24} />
                <h2 className="text-2xl font-bold">Achievements</h2>
              </div>
              <ul className="space-y-2">
                {member.achievements.map((achievement, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-1">•</span>
                    <span className="text-gray-300">{achievement}</span>
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
