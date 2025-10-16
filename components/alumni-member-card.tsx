import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { slugify } from "@/lib/utils"
import type { AlumniMember } from "@/lib/alumni"

interface AlumniMemberCardProps {
  member: AlumniMember
}

export default function AlumniMemberCard({ member }: AlumniMemberCardProps) {
  const slug = slugify(member.name)
  return (
    <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-300 overflow-hidden group h-full">
      <Link href={`/team/alumni/${slug}`} className="block">
        {/* Image Section */}
        <div className="relative w-full h-64 overflow-hidden bg-gray-900">
          <Image
            src={member.image_url || "/placeholder.svg"}
            alt={member.name}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        </div>

        {/* Content Section */}
        <CardContent className="p-4">
          <div className="text-center mb-3">
            <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
            <p className="text-blue-400 font-medium">{member.position}</p>
            <div className="text-gray-400 text-sm mt-1">
              <p>Class of {member.graduation_year} • {member.department}</p>
              {(member.current_company || member.current_role) && (
                <p className="mt-1">
                  {member.current_role}{member.current_company ? ` at ${member.current_company}` : ''}
                </p>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full border-gray-700 text-white hover:bg-gray-800 bg-transparent"
          >
            View Profile
          </Button>
        </CardContent>
      </Link>
    </Card>
  )
}
