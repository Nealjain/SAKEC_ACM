import { useState } from 'react';
import { Mail, Send, Settings } from 'lucide-react';
import { sendEmail } from '../../lib/email';

export default function EmailComposer() {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [fromEmail, setFromEmail] = useState('support@sakec.acm.org');
  const [fromName, setFromName] = useState('SAKEC ACM Student Chapter');
  const [replyTo, setReplyTo] = useState('support@sakec.acm.org');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const senderOptions = [
    'admin@sakec.acm.org',
    'events@sakec.acm.org',
    'contact@sakec.acm.org',
    'publicity@sakec.acm.org',
    'support@sakec.acm.org'
  ];

  const handleSend = async () => {
    if (!to || !subject || !message) {
      setStatus({ type: 'error', message: 'Please fill all required fields (To, Subject, Message)' });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address' });
      return;
    }

    setSending(true);
    setStatus(null);

    try {
      const result = await sendEmail({
        to,
        subject,
        message,
        fromEmail,
        fromName,
        replyTo
      });

      if (result.success) {
        setStatus({ 
          type: 'success', 
          message: result.warning ? `${result.message} (${result.warning})` : result.message 
        });
        setTo('');
        setSubject('');
        setMessage('');
      } else {
        setStatus({ type: 'error', message: result.message || 'Failed to send email' });
      }
    } catch (err) {
      console.error('Email send error:', err);
      setStatus({
        type: 'error',
        message: err instanceof Error ? err.message : 'Connection error. Please check your network and try again.'
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Mail className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Send Email</h2>
      </div>

      {status && (
        <div className={`p-4 rounded-lg ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
          {status.message}
        </div>
      )}

      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To (Recipient Email) <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="recipient@example.com"
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject"
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            required
          />
        </div>

        {/* Advanced Settings Toggle */}
        <div className="border-t border-gray-200 pt-4">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm">Advanced Settings (Sender Info)</span>
          </button>
        </div>

        {showAdvanced && (
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Email
              </label>
              <select
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                {senderOptions.map(email => (
                  <option key={email} value={email}>{email}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">The email address that will appear as the sender</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Name
              </label>
              <input
                type="text"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                placeholder="Your Name or Organization"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">The name that will appear as the sender</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reply-To Email
              </label>
              <input
                type="email"
                value={replyTo}
                onChange={(e) => setReplyTo(e.target.value)}
                placeholder="reply-to@example.com"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Where replies will be sent</p>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message here..."
            rows={10}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {message.length} characters
          </p>
        </div>

        <button
          onClick={handleSend}
          disabled={sending}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors shadow-sm"
        >
          <Send className="w-4 h-4" />
          {sending ? 'Sending...' : 'Send Email'}
        </button>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Templates</h3>
        <div className="space-y-2">
          <button
            onClick={() => {
              setSubject('Event Registration Confirmation');
              setMessage('Dear Participant,\n\nThank you for registering for our upcoming event!\n\nEvent Details:\n- Date: [DATE]\n- Time: [TIME]\n- Venue: [VENUE]\n\nWe look forward to seeing you there!\n\nBest regards,\nSAKEC ACM Team');
            }}
            className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors border border-gray-200"
          >
            Event Registration Confirmation
          </button>
          <button
            onClick={() => {
              setSubject('Newsletter - SAKEC ACM Updates');
              setMessage('Hello,\n\nHere are the latest updates from SAKEC ACM Student Chapter:\n\n[YOUR CONTENT HERE]\n\nStay connected with us!\n\nBest regards,\nSAKEC ACM Team');
            }}
            className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors border border-gray-200"
          >
            Newsletter Template
          </button>
          <button
            onClick={() => {
              setSubject('Welcome to SAKEC ACM');
              setMessage('Dear Member,\n\nWelcome to SAKEC ACM Student Chapter!\n\nWe are excited to have you as part of our community. Stay tuned for upcoming events, workshops, and opportunities.\n\nBest regards,\nSAKEC ACM Team');
            }}
            className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors border border-gray-200"
          >
            Welcome Message
          </button>
        </div>
      </div>
    </div>
  );
}
