import { supabase } from "@/lib/supabase/client"

export interface Event {
  id: string
  title: string
  description: string
  date: string
  time?: string // Added optional time field to match EventCard usage
  location: string
  image_url: string
  registration_link?: string // Changed from registration_url to registration_link to match EventCard
  is_featured: boolean
  category?: string
  max_participants?: number
  current_participants: number
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
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .gte("date", new Date().toISOString())
    .order("date", { ascending: true })

  if (error) {
    return []
  }

  return data || []
}

export async function getPastEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .lt("date", new Date().toISOString())
    .order("date", { ascending: false })

  if (error) {
    return []
  }

  return data || []
}
