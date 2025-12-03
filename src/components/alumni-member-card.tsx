
import { Card, CardContent } from "@/components/ui/card"
import type { AlumniMember } from "@/lib/alumni"

interface AlumniMemberCardProps {
  member: AlumniMember
}

export default function AlumniMemberCard({ member }: AlumniMemberCardProps) {
  return (
    <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-300 overflow-hidden group h-full">
      {/* Image Section */}
      <div className="relative w-full h-64 overflow-hidden bg-gray-900">
        <img
          src={member.image_url || "/placeholder.svg"}
          alt={member.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content Section */}
      <CardContent className="p-4">
        <div className="text-center">
          <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
          <p className="text-blue-400 font-medium">{member.position}</p>
          <div className="text-gray-400 text-sm mt-1">
            <p>{member.department}</p>
            {member.bio && (
              <p className="mt-1 line-clamp-2 text-xs">
                {member.bio}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
