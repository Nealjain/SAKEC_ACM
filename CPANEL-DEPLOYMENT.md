# cPanel Deployment Guide

## 📦 Files Ready for Upload

The `cpanel-deploy.zip` file contains everything needed for cPanel deployment:
- Built production files (dist/)
- API endpoints (api/)
- .htaccess configuration
- .cpanel.yml for automated deployment

---

## 🚀 Manual Deployment Steps

### Step 1: Upload Files

1. **Login to cPanel**
   - Go to your hosting provider's cPanel
   - Navigate to **File Manager**

2. **Navigate to public_html**
   - Open the `public_html` directory (or your domain's root)

3. **Upload the ZIP file**
   - Click **Upload** button
   - Select `cpanel-deploy.zip`
   - Wait for upload to complete

4. **Extract the ZIP**
   - Right-click on `cpanel-deploy.zip`
   - Select **Extract**
   - Extract to current directory
   - Delete the zip file after extraction

### Step 2: Configure Environment

1. **Create .env file** (if not exists)
   - In File Manager, create new file: `.env`
   - Add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. **Update api/config.php**
   - Open `api/config.php`
   - Update Supabase credentials:
   ```php
   define('SUPABASE_URL', 'your_supabase_url');
   define('SUPABASE_KEY', 'your_supabase_anon_key');
   ```

### Step 3: Set Permissions

Set correct permissions for security:
```
Folders: 755
Files: 644
.htaccess: 644
api/*.php: 644
```

### Step 4: Verify Deployment

1. Visit your domain: `https://yourdomain.com`
2. Check if site loads correctly
3. Test API endpoints: `https://yourdomain.com/api/events.php`
4. Test admin login: `https://yourdomain.com/admin`

---

## 🔄 Automated Deployment (GitHub)

If you have Git Version Control in cPanel:

### Step 1: Connect Repository

1. Go to cPanel → **Git Version Control**
2. Click **Create**
3. Enter repository URL: `https://github.com/Nealjain/SAKEC_ACM.git`
4. Repository Path: `/home/username/repositories/sakec-acm`
5. Click **Create**

### Step 2: Configure Deployment

The `.cpanel.yml` file is already configured:
```yaml
---
deployment:
  tasks:
    - export DEPLOYPATH=/home/username/public_html/
    - /bin/cp -R dist/* $DEPLOYPATH
    - /bin/cp -R api $DEPLOYPATH
    - /bin/cp .htaccess $DEPLOYPATH
```

Update `username` in the file to match your cPanel username.

### Step 3: Deploy

1. Push changes to GitHub
2. In cPanel Git Version Control, click **Pull or Deploy**
3. Select **Deploy HEAD Commit**
4. Deployment runs automatically

---

## 📋 Database Setup

### Step 1: Run SQL Migration

1. Go to Supabase Dashboard
2. Navigate to **SQL Editor**
3. Run the contents of `DATABASE-UPDATE.sql`
4. Verify tables created successfully

### Step 2: Create Storage Bucket

1. Go to Supabase Dashboard → **Storage**
2. Click **New bucket**
3. Name: `event-registrations`
4. Set to **Public**
5. Click **Create**

### Step 3: Apply Storage Policies

Run this SQL in Supabase:
```sql
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'event-registrations' );

-- Allow anyone to upload
CREATE POLICY "Allow Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'event-registrations' );
```

---

## ✅ Post-Deployment Checklist

- [ ] Site loads at your domain
- [ ] All pages accessible (Home, Events, Team, etc.)
- [ ] Admin login works
- [ ] Event registration form works
- [ ] Photo uploads work
- [ ] CSV export works
- [ ] Email sending works
- [ ] Contact form works
- [ ] Blog posts display
- [ ] Team members display
- [ ] Events display

---

## 🔧 Troubleshooting

### Site Shows 404 Error
- Check if files are in correct directory (public_html)
- Verify .htaccess file exists
- Check file permissions

### API Not Working
- Verify api/config.php has correct Supabase credentials
- Check PHP version (requires PHP 7.4+)
- Enable error reporting in PHP

### Photos Not Uploading
- Verify storage bucket exists in Supabase
- Check storage policies applied
- Verify bucket is set to Public

### Admin Login Not Working
- Run `supabase/create-admins-table.sql`
- Create admin user with `api/hash-password.php`
- Check database connection

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Check cPanel error logs
3. Verify Supabase credentials
4. Test API endpoints directly

---

## 🎉 You're Done!

Your SAKEC ACM website is now live with:
- ✅ Event registration system
- ✅ Photo uploads
- ✅ CSV export
- ✅ Email restrictions
- ✅ Admin dashboard
- ✅ Blog management
- ✅ Team management

**Live URL:** https://yourdomain.com  
**Admin Panel:** https://yourdomain.com/admin
