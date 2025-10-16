import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import AlumniMemberCard from "@/components/alumni-member-card"
import { getAlumniMembers } from "@/lib/alumni"

async function AlumniTeam() {
  const alumni = await getAlumniMembers()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {alumni.length > 0 ? (
        alumni.map((member) => <AlumniMemberCard key={member.id} member={member} />)
      ) : (
        <div className="col-span-full text-center py-10">
          <p className="text-xl text-gray-400">No alumni members found. Check back soon!</p>
        </div>
      )}
    </div>
  )
}

function AlumniSkeleton() {
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

export default function AlumniPage() {
  return (
    <div className="text-white min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Alumni</h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            Meet our distinguished alumni who continue to make an impact in the tech industry
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Alumni Members</h2>
            <div className="h-px bg-gray-800 flex-1 ml-8" />
          </div>

          <Suspense fallback={<AlumniSkeleton />}>
            <AlumniTeam />
          </Suspense>
        </section>
      </div>
    </div>
  )
}