import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Megaphone, Plus, Trash2, ToggleLeft, ToggleRight, Save, X, Upload, Image as ImageIcon, Edit } from 'lucide-react';

import { Button } from '../ui/button';

interface Announcement {
    id: string;
    title: string;
    content: string;
    has_input: boolean;
    input_placeholder: string;
    input_button_label: string;
    is_active: boolean;
    photos: string[];
    created_at: string;
    link?: string;
}


export default function AnnouncementsManager() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [uploadingPhotos, setUploadingPhotos] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        content: '',
        has_input: false,
        input_placeholder: 'Enter your email',
        input_button_label: 'Subscribe',
        is_active: true,
        photos: [] as string[],
        link: ''
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

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        setSelectedFiles(prev => [...prev, ...imageFiles]);
    };

    const removeSelectedFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const uploadPhotos = async (): Promise<string[]> => {
        if (selectedFiles.length === 0) return [];

        setUploadingPhotos(true);
        const uploadedUrls: string[] = [];

        try {
            for (const file of selectedFiles) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('random')
                    .upload(fileName, file);

                if (uploadError) {
                    console.error('Upload error:', uploadError);
                    continue;
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('random')
                    .getPublicUrl(fileName);

                uploadedUrls.push(publicUrl);
            }
        } catch (error) {
            console.error('Error uploading photos:', error);
        } finally {
            setUploadingPhotos(false);
        }

        return uploadedUrls;
    };
    const handleCreate = async () => {
        try {
            // Upload photos first
            const photoUrls = await uploadPhotos();
            // Combine existing photos with new ones if editing, or just new ones
            const currentPhotos = formData.photos || [];
            const finalPhotos = [...currentPhotos, ...photoUrls];

            const commonData = {
                title: formData.title,
                content: formData.content,
                has_input: formData.has_input,
                input_placeholder: formData.input_placeholder,
                input_button_label: formData.input_button_label,
                is_active: formData.is_active,
                photos: finalPhotos,
                link: formData.link
            };

            // If activating this one, deactivate others (optional, but good for popups)
            if (commonData.is_active) {
                const query = supabase
                    .from('announcements')
                    .update({ is_active: false })
                    .eq('is_active', true); // Only touch currently active ones

                // If editing, exclude current ID from deactivation
                if (formData.id) {
                    query.neq('id', formData.id);
                }

                const { error: deactivateError } = await query;
                if (deactivateError) {
                    console.error('Error deactivating others:', deactivateError);
                }
            }

            let error;
            if (formData.id) {
                // Update existing
                const { error: updateError } = await supabase
                    .from('announcements')
                    .update(commonData)
                    .eq('id', formData.id);
                error = updateError;
            } else {
                // Insert new
                const { error: insertError } = await supabase
                    .from('announcements')
                    .insert([commonData]);
                error = insertError;
            }

            if (error) throw error;

            setIsCreating(false);
            setSelectedFiles([]);
            setFormData({
                id: '',
                title: '',
                content: '',
                has_input: false,
                input_placeholder: 'Enter your email',
                input_button_label: 'Subscribe',
                is_active: true,
                photos: [],
                link: ''
            });
            fetchAnnouncements();
        } catch (error) {
            console.error('Error creating/updating announcement:', error);
            alert('Failed to save announcement');
        }
    };

    const handleEdit = (announcement: Announcement) => {
        setFormData({
            id: announcement.id,
            title: announcement.title,
            content: announcement.content || '',
            has_input: announcement.has_input,
            input_placeholder: announcement.input_placeholder || 'Enter your email',
            input_button_label: announcement.input_button_label || 'Subscribe',
            is_active: announcement.is_active,
            photos: announcement.photos || [],
            link: announcement.link || ''
        });
        setIsCreating(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
                    <Megaphone className="w-6 h-6 text-gray-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Announcements</h2>
                </div>
                <Button onClick={() => setIsCreating(true)} className="bg-gray-900 hover:bg-gray-800 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    New Announcement
                </Button>
            </div>

            {isCreating && (
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Create Announcement</h3>
                        <button onClick={() => {
                            setIsCreating(false);
                            setSelectedFiles([]);
                            setFormData({
                                id: '',
                                title: '',
                                content: '',
                                has_input: false,
                                input_placeholder: 'Enter your email',
                                input_button_label: 'Subscribe',
                                is_active: true,
                                photos: [],
                                link: ''
                            });

                        }} className="text-gray-400 hover:text-gray-600">
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
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none"
                                placeholder="e.g., Join our Newsletter!"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none"
                                rows={3}
                                placeholder="Announcement details..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Link (Optional)</label>
                            <input
                                type="text"
                                value={formData.link}
                                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none"
                                placeholder="https://example.com"
                            />
                        </div>


                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.has_input}
                                    onChange={(e) => setFormData({ ...formData, has_input: e.target.checked })}
                                    className="rounded bg-white border-gray-300 text-gray-900 focus:ring-gray-500"
                                />
                                Include Input Field
                            </label>

                            <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="rounded bg-white border-gray-300 text-gray-900 focus:ring-gray-500"
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

                        {/* Photo Upload Section */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Photos (Optional)</label>
                            <div className="space-y-3">
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
                                        <Upload className="w-4 h-4 text-gray-600" />
                                        <span className="text-sm text-gray-700">Choose Photos</span>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                        />
                                    </label>
                                    {selectedFiles.length > 0 && (
                                        <span className="text-sm text-gray-600">
                                            {selectedFiles.length} photo{selectedFiles.length !== 1 ? 's' : ''} selected
                                        </span>
                                    )}
                                </div>

                                {/* Selected Files Preview */}
                                {selectedFiles.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {selectedFiles.map((file, index) => (
                                            <div key={index} className="relative group">
                                                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => removeSelectedFile(index)}
                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                                <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <Button
                            onClick={handleCreate}
                            disabled={uploadingPhotos}
                            className="w-full bg-gray-900 hover:bg-gray-800 mt-4 text-white disabled:opacity-50"
                        >
                            {uploadingPhotos ? (
                                <>
                                    <Upload className="w-4 h-4 mr-2 animate-spin" />
                                    Uploading Photos...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    {formData.id ? 'Update Announcement' : 'Create Announcement'}
                                </>

                            )}
                        </Button>
                    </div>
                </div>
            )}

            <div className="grid gap-4">
                {announcements.map((announcement) => (
                    <div
                        key={announcement.id}
                        className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{announcement.title}</h3>
                                <p className="text-gray-700 leading-relaxed mb-4">{announcement.content}</p>

                                {/* Photos Display */}
                                {announcement.photos && announcement.photos.length > 0 && (
                                    <div className="mb-4">
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                            {announcement.photos.map((photo, index) => (
                                                <div key={index} className="aspect-square">
                                                    <img
                                                        src={photo}
                                                        alt={`${announcement.title} photo ${index + 1}`}
                                                        className="w-full h-full object-cover rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                    <span>Created: {new Date(announcement.created_at).toLocaleDateString()}</span>
                                    {announcement.has_input && (
                                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                                            Interactive
                                        </span>
                                    )}
                                    {announcement.photos && announcement.photos.length > 0 && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                                            <ImageIcon className="w-3 h-3" />
                                            {announcement.photos.length} photo{announcement.photos.length !== 1 ? 's' : ''}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 ml-4">
                                <button
                                    onClick={() => toggleActive(announcement.id, announcement.is_active)}
                                    className={`p-2 rounded-lg transition-colors ${announcement.is_active
                                        ? 'text-gray-900 hover:bg-gray-100'
                                        : 'text-gray-400 hover:bg-gray-100'
                                        }`}
                                    title={announcement.is_active ? 'Deactivate' : 'Activate'}
                                >
                                    {announcement.is_active ? (
                                        <ToggleRight className="w-6 h-6" />
                                    ) : (
                                        <ToggleLeft className="w-6 h-6" />
                                    )}
                                </button>
                                <button
                                    onClick={() => handleEdit(announcement)}
                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <Edit className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(announcement.id)}
                                    className="p-2 text-gray-600 hover:bg-gray-100 hover:text-red-600 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {announcement.is_active && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="inline-flex items-center px-3 py-1 bg-gray-900 text-white text-sm rounded-full">
                                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                    Currently Active
                                </div>
                            </div>
                        )}
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
