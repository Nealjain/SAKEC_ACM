# SEO Setup Instructions

## Important: Update Your Domain

Before deploying, you MUST replace `https://yourdomain.com` with your actual domain in these files:

### 1. index.html
Replace all instances of `https://yourdomain.com/` with your actual domain:
- Line 13: `<link rel="canonical" href="https://yourdomain.com/" />`
- Line 20: `<meta property="og:url" content="https://yourdomain.com/" />`
- Line 23: `<meta property="og:image" content="https://yourdomain.com/logo.png" />`
- Line 29: `<meta property="twitter:url" content="https://yourdomain.com/" />`
- Line 31: `<meta property="twitter:image" content="https://yourdomain.com/logo.png" />`
- Lines 37-39: Schema.org structured data URLs

### 2. public/sitemap.xml
Replace all `https://yourdomain.com` with your actual domain in all `<loc>` tags.

### 3. public/robots.txt
Update the Sitemap URL with your actual domain.

## SEO Features Implemented

### Meta Tags
- ✅ Primary meta tags (title, description, keywords)
- ✅ Open Graph tags for Facebook/LinkedIn sharing
- ✅ Twitter Card tags for Twitter sharing
- ✅ Canonical URL to prevent duplicate content
- ✅ Robots meta tag for search engine indexing

### Structured Data
- ✅ Schema.org Organization markup
- ✅ Proper logo and contact information
- ✅ Address and parent organization details

### Files Created
- ✅ `robots.txt` - Tells search engines what to crawl
- ✅ `sitemap.xml` - Lists all pages for search engines
- ✅ `manifest.json` - PWA support and app-like experience

### Logo Visibility
The logo is now properly configured for:
- ✅ Google Search results (via Schema.org logo)
- ✅ Social media sharing (Open Graph image)
- ✅ Twitter cards
- ✅ Favicon in browser tabs
- ✅ Apple touch icon for iOS devices

## After Deployment

### 1. Submit to Google Search Console
1. Go to https://search.google.com/search-console
2. Add your property (website)
3. Verify ownership
4. Submit your sitemap: `https://yourdomain.com/sitemap.xml`

### 2. Test Your SEO
- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **PageSpeed Insights**: https://pagespeed.web.dev/

### 3. Monitor Performance
- Check Google Search Console regularly
- Monitor page speed and Core Web Vitals
- Update sitemap when adding new pages

## Logo Requirements for Google

Your logo should be:
- ✅ At least 112x112 pixels
- ✅ In PNG, JPG, or SVG format
- ✅ Accessible via HTTPS
- ✅ Properly referenced in Schema.org markup

Current logo location: `/logo.png`

## Additional Recommendations

1. **Add alt text to all images** in your components
2. **Use semantic HTML** (already done with proper heading hierarchy)
3. **Ensure fast loading times** (optimize images, use lazy loading)
4. **Mobile-friendly design** (already responsive)
5. **HTTPS enabled** (required for modern SEO)
6. **Regular content updates** (blog posts, events)

## Social Media Integration

Add your social media links to the Schema.org markup in `index.html`:
```json
"sameAs": [
  "https://github.com/Nealjain/SAKEC_ACM",
  "https://www.linkedin.com/company/your-linkedin",
  "https://twitter.com/your-twitter",
  "https://www.instagram.com/your-instagram"
]
```

## Contact

For SEO questions: neal.18191@sakec.ac.in
