# How to Add Blogs to Supabase

## Method 1: Using Supabase Dashboard (Easiest)

1. **Go to Supabase Dashboard**
   - Visit https://supabase.com/dashboard
   - Select your project
   - Click on "Table Editor" in the left sidebar

2. **Navigate to blogs table**
   - Find and click on the `blogs` table

3. **Insert New Row**
   - Click the "Insert row" button (or "+ Insert" button)
   - Fill in the fields:

### Required Fields:
- **title**: Blog post title (text)
- **content**: Full blog content (text) - can use markdown
- **excerpt**: Short description (text)
- **is_published**: Set to `true` to make it visible
- **author_id**: UUID of team member (get from team_members table)

### Optional Fields:
- **image_url**: URL or path to featured image
- **category**: Category name (e.g., "Web Development", "AI", "Security")
- **tags**: Array of tags (e.g., `["JavaScript", "Tutorial"]`)
- **reading_time**: Estimated reading time in minutes (number)

4. **Save**
   - Click "Save" to insert the blog post

---

## Method 2: Using SQL Editor

1. **Go to SQL Editor**
   - In Supabase Dashboard, click "SQL Editor"
   - Click "New query"

2. **Run this SQL**:

```sql
-- First, get a team member ID (optional - can be NULL)
SELECT id, name FROM team_members LIMIT 5;

-- Insert a new blog post
INSERT INTO blogs (
  title,
  content,
  excerpt,
  author_id,
  image_url,
  category,
  tags,
  is_published,
  reading_time
) VALUES (
  'Your Blog Title Here',
  '# Your Blog Title

This is the full content of your blog post. You can use markdown formatting.

## Section 1
Content here...

## Section 2
More content...',
  'A short description of your blog post that will appear in the blog list.',
  'PASTE-AUTHOR-ID-HERE',  -- or NULL if no author
  '/path-to-image.png',     -- or NULL if no image
  'Web Development',         -- or NULL if no category
  ARRAY['JavaScript', 'Tutorial', 'Beginner'],  -- or NULL if no tags
  true,                      -- true to publish, false for draft
  5                          -- reading time in minutes, or NULL
);
```

---

## Method 3: Using JavaScript/Node Script

Create a file `add-blog.js`:

```javascript
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

// Read .env.local file
const envFile = fs.readFileSync('.env.local', 'utf8')
const envVars = {}
envFile.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=')
  if (key && valueParts.length) {
    envVars[key.trim()] = valueParts.join('=').trim()
  }
})

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function addBlog() {
  const { data, error } = await supabase
    .from('blogs')
    .insert([
      {
        title: 'Your Blog Title',
        content: `# Your Blog Title

Full content here with markdown formatting...

## Section 1
Content...`,
        excerpt: 'Short description of the blog post',
        author_id: null, // or 'author-uuid-here'
        image_url: '/image.png', // or null
        category: 'Web Development', // or null
        tags: ['JavaScript', 'Tutorial'], // or null
        is_published: true,
        reading_time: 5 // or null
      }
    ])
    .select()

  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Blog added successfully:', data)
  }
}

addBlog()
```

Run with: `node add-blog.js`

---

## Method 4: Bulk Insert Multiple Blogs

Create `bulk-insert-blogs.sql`:

```sql
INSERT INTO blogs (title, content, excerpt, author_id, image_url, category, tags, is_published, reading_time)
VALUES
  (
    'First Blog Post',
    '# First Blog Post\n\nContent here...',
    'Description of first post',
    NULL,
    '/image1.png',
    'Technology',
    ARRAY['Tech', 'News'],
    true,
    5
  ),
  (
    'Second Blog Post',
    '# Second Blog Post\n\nContent here...',
    'Description of second post',
    NULL,
    '/image2.png',
    'Tutorial',
    ARRAY['Guide', 'Learning'],
    true,
    8
  ),
  (
    'Third Blog Post',
    '# Third Blog Post\n\nContent here...',
    'Description of third post',
    NULL,
    NULL,
    'Events',
    ARRAY['Hackathon', 'Competition'],
    true,
    3
  );
```

Run this in Supabase SQL Editor.

---

## Getting Author IDs

To link blogs to team members:

```sql
-- View all team members and their IDs
SELECT id, name, position FROM team_members ORDER BY name;

-- Copy the ID of the author you want to use
```

---

## Tips

1. **Images**: 
   - Upload images to `/public` folder in your project
   - Reference them as `/image-name.png`
   - Or use external URLs

2. **Content Formatting**:
   - Use markdown for formatting
   - Use `\n` for line breaks in SQL
   - Headings: `# H1`, `## H2`, `### H3`
   - Lists: `- Item` or `1. Item`
   - Bold: `**text**`

3. **Tags**:
   - In SQL: `ARRAY['tag1', 'tag2', 'tag3']`
   - In Dashboard: `["tag1", "tag2", "tag3"]`
   - Can be NULL if no tags

4. **Categories**:
   - Keep consistent naming (e.g., "Web Development" not "web dev")
   - Categories appear in the filter on blog page

5. **Publishing**:
   - Set `is_published = true` to make visible
   - Set `is_published = false` for drafts

---

## Example: Complete Blog Post

```sql
INSERT INTO blogs (
  title,
  content,
  excerpt,
  author_id,
  image_url,
  category,
  tags,
  is_published,
  reading_time
) VALUES (
  'Getting Started with React Hooks',
  '# Getting Started with React Hooks

React Hooks revolutionized how we write React components. Let''s explore the basics.

## What are Hooks?

Hooks are functions that let you use state and other React features in functional components.

## useState Hook

The most basic hook for managing state:

```javascript
const [count, setCount] = useState(0)
```

## useEffect Hook

For side effects like data fetching:

```javascript
useEffect(() => {
  fetchData()
}, [])
```

## Conclusion

Hooks make React code cleaner and more reusable.',
  'Learn the fundamentals of React Hooks and how to use them in your projects.',
  (SELECT id FROM team_members WHERE name = 'Neal jain' LIMIT 1),
  '/react-hooks-tutorial.png',
  'Web Development',
  ARRAY['React', 'JavaScript', 'Tutorial', 'Hooks'],
  true,
  7
);
```

---

## Verifying Your Blogs

After adding blogs, verify they appear:

```sql
-- Check all published blogs
SELECT id, title, category, is_published, created_at 
FROM blogs 
WHERE is_published = true 
ORDER BY created_at DESC;

-- Check blog with author info
SELECT 
  b.id,
  b.title,
  b.category,
  t.name as author_name,
  t.position as author_position
FROM blogs b
LEFT JOIN team_members t ON b.author_id = t.id
WHERE b.is_published = true
ORDER BY b.created_at DESC;
```

---

## Troubleshooting

**Blog not showing up?**
- Check `is_published = true`
- Verify no errors in browser console
- Check RLS policies allow reading

**Author showing as "Anonymous"?**
- Check `author_id` is valid UUID from team_members table
- Or set `author_id = NULL` if no author

**Images not loading?**
- Verify image path is correct
- Check image exists in `/public` folder
- Or use full URL for external images
