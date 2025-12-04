import { supabase } from './supabase'

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export async function submitContactForm(data: ContactFormData): Promise<{ success: boolean; error?: string }> {
  try {
    // Save to Supabase database
    const { error: dbError } = await supabase
      .from('contact_messages')
      .insert([{
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      }])

    if (dbError) {
      console.error('Database error:', dbError)
      return { success: false, error: 'Failed to save message to database' }
    }

    // Send email notification (optional - can fail without blocking the submission)
    try {
      await fetch('/api/send-email.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
    } catch (emailError) {
      console.warn('Email notification failed, but message was saved:', emailError)
    }

    return { success: true }
  } catch (error) {
    console.error('Error submitting contact form:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
