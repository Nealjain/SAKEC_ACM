import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export interface Event {
  id: number
  title: string
  description: string
  date: string
  time?: string
  location: string
  image_url: string
  registration_link?: string
  is_featured: boolean
  category?: string
  max_participants?: number
  current_participants: number
  created_at: string
  updated_at: string
}

const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function getEvents(): Promise<Event[]> {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order('date', { ascending: true })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching events:", error)
    return []
  }
}

export async function getEventById(id: number): Promise<Event | null> {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error("Error fetching event:", error)
    return null
  }
}

export async function getUpcomingEvents(): Promise<Event[]> {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .gte("date", new Date().toISOString())
      .order("date", { ascending: true })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching upcoming events:", error)
    return []
  }
}

export async function getPastEvents(): Promise<Event[]> {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .lt("date", new Date().toISOString())
      .order("date", { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching past events:", error)
    return []
  }
}
