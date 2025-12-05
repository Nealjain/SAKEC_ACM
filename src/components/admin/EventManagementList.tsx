import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, TrendingUp, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
}

interface EventStats {
  participants: number;
  volunteers: number;
  team: number;
  currentlyPresent: number;
}

export default function EventManagementList() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [eventStats, setEventStats] = useState<Record<string, EventStats>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    
    // Get all events
    const { data: eventsData } = await supabase
      .from('events')
      .select('id, title, date, time, location')
      .order('date', { ascending: false });

    if (eventsData) {
      setEvents(eventsData);
      
      // Load stats for each event
      const stats: Record<string, EventStats> = {};
      for (const event of eventsData) {
        stats[event.id] = await loadEventStats(event.id);
      }
      setEventStats(stats);
    }
    
    setLoading(false);
  };

  const loadEventStats = async (eventId: string): Promise<EventStats> => {
    // Get participants count
    const { count: participantsCount } = await supabase
      .from('event_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId);

    // Get volunteers count
    const { count: volunteersCount } = await supabase
      .from('event_volunteers')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId);

    // Get team attendance count
    const { count: teamCount } = await supabase
      .from('event_attendance')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)
      .eq('attendee_type', 'team');

    // Get currently present
    const { count: presentCount } = await supabase
      .from('event_attendance')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)
      .is('check_out_time', null);

    return {
      participants: participantsCount || 0,
      volunteers: volunteersCount || 0,
      team: teamCount || 0,
      currentlyPresent: presentCount || 0,
    };
  };

  const isUpcoming = (dateStr: string) => {
    return new Date(dateStr) >= new Date();
  };

  const isPast = (dateStr: string) => {
    return new Date(dateStr) < new Date();
  };

  const upcomingEvents = events.filter(e => isUpcoming(e.date));
  const pastEvents = events.filter(e => isPast(e.date));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Event Management</h2>
          <p className="text-gray-600 mt-1">Manage attendance and track event participation</p>
        </div>
      </div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Upcoming Events ({upcomingEvents.length})
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {upcomingEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                stats={eventStats[event.id]}
                onManage={() => navigate(`/admin/event/${event.id}`)}
                isUpcoming={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            Past Events ({pastEvents.length})
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {pastEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                stats={eventStats[event.id]}
                onManage={() => navigate(`/admin/event/${event.id}`)}
                isUpcoming={false}
              />
            ))}
          </div>
        </div>
      )}

      {events.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">No events found</p>
          <p className="text-gray-500 text-sm mt-2">Create events in the Events tab first</p>
        </div>
      )}
    </div>
  );
}

interface EventCardProps {
  event: Event;
  stats?: EventStats;
  onManage: () => void;
  isUpcoming: boolean;
}

function EventCard({ event, stats, onManage, isUpcoming }: EventCardProps) {
  const totalAttendees = (stats?.participants || 0) + (stats?.volunteers || 0) + (stats?.team || 0);
  
  return (
    <div className={`bg-white rounded-xl p-6 border-2 shadow-sm hover:shadow-md transition-all ${
      isUpcoming ? 'border-green-200 hover:border-green-300' : 'border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
            {isUpcoming && (
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                Upcoming
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(event.date).toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </div>
            {event.time && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {event.time}
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-2">
                📍 {event.location}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-900">Participants</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{stats?.participants || 0}</p>
            </div>

            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-900">Volunteers</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{stats?.volunteers || 0}</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-medium text-purple-900">Team</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{stats?.team || 0}</p>
            </div>

            <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-orange-600" />
                <span className="text-xs font-medium text-orange-900">Present</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">{stats?.currentlyPresent || 0}</p>
            </div>
          </div>
        </div>

        <div className="ml-6 flex flex-col gap-2">
          <button
            onClick={onManage}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all whitespace-nowrap"
          >
            <Users className="w-5 h-5" />
            Manage Event
          </button>
          
          {totalAttendees > 0 && (
            <div className="text-center text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
              <span className="font-semibold text-gray-900">{totalAttendees}</span> total
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
