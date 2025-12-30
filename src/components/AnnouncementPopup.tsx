import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';

interface Announcement {
    id: string;
    title: string;
    content: string;
    has_input: boolean;
    input_placeholder: string;
    input_button_label: string;
    photos: string[];
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
                .limit(1);

            if (error) throw error;

            if (data && data.length > 0) {
                const announcementData = data[0];
                // Check if user has already seen/closed this specific announcement
                const seen = sessionStorage.getItem(`announcement_seen_${announcementData.id}`);
                if (!seen) {
                    setAnnouncement(announcementData);
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
                        className="relative bg-white border border-gray-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden pointer-events-auto"
                    >
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10 bg-white hover:bg-gray-50 rounded-full p-2 shadow-sm"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-6">
                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">{announcement.title}</h3>
                                <p className="text-gray-700 leading-relaxed">{announcement.content}</p>
                            </div>

                            {/* Photos Display */}
                            {announcement.photos && announcement.photos.length > 0 && (
                                <div className="mb-6">
                                    {announcement.photos.length === 1 ? (
                                        <div className="w-full">
                                            <img
                                                src={announcement.photos[0]}
                                                alt={announcement.title}
                                                className="w-full h-48 object-cover rounded-xl border border-gray-200"
                                            />
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-3">
                                            {announcement.photos.slice(0, 4).map((photo, index) => (
                                                <div key={index} className="aspect-square">
                                                    <img
                                                        src={photo}
                                                        alt={`${announcement.title} ${index + 1}`}
                                                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {announcement.has_input && (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder={announcement.input_placeholder || "Enter your email"}
                                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all"
                                            required
                                        />
                                    </div>

                                    {status === 'error' && (
                                        <p className="text-gray-700 text-sm text-center bg-gray-100 py-2 rounded-lg border border-gray-200">{message}</p>
                                    )}
                                    {status === 'success' && (
                                        <p className="text-gray-700 text-sm text-center bg-gray-100 py-2 rounded-lg border border-gray-200">{message}</p>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={status === 'loading' || status === 'success'}
                                        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                                    className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-xl transition-all"
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
