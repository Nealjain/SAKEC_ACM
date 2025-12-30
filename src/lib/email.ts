/**
 * Centralized email utility for the SAKEC ACM application
 * Handles all email sending operations through the PHP backend
 */

const API_URL = import.meta.env.VITE_API_URL || 'https://sakec.acm.org/api';

export interface EmailOptions {
  to: string;
  subject: string;
  message: string;
  fromEmail?: string;
  fromName?: string;
  replyTo?: string;
}

export interface EmailResponse {
  success: boolean;
  message: string;
  warning?: string;
}

/**
 * Send an email using the admin email API
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResponse> {
  try {
    const response = await fetch(`${API_URL}/send-email-clean.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: options.to,
        subject: options.subject,
        message: options.message,
        fromEmail: options.fromEmail || 'support@sakec.acm.org',
        fromName: options.fromName || 'SAKEC ACM Student Chapter',
        replyTo: options.replyTo || 'support@sakec.acm.org',
      }),
    });

    if (!response.ok) {
      // Try to get error message from response
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        // Ignore JSON parse errors
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // Backend should log to database, but if it didn't, we can log from frontend as backup
    if (data.success && data.warning) {
      console.warn('Email sent but database logging failed on backend');
      // Could add frontend Supabase logging here as backup if needed
    }
    
    return data;
  } catch (error) {
    console.error('Email send error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

/**
 * Send event registration confirmation email
 */
export async function sendEventRegistrationConfirmation(
  recipientEmail: string,
  recipientName: string,
  eventTitle: string,
  eventDate: string,
  eventTime?: string,
  eventLocation?: string
): Promise<EmailResponse> {
  const subject = `Registration Confirmed: ${eventTitle}`;
  
  let message = `Dear ${recipientName},\n\n`;
  message += `Thank you for registering for "${eventTitle}"!\n\n`;
  message += `Your registration has been confirmed. Here are the event details:\n\n`;
  message += `📅 Date: ${eventDate}\n`;
  
  if (eventTime) {
    message += `🕐 Time: ${eventTime}\n`;
  }
  
  if (eventLocation) {
    message += `📍 Location: ${eventLocation}\n`;
  }
  
  message += `\n`;
  message += `We look forward to seeing you at the event!\n\n`;
  message += `If you have any questions, please don't hesitate to contact us.\n\n`;
  message += `Best regards,\n`;
  message += `SAKEC ACM Student Chapter Team`;

  return sendEmail({
    to: recipientEmail,
    subject,
    message,
    fromEmail: 'events@sakec.acm.org',
    fromName: 'SAKEC ACM Events',
    replyTo: 'events@sakec.acm.org',
  });
}

/**
 * Send contact form notification to admin
 */
export async function sendContactFormNotification(
  name: string,
  email: string,
  subject: string,
  message: string
): Promise<EmailResponse> {
  const adminEmail = 'neal.18191@sakec.ac.in';
  const adminSubject = `New Contact Form: ${subject}`;
  
  let adminMessage = `New contact form submission received:\n\n`;
  adminMessage += `From: ${name}\n`;
  adminMessage += `Email: ${email}\n`;
  adminMessage += `Subject: ${subject}\n\n`;
  adminMessage += `Message:\n${message}\n\n`;
  adminMessage += `---\n`;
  adminMessage += `Reply directly to this email to respond to ${name}.`;

  return sendEmail({
    to: adminEmail,
    subject: adminSubject,
    message: adminMessage,
    fromEmail: 'contact@sakec.acm.org',
    fromName: 'SAKEC ACM Website',
    replyTo: email, // Allow admin to reply directly to the user
  });
}

/**
 * Send contact form thank you email to user
 */
export async function sendContactFormThankYou(
  name: string,
  email: string,
  subject: string,
  message: string
): Promise<EmailResponse> {
  const thankYouSubject = 'Thank you for contacting SAKEC ACM';
  
  let thankYouMessage = `Dear ${name},\n\n`;
  thankYouMessage += `Thank you for reaching out to the SAKEC ACM Student Chapter.\n\n`;
  thankYouMessage += `We have received your message regarding "${subject}" and our team will review it shortly.\n\n`;
  thankYouMessage += `Your Message:\n${message}\n\n`;
  thankYouMessage += `We typically respond within 24-48 hours. If your matter is urgent, please feel free to reach out to us directly.\n\n`;
  thankYouMessage += `Best regards,\n`;
  thankYouMessage += `SAKEC ACM Student Chapter Team`;

  return sendEmail({
    to: email,
    subject: thankYouSubject,
    message: thankYouMessage,
    fromEmail: 'contact@sakec.acm.org',
    fromName: 'SAKEC ACM Student Chapter',
    replyTo: 'contact@sakec.acm.org',
  });
}

/**
 * Send bulk emails (for newsletters, announcements, etc.)
 */
export async function sendBulkEmails(
  recipients: string[],
  subject: string,
  message: string,
  options?: {
    fromEmail?: string;
    fromName?: string;
    replyTo?: string;
  }
): Promise<{ sent: number; failed: number; errors: string[] }> {
  const results = {
    sent: 0,
    failed: 0,
    errors: [] as string[],
  };

  for (const recipient of recipients) {
    try {
      const result = await sendEmail({
        to: recipient,
        subject,
        message,
        ...options,
      });

      if (result.success) {
        results.sent++;
      } else {
        results.failed++;
        results.errors.push(`${recipient}: ${result.message}`);
      }

      // Add a small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      results.failed++;
      results.errors.push(`${recipient}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return results;
}
