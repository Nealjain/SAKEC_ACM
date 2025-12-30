import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, Mail, CheckCircle, Clock, TrendingUp } from 'lucide-react';

interface RegistrationSummary {
  total_forms: number;
  active_forms: number;
  total_registrations: number;
  emails_sent: number;
  recent_registrations: Array<{
    id: string;
    participant_name: string;
    participant_email: string;
    event_title: string;
    registration_date: string;
  }>;
}

export default function RegistrationOverview() {
  const [summary, setSummary] = useState<RegistrationSummary>({
    total_forms: 0,
    active_forms: 0,
    total_registrations: 0,
    emails_sent: 0,
    recent_registrations: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      // Get forms count
      const { data: forms } = await supabase
        .from('event_registration_forms')
        .select('id, is_active');

      const total_forms = forms?.length || 0;
      const active_forms = forms?.filter(f => f.is_active).length || 0;

      // Get registrations count
      const { data: registrations } = await supabase
        .from('event_registrations')
        .select('id, confirmation_sent');

      const total_registrations = registrations?.length || 0;
      const emails_sent = registrations?.filter(r => r.confirmation_sent).length || 0;

      // Get recent registrations with event details
      const { data: recentData } = await supabase
        .from('event_registrations')
        .select(`
          id,
          participant_name,
          participant_email,
          registration_date,
          event_id
        `)
        .order('registration_date', { ascending: false })
        .limit(5);

      // Fetch event titles for recent registrations
      const recent_registrations = [];
      if (recentData) {
        for (const reg of recentData) {
          const { data: event } = await supabase
            .from('events')
            .select('title')
            .eq('id', reg.event_id)
            .single();

          recent_registrations.push({
            ...reg,
            event_title: event?.title || 'Unknown Event'
          });
        }
      }

      setSummary({
        total_forms,
        active_forms,
        total_registrations,
        emails_sent,
        recent_registrations
      });
    } catch (error) {
      console.error('Failed to load registration summary:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <p className="text-gray-600">Loading registration overview...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Registration Overview</h2>
        <TrendingUp className="w-6 h-6 text-green-600" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-md">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">{summary.total_registrations}</span>
          </div>
          <p className="text-blue-100 text-sm">Total Registrations</p>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white shadow-md">
          <div className="flex items-center justify-between mb-2">
            <Mail className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">{summary.emails_sent}</span>
          </div>
          <p className="text-green-100 text-sm">Emails Sent</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white shadow-md">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">{summary.active_forms}</span>
          </div>
          <p className="text-purple-100 text-sm">Active Forms</p>
        </div>

        <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-6 text-white shadow-md">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">{summary.total_forms}</span>
          </div>
          <p className="text-orange-100 text-sm">Total Forms</p>
        </div>
      </div>

      {/* Recent Registrations */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Registrations</h3>
        {summary.recent_registrations.length === 0 ? (
          <p className="text-gray-500 text-sm">No registrations yet</p>
        ) : (
          <div className="space-y-3">
            {summary.recent_registrations.map((reg) => (
              <div
                key={reg.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100"
              >
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{reg.participant_name}</p>
                  <p className="text-gray-600 text-sm">{reg.participant_email}</p>
                  <p className="text-gray-500 text-xs mt-1">{reg.event_title}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-xs">
                    {new Date(reg.registration_date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {new Date(reg.registration_date).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
