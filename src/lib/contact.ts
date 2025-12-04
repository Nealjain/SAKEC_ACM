import { supabase } from './supabase'
import { sendContactFormNotification, sendContactFormThankYou } from './email'

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export async function submitContactForm(data: ContactFormData): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('Attempting to save contact message:', data);
    
    // Save to Supabase database
    const { data: insertedData, error: dbError } = await supabase
      .from('contact_messages')
      .insert([{
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      }])
      .select();

    if (dbError) {
      console.error('Database error:', dbError);
      return { success: false, error: `Database error: ${dbError.message}` };
    }

    console.log('Message saved successfully:', insertedData);

    // Send email notifications (don't block on failure)
    try {
      // Send notification to admin
      const adminEmailResult = await sendContactFormNotification(
        data.name,
        data.email,
        data.subject,
        data.message
      );

      if (adminEmailResult.success) {
        console.log('Admin notification sent successfully');
      } else {
        console.warn('Failed to send admin notification:', adminEmailResult.message);
      }

      // Send thank you email to user
      const userEmailResult = await sendContactFormThankYou(
        data.name,
        data.email,
        data.subject,
        data.message
      );

      if (userEmailResult.success) {
        console.log('Thank you email sent successfully');
      } else {
        console.warn('Failed to send thank you email:', userEmailResult.message);
      }
    } catch (emailError) {
      console.warn('Email notification failed, but message was saved:', emailError)
    }

    return { success: true }
  } catch (error) {
    console.error('Error submitting contact form:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
