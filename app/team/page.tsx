import Link from "next/link"
import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import TeamMemberCard from "@/components/team-member-card"
import FacultyMemberCard from "@/components/faculty-member-card"
import { getTeamMembers } from "@/lib/team"
import { getFacultyMembers } from "@/lib/faculty"

async function FacultyMembers() {
  const faculty = await getFacultyMembers()
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {faculty.map((member) => (
        <FacultyMemberCard key={member.id} member={member} />
      ))}
    </div>
  )
}

async function CoreTeam() {
  const members = await getTeamMembers()

  if (!members || members.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No team members found. Please add members in the admin panel.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {members.map((member) => (
        <TeamMemberCard key={member.id} member={member} />
      ))}
    </div>
  )
}

function FacultySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {[...Array(2)].map((_, i) => (
        <Card key={i} className="bg-gray-900 border-gray-800 h-full">
          <div className="h-64 bg-gray-800 animate-pulse" />
          <CardContent className="p-4">
            <div className="text-center mb-3">
              <div className="h-5 bg-gray-800 rounded animate-pulse mb-2" />
              <div className="h-4 bg-gray-800 rounded animate-pulse mb-1 w-3/4 mx-auto" />
              <div className="h-3 bg-gray-800 rounded animate-pulse w-1/2 mx-auto" />
            </div>
            <div className="h-8 bg-gray-800 rounded animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function TeamSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <Card key={i} className="bg-gray-900 border-gray-800 h-full">
          <div className="h-64 bg-gray-800 animate-pulse" />
          <CardContent className="p-4">
            <div className="text-center mb-3">
              <div className="h-5 bg-gray-800 rounded animate-pulse mb-2" />
              <div className="h-4 bg-gray-800 rounded animate-pulse mb-1 w-3/4 mx-auto" />
              <div className="h-3 bg-gray-800 rounded animate-pulse w-1/2 mx-auto" />
            </div>
            <div className="h-8 bg-gray-800 rounded animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function TeamPage() {
  return (
    <div className="text-white min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Team</h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            Meet the passionate individuals driving innovation and excellence in our ACM chapter
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* Faculty Members */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Faculty Members</h2>
            <div className="h-px bg-gray-800 flex-1 ml-8" />
          </div>

          <Suspense fallback={<FacultySkeleton />}>
            <FacultyMembers />
          </Suspense>
        </section>
        
        {/* Core Team */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Core Team</h2>
            <div className="h-px bg-gray-800 flex-1 ml-8" />
          </div>

          <Suspense fallback={<TeamSkeleton />}>
            <CoreTeam />
          </Suspense>
        </section>

        {/* Alumni Section */}
        <section className="mt-16 text-center">
          <Link
            href="/team/alumni"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gray-800 border border-gray-700 text-white font-semibold rounded-lg hover:bg-gray-700 hover:border-gray-600 transition-all"
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
          <Card className="bg-gray-900/70 border-gray-800">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Want to Join Our Team?</h2>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                We're always looking for passionate students to join our mission of advancing computer science education
                and innovation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition-colors"
                >
                  Get in Touch
                </Link>
                <Link
                  href="/why-join"
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-700 text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
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
