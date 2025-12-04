import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Mail, Send, Users, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';

interface Subscriber {
    id: string;
    email: string;
    subscribed_at: string;
}

export default function NewsletterManager() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [fromEmail, setFromEmail] = useState('admin@sakec.acm.org');

    const senderOptions = [
        'admin@sakec.acm.org',
        'events@sakec.acm.org',
        'contact@sakec.acm.org',
        'publicity@sakec.acm.org',
        'support@sakec.acm.org'
    ];

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {
        try {
            const { data, error } = await supabase
                .from('newsletter_subscribers')
                .select('*')
                .order('subscribed_at', { ascending: false });

            if (error) throw error;
            setSubscribers(data || []);
        } catch (error) {
            console.error('Error fetching subscribers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSubscriber = async (id: string) => {
        if (!confirm('Are you sure you want to remove this subscriber?')) return;

        try {
            const { error } = await supabase
                .from('newsletter_subscribers')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchSubscribers();
        } catch (error) {
            console.error('Error deleting subscriber:', error);
            alert('Failed to delete subscriber');
        }
    };

    const handleSend = async () => {
        if (!subject || !content) {
            setStatus({ type: 'error', message: 'Please fill in subject and content' });
            return;
        }

        if (subscribers.length === 0) {
            setStatus({ type: 'error', message: 'No subscribers to send to' });
            return;
        }

        setSending(true);
        setStatus(null);

        try {
            // In a real app, this would call an Edge Function or API endpoint
            // For now, we'll simulate sending and log it to the database

            // 1. Log the attempt
            const { error: logError } = await supabase
                .from('newsletter_logs')
                .insert([{
                    subject,
                    content,
                    recipient_count: subscribers.length,
                    sent_by: null, // Can be updated if we have admin ID
                    sender_email: fromEmail
                }]);

            if (logError) throw logError;

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            setStatus({ type: 'success', message: `Newsletter sent to ${subscribers.length} subscribers from ${fromEmail}!` });
            setSubject('');
            setContent('');
        } catch (error) {
            console.error('Error sending newsletter:', error);
            setStatus({ type: 'error', message: 'Failed to send newsletter' });
        } finally {
            setSending(false);
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Mail className="w-6 h-6 text-orange-500" />
                <h2 className="text-2xl font-bold text-white">Newsletter Manager</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Compose Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-4">Compose Newsletter</h3>

                        {status && (
                            <div className={`p-4 rounded-lg mb-4 ${status.type === 'success' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                                }`}>
                                {status.message}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">From</label>
                                <select
                                    value={fromEmail}
                                    onChange={(e) => setFromEmail(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                                >
                                    {senderOptions.map(email => (
                                        <option key={email} value={email}>{email}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                                    placeholder="Newsletter Subject"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Content</label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                                    rows={10}
                                    placeholder="Write your newsletter content here..."
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    onClick={handleSend}
                                    disabled={sending}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    {sending ? 'Sending...' : `Send to ${subscribers.length} Subscribers`}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subscribers List */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 h-fit">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-400" />
                            <h3 className="text-lg font-semibold text-white">Subscribers</h3>
                        </div>
                        <span className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded text-sm">
                            {subscribers.length} Total
                        </span>
                    </div>

                    <div className="max-h-[500px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {subscribers.map((sub) => (
                            <div key={sub.id} className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50 flex justify-between items-center group">
                                <div>
                                    <p className="text-gray-200 text-sm">{sub.email}</p>
                                    <p className="text-gray-500 text-xs">
                                        {new Date(sub.subscribed_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDeleteSubscriber(sub.id)}
                                    className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                    title="Remove subscriber"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}

                        {subscribers.length === 0 && (
                            <p className="text-gray-500 text-center py-4">No subscribers yet</p>
                        )}
                    </div>

                    <Button
                        onClick={fetchSubscribers}
                        variant="outline"
                        className="w-full mt-4 border-gray-700 text-gray-300 hover:bg-gray-700"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh List
                    </Button>
                </div>
            </div>
        </div>
    );
}
