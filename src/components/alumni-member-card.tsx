import { Card, CardContent } from "@/components/ui/card"
import type { AlumniMember } from "@/lib/alumni"
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card"

interface AlumniMemberCardProps {
  member: AlumniMember
}

export default function AlumniMemberCard({ member }: AlumniMemberCardProps) {
  return (
    <>
      {/* Desktop 3D Card */}
      <div className="hidden md:block h-full">
        <CardContainer className="inter-var w-full">
          <CardBody className="bg-black/25 relative group/card hover:shadow-2xl hover:shadow-blue-500/30 border-gray-600/30 hover:border-blue-500/50 w-full h-full rounded-xl border transition-all duration-300 flex flex-col">
            <CardItem translateZ="100" className="w-full">
              <div className="relative w-full h-64 overflow-hidden bg-gray-800/30 rounded-t-xl">
                <img
                  src={member.image_url || "/placeholder.svg"}
                  alt={member.name}
                  className="absolute inset-0 w-full h-full object-contain group-hover/card:scale-105 transition-transform duration-500"
                />
              </div>
            </CardItem>

            <CardContent className="p-4 bg-gray-900/80 flex-1">
              <div className="text-center">
                <CardItem translateZ="50" className="w-full">
                  <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                </CardItem>
                <CardItem translateZ="60" className="w-full">
                  <p className="text-blue-400 font-medium">{member.position}</p>
                </CardItem>
                <CardItem translateZ="40" className="w-full">
                  <div className="text-gray-300 text-sm mt-1">
                    <p>{member.department}</p>
                    {member.bio && (
                      <p className="mt-1 line-clamp-2 text-xs">
                        {member.bio}
                      </p>
                    )}
                  </div>
                </CardItem>
              </div>
            </CardContent>
          </CardBody>
        </CardContainer>
      </div>

      {/* Mobile Regular Card */}
      <div className="md:hidden">
        <Card className="bg-black/25 border-gray-600/30 hover:border-blue-500/50 transition-all duration-300 overflow-hidden group h-full shadow-xl">
          {/* Image Section */}
          <div className="relative w-full h-64 overflow-hidden bg-gray-800/30">
            <img
              src={member.image_url || "/placeholder.svg"}
              alt={member.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Content Section */}
          <CardContent className="p-4 bg-gray-900/80">
            <div className="text-center">
              <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
              <p className="text-blue-400 font-medium">{member.position}</p>
              <div className="text-gray-300 text-sm mt-1">
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
      </div>
    </>
  )
}
