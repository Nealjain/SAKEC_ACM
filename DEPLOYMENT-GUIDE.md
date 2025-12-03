# cPanel Deployment Guide

## Prerequisites
- cPanel account with Git Version Control enabled
- Node.js installed on your cPanel server (usually available by default)

## Setup Instructions

### 1. Update .cpanel.yml
Before deploying, you MUST update the `.cpanel.yml` file:

```yaml
- export DEPLOYPATH=/home/username/public_html/
```

**Replace `username` with your actual cPanel username.**

### 2. Connect GitHub to cPanel

1. Log into your cPanel
2. Go to **Git Version Control**
3. Click **Create**
4. Fill in the details:
   - **Clone URL**: `https://github.com/Nealjain/SAKEC_ACM.git`
   - **Repository Path**: Choose where to clone (e.g., `/home/username/repositories/sakec-acm`)
   - **Repository Name**: `sakec-acm` (or any name you prefer)
5. Click **Create**

### 3. Deploy

1. In cPanel Git Version Control, find your repository
2. Click **Manage**
3. Click **Pull or Deploy** tab
4. Click **Deploy HEAD Commit**

The deployment will:
- Install npm dependencies
- Build the React app
- Copy built files to `public_html`
- Copy API files
- Copy .htaccess for routing

### 4. Verify Deployment

Visit your website URL to verify the deployment was successful.

## Important Notes

### Email Configuration
The contact form is configured to send emails to: `neal.18191@sakec.ac.in`

Make sure:
- PHP mail() function is enabled on your server (usually enabled by default)
- Your server can send emails
- Check spam folder for test emails

### Environment Variables
If you're using Supabase, make sure your `.env` file is properly configured on the server:
- Create `.env` file in your repository root (already exists)
- Add your Supabase credentials
- The file is already in `.gitignore` for security

### Troubleshooting

**Deployment fails:**
- Check that you updated `username` in `.cpanel.yml`
- Verify Node.js is available: `node --version`
- Check deployment logs in cPanel

**Contact form not working:**
- Verify PHP mail() is enabled
- Check email headers and spam folder
- Test with a simple PHP mail script

**404 errors on routes:**
- Verify `.htaccess` was deployed correctly
- Check that mod_rewrite is enabled

## Manual Deployment (Alternative)

If automated deployment doesn't work, you can deploy manually:

1. Build locally:
   ```bash
   npm install
   npm run build
   ```

2. Upload via FTP/File Manager:
   - Upload `dist/*` contents to `public_html/`
   - Upload `api/` folder to `public_html/api/`
   - Upload `.htaccess` to `public_html/`

## Support

For issues, contact: neal.18191@sakec.ac.in
