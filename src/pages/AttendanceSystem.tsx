import { useState, useEffect } from 'react';
import { QrCode, Nfc, Clock, LogIn, LogOut, Users, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAdminAuth } from '../hooks/useAdminAuth';
import QRScanner from '../components/QRScanner';

const API_URL = import.meta.env.VITE_API_URL || 'https://sakec.acm.org/api';


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

export default function AttendanceSystem() {
  const { isAuthenticated, loading: authLoading } = useAdminAuth();
  const [scanMode, setScanMode] = useState<'qr' | 'nfc' | null>(null);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState({
    totalCheckIns: 0,
    currentlyPresent: 0,
    totalCheckOuts: 0,
  });
  const [message, setMessage] = useState('');

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-900">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  useEffect(() => {
    loadTodayAttendance();

    // Refresh every 30 seconds
    const interval = setInterval(loadTodayAttendance, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadTodayAttendance = async () => {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .gte('check_in_time', `${today}T00:00:00`)
      .lte('check_in_time', `${today}T23:59:59`)
      .order('check_in_time', { ascending: false });

    if (!error && data) {
      setTodayAttendance(data);

      const checkIns = data.length;
      const checkOuts = data.filter(r => r.check_out_time).length;
      const present = checkIns - checkOuts;

      setStats({
        totalCheckIns: checkIns,
        currentlyPresent: present,
        totalCheckOuts: checkOuts,
      });
    }
  };

  const handleQRScan = async (scannedData: string) => {
    setMessage('');

    try {
      // Parse QR data (format: memberId or URL with memberId)
      let memberId = scannedData;
      if (scannedData.includes('/nfc/')) {
        memberId = scannedData.split('/nfc/')[1];
      }

      await processAttendance(memberId, 'qr');
    } catch (err) {
      setMessage('❌ Failed to process QR code');
    } finally {
      setScanMode(null);
    }
  };

  const handleNFCScan = async () => {
    if (!('NDEFReader' in window)) {
      setMessage('❌ NFC is not supported on this device');
      return;
    }

    setMessage('📱 Hold your NFC card near the device...');

    try {
      const ndef = new (window as any).NDEFReader();
      await ndef.scan();

      ndef.addEventListener('reading', async ({ message }: any) => {
        const textDecoder = new TextDecoder();
        let memberId = '';

        for (const record of message.records) {
          if (record.recordType === 'text') {
            memberId = textDecoder.decode(record.data);
            break;
          }
        }

        if (memberId) {
          await processAttendance(memberId, 'nfc');
        }
      });
    } catch (err) {
      setMessage('❌ NFC scan failed. Please try again.');
      setScanMode(null);
    }
  };

  const processAttendance = async (memberId: string, method: 'qr' | 'nfc') => {
    // Get team member info
    const { data: member } = await supabase
      .from('team_members')
      .select('name, email')
      .eq('id', memberId)
      .single();

    if (!member) {
      setMessage('❌ Team member not found');
      return;
    }

    // Check if already checked in today
    const today = new Date().toISOString().split('T')[0];
    const { data: existingRecord } = await supabase
      .from('attendance')
      .select('*')
      .eq('team_member_id', memberId)
      .gte('check_in_time', `${today}T00:00:00`)
      .is('check_out_time', null)
      .maybeSingle();

    let durationMinutes: number | undefined;

    if (existingRecord) {
      // Check out
      const checkInTime = new Date(existingRecord.check_in_time);
      const checkOutTime = new Date();
      durationMinutes = Math.floor((checkOutTime.getTime() - checkInTime.getTime()) / 60000);

      await supabase
        .from('attendance')
        .update({
          check_out_time: checkOutTime.toISOString(),
          duration_minutes: durationMinutes,
        })
        .eq('id', existingRecord.id);

      setMessage(`✅ ${member.name} checked out! Duration: ${formatDuration(durationMinutes)}`);
    } else {
      // Check in
      await supabase
        .from('attendance')
        .insert([{
          team_member_id: memberId,
          member_name: member.name,
          member_email: member.email,
          scan_method: method,
        }]);

      setMessage(`✅ ${member.name} checked in successfully!`);
    }

    // Send email notification
    await sendAttendanceEmail(member.name, member.email, existingRecord ? 'checkout' : 'checkin', durationMinutes ? formatDuration(durationMinutes) : undefined);

    loadTodayAttendance();

    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  };

  const sendAttendanceEmail = async (name: string, email: string, action: string, duration?: string) => {
    try {
      const subject = action === 'checkin'
        ? 'Attendance Check-in Confirmed'
        : 'Attendance Check-out Confirmed';

      const message = action === 'checkin'
        ? `Hi ${name},\n\nYour attendance has been recorded.\n\nCheck-in time: ${new Date().toLocaleTimeString()}\n\nThank you for your presence!\n\nSAKEC ACM Team`
        : `Hi ${name},\n\nYour check-out has been recorded.\n\nCheck-out time: ${new Date().toLocaleTimeString()}\nDuration: ${duration}\n\nThank you for your time today!\n\nSAKEC ACM Team`;

      await fetch(`${API_URL}/send-email-clean.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject,
          message,
          fromEmail: 'admin@sakec.acm.org',
          fromName: 'SAKEC ACM Admin',
        }),
      });
    } catch (err) {
      console.error('Email error:', err);
    }
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
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Attendance System</h1>
          <p className="text-gray-600">Scan QR code or NFC card to mark attendance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <LogIn className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Check-ins Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCheckIns}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Currently Present</p>
                <p className="text-2xl font-bold text-gray-900">{stats.currentlyPresent}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <LogOut className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Check-outs Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCheckOuts}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scan Options */}
        {!scanMode && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <button
              onClick={() => setScanMode('qr')}
              className="bg-white rounded-xl p-8 border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all group"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                  <QrCode className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Scan QR Code</h3>
                <p className="text-gray-600 text-center">Use camera to scan QR code</p>
              </div>
            </button>

            <button
              onClick={() => {
                setScanMode('nfc');
                handleNFCScan();
              }}
              className="bg-white rounded-xl p-8 border-2 border-gray-200 hover:border-purple-500 hover:shadow-lg transition-all group"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                  <Nfc className="w-12 h-12 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Scan NFC Card</h3>
                <p className="text-gray-600 text-center">Tap your NFC card</p>
              </div>
            </button>
          </div>
        )}

        {/* QR Scanner */}
        {scanMode === 'qr' && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Scan QR Code</h3>
              <button
                onClick={() => setScanMode(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
            <QRScanner onScan={handleQRScan} />
          </div>
        )}

        {/* Message */}
        {message && (
          <div className={`mb-8 p-4 rounded-lg border ${message.includes('✅')
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
            }`}>
            <p className="text-center font-semibold">{message}</p>
          </div>
        )}

        {/* Today's Attendance */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-gray-900" />
            <h2 className="text-2xl font-bold text-gray-900">Today's Attendance</h2>
          </div>

          {todayAttendance.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No attendance records for today</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Check-in</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Check-out</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Duration</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Method</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {todayAttendance.map((record) => (
                    <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                        {record.member_name}
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
                        {record.duration_minutes ? (
                          formatDuration(record.duration_minutes)
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${record.scan_method === 'qr'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                          }`}>
                          {record.scan_method.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {record.check_out_time ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                            <LogOut className="w-3 h-3" />
                            Checked Out
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            <Users className="w-3 h-3" />
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
    </div>
  );
}
