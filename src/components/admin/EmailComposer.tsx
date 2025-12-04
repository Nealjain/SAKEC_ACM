import { useState } from 'react';
import { Mail, Send } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://sakec-acm.com/api';

export default function EmailComposer() {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSend = async () => {
    if (!to || !subject || !message) {
      setStatus({ type: 'error', message: 'Please fill all fields' });
      return;
    }

    setSending(true);
    setStatus(null);

    try {
      const response = await fetch(`${API_URL}/admin-send-email.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, message })
      });

      const data = await response.json();

      if (data.success) {
        setStatus({ type: 'success', message: 'Email sent successfully!' });
        setTo('');
        setSubject('');
        setMessage('');
      } else {
        setStatus({ type: 'error', message: data.message || 'Failed to send email' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Connection error' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Mail className="w-6 h-6 text-blue-500" />
        <h2 className="text-2xl font-bold text-white">Send Email</h2>
      </div>

      {status && (
        <div className={`p-4 rounded-lg ${
          status.type === 'success' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
        }`}>
          {status.message}
        </div>
      )}

      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">To (Email)</label>
          <input
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="recipient@example.com"
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject"
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message here..."
            rows={10}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
          />
        </div>

        <button
          onClick={handleSend}
          disabled={sending}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
        >
          <Send className="w-4 h-4" />
          {sending ? 'Sending...' : 'Send Email'}
        </button>
      </div>

      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-3">Quick Templates</h3>
        <div className="space-y-2">
          <button
            onClick={() => {
              setSubject('Event Registration Confirmation');
              setMessage('Dear Participant,\n\nThank you for registering for our upcoming event!\n\nEvent Details:\n- Date: [DATE]\n- Time: [TIME]\n- Venue: [VENUE]\n\nWe look forward to seeing you there!\n\nBest regards,\nSAKEC ACM Team');
            }}
            className="w-full text-left px-4 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 rounded-lg"
          >
            Event Registration Confirmation
          </button>
          <button
            onClick={() => {
              setSubject('Newsletter - SAKEC ACM Updates');
              setMessage('Hello,\n\nHere are the latest updates from SAKEC ACM Student Chapter:\n\n[YOUR CONTENT HERE]\n\nStay connected with us!\n\nBest regards,\nSAKEC ACM Team');
            }}
            className="w-full text-left px-4 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 rounded-lg"
          >
            Newsletter Template
          </button>
        </div>
      </div>
    </div>
  );
}
