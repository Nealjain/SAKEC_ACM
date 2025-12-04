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
    if (!replyingTo || !replyMessage) return;

    setSending(true);
    try {
      const response = await fetch(`${API_URL}/admin-send-email.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: replyingTo.email,
          subject: `Re: ${replyingTo.subject}`,
          message: replyMessage
        })
      });

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
        alert('Reply sent successfully!');
      }
    } catch (err) {
      alert('Failed to send reply');
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
        <div className="bg-white rounded-xl p-6 border border-blue-500 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Reply to {replyingTo.name}
          </h3>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-500 text-sm mb-2">Original Message:</p>
              <p className="text-gray-800">{replyingTo.message}</p>
            </div>
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your reply..."
              rows={6}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleReply}
                disabled={sending}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg shadow-sm"
              >
                <Reply className="w-4 h-4" />
                {sending ? 'Sending...' : 'Send Reply'}
              </button>
              <button
                onClick={() => {
                  setReplyingTo(null);
                  setReplyMessage('');
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
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
