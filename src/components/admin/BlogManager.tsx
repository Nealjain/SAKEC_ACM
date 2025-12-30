import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url?: string;
  image_1?: string;
  image_2?: string;
  image_3?: string;
  image_4?: string;
  author_id?: string;
  category: string;
  tags?: string[];
  reading_time?: number;
  is_published: boolean;
  created_at: string;
}

export default function BlogManager() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Blog>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [notifySubscribers, setNotifySubscribers] = useState(false);
  const [teamMembers, setTeamMembers] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    loadBlogs();
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    const { data } = await supabase.from('team_members').select('id, name').order('name');
    if (data) setTeamMembers(data);
  };

  const loadBlogs = async () => {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setBlogs(data);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.title || !formData.content || !formData.image_1) {
      alert('Please fill in all required fields: Title, Content, and Image URL.');
      return;
    }

    if (editingId) {
      await supabase
        .from('blogs')
        .update(formData)
        .eq('id', editingId);
    } else {
      await supabase
        .from('blogs')
        .insert([formData]);
    }

    // Handle Newsletter Notification
    if (notifySubscribers && formData.title) {
      try {
        // Get subscriber count
        const { count } = await supabase
          .from('newsletter_subscribers')
          .select('*', { count: 'exact', head: true });

        // Log the newsletter send
        await supabase
          .from('newsletter_logs')
          .insert([{
            subject: `New Blog Post: ${formData.title}`,
            content: `Check out our new blog post: ${formData.title}\n\n${formData.excerpt || ''}`,
            recipient_count: count || 0
          }]);

        alert(`Newsletter queued for ${count || 0} subscribers!`);
      } catch (err) {
        console.error('Error sending newsletter:', err);
      }
    }

    setEditingId(null);
    setShowAddForm(false);
    setFormData({});
    setNotifySubscribers(false);
    loadBlogs();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      await supabase.from('blogs').delete().eq('id', id);
      loadBlogs();
    }
  };

  const startEdit = (blog: Blog) => {
    setEditingId(blog.id);
    setFormData(blog); // The DB returns existing data, which matches the interface
    setShowAddForm(false);
  };

  const startAdd = () => {
    setShowAddForm(true);
    setEditingId(null);
    setFormData({ is_published: false });
  };

  if (loading) return <div className="text-gray-600">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Blog Posts</h2>
        <button
          onClick={startAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Blog Post
        </button>
      </div>

      {(showAddForm || editingId) && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit Blog Post' : 'Add New Blog Post'}
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Blog Title *"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={formData.author_id || ''}
                onChange={(e) => setFormData({ ...formData, author_id: e.target.value })}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">Select Author</option>
                {teamMembers.map(member => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Reading Time (minutes)"
                value={formData.reading_time || ''}
                onChange={(e) => setFormData({ ...formData, reading_time: parseInt(e.target.value) || 0 })}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <textarea
              placeholder="Excerpt (short description)"
              value={formData.excerpt || ''}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 h-20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <textarea
              placeholder="Full Content *"
              value={formData.content || ''}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 h-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Images</label>
              <input
                type="text"
                placeholder="Image 1 URL (Main Image) *"
                value={formData.image_1 || ''}
                onChange={(e) => setFormData({ ...formData, image_1: e.target.value })}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none mb-2"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Image 2 URL (Optional)"
                  value={formData.image_2 || ''}
                  onChange={(e) => setFormData({ ...formData, image_2: e.target.value })}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Image 3 URL (Optional)"
                  value={formData.image_3 || ''}
                  onChange={(e) => setFormData({ ...formData, image_3: e.target.value })}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Image 4 URL (Optional)"
                  value={formData.image_4 || ''}
                  onChange={(e) => setFormData({ ...formData, image_4: e.target.value })}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Category"
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={formData.tags?.join(', ') || ''}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-gray-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_published || false}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="w-4 h-4 rounded bg-white border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Publish immediately
              </label>

              <label className="flex items-center gap-2 text-gray-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifySubscribers}
                  onChange={(e) => setNotifySubscribers(e.target.checked)}
                  className="w-4 h-4 rounded bg-white border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Notify all subscribers via email
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
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-gray-900 font-semibold text-lg">{blog.title}</h3>
                  {blog.is_published ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded border border-green-200">Published</span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded border border-gray-200">Draft</span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-2">{blog.excerpt}</p>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>📁 {blog.category}</span>
                  <span>📅 {new Date(blog.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(blog)}
                  className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(blog.id)}
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
