import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Send, Upload, X, Filter, AlertCircle, CheckCircle } from 'lucide-react';

interface Event {
    id: string;
    title: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'https://sakec.acm.org/api';

export default function MailSender() {
    const [recipientType, setRecipientType] = useState<'all' | 'event' | 'manual'>('manual');
    const [selectedEvent, setSelectedEvent] = useState('');
    const [manualEmails, setManualEmails] = useState('');
    const [excludedEmails, setExcludedEmails] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
    const [fromEmail, setFromEmail] = useState('admin@sakec.acm.org');

    const senderOptions = [
        'admin@sakec.acm.org',
        'events@sakec.acm.org',
        'contact@sakec.acm.org',
        'publicity@sakec.acm.org',
        'support@sakec.acm.org'
    ];

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        const { data } = await supabase
            .from('events')
            .select('id, title')
            .order('date', { ascending: false });
        if (data) setEvents(data);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setStatus({ type: 'error', message: 'Image size must be less than 5MB' });
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: null, message: '' });

        try {
            let imageUrl = '';

            // Upload image if present
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `mail-attachment-${Date.now()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                    .from('blog-photos') // Reusing existing bucket
                    .upload(fileName, imageFile);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage
                    .from('blog-photos')
                    .getPublicUrl(fileName);

                imageUrl = data.publicUrl;
            }

            // Prepare payload
            const payload = {
                type: recipientType,
                target_id: selectedEvent,
                manual_emails: manualEmails.split(',').map(e => e.trim()).filter(Boolean),
                excluded_emails: excludedEmails.split(',').map(e => e.trim()).filter(Boolean),
                subject,
                message,
                image_url: imageUrl,
                fromEmail: fromEmail, // Add sender email
                fromName: 'SAKEC ACM', // Default name
                replyTo: fromEmail // Reply to sender
            };

            const response = await fetch(`${API_URL}/admin-send-email.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!result.success) throw new Error(result.message);

            setStatus({ type: 'success', message: `Emails sent successfully! Count: ${result.count}` });

            // Reset form
            setSubject('');
            setMessage('');
            setImageFile(null);
            setImagePreview('');
            setManualEmails('');
            setExcludedEmails('');

        } catch (error: any) {
            console.error('Send error:', error);
            setStatus({ type: 'error', message: error.message || 'Failed to send emails' });
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-gray-600">Loading...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Mail Sender
                </h2>
                <p className="text-gray-500 text-sm mt-1">Send targeted emails to subscribers or event participants</p>
            </div>

            <div className="p-6">
                <form onSubmit={handleSend} className="space-y-6">
                    {/* Sender Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">From</label>
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

                    {/* Recipient Selection */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-900">Recipients</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                                type="button"
                                onClick={() => setRecipientType('manual')}
                                className={`p-4 rounded-lg border text-left transition-all ${recipientType === 'manual'
                                    ? 'border-blue-600 bg-blue-600 text-white'
                                    : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="font-semibold mb-1">Manual Input</div>
                                <div className="text-xs opacity-80">Specific email addresses</div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setRecipientType('all')}
                                className={`p-4 rounded-lg border text-left transition-all ${recipientType === 'all'
                                    ? 'border-blue-600 bg-blue-600 text-white'
                                    : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="font-semibold mb-1">All Subscribers</div>
                                <div className="text-xs opacity-80">Newsletter list</div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setRecipientType('event')}
                                className={`p-4 rounded-lg border text-left transition-all ${recipientType === 'event'
                                    ? 'border-blue-600 bg-blue-600 text-white'
                                    : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="font-semibold mb-1">Event Participants</div>
                                <div className="text-xs opacity-80">Registered users</div>
                            </button>
                        </div>

                        {recipientType === 'event' && (
                            <select
                                value={selectedEvent}
                                onChange={(e) => setSelectedEvent(e.target.value)}
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                required
                            >
                                <option value="">Select an event...</option>
                                {events.map(event => (
                                    <option key={event.id} value={event.id}>{event.title}</option>
                                ))}
                            </select>
                        )}

                        {recipientType === 'manual' && (
                            <textarea
                                value={manualEmails}
                                onChange={(e) => setManualEmails(e.target.value)}
                                placeholder="Enter email addresses (comma separated)"
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                rows={3}
                                required
                            />
                        )}

                        <div className="pt-2">
                            <button
                                type="button"
                                className="text-sm text-gray-500 flex items-center gap-1 hover:text-gray-900"
                                onClick={() => {
                                    const el = document.getElementById('exclusions');
                                    if (el) el.classList.toggle('hidden');
                                }}
                            >
                                <Filter className="w-4 h-4" />
                                Show Exclusions / Ban List
                            </button>
                            <div id="exclusions" className="hidden mt-2">
                                <textarea
                                    value={excludedEmails}
                                    onChange={(e) => setExcludedEmails(e.target.value)}
                                    placeholder="Enter emails to exclude (comma separated)"
                                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    rows={2}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Email Content */}
                    <div className="space-y-4 border-t border-gray-100 pt-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Subject</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Message</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-sans"
                                rows={8}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Attachment (Optional)</label>
                            {!imagePreview ? (
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                        <p className="text-sm text-gray-500">Click to upload image</p>
                                    </div>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            ) : (
                                <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                                    <button
                                        type="button"
                                        onClick={() => { setImageFile(null); setImagePreview(''); }}
                                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                                    >
                                        <X className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status Messages */}
                    {status.message && (
                        <div className={`p-4 rounded-lg flex items-center gap-2 ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                            {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            {status.message}
                        </div>
                    )}

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-sm"
                        >
                            {loading ? (
                                <>Sending...</>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Send Emails
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
