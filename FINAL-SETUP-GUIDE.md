# Final Setup Guide - Email & Database

## 🎯 What This Fixes

1. **Contact Form** - Now saves to Supabase `contact_messages` table
2. **Admin Email Composer** - Now saves to Supabase `sent_emails` table
3. **Both send emails via PHP mail()**

---

## 📋 Step-by-Step Setup

### Step 1: Run SQL in Supabase (REQUIRED)

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/dhxzkzdlsszwuqjkicnv
2. Click **SQL Editor** in left sidebar
3. Click **New Query**
4. Copy and paste the entire content from: `supabase/COMPLETE-DATABASE-UPDATE.sql`
5. Click **Run** (or press Ctrl+Enter)
6. You should see: "Success. No rows returned"

**What this does:**
- Creates `sent_emails` table for admin emails
- Fixes RLS policies on `contact_messages` table
- Grants proper permissions
- Creates indexes for performance

---

### Step 2: Build & Deploy

```bash
cd "acm main"
npm run build
```

Upload to cPanel:
- Upload `dist/` folder contents to `public_html/`
- Upload `api/` folder to `public_html/api/`

---

### Step 3: Test Contact Form

1. Go to your website: `https://sakec-acm.com/contact`
2. Fill in the form
3. Submit
4. Check:
   - ✅ Email received
   - ✅ Message in Supabase → Table Editor → `contact_messages`

---

### Step 4: Test Admin Email

1. Login to Admin Dashboard
2. Go to Email Composer
3. Send a test email
4. Check:
   - ✅ Email received
   - ✅ Record in Supabase → Table Editor → `sent_emails`

---

## 🔍 Troubleshooting

### Contact Form Not Saving

**Check Browser Console (F12):**
```
Error: Failed to save message to database
```

**Solution:**
- Run the SQL script again
- Make sure you're using the anon key (not service key)
- Check Supabase logs

---

### Admin Email Not Saving

**Check Browser Console:**
```
Supabase save error: ...
```

**Solution:**
- Run the SQL script to create `sent_emails` table
- Make sure admin is authenticated
- Check Supabase logs

---

### Emails Not Sending

**Use the diagnostic tool:**
Visit: `https://sakec-acm.com/api/test-email-system.php`

**Common fixes:**
1. Contact hosting provider to enable PHP mail()
2. Create email account in cPanel
3. Configure DNS records (SPF, DKIM)

---

## 📊 Database Structure

### contact_messages table
```sql
- id (uuid)
- name (text)
- email (text)
- subject (text)
- message (text)
- created_at (timestamp)
- is_read (boolean)
```

### sent_emails table (NEW)
```sql
- id (uuid)
- recipient_email (text)
- sender_email (text)
- sender_name (text)
- subject (text)
- message (text)
- sent_at (timestamp)
- sent_by (text)
- status (text)
- error_message (text)
```

---

## ✅ Verification Checklist

After running SQL script:

- [ ] `sent_emails` table exists in Supabase
- [ ] `contact_messages` has RLS enabled
- [ ] Can insert into `contact_messages` without auth
- [ ] Can insert into `sent_emails` with auth
- [ ] Contact form saves to database
- [ ] Contact form sends email
- [ ] Admin email saves to database
- [ ] Admin email sends email

---

## 🎉 Summary

**What Changed:**

1. **Created `sent_emails` table** - Stores all emails sent from admin
2. **Fixed `contact_messages` RLS** - Now allows public inserts
3. **Updated `admin-send-email.php`** - Saves to Supabase before sending
4. **Contact form already working** - Just needed RLS fix

**Flow:**

**Contact Form:**
```
User submits → Save to Supabase → Send email → Success
```

**Admin Email:**
```
Admin sends → Send email → Save to Supabase → Success
```

---

## 📞 Need Help?

If something doesn't work:

1. Check browser console (F12)
2. Check Supabase logs (Dashboard → Logs)
3. Run diagnostic: `api/test-email-system.php`
4. Verify SQL script ran successfully

**Most common issue:** Forgot to run SQL script!
