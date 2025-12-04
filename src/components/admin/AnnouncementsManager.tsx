import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Megaphone, Plus, Trash2, ToggleLeft, ToggleRight, Save, X } from 'lucide-react';
import { Button } from '../ui/button';

interface Announcement {
    id: string;
    title: string;
    content: string;
    has_input: boolean;
    input_placeholder: string;
    input_button_label: string;
    is_active: boolean;
    created_at: string;
}

export default function AnnouncementsManager() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        has_input: false,
        input_placeholder: 'Enter your email',
        input_button_label: 'Subscribe',
        is_active: true
    });

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const { data, error } = await supabase
                .from('announcements')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAnnouncements(data || []);
        } catch (error) {
            console.error('Error fetching announcements:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            // If activating this one, deactivate others (optional, but good for popups)
            if (formData.is_active) {
                await supabase
                    .from('announcements')
                    .update({ is_active: false })
                    .neq('id', 'placeholder'); // Update all
            }

            const { error } = await supabase
                .from('announcements')
                .insert([formData]);

            if (error) throw error;

            setIsCreating(false);
            setFormData({
                title: '',
                content: '',
                has_input: false,
                input_placeholder: 'Enter your email',
                input_button_label: 'Subscribe',
                is_active: true
            });
            fetchAnnouncements();
        } catch (error) {
            console.error('Error creating announcement:', error);
            alert('Failed to create announcement');
        }
    };

    const toggleActive = async (id: string, currentState: boolean) => {
        try {
            if (!currentState) {
                // If turning on, turn off others
                await supabase
                    .from('announcements')
                    .update({ is_active: false })
                    .neq('id', id);
            }

            const { error } = await supabase
                .from('announcements')
                .update({ is_active: !currentState })
                .eq('id', id);

            if (error) throw error;
            fetchAnnouncements();
        } catch (error) {
            console.error('Error updating announcement:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this announcement?')) return;

        try {
            const { error } = await supabase
                .from('announcements')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchAnnouncements();
        } catch (error) {
            console.error('Error deleting announcement:', error);
        }
    };

    if (loading) return <div className="text-gray-600">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Megaphone className="w-6 h-6 text-yellow-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Announcements</h2>
                </div>
                <Button onClick={() => setIsCreating(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    New Announcement
                </Button>
            </div>

            {isCreating && (
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Create Announcement</h3>
                        <button onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                placeholder="e.g., Join our Newsletter!"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                rows={3}
                                placeholder="Announcement details..."
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.has_input}
                                    onChange={(e) => setFormData({ ...formData, has_input: e.target.checked })}
                                    className="rounded bg-white border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                Include Input Field
                            </label>

                            <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="rounded bg-white border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                Active Immediately
                            </label>
                        </div>

                        {formData.has_input && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Input Placeholder</label>
                                    <input
                                        type="text"
                                        value={formData.input_placeholder}
                                        onChange={(e) => setFormData({ ...formData, input_placeholder: e.target.value })}
                                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Label</label>
                                    <input
                                        type="text"
                                        value={formData.input_button_label}
                                        onChange={(e) => setFormData({ ...formData, input_button_label: e.target.value })}
                                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                        )}

                        <Button onClick={handleCreate} className="w-full bg-green-600 hover:bg-green-700 mt-4 text-white">
                            <Save className="w-4 h-4 mr-2" />
                            Create Announcement
                        </Button>
                    </div>
                </div>
            )}

            <div className="grid gap-4">
                {announcements.map((announcement) => (
                    <div
                        key={announcement.id}
                        className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
                    >
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                            <p className="text-gray-600 text-sm">{announcement.content}</p>
                            {announcement.has_input && (
                                <span className="inline-block mt-2 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100">
                                    Has Input Field
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => toggleActive(announcement.id, announcement.is_active)}
                                className={`p-2 rounded-lg transition-colors ${announcement.is_active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'
                                    }`}
                                title={announcement.is_active ? 'Deactivate' : 'Activate'}
                            >
                                {announcement.is_active ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                            </button>
                            <button
                                onClick={() => handleDelete(announcement.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}

                {announcements.length === 0 && !isCreating && (
                    <div className="text-center text-gray-500 py-8">
                        No announcements found. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
