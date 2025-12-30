import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Users, UserPlus, QrCode, ArrowLeft, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAdminAuth } from '../hooks/useAdminAuth';
import SendEventAttendanceQR from '../components/admin/SendEventAttendanceQR';
import EventAttendanceViewer from '../components/admin/EventAttendanceViewer';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}

export default function EventManagement() {
  const { isAuthenticated, loading: authLoading } = useAdminAuth();
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-xl text-gray-900">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }
  const [activeTab, setActiveTab] = useState<'overview' | 'participants' | 'volunteers' | 'team'>('overview');
  const [stats, setStats] = useState({
    participants: 0,
    volunteers: 0,
    team: 0,
    totalPresent: 0,
  });

  useEffect(() => {
    if (eventId) {
      const loadData = async () => {
        setLoading(true);
        await Promise.all([loadEvent(), loadStats()]);
        setLoading(false);
      };
      loadData();
    }
  }, [eventId]);

  const loadEvent = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (!error && data) {
      setEvent(data);
    }
  };

  const loadStats = async () => {
    const [
      { count: participantsCount },
      { count: volunteersCount },
      { count: teamCount },
      { count: presentCount }
    ] = await Promise.all([
      // Get participants count
      supabase
        .from('event_registrations')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId),

      // Get volunteers count
      supabase
        .from('event_volunteers')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId),

      // Get team attendance count
      supabase
        .from('event_attendance')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .eq('attendee_type', 'team'),

      // Get currently present
      supabase
        .from('event_attendance')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .is('check_out_time', null)
    ]);

    setStats({
      participants: participantsCount || 0,
      volunteers: volunteersCount || 0,
      team: teamCount || 0,
      totalPresent: presentCount || 0,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-xl text-gray-900">Loading event...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-900 mb-4">Event not found</p>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  {event.time && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {event.time}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => navigate(`/admin/event/${eventId}/scanner`)}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition-all"
              >
                <QrCode className="w-5 h-5" />
                Open QR Scanner
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Participants</p>
                <p className="text-2xl font-bold text-gray-900">{stats.participants}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <UserPlus className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Volunteers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.volunteers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Team Members</p>
                <p className="text-2xl font-bold text-gray-900">{stats.team}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Currently Present</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPresent}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 font-semibold border-b-2 transition-colors ${activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('participants')}
                className={`px-6 py-4 font-semibold border-b-2 transition-colors ${activeTab === 'participants'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
              >
                Participants ({stats.participants})
              </button>
              <button
                onClick={() => setActiveTab('volunteers')}
                className={`px-6 py-4 font-semibold border-b-2 transition-colors ${activeTab === 'volunteers'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
              >
                Volunteers ({stats.volunteers})
              </button>
              <button
                onClick={() => setActiveTab('team')}
                className={`px-6 py-4 font-semibold border-b-2 transition-colors ${activeTab === 'team'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
              >
                Team ({stats.team})
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">Event Overview</h3>
                <p className="text-gray-700">{event.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Quick Actions</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => setActiveTab('participants')}
                        className="w-full text-left px-4 py-2 bg-white hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        Manage Participant Attendance
                      </button>
                      <button
                        onClick={() => setActiveTab('volunteers')}
                        className="w-full text-left px-4 py-2 bg-white hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        Manage Volunteer Attendance
                      </button>
                      <button
                        onClick={() => setActiveTab('team')}
                        className="w-full text-left px-4 py-2 bg-white hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        Manage Team Attendance
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'participants' && (
              <div className="space-y-6">
                <SendEventAttendanceQR eventId={eventId!} attendeeType="participant" />
                <EventAttendanceViewer eventId={eventId!} attendeeType="participant" />
              </div>
            )}

            {activeTab === 'volunteers' && (
              <div className="space-y-6">
                <SendEventAttendanceQR eventId={eventId!} attendeeType="volunteer" />
                <EventAttendanceViewer eventId={eventId!} attendeeType="volunteer" />
              </div>
            )}

            {activeTab === 'team' && (
              <div className="space-y-6">
                <SendEventAttendanceQR eventId={eventId!} attendeeType="team" />
                <EventAttendanceViewer eventId={eventId!} attendeeType="team" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
