import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Nfc, CheckCircle, AlertCircle, QrCode as QrCodeIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAdminAuth } from '../hooks/useAdminAuth';
import QRCode from 'qrcode';

const API_URL = import.meta.env.VITE_API_URL || 'https://sakec.acm.org/api';

export default function NFCAttendance() {
  const { isAuthenticated, loading: authLoading } = useAdminAuth();
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [showQROption, setShowQROption] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null);

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

  useEffect(() => {
    // Check if user is logged in (has session)
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      // User is logged in, get their info
      const { data: member } = await supabase
        .from('team_members')
        .select('*')
        .eq('email', session.user.email)
        .single();

      if (member) {
        setUserInfo(member);
      }
    }
  };

  const startNFCScan = async () => {
    if (!('NDEFReader' in window)) {
      showMessage('NFC is not supported on this device', 'error');
      return;
    }

    setScanning(true);
    showMessage('📱 Hold your NFC card near the device...', 'success');

    try {
      const ndef = new (window as any).NDEFReader();
      await ndef.scan();

      ndef.addEventListener('reading', async ({ message }: any) => {
        const textDecoder = new TextDecoder();
        let memberId = '';
        let isAdminCard = false;

        for (const record of message.records) {
          if (record.recordType === 'text') {
            const data = textDecoder.decode(record.data);

            // Check if it's an admin card (format: "ADMIN:memberId")
            if (data.startsWith('ADMIN:')) {
              isAdminCard = true;
              memberId = data.replace('ADMIN:', '');
            } else {
              memberId = data;
            }
            break;
          }
        }

        if (memberId) {
          if (isAdminCard) {
            // Admin card - record attendance
            await recordAttendance(memberId);
          } else {
            // Normal user card - redirect to profile
            navigate(`/nfc/${memberId}`);
          }
        }

        setScanning(false);
      });

      ndef.addEventListener('readingerror', () => {
        showMessage('Failed to read NFC card. Please try again.', 'error');
        setScanning(false);
      });

    } catch (err) {
      showMessage('NFC scan failed. Please try again.', 'error');
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
            scan_method: 'nfc',
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

  const generateQRCode = async () => {
    if (!userInfo) {
      showMessage('Please log in to generate QR code', 'error');
      return;
    }

    try {
      // Generate QR code with user ID
      const qrData = `ATTENDANCE:${userInfo.id}`;
      const qrUrl = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      setQrCodeUrl(qrUrl);
      setShowQROption(true);
    } catch (err) {
      showMessage('Failed to generate QR code', 'error');
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">NFC Attendance</h1>
          <p className="text-gray-600">Tap your NFC card to record attendance</p>
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

        {/* NFC Scan Button */}
        <div className="bg-white rounded-xl p-8 border-2 border-gray-200 shadow-lg mb-6">
          <div className="flex flex-col items-center gap-6">
            <div className={`p-6 rounded-full ${scanning ? 'bg-blue-100 animate-pulse' : 'bg-blue-50'}`}>
              <Nfc className="w-16 h-16 text-blue-600" />
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {scanning ? 'Scanning...' : 'Ready to Scan'}
              </h2>
              <p className="text-gray-600">
                {scanning
                  ? 'Hold your NFC card near the device'
                  : 'Tap the button below to start scanning'}
              </p>
            </div>

            <button
              onClick={startNFCScan}
              disabled={scanning}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all text-lg"
            >
              {scanning ? 'Scanning...' : 'Start NFC Scan'}
            </button>
          </div>
        </div>

        {/* Forgot Card Option */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Forgot Your NFC Card?</h3>
            <p className="text-gray-600 mb-4">Generate a QR code for admin to scan</p>

            {!showQROption ? (
              <button
                onClick={generateQRCode}
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <QrCodeIcon className="w-5 h-5" />
                Generate QR Code
              </button>
            ) : (
              <div className="space-y-4">
                <div className="inline-block p-4 bg-white border-2 border-gray-300 rounded-lg">
                  <img src={qrCodeUrl} alt="Attendance QR Code" className="w-64 h-64" />
                </div>
                <p className="text-sm text-gray-600">
                  Show this QR code to an admin to record your attendance
                </p>
                <button
                  onClick={() => setShowQROption(false)}
                  className="text-gray-600 hover:text-gray-900 text-sm underline"
                >
                  Hide QR Code
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-gray-900 mb-3">How it works:</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span><strong>Admin NFC Card:</strong> Records attendance automatically</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span><strong>Member NFC Card:</strong> Opens your profile page</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span><strong>Forgot Card:</strong> Generate QR code for admin to scan</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span><strong>Email:</strong> You'll receive confirmation when attendance is recorded</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
