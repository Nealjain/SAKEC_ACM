# URGENT FIX INSTRUCTIONS

## Issues Found

1. **406 Not Acceptable Errors** - Event registration forms table missing RLS policies
2. **500 Internal Server Error** - Email sending failing (likely due to sent_emails RLS)

## Solution

Run this single SQL file in your Supabase SQL Editor:

```
acm main/supabase/FIX-ALL-RLS-COMPLETE.sql
```

## What This Fixes

### Tables with Missing/Incorrect RLS Policies:
- ✅ `event_registration_forms` - Now allows public read access
- ✅ `event_form_fields` - Now allows public read access
- ✅ `event_registrations` - Now allows public insert
- ✅ `sent_emails` - Now allows authenticated insert/read
- ✅ All other tables - Proper RLS policies applied

### Access Patterns:
- **Public (anon)**: Can read most tables, insert to contact_messages, event_registrations, newsletter_subscribers
- **Authenticated (admins)**: Full access to all tables

## Steps to Apply

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy the entire contents of `FIX-ALL-RLS-COMPLETE.sql`
4. Paste and run it
5. Check the verification queries at the end to confirm policies are applied

## Expected Results

After running the SQL:
- ❌ No more 406 errors when loading events page
- ❌ No more 500 errors when sending emails
- ✅ Event registration forms load properly
- ✅ Email system saves to database
- ✅ All public pages work without authentication
- ✅ Admin panel has full access when logged in

## Verification

The SQL file includes verification queries that will show:
1. All policies created for each table
2. All permissions granted to anon and authenticated roles

Look for output showing policies like:
- "Public can read registration forms"
- "Authenticated users can insert sent emails"
- etc.

## If Issues Persist

1. Check browser console for specific error messages
2. Check Supabase logs for RLS policy violations
3. Verify you're using the correct Supabase URL and anon key in `.env`
