"use client"

import Image from "next/image"
import { Calendar, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
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
          <div className="relative w-full md:w-1/2 h-56 md:h-auto overflow-hidden rounded-md">
            <Image
              src={event.image_url || "/placeholder.svg"}
              alt={event.title}
              fill
              className="object-contain"
            />
          </div>

          {/* Right: Details */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center text-gray-300">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{formatDate(eventDate)}</span>
            </div>

            {event.time && (
              <div className="flex items-center text-gray-300">
                <Clock className="w-5 h-5 mr-2" />
                <span>{event.time}</span>
              </div>
            )}

            <div className="flex items-center text-gray-300">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{event.location}</span>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Short Description</h3>
              <p className="text-gray-400">{event.description}</p>
            </div>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            className="border-gray-700 text-white hover:bg-gray-800 bg-transparent"
            onClick={() =>
              document
                .querySelector('[data-state="open"] button[data-slot="dialog-close"]')
                ?.click()
            }
          >
            Close
          </Button>

          {event.registration_link && new Date(event.date) >= new Date() && (
            <Button asChild className="bg-white text-black hover:bg-gray-200">
              <a
                href={event.registration_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Register
              </a>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
