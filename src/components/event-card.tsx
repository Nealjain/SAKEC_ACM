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
        <Card className="bg-white/60 backdrop-blur-sm border-gray-200 text-gray-900 hover:shadow-xl hover:border-blue-300 transition-all cursor-pointer group">
          {/* Image */}
          <div className="relative w-full h-48 overflow-hidden rounded-t-lg bg-gray-100">
            <img
              src={event.image_url || "/placeholder.svg"}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <CardHeader>
            <CardTitle className="text-lg font-bold line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors">
              {event.title}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center text-gray-700 text-sm mb-2">
              <Calendar className="w-4 h-4 mr-2 flex-shrink-0 text-blue-600" />
              <span className="truncate">{formatDate(eventDate)}</span>
            </div>
            <div className="flex items-center text-gray-700 text-sm">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0 text-purple-600" />
              <span className="truncate">{event.location}</span>
            </div>
          </CardContent>
        </Card>
      }
    />
  )
}
