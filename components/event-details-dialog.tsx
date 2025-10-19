"use client"

import Image from "next/image"
import { Calendar, Clock, MapPin, Users, User, Share2, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Event } from "@/lib/events"

interface EventDetailsDialogProps {
  event: Event
  trigger: React.ReactNode
}

export function EventDetailsDialog({ event, trigger }: EventDetailsDialogProps) {
  const eventDate = new Date(event.date)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleShare = async () => {
    const shareData = {
      title: event.title,
      text: `${event.title} - ${formatDate(eventDate)} at ${event.location}`,
      url: window.location.href
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        // Share cancelled
      }
    } else {
      navigator.clipboard.writeText(shareData.url)
      alert('Event link copied to clipboard!')
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-3xl bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{event.title}</DialogTitle>
        </DialogHeader>

        {/* Horizontal layout */}
        <div className="flex flex-col md:flex-row gap-6 mt-4">
          {/* Left: Image */}
          <div className="relative w-full md:w-1/2 h-56 md:h-auto overflow-hidden rounded-md bg-gray-800">
            <Image
              src={event.image_url || "/placeholder.svg"}
              alt={event.title}
              fill
              className="object-contain"
            />
          </div>

          {/* Right: Details */}
          <div className="flex-1 space-y-4">
            {/* Category Badge */}
            {event.category && (
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-400" />
                <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 border-blue-600/30">
                  {event.category}
                </Badge>
              </div>
            )}

            {/* Date */}
            <div className="flex items-center text-gray-300">
              <Calendar className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>{formatDate(eventDate)}</span>
            </div>

            {/* Time */}
            {event.time && (
              <div className="flex items-center text-gray-300">
                <Clock className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>{event.time}</span>
              </div>
            )}

            {/* Location */}
            {event.location && (
              <div className="flex items-center text-gray-300">
                <MapPin className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>{event.location}</span>
              </div>
            )}

            {/* Faculty Coordinator */}
            {event["Faculty Co-ordinator"] && (
              <div className="flex items-center text-gray-300">
                <User className="w-5 h-5 mr-2 flex-shrink-0" />
                <div>
                  <span className="text-xs text-gray-500">Faculty Coordinator</span>
                  <p className="text-sm">{event["Faculty Co-ordinator"]}</p>
                </div>
              </div>
            )}

            {/* Participants */}
            {event.max_participants && (
              <div className="flex items-center text-gray-300">
                <Users className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>
                  {event.current_participants || 0} / {event.max_participants} participants
                </span>
              </div>
            )}

            {/* Description */}
            {event.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{event.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex justify-between items-center gap-3 mt-6">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-700 text-white hover:bg-gray-800 bg-transparent gap-2"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" />
            Share Event
          </Button>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800 bg-transparent"
              onClick={() =>
                (document.querySelector('[data-state="open"] button[data-slot="dialog-close"]') as HTMLButtonElement)?.click()
              }
            >
              Close
            </Button>

            {event.registration_link && new Date(event.date) > new Date() && (
              <Button asChild className="bg-blue-600 text-white hover:bg-blue-700">
                <a
                  href={event.registration_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Register Now
                </a>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
