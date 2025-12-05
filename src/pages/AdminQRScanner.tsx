import { useState } from 'react';
import { QrCode, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAdminAuth } from '../hooks/useAdminAuth';
import QRScanner from '../components/QRScanner';

const API_URL = import.meta.env.VITE_API_URL || 'https://sakec.acm.org/api';

export default function AdminQRScanner() {
  const { isAuthenticated, loading: authLoading } = useAdminAuth();
  const [scanning, setScanning] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

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

  const handleQRScan = async (scannedData: string) => {
    try {
      // Parse QR data (format: "ATTENDANCE:memberId")
      if (!scannedData.startsWith('ATTENDANCE:')) {
        showMessage('Invalid QR code. This is not an attendance QR code.', 'error');
        return;
      }

      const memberId = scannedData.replace('ATTENDANCE:', '');
      await recordAttendance(memberId);

    } catch (err) {
      showMessage('Failed to process QR code', 'error');
    } finally {
      setScanning(false);
    }
  };

  const recordAttendance = async (memberId: string) => {
    try {
      // Get team member info
      const { data: member } = await supabase
        .from('team_members')
        .select('name, email')
        .eq('id', memberId)
        .single();

      if (!member) {
        showMessage('Team member not found', 'error');
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

      let action = '';
      let duration = '';

      if (existingRecord) {
        // Check out
        const checkInTime = new Date(existingRecord.check_in_time);
        const checkOutTime = new Date();
        const durationMinutes = Math.floor((checkOutTime.getTime() - checkInTime.getTime()) / 60000);

        await supabase
          .from('attendance')
          .update({
            check_out_time: checkOutTime.toISOString(),
            duration_minutes: durationMinutes,
          })
          .eq('id', existingRecord.id);

        action = 'checkout';
        duration = formatDuration(durationMinutes);
        showMessage(`✅ ${member.name} checked out! Duration: ${duration}`, 'success');
      } else {
        // Check in
        await supabase
          .from('attendance')
          .insert([{
            team_member_id: memberId,
            member_name: member.name,
            member_email: member.email,
            scan_method: 'qr',
          }]);

        action = 'checkin';
        showMessage(`✅ ${member.name} checked in successfully!`, 'success');
      }

      // Send email notification
      await sendAttendanceEmail(member.name, member.email, action, duration);

    } catch (err) {
      console.error('Attendance error:', err);
      showMessage('Failed to record attendance', 'error');
    }
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

  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <QrCode className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin QR Scanner</h1>
          <p className="text-gray-600">Scan member QR codes to record attendance</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${messageType === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
            }`}>
            <div className="flex items-center gap-2">
              {messageType === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <p className="font-semibold">{message}</p>
            </div>
          </div>
        )}

        {/* Scanner */}
        {!scanning ? (
          <div className="bg-white rounded-xl p-8 border-2 border-gray-200 shadow-lg">
            <div className="flex flex-col items-center gap-6">
              <div className="p-6 bg-purple-50 rounded-full">
                <QrCode className="w-16 h-16 text-purple-600" />
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Scan</h2>
                <p className="text-gray-600">
                  Click below to start scanning member QR codes
                </p>
              </div>

              <button
                onClick={() => setScanning(true)}
                className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all text-lg"
              >
                Start QR Scanner
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Scanning QR Code</h3>
              <button
                onClick={() => setScanning(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
            <QRScanner onScan={handleQRScan} />
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="font-bold text-gray-900 mb-3">Admin Instructions:</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">1.</span>
              <span>Click "Start QR Scanner" to activate the camera</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">2.</span>
              <span>Ask the member to show their QR code (from NFC Attendance page)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">3.</span>
              <span>Position the QR code within the camera frame</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">4.</span>
              <span>Attendance will be recorded automatically</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">5.</span>
              <span>Member will receive email confirmation</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
