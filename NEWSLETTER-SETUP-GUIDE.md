# Newsletter & Event Email System Setup Guide

## Overview
This guide explains the automated email system for newsletter subscriptions and event registrations.

## Features Implemented

### 1. Newsletter Subscription System
- **Location**: Newsletter subscription form appears on the home page
- **Database**: `newsletter_subscribers` table in Supabase
- **API Endpoint**: `/api/newsletter-subscribe.php`
- **Welcome Email**: Automatically sent upon subscription

#### What Happens When Someone Subscribes:
1. User enters email (and optionally name) in the newsletter form
2. System checks if email already exists
3. If new: Creates subscriber record in database
4. If existing but inactive: Reactivates subscription
5. Sends beautiful welcome email with:
   - Welcome message
   - What they'll receive (events, tech insights, opportunities)
   - Link to explore events
   - Unsubscribe link

### 2. Event Registration Confirmation
- **Location**: Event registration pages
- **API Endpoint**: `/api/event-registration.php`
- **Confirmation Email**: Automatically sent after registration

#### What Happens When Someone Registers for an Event:
1. User fills out event registration form
2. System validates and saves registration
3. Sends confirmation email with:
   - Event title, date, time, location
   - Registration details
   - Important reminders
4. Shows success message: "Thank you for showing interest in this event. We will shortly get back to you."

## Setup Instructions

### Step 1: Create Newsletter Database Table
Run this SQL in your Supabase SQL Editor:

```sql
-- File: supabase/create-newsletter-subscribers-table.sql
```

### Step 2: Deploy API Files
Upload these files to your server:
- `api/newsletter-subscribe.php` - Handles newsletter subscriptions

### Step 3: Test the System

#### Test Newsletter Subscription:
1. Go to your homepage
2. Scroll to the newsletter section
3. Enter an email address
4. Click "Subscribe"
5. Check the email inbox for welcome message

#### Test Event Registration:
1. Go to Events page
2. Click "Register" on any event
3. Fill out the form
4. Submit
5. Check email for confirmation

## Email Templates

### Newsletter Welcome Email
- **From**: SAKEC ACM Newsletter <newsletter@sakec.acm.org>
- **Subject**: Welcome to SAKEC ACM Newsletter!
- **Content**: 
  - Personalized greeting
  - Welcome message
  - Benefits of subscription
  - Call-to-action to explore events
  - Unsubscribe link

### Event Registration Confirmation
- **From**: SAKEC ACM Events <events@sakec.acm.org>
- **Subject**: Registration Confirmed: [Event Title]
- **Content**:
  - Personalized greeting
  - Event details (date, time, location)
  - Registration information
  - Important reminders
  - Contact information

## Database Schema

### newsletter_subscribers Table
```sql
- id: UUID (primary key)
- email: VARCHAR(255) (unique, required)
- name: VARCHAR(255) (optional)
- subscribed_at: TIMESTAMP
- is_active: BOOLEAN (default: true)
- unsubscribe_token: VARCHAR(255) (unique)
- created_at: TIMESTAMP
```

## Admin Features

### View Newsletter Subscribers
Admins can view all newsletter subscribers in the admin dashboard (future feature).

### Send Newsletters
Use the Email Composer in the admin dashboard to send newsletters to all active subscribers.

## Unsubscribe Functionality
Each newsletter email includes an unsubscribe link with a unique token:
```
https://sakec.acm.org/unsubscribe?token=UNIQUE_TOKEN
```

To implement unsubscribe page (future):
1. Create `/src/pages/Unsubscribe.tsx`
2. Create `/api/newsletter-unsubscribe.php`
3. Update subscriber's `is_active` to `false`

## Email Deliverability

### DNS Records (Already Configured)
- ✅ SPF: Configured
- ✅ DKIM: Configured
- ✅ DMARC: Configured
- ✅ PTR: Configured

### Best Practices
1. Always include unsubscribe link
2. Use proper From addresses
3. Keep email content relevant
4. Monitor bounce rates
5. Clean inactive subscribers periodically

## Troubleshooting

### Newsletter Subscription Not Working
1. Check if `newsletter_subscribers` table exists in Supabase
2. Verify API endpoint is accessible
3. Check browser console for errors
4. Verify email configuration in `api/config.php`

### Welcome Email Not Received
1. Check spam folder
2. Verify email server configuration
3. Check PHP mail() function is working
4. Review server logs for errors

### Event Confirmation Email Not Received
1. Check spam folder
2. Verify event registration was successful
3. Check `confirmation_sent` field in database
4. Review API logs

## Future Enhancements

### Planned Features
1. **Unsubscribe Page**: Allow users to unsubscribe via web interface
2. **Newsletter Templates**: Pre-designed templates for different types of newsletters
3. **Subscriber Management**: Admin interface to view and manage subscribers
4. **Email Analytics**: Track open rates and click-through rates
5. **Segmentation**: Send targeted emails to specific subscriber groups
6. **Double Opt-in**: Require email confirmation before activating subscription

## Support

For issues or questions:
- Email: support@sakec.acm.org
- Check server logs: `/var/log/apache2/error.log` or `/var/log/php-fpm/error.log`
- Review Supabase logs in dashboard

## Summary

✅ Newsletter subscription with automated welcome emails
✅ Event registration with confirmation emails
✅ Beautiful HTML email templates
✅ Database integration with Supabase
✅ Proper email deliverability configuration
✅ User-friendly success messages

The system is now ready to use!
