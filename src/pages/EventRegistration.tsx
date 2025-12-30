import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { sendEventRegistrationConfirmation } from '../lib/email';
import { Calendar, MapPin, Clock, CheckCircle, AlertCircle, Upload, X } from 'lucide-react';

interface FormField {
  id: string;
  field_name: string;
  field_label: string;
  field_type: string;
  field_options?: string[];
  is_required: boolean;
  display_order: number;
}

interface RegistrationForm {
  id: string;
  event_id: string;
  form_title: string;
  form_description?: string;
  is_active: boolean;
  max_registrations?: number;
  registration_deadline?: string;
  allowed_email_domains?: string[];
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image_url: string;
}

export default function EventRegistration() {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<RegistrationForm | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [fields, setFields] = useState<FormField[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<Record<string, any>>({
    name: '',
    email: '',
    phone: ''
  });
  const [photoFiles, setPhotoFiles] = useState<Record<string, File>>({});
  const [photoPreviews, setPhotoPreviews] = useState<Record<string, string>>({});

  useEffect(() => {
    loadFormData();
  }, [formId]);

  const loadFormData = async () => {
    try {
      const { data: formData, error: formError } = await supabase
        .from('event_registration_forms')
        .select('*')
        .eq('id', formId)
        .single();

      if (formError || !formData) {
        setError('Registration form not found');
        setLoading(false);
        return;
      }

      if (!formData.is_active) {
        setError('This registration form is no longer accepting responses');
        setLoading(false);
        return;
      }

      if (formData.registration_deadline) {
        const deadline = new Date(formData.registration_deadline);
        if (deadline < new Date()) {
          setError('Registration deadline has passed');
          setLoading(false);
          return;
        }
      }

      setForm(formData);

      // Check max registrations
      if (formData.max_registrations) {
        const { count } = await supabase
          .from('event_registrations')
          .select('*', { count: 'exact', head: true })
          .eq('form_id', formId);

        if (count && count >= formData.max_registrations) {
          setError('Registration is full. Maximum capacity reached.');
          setLoading(false);
          return;
        }
      }

      const { data: eventData } = await supabase
        .from('events')
        .select('*')
        .eq('id', formData.event_id)
        .single();

      if (eventData) {
        setEvent(eventData);
      }

      const { data: fieldsData } = await supabase
        .from('event_form_fields')
        .select('*')
        .eq('form_id', formId)
        .order('display_order');

      if (fieldsData) {
        setFields(fieldsData);
      }

      setLoading(false);
    } catch (err) {
      console.error('Load error:', err);
      setError('Failed to load registration form');
      setLoading(false);
    }
  };

  const handlePhotoChange = (fieldName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setPhotoFiles(prev => ({ ...prev, [fieldName]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreviews(prev => ({ ...prev, [fieldName]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (fieldName: string) => {
    setPhotoFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[fieldName];
      return newFiles;
    });
    setPhotoPreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[fieldName];
      return newPreviews;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Check basic required fields
    if (!formData.name || !formData.email) {
      setError('Please fill in all required fields');
      setSubmitting(false);
      return;
    }

    // Check required custom fields (excluding photo fields)
    const missingFields = fields.filter(field => {
      if (!field.is_required) return false;

      // For photo fields, check photoFiles instead of formData
      if (field.field_type === 'photo') {
        return !photoFiles[field.field_name];
      }

      // For other fields, check formData
      return !formData[field.field_name];
    });

    if (missingFields.length > 0) {
      const missingFieldNames = missingFields.map(f => f.field_label).join(', ');
      setError(`Please fill in all required fields: ${missingFieldNames}`);
      setSubmitting(false);
      return;
    }

    // Validate email domain if restrictions are set
    if (form?.allowed_email_domains && form.allowed_email_domains.length > 0) {
      const email = formData.email.toLowerCase();
      const isAllowed = form.allowed_email_domains.some(domain =>
        email.endsWith(domain.toLowerCase())
      );

      if (!isAllowed) {
        setError(`Email must be from one of these domains: ${form.allowed_email_domains.join(', ')}`);
        setSubmitting(false);
        return;
      }
    }

    try {
      // Check for existing registration
      const checkEmail = formData.email.trim();
      const checkPhone = formData.phone?.trim();

      let checkQuery = supabase
        .from('event_registrations')
        .select('id')
        .eq('form_id', formId);

      if (checkPhone) {
        checkQuery = checkQuery.or(`participant_email.eq.${checkEmail},participant_phone.eq.${checkPhone}`);
      } else {
        checkQuery = checkQuery.eq('participant_email', checkEmail);
      }

      const { data: existingData, error: checkError } = await checkQuery;

      if (checkError) {
        console.error('Duplicate check error:', checkError);
        setError('Failed to validate registration. Please try again.');
        setSubmitting(false);
        return;
      }

      if (existingData && existingData.length > 0) {
        setError('You have already registered for this event with this email or phone number.');
        setSubmitting(false);
        return;
      }

      // Upload all photos with bucket rotation
      const BUCKETS = ['event-registrations', 'event-registrations1', 'event-registrations2', 'event-registrations3'];
      const photoUrls: Record<string, string> = {};

      for (const [fieldName, file] of Object.entries(photoFiles)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `event-photos/${fileName}`;

        console.log('Uploading photo:', { fieldName, fileName, filePath, fileSize: file.size });

        let uploaded = false;
        let lastError = null;

        // Try buckets in order
        for (const bucket of BUCKETS) {
          try {
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from(bucket)
              .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
              });

            if (uploadError) {
              console.warn(`Upload to ${bucket} failed:`, uploadError);
              lastError = uploadError;
              continue; // Try next bucket
            }

            if (uploadData) {
              const { data } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

              console.log(`Photo uploaded successfully to ${bucket}:`, data.publicUrl);
              photoUrls[fieldName] = data.publicUrl;
              uploaded = true;
              break; // Stop trying buckets
            }
          } catch (err) {
            console.warn(`Unexpected error uploading to ${bucket}:`, err);
            lastError = err;
          }
        }

        if (!uploaded) {
          console.error('All bucket uploads failed. Last error:', lastError);
          setError(`Failed to upload photo for ${fieldName}. Storage limit may be reached.`);
          setSubmitting(false);
          return;
        }
      }

      const submissionData = {
        ...formData,
        ...photoUrls
      };

      const { error: insertError } = await supabase
        .from('event_registrations')
        .insert([{
          form_id: formId,
          event_id: form?.event_id,
          participant_name: formData.name,
          participant_email: formData.email,
          participant_phone: formData.phone || null,
          form_data: submissionData,
          confirmation_sent: false,
          status: 'confirmed'
        }]);

      if (insertError) {
        throw insertError;
      }

      // Send confirmation email
      if (event) {
        try {
          const emailResult = await sendEventRegistrationConfirmation(
            formData.email,
            formData.name,
            event.title,
            new Date(event.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            event.time,
            event.location
          );

          if (emailResult.success) {
            console.log('Confirmation email sent successfully');
          } else {
            console.warn('Failed to send confirmation email:', emailResult.message);
          }
        } catch (emailError) {
          console.warn('Email sending error:', emailError);
          // Don't fail the registration if email fails
        }
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/events');
      }, 5000);
    } catch (err) {
      console.error('Registration error:', err);
      setError('Failed to submit registration. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const commonClasses = "w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm transition-all";

    switch (field.field_type) {
      case 'photo':
        return (
          <div>
            {!photoPreviews[field.field_name] ? (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handlePhotoChange(field.field_name, e)}
                  required={field.is_required}
                />
              </label>
            ) : (
              <div className="relative">
                <img
                  src={photoPreviews[field.field_name]}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(field.field_name)}
                  className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        );

      case 'textarea':
        return (
          <textarea
            value={formData[field.field_name] || ''}
            onChange={(e) => setFormData({ ...formData, [field.field_name]: e.target.value })}
            className={commonClasses}
            rows={4}
            required={field.is_required}
            placeholder={`Enter ${field.field_label.toLowerCase()}`}
          />
        );

      case 'select':
        return (
          <select
            value={formData[field.field_name] || ''}
            onChange={(e) => setFormData({ ...formData, [field.field_name]: e.target.value })}
            className={commonClasses}
            required={field.is_required}
          >
            <option value="">Select an option</option>
            {field.field_options?.map((option, i) => (
              <option key={i} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.field_options?.map((option, i) => (
              <label key={i} className="flex items-center gap-2 text-gray-900 cursor-pointer hover:text-blue-600 transition-colors">
                <input
                  type="checkbox"
                  value={option}
                  checked={(formData[field.field_name] || []).includes(option)}
                  onChange={(e) => {
                    const current = formData[field.field_name] || [];
                    const updated = e.target.checked
                      ? [...current, option]
                      : current.filter((v: string) => v !== option);
                    setFormData({ ...formData, [field.field_name]: updated });
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                {option}
              </label>
            ))}
          </div>
        );

      default:
        return (
          <input
            type={field.field_type}
            value={formData[field.field_name] || ''}
            onChange={(e) => setFormData({ ...formData, [field.field_name]: e.target.value })}
            className={commonClasses}
            required={field.is_required}
            placeholder={`Enter ${field.field_label.toLowerCase()}`}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-gray-900 text-xl">Loading registration form...</div>
      </div>
    );
  }

  if (error && !form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-20">
        <div className="backdrop-blur-xl bg-white/95 border border-red-200 rounded-2xl p-8 max-w-md text-center shadow-lg">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Unavailable</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => navigate('/events')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all font-semibold"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-20">
        <div className="backdrop-blur-xl bg-white/95 border border-green-200 rounded-2xl p-8 max-w-md text-center shadow-lg">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You for Your Interest!</h2>
          <p className="text-gray-700 mb-4">
            Thank you for showing interest in this event. We will shortly get back to you with more details.
          </p>
          <p className="text-gray-600 text-sm mb-2">
            A confirmation email has been sent to <strong className="text-gray-900">{formData.email}</strong>
          </p>
          <p className="text-gray-600 text-sm mb-6">
            Please check your inbox (and spam folder) for event details.
          </p>
          <button
            onClick={() => navigate('/events')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all font-semibold"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Event Header */}
        {event && (
          <div className="backdrop-blur-xl bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 shadow-lg">
            <h1 className="text-3xl font-bold text-white mb-4">{event.title}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              {event.time && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{event.time}</span>
                </div>
              )}
              {event.location && (
                <div className="flex items-center gap-2 md:col-span-2">
                  <MapPin className="w-5 h-5" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Registration Form */}
        <div className="backdrop-blur-xl bg-white/95 rounded-2xl p-8 border border-gray-200 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{form?.form_title}</h2>
          {form?.form_description && (
            <p className="text-gray-600 mb-6">{form.form_description}</p>
          )}

          {error && (
            <div className="bg-red-50 border border-red-300 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm transition-all"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm transition-all"
                placeholder="your.email@example.com"
                required
              />
              {form?.allowed_email_domains && form.allowed_email_domains.length > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  Only emails from: <span className="font-semibold">{form.allowed_email_domains.join(', ')}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm transition-all"
                placeholder="+91 XXXXXXXXXX"
              />
            </div>

            {/* Custom Fields */}
            {fields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {field.field_label}
                  {field.is_required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderField(field)}
              </div>
            ))}

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              {submitting ? 'Submitting...' : 'Register for Event'}
            </button>
          </form>

          <p className="text-gray-600 text-sm text-center mt-6">
            By registering, you agree to receive event-related communications from SAKEC ACM.
          </p>
        </div>
      </div>
    </div>
  );
}
