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

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkBlogs() {
  console.log('Checking all blogs in database...\n')
  
  // Get all blogs (published and unpublished)
  const { data: allBlogs, error: allError } = await supabase
    .from('blogs')
    .select('id, title, is_published, author_id, created_at')
    .order('created_at', { ascending: false })
  
  if (allError) {
    console.error('Error fetching all blogs:', allError)
    return
  }
  
  console.log(`Total blogs in database: ${allBlogs?.length || 0}`)
  console.log('\nAll blogs:')
  allBlogs?.forEach(blog => {
    console.log(`- ID: ${blog.id}, Title: ${blog.title}, Published: ${blog.is_published}, Author ID: ${blog.author_id}`)
  })
  
  // Get only published blogs
  const { data: publishedBlogs, error: pubError } = await supabase
    .from('blogs')
    .select('id, title, is_published')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
  
  if (pubError) {
    console.error('Error fetching published blogs:', pubError)
    return
  }
  
  console.log(`\nPublished blogs: ${publishedBlogs?.length || 0}`)
  publishedBlogs?.forEach(blog => {
    console.log(`- ${blog.title}`)
  })
  
  // Check with author join
  const { data: blogsWithAuthor, error: joinError } = await supabase
    .from('blogs')
    .select(`
      id,
      title,
      is_published,
      author:team_members(name, position)
    `)
    .eq('is_published', true)
    .order('created_at', { ascending: false })
  
  if (joinError) {
    console.error('\nError fetching blogs with author join:', joinError)
  } else {
    console.log(`\nBlogs with author join: ${blogsWithAuthor?.length || 0}`)
    blogsWithAuthor?.forEach(blog => {
      console.log(`- ${blog.title} by ${blog.author?.name || 'Unknown'}`)
    })
  }
}

checkBlogs()
