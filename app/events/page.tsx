import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {EventCard} from "@/components/event-card"
import { getUpcomingEvents, getPastEvents, getEvents } from "@/lib/events"

async function UpcomingEvents() {
  const upcomingEvents = await getUpcomingEvents()
  const allEvents = await getEvents()

  if (upcomingEvents.length === 0) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-8 text-center">
          <p className="text-gray-400">No upcoming events at the moment. Check back soon!</p>
          <p className="text-gray-500 text-sm mt-2">Total events in database: {allEvents.length}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {upcomingEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}

async function PastEvents() {
  const pastEvents = await getPastEvents()
  const allEvents = await getEvents()

  if (pastEvents.length === 0) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-8 text-center">
          <p className="text-gray-400">No past events to display.</p>
          <p className="text-gray-500 text-sm mt-2">Total events in database: {allEvents.length}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {pastEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}

function EventsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="bg-gray-900/70 border-gray-800">
          <div className="h-48 bg-gray-800 animate-pulse" />
          <CardContent className="p-6">
            <div className="h-6 bg-gray-800 rounded animate-pulse mb-3" />
            <div className="h-4 bg-gray-800 rounded animate-pulse mb-2" />
            <div className="h-4 bg-gray-800 rounded animate-pulse mb-4 w-3/4" />
            <div className="space-y-2 mb-6">
              <div className="h-4 bg-gray-800 rounded animate-pulse" />
              <div className="h-4 bg-gray-800 rounded animate-pulse" />
              <div className="h-4 bg-gray-800 rounded animate-pulse" />
            </div>
            <div className="h-10 bg-gray-800 rounded animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function EventsPage() {
  return (
    <div className="text-white min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Events</h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            Discover our upcoming workshops, competitions, and networking opportunities
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* Upcoming Events */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Upcoming Events</h2>
            <div className="h-px bg-gray-800 flex-1 ml-8" />
          </div>

          <Suspense fallback={<EventsSkeleton />}>
            <UpcomingEvents />
          </Suspense>
        </section>

        {/* Past Events */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Past Events</h2>
            <div className="h-px bg-gray-800 flex-1 ml-8" />
          </div>

          <Suspense fallback={<EventsSkeleton />}>
            <PastEvents />
          </Suspense>
        </section>
      </div>
    </div>
  )
}
