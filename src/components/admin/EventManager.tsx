import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit, Trash2, Save, X, FileText } from 'lucide-react';
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
    if (confirm('Are you sure you want to delete this event?')) {
      await supabase.from('events').delete().eq('id', id);
      loadEvents();
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

  if (loading) return <div className="text-white">Loading...</div>;

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
        <h2 className="text-2xl font-bold text-white">Events</h2>
        <button
          onClick={startAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      {(showAddForm || editingId) && (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            {editingId ? 'Edit Event' : 'Add New Event'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Event Title"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white md:col-span-2"
            />
            <textarea
              placeholder="Description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white md:col-span-2 h-24"
            />
            <input
              type="date"
              value={formData.date || ''}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
            />
            <input
              type="time"
              value={formData.time || ''}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
            />
            <input
              type="text"
              placeholder="Location"
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={formData.image_url || ''}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={formData.image_url || ''}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
            />

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm text-gray-400">Registration Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input
                    type="radio"
                    name="regType"
                    checked={!formData.registration_link || formData.registration_link.startsWith('http')}
                    onChange={() => {
                      // If switching to link, keep existing link or clear
                    }}
                    className="w-4 h-4"
                  />
                  External Link (Google Form, etc.)
                </label>
                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input
                    type="radio"
                    name="regType"
                    checked={formData.registration_link === 'custom'}
                    onChange={() => setFormData({ ...formData, registration_link: 'custom' })}
                    className="w-4 h-4"
                  />
                  Custom Form (Built-in)
                </label>
              </div>
            </div>

            {formData.registration_link !== 'custom' && (
              <input
                type="text"
                placeholder="Registration Link (e.g., Google Form URL)"
                value={formData.registration_link === 'custom' ? '' : formData.registration_link || ''}
                onChange={(e) => setFormData({ ...formData, registration_link: e.target.value })}
                className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white md:col-span-2"
              />
            )}

            {formData.registration_link === 'custom' && (
              <div className="md:col-span-2 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <p className="text-blue-200 text-sm mb-2">
                  You have selected "Custom Form". After saving this event, click the <FileText className="w-3 h-3 inline" /> icon in the event list to build your form fields.
                </p>
              </div>
            )}
            <input
              type="number"
              placeholder="Max Participants"
              value={formData.max_participants || ''}
              onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) })}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
            />
            <label className="flex items-center gap-2 text-white">
              <input
                type="checkbox"
                checked={formData.is_featured || false}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-4 h-4"
              />
              Featured Event
            </label>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              <Save className="w-4 h-4" /> Save
            </button>
            <button
              onClick={() => {
                setEditingId(null);
                setShowAddForm(false);
                setFormData({});
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
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
            className="bg-gray-800/50 rounded-xl p-4 border border-gray-700"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-white font-semibold text-lg">{event.title}</h3>
                  {event.is_featured && (
                    <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded">Featured</span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-2">{event.description}</p>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                  <span>🕐 {event.time}</span>
                  <span>📍 {event.location}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFormBuilderEvent({ id: event.id, title: event.title })}
                  className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                  title="Create Registration Form"
                >
                  <FileText className="w-4 h-4" />
                </button>
                <button
                  onClick={() => startEdit(event)}
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
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
