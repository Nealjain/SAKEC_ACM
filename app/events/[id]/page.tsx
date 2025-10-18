import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, MapPin, ExternalLink, ArrowLeft, Share2 } from "lucide-react"
import { getEventById, getEvents } from "@/lib/events"

interface EventPageProps {
  params: {
    id: string
  }
}

export async function generateStaticParams() {
  const events = await getEvents()
  
  return events.map((event) => ({
    id: event.id
  }))
}

export default async function EventPage({ params }: EventPageProps) {
  let event = null
  try {
    event = await getEventById(params.id)
  } catch (error) {
    // Error fetching event
  }

  if (!event) {
    notFound()
  }

  const eventDate = new Date(event.date)
  const eventTime = event.time ? event.time.slice(0, 5) : null
  const isUpcoming = eventDate >= new Date()

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="bg-black text-white min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-8 text-gray-400 hover:text-white">
          <Link href="/events">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Link>
        </Button>

        {/* Event Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                isUpcoming ? "bg-green-600 text-white" : "bg-gray-600 text-gray-300"
              }`}
            >
              {isUpcoming ? "Upcoming Event" : "Past Event"}
            </span>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">{event.title}</h1>

          <div className="flex flex-wrap gap-6 text-gray-300">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{formatDate(eventDate)}</span>
            </div>

            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>{eventTime}</span>
            </div>

            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>

        {/* Event Image */}
        <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
          <Image src={event.image_url || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">About This Event</h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed text-lg">{event.description}</p>
                </div>

                {/* Additional Event Details */}
                <div className="mt-8 pt-8 border-t border-gray-800">
                  <h3 className="text-xl font-semibold mb-4">What to Expect</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Interactive sessions with industry experts</li>
                    <li>• Hands-on learning opportunities</li>
                    <li>• Networking with fellow students and professionals</li>
                    <li>• Q&A sessions and open discussions</li>
                    <li>• Certificate of participation</li>
                  </ul>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-800">
                  <h3 className="text-xl font-semibold mb-4">Prerequisites</h3>
                  <p className="text-gray-300">
                    Basic understanding of computer science concepts. Bring your laptop and enthusiasm to learn!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            {event.registration_link && isUpcoming && (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Register Now</h3>
                  <p className="text-gray-400 mb-6">
                    Secure your spot for this exciting event. Limited seats available!
                  </p>
                  <Button asChild className="w-full bg-white text-black hover:bg-gray-200">
                    <Link href={event.registration_link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Register Now
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Event Details Card */}
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Event Details</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-300 mb-1">Date & Time</h4>
                    <p className="text-gray-400">
                      {formatDate(eventDate)} at {eventTime}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-300 mb-1">Location</h4>
                    <p className="text-gray-400">{event.location}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-300 mb-1">Organizer</h4>
                    <p className="text-gray-400">SAKEC ACM Student Chapter</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Questions?</h3>
                <p className="text-gray-400 mb-4">Have questions about this event? We're here to help!</p>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-gray-700 text-white hover:bg-gray-800 bg-transparent"
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
