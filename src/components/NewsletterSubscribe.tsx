import { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://sakec.acm.org/api';

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch(`${API_URL}/newsletter-subscribe.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setEmail('');
        setName('');
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(data.message || 'Failed to subscribe');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
      <div className="flex items-center gap-3 mb-4">
        <Mail className="w-6 h-6" />
        <h3 className="text-2xl font-bold">Subscribe to Our Newsletter</h3>
      </div>
      <p className="text-blue-100 mb-6">
        Get the latest updates on events, workshops, and tech insights delivered to your inbox.
      </p>

      {success && (
        <div className="bg-green-500 text-white rounded-lg p-4 mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>Successfully subscribed! Check your email for confirmation.</span>
        </div>
      )}

      {error && (
        <div className="bg-red-500 text-white rounded-lg p-4 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name (optional)"
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:border-white/40 focus:bg-white/20 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:border-white/40 focus:bg-white/20 transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>
      </form>

      <p className="text-xs text-blue-100 mt-4">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  );
}
