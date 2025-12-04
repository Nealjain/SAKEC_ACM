# SAKEC ACM Email System Documentation

## ✅ Email Accounts Setup

All email accounts are properly configured on cPanel:

| Email Address | Purpose | Storage | Status |
|--------------|---------|---------|--------|
| `admin@sakec.acm.org` | General admin communications | 250 MB | ✅ Active |
| `contact@sakec.acm.org` | Contact form & general inquiries | 250 GB | ✅ Active |
| `events@sakec.acm.org` | Event notifications & registrations | 250 MB | ✅ Active |
| `publicity@sakec.acm.org` | Marketing & publicity | 250 MB | ✅ Active |
| `support@sakec.acm.org` | Support & help desk | 250 MB | ✅ Active |

## 📧 Email System Features

### 1. **Contact Form Emails** ✅ IMPLEMENTED
- **Location**: Contact page (`/contact`)
- **Functionality**:
  - Saves message to `contact_messages` table in Supabase
  - Sends thank you email to user
  - Sends notification to admin (`neal.18191@sakec.ac.in`)
- **From Address**: `contact@sakec.acm.org`
- **Files**:
  - Frontend: `src/lib/contact.ts`
  - Backend: `api/send-email.php`
  - Utility: `src/lib/email.ts`

### 2. **Event Registration Confirmation** ✅ IMPLEMENTED
- **Location**: Event registration page (`/event-register/:formId`)
- **Functionality**:
  - Automatically sends confirmation email after successful registration
  - Includes event details (title, date, time, location)
  - Personalized with participant name
- **From Address**: `events@sakec.acm.org`
- **Files**:
  - Frontend: `src/pages/EventRegistration.tsx`
  - Utility: `src/lib/email.ts` (`sendEventRegistrationConfirmation`)

### 3. **Admin Email Composer** ✅ IMPLEMENTED
- **Location**: Admin Dashboard → Email Composer
- **Functionality**:
  - Send individual emails to any recipient
  - Choose from multiple sender addresses
  - Customize sender name and reply-to address
  - Pre-built templates for common scenarios
- **Available Senders**: All 5 email addresses
- **Files**:
  - Component: `src/components/admin/EmailComposer.tsx`
  - Utility: `src/lib/email.ts`

### 4. **Bulk Email System** ✅ IMPLEMENTED
- **Location**: Admin Dashboard → Unified Email System
- **Functionality**:
  - Send emails to newsletter subscribers
  - Send emails to event participants
  - Send emails to custom recipient list
  - Email templates for newsletters, announcements, reminders
  - Track sent/failed emails
- **Available Senders**: All 5 email addresses
- **Files**:
  - Component: `src/components/admin/UnifiedEmailSystem.tsx`
  - Utility: `src/lib/email.ts` (`sendBulkEmails`)

## 🔧 Technical Implementation

### Centralized Email Utility (`src/lib/email.ts`)

All email functionality is centralized in a single utility file with the following functions:

#### `sendEmail(options: EmailOptions)`
Core function for sending individual emails.

```typescript
await sendEmail({
  to: 'recipient@example.com',
  subject: 'Your Subject',
  message: 'Your message',
  fromEmail: 'events@sakec.acm.org',
  fromName: 'SAKEC ACM Events',
  replyTo: 'events@sakec.acm.org'
});
```

#### `sendEventRegistrationConfirmation(...)`
Specialized function for event registration confirmations.

```typescript
await sendEventRegistrationConfirmation(
  'user@example.com',
  'John Doe',
  'Tech Workshop',
  'December 15, 2025',
  '10:00 AM',
  'Room 101'
);
```

#### `sendContactFormNotification(...)`
Sends notification to admin when contact form is submitted.

#### `sendContactFormThankYou(...)`
Sends thank you email to user after contact form submission.

#### `sendBulkEmails(recipients, subject, message, options)`
Sends emails to multiple recipients with rate limiting.

```typescript
const result = await sendBulkEmails(
  ['user1@example.com', 'user2@example.com'],
  'Newsletter',
  'Your message',
  {
    fromEmail: 'publicity@sakec.acm.org',
    fromName: 'SAKEC ACM Publicity'
  }
);
// Returns: { sent: 2, failed: 0, errors: [] }
```

### Backend API (`api/admin-send-email.php`)

- Handles all email sending via PHP `mail()` function
- Validates email addresses
- Formats emails as HTML with professional styling
- Logs sent emails to `sent_emails` table in Supabase
- Returns JSON responses with success/error status

### Email Flow

```
Frontend Component
    ↓
src/lib/email.ts (Utility)
    ↓
api/admin-send-email.php (Backend)
    ↓
cPanel Mail Server
    ↓
Recipient's Inbox
```

## 📊 Email Tracking

All sent emails are logged in the `sent_emails` table with:
- Recipient email
- Sender email and name
- Subject and message
- Status (sent/failed)
- Timestamp
- Error message (if failed)

View email history in Admin Dashboard → Unified Email System → History tab.

## 🎯 Usage Examples

### Send Event Registration Confirmation
```typescript
import { sendEventRegistrationConfirmation } from '@/lib/email';

await sendEventRegistrationConfirmation(
  formData.email,
  formData.name,
  event.title,
  event.date,
  event.time,
  event.location
);
```

### Send Contact Form Emails
```typescript
import { sendContactFormNotification, sendContactFormThankYou } from '@/lib/email';

// Notify admin
await sendContactFormNotification(name, email, subject, message);

// Thank user
await sendContactFormThankYou(name, email, subject, message);
```

### Send Bulk Newsletter
```typescript
import { sendBulkEmails } from '@/lib/email';

const result = await sendBulkEmails(
  subscriberEmails,
  'Monthly Newsletter',
  'Newsletter content...',
  {
    fromEmail: 'publicity@sakec.acm.org',
    fromName: 'SAKEC ACM Publicity'
  }
);

console.log(`Sent: ${result.sent}, Failed: ${result.failed}`);
```

## ✅ Testing

### Test Individual Email
1. Go to Admin Dashboard
2. Click "Email Composer"
3. Enter recipient email
4. Fill subject and message
5. Click "Send Email"

### Test Event Registration Email
1. Create an event with registration form
2. Register for the event
3. Check recipient email for confirmation

### Test Contact Form
1. Go to Contact page
2. Fill and submit form
3. Check user email for thank you message
4. Check admin email for notification

### Test Bulk Email
1. Go to Admin Dashboard
2. Click "Unified Email System"
3. Select recipient type (newsletter/event/custom)
4. Fill subject and message
5. Click "Send to All"

## 🔒 Security Features

- Email validation on both frontend and backend
- HTML escaping to prevent XSS
- Rate limiting for bulk emails (500ms delay between sends)
- Proper email headers (SPF/DKIM compatible)
- Error handling and logging
- Database logging for audit trail

## 📝 Email Templates

Pre-built templates available in Email Composer and Unified Email System:
- Event Registration Confirmation
- Newsletter
- Event Announcement
- Event Reminder
- Welcome Message

## 🚀 Deployment Checklist

- [x] All 5 email accounts created on cPanel
- [x] Email utility functions implemented
- [x] Contact form emails working
- [x] Event registration emails working
- [x] Admin email composer working
- [x] Bulk email system working
- [x] Email logging to database
- [x] Error handling implemented
- [x] Build successful

## 📞 Support

For email system issues:
- Check cPanel email account status
- Verify email addresses in code match cPanel accounts
- Check `sent_emails` table for error messages
- Review browser console for frontend errors
- Check server logs for backend errors

---

**Last Updated**: December 4, 2025
**Status**: ✅ Fully Operational
