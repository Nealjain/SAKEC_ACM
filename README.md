# SAKEC ACM Student Chapter Website

Modern, responsive website for SAKEC ACM Student Chapter with admin dashboard, event management, and email system.

## 🚀 Features

- **Contact Form** - Saves to Supabase + sends emails
- **Event Management** - Create events with custom registration forms
- **Email System** - Send emails with custom sender
- **Gallery** - Optimized 4x4 grid with lazy loading
- **Blog System** - Manage and publish blog posts
- **Team Management** - Showcase team members
- **Admin Dashboard** - Complete admin control panel

## 📋 Prerequisites

- Node.js 16+ and npm
- Supabase account
- cPanel hosting with PHP 7.4+
- Email account in cPanel

## 🔧 Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env` file:
```env
VITE_SUPABASE_URL=https://dhxzkzdlsszwuqjkicnv.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_API_URL=https://sakec-acm.com/api
VITE_SUPPORT_EMAIL=support@sakec.acm.org
```

### 3. Setup Supabase
Run SQL script in Supabase dashboard:
```sql
-- Enable RLS for contact messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public to insert contact messages"
ON public.contact_messages FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow admins to read contact messages"
ON public.contact_messages FOR SELECT TO authenticated
USING (true);
```

### 4. Configure cPanel Email
1. Create email account: `support@sakec.acm.org`
2. Update `api/config.php` with your domain
3. Test email sending

### 5. Build for Production
```bash
npm run build
```

### 6. Deploy to cPanel
1. Upload `dist/` folder contents to public_html
2. Upload `api/` folder to public_html/api
3. Ensure `.htaccess` is in place
4. Test all functionality

## 📁 Project Structure

```
acm main/
├── api/                    # Backend PHP APIs
│   ├── config.php         # Configuration (Supabase + Email)
│   ├── admin-auth.php     # Admin authentication
│   ├── admin-send-email.php # Email composer
│   ├── send-email.php     # Contact form emails
│   └── event-registration.php # Event registrations
├── src/
│   ├── components/
│   │   └── admin/         # Admin dashboard components
│   ├── pages/             # All pages
│   ├── lib/               # Utilities and Supabase client
│   └── main.tsx           # App entry point
├── public/                # Static assets
├── supabase/              # SQL scripts
└── dist/                  # Build output (generated)
```

## 🔐 Security

- Admin authentication with rate limiting
- Password hashing with bcrypt
- CORS configured
- Input validation and sanitization
- SQL injection protection via Supabase
- XSS protection

## 📧 Email System

### Contact Form
- Saves to Supabase database
- Sends confirmation to user
- Notifies admin
- Handles failures gracefully

### Admin Email Composer
- Custom sender email/name
- HTML email templates
- Quick templates
- Validation and error handling

### Event Registration
- Automatic confirmation emails
- Custom form data display
- Professional email design

## 🎯 Admin Features

### Dashboard Sections
1. **Events** - Create/edit events, build registration forms
2. **Team** - Manage team members
3. **Blog** - Create and publish blog posts
4. **Gallery** - Upload event photos
5. **Messages** - View contact form submissions
6. **Email** - Send emails to users
7. **Faculty** - Manage faculty members
8. **Alumni** - Manage alumni members

### Event Registration Forms
- Drag-and-drop form builder
- 7 field types (text, email, phone, photo, etc.)
- Email domain restrictions
- Registration limits
- Analytics and CSV export

## 🐛 Troubleshooting

### Contact Form Not Saving
- Run RLS SQL script in Supabase
- Check browser console for errors
- Verify Supabase credentials in `.env`

### Emails Not Sending
- Check cPanel email account exists
- Verify PHP mail() is enabled
- Check spam folder
- Review server mail logs

### Admin Login Issues
- Clear browser cache and cookies
- Check Supabase admin table
- Verify credentials

### Gallery Loading Slow
- Images are lazy loaded
- Check image sizes (optimize if needed)
- Verify CDN/hosting speed

## 📊 Performance

- Lazy loading for images
- Code splitting
- Optimized bundle size
- Mobile-first responsive design
- Touch-optimized for mobile

## 🔄 Git Workflow

### Initial Upload
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/repo.git
git push -u origin main
```

### Regular Updates
```bash
git add .
git commit -m "Description of changes"
git push
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| VITE_SUPABASE_URL | Supabase project URL | Yes |
| VITE_SUPABASE_ANON_KEY | Supabase anon key | Yes |
| VITE_API_URL | Backend API URL | Yes |
| VITE_SUPPORT_EMAIL | Support email | Yes |

## 🚨 Important Notes

- Never commit `.env` file
- Keep Supabase keys secure
- Test thoroughly before production
- Backup database regularly
- Monitor email deliverability

## 📞 Support

For issues or questions:
1. Check documentation in `/docs`
2. Review `QUICK-REFERENCE.md`
3. Check browser console for errors
4. Review server logs

## 📄 License

© 2024 SAKEC ACM Student Chapter. All rights reserved.

## ✅ Deployment Checklist

- [ ] Install dependencies
- [ ] Configure `.env` file
- [ ] Run Supabase SQL scripts
- [ ] Create cPanel email account
- [ ] Build project (`npm run build`)
- [ ] Upload to cPanel
- [ ] Test contact form
- [ ] Test admin login
- [ ] Test email sending
- [ ] Test event registration
- [ ] Verify mobile responsiveness
- [ ] Check all admin functions
- [ ] Monitor for errors

## 🎉 Ready to Deploy!

All systems are configured and ready. Follow the setup steps above and deploy with confidence.
