import { useState, useEffect } from 'react';
import { Mail, Send, CheckCircle, AlertCircle, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import QRCode from 'qrcode';

const API_URL = import.meta.env.VITE_API_URL || 'https://sakec.acm.org/api';

export default function SendAttendanceQR() {
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState({ sent: 0, total: 0 });
  const [results, setResults] = useState<{ success: string[]; failed: string[] }>({
    success: [],
    failed: [],
  });
  const [showResults, setShowResults] = useState(false);
  const [showIndividual, setShowIndividual] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [sendingIndividual, setSendingIndividual] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    const { data } = await supabase
      .from('team_members')
      .select('id, name, email, status')
      .not('email', 'is', null)
      .order('name');

    if (data) {
      // Filter active members (if status column exists, otherwise show all)
      const activeMembers = data.filter(m => !m.status || m.status === 'active');
      setMembers(activeMembers);
    }
  };

  const sendQRCodesToAllMembers = async () => {
    if (!confirm('Send attendance QR codes to all team members?')) {
      return;
    }

    setSending(true);
    setShowResults(false);
    setResults({ success: [], failed: [] });

    try {
      // Get all active team members
      const { data: allMembers, error } = await supabase
        .from('team_members')
        .select('id, name, email, status')
        .not('email', 'is', null);

      if (error || !allMembers) {
        alert('Failed to fetch team members');
        setSending(false);
        return;
      }

      // Filter active members (if status column exists, otherwise use all)
      const members = allMembers.filter(m => !m.status || m.status === 'active');

      setProgress({ sent: 0, total: members.length });

      const successList: string[] = [];
      const failedList: string[] = [];

      // Send QR code to each member
      for (const member of members) {
        try {
          await sendQRCodeEmail(member.id, member.name, member.email);
          successList.push(member.name);
        } catch (err) {
          console.error(`Failed to send to ${member.name}:`, err);
          failedList.push(member.name);
        }

        setProgress(prev => ({ ...prev, sent: prev.sent + 1 }));

        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setResults({ success: successList, failed: failedList });
      setShowResults(true);

    } catch (err) {
      console.error('Send error:', err);
      alert('Failed to send QR codes');
    } finally {
      setSending(false);
    }
  };

  const sendToIndividual = async () => {
    if (!selectedMember) {
      alert('Please select a member');
      return;
    }

    const member = members.find(m => m.id === selectedMember);
    if (!member) return;

    setSendingIndividual(true);
    try {
      await sendQRCodeEmail(member.id, member.name, member.email);
      alert(`✅ QR code sent to ${member.name} successfully!`);
      setSelectedMember('');
      setShowIndividual(false);
    } catch (err) {
      alert(`❌ Failed to send QR code to ${member.name}`);
    } finally {
      setSendingIndividual(false);
    }
  };

  const sendQRCodeEmail = async (memberId: string, name: string, email: string) => {
    // Generate QR code
    const qrData = `ATTENDANCE:${memberId}`;
    const qrCodeBase64 = await QRCode.toDataURL(qrData, {
      width: 250,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    // Create email with embedded QR code
    const subject = 'Your SAKEC ACM Attendance QR Code';

    const message = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #000; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 40px auto; background: white; border: 1px solid #ddd; }
            .header { background: #000; color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 1px; text-transform: uppercase; }
            .content { padding: 40px; background: white; }
            .qr-container { text-align: center; margin: 30px 0; padding: 30px; background: #f9f9f9; border: 2px solid #000; border-radius: 8px; }
            .qr-container img { max-width: 300px; width: 100%; height: auto; }
            .instructions { background: #f0f0f0; border-left: 4px solid #000; padding: 20px; margin: 30px 0; }
            .instructions h3 { margin: 0 0 15px 0; font-size: 16px; text-transform: uppercase; }
            .instructions ul { margin: 0; padding-left: 20px; }
            .instructions li { margin-bottom: 10px; }
            .footer { background: #f9f9f9; padding: 30px; text-align: center; color: #888; font-size: 12px; border-top: 1px solid #eee; }
            @media only screen and (max-width: 600px) {
                .container { margin: 0; border: none; }
                .content { padding: 20px; }
            }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>Attendance QR Code</h1>
                <p style='margin: 5px 0 0; opacity: 0.7; font-size: 12px; letter-spacing: 2px;'>SAKEC ACM STUDENT CHAPTER</p>
            </div>
            <div class='content'>
                <p style='font-size: 18px; margin: 0 0 20px 0;'>Hi ${name},</p>
                
                <p>Here is your personal attendance QR code for SAKEC ACM events and meetings.</p>
                
                <div class='qr-container'>
                    <h2 style='margin: 0 0 20px 0; font-size: 20px;'>Your Attendance QR Code</h2>
                    <img src='${qrCodeBase64}' alt='Attendance QR Code' />
                    <p style='margin: 20px 0 0 0; color: #666; font-size: 14px;'>Save this QR code for future use</p>
                </div>
                
                <div class='instructions'>
                    <h3>How to Use:</h3>
                    <ul style='color: #444;'>
                        <li><strong>Forgot your NFC card?</strong> Show this QR code to an admin</li>
                        <li><strong>Quick attendance:</strong> Admin will scan this code to record your presence</li>
                        <li><strong>Save it:</strong> Keep this email or save the QR code image</li>
                        <li><strong>Print it:</strong> You can print this QR code for easy access</li>
                    </ul>
                </div>
                
                <p style='margin: 30px 0 0 0;'><strong>Important:</strong> This QR code is unique to you. Do not share it with others.</p>
                
                <p style='margin: 20px 0 0 0; color: #666; font-size: 14px;'>
                    You can also access your QR code anytime at: <a href='https://sakec.acm.org/nfc-attendance' style='color: #000;'>sakec.acm.org/nfc-attendance</a>
                </p>
                
                <div style='margin-top: 50px; padding-top: 30px; border-top: 1px solid #eee;'>
                    <p style='margin: 0; font-weight: bold;'>SAKEC ACM Attendance Team</p>
                    <p style='margin: 5px 0 0 0; color: #666; font-size: 14px;'>Shah & Anchor Kutchhi Engineering College</p>
                </div>
            </div>
            <div class='footer'>
                <p>This is an automated email from SAKEC ACM Attendance System.</p>
                <p style='margin-top: 10px;'>© ${new Date().getFullYear()} SAKEC ACM Student Chapter. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    // Send email
    const response = await fetch(`${API_URL}/send-email-clean.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email,
        subject,
        message,
        fromEmail: 'admin@sakec.acm.org',
        fromName: 'SAKEC ACM Admin',
        replyTo: 'admin@sakec.acm.org',
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to send email');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Mail className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-900">Send Attendance QR Codes</h2>
      </div>

      {/* Info Card */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-2">Send QR Codes to All Team Members</h3>
            <p className="text-gray-700 text-sm mb-4">
              This will send a personalized attendance QR code to each active team member via email.
              Members can use this QR code when they forget their NFC card.
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Email sent from: <strong>admin@sakec.acm.org</strong></li>
              <li>• Each member gets their unique QR code</li>
              <li>• QR codes can be saved or printed</li>
              <li>• Admins can scan these codes to record attendance</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {!sending && !showResults && (
        <div className="flex flex-wrap gap-4">
          <button
            onClick={sendQRCodesToAllMembers}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <Send className="w-5 h-5" />
            Send to All Members
          </button>

          <button
            onClick={() => setShowIndividual(!showIndividual)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <Mail className="w-5 h-5" />
            Send to Individual Member
          </button>
        </div>
      )}

      {/* Individual Member Selection */}
      {showIndividual && !sending && (
        <div className="bg-white rounded-xl p-6 border-2 border-blue-500 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Send to Individual Member</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Member
              </label>
              <select
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">Choose a member...</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} ({member.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={sendToIndividual}
                disabled={!selectedMember || sendingIndividual}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-md transition-all"
              >
                <Send className="w-5 h-5" />
                {sendingIndividual ? 'Sending...' : 'Send QR Code'}
              </button>

              <button
                onClick={() => {
                  setShowIndividual(false);
                  setSelectedMember('');
                }}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress */}
      {sending && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <div>
              <p className="font-semibold text-gray-900">Sending QR Codes...</p>
              <p className="text-sm text-gray-600">
                {progress.sent} of {progress.total} sent
              </p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(progress.sent / progress.total) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Results */}
      {showResults && (
        <div className="space-y-4">
          {/* Success */}
          {results.success.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="font-bold text-gray-900">
                  Successfully Sent ({results.success.length})
                </h3>
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

          {/* Failed */}
          {results.failed.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <h3 className="font-bold text-gray-900">
                  Failed to Send ({results.failed.length})
                </h3>
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

          {/* Send Again Button */}
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
