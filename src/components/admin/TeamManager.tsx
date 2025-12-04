import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  email: string;
  image_url: string;
  linkedin_url?: string;
  github_url?: string;
  year?: string;
  department?: string;
  PRN?: string;
}

export default function TeamManager() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<TeamMember>>({});
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    const { data, error } = await supabase
      .from('team_members')
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
        .from('team_members')
        .update(formData)
        .eq('id', editingId);
    } else {
      await supabase
        .from('team_members')
        .insert([formData]);
    }
    
    setEditingId(null);
    setShowAddForm(false);
    setFormData({});
    loadMembers();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this member?')) {
      await supabase.from('team_members').delete().eq('id', id);
      loadMembers();
    }
  };

  const startEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setFormData(member);
    setShowAddForm(false);
  };

  const startAdd = () => {
    setShowAddForm(true);
    setEditingId(null);
    setFormData({});
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Team Members</h2>
        <button
          onClick={startAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      {(showAddForm || editingId) && (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            {editingId ? 'Edit Member' : 'Add New Member'}
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
              placeholder="Position"
              value={formData.position || ''}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              placeholder="LinkedIn URL"
              value={formData.linkedin_url || ''}
              onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
            />
            <input
              type="text"
              placeholder="GitHub URL"
              value={formData.github_url || ''}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
            />
            <input
              type="text"
              placeholder="Year"
              value={formData.year || ''}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
            />
            <input
              type="text"
              placeholder="Department"
              value={formData.department || ''}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
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
                <p className="text-gray-500 text-xs">{member.email}</p>
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
