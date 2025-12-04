import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url: string;
  category: string;
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

  useEffect(() => {
    loadBlogs();
  }, []);

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
    setFormData(blog);
    setShowAddForm(false);
  };

  const startAdd = () => {
    setShowAddForm(true);
    setEditingId(null);
    setFormData({ is_published: false });
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Blog Posts</h2>
        <button
          onClick={startAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          <Plus className="w-4 h-4" /> Add Blog Post
        </button>
      </div>

      {(showAddForm || editingId) && (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            {editingId ? 'Edit Blog Post' : 'Add New Blog Post'}
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Blog Title"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
            />
            <textarea
              placeholder="Excerpt (short description)"
              value={formData.excerpt || ''}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white h-20"
            />
            <textarea
              placeholder="Full Content"
              value={formData.content || ''}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white h-64"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Image URL"
                value={formData.image_url || ''}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              />
              <input
                type="text"
                placeholder="Category"
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_published || false}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="w-4 h-4 rounded bg-gray-900 border-gray-700"
                />
                Publish immediately
              </label>

              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifySubscribers}
                  onChange={(e) => setNotifySubscribers(e.target.checked)}
                  className="w-4 h-4 rounded bg-gray-900 border-gray-700"
                />
                Notify all subscribers via email
              </label>
            </div>
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
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-gray-800/50 rounded-xl p-4 border border-gray-700"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-white font-semibold text-lg">{blog.title}</h3>
                  {blog.is_published ? (
                    <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">Published</span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-600 text-white text-xs rounded">Draft</span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-2">{blog.excerpt}</p>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>📁 {blog.category}</span>
                  <span>📅 {new Date(blog.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(blog)}
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(blog.id)}
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
