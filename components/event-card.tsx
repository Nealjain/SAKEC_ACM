"use client"

import Image from "next/image"
import { Calendar, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Event } from "@/lib/events"
import { EventDetailsDialog } from "./event-details-dialog"

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <EventDetailsDialog
      event={event}
      trigger={
        <Card className="bg-gray-900/70 border-gray-800 text-white hover:shadow-lg transition cursor-pointer">
          {/* Image */}
          <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
            <Image
              src={event.image_url || "/placeholder.svg"}
              alt={event.title}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <CardHeader>
            <CardTitle className="text-lg font-bold line-clamp-2">{event.title}</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center text-gray-400 text-sm mb-2">
              <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">{formatDate(eventDate)}</span>
            </div>
            <div className="flex items-center text-gray-400 text-sm">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          </CardContent>
        </Card>
      }
    />
  )
}
