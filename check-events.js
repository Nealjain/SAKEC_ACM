require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Configuration from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Key not found in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkEvents() {
  console.log('Checking events table...');
  
  const { data, error } = await supabase.from('events').select('*');
  
  if (error) {
    console.error('Error fetching events:', error);
    return;
  }
  
  console.log(`Found ${data.length} events:`);
  data.forEach((event, index) => {
    console.log(`${index + 1}. ${event.title}`);
    console.log(`   Date: ${event.date}`);
    console.log(`   Location: ${event.location}`);
    console.log(`   Description: ${event.description ? event.description.substring(0, 50) + '...' : 'No description'}`);
    console.log('');
  });
}

checkEvents();