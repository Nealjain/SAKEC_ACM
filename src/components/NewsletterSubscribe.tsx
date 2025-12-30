import { useState } from 'react';
import { Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic email validation
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // 1. Save to Supabase
      const { error: dbError } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email, name }]);

      if (dbError) {
        if (dbError.code === '23505') { // Unique violation
          toast.error('This email is already subscribed!');
        } else {
          toast.error('Failed to subscribe. Please try again.');
          console.error('Supabase error:', dbError);
        }
        return;
      }

      // 2. Trigger PHP Script (Send Welcome Email) - Non-blocking
      // We don't await this strictly for the UI to show success, but in prod it sends the email
      if (!import.meta.env.DEV) {
        fetch('/api/newsletter-subscribe.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name }),
        }).catch(err => console.error('PHP script error:', err));
      } else {
        console.log('Dev mode: PHP script skipped');
      }

      toast.success('Successfully subscribed to the newsletter!');
      setEmail('');
      setName('');

    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-2xl p-8 bg-white/50 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-4">
        <Mail className="w-6 h-6 text-gray-900" />
        <h3 className="text-2xl font-bold text-gray-900">Subscribe to Our Newsletter</h3>
      </div>
      <p className="text-gray-600 mb-6">
        Get the latest updates on events, workshops, and tech insights delivered to your inbox.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name (optional)"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all bg-white"
          />
        </div>
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all bg-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all border border-gray-900 hover:border-gray-800"
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>
      </form>

      <p className="text-xs text-gray-500 mt-4">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  );
}
