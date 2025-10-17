// Check ALL blogs including unpublished ones
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://dhxzkzdlsszwuqjkicnv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoeHpremRsc3N6d3VxamtpY252Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNTYyNjksImV4cCI6MjA3MDgzMjI2OX0.ofq619iAaQPW33zm_6uG6-r9UDg6tU7EF8krqZWlLOs'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkAllBlogs() {
  console.log('🔍 Checking ALL blogs in Supabase...\n')
  
  // Try to fetch ALL blogs (including unpublished)
  const { data: allBlogs, error: allError, count } = await supabase
    .from('blogs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
  
  console.log('📊 Total blogs in database:', count)
  
  if (allError) {
    console.error('❌ Error:', allError.message)
    console.log('\n💡 Possible issues:')
    console.log('   1. RLS policy is blocking access')
    console.log('   2. Table doesn\'t exist')
    console.log('   3. Connection issue')
    return
  }
  
  if (!allBlogs || allBlogs.length === 0) {
    console.log('⚠️  No blogs found in the database')
    console.log('\n💡 Please check:')
    console.log('   1. Did you run the INSERT SQL in Supabase SQL Editor?')
    console.log('   2. Check the "blogs" table in Supabase Table Editor')
    console.log('   3. Make sure the SQL ran without errors')
    return
  }
  
  console.log(`✅ Found ${allBlogs.length} blog(s)\n`)
  
  // Show details of each blog
  allBlogs.forEach((blog, index) => {
    console.log(`${index + 1}. ${blog.title}`)
    console.log(`   ID: ${blog.id}`)
    console.log(`   Category: ${blog.category || 'None'}`)
    console.log(`   Published: ${blog.is_published ? '✅ YES' : '❌ NO'}`)
    console.log(`   Author ID: ${blog.author_id || 'None'}`)
    console.log(`   Created: ${blog.created_at}`)
    console.log('')
  })
  
  // Check published vs unpublished
  const published = allBlogs.filter(b => b.is_published)
  const unpublished = allBlogs.filter(b => !b.is_published)
  
  console.log('📈 Summary:')
  console.log(`   Total: ${allBlogs.length}`)
  console.log(`   Published: ${published.length}`)
  console.log(`   Unpublished: ${unpublished.length}`)
  
  if (unpublished.length > 0) {
    console.log('\n⚠️  WARNING: You have unpublished blogs!')
    console.log('   These will NOT show on your website.')
    console.log('   To publish them, run this SQL in Supabase:')
    console.log('\n   UPDATE blogs SET is_published = true;')
  }
  
  if (published.length > 0) {
    console.log('\n✅ Your blog page should now show these posts!')
  }
}

checkAllBlogs()
