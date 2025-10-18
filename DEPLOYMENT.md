# 🚀 Deployment Guide - SAKEC ACM Website

## Quick Start

### Prerequisites
- Node.js 18+ installed
- Supabase account with database configured
- Environment variables set up

### Build for Production

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

This creates an `out/` folder with static files ready for deployment.

---

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Click "Deploy"

**Benefits:**
- Automatic deployments on git push
- Free SSL certificate
- Global CDN
- Zero configuration
- Full Next.js support

---

### Option 2: cPanel / Shared Hosting

#### Step 1: Configure for Static Export

Your `next.config.mjs` is already configured with:
```javascript
output: 'export'
images: { unoptimized: true }
```

#### Step 2: Build

```bash
npm run build
```

#### Step 3: Upload Files

Upload these files from the `out/` folder to your `public_html/`:
- All HTML files
- `_next/` folder
- All asset folders
- `.htaccess` file (from `public/.htaccess`)

#### Step 4: Configure .htaccess

The `.htaccess` file handles:
- HTTPS redirect
- Clean URLs
- Security headers
- Caching

---

### Option 3: Netlify

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site"
   - Import from Git

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `out`

3. **Environment Variables**
   - Add your Supabase credentials

4. **Deploy**

---

## Environment Variables

### Required Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Where to Add Them

**Vercel/Netlify:**
- Project Settings → Environment Variables

**Local Development:**
- Create `.env.local` file in root directory

---

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Supabase database tables created
- [ ] Sample data inserted (optional)
- [ ] Build completes without errors
- [ ] All pages load correctly locally
- [ ] Images optimized and uploaded
- [ ] NFC profile URLs tested
- [ ] Contact form tested
- [ ] Mobile responsiveness verified

---

## Post-Deployment Steps

### 1. Test All Routes

- Homepage: `/`
- About: `/about`
- Team: `/team`
- Events: `/events`
- Blog: `/blog`
- Gallery: `/gallery`
- Contact: `/contact`
- Why Join: `/why-join`
- NFC Profiles: `/nfc/[id]`

### 2. Verify Supabase Connection

- Check if team members load
- Test blog posts display
- Verify events show up
- Test contact form submission

### 3. Performance Check

- Run Lighthouse audit
- Check mobile performance
- Test loading speed
- Verify images load

### 4. SEO Verification

- Check meta tags
- Verify Open Graph tags
- Test social media sharing
- Submit sitemap to Google

---

## Custom Domain Setup

### Vercel

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

### cPanel

1. Add domain in cPanel
2. Point to `public_html/` folder
3. Enable SSL in cPanel
4. Force HTTPS via `.htaccess`

---

## Troubleshooting

### Build Fails

**Check:**
- Node.js version (18+)
- All dependencies installed
- No TypeScript errors
- Environment variables set

**Fix:**
```bash
rm -rf node_modules .next
npm install
npm run build
```

### Pages Show 404

**cPanel:**
- Verify `.htaccess` uploaded
- Check file permissions (644 for files, 755 for folders)

**Vercel:**
- Check build logs
- Verify routes are correct

### Images Not Loading

**Check:**
- Images in `public/` folder
- Correct paths in code
- `images.unoptimized = true` in config

### Supabase Not Connecting

**Verify:**
- Environment variables correct
- Supabase project active
- RLS policies configured
- CORS settings allow your domain

---

## Performance Optimization

### Already Implemented

✅ Static site generation
✅ Image optimization disabled for static export
✅ Code splitting
✅ Lazy loading components
✅ Optimized bundle size

### Additional Optimizations

1. **Enable Caching**
   - Already configured in `.htaccess`
   - Vercel handles automatically

2. **Compress Images**
   - Use WebP format
   - Optimize before upload
   - Max 500KB per image

3. **CDN**
   - Vercel includes CDN
   - For cPanel, consider Cloudflare

---

## Monitoring

### Analytics

Add Google Analytics or Vercel Analytics:

```javascript
// app/layout.tsx
<Script src="https://www.googletagmanager.com/gtag/js?id=GA_ID" />
```

### Error Tracking

Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Vercel Analytics (built-in)

---

## Maintenance

### Regular Updates

```bash
# Update dependencies
npm update

# Check for security issues
npm audit

# Fix vulnerabilities
npm audit fix
```

### Content Updates

**Blog Posts:**
- Add via Supabase dashboard
- Or use SQL scripts in `scripts/` folder

**Team Members:**
- Update in Supabase `team_members` table
- Rebuild and redeploy

**Events:**
- Manage in Supabase `events` table
- Automatic updates on page load

---

## Backup

### Database Backup

1. Go to Supabase Dashboard
2. Database → Backups
3. Download backup
4. Store securely

### Code Backup

```bash
# Push to GitHub
git push origin main

# Create release tag
git tag -a v1.0.0 -m "Production release"
git push origin v1.0.0
```

---

## Support

### Common Issues

1. **Build errors** → Check Node.js version
2. **404 errors** → Verify `.htaccess`
3. **Slow loading** → Optimize images
4. **Database errors** → Check Supabase RLS

### Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

---

## Security

### Best Practices

✅ Environment variables not in code
✅ Supabase RLS policies enabled
✅ HTTPS enforced
✅ Security headers configured
✅ Input validation on forms
✅ Rate limiting on contact form

### Regular Security Checks

- Update dependencies monthly
- Review Supabase logs
- Monitor for suspicious activity
- Keep Next.js updated

---

## Scaling

### If Traffic Increases

**Vercel:**
- Automatically scales
- Upgrade plan if needed

**cPanel:**
- Consider upgrading hosting
- Add Cloudflare CDN
- Optimize database queries

---

## Contact

For deployment issues or questions:
- Check this documentation
- Review build logs
- Test locally first
- Contact hosting support if needed

---

**Your SAKEC ACM website is production-ready! 🎉**
