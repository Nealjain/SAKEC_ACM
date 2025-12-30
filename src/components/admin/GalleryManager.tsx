import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface GalleryEvent {
  id: string;
  event_name: string;
  description: string;
  event_date: string;
  image_1: string;
  image_2: string;
  image_3: string;
  image_4: string;
  is_featured: boolean;
}

export default function GalleryManager() {
  const [events, setEvents] = useState<GalleryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<GalleryEvent>>({});
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const { data, error } = await supabase
      .from('event_galleries')
      .select('*')
      .order('event_date', { ascending: false });

    if (!error && data) {
      setEvents(data);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (editingId) {
      await supabase
        .from('event_galleries')
        .update(formData)
        .eq('id', editingId);
    } else {
      await supabase
        .from('event_galleries')
        .insert([formData]);
    }

    setEditingId(null);
    setShowAddForm(false);
    setFormData({});
    loadEvents();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this gallery event?')) {
      await supabase.from('event_galleries').delete().eq('id', id);
      loadEvents();
    }
  };

  const startEdit = (event: GalleryEvent) => {
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gallery Events</h2>
        <button
          onClick={startAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Gallery Event
        </button>
      </div>

      {(showAddForm || editingId) && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit Gallery Event' : 'Add New Gallery Event'}
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Event Name"
              value={formData.event_name || ''}
              onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <textarea
              placeholder="Description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 h-20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <input
              type="date"
              value={formData.event_date || ''}
              onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Image 1 URL"
                value={formData.image_1 || ''}
                onChange={(e) => setFormData({ ...formData, image_1: e.target.value })}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="Image 2 URL"
                value={formData.image_2 || ''}
                onChange={(e) => setFormData({ ...formData, image_2: e.target.value })}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="Image 3 URL"
                value={formData.image_3 || ''}
                onChange={(e) => setFormData({ ...formData, image_3: e.target.value })}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="Image 4 URL"
                value={formData.image_4 || ''}
                onChange={(e) => setFormData({ ...formData, image_4: e.target.value })}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <label className="flex items-center gap-2 text-gray-900 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured || false}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-4 h-4 rounded bg-white border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Featured Event
            </label>
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
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-gray-900 font-semibold text-lg">{event.event_name}</h3>
                  {event.is_featured && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded border border-yellow-200">Featured</span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                <p className="text-gray-500 text-sm">📅 {new Date(event.event_date).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
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
            <div className="grid grid-cols-4 gap-2">
              {event.image_1 && <img src={event.image_1} alt="" className="w-full h-20 object-cover rounded border border-gray-200" />}
              {event.image_2 && <img src={event.image_2} alt="" className="w-full h-20 object-cover rounded border border-gray-200" />}
              {event.image_3 && <img src={event.image_3} alt="" className="w-full h-20 object-cover rounded border border-gray-200" />}
              {event.image_4 && <img src={event.image_4} alt="" className="w-full h-20 object-cover rounded border border-gray-200" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
