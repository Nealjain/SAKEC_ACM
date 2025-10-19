import { supabase } from "@/lib/supabase/client"

export interface Event {
  id: string
  title: string
  description: string | null
  date: string
  time?: string | null
  location: string | null
  image_url: string | null
  registration_link?: string | null
  is_featured: boolean
  category?: string | null
  max_participants?: number | null
  current_participants: number
  "Faculty Co-ordinator"?: string | null
  created_at: string
  updated_at: string
}

export async function getEvents(): Promise<Event[]> {
  const { data, error } = await supabase.from("events").select("*").order("date", { ascending: true })

  if (error) {
    return []
  }

  return data || []
}

export async function getEventById(id: string): Promise<Event | null> {
  const { data, error } = await supabase.from("events").select("*").eq("id", id).single()

  if (error) {
    return null
  }

  return data
}

export async function getUpcomingEvents(): Promise<Event[]> {
  const today = new Date().toISOString().split('T')[0] // Get YYYY-MM-DD format
  
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .gt("date", today) // Use gt (greater than) instead of gte to exclude today
    .order("date", { ascending: true })

  if (error) {
    return []
  }

  return data || []
}

export async function getPastEvents(): Promise<Event[]> {
  const today = new Date().toISOString().split('T')[0] // Get YYYY-MM-DD format
  
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .lte("date", today) // Use lte (less than or equal) to include today
    .order("date", { ascending: false })

  if (error) {
    return []
  }

  return data || []
}
