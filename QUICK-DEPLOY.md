# Quick Deployment Steps for cPanel

## 🚀 Fast Track Deployment

### Step 1: Prepare for Production

Replace your `next.config.mjs` with this:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static export
  trailingSlash: true,  // Better Apache compatibility
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
}

export default nextConfig
```

### Step 2: Build

```bash
npm run build
```

This creates an `out/` folder.

### Step 3: Upload to cPanel

#### Via File Manager:
1. Login to cPanel
2. Open File Manager
3. Go to `public_html/`
4. **Delete old files** (if any)
5. **Upload all files** from `out/` folder
6. **Upload** `public/.htaccess` to `public_html/.htaccess`

#### Via FTP (FileZilla):
1. Connect to your server
2. Navigate to `public_html/`
3. Upload all contents from `out/` folder
4. Upload `.htaccess` from `public/.htaccess`

### Step 4: Verify

Visit your domain:
- Homepage: `https://yourdomain.com`
- Team page: `https://yourdomain.com/team`
- Blog: `https://yourdomain.com/blog`
- NFC: `https://yourdomain.com/nfc_id/283006fb-63d7-40bf-bf62-e3751c767499`

---

## 📁 What to Upload

From the `out/` folder, upload:
```
✅ index.html
✅ 404.html
✅ _next/ (entire folder)
✅ team/ (entire folder)
✅ blog/ (entire folder)
✅ nfc_id/ (entire folder)
✅ alumni/ (if exists)
✅ All other folders and files
```

Plus:
```
✅ .htaccess (from public/.htaccess)
```

---

## ⚠️ Common Mistakes

❌ **Don't upload**:
- `node_modules/`
- `.next/`
- `.git/`
- `.env.local`
- `package.json`
- Source code files

✅ **Only upload**:
- Contents of `out/` folder
- `.htaccess` file

---

## 🔧 If Something Breaks

### Pages show 404 on refresh
**Fix**: Make sure `.htaccess` is uploaded to `public_html/.htaccess`

### Images not loading
**Fix**: Check `images.unoptimized = true` in config

### Blank page
**Fix**: 
1. Open browser console (F12)
2. Check for errors
3. Verify environment variables

### Supabase not connecting
**Fix**: Check your Supabase URL and keys are correct

---

## 🎯 Production Checklist

Before deploying:
- [ ] Update `next.config.mjs` with `output: 'export'`
- [ ] Run `npm run build` successfully
- [ ] Check `out/` folder exists
- [ ] Verify `.htaccess` file is ready
- [ ] Test locally: `npx serve out`

During deployment:
- [ ] Clear `public_html/` folder
- [ ] Upload all `out/` contents
- [ ] Upload `.htaccess` file
- [ ] Set file permissions (644 for files, 755 for folders)

After deployment:
- [ ] Test homepage
- [ ] Test all main routes
- [ ] Test NFC card URL
- [ ] Check browser console for errors
- [ ] Test on mobile device

---

## 💡 Pro Tips

1. **Keep a backup**: Download current `public_html/` before uploading
2. **Test locally first**: Run `npx serve out` to test the build
3. **Use .htaccess**: It's crucial for routing to work
4. **Check permissions**: Files should be 644, folders 755
5. **Clear cache**: Hard refresh (Ctrl+Shift+R) after deployment

---

## 🆘 Need Help?

If deployment fails:
1. Check cPanel error logs
2. Verify `.htaccess` syntax
3. Test with a simple `index.html` first
4. Contact your hosting support
5. Consider using Vercel (easier alternative)

---

## 🚀 Alternative: Deploy to Vercel (Recommended)

Easiest option:

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy!

**Benefits**:
- Automatic deployments
- Free SSL
- Global CDN
- Full Next.js features
- No configuration needed
