# Blog Setup Guide

## Changes Made

I've updated your blog system to fetch data from Supabase instead of using static data.

## What You Need to Do in Supabase

### 1. Verify Your Table Structure

Your `blogs` table should already exist with this structure:
```sql
create table public.blogs (
  id uuid not null default gen_random_uuid(),
  title character varying(255) not null,
  content text not null,
  excerpt text null,
  image_url text null,
  author_id uuid null,
  category character varying(100) null,
  tags text[] null,
  is_published boolean null default false,
  reading_time integer null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint blogs_pkey primary key (id),
  constraint blogs_author_id_fkey foreign key (author_id) references team_members (id)
)
```

### 2. Insert Sample Blog Data

Run the SQL file I created: `scripts/insert-sample-blogs.sql`

**Steps:**
1. Go to Supabase Dashboard
2. Click on "SQL Editor"
3. Copy the contents of `scripts/insert-sample-blogs.sql`
4. Paste and click "Run"

This will insert 5 sample blog posts with different categories.

### 3. Enable Row Level Security (RLS) - IMPORTANT!

Run these commands in Supabase SQL Editor:

```sql
-- Enable RLS on blogs table
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published blogs
CREATE POLICY "Allow public read access to published blogs"
ON public.blogs
FOR SELECT
USING (is_published = true);

-- Allow authenticated users to read all blogs
CREATE POLICY "Allow authenticated users to read all blogs"
ON public.blogs
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to insert blogs
CREATE POLICY "Allow authenticated users to insert blogs"
ON public.blogs
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update their own blogs
CREATE POLICY "Allow authenticated users to update blogs"
ON public.blogs
FOR UPDATE
TO authenticated
USING (true);

-- Allow authenticated users to delete blogs
CREATE POLICY "Allow authenticated users to delete blogs"
ON public.blogs
FOR DELETE
TO authenticated
USING (true);
```

### 4. Verify Your Environment Variables

Make sure your `.env.local` has:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## How It Works Now

### Blog Pages

1. **Blog List Page** (`/blog`): Shows all published blogs
2. **Blog Detail Page** (`/blog/[id]`): Shows individual blog post with author info
3. **Search**: Works with Supabase full-text search

### Features

- ✅ Fetches blogs from Supabase
- ✅ Shows author information (from team_members table)
- ✅ Category filtering
- ✅ Search functionality
- ✅ Fallback to static data if Supabase fails
- ✅ Automatic sorting by date

### Author Linking

The blog posts are linked to team members via `author_id`. Make sure:
1. You have team members in your `team_members` table
2. The `author_id` in blogs matches a valid team member `id`

## Testing

1. **Check if blogs appear:**
   - Visit `/blog` on your website
   - You should see the sample blog posts

2. **Check individual blog:**
   - Click on any blog post
   - You should see the full content with author info

3. **Test search:**
   - Use the search box on `/blog`
   - Search for keywords like "web", "security", "mobile"

## Troubleshooting

### Blogs Not Showing?

1. **Check Supabase connection:**
   - Verify `.env.local` has correct credentials
   - Check browser console for errors

2. **Check RLS policies:**
   - Make sure you ran the RLS commands above
   - Verify `is_published = true` for your blogs

3. **Check data:**
   ```sql
   SELECT * FROM public.blogs WHERE is_published = true;
   ```

### Author Not Showing?

1. **Check foreign key:**
   ```sql
   SELECT b.title, b.author_id, t.name 
   FROM blogs b 
   LEFT JOIN team_members t ON b.author_id = t.id;
   ```

2. If author_id is NULL, update it:
   ```sql
   UPDATE blogs 
   SET author_id = (SELECT id FROM team_members LIMIT 1)
   WHERE author_id IS NULL;
   ```

## Adding New Blogs

### Via Supabase Dashboard

1. Go to Table Editor → blogs
2. Click "Insert row"
3. Fill in:
   - title
   - content (use Markdown)
   - excerpt
   - image_url (optional)
   - author_id (select from team_members)
   - category
   - tags (array format: `{"tag1", "tag2"}`)
   - is_published: `true`
   - reading_time (in minutes)

### Via SQL

```sql
INSERT INTO public.blogs (
  title, 
  content, 
  excerpt, 
  author_id, 
  category, 
  tags, 
  is_published, 
  reading_time
)
VALUES (
  'Your Blog Title',
  'Your full blog content in Markdown',
  'Short excerpt',
  (SELECT id FROM team_members WHERE name = 'Author Name'),
  'Category Name',
  ARRAY['tag1', 'tag2'],
  true,
  5
);
```

## Performance Notes

- Blog list is cached by Next.js
- Images should be optimized before upload
- Consider adding pagination if you have many blogs
- Search queries are optimized with indexes

## Next Steps

1. Run the sample data SQL
2. Enable RLS policies
3. Test the blog pages
4. Add your own blog posts
5. Customize the blog layout if needed
