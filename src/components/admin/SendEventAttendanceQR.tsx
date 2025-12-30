import { useState, useEffect } from 'react';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import QRCode from 'qrcode';

const API_URL = import.meta.env.VITE_API_URL || 'https://sakec.acm.org/api';

interface Props {
  eventId: string;
  attendeeType: 'participant' | 'volunteer' | 'team';
}

export default function SendEventAttendanceQR({ eventId, attendeeType }: Props) {
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState({ sent: 0, total: 0 });
  const [results, setResults] = useState<{ success: string[]; failed: string[] }>({
    success: [],
    failed: [],
  });
  const [showResults, setShowResults] = useState(false);
  const [showIndividual, setShowIndividual] = useState(false);
  const [attendees, setAttendees] = useState<any[]>([]);
  const [selectedAttendee, setSelectedAttendee] = useState('');
  const [sendingIndividual, setSendingIndividual] = useState(false);

  useEffect(() => {
    loadAttendees();
  }, [eventId, attendeeType]);

  const loadAttendees = async () => {
    let data: any[] = [];

    if (attendeeType === 'participant') {
      const { data: participants } = await supabase
        .from('event_registrations')
        .select('id, participant_name, participant_email')
        .eq('event_id', eventId)
        .not('participant_email', 'is', null);
      data = participants?.map(p => ({ id: p.id, name: p.participant_name, email: p.participant_email })) || [];
    } else if (attendeeType === 'volunteer') {
      const { data: volunteers } = await supabase
        .from('event_volunteers')
        .select('id, name, email')
        .eq('event_id', eventId)
        .not('email', 'is', null);
      data = volunteers || [];
    } else if (attendeeType === 'team') {
      const { data: team } = await supabase
        .from('team_members')
        .select('id, name, email, status')
        .not('email', 'is', null)
        .order('name');
      data = team?.filter(m => !m.status || m.status === 'active') || [];
    }

    setAttendees(data);
  };

  const sendToAll = async () => {
    if (!confirm(`Send QR codes to all ${attendeeType}s?`)) return;

    setSending(true);
    setShowResults(false);
    setResults({ success: [], failed: [] });
    setProgress({ sent: 0, total: attendees.length });

    const successList: string[] = [];
    const failedList: string[] = [];

    for (const attendee of attendees) {
      try {
        await sendQRCodeEmail(attendee.id, attendee.name, attendee.email);
        successList.push(attendee.name);
      } catch (err) {
        failedList.push(attendee.name);
      }
      setProgress(prev => ({ ...prev, sent: prev.sent + 1 }));
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setResults({ success: successList, failed: failedList });
    setShowResults(true);
    setSending(false);
  };

  const sendToIndividual = async () => {
    if (!selectedAttendee) {
      alert('Please select an attendee');
      return;
    }

    const attendee = attendees.find(a => a.id === selectedAttendee);
    if (!attendee) return;

    setSendingIndividual(true);
    try {
      await sendQRCodeEmail(attendee.id, attendee.name, attendee.email);
      alert(`✅ QR code sent to ${attendee.name} successfully!`);
      setSelectedAttendee('');
      setShowIndividual(false);
    } catch (err) {
      alert(`❌ Failed to send QR code to ${attendee.name}`);
    } finally {
      setSendingIndividual(false);
    }
  };

  const sendQRCodeEmail = async (attendeeId: string, name: string, email: string) => {
    const qrData = `EVENT_ATTENDANCE:${eventId}:${attendeeType}:${attendeeId}`;
    const qrCodeBase64 = await QRCode.toDataURL(qrData, {
      width: 250,
      margin: 1,
      color: { dark: '#000000', light: '#FFFFFF' },
    });

    const subject = `Your Event Attendance QR Code`;
    const message = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #000; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: white; border: 1px solid #ddd; }
            .header { background: #000; color: white; padding: 30px; text-align: center; }
            .content { padding: 40px; }
            .qr-container { text-align: center; margin: 30px 0; padding: 30px; background: #f9f9f9; border: 2px solid #000; }
            .qr-container img { max-width: 300px; width: 100%; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>Event Attendance QR Code</h1>
            </div>
            <div class='content'>
                <p>Hi ${name},</p>
                <p>Here is your attendance QR code for the event. Show this to the admin for attendance marking.</p>
                <div class='qr-container'>
                    <h2>Your QR Code</h2>
                    <img src='${qrCodeBase64}' alt='Attendance QR Code' />
                </div>
                <p><strong>Important:</strong> This QR code is unique to you. Do not share it.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const response = await fetch(`${API_URL}/send-email-clean.php`, {
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

    const data = await response.json();
    if (!data.success) throw new Error(data.message);
  };

  const getTitle = () => {
    if (attendeeType === 'participant') return 'Event Participants';
    if (attendeeType === 'volunteer') return 'Event Volunteers';
    return 'Team Members';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Mail className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Send QR Codes - {getTitle()}</h2>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <p className="text-gray-700 text-sm">
          Send attendance QR codes to {attendeeType}s. They can show these codes to admins for attendance marking.
        </p>
      </div>

      {!sending && !showResults && (
        <div className="flex flex-wrap gap-4">
          <button
            onClick={sendToAll}
            disabled={attendees.length === 0}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg shadow-md transition-all"
          >
            <Send className="w-5 h-5" />
            Send to All ({attendees.length})
          </button>

          <button
            onClick={() => setShowIndividual(!showIndividual)}
            disabled={attendees.length === 0}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold rounded-lg shadow-md transition-all"
          >
            <Mail className="w-5 h-5" />
            Send to Individual
          </button>
        </div>
      )}

      {showIndividual && !sending && (
        <div className="bg-white rounded-xl p-6 border-2 border-purple-500 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Send to Individual</h3>
          <div className="space-y-4">
            <select
              value={selectedAttendee}
              onChange={(e) => setSelectedAttendee(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="">Choose...</option>
              {attendees.map((attendee) => (
                <option key={attendee.id} value={attendee.id}>
                  {attendee.name} ({attendee.email})
                </option>
              ))}
            </select>

            <div className="flex gap-3">
              <button
                onClick={sendToIndividual}
                disabled={!selectedAttendee || sendingIndividual}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold rounded-lg shadow-md transition-all"
              >
                <Send className="w-5 h-5" />
                {sendingIndividual ? 'Sending...' : 'Send QR Code'}
              </button>

              <button
                onClick={() => {
                  setShowIndividual(false);
                  setSelectedAttendee('');
                }}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {sending && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <div>
              <p className="font-semibold text-gray-900">Sending QR Codes...</p>
              <p className="text-sm text-gray-600">{progress.sent} of {progress.total} sent</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(progress.sent / progress.total) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {showResults && (
        <div className="space-y-4">
          {results.success.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="font-bold text-gray-900">Successfully Sent ({results.success.length})</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {results.success.map((name, index) => (
                  <div key={index} className="text-sm text-gray-700 bg-white px-3 py-2 rounded border border-green-200">
                    ✓ {name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.failed.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <h3 className="font-bold text-gray-900">Failed to Send ({results.failed.length})</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {results.failed.map((name, index) => (
                  <div key={index} className="text-sm text-gray-700 bg-white px-3 py-2 rounded border border-red-200">
                    ✗ {name}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => setShowResults(false)}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
          >
            Send Again
          </button>
        </div>
      )}
    </div>
  );
}
