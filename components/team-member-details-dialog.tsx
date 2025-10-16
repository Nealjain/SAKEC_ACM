"use client"

import Image from "next/image"
import { GraduationCap, MapPin, User, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { TeamMember } from "@/lib/team"

interface TeamMemberDetailsDialogProps {
  member: TeamMember
  trigger: React.ReactNode
}

export function TeamMemberDetailsDialog({ member, trigger }: TeamMemberDetailsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-4xl bg-gray-900 border-gray-800 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{member.name}</DialogTitle>
        </DialogHeader>

        {/* Horizontal layout */}
        <div className="flex flex-col md:flex-row gap-6 mt-4">
          {/* Left: Image and Basic Info */}
          <div className="w-full md:w-1/3 space-y-4">
            <div className="relative w-full h-64 overflow-hidden rounded-md">
              <Image
                src={member.image_url || "/placeholder.svg"}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-3">
              <div className="text-center">
                <h3 className="text-xl font-bold text-white">{member.name}</h3>
                <p className="text-blue-400 font-medium">{member.position}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-gray-300">
                  <GraduationCap className="w-4 h-4 mr-3" />
                  <span className="text-sm">{member.year}</span>
                </div>

                <div className="flex items-center text-gray-300">
                  <MapPin className="w-4 h-4 mr-3" />
                  <span className="text-sm">{member.department}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="flex-1 space-y-6">
            {/* Personal Quote */}
            {member.personal_quote && (
              <div className="space-y-2">
                <div className="flex items-center text-lg font-semibold">
                  <Quote className="w-5 h-5 mr-2 text-blue-400" />
                  <span>Personal Quote</span>
                </div>
                <div className="bg-gray-800 p-4 rounded-md border-l-4 border-blue-400">
                  <p className="text-gray-300 italic">"{member.personal_quote}"</p>
                </div>
              </div>
            )}

            {/* About */}
            {member.about_us && (
              <div className="space-y-2">
                <div className="flex items-center text-lg font-semibold">
                  <User className="w-5 h-5 mr-2 text-green-400" />
                  <span>About</span>
                </div>
                <div className="bg-gray-800 p-4 rounded-md">
                  <p className="text-gray-300 leading-relaxed">{member.about_us}</p>
                </div>
              </div>
            )}

            {/* PRN */}
            {member.PRN && (
              <div className="space-y-2">
                <div className="text-lg font-semibold">PRN</div>
                <div className="bg-gray-800 p-3 rounded-md">
                  <p className="text-gray-300 font-mono">{member.PRN}</p>
                </div>
              </div>
            )}
          </div>
        </div>


      </DialogContent>
    </Dialog>
  )
}
