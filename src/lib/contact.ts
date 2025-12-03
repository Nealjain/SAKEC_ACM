interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export async function submitContactForm(data: ContactFormData): Promise<{ success: boolean; error?: string }> {
  try {
    // Call the PHP email endpoint on your cPanel server
    const response = await fetch('/api/send-email.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok || !result.success) {
      return { success: false, error: result.error || 'Failed to send email' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error submitting contact form:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
