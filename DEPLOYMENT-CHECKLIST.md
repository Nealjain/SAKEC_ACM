# Email System Deployment Checklist

## Pre-Deployment Verification ✅

- [x] Newsletter component created
- [x] API endpoint created
- [x] Database schema created
- [x] Home page updated
- [x] Event registration message updated
- [x] No TypeScript errors
- [x] Email deliverability configured (SPF, DKIM, DMARC, PTR)

---

## Deployment Steps

### 1. Database Setup
- [ ] Open Supabase Dashboard
- [ ] Go to SQL Editor
- [ ] Copy contents of `supabase/create-newsletter-subscribers-table.sql`
- [ ] Run the SQL
- [ ] Verify table created: Check "Table Editor" → "newsletter_subscribers"

### 2. API Deployment
- [ ] Upload `api/newsletter-subscribe.php` to server
- [ ] Verify file permissions (644 or 755)
- [ ] Test endpoint: `curl https://sakec.acm.org/api/newsletter-subscribe.php`

### 3. Frontend Deployment
- [ ] Run `npm run build` in "acm main" directory
- [ ] Upload `dist/` folder to hosting
- [ ] Clear CDN cache if applicable
- [ ] Verify deployment: Visit https://sakec.acm.org

---

## Testing Checklist

### Newsletter Subscription Test
- [ ] Visit homepage
- [ ] Scroll to newsletter section (bottom)
- [ ] Enter test email
- [ ] Click "Subscribe"
- [ ] Verify success message appears
- [ ] Check email inbox for welcome message
- [ ] Verify email has proper formatting
- [ ] Check Supabase: Subscriber added to database

### Event Registration Test
- [ ] Visit events page
- [ ] Click "Register" on any event
- [ ] Fill out registration form
- [ ] Submit form
- [ ] Verify success message: "Thank you for showing interest..."
- [ ] Check email inbox for confirmation
- [ ] Verify email has event details

### Error Handling Test
- [ ] Try subscribing with invalid email
- [ ] Try subscribing with same email twice
- [ ] Verify appropriate error messages

---

## Post-Deployment Verification

### Database
- [ ] Check `newsletter_subscribers` table exists
- [ ] Verify RLS policies are active
- [ ] Test inserting a record manually

### API
- [ ] Check API logs for errors
- [ ] Verify email sending works
- [ ] Check response times

### Frontend
- [ ] Newsletter form visible on homepage
- [ ] Form is responsive on mobile
- [ ] Success/error messages display correctly
- [ ] Loading states work properly

### Email Deliverability
- [ ] Test email arrives in inbox (not spam)
- [ ] Check email formatting on different clients:
  - [ ] Gmail
  - [ ] Outlook
  - [ ] Apple Mail
  - [ ] Mobile devices

---

## Rollback Plan (If Needed)

### If Newsletter Has Issues:
1. Remove newsletter section from Home.tsx
2. Redeploy frontend
3. Keep API and database for future use

### If Event Registration Has Issues:
1. Revert EventRegistration.tsx to previous version
2. Redeploy frontend

---

## Monitoring

### What to Monitor:
- [ ] Newsletter subscription rate
- [ ] Email delivery success rate
- [ ] Database growth
- [ ] API error logs
- [ ] User feedback

### Where to Check:
- Supabase Dashboard → Table Editor → newsletter_subscribers
- Server logs: `/var/log/apache2/error.log`
- Email logs: Check with hosting provider
- Browser console: For frontend errors

---

## Success Criteria

✅ Newsletter form visible on homepage
✅ Users can subscribe successfully
✅ Welcome emails delivered within 1 minute
✅ Event registration emails working
✅ Success messages display correctly
✅ No console errors
✅ Mobile responsive
✅ Emails not going to spam

---

## Support Contacts

**Technical Issues:**
- Check documentation files in project root
- Review server logs
- Check Supabase logs

**Email Deliverability:**
- Verify DNS records in cPanel
- Check email server status
- Review bounce rates

---

## Next Steps After Deployment

1. **Monitor for 24 hours**
   - Check for any errors
   - Verify emails are being delivered
   - Monitor database for new subscribers

2. **Gather Feedback**
   - Ask team to test
   - Check user experience
   - Note any issues

3. **Future Enhancements**
   - Create unsubscribe page
   - Add admin dashboard for subscribers
   - Implement email analytics
   - Create newsletter composer

---

## Quick Reference

**Newsletter API:** `https://sakec.acm.org/api/newsletter-subscribe.php`
**Database Table:** `newsletter_subscribers`
**Component:** `src/components/NewsletterSubscribe.tsx`
**Location:** Homepage bottom section

---

## Deployment Date: _____________

**Deployed By:** _____________

**Status:** ⬜ Pending | ⬜ In Progress | ⬜ Completed | ⬜ Issues

**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________

---

**Ready to deploy! 🚀**
