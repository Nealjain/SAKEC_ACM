import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Save, Eye, BarChart3, X, Download } from 'lucide-react';

interface FormField {
  id?: string;
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
  fields?: FormField[];
}

interface EventFormBuilderProps {
  eventId: string;
  eventTitle: string;
  onClose: () => void;
}

export default function EventFormBuilder({ eventId, eventTitle, onClose }: EventFormBuilderProps) {
  const [form, setForm] = useState<Partial<RegistrationForm>>({
    event_id: eventId,
    form_title: `${eventTitle} Registration`,
    is_active: true,
    allowed_email_domains: [],
    fields: []
  });
  const [fields, setFields] = useState<FormField[]>([]);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [registrations, setRegistrations] = useState<any[]>([]);

  useEffect(() => {
    loadExistingForm();
  }, [eventId]);

  const loadExistingForm = async () => {
    const { data: formData } = await supabase
      .from('event_registration_forms')
      .select('*')
      .eq('event_id', eventId)
      .single();

    if (formData) {
      // Convert registration_deadline to datetime-local format if it exists
      if (formData.registration_deadline) {
        const date = new Date(formData.registration_deadline);
        // Format: YYYY-MM-DDTHH:MM
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        formData.registration_deadline = `${year}-${month}-${day}T${hours}:${minutes}`;
      }

      setForm(formData);

      const { data: fieldsData } = await supabase
        .from('event_form_fields')
        .select('*')
        .eq('form_id', formData.id)
        .order('display_order');

      if (fieldsData) {
        setFields(fieldsData);
      }
    }
  };

  const addField = () => {
    setFields([...fields, {
      field_name: `field_${fields.length + 1}`,
      field_label: 'New Field',
      field_type: 'text',
      is_required: false,
      display_order: fields.length
    }]);
  };

  const updateField = (index: number, updates: Partial<FormField>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    setFields(newFields);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let formId = form.id;

      // Convert datetime-local to ISO timestamp if provided
      const deadlineValue = form.registration_deadline
        ? new Date(form.registration_deadline).toISOString()
        : null;

      if (formId) {
        // Update existing form
        await supabase
          .from('event_registration_forms')
          .update({
            form_title: form.form_title,
            form_description: form.form_description,
            is_active: form.is_active,
            max_registrations: form.max_registrations,
            registration_deadline: deadlineValue,
            allowed_email_domains: form.allowed_email_domains || []
          })
          .eq('id', formId);

        // Delete old fields
        await supabase
          .from('event_form_fields')
          .delete()
          .eq('form_id', formId);
      } else {
        // Create new form
        const { data: newForm } = await supabase
          .from('event_registration_forms')
          .insert([{
            event_id: eventId,
            form_title: form.form_title,
            form_description: form.form_description,
            is_active: form.is_active,
            max_registrations: form.max_registrations,
            registration_deadline: deadlineValue,
            allowed_email_domains: form.allowed_email_domains || []
          }])
          .select()
          .single();

        formId = newForm?.id;
      }

      // Insert fields
      if (formId && fields.length > 0) {
        await supabase
          .from('event_form_fields')
          .insert(fields.map(field => ({
            form_id: formId,
            ...field
          })));
      }

      alert('Form saved successfully!');
      loadExistingForm();
    } catch (err) {
      alert('Failed to save form');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const loadAnalytics = async () => {
    if (!form.id) return;

    const { data } = await supabase
      .from('event_registrations')
      .select('*')
      .eq('form_id', form.id)
      .order('registration_date', { ascending: false });

    if (data) {
      setRegistrations(data);
    }
    setShowAnalytics(true);
  };

  const downloadCSV = () => {
    if (registrations.length === 0) {
      alert('No registrations to download');
      return;
    }

    // Identify photo fields from the form definition
    const photoFieldNames = fields
      .filter(f => f.field_type === 'photo')
      .map(f => f.field_name);

    // Get all unique field names from form_data
    const allFields = new Set<string>();
    const photoFields = new Set<string>();

    registrations.forEach(reg => {
      const formData = typeof reg.form_data === 'string'
        ? JSON.parse(reg.form_data)
        : reg.form_data || {};

      Object.keys(formData).forEach(key => {
        allFields.add(key);
        // Mark as photo field if it's in the definition or looks like a photo URL
        if (photoFieldNames.includes(key) ||
          (typeof formData[key] === 'string' &&
            formData[key].startsWith('http') &&
            (formData[key].match(/\.(jpeg|jpg|gif|png|webp)$/i) || formData[key].includes('supabase.co/storage')))) {
          photoFields.add(key);
        }
      });
    });

    // Separate photo fields from regular fields
    const regularFields = Array.from(allFields).filter(f => !photoFields.has(f));
    const photoFieldsArray = Array.from(photoFields);

    // Create CSV headers
    const headers = [
      'Name',
      'Email',
      'Phone',
      'Registration Date',
      'Status',
      'Email Sent',
      ...regularFields,
      ...photoFieldsArray.map(f => {
        const fieldDef = fields.find(field => field.field_name === f);
        return fieldDef ? fieldDef.field_label : f;
      })
    ];

    // Create CSV rows
    const rows = registrations.map(reg => {
      const formData = typeof reg.form_data === 'string'
        ? JSON.parse(reg.form_data)
        : reg.form_data || {};

      const row = [
        reg.participant_name,
        reg.participant_email,
        reg.participant_phone || '',
        new Date(reg.registration_date).toLocaleString(),
        reg.status,
        reg.confirmation_sent ? 'Yes' : 'No'
      ];

      // Add regular field values
      regularFields.forEach(field => {
        const value = formData[field];
        if (Array.isArray(value)) {
          row.push(value.join('; '));
        } else if (typeof value === 'object') {
          row.push(JSON.stringify(value));
        } else {
          row.push(value || '');
        }
      });

      // Add photo URLs as separate columns
      photoFieldsArray.forEach(field => {
        const value = formData[field];
        row.push(value || '');
      });

      return row;
    });

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `registrations_${form.form_title}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'textarea', label: 'Long Text' },
    { value: 'select', label: 'Dropdown' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'photo', label: 'Photo Upload' }
  ];

  const handleDeleteRegistration = async (id: string) => {
    if (!confirm('Are you sure you want to delete this registration? This action cannot be undone.')) return;

    try {
      const { error } = await supabase
        .from('event_registrations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setRegistrations(registrations.filter(r => r.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete registration');
    }
  };

  if (showAnalytics) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
            <h2 className="text-2xl font-bold text-gray-900">Registration Analytics</h2>
            <div className="flex gap-2">
              <button
                onClick={downloadCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Download CSV
              </button>
              <button onClick={() => setShowAnalytics(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-500 text-sm">Total Registrations</p>
                <p className="text-3xl font-bold text-gray-900">{registrations.length}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-500 text-sm">Confirmed</p>
                <p className="text-3xl font-bold text-green-600">
                  {registrations.filter(r => r.status === 'confirmed').length}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-500 text-sm">Confirmation Emails Sent</p>
                <p className="text-3xl font-bold text-blue-600">
                  {registrations.filter(r => r.confirmation_sent).length}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Participants</h3>
              {registrations.map((reg) => {
                // Parse form data if needed
                const formData = typeof reg.form_data === 'string'
                  ? JSON.parse(reg.form_data)
                  : reg.form_data || {};

                // Identify photo fields from the form definition
                const photoFieldNames = fields
                  .filter(f => f.field_type === 'photo')
                  .map(f => f.field_name);

                // Find the first available photo URL
                let displayPhoto = formData.photo_url || formData.photo;

                // If not found by standard names, check dynamic fields
                if (!displayPhoto) {
                  // First check known photo fields
                  for (const fieldName of photoFieldNames) {
                    if (formData[fieldName]) {
                      displayPhoto = formData[fieldName];
                      break;
                    }
                  }
                }

                // Fallback: Check for any field that looks like an image URL
                if (!displayPhoto) {
                  for (const [, value] of Object.entries(formData)) {
                    if (typeof value === 'string' &&
                      value.startsWith('http') &&
                      (value.match(/\.(jpeg|jpg|gif|png|webp)$/i) || value.includes('supabase.co/storage'))) {
                      displayPhoto = value;
                      break;
                    }
                  }
                }

                // Create a clean object for "Additional Details" by excluding standard fields and photo fields
                const {
                  photo_url, photo, // Standard photo keys
                  name, email, phone, // Standard contact keys
                  participant_name, participant_email, participant_phone, // Registration table keys
                  ...rest
                } = formData;

                // Filter out the dynamic photo fields from the rest object
                const otherData: Record<string, any> = {};
                Object.entries(rest).forEach(([key, value]) => {
                  // Exclude if it's a known photo field OR if it was used as the display photo
                  if (!photoFieldNames.includes(key) && value !== displayPhoto) {
                    otherData[key] = value;
                  }
                });

                return (
                  <div key={reg.id} className="bg-white p-4 rounded-lg group/item relative border border-gray-200 shadow-sm">
                    <button
                      onClick={() => handleDeleteRegistration(reg.id)}
                      className="absolute top-4 right-4 p-2 bg-red-100 text-red-600 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity hover:bg-red-200"
                      title="Delete Registration"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex justify-between items-start mb-2 pr-12">
                      <div className="flex gap-4">
                        {/* Display Photo if available */}
                        {displayPhoto && (
                          <div className="shrink-0 group relative">
                            <img
                              src={displayPhoto}
                              alt="Participant"
                              className="w-20 h-20 rounded-lg object-cover border border-gray-300 cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => window.open(displayPhoto, '_blank')}
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                              <Eye className="w-6 h-6 text-white drop-shadow-lg" />
                            </div>
                          </div>
                        )}
                        <div>
                          <h4 className="text-gray-900 font-bold text-lg">{reg.participant_name}</h4>
                          <div className="space-y-1 mt-1">
                            <p className="text-gray-700 text-sm flex items-center gap-2 font-medium">
                              <span className="w-4 h-4 flex items-center justify-center opacity-70">📧</span>
                              {reg.participant_email}
                            </p>
                            {reg.participant_phone && (
                              <p className="text-gray-700 text-sm flex items-center gap-2 font-medium">
                                <span className="w-4 h-4 flex items-center justify-center opacity-70">📱</span>
                                {reg.participant_phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${reg.confirmation_sent ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          }`}>
                          {reg.confirmation_sent ? 'Email Sent' : 'Pending'}
                        </span>
                        <p className="text-gray-500 text-xs mt-2 font-medium">
                          Registered: {new Date(reg.registration_date).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Display other form data cleanly */}
                    {Object.keys(otherData).length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-gray-900 text-xs font-bold uppercase tracking-wider mb-3">Additional Details</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {Object.entries(otherData).map(([key, value]) => {
                            // Skip empty values or internal fields
                            if (!value || key.startsWith('_')) return null;

                            // Find label for this field if possible
                            const fieldDef = fields.find(f => f.field_name === key);
                            const label = fieldDef ? fieldDef.field_label : key.replace(/_/g, ' ');

                            return (
                              <div key={key} className="bg-gray-50 p-3 rounded border border-gray-200">
                                <span className="block text-gray-600 text-xs uppercase tracking-wide mb-1 font-bold">
                                  {label}
                                </span>
                                <span className="block text-gray-900 text-sm font-semibold break-words">
                                  {Array.isArray(value)
                                    ? value.join(', ')
                                    : typeof value === 'object'
                                      ? JSON.stringify(value)
                                      : String(value)
                                  }
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showPreview) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
            <h2 className="text-2xl font-bold text-gray-900">Form Preview</h2>
            <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{form.form_title}</h3>
            {form.form_description && (
              <p className="text-gray-600 mb-6">{form.form_description}</p>
            )}
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.field_label}
                    {field.is_required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {field.field_type === 'textarea' ? (
                    <textarea className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" rows={4} />
                  ) : field.field_type === 'select' ? (
                    <select className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                      <option>Select an option</option>
                      {field.field_options?.map((opt, i) => (
                        <option key={i}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.field_type}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-900">Event Registration Form Builder</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Form Settings */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Form Settings</h3>
            <input
              type="text"
              placeholder="Form Title"
              value={form.form_title || ''}
              onChange={(e) => setForm({ ...form, form_title: e.target.value })}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <textarea
              placeholder="Form Description"
              value={form.form_description || ''}
              onChange={(e) => setForm({ ...form, form_description: e.target.value })}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              rows={3}
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Max Registrations (optional)"
                value={form.max_registrations || ''}
                onChange={(e) => setForm({ ...form, max_registrations: parseInt(e.target.value) || undefined })}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <input
                type="datetime-local"
                placeholder="Registration Deadline"
                value={form.registration_deadline || ''}
                onChange={(e) => setForm({ ...form, registration_deadline: e.target.value })}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <label className="flex items-center gap-2 text-gray-900">
              <input
                type="checkbox"
                checked={form.is_active || false}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              Form is Active (accepting registrations)
            </label>

            {/* Email Domain Restrictions */}
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <label className="block text-sm font-medium text-gray-900">
                Allowed Email Domains (Optional)
              </label>
              <p className="text-xs text-gray-500">
                Restrict registrations to specific email domains. Leave empty to allow all emails.
              </p>
              <input
                type="text"
                placeholder="e.g., @sakec.ac.in, @gmail.com, @outlook.com"
                value={(form.allowed_email_domains || []).join(', ')}
                onChange={(e) => {
                  const domains = e.target.value
                    .split(',')
                    .map(d => d.trim())
                    .filter(d => d.length > 0);
                  setForm({ ...form, allowed_email_domains: domains });
                }}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              {form.allowed_email_domains && form.allowed_email_domains.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.allowed_email_domains.map((domain, i) => (
                    <span key={i} className="px-2 py-1 bg-blue-600 text-white text-xs rounded flex items-center gap-1">
                      {domain}
                      <button
                        type="button"
                        onClick={() => {
                          const newDomains = form.allowed_email_domains?.filter((_, index) => index !== i);
                          setForm({ ...form, allowed_email_domains: newDomains });
                        }}
                        className="hover:text-red-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Form Fields</h3>
              <button
                onClick={addField}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add Field
              </button>
            </div>

            {fields.map((field, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg space-y-3 border border-gray-200">
                <div className="flex justify-between items-start">
                  <h4 className="text-gray-900 font-medium">Field {index + 1}</h4>
                  <button
                    onClick={() => removeField(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Field Name (e.g., college_name)"
                    value={field.field_name}
                    onChange={(e) => updateField(index, { field_name: e.target.value })}
                    className="px-3 py-2 bg-white border border-gray-300 rounded text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Field Label (shown to user)"
                    value={field.field_label}
                    onChange={(e) => updateField(index, { field_label: e.target.value })}
                    className="px-3 py-2 bg-white border border-gray-300 rounded text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <select
                    value={field.field_type}
                    onChange={(e) => updateField(index, { field_type: e.target.value })}
                    className="px-3 py-2 bg-white border border-gray-300 rounded text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    {fieldTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  <label className="flex items-center gap-2 text-gray-900 text-sm">
                    <input
                      type="checkbox"
                      checked={field.is_required}
                      onChange={(e) => updateField(index, { is_required: e.target.checked })}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    Required Field
                  </label>
                </div>
                {(field.field_type === 'select' || field.field_type === 'checkbox') && (
                  <input
                    type="text"
                    placeholder="Options (comma separated)"
                    value={field.field_options?.join(', ') || ''}
                    onChange={(e) => updateField(index, {
                      field_options: e.target.value.split(',').map(s => s.trim())
                    })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Form'}
            </button>
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            {form.id && (
              <button
                onClick={loadAnalytics}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
              >
                <BarChart3 className="w-4 h-4" />
                View Analytics
              </button>
            )}
          </div>

          {form.id && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-700 text-sm font-medium mb-2">Registration Form URL:</p>
              <code className="text-blue-600 text-sm break-all">
                {window.location.origin}/event-register/{form.id}
              </code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}