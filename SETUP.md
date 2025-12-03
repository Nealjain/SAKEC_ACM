# Setup Instructions

## 1. Add Supabase Credentials

Edit the `.env` file and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://dhxzkzdlsszwuqjkicnv.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### How to get your Supabase Anon Key:

1. Go to: https://supabase.com/dashboard/project/dhxzkzdlsszwuqjkicnv/settings/api
2. Copy the `anon` `public` key
3. Paste it in the `.env` file

## 2. Run the Development Server

```bash
npm run dev
```

Visit: http://localhost:5173 (or the port shown in terminal)

## 3. Build for cPanel

```bash
npm run build
```

Upload the `dist/` folder and `.htaccess` file to your cPanel `public_html/` directory.

## Features

- ✅ Dynamic content from Supabase
- ✅ Modern design with animations
- ✅ Fully responsive
- ✅ Team profiles
- ✅ Events management
- ✅ Blog system
- ✅ Photo gallery
- ✅ Contact form
- ✅ NFC profile cards

## Tech Stack

- Vite + React + TypeScript
- Tailwind CSS
- Framer Motion
- Supabase
- React Router
