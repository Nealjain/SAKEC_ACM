# 🎓 SAKEC ACM Student Chapter Website

A modern, production-ready website for the SAKEC ACM Student Chapter built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ecf8e)](https://supabase.com/)

## ✨ Features

### 🎨 Modern UI/UX
- **Smooth Animations**: GSAP & Framer Motion powered animations
- **Lenis Smooth Scrolling**: Buttery smooth page scrolling
- **Responsive Design**: Mobile-first approach, works on all devices
- **Dark Theme**: Professional dark theme with ACM branding
- **Interactive Components**: 3D cards, parallax effects, animated testimonials

### 📱 Core Pages
- **Homepage**: Hero section with parallax, events showcase, CTA with 3D scroll animation
- **About**: Chapter information and mission
- **Team**: Member profiles with detailed cards and social links
- **Events**: Upcoming and past events with beautiful cards
- **Blog**: Multi-image blog posts with author profiles, categories, and search
- **Gallery**: Event photo galleries with lightbox
- **Contact**: Functional contact form with rate limiting
- **Why Join**: Benefits and testimonials

### 🎯 Special Features

#### NFC Profile Cards
- Unique NFC profile pages for each member
- Custom preloader with SAKEC ACM branding
- Session-based preloader (shows once per session)
- Clickable profile pictures
- Social media integration
- Direct contact options

#### Enhanced Blog System
- Support for 1-4 images per post
- Image carousel for multiple images
- Author profiles with clickable cards
- Share functionality (native share API)
- Save/bookmark feature
- Category filtering
- Full-text search
- Reading time estimation

#### Mobile Navigation
- Clean hamburger menu
- Full-screen overlay
- Smooth animations
- Touch-friendly interactions

#### Contact Form
- Supabase integration
- Rate limiting (3 submissions per hour)
- Stateful button with loading/success animations
- Email validation
- Error handling

### 🛠️ Technical Features
- **Static Site Generation**: Fast loading with Next.js SSG
- **TypeScript**: Type-safe code
- **Supabase Backend**: PostgreSQL database with RLS
- **Optimized Images**: Next.js Image optimization
- **SEO Optimized**: Meta tags, Open Graph, structured data
- **Accessibility**: ARIA labels, keyboard navigation
- **Performance**: Lighthouse score optimized

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/sakec-acm-website.git
   cd sakec-acm-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   
   Run the SQL scripts in the `scripts/` folder in your Supabase SQL Editor:
   - `01-create-tables.sql` - Create all tables
   - `02-seed-sample-data.sql` - Insert sample data (optional)

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📦 Build for Production

```bash
# Build the project
npm run build

# The output will be in the 'out/' folder
```

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy Options

**Vercel (Recommended):**
1. Push to GitHub
2. Import project on Vercel
3. Add environment variables
4. Deploy

**cPanel/Shared Hosting:**
1. Build the project: `npm run build`
2. Upload contents of `out/` folder to `public_html/`
3. Upload `.htaccess` from `public/.htaccess`

## 📁 Project Structure

```
sakec-acm-website/
├── app/                    # Next.js app directory
│   ├── about/             # About page
│   ├── api/               # API routes
│   ├── blog/              # Blog pages
│   ├── contact/           # Contact page
│   ├── events/            # Events pages
│   ├── gallery/           # Gallery pages
│   ├── nfc/               # NFC profile pages
│   ├── team/              # Team pages
│   ├── why-join/          # Why Join page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── ui/               # UI components
│   ├── blog-card.tsx     # Blog card component
│   ├── event-card.tsx    # Event card component
│   ├── mobile-menu.tsx   # Mobile navigation
│   └── ...               # Other components
├── lib/                   # Utility functions
│   ├── supabase/         # Supabase client
│   ├── blog.ts           # Blog functions
│   ├── events.ts         # Events functions
│   ├── team.ts           # Team functions
│   └── ...               # Other utilities
├── public/               # Static assets
│   ├── .htaccess         # Apache configuration
│   └── ...               # Images and assets
├── scripts/              # Database scripts
│   ├── 01-create-tables.sql
│   ├── 02-seed-sample-data.sql
│   └── ...
├── .env.local            # Environment variables (create this)
├── next.config.mjs       # Next.js configuration
├── tailwind.config.ts    # Tailwind configuration
└── package.json          # Dependencies
```

## 🗄️ Database Schema

### Main Tables
- `team_members` - Team member profiles
- `events` - Events information
- `blogs` - Blog posts
- `gallery_items` - Gallery images
- `event_galleries` - Event photo collections
- `faculty_members` - Faculty information
- `alumni_members` - Alumni profiles
- `carousel_images` - Homepage carousel
- `contact_submissions` - Contact form submissions

See `scripts/` folder for complete schema.

## 🎨 Customization

### Colors
Edit `tailwind.config.ts` to change the color scheme:
```typescript
colors: {
  primary: '#your-color',
  secondary: '#your-color',
}
```

### Branding
- Update logo in `public/`
- Change site name in `app/layout.tsx`
- Update meta tags for SEO

### Content
- Team members: Update in Supabase `team_members` table
- Events: Update in Supabase `events` table
- Blog posts: Add via Supabase dashboard or SQL

## 🔧 Configuration

### Next.js Config
The `next.config.mjs` is configured for static export:
```javascript
output: 'export'
images: { unoptimized: true }
```

### Supabase
- RLS policies enabled for security
- Public read access for published content
- Authenticated write access for admin

## 📱 NFC Card Setup

1. Get member ID from Supabase `team_members` table
2. Program NFC card with URL: `https://yourdomain.com/nfc/[member-id]`
3. Test by scanning the card

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Next.js** - React framework
- **Supabase** - Backend and database
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **GSAP** - Advanced animations
- **Lenis** - Smooth scrolling
- **Aceternity UI** - UI components

## 📞 Support

For issues or questions:
- Check the documentation
- Review [DEPLOYMENT.md](./DEPLOYMENT.md)
- Open an issue on GitHub

## 🎉 Features Highlights

✅ Production-ready code
✅ Clean, maintainable codebase
✅ No console logs in production
✅ Optimized performance
✅ Mobile-responsive
✅ SEO optimized
✅ Accessibility compliant
✅ Security best practices
✅ Comprehensive documentation

---

**Built with ❤️ by SAKEC ACM Student Chapter**
