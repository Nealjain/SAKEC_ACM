# Quick Reference Card

## 🚨 IMPORTANT: Run This First!

Before testing contact forms, run this SQL in Supabase:

```sql
-- Enable public inserts for contact messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public to insert contact messages"
ON public.contact_messages FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow admins to read contact messages"
ON public.contact_messages FOR SELECT TO authenticated
USING (true);
```

Location: `supabase/setup-contact-messages-rls.sql`

---

## 📧 Send Custom Email

**Admin Dashboard → Email Composer**

1. Fill in recipient email
2. Add subject and message
3. Click "Advanced Settings" to customize:
   - From Email: `your-email@example.com`
   - From Name: `Your Name`
   - Reply-To: `reply@example.com`
4. Click "Send Email"

---

## 🎉 Create Event with Custom Form

**Admin Dashboard → Events**

1. Click "Add Event"
2. Fill in event details
3. Select "Custom Form" radio button
4. Click "Save"
5. Click 📄 icon next to the event
6. Build your form:
   - Add fields (text, email, phone, photo, etc.)
   - Set required fields
   - Add email domain restrictions (optional)
   - Set max registrations (optional)
7. Click "Save Form"
8. Share registration URL with participants

---

## 📊 View Registrations

**Admin Dashboard → Events → 📄 Icon → View Analytics**

- See all registrations
- View participant photos
- Download CSV export
- Delete individual registrations

---

## 🔍 Test Contact Form

1. Open `test-contact-insert.html` in browser
2. Click "Test Insert"
3. Check for success message
4. Verify in Supabase dashboard

---

## ⚡ Common Tasks

### Send Welcome Email
1. Email Composer → Quick Templates
2. Click "Welcome Message"
3. Edit as needed
4. Send

### Restrict Event to SAKEC Students
1. Event Form Builder
2. Allowed Email Domains: `@sakec.ac.in`
3. Save

### Export Registrations
1. View Analytics
2. Click "Download CSV"
3. Open in Excel/Google Sheets

---

## 🐛 Quick Fixes

| Problem | Solution |
|---------|----------|
| Contact form not saving | Run RLS SQL script |
| Email JSON error | Updated - should work now |
| Can't send from custom email | Use Advanced Settings |
| Form not saving | Check all required fields |
| Photos not uploading | Run storage bucket SQL |

---

## 📱 Test URLs

- Contact Form: `/contact`
- Admin Login: `/admin-login`
- Admin Dashboard: `/admin`
- Event Registration: `/event-register/{form_id}`

---

## 🔗 Important Files

- Email API: `api/admin-send-email.php` ✅ FIXED
- Contact Logic: `src/lib/contact.ts` ✅ FIXED
- Email UI: `src/components/admin/EmailComposer.tsx` ✅ UPDATED
- Event Manager: `src/components/admin/EventManager.tsx` ✅ IMPROVED
- Full Guide: `EMAIL-AND-EVENTS-GUIDE.md`
