# 🚨 QUICK FIX - Directory Listing Issue

## Problem
Your site shows a directory listing instead of the actual website because the built files aren't in the correct location.

## Solution

### Option 1: Manual Fix (Fastest)

1. **Login to cPanel File Manager**
   - Go to your cPanel
   - Open File Manager
   - Navigate to `public_html`

2. **Check Current Structure**
   You probably have:
   ```
   public_html/
   ├── api/
   ├── dist/
   ├── index.html (wrong one - points to /src/main.tsx)
   └── .htaccess
   ```

3. **Fix the Structure**
   - **DELETE** the `index.html` in the root (it's the development version)
   - **COPY** everything from inside the `dist/` folder to `public_html/`
   - Your structure should be:
   ```
   public_html/
   ├── api/
   ├── assets/
   │   ├── index-ClbzE_Qt.js
   │   └── index-CLbkqphF.css
   ├── index.html (from dist folder)
   ├── favicon.svg
   ├── logo.png
   ├── logo.svg
   ├── manifest.json
   ├── robots.txt
   ├── sitemap.xml
   └── .htaccess
   ```

4. **Verify**
   - Visit your site: https://sakec.acm.org
   - It should now load properly

---

### Option 2: Re-upload Correctly

1. **On Your Local Machine**
   - Navigate to `acm main/` folder
   - Run: `npm run build` (to ensure latest build)

2. **Create Deployment Package**
   - Copy contents of `dist/` folder
   - Copy `api/` folder
   - Copy `.htaccess` file
   - Zip these together

3. **Upload to cPanel**
   - Delete everything in `public_html` (except databases if any)
   - Upload and extract the new zip
   - Make sure files are in root, not in a subfolder

---

## Why This Happened

The issue is that you uploaded the **development** `index.html` (which references `/src/main.tsx`) instead of the **production** `index.html` from the `dist/` folder (which references `/assets/index-ClbzE_Qt.js`).

The development version only works with Vite's dev server. For production, you need the built files from `dist/`.

---

## Quick Command to Rebuild

If you need to rebuild locally first:

```bash
cd "acm main"
npm run build
```

This creates fresh production files in the `dist/` folder.

---

## Verification Checklist

After fixing, verify:
- [ ] Site loads (no directory listing)
- [ ] No console errors
- [ ] Navigation works
- [ ] API endpoints work: https://sakec.acm.org/api/events.php
- [ ] Images load correctly

---

## Still Not Working?

If you still see issues:

1. **Check .htaccess is present** in public_html root
2. **Clear browser cache** (Ctrl+Shift+R or Cmd+Shift+R)
3. **Check file permissions**:
   - Folders: 755
   - Files: 644
4. **Check Apache modules** are enabled:
   - mod_rewrite
   - mod_headers
   - mod_deflate

---

## Need Help?

The directory listing shows:
- `api/` folder ✅
- `dist/` folder ❌ (should not be visible, contents should be in root)

This confirms the files are in the wrong location.
