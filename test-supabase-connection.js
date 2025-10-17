// Test Supabase Connection
// Run this with: node test-supabase-connection.js

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://dhxzkzdlsszwuqjkicnv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoeHpremRsc3N6d3VxamtpY252Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNTYyNjksImV4cCI6MjA3MDgzMjI2OX0.ofq619iAaQPW33zm_6uG6-r9UDg6tU7EF8krqZWlLOs'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('Testing Supabase connection...\n')

  // Test 1: Check if blogs table exists
  console.log('1. Checking blogs table...')
  const { data: blogs, error: blogsError } = await supabase
    .from('blogs')
    .select('*')
    .limit(5)

  if (blogsError) {
    console.error('❌ Error accessing blogs table:', blogsError.message)
    console.log('   Details:', blogsError)
  } else {
    console.log('✅ Blogs table accessible')
    console.log(`   Found ${blogs?.length || 0} blog posts`)
    if (blogs && blogs.length > 0) {
      console.log('   Sample blog:', blogs[0].title)
    }
  }

  // Test 2: Check published blogs
  console.log('\n2. Checking published blogs...')
  const { data: publishedBlogs, error: publishedError } = await supabase
    .from('blogs')
    .select('*')
    .eq('is_published', true)

  if (publishedError) {
    console.error('❌ Error fetching published blogs:', publishedError.message)
  } else {
    console.log('✅ Published blogs query successful')
    console.log(`   Found ${publishedBlogs?.length || 0} published blog posts`)
  }

  // Test 3: Check team_members table
  console.log('\n3. Checking team_members table...')
  const { data: members, error: membersError } = await supabase
    .from('team_members')
    .select('id, name, position')
    .limit(5)

  if (membersError) {
    console.error('❌ Error accessing team_members table:', membersError.message)
  } else {
    console.log('✅ Team members table accessible')
    console.log(`   Found ${members?.length || 0} team members`)
  }

  // Test 4: Check blogs with author join
  console.log('\n4. Checking blogs with author join...')
  const { data: blogsWithAuthor, error: joinError } = await supabase
    .from('blogs')
    .select(`
      *,
      author:team_members(name, position)
    `)
    .eq('is_published', true)
    .limit(5)

  if (joinError) {
    console.error('❌ Error joining blogs with authors:', joinError.message)
    console.log('   This might be due to missing foreign key or RLS policies')
  } else {
    console.log('✅ Blog-author join successful')
    console.log(`   Found ${blogsWithAuthor?.length || 0} blogs with author info`)
    if (blogsWithAuthor && blogsWithAuthor.length > 0) {
      console.log('   Sample:', {
        title: blogsWithAuthor[0].title,
        author: blogsWithAuthor[0].author
      })
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('Test complete!')
  console.log('='.repeat(50))
}

testConnection().catch(console.error)
