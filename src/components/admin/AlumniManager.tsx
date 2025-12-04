import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface AlumniMember {
  id: string;
  name: string;
  position: string;
  bio?: string;
  image_url?: string;
  department: string;
  display_order: number;
}

export default function AlumniManager() {
  const [members, setMembers] = useState<AlumniMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<AlumniMember>>({});
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    const { data, error } = await supabase
      .from('alumni_members')
      .select('*')
      .order('display_order', { ascending: true });

    if (!error && data) {
      setMembers(data);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (editingId) {
      await supabase
        .from('alumni_members')
        .update(formData)
        .eq('id', editingId);
    } else {
      await supabase
        .from('alumni_members')
        .insert([formData]);
    }

    setEditingId(null);
    setShowAddForm(false);
    setFormData({});
    loadMembers();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this alumni member?')) {
      await supabase.from('alumni_members').delete().eq('id', id);
      loadMembers();
    }
  };

  const startEdit = (member: AlumniMember) => {
    setEditingId(member.id);
    setFormData(member);
    setShowAddForm(false);
  };

  const startAdd = () => {
    setShowAddForm(true);
    setEditingId(null);
    setFormData({ display_order: 0 });
  };

  if (loading) return <div className="text-gray-600">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Alumni Members</h2>
        <button
          onClick={startAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Alumni
        </button>
      </div>

      {(showAddForm || editingId) && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit Alumni Member' : 'Add New Alumni Member'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <input
              type="text"
              placeholder="Position/Role"
              value={formData.position || ''}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <input
              type="text"
              placeholder="Department"
              value={formData.department || ''}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={formData.image_url || ''}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <input
              type="number"
              placeholder="Display Order"
              value={formData.display_order || 0}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <textarea
              placeholder="Bio"
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 md:col-span-2 h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
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
        {members.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              {member.image_url && (
                <img
                  src={member.image_url}
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover border border-gray-200"
                />
              )}
              <div>
                <h3 className="text-gray-900 font-semibold">{member.name}</h3>
                <p className="text-gray-600 text-sm">{member.position}</p>
                <p className="text-gray-500 text-xs">{member.department}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(member)}
                className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(member.id)}
                className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
