import { useState, FormEvent } from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'
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
    }
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
                  className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
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
                  className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
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
                  className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
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
                  className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </button>

              {status === 'success' && (
                <p className="text-green-600 text-center font-medium">Message sent successfully!</p>
              )}
              {status === 'error' && (
                <p className="text-red-600 text-center font-medium">{errorMessage}</p>
              )}
            </form>
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
                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="p-3 bg-blue-600 rounded-lg">
                    <Mail className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-gray-900">Email</h3>
                    <a href="mailto:support@sakec.acm.org" className="text-blue-600 hover:text-blue-700 transition-colors">
                      support@sakec.acm.org
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="p-3 bg-purple-600 rounded-lg">
                    <Phone className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-gray-900">Phone</h3>
                    <p className="text-gray-700">+91 XXXXXXXXXX</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="p-3 bg-green-600 rounded-lg">
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
