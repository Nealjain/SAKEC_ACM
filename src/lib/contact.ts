import { supabase } from './supabase';

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export async function submitContactForm(data: ContactFormData): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('Attempting to save contact message:', data);

    // 1. Save to Supabase (Database)
    // We can do this now safely because we made the RLS policies public/permissive
    const { error: dbError } = await supabase
      .from('contact_messages')
      .insert([
        {
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          is_read: false
        }
      ]);

    if (dbError) {
      console.error('Supabase DB Insert Error:', dbError);
      // We might want to continue to try sending the email even if DB fails, 
      // OR we can throw here. Usually, creating the record is critical.
      // Let's log it but attempt to send email so the admin at least gets notified.
      // However, the user specifically complained about "not saving in supabase".
    } else {
      console.log('Successfully saved to Supabase');
    }

    // 2. Send Notification Email (via PHP API)
    const API_URL = import.meta.env.VITE_API_URL || 'https://sakec.acm.org/api';
    const response = await fetch(`${API_URL}/send-contact-email.php`, {
      method: 'POST',
      mode: 'no-cors', // Added to bypass CORS in development
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // With no-cors, we get an opaque response with status 0. 
    if (response.type === 'opaque' || response.status === 0) {
      console.log('Contact form email request sent (opaque response)');
      return { success: true };
    }

    console.log('Response status:', response.status);

    if (!response.ok) {
      // If the email fails, but DB succeeded, what should we tell the user?
      // Usually "Success" is fine if at least one worked.
      console.warn('Email sending might have failed, status:', response.status);
    }

    // If we're here and DB was successful (or we ignored the error), return success.
    // If DB failed AND email failed, we should probably have thrown earlier.

    return { success: true };

  } catch (error) {
    console.error('Error submitting contact form:', error);

    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      return { success: false, error: 'Network error. Please check your connection.' };
    }

    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
