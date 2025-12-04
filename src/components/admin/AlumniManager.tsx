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

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Alumni Members</h2>
        <button
          onClick={startAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          <Plus className="w-4 h-4" /> Add Alumni
        </button>
      </div>

      {(showAddForm || editingId) && (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            {editingId ? 'Edit Alumni Member' : 'Add New Alumni Member'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
            />
            <input
              type="text"
              placeholder="Position/Role"
              value={formData.position || ''}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
            />
            <input
              type="text"
              placeholder="Department"
              value={formData.department || ''}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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
              type="number"
              placeholder="Display Order"
              value={formData.display_order || 0}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
            />
            <textarea
              placeholder="Bio"
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white md:col-span-2 h-24"
            />
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
        {members.map((member) => (
          <div
            key={member.id}
            className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              {member.image_url && (
                <img
                  src={member.image_url}
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div>
                <h3 className="text-white font-semibold">{member.name}</h3>
                <p className="text-gray-400 text-sm">{member.position}</p>
                <p className="text-gray-500 text-xs">{member.department}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(member)}
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(member.id)}
                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
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
