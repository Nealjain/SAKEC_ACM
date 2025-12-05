import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, Download, Clock } from 'lucide-react';

interface Props {
  eventId: string;
  attendeeType: 'participant' | 'volunteer' | 'team';
}

interface AttendanceRecord {
  id: string;
  attendee_name: string;
  attendee_email: string;
  check_in_time: string;
  check_out_time: string | null;
  duration_minutes: number | null;
  scan_method: string;
}

export default function EventAttendanceViewer({ eventId, attendeeType }: Props) {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCheckIns: 0,
    currentlyPresent: 0,
    avgDuration: 0,
  });

  useEffect(() => {
    loadAttendance();
    const interval = setInterval(loadAttendance, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [eventId, attendeeType]);

  const loadAttendance = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('event_attendance')
      .select('*')
      .eq('event_id', eventId)
      .eq('attendee_type', attendeeType)
      .order('check_in_time', { ascending: false });

    if (!error && data) {
      setRecords(data);
      
      const checkIns = data.length;
      const present = data.filter(r => !r.check_out_time).length;
      const completedRecords = data.filter(r => r.duration_minutes);
      const avgDuration = completedRecords.length > 0
        ? Math.round(completedRecords.reduce((sum, r) => sum + (r.duration_minutes || 0), 0) / completedRecords.length)
        : 0;
      
      setStats({
        totalCheckIns: checkIns,
        currentlyPresent: present,
        avgDuration,
      });
    }
    
    setLoading(false);
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Check-in', 'Check-out', 'Duration (min)', 'Method'];
    const rows = records.map(r => [
      r.attendee_name,
      r.attendee_email || 'N/A',
      new Date(r.check_in_time).toLocaleString(),
      r.check_out_time ? new Date(r.check_out_time).toLocaleString() : 'Still Present',
      r.duration_minutes || 'N/A',
      r.scan_method,
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${attendeeType}-attendance-${eventId}.csv`;
    a.click();
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTitle = () => {
    if (attendeeType === 'participant') return 'Participant Attendance';
    if (attendeeType === 'volunteer') return 'Volunteer Attendance';
    return 'Team Attendance';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-gray-900" />
          <h2 className="text-2xl font-bold text-gray-900">{getTitle()}</h2>
        </div>
        {records.length > 0 && (
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Check-ins</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCheckIns}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Currently Present</p>
              <p className="text-2xl font-bold text-gray-900">{stats.currentlyPresent}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Duration</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.avgDuration > 0 ? formatDuration(stats.avgDuration) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        {loading ? (
          <p className="text-center text-gray-500 py-8">Loading...</p>
        ) : records.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No attendance records yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Check-in</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Check-out</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Duration</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Method</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                      {record.attendee_name}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {record.attendee_email || '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {formatTime(record.check_in_time)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {record.check_out_time ? (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {formatTime(record.check_out_time)}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {record.duration_minutes ? formatDuration(record.duration_minutes) : '-'}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        record.scan_method === 'qr' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {record.scan_method.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {record.check_out_time ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          Checked Out
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Present
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
