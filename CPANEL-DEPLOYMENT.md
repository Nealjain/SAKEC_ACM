# cPanel Deployment Guide for Next.js App

## Prerequisites
- cPanel with Node.js support (Setup Node.js App feature)
- SSH access (recommended)
- Node.js 18.x or higher

## Deployment Steps

### 1. Upload Files to cPanel
Upload all project files to your cPanel account via:
- FTP/SFTP
- File Manager
- Git (if available)

Recommended location: `/home/yourusername/your-app-folder`

### 2. Setup Node.js Application in cPanel

1. Log into cPanel
2. Find "Setup Node.js App" under Software section
3. Click "Create Application"
4. Configure:
   - **Node.js version**: 18.x or higher
   - **Application mode**: Production
   - **Application root**: Path to your app folder
   - **Application URL**: Your domain or subdomain
   - **Application startup file**: server.js
   - **Port**: Use the port provided by cPanel (usually auto-assigned)

### 3. Install Dependencies

Option A - Via cPanel Terminal:
```bash
cd /home/yourusername/your-app-folder
npm install
npm run build
```

Option B - Via SSH:
```bash
ssh yourusername@yourdomain.com
cd your-app-folder
npm install
npm run build
```

### 4. Environment Variables

In cPanel Node.js App settings, add these environment variables:
```
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 5. Start the Application

In cPanel Node.js App interface:
- Click "Start App" or "Restart App"
- Check the logs for any errors

### 6. Configure Domain

If using a subdomain or main domain:
1. Point your domain to the Node.js app port
2. The .htaccess file will handle the proxy

### 7. Verify Deployment

Visit your domain and check:
- Homepage loads correctly
- NFC profiles work (/nfc/[id])
- Images load from Supabase
- All API routes function

## Troubleshooting

### App won't start
- Check Node.js version (must be 18+)
- Verify all dependencies installed: `npm install`
- Check build completed: `npm run build`
- Review error logs in cPanel

### Images not loading
- Verify Supabase URL in environment variables
- Check next.config.mjs has correct image domains
- Ensure Supabase storage is public

### 500 Internal Server Error
- Check .htaccess proxy settings
- Verify port number matches cPanel assignment
- Check application logs

### Port conflicts
- cPanel assigns specific ports
- Update server.js if needed: `const port = process.env.PORT || 3000`

## Important Notes

1. **Build before starting**: Always run `npm run build` before starting the app
2. **Restart after changes**: Restart the app in cPanel after any code changes
3. **Environment variables**: Must be set in cPanel Node.js App settings
4. **Memory limits**: Check your hosting plan's memory limits
5. **Keep dependencies updated**: Run `npm update` periodically

## Alternative: Static Export (If Server Features Not Needed)

If you can convert to static site:
1. Update next.config.mjs: `output: 'export'`
2. Run: `npm run build`
3. Upload `out` folder contents to public_html
4. No Node.js app needed

Note: This won't work with your current setup due to server-side features.

## Support

If issues persist:
- Check cPanel error logs
- Contact your hosting provider
- Verify Node.js is properly enabled on your account
