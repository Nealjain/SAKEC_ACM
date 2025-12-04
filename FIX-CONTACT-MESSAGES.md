# Fix Contact Messages Not Saving to Supabase

## Problem
Contact form submissions were only sending emails but not saving to the Supabase `contact_messages` table.

## Root Cause
The `send-email.php` file was only handling email sending, with no database insertion logic. Additionally, Row Level Security (RLS) policies may not have been configured to allow public inserts.

## Solution Applied

### 1. Updated Frontend Code
Modified `src/lib/contact.ts` to:
- Save contact messages directly to Supabase database
- Keep email notifications as optional (won't block submission if email fails)
- Provide better error handling

### 2. Database Security Setup
Created `supabase/setup-contact-messages-rls.sql` with proper RLS policies:
- Allows public (anonymous) users to INSERT contact messages
- Allows authenticated admins to READ and UPDATE messages

## Steps to Complete the Fix

### Step 1: Run the SQL Script in Supabase
1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/dhxzkzdlsszwuqjkicnv
2. Navigate to **SQL Editor**
3. Open the file `supabase/setup-contact-messages-rls.sql`
4. Copy and paste the SQL into the editor
5. Click **Run** to execute

### Step 2: Test the Contact Form
1. Build and deploy your updated code:
   ```bash
   cd "acm main"
   npm run build
   ```
2. Visit your contact page
3. Submit a test message
4. Check Supabase dashboard → Table Editor → `contact_messages` to verify the message was saved

### Step 3: Verify in Admin Dashboard
1. Log into your admin dashboard
2. Navigate to the Messages section
3. Confirm you can see the test message

## What Changed

### Before
```typescript
// Only sent email via PHP
const response = await fetch('/api/send-email.php', ...)
```

### After
```typescript
// Saves to Supabase first, then sends email
const { error } = await supabase
  .from('contact_messages')
  .insert([{ name, email, subject, message }])
```

## Benefits
- ✅ Messages are now reliably saved to database
- ✅ Email failures won't prevent message storage
- ✅ Admins can view all messages in the dashboard
- ✅ Better error handling and logging
- ✅ No dependency on PHP/cPanel for core functionality

## Troubleshooting

### If messages still don't appear:
1. Check browser console for errors
2. Verify Supabase credentials in `.env` are correct
3. Confirm RLS policies were applied (check Supabase → Authentication → Policies)
4. Test with Supabase logs (Dashboard → Logs → API)

### If emails stop working:
- Emails are now optional and won't block submissions
- Check PHP mail configuration on cPanel
- Verify `send-email.php` is accessible at `/api/send-email.php`
