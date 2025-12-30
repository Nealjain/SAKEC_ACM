import { useEffect, useState } from 'react'
import { getUpcomingEvents, getPastEvents, type Event } from '@/lib/events'
import { EventCard } from '@/components/event-card'
import { Card, CardContent } from "@/components/ui/card"

export default function Events() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [pastEvents, setPastEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [upcoming, past] = await Promise.all([
          getUpcomingEvents(),
          getPastEvents()
        ])
        setUpcomingEvents(upcoming)
        setPastEvents(past)
      } catch (error) {
        console.error("Failed to fetch events", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="text-gray-900 min-h-screen pt-20 flex items-center justify-center">
        <div className="text-xl">Loading events...</div>
      </div>
    )
  }

  return (
    <div className="text-gray-900 min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">Events</h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            Discover our upcoming workshops, competitions, and networking opportunities
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* Upcoming Events */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Upcoming Events</h2>
            <div className="h-px bg-gray-300 flex-1 ml-8" />
          </div>

          {upcomingEvents.length === 0 ? (
            <Card className="bg-white/60 backdrop-blur-sm border-gray-200 shadow-lg">
              <CardContent className="p-8 text-center">
                <p className="text-gray-700">No upcoming events at the moment. Check back soon!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>

        {/* Past Events */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Past Events</h2>
            <div className="h-px bg-gray-300 flex-1 ml-8" />
          </div>

          {pastEvents.length === 0 ? (
            <Card className="bg-white/60 backdrop-blur-sm border-gray-200 shadow-lg">
              <CardContent className="p-8 text-center">
                <p className="text-gray-700">No past events to display.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
