import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QrCode, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAdminAuth } from '../hooks/useAdminAuth';
import QRScanner from '../components/QRScanner';

const API_URL = import.meta.env.VITE_API_URL || 'https://sakec.acm.org/api';

interface Event {
  id: string;
  title: string;
  date: string;
}

export default function EventQRScanner() {
  const { isAuthenticated, loading: authLoading } = useAdminAuth();
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [scanning, setScanning] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
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

  useEffect(() => {
    if (eventId) {
      loadEvent();
    }
  }, [eventId]);

  const loadEvent = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('id, title, date')
      .eq('id', eventId)
      .single();

    if (!error && data) {
      setEvent(data);
    }
    setLoading(false);
  };

  const handleQRScan = async (scannedData: string) => {
    try {
      // Parse QR data (format: "EVENT_ATTENDANCE:eventId:attendeeType:attendeeId")
      if (!scannedData.startsWith('EVENT_ATTENDANCE:')) {
        showMessage('Invalid QR code. This is not an event attendance QR code.', 'error');
        return;
      }

      const parts = scannedData.split(':');
      if (parts.length !== 4) {
        showMessage('Invalid QR code format', 'error');
        return;
      }

      const [, qrEventId, attendeeType, attendeeId] = parts;

      if (qrEventId !== eventId) {
        showMessage('This QR code is for a different event', 'error');
        return;
      }

      await recordEventAttendance(attendeeType as 'participant' | 'volunteer' | 'team', attendeeId);

    } catch (err) {
      showMessage('Failed to process QR code', 'error');
    } finally {
      setScanning(false);
    }
  };

  const recordEventAttendance = async (
    attendeeType: 'participant' | 'volunteer' | 'team',
    attendeeId: string
  ) => {
    try {
      let attendeeName = '';
      let attendeeEmail = '';

      // Get attendee info based on type
      if (attendeeType === 'participant') {
        const { data } = await supabase
          .from('event_registrations')
          .select('participant_name, participant_email')
          .eq('id', attendeeId)
          .single();

        if (!data) {
          showMessage('Participant not found', 'error');
          return;
        }
        attendeeName = data.participant_name;
        attendeeEmail = data.participant_email;
      } else if (attendeeType === 'volunteer') {
        const { data } = await supabase
          .from('event_volunteers')
          .select('name, email')
          .eq('id', attendeeId)
          .single();

        if (!data) {
          showMessage('Volunteer not found', 'error');
          return;
        }
        attendeeName = data.name;
        attendeeEmail = data.email;
      } else if (attendeeType === 'team') {
        const { data } = await supabase
          .from('team_members')
          .select('name, email')
          .eq('id', attendeeId)
          .single();

        if (!data) {
          showMessage('Team member not found', 'error');
          return;
        }
        attendeeName = data.name;
        attendeeEmail = data.email;
      }

      // Check if already checked in
      const { data: existingRecord } = await supabase
        .from('event_attendance')
        .select('*')
        .eq('event_id', eventId)
        .eq('attendee_id', attendeeId)
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
          .from('event_attendance')
          .update({
            check_out_time: checkOutTime.toISOString(),
            duration_minutes: durationMinutes,
          })
          .eq('id', existingRecord.id);

        action = 'checkout';
        duration = formatDuration(durationMinutes);
        showMessage(`✅ ${attendeeName} checked out! Duration: ${duration}`, 'success');
      } else {
        // Check in
        await supabase
          .from('event_attendance')
          .insert([{
            event_id: eventId,
            attendee_type: attendeeType,
            attendee_id: attendeeId,
            attendee_name: attendeeName,
            attendee_email: attendeeEmail,
            scan_method: 'qr',
          }]);

        action = 'checkin';
        showMessage(`✅ ${attendeeName} checked in successfully!`, 'success');
      }

      // Send email notification
      if (attendeeEmail) {
        await sendAttendanceEmail(attendeeName, attendeeEmail, action, duration);
      }

    } catch (err) {
      console.error('Attendance error:', err);
      showMessage('Failed to record attendance', 'error');
    }
  };

  const sendAttendanceEmail = async (
    name: string,
    email: string,
    action: string,
    duration?: string
  ) => {
    try {
      const subject = action === 'checkin'
        ? `Event Check-in Confirmed - ${event?.title}`
        : `Event Check-out Confirmed - ${event?.title}`;

      const message = action === 'checkin'
        ? `Hi ${name},\n\nYour attendance has been recorded for ${event?.title}.\n\nCheck-in time: ${new Date().toLocaleTimeString()}\n\nThank you for attending!\n\nSAKEC ACM Team`
        : `Hi ${name},\n\nYour check-out has been recorded for ${event?.title}.\n\nCheck-out time: ${new Date().toLocaleTimeString()}\nDuration: ${duration}\n\nThank you for your participation!\n\nSAKEC ACM Team`;

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-xl text-gray-900">Loading...</div>
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
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/admin/events/${eventId}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Event Management
          </button>

          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <QrCode className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Event QR Scanner</h1>
            <p className="text-gray-600">{event.title}</p>
            <p className="text-sm text-gray-500">
              {new Date(event.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
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
                  Click below to start scanning attendee QR codes
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
          <h3 className="font-bold text-gray-900 mb-3">Scanner Instructions:</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">1.</span>
              <span>Click "Start QR Scanner" to activate the camera</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">2.</span>
              <span>Ask the attendee to show their event QR code</span>
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
              <span>Attendee will receive email confirmation</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
