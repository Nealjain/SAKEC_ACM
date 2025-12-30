import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Calendar, Download, Users, Clock, TrendingUp } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  team_member_id: string;
  member_name: string;
  member_email: string;
  check_in_time: string;
  check_out_time: string | null;
  duration_minutes: number | null;
  scan_method: string;
}

export default function AttendanceViewer() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [stats, setStats] = useState({
    totalRecords: 0,
    avgDuration: 0,
    uniqueMembers: 0,
  });

  useEffect(() => {
    loadAttendance();
  }, [selectedDate]);

  const loadAttendance = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .gte('check_in_time', `${selectedDate}T00:00:00`)
      .lte('check_in_time', `${selectedDate}T23:59:59`)
      .order('check_in_time', { ascending: false });

    if (!error && data) {
      setRecords(data);
      
      const uniqueMembers = new Set(data.map(r => r.team_member_id)).size;
      const completedRecords = data.filter(r => r.duration_minutes);
      const avgDuration = completedRecords.length > 0
        ? Math.round(completedRecords.reduce((sum, r) => sum + (r.duration_minutes || 0), 0) / completedRecords.length)
        : 0;
      
      setStats({
        totalRecords: data.length,
        avgDuration,
        uniqueMembers,
      });
    }
    
    setLoading(false);
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Check-in', 'Check-out', 'Duration (min)', 'Method'];
    const rows = records.map(r => [
      r.member_name,
      r.member_email,
      new Date(r.check_in_time).toLocaleString(),
      r.check_out_time ? new Date(r.check_out_time).toLocaleString() : 'N/A',
      r.duration_minutes || 'N/A',
      r.scan_method,
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${selectedDate}.csv`;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Attendance Records</h2>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-sm transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Date Selector */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Check-ins</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRecords}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Unique Members</p>
              <p className="text-2xl font-bold text-gray-900">{stats.uniqueMembers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
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
          <p className="text-center text-gray-500 py-8">No attendance records for this date</p>
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
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                      {record.member_name}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {record.member_email}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {formatTime(record.check_in_time)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {record.check_out_time ? formatTime(record.check_out_time) : '-'}
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
