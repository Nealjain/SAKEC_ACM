import { useEffect, useState } from 'react'

import AlumniMemberCard from "@/components/alumni-member-card"
import { getAlumniMembers, type AlumniMember } from "@/lib/alumni"

export default function Alumni() {
    const [alumniMembers, setAlumniMembers] = useState<AlumniMember[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const alumni = await getAlumniMembers()
                setAlumniMembers(alumni)
            } catch (error) {
                console.error("Failed to fetch alumni data", error)
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

    return (
        <div className="text-gray-900 min-h-screen pt-20">
            {/* Hero Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">Our Alumni</h1>
                    <p className="text-xl text-gray-700 leading-relaxed">
                        Celebrating the legacy and achievements of our past members
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 pb-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {alumniMembers.map((member) => (
                        <AlumniMemberCard key={member.id} member={member} />
                    ))}
                </div>

                {alumniMembers.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-700 text-lg">No alumni members found.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
