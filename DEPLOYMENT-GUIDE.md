# Deployment Guide for Next.js on cPanel

## Important: Next.js vs React

Your project is **Next.js**, not a standard React app. Next.js requires special deployment steps.

## Deployment Options

### Option 1: Static Export (Recommended for cPanel)

This converts your Next.js app to static HTML/CSS/JS files that work on any hosting.

#### Step 1: Configure Next.js for Static Export

Update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // Helps with Apache routing
}

module.exports = nextConfig
```

#### Step 2: Build Your Project

```bash
npm run build
```

This creates an `out/` folder with static files.

#### Step 3: Upload to cPanel

1. **Connect via FTP or File Manager**
2. **Navigate to** `public_html/`
3. **Upload all contents** from the `out/` folder
4. **Upload** the `.htaccess` file (from `public/.htaccess`)

#### Step 4: File Structure on Server

```
public_html/
├── .htaccess          (from public/.htaccess)
├── index.html
├── 404.html
├── _next/
│   ├── static/
│   └── ...
├── team/
├── blog/
├── nfc_id/
└── ... (other folders)
```

---

## Option 2: Node.js Hosting (If cPanel Supports It)

Some cPanel hosts support Node.js apps. Check with your hosting provider.

#### Requirements:
- Node.js support (v18+)
- SSH access
- Ability to run `npm` commands

#### Steps:

1. **Upload entire project** (not just `out/` folder)
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Build the project**:
   ```bash
   npm run build
   ```
4. **Start the server**:
   ```bash
   npm start
   ```
5. **Configure cPanel** to point to your Node.js app

---

## .htaccess File Explanation

The `.htaccess` file I created does:

### 1. **Force HTTPS**
```apache
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### 2. **Handle Next.js Routes**
```apache
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.*)$ $1.html [L]
```
Converts `/about` → `/about.html`

### 3. **Security**
- Blocks access to `.env` files
- Blocks access to hidden files (`.git`, etc.)
- Disables directory browsing

### 4. **Performance**
- Gzip compression (smaller file sizes)
- Browser caching (faster repeat visits)
- Proper MIME types

---

## Important Notes

### ⚠️ Limitations of Static Export

When using `output: 'export'`, these features **won't work**:

1. **API Routes** (`/api/*`)
   - Solution: Use external API or serverless functions

2. **Server-Side Rendering (SSR)**
   - `getServerSideProps` won't work
   - Solution: Use `getStaticProps` instead

3. **Incremental Static Regeneration (ISR)**
   - Solution: Rebuild and redeploy for updates

4. **Image Optimization**
   - Next.js Image Optimization requires a server
   - Solution: Use `unoptimized: true` in config

### ✅ What Still Works

- Client-side routing (Next.js Link)
- Static pages
- Client-side data fetching (useEffect, SWR, React Query)
- All React features
- Supabase client-side queries

---

## Your Current Setup

### Database Queries
Your app uses Supabase, which works perfectly with static export because:
- All queries are client-side
- Uses `createClient()` from `@/lib/supabase/client`
- No server-side API routes needed

### Dynamic Routes
Your dynamic routes will work:
- `/team/[id]` → Generates static pages for each team member
- `/blog/[id]` → Generates static pages for each blog post
- `/nfc_id/[id]` → Needs special handling (see below)

---

## Handling NFC Dynamic Routes

The `/nfc_id/[id]` route is tricky because IDs are UUIDs (infinite possibilities).

### Solution 1: Client-Side Only (Recommended)

Keep it as-is. The page will:
1. Load the shell
2. Fetch data client-side from Supabase
3. Display the profile

**Pros**: Works with any ID, no rebuild needed
**Cons**: Slightly slower initial load

### Solution 2: Pre-generate Common IDs

In `app/nfc_id/[id]/page.tsx`, add:

```typescript
export async function generateStaticParams() {
  const supabase = createClient()
  const { data: members } = await supabase
    .from('team_members')
    .select('id')
    .limit(100) // Limit to active members
  
  return members?.map((member) => ({
    id: member.id,
  })) || []
}
```

**Pros**: Faster load for pre-generated pages
**Cons**: Need to rebuild when adding new members

---

## Deployment Checklist

- [ ] Update `next.config.js` with `output: 'export'`
- [ ] Update environment variables (`.env.local` → `.env.production`)
- [ ] Run `npm run build`
- [ ] Check `out/` folder is created
- [ ] Upload contents of `out/` to `public_html/`
- [ ] Upload `.htaccess` file
- [ ] Test all routes on live site
- [ ] Check browser console for errors
- [ ] Test NFC card URLs
- [ ] Verify Supabase connection works

---

## Environment Variables

### Local Development
`.env.local` (not uploaded to server)

### Production
Create `.env.production`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

**Important**: Only `NEXT_PUBLIC_*` variables work in static export!

---

## Testing Before Deployment

```bash
# Build for production
npm run build

# Test the static export locally
npx serve out

# Visit http://localhost:3000
```

---

## Troubleshooting

### Issue: 404 on page refresh
**Solution**: Check `.htaccess` is uploaded and working

### Issue: Images not loading
**Solution**: Verify `images.unoptimized = true` in config

### Issue: API routes not working
**Solution**: Static export doesn't support API routes. Use Supabase directly.

### Issue: Blank page
**Solution**: Check browser console for errors. Likely environment variable issue.

### Issue: Styles not loading
**Solution**: Check `_next/` folder is uploaded correctly

---

## Alternative: Vercel Deployment (Easiest)

If cPanel is too complex, deploy to Vercel (free):

1. Push code to GitHub
2. Import project on Vercel
3. Add environment variables
4. Deploy (automatic)

**Pros**: 
- Full Next.js features work
- Automatic deployments
- Free SSL
- Global CDN

**Cons**:
- Not on your cPanel hosting

---

## Need Help?

Common issues and solutions:
1. Check `.htaccess` syntax
2. Verify file permissions (644 for files, 755 for folders)
3. Check Apache error logs in cPanel
4. Test with browser dev tools open
5. Verify Supabase credentials are correct

---

## Quick Deploy Script

Create `deploy.sh`:

```bash
#!/bin/bash

echo "Building Next.js app..."
npm run build

echo "Build complete! Upload the 'out' folder to public_html/"
echo "Don't forget to upload .htaccess from public/.htaccess"
```

Run: `chmod +x deploy.sh && ./deploy.sh`
