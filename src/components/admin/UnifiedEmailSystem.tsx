import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Mail, Send, Users, History, FileText, Loader2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://sakec-acm.com/api';

// Email templates
const EMAIL_TEMPLATES = {
  newsletter: {
    name: 'Newsletter',
    subject: 'SAKEC ACM Newsletter - [Month Year]',
    body: `Hello,

Here are the latest updates from SAKEC ACM Student Chapter:

[Your content here]

Stay connected with us!

Best regards,
SAKEC ACM Team`
  },
  event_announcement: {
    name: 'Event Announcement',
    subject: 'Upcoming Event: [Event Name]',
    body: `Dear Member,

We're excited to announce our upcoming event!

Event: [Event Name]
Date: [Date]
Time: [Time]
Venue: [Location]

Register now: [Registration Link]

Looking forward to seeing you there!

Best regards,
SAKEC ACM Events Team`
  },
  event_reminder: {
    name: 'Event Reminder',
    subject: 'Reminder: [Event Name] Tomorrow',
    body: `Dear Participant,

This is a friendly reminder about tomorrow's event:

Event: [Event Name]
Date: [Date]
Time: [Time]
Venue: [Location]

Please arrive 15 minutes early.

See you tomorrow!

Best regards,
SAKEC ACM Events Team`
  },
  welcome: {
    name: 'Welcome Message',
    subject: 'Welcome to SAKEC ACM!',
    body: `Dear [Name],

Welcome to SAKEC ACM Student Chapter!

We're excited to have you as part of our community. Stay tuned for upcoming events, workshops, and opportunities.

Best regards,
SAKEC ACM Team`
  }
};

// Sender options from cPanel
const SENDER_OPTIONS = [
  { email: 'admin@sakec.acm.org', name: 'SAKEC ACM Admin', description: 'General admin communications' },
  { email: 'contact@sakec.acm.org', name: 'SAKEC ACM Contact', description: 'General inquiries' },
  { email: 'events@sakec.acm.org', name: 'SAKEC ACM Events', description: 'Event notifications' },
  { email: 'publicity@sakec.acm.org', name: 'SAKEC ACM Publicity', description: 'Marketing and publicity' },
  { email: 'support@sakec.acm.org', name: 'SAKEC ACM Support', description: 'Support emails' }
];

interface Recipient {
  email: string;
  name?: string;
}

export default function UnifiedEmailSystem() {
  // State
  const [activeTab, setActiveTab] = useState<'compose' | 'history'>('compose');
  const [recipientType, setRecipientType] = useState<'newsletter' | 'event' | 'custom'>('newsletter');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [customEmails, setCustomEmails] = useState('');
  const [sender, setSender] = useState(SENDER_OPTIONS[0]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Data
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<Recipient[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [eventParticipants, setEventParticipants] = useState<Recipient[]>([]);
  const [emailHistory, setEmailHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (recipientType === 'event' && selectedEvent) {
      loadEventParticipants(selectedEvent);
    }
  }, [selectedEvent]);

  const loadData = async () => {
    try {
      // Load newsletter subscribers
      const { data: subscribers } = await supabase
        .from('newsletter_subscribers')
        .select('email')
        .eq('is_active', true);
      
      setNewsletterSubscribers(subscribers?.map(s => ({ email: s.email })) || []);

      // Load events
      const { data: eventsData } = await supabase
        .from('events')
        .select('id, title, date')
        .order('date', { ascending: false });
      
      setEvents(eventsData || []);

      // Load email history
      const { data: history } = await supabase
        .from('sent_emails')
        .select('*')
        .order('sent_at', { ascending: false })
        .limit(50);
      
      setEmailHistory(history || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEventParticipants = async (eventId: string) => {
    try {
      const { data } = await supabase
        .from('event_registrations')
        .select('participant_name, participant_email')
        .eq('event_id', eventId);
      
      setEventParticipants(data?.map(p => ({ 
        email: p.participant_email, 
        name: p.participant_name 
      })) || []);
    } catch (error) {
      console.error('Error loading participants:', error);
    }
  };

  const getRecipients = (): Recipient[] => {
    switch (recipientType) {
      case 'newsletter':
        return newsletterSubscribers;
      case 'event':
        return eventParticipants;
      case 'custom':
        return customEmails
          .split(/[,\n]/)
          .map(email => email.trim())
          .filter(email => email && email.includes('@'))
          .map(email => ({ email }));
      default:
        return [];
    }
  };

  const applyTemplate = (templateKey: keyof typeof EMAIL_TEMPLATES) => {
    const template = EMAIL_TEMPLATES[templateKey];
    setSubject(template.subject);
    setMessage(template.body);
  };

  const handleSend = async () => {
    const recipients = getRecipients();
    
    if (recipients.length === 0) {
      setStatus({ type: 'error', message: 'No recipients selected' });
      return;
    }

    if (!subject || !message) {
      setStatus({ type: 'error', message: 'Subject and message are required' });
      return;
    }

    setSending(true);
    setStatus(null);

    let successCount = 0;
    let failCount = 0;

    try {
      for (const recipient of recipients) {
        try {
          // STEP 1: Save to database FIRST
          const { error: dbError } = await supabase
            .from('sent_emails')
            .insert({
              recipient_email: recipient.email,
              sender_email: sender.email,
              sender_name: sender.name,
              subject: subject,
              message: message,
              status: 'pending',
              sent_by: 'admin'
            });

          if (dbError) {
            console.error('Database save error:', dbError);
            failCount++;
            continue;
          }

          // STEP 2: Send email via PHP
          const response = await fetch(`${API_URL}/admin-send-email.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: recipient.email,
              subject,
              message,
              fromEmail: sender.email,
              fromName: sender.name,
              replyTo: sender.email
            })
          });

          if (!response.ok) {
            failCount++;
            continue;
          }

          const text = await response.text();
          let result;
          try {
            result = JSON.parse(text);
          } catch (e) {
            failCount++;
            continue;
          }

          if (result.success) {
            successCount++;
          } else {
            failCount++;
          }
        } catch (err) {
          console.error('Send error:', err);
          failCount++;
        }
        
        // Small delay to avoid overwhelming server
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setStatus({
        type: successCount > 0 ? 'success' : 'error',
        message: `Sent: ${successCount} | Failed: ${failCount} | Total: ${recipients.length}`
      });

      if (successCount > 0) {
        setSubject('');
        setMessage('');
        loadData(); // Refresh history
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to send emails' });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Mail className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Email System</h2>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('compose')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'compose'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Send className="w-4 h-4 inline mr-2" />
            Compose
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <History className="w-4 h-4 inline mr-2" />
            History
          </button>
        </div>
      </div>

      {/* Status Message */}
      {status && (
        <div className={`p-4 rounded-lg border ${
          status.type === 'success'
            ? 'bg-green-50 text-green-700 border-green-200'
            : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          {status.message}
        </div>
      )}

      {/* Compose Tab */}
      {activeTab === 'compose' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Compose Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sender Selection */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Send From
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SENDER_OPTIONS.map((option) => (
                  <button
                    key={option.email}
                    onClick={() => setSender(option)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      sender.email === option.email
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{option.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{option.email}</div>
                    <div className="text-xs text-gray-400 mt-1">{option.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient Selection */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Send To
              </label>
              
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => setRecipientType('newsletter')}
                  className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                    recipientType === 'newsletter'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Users className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-sm font-medium">Newsletter</div>
                  <div className="text-xs text-gray-500">{newsletterSubscribers.length} subscribers</div>
                </button>
                
                <button
                  onClick={() => setRecipientType('event')}
                  className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                    recipientType === 'event'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FileText className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-sm font-medium">Event</div>
                  <div className="text-xs text-gray-500">{eventParticipants.length} participants</div>
                </button>
                
                <button
                  onClick={() => setRecipientType('custom')}
                  className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                    recipientType === 'custom'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Mail className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-sm font-medium">Custom</div>
                  <div className="text-xs text-gray-500">Enter emails</div>
                </button>
              </div>

              {recipientType === 'event' && (
                <select
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select an event</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title} - {new Date(event.date).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              )}

              {recipientType === 'custom' && (
                <textarea
                  value={customEmails}
                  onChange={(e) => setCustomEmails(e.target.value)}
                  placeholder="Enter email addresses (comma or newline separated)&#10;example@email.com, another@email.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={4}
                />
              )}
            </div>

            {/* Email Content */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Email subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your message here..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={12}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {message.length} characters
                </div>
              </div>

              <button
                onClick={handleSend}
                disabled={sending || getRecipients().length === 0}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending to {getRecipients().length} recipients...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send to {getRecipients().length} recipients
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sidebar - Templates */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Templates</h3>
              <div className="space-y-2">
                {Object.entries(EMAIL_TEMPLATES).map(([key, template]) => (
                  <button
                    key={key}
                    onClick={() => applyTemplate(key as keyof typeof EMAIL_TEMPLATES)}
                    className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                  >
                    <div className="font-medium text-gray-900 text-sm">{template.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{template.subject}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">💡 Tips</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Use templates for consistency</li>
                <li>• Test with custom email first</li>
                <li>• Keep messages concise</li>
                <li>• Check spam folder if not received</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Email History</h3>
            <p className="text-sm text-gray-500 mt-1">Last 50 sent emails</p>
          </div>
          <div className="divide-y divide-gray-200">
            {emailHistory.map((email) => (
              <div key={email.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-gray-900">{email.subject}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      To: {email.recipient_email}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    email.status === 'sent'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {email.status}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  From: {email.sender_name} ({email.sender_email}) • {new Date(email.sent_at).toLocaleString()}
                </div>
              </div>
            ))}
            {emailHistory.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                No emails sent yet
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
