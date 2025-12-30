import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from "@/components/ui/card"
import TeamMemberCard from "@/components/team-member-card"
import FacultyMemberCard from "@/components/faculty-member-card"
import { getTeamMembers, type TeamMember } from "@/lib/team"
import { getFacultyMembers, type FacultyMember } from "@/lib/faculty"

export default function Team() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [facultyMembers, setFacultyMembers] = useState<FacultyMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [team, faculty] = await Promise.all([
          getTeamMembers(),
          getFacultyMembers()
        ])
        setTeamMembers(team)
        setFacultyMembers(faculty)
      } catch (error) {
        console.error("Failed to fetch team data", error)
        setError(error instanceof Error ? error.message : "Failed to fetch data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="text-gray-900 min-h-screen pt-20 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-gray-900 min-h-screen pt-20 flex items-center justify-center flex-col gap-4">
        <div className="text-xl text-red-500">Error: {error}</div>
        <p className="text-gray-700">Please check your internet connection and Supabase configuration.</p>
      </div>
    )
  }

  return (
    <div className="text-gray-900 min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">Our Team</h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            Meet the passionate individuals driving innovation and excellence in our ACM chapter
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* Faculty Members */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Faculty Members</h2>
            <div className="h-px bg-gray-300 flex-1 ml-8" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {facultyMembers.map((member) => (
              <FacultyMemberCard key={member.id} member={member} />
            ))}
          </div>
        </section>

        {/* Core Team */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Core Team</h2>
            <div className="h-px bg-gray-300 flex-1 ml-8" />
          </div>

          {teamMembers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-700 text-lg">No team members found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {teamMembers.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>
          )}
        </section>

        {/* Alumni Section */}
        <section className="mt-16 text-center">
          <Link
            to="/team/alumni"
            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 border border-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 hover:border-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            View Alumni
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </section>

        {/* Join Team CTA */}
        <section className="mt-20 text-center">
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200 shadow-lg">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Want to Join Our Team?</h2>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                We're always looking for passionate students to join our mission of advancing computer science education
                and innovation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors shadow-md"
                >
                  Get in Touch
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-900 font-medium rounded-md hover:bg-gray-100 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
