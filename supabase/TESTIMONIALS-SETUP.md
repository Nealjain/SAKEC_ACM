# Testimonials Table Setup

## Overview
This document explains how to set up the testimonials table in Supabase for the SAKEC ACM website.

## Database Changes

### New Table: `testimonials`

**Purpose**: Store testimonials from team members and leaders separately from the team_members table for better organization and flexibility.

**Columns**:
- `id` (uuid, primary key): Unique identifier
- `name` (text, required): Name of the person giving the testimonial
- `position` (text, required): Their position/role (e.g., "Technical Head, SAKEC ACM")
- `quote` (text, required): The testimonial text
- `image_url` (text, required): URL to the person's photo
- `display_order` (integer, default 0): Order in which testimonials appear
- `is_active` (boolean, default true): Whether to show this testimonial
- `created_at` (timestamp): When the record was created
- `updated_at` (timestamp): When the record was last updated

## Setup Instructions

### Step 1: Run the SQL Script

1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Open the file `create-testimonials-table.sql`
4. Copy and paste the entire SQL script
5. Click "Run" to execute

This will:
- Create the `testimonials` table
- Set up Row Level Security (RLS) policies
- Create indexes for better performance
- Insert sample testimonial data

### Step 2: Verify the Table

1. Go to the Table Editor in Supabase
2. You should see a new table called `testimonials`
3. It should have 4 sample records already inserted

### Step 3: Upload Images (if needed)

If you need to add new testimonial images:
1. Go to Storage in Supabase
2. Navigate to the `team-photos` bucket (or create a `testimonials` bucket)
3. Upload the images
4. Copy the public URL
5. Use that URL in the `image_url` field

## Managing Testimonials

### Adding a New Testimonial

You can add testimonials in two ways:

**Option 1: Using Supabase Dashboard**
1. Go to Table Editor → testimonials
2. Click "Insert row"
3. Fill in the fields:
   - name: Person's full name
   - position: Their role/title
   - quote: The testimonial text
   - image_url: URL to their photo
   - display_order: Number (lower = appears first)
   - is_active: true
4. Click "Save"

**Option 2: Using SQL**
```sql
INSERT INTO public.testimonials (name, position, quote, image_url, display_order, is_active)
VALUES (
  'John Doe',
  'President, SAKEC ACM',
  'This is my testimonial about ACM...',
  'https://your-image-url.com/photo.jpg',
  5,
  true
);
```

### Updating a Testimonial

1. Go to Table Editor → testimonials
2. Find the row you want to edit
3. Click on the cell to edit
4. Make your changes
5. Changes are saved automatically

### Hiding a Testimonial

Instead of deleting, you can hide a testimonial:
1. Find the testimonial in the Table Editor
2. Set `is_active` to `false`
3. It will no longer appear on the website

### Reordering Testimonials

Change the `display_order` value:
- Lower numbers appear first
- Example: 1, 2, 3, 4...

## Code Changes Made

### New Files Created:
1. `src/lib/testimonials.ts` - API functions to fetch testimonials
2. `src/lib/types.ts` - Added `Testimonial` interface
3. `supabase/create-testimonials-table.sql` - SQL script to create the table

### Files Modified:
1. `src/components/animated-testimonials-demo.tsx` - Now fetches from testimonials table
2. `src/lib/types.ts` - Added Testimonial type

## Benefits of Separate Table

1. **Flexibility**: Can add testimonials from anyone, not just current team members
2. **Control**: Easy to show/hide testimonials without affecting team member data
3. **Organization**: Keeps testimonial-specific data separate
4. **Performance**: Faster queries as we don't need to filter team members
5. **History**: Can keep testimonials from alumni even after they leave the team

## Security

The table has Row Level Security (RLS) enabled:
- **Public**: Can read all active testimonials
- **Authenticated users**: Can add, update, and delete testimonials (for admin panel)

## Troubleshooting

**Issue**: Testimonials not showing on website
- Check if `is_active` is set to `true`
- Verify the image URLs are accessible
- Check browser console for errors

**Issue**: Can't add testimonials
- Verify RLS policies are set up correctly
- Check if you're authenticated (for admin operations)

**Issue**: Images not loading
- Verify the image URLs are correct and publicly accessible
- Check if the storage bucket has public access enabled
