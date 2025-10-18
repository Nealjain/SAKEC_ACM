"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { TeamMember } from "@/lib/team"
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card"

interface TeamMemberCardProps {
  member: TeamMember
}

export default function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <>
      {/* Desktop 3D Card */}
      <div className="hidden md:block h-full">
        <CardContainer className="inter-var w-full">
          <CardBody className="bg-gray-900 relative group/card dark:hover:shadow-2xl dark:hover:shadow-blue-500/[0.1] border-gray-800 hover:border-blue-500/50 w-full h-full rounded-xl border transition-all duration-300 flex flex-col">
            <CardItem translateZ="100" className="w-full">
              <div className="relative w-full h-72 overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900 rounded-t-xl">
                <Image
                  src={member.image_url || "/placeholder.svg"}
                  alt={member.name}
                  fill
                  className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
              </div>
            </CardItem>

            <div className="p-5 flex-1 flex flex-col">
              <div className="flex-1">
                <CardItem translateZ="50" className="text-center mb-2 w-full">
                  <h3 className="text-xl font-bold text-white line-clamp-2">{member.name}</h3>
                </CardItem>
                
                <CardItem translateZ="60" className="text-center mb-2 w-full">
                  <p className="text-blue-400 font-semibold text-sm">{member.position}</p>
                </CardItem>
                
                <CardItem translateZ="40" className="text-center mb-4 w-full">
                  <p className="text-gray-400 text-xs">
                    {member.year} • {member.department}
                  </p>
                </CardItem>
              </div>

              <CardItem translateZ={20} className="w-full">
                <Link href={`/team/${member.id}`} className="block w-full">
                  <Button
                    variant="outline"
                    className="w-full border-blue-500/30 text-white hover:bg-blue-500/10 hover:border-blue-500 bg-transparent transition-all"
                  >
                    View Profile
                  </Button>
                </Link>
              </CardItem>
            </div>
          </CardBody>
        </CardContainer>
      </div>

      {/* Mobile Regular Card */}
      <div className="md:hidden">
        <Card className="bg-gray-900 border-gray-800 hover:border-blue-500/50 transition-all duration-300 overflow-hidden group h-full flex flex-col">
          <div className="relative w-full h-72 overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900">
            <Image
              src={member.image_url || "/placeholder.svg"}
              alt={member.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
          </div>

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
      </div>
    </>
  )
}
