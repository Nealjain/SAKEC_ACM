# SAKEC ACM Website - Vite Version

## 🚀 Quick Start

### 1. Add Supabase Key (REQUIRED)

**Go to this URL:** https://supabase.com/dashboard/project/dhxzkzdlsszwuqjkicnv/settings/api

Copy the **anon public** key and add it to `.env`:

```env
VITE_SUPABASE_URL=https://dhxzkzdlsszwuqjkicnv.supabase.co
VITE_SUPABASE_ANON_KEY=paste_your_key_here
```

### 2. Run Development Server

```bash
npm run dev
```

Visit: http://localhost:5173

### 3. Build for cPanel

```bash
npm run build
```

Upload `dist/` folder + `.htaccess` to cPanel `public_html/`

## ✨ Features

- Dynamic content from Supabase
- Modern animated design
- Responsive navigation
- Team profiles with NFC support
- Events management
- Blog system
- Photo gallery
- Contact form

## 🗄️ Database Tables

Your database has these tables:
- `team_members` - Core team
- `faculty_members` - Faculty advisors
- `alumni_members` - Alumni
- `events` - Events (upcoming & past)
- `blogs` - Blog posts
- `event_galleries` - Event photos
- `carousel_images` - Homepage carousel
- `contact_messages` - Contact form submissions

## 🔧 Tech Stack

- Vite + React + TypeScript
- Tailwind CSS
- Framer Motion
- Supabase
- React Router

## 📝 Note

The site will show a blank screen until you add your Supabase anon key to `.env` file!
