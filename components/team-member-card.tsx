import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { TeamMember } from "@/lib/team"

interface TeamMemberCardProps {
  member: TeamMember
}

export default function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <Card className="bg-gray-900 border-gray-800 hover:border-blue-500/50 transition-all duration-300 overflow-hidden group h-full flex flex-col">
      {/* Image Section */}
      <div className="relative w-full h-72 overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900">
        <Image
          src={member.image_url || "/placeholder.svg"}
          alt={member.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
      </div>

      {/* Content Section */}
      <CardContent className="p-5 flex-1 flex flex-col">
        <div className="text-center mb-4 flex-1">
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{member.name}</h3>
          <p className="text-blue-400 font-semibold text-sm mb-2">{member.position}</p>
          <p className="text-gray-400 text-xs">
            {member.year} • {member.department}
          </p>
        </div>
        <Link href={`/team/${member.id}`} className="block">
          <Button
            variant="outline"
            className="w-full border-blue-500/30 text-white hover:bg-blue-500/10 hover:border-blue-500 bg-transparent transition-all"
          >
            View Profile
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
