# Quick Deploy to cPanel - 3 Steps

## Step 1: Add Supabase Key

Edit `.env` file:
```env
VITE_SUPABASE_URL=https://dhxzkzdlsszwuqjkicnv.supabase.co
VITE_SUPABASE_ANON_KEY=paste_your_key_here
```

Get key from: https://supabase.com/dashboard/project/dhxzkzdlsszwuqjkicnv/settings/api

## Step 2: Build

```bash
npm run build
```

Or use the deploy script:
```bash
./deploy.sh
```

## Step 3: Upload to cPanel

1. Log into cPanel
2. File Manager → `public_html/`
3. Upload all files from `dist/` folder
4. Upload `.htaccess` file
5. Done! Visit your domain

---

## Files to Upload:

```
From dist/ folder:
├── index.html
└── assets/
    ├── *.js
    ├── *.css
    └── other files

From project root:
└── .htaccess
```

## That's it! 🎉

Your website is now live with:
- ✅ Dynamic content from Supabase
- ✅ Animated dotted background
- ✅ All pages working
- ✅ Responsive design
- ✅ Fast loading

## Update Content:

Just edit your Supabase database - no rebuild needed!

## Update Code:

1. Make changes
2. Run `npm run build`
3. Re-upload `dist/` folder
