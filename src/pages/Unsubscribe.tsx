import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Mail } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://sakec.acm.org/api';

export default function Unsubscribe() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Invalid unsubscribe link');
      setLoading(false);
      return;
    }

    handleUnsubscribe();
  }, [token]);

  const handleUnsubscribe = async () => {
    try {
      const response = await fetch(`${API_URL}/newsletter-unsubscribe.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setEmail(data.email || '');
      } else {
        setError(data.message || 'Failed to unsubscribe');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-20">
        <div className="backdrop-blur-xl bg-white/95 rounded-2xl p-8 max-w-md text-center shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-900">Processing your request...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-20">
        <div className="backdrop-blur-xl bg-white/95 border border-green-200 rounded-2xl p-8 max-w-md text-center shadow-lg">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Successfully Unsubscribed</h2>
          <p className="text-gray-700 mb-4">
            {email && `${email} has been `}removed from our newsletter mailing list.
          </p>
          <p className="text-gray-600 text-sm mb-6">
            We're sorry to see you go! You will no longer receive newsletter emails from SAKEC ACM.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all font-semibold"
            >
              Back to Home
            </button>
            
            <button
              onClick={() => navigate('/events')}
              className="w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-all font-semibold"
            >
              View Events
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Changed your mind?</p>
            <button
              onClick={() => navigate('/#newsletter')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-2 mx-auto"
            >
              <Mail className="w-4 h-4" />
              Subscribe Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-20">
      <div className="backdrop-blur-xl bg-white/95 border border-red-200 rounded-2xl p-8 max-w-md text-center shadow-lg">
        <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Unsubscribe Failed</h2>
        <p className="text-gray-700 mb-6">{error}</p>
        
        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all font-semibold"
          >
            Back to Home
          </button>
          
          <p className="text-sm text-gray-600 mt-4">
            Need help? Contact us at{' '}
            <a href="mailto:support@sakec.acm.org" className="text-blue-600 hover:underline">
              support@sakec.acm.org
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
