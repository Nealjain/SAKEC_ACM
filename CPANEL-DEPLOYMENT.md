# cPanel Deployment Guide

## Prerequisites
- cPanel hosting account
- Your Supabase credentials
- FTP/File Manager access

## Step 1: Add Supabase Key (IMPORTANT!)

Before building, add your Supabase anon key to `.env`:

```env
VITE_SUPABASE_URL=https://dhxzkzdlsszwuqjkicnv.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_key_here
```

Get it from: https://supabase.com/dashboard/project/dhxzkzdlsszwuqjkicnv/settings/api

## Step 2: Build the Project

```bash
npm run build
```

This creates a `dist/` folder with all your static files.

## Step 3: Upload to cPanel

### Option A: File Manager (Easiest)

1. Log into cPanel
2. Open **File Manager**
3. Navigate to `public_html` (or your domain folder)
4. **Delete** all existing files (or backup first)
5. Click **Upload**
6. Upload ALL files from the `dist/` folder
7. Upload the `.htaccess` file from project root
8. Done!

### Option B: FTP/SFTP

1. Connect via FTP client (FileZilla, etc.)
   - Host: ftp.yourdomain.com
   - Username: your cPanel username
   - Password: your cPanel password
2. Navigate to `public_html/`
3. Upload all files from `dist/` folder
4. Upload `.htaccess` file
5. Done!

## Step 4: Verify

Visit your domain: `https://yourdomain.com`

Check:
- ✅ Homepage loads
- ✅ Navigation works
- ✅ All pages accessible
- ✅ Data loads from Supabase
- ✅ Images display correctly

## File Structure on cPanel

```
public_html/
├── index.html
├── .htaccess (IMPORTANT!)
└── assets/
    ├── index-[hash].js
    ├── index-[hash].css
    └── [other assets]
```

## Troubleshooting

### Issue: 404 on page refresh
**Solution:** Make sure `.htaccess` is uploaded

### Issue: Blank page
**Solution:** 
1. Check browser console (F12)
2. Verify Supabase key was added before building
3. Rebuild: `npm run build`

### Issue: Images not loading
**Solution:** Check Supabase storage bucket is public

### Issue: Data not loading
**Solution:** 
1. Verify Supabase credentials in `.env` before building
2. Rebuild the project
3. Re-upload files

## Important Notes

1. **Environment variables are baked into the build** - if you change `.env`, you must rebuild!
2. **Always upload `.htaccess`** - it's required for React Router to work
3. **Clear browser cache** after uploading new files
4. **The anon key is safe** to include in the build (it's designed for frontend use)

## Updating Content

Good news! You don't need to rebuild to update content:
- Add/edit team members in Supabase → appears instantly
- Add/edit events in Supabase → appears instantly
- Add/edit blog posts in Supabase → appears instantly

Only rebuild when you change:
- Code/design
- Environment variables
- Dependencies

## Performance Tips

1. Enable GZIP compression (already in `.htaccess`)
2. Enable browser caching (already in `.htaccess`)
3. Use Cloudflare (free) for CDN
4. Optimize images in Supabase storage (use WebP format)

## Cost

- **Hosting:** $3-10/month (basic cPanel)
- **Domain:** $10-15/year
- **Supabase:** FREE (up to 500MB database)
- **Total:** ~$5-15/month

## Support

If issues persist:
- Check cPanel error logs
- Verify all files uploaded
- Test in incognito mode
- Contact hosting support

---

**Ready to deploy?** Run `npm run build` and upload the `dist/` folder! 🚀
