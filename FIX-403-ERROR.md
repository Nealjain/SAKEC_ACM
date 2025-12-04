# Fix 403 Forbidden Error

## Quick Fixes

### 1. Check File Permissions

In cPanel File Manager, set these permissions:

**Folders:**
- `public_html/` → 755
- `public_html/api/` → 755
- `public_html/assets/` → 755

**Files:**
- `index.html` → 644
- `.htaccess` → 644
- All `.php` files → 644
- All `.js` and `.css` files → 644

**How to change permissions:**
1. Right-click on file/folder
2. Select "Change Permissions"
3. Enter the number (755 or 644)
4. Click "Change Permissions"

### 2. Check File Ownership

Files should be owned by your cPanel user, not root.

In cPanel File Manager:
1. Select all files
2. Right-click → "Change Ownership"
3. Set owner to your cPanel username

### 3. Verify .htaccess Location

The `.htaccess` file must be in the same directory as `index.html`.

**Correct structure:**
```
public_html/
├── .htaccess          ← Must be here
├── index.html
├── assets/
└── api/
```

### 4. Test Without .htaccess

Temporarily rename `.htaccess` to `.htaccess.bak` and test if site loads.

If it works:
- The .htaccess has an issue
- Use the updated version from this fix

If it still doesn't work:
- It's a permissions issue
- Check steps 1 and 2

### 5. Check Apache Modules

Your server needs these Apache modules enabled:
- `mod_rewrite`
- `mod_headers`
- `mod_deflate`
- `mod_expires`

Contact your hosting provider if these aren't enabled.

### 6. Verify Directory Structure

After extracting the zip, your structure should be:

```
public_html/
├── .htaccess
├── index.html
├── logo.png
├── logo.svg
├── favicon.svg
├── manifest.json
├── robots.txt
├── sitemap.xml
├── assets/
│   ├── index-CLbkqphF.css
│   └── index-ClbzE_Qt.js
└── api/
    ├── config.php
    ├── events.php
    ├── team.php
    ├── blogs.php
    ├── send-email.php
    ├── admin-auth.php
    ├── admin-verify.php
    ├── admin-logout.php
    ├── admin-send-email.php
    ├── event-registration.php
    └── hash-password.php
```

### 7. Check PHP Version

Your server needs PHP 7.4 or higher.

In cPanel:
1. Go to "Select PHP Version"
2. Choose PHP 7.4 or 8.x
3. Save

### 8. Clear Browser Cache

Sometimes the 403 error is cached:
1. Press Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
2. Clear cache and cookies
3. Reload the page

---

## Step-by-Step Fix

### Step 1: Fix Permissions via cPanel

```bash
# In cPanel File Manager, select all files in public_html
# Then use "Change Permissions" option

Folders: 755
Files: 644
```

### Step 2: Update .htaccess

Replace your `.htaccess` content with:

```apache
# Apache Configuration for React SPA

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Allow access to API directory
  RewriteCond %{REQUEST_URI} ^/api/
  RewriteRule ^ - [L]
  
  # Allow access to assets
  RewriteCond %{REQUEST_URI} ^/assets/
  RewriteRule ^ - [L]
  
  # Don't rewrite files or directories that exist
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Rewrite everything else to index.html
  RewriteRule ^ index.html [L]
</IfModule>

DirectoryIndex index.html

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>

ErrorDocument 404 /index.html
```

### Step 3: Test Access

1. Visit: `https://yourdomain.com/index.html`
   - Should load the site

2. Visit: `https://yourdomain.com/api/events.php`
   - Should return JSON data

3. Visit: `https://yourdomain.com/`
   - Should load the site (via .htaccess rewrite)

---

## Common Causes

### Cause 1: Wrong Permissions
**Solution:** Set folders to 755, files to 644

### Cause 2: Files in Wrong Directory
**Solution:** Extract zip directly in public_html, not in a subdirectory

### Cause 3: .htaccess Not Allowed
**Solution:** Contact hosting provider to enable .htaccess

### Cause 4: mod_rewrite Disabled
**Solution:** Contact hosting provider to enable mod_rewrite

### Cause 5: Ownership Issues
**Solution:** Change file owner to your cPanel username

---

## Alternative: Minimal .htaccess

If the full .htaccess doesn't work, try this minimal version:

```apache
DirectoryIndex index.html

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [L]
</IfModule>
```

---

## Still Not Working?

### Check Error Logs

In cPanel:
1. Go to "Errors"
2. Check the latest error log
3. Look for specific error messages

### Contact Hosting Support

Provide them with:
- The 403 error message
- Your domain name
- That you need mod_rewrite enabled
- That you need .htaccess support

### Test on Subdomain

Try deploying to a subdomain first:
1. Create subdomain: `test.yourdomain.com`
2. Upload files there
3. Test if it works
4. If yes, the issue is with main domain configuration

---

## Prevention

After fixing:
1. ✅ Keep file permissions correct (755/644)
2. ✅ Don't modify .htaccess unless needed
3. ✅ Always extract files in correct directory
4. ✅ Test after any server changes

---

**Need Help?**
- Check cPanel error logs
- Contact your hosting provider
- Verify Apache modules are enabled
