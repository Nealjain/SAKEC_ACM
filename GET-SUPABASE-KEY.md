# 🔑 How to Get Your Supabase Key

## Step 1: Go to Supabase Dashboard

Click this link: **https://supabase.com/dashboard/project/dhxzkzdlsszwuqjkicnv/settings/api**

## Step 2: Copy the Anon Key

On that page, you'll see:
- Project URL (already added ✅)
- **anon public** key ← Copy this!

It looks like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoeHpremRsc3N6d3VxamtpY252Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY1OTI5NzcsImV4cCI6MjA1MjE2ODk3N30.XXXXXXXXXXXXXXX`

## Step 3: Add to .env File

Open `acm main/.env` and replace:

```env
VITE_SUPABASE_ANON_KEY=ADD_YOUR_ANON_KEY_HERE
```

With:

```env
VITE_SUPABASE_ANON_KEY=paste_the_key_you_copied
```

## Step 4: Save and Reload

Save the file and the website will automatically reload with your data!

---

## Why This Error?

The error "Failed to fetch data" appears because:
- ❌ The Supabase client can't connect without the anon key
- ❌ It's trying to fetch team members, events, blogs, etc.
- ❌ But the authentication fails

Once you add the key:
- ✅ All your data will load from the database
- ✅ Team members will appear
- ✅ Events will show
- ✅ Blog posts will display
- ✅ Everything becomes dynamic!

---

**The anon key is safe to use in frontend code - it's designed for public access!**
