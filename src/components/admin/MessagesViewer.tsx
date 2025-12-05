import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Mail, Reply, Trash2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://sakec.acm.org/api';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export default function MessagesViewer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMessages(data);
    }
    setLoading(false);
  };

  const handleReply = async () => {
    if (!replyingTo || !replyMessage.trim()) {
      alert('Please enter a reply message');
      return;
    }

    setSending(true);
    try {
      const response = await fetch(`${API_URL}/send-email-clean.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: replyingTo.email,
          subject: `Re: ${replyingTo.subject}`,
          message: replyMessage,
          fromEmail: 'support@sakec.acm.org',
          fromName: 'SAKEC ACM Support',
          replyTo: 'support@sakec.acm.org'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Mark as read
        await supabase
          .from('contact_messages')
          .update({ is_read: true })
          .eq('id', replyingTo.id);

        setReplyingTo(null);
        setReplyMessage('');
        loadMessages();
        alert('✅ Reply sent successfully!');
      } else {
        throw new Error(data.message || 'Failed to send email');
      }
    } catch (err) {
      console.error('Reply error:', err);
      alert('❌ Failed to send reply: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      await supabase.from('contact_messages').delete().eq('id', id);
      loadMessages();
    }
  };

  const markAsRead = async (id: string) => {
    await supabase
      .from('contact_messages')
      .update({ is_read: true })
      .eq('id', id);
    loadMessages();
  };

  if (loading) return <div className="text-gray-600">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Mail className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Contact Messages</h2>
        <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
          {messages.filter(m => !m.is_read).length} unread
        </span>
      </div>

      {replyingTo && (
        <div className="bg-white rounded-xl p-6 border-2 border-blue-500 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Reply to {replyingTo.name}
            </h3>
            <button
              onClick={() => {
                setReplyingTo(null);
                setReplyMessage('');
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Recipient Info */}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">To:</span>
                <span className="font-medium text-gray-900">{replyingTo.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm mt-1">
                <span className="text-gray-600">Subject:</span>
                <span className="font-medium text-gray-900">Re: {replyingTo.subject}</span>
              </div>
            </div>

            {/* Original Message */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-2">
                Original Message:
              </p>
              <p className="text-gray-800 text-sm whitespace-pre-wrap">{replyingTo.message}</p>
            </div>

            {/* Reply Textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Reply:
              </label>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your reply here..."
                rows={8}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleReply}
                disabled={sending || !replyMessage.trim()}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg shadow-md hover:shadow-lg transition-all font-semibold"
              >
                <Reply className="w-4 h-4" />
                {sending ? 'Sending...' : 'Send Reply'}
              </button>
              <button
                onClick={() => {
                  setReplyingTo(null);
                  setReplyMessage('');
                }}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No messages yet</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white rounded-xl p-4 border shadow-sm ${msg.is_read ? 'border-gray-200' : 'border-blue-500 ring-1 ring-blue-500'
                }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-gray-900 font-semibold">{msg.name}</h3>
                    {!msg.is_read && (
                      <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">New</span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{msg.email}</p>
                  <p className="text-blue-600 text-sm font-medium mt-1">{msg.subject}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => {
                      setReplyingTo(msg);
                      setReplyMessage(`Hi ${msg.name},\n\nThank you for contacting SAKEC ACM Student Chapter.\n\n`);
                      if (!msg.is_read) markAsRead(msg.id);
                    }}
                    className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                    title="Reply"
                  >
                    <Reply className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">{msg.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
