import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Plus, Edit, Trash2, Save, X, FileText, Users } from 'lucide-react';
import EventFormBuilder from './EventFormBuilder';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image_url: string;
  registration_link?: string;
  max_participants?: number;
  is_featured: boolean;
}

export default function EventManager() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Event>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [formBuilderEvent, setFormBuilderEvent] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false });

    if (!error && data) {
      setEvents(data);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (editingId) {
      await supabase
        .from('events')
        .update(formData)
        .eq('id', editingId);
    } else {
      await supabase
        .from('events')
        .insert([formData]);
    }

    setEditingId(null);
    setShowAddForm(false);
    setFormData({});
    loadEvents();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this event? This will also delete all related registration forms and registrations.')) {
      const { error } = await supabase.from('events').delete().eq('id', id);
      
      if (error) {
        console.error('Delete error:', error);
        alert(`Failed to delete event: ${error.message}`);
      } else {
        alert('Event deleted successfully!');
        loadEvents();
      }
    }
  };

  const startEdit = (event: Event) => {
    setEditingId(event.id);
    setFormData(event);
    setShowAddForm(false);
  };

  const startAdd = () => {
    setShowAddForm(true);
    setEditingId(null);
    setFormData({ is_featured: false });
  };

  if (loading) return <div className="text-gray-600">Loading...</div>;

  return (
    <div className="space-y-6">
      {formBuilderEvent && (
        <EventFormBuilder
          eventId={formBuilderEvent.id}
          eventTitle={formBuilderEvent.title}
          onClose={() => setFormBuilderEvent(null)}
        />
      )}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Events</h2>
        <button
          onClick={startAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      {(showAddForm || editingId) && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit Event' : 'Add New Event'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Web Development Workshop"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Describe your event..."
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={formData.time || ''}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Seminar Hall, Room 301"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Image URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="https://example.com/image.jpg"
                value={formData.image_url || ''}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>

            <div className="md:col-span-2 space-y-3 border-t border-gray-200 pt-4">
              <label className="block text-sm font-medium text-gray-700">
                Registration Type
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <label className="flex items-center gap-2 text-gray-900 cursor-pointer bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                  <input
                    type="radio"
                    name="regType"
                    checked={!formData.registration_link || formData.registration_link.startsWith('http')}
                    onChange={() => {
                      if (formData.registration_link === 'custom') {
                        setFormData({ ...formData, registration_link: '' });
                      }
                    }}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div>
                    <div className="font-medium">External Link</div>
                    <div className="text-xs text-gray-500">Google Form, Typeform, etc.</div>
                  </div>
                </label>
                <label className="flex items-center gap-2 text-gray-900 cursor-pointer bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                  <input
                    type="radio"
                    name="regType"
                    checked={formData.registration_link === 'custom'}
                    onChange={() => setFormData({ ...formData, registration_link: 'custom' })}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div>
                    <div className="font-medium">Custom Form</div>
                    <div className="text-xs text-gray-500">Build your own form</div>
                  </div>
                </label>
              </div>
            </div>

            {formData.registration_link !== 'custom' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Link (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://forms.google.com/..."
                  value={formData.registration_link === 'custom' ? '' : formData.registration_link || ''}
                  onChange={(e) => setFormData({ ...formData, registration_link: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty if no registration required</p>
              </div>
            )}

            {formData.registration_link === 'custom' && (
              <div className="md:col-span-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-700 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  After saving this event, click the <FileText className="w-3 h-3 inline" /> icon in the event list to build your custom registration form.
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Participants (Optional)
              </label>
              <input
                type="number"
                placeholder="e.g., 100"
                min="1"
                value={formData.max_participants || ''}
                onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) || undefined })}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty for unlimited</p>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 text-gray-900 cursor-pointer bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.is_featured || false}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4 text-blue-600"
                />
                <div>
                  <div className="font-medium">Featured Event</div>
                  <div className="text-xs text-gray-500">Show on homepage</div>
                </div>
              </label>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-sm"
            >
              <Save className="w-4 h-4" /> Save
            </button>
            <button
              onClick={() => {
                setEditingId(null);
                setShowAddForm(false);
                setFormData({});
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-gray-900 font-semibold text-lg">{event.title}</h3>
                  {event.is_featured && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded border border-yellow-200">Featured</span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                  <span>🕐 {event.time}</span>
                  <span>📍 {event.location}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/admin/event/${event.id}`)}
                  className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
                  title="Manage Event Attendance"
                >
                  <Users className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setFormBuilderEvent({ id: event.id, title: event.title })}
                  className="p-2 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg transition-colors"
                  title="Create Registration Form"
                >
                  <FileText className="w-4 h-4" />
                </button>
                <button
                  onClick={() => startEdit(event)}
                  className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
