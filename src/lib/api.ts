import { supabase } from './supabase'
import type { TeamMember, Event, BlogPost, GalleryItem } from './types'

// Team Members
export async function getTeamMembers(): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching team members:', error)
    return []
  }
  return data || []
}

export async function getTeamMemberById(id: string): Promise<TeamMember | null> {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching team member:', error)
    return null
  }
  return data
}

// Events
export async function getEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true })

  if (error) {
    console.error('Error fetching events:', error)
    return []
  }
  return data || []
}

export async function getUpcomingEvents(): Promise<Event[]> {
  const today = new Date().toISOString().split('T')[0]
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .gt('date', today)
    .order('date', { ascending: true })

  if (error) {
    console.error('Error fetching upcoming events:', error)
    return []
  }
  return data || []
}

export async function getPastEvents(): Promise<Event[]> {
  const today = new Date().toISOString().split('T')[0]
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .lte('date', today)
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching past events:', error)
    return []
  }
  return data || []
}

// Blog
export async function getBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blogs')
    .select(`
      *,
      author:team_members(name, position, image_url)
    `)
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
  return data || []
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blogs')
    .select(`
      *,
      author:team_members(name, position, image_url)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
  return data
}

// Gallery
export async function getGalleryItems(): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('event_date', { ascending: false })

  if (error) {
    console.error('Error fetching gallery items:', error)
    return []
  }
  return data || []
}

// Contact Form
export async function submitContactForm(formData: {
  name: string
  email: string
  message: string
}): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('contact_submissions')
    .insert([formData])

  if (error) {
    console.error('Error submitting contact form:', error)
    return { success: false, error: error.message }
  }
  return { success: true }
}
