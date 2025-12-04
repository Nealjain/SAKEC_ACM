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
            // Send email to all subscribers
            // Note: In a production environment with many subscribers, this should be handled by a queue system
            // or a bulk email service to avoid timeouts and hitting rate limits.
            // For now, we'll send them sequentially or in small batches.

            let successCount = 0;
            let failCount = 0;

            // Log the attempt first
            const { error: logError } = await supabase
                .from('newsletter_logs')
                .insert([{
                    subject,
                    content,
                    recipient_count: subscribers.length,
                    sent_by: null,
                    sender_email: fromEmail
                }]);

            if (logError) console.error('Failed to log newsletter:', logError);

            // Send emails
            for (const sub of subscribers) {
                try {
                    const response = await fetch('/api/admin-send-email.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            to: sub.email,
                            subject: subject,
                            message: content,
                            fromEmail: fromEmail,
                            fromName: 'SAKEC ACM Newsletter',
                            replyTo: fromEmail
                        })
                    });

                    // Check if response is ok
                    if (!response.ok) {
                        console.error(`HTTP error for ${sub.email}: ${response.status}`);
                        failCount++;
                        continue;
                    }

                    // Get response text first
                    const text = await response.text();
                    
                    // Try to parse as JSON
                    let result;
                    try {
                        result = JSON.parse(text);
                    } catch (e) {
                        console.error(`Invalid JSON for ${sub.email}:`, text);
                        failCount++;
                        continue;
                    }

                    if (result.success) {
                        successCount++;
                    } else {
                        failCount++;
                        console.error(`Failed for ${sub.email}:`, result.message);
                    }
                } catch (err) {
                    console.error(`Failed to send to ${sub.email}:`, err);
                    failCount++;
                }
                
                // Small delay to avoid overwhelming the server
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            setStatus({
                type: successCount > 0 ? 'success' : 'error',
                message: `Newsletter sent! Success: ${successCount}, Failed: ${failCount}`
            });

            if (successCount > 0) {
                setSubject('');
                setContent('');
            }
        } catch (error) {
            console.error('Error sending newsletter:', error);
            setStatus({ type: 'error', message: 'Failed to initiate newsletter sending' });
        } finally {
            setSending(false);
        }
    };

    if (loading) return <div className="text-gray-600">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Mail className="w-6 h-6 text-orange-600" />
                <h2 className="text-2xl font-bold text-gray-900">Newsletter Manager</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Compose Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Compose Newsletter</h3>

                        {status && (
                            <div className={`p-4 rounded-lg mb-4 ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                {status.message}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                                <select
                                    value={fromEmail}
                                    onChange={(e) => setFromEmail(e.target.value)}
                                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                >
                                    {senderOptions.map(email => (
                                        <option key={email} value={email}>{email}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    placeholder="Newsletter Subject"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    rows={10}
                                    placeholder="Write your newsletter content here..."
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    onClick={handleSend}
                                    disabled={sending}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    {sending ? 'Sending...' : `Send to ${subscribers.length} Subscribers`}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subscribers List */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm h-fit">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Subscribers</h3>
                        </div>
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm font-medium">
                            {subscribers.length} Total
                        </span>
                    </div>

                    <div className="max-h-[500px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {subscribers.map((sub) => (
                            <div key={sub.id} className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex justify-between items-center group hover:bg-gray-100 transition-colors">
                                <div>
                                    <p className="text-gray-900 text-sm font-medium">{sub.email}</p>
                                    <p className="text-gray-500 text-xs">
                                        {new Date(sub.subscribed_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDeleteSubscriber(sub.id)}
                                    className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1"
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
                        className="w-full mt-4 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh List
                    </Button>
                </div>
            </div>
        </div>
    );
}
