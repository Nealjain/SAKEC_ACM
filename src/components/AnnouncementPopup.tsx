import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';

interface Announcement {
    id: string;
    title: string;
    content: string;
    has_input: boolean;
    input_placeholder: string;
    input_button_label: string;
}

export default function AnnouncementPopup() {
    const [announcement, setAnnouncement] = useState<Announcement | null>(null);
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    useEffect(() => {
        checkAnnouncements();
    }, []);

    const checkAnnouncements = async () => {
        try {
            // Fetch the most recent active announcement
            const { data, error } = await supabase
                .from('announcements')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows found"

            if (data) {
                // Check if user has already seen/closed this specific announcement
                const seen = sessionStorage.getItem(`announcement_seen_${data.id}`);
                if (!seen) {
                    setAnnouncement(data);
                    // Small delay before showing
                    setTimeout(() => setShow(true), 2000);
                }
            }
        } catch (error) {
            console.error('Error checking announcements:', error);
        }
    };

    const handleClose = () => {
        setShow(false);
        if (announcement) {
            sessionStorage.setItem(`announcement_seen_${announcement.id}`, 'true');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');

        try {
            const { error } = await supabase
                .from('newsletter_subscribers')
                .insert([{ email }]);

            if (error) {
                if (error.code === '23505') { // Unique violation
                    setStatus('success');
                    setMessage('You are already subscribed!');
                } else {
                    throw error;
                }
            } else {
                setStatus('success');
                setMessage('Successfully subscribed!');
            }

            // Close popup after success
            setTimeout(() => {
                handleClose();
            }, 2000);

        } catch (error) {
            console.error('Error subscribing:', error);
            setStatus('error');
            setMessage('Failed to subscribe. Please try again.');
        }
    };

    if (!announcement) return null;

    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 pointer-events-none">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-md pointer-events-auto"
                        onClick={handleClose}
                    />

                    {/* Popup Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative backdrop-blur-xl bg-white/95 border border-black/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden pointer-events-auto"
                    >
                        {/* Decorative header background */}
                        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />

                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors z-10 bg-white/50 hover:bg-white/80 rounded-full p-1.5"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="relative p-6 pt-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg mx-auto">
                                <Bell className="w-8 h-8 text-white" />
                            </div>

                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{announcement.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{announcement.content}</p>
                            </div>

                            {announcement.has_input && (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder={announcement.input_placeholder || "Enter your email"}
                                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                                            required
                                        />
                                    </div>

                                    {status === 'error' && (
                                        <p className="text-red-600 text-sm text-center bg-red-50 py-2 rounded-lg">{message}</p>
                                    )}
                                    {status === 'success' && (
                                        <p className="text-green-600 text-sm text-center bg-green-50 py-2 rounded-lg">{message}</p>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={status === 'loading' || status === 'success'}
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {status === 'loading' ? (
                                            'Processing...'
                                        ) : status === 'success' ? (
                                            'Subscribed!'
                                        ) : (
                                            <>
                                                {announcement.input_button_label || "Subscribe"}
                                                <Send className="w-4 h-4 ml-2" />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            )}

                            {!announcement.has_input && (
                                <Button
                                    onClick={handleClose}
                                    className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
                                >
                                    Close
                                </Button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
