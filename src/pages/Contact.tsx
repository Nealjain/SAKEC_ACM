import { useState, FormEvent } from 'react'
import { Mail, MapPin, Phone, ExternalLink, AlertCircle } from 'lucide-react'
import { submitContactForm } from "@/lib/contact"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [showFallback, setShowFallback] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    const result = await submitContactForm(formData)

    if (result.success) {
      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setStatus('idle'), 3000)
    } else {
      setStatus('error')
      setErrorMessage(result.error || 'Failed to submit form')

      // Show fallback after a few seconds if there's a server error
      if (result.error?.includes('server') || result.error?.includes('Network')) {
        setTimeout(() => setShowFallback(true), 2000)
      }
    }
  }

  const handleEmailFallback = () => {
    const subject = encodeURIComponent(`Contact Form: ${formData.subject}`)
    const body = encodeURIComponent(`Hi SAKEC ACM Team,

Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}

Best regards,
${formData.name}`)

    window.open(`mailto:support@sakec.acm.org?subject=${subject}&body=${body}`, '_blank')
  }

  return (
    <div className="pt-24 pb-16 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center text-gray-900">Contact Us</h1>
        <p className="text-xl text-gray-700 mb-12 text-center">
          Get in touch with us for any queries or collaborations
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 shadow-lg">
            {showFallback && status === 'error' ? (
              <div className="space-y-6">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-5 h-5 text-gray-900 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Alternative Contact Method</h3>
                    <p className="text-gray-600 mb-4">
                      Our contact form is temporarily unavailable. You can reach us directly via email.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleEmailFallback}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all"
                >
                  <Mail className="w-4 h-4" />
                  Send Email Directly
                  <ExternalLink className="w-4 h-4" />
                </button>

                <p className="text-sm text-gray-500 text-center">
                  This will open your email client with a pre-filled message
                </p>

                <button
                  onClick={() => setShowFallback(false)}
                  className="w-full px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  ← Back to form
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-900">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-900">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2 text-gray-900">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all"
                    placeholder="What's this about?"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-900">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all resize-none"
                    placeholder="Your message..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full px-6 py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
                >
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                </button>

                {status === 'success' && (
                  <div className="border border-gray-300 rounded-lg p-4 bg-white text-center">
                    <p className="text-gray-900 font-medium">Message sent successfully!</p>
                  </div>
                )}
                {status === 'error' && !showFallback && (
                  <div className="border border-gray-300 rounded-lg p-4 bg-white">
                    <p className="text-gray-900 font-medium">{errorMessage}</p>
                    {(errorMessage.includes('server') || errorMessage.includes('Network')) && (
                      <p className="text-sm text-gray-600 mt-2">
                        Having trouble? Try the email fallback option above.
                      </p>
                    )}
                  </div>
                )}
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">Get In Touch</h2>
              <p className="text-gray-700 mb-8 leading-relaxed">
                Have questions or want to collaborate? We'd love to hear from you.
                Fill out the form or reach us through the contact details below.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="p-3 bg-gray-900 rounded-lg">
                    <Mail className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-gray-900">Email</h3>
                    <a href="mailto:support@sakec.acm.org" className="text-gray-700 hover:text-gray-900 transition-colors">
                      support@sakec.acm.org
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="p-3 bg-gray-900 rounded-lg">
                    <Phone className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-gray-900">Phone</h3>
                    <p className="text-gray-700">+91 89284 84014</p>
                    <p className="text-gray-700">+91 93728 20541</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="p-3 bg-gray-900 rounded-lg">
                    <MapPin className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-gray-900">Address</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Shah & Anchor Kutchhi Engineering College<br />
                      Chembur, Mumbai, Maharashtra
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
