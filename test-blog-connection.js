// Test Supabase blog connection
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dhxzkzdlsszwuqjkicnv.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoeHpremRsc3N6d3VxamtpY252Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNTYyNjksImV4cCI6MjA3MDgzMjI2OX0.ofq619iAaQPW33zm_6uG6-r9UDg6tU7EF8krqZWlLOs'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testBlogConnection() {
  console.log('🔍 Testing Supabase blog connection...\n')
  
  try {
    // Test 1: Check if blogs table exists and fetch data
    console.log('1️⃣ Fetching blogs from Supabase...')
    const { data: blogs, error: blogsError } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (blogsError) {
      console.error('❌ Error fetching blogs:', blogsError.message)
      console.log('\n💡 This might mean:')
      console.log('   - The blogs table doesn\'t exist yet')
      console.log('   - RLS policies are blocking access')
      console.log('   - The table name is different\n')
    } else {
      console.log(`✅ Successfully fetched ${blogs.length} blog(s)`)
      if (blogs.length > 0) {
        console.log('\n📝 Blog posts found:')
        blogs.forEach((blog, index) => {
          console.log(`   ${index + 1}. ${blog.title} (${blog.category || 'No category'})`)
          console.log(`      Published: ${blog.is_published ? 'Yes' : 'No'}`)
        })
      } else {
        console.log('⚠️  No blog posts found in the database')
        console.log('💡 You need to insert blog data using the SQL script')
      }
    }
    
    // Test 2: Check published blogs
    console.log('\n2️⃣ Fetching published blogs...')
    const { data: publishedBlogs, error: publishedError } = await supabase
      .from('blogs')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
    
    if (publishedError) {
      console.error('❌ Error fetching published blogs:', publishedError.message)
    } else {
      console.log(`✅ Found ${publishedBlogs.length} published blog(s)`)
    }
    
    // Test 3: Check blog categories
    console.log('\n3️⃣ Fetching blog categories...')
    const { data: categories, error: categoriesError } = await supabase
      .from('blogs')
      .select('category')
      .eq('is_published', true)
      .not('category', 'is', null)
    
    if (categoriesError) {
      console.error('❌ Error fetching categories:', categoriesError.message)
    } else {
      const uniqueCategories = [...new Set(categories.map(c => c.category))]
      console.log(`✅ Found ${uniqueCategories.length} unique categories:`, uniqueCategories)
    }
    
    // Test 4: Check team_members table (for author info)
    console.log('\n4️⃣ Checking team_members table...')
    const { data: teamMembers, error: teamError } = await supabase
      .from('team_members')
      .select('id, name, position')
      .limit(5)
    
    if (teamError) {
      console.error('❌ Error fetching team members:', teamError.message)
    } else {
      console.log(`✅ Found ${teamMembers.length} team member(s)`)
      if (teamMembers.length > 0) {
        console.log('   Sample team members:')
        teamMembers.forEach(member => {
          console.log(`   - ${member.name} (${member.position})`)
        })
      }
    }
    
    console.log('\n' + '='.repeat(60))
    console.log('📊 SUMMARY')
    console.log('='.repeat(60))
    
    if (blogsError) {
      console.log('❌ Blogs table: NOT ACCESSIBLE')
      console.log('\n🔧 NEXT STEPS:')
      console.log('1. Go to Supabase Dashboard → SQL Editor')
      console.log('2. Run the table creation SQL (if not created)')
      console.log('3. Run scripts/insert-sample-blogs.sql to add blog data')
      console.log('4. Check RLS policies (see FIX-RLS-POLICIES.sql)')
    } else if (blogs.length === 0) {
      console.log('⚠️  Blogs table exists but is EMPTY')
      console.log('\n🔧 NEXT STEPS:')
      console.log('1. Go to Supabase Dashboard → SQL Editor')
      console.log('2. Run scripts/insert-sample-blogs.sql to add blog data')
      console.log('3. Refresh your blog page')
    } else {
      console.log('✅ Everything looks good!')
      console.log(`   - ${blogs.length} total blogs`)
      console.log(`   - ${publishedBlogs?.length || 0} published blogs`)
      console.log('\n🎉 Your blog should now display Supabase data!')
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

testBlogConnection()
