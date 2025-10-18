import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Create Supabase client with service role for server-side
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Check rate limit: 3 messages per day per email
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const { data: existingMessages, error: countError } = await supabase
      .from('contact_messages')
      .select('id')
      .eq('email', email)
      .gte('created_at', today.toISOString())

    if (countError) {
      // Error checking rate limit
    }

    if (existingMessages && existingMessages.length >= 3) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded', 
          details: 'You can only send 3 messages per day. Please try again tomorrow or email us directly at acm@sakec.ac.in' 
        },
        { status: 429 }
      )
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name,
          email,
          subject,
          message,
        },
      ])
      .select()

    if (error) {
      // Supabase insert error
      return NextResponse.json(
        { 
          error: 'Failed to save message', 
          details: error.message,
          hint: error.hint,
          code: error.code
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
