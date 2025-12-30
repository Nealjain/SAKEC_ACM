import { useState, useEffect } from 'react';
import { X, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'https://sakec.acm.org/api';

// Configuration - Change these values to customize the popup
const POPUP_CONFIG = {
  // Position: 'bottom-right' | 'center'
  position: 'bottom-right' as 'bottom-right' | 'center',
  
  // Show image in popup
  showImage: true,
  
  // Image URL (optional - uses logo by default)
  imageUrl: '/logo.png',
  
  // Delay before showing popup (milliseconds)
  showDelay: 5000, // 5 seconds
  
  // Show popup again after closing (days)
  showAgainAfterDays: 7,
};

export default function NewsletterPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user has closed the popup recently
    const lastClosed = localStorage.getItem('newsletter-popup-closed');
    if (lastClosed) {
      const daysSinceClosed = (Date.now() - parseInt(lastClosed)) / (1000 * 60 * 60 * 24);
      if (daysSinceClosed < POPUP_CONFIG.showAgainAfterDays) {
        return;
      }
    }

    // Check if user is already subscribed
    const isSubscribed = localStorage.getItem('newsletter-subscribed');
    if (isSubscribed) {
      return;
    }

    // Show popup after delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, POPUP_CONFIG.showDelay);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('newsletter-popup-closed', Date.now().toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/newsletter-subscribe.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        localStorage.setItem('newsletter-subscribed', 'true');
        setTimeout(() => {
          setIsVisible(false);
        }, 3000);
      } else {
        setError(data.message || 'Failed to subscribe');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPositionClasses = () => {
    if (POPUP_CONFIG.position === 'center') {
      return 'items-center justify-center';
    }
    return 'items-end justify-end p-4 md:p-6';
  };

  const getAnimationVariants = () => {
    if (POPUP_CONFIG.position === 'center') {
      return {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
      };
    }
    return {
      initial: { opacity: 0, y: 100, x: 100 },
      animate: { opacity: 1, y: 0, x: 0 },
      exit: { opacity: 0, y: 100, x: 100 },
    };
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop for center position */}
          {POPUP_CONFIG.position === 'center' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={handleClose}
            />
          )}

          {/* Popup Container */}
          <div className={`fixed inset-0 pointer-events-none z-50 flex ${getPositionClasses()}`}>
            <motion.div
              {...getAnimationVariants()}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`pointer-events-auto bg-white border-2 border-black shadow-2xl relative ${
                POPUP_CONFIG.position === 'center'
                  ? 'w-full max-w-md mx-4'
                  : 'w-full max-w-sm'
              }`}
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 p-1.5 bg-white hover:bg-gray-100 rounded-full transition-colors z-20 border border-gray-300 shadow-sm"
                aria-label="Close"
                title="Close"
              >
                <X className="w-4 h-4 text-gray-700 hover:text-gray-900" />
              </button>

              {/* Content */}
              <div className="p-6">
                {/* Image Section (Optional) */}
                {POPUP_CONFIG.showImage && (
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center">
                      <img
                        src={POPUP_CONFIG.imageUrl}
                        alt="SAKEC ACM"
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                  </div>
                )}

                {/* Success State */}
                {success ? (
                  <div className="text-center py-4">
                    <CheckCircle className="w-12 h-12 text-black mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      You're Subscribed!
                    </h3>
                    <p className="text-sm text-gray-600">
                      Check your email for confirmation.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Header */}
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center justify-center w-10 h-10 bg-black rounded-full mb-3">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        Stay Updated
                      </h3>
                      <p className="text-sm text-gray-600">
                        Get the latest events and tech insights
                      </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-red-700">{error}</p>
                      </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="w-full px-4 py-2.5 border-2 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors text-sm"
                      />
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2.5 bg-black text-white font-semibold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
                      >
                        {loading ? 'Subscribing...' : 'Subscribe'}
                      </button>
                    </form>

                    {/* Privacy Note */}
                    <p className="text-xs text-gray-500 text-center mt-3">
                      We respect your privacy. Unsubscribe anytime.
                    </p>
                  </>
                )}
              </div>

              {/* Bottom Accent */}
              <div className="h-1 bg-black" />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
