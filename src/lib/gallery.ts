import { supabase } from "@/lib/supabase/client"

export interface EventGallery {
  id: string
  event_name: string
  description: string | null
  event_date: string
  image_1: string
  image_2: string
  image_3: string
  image_4: string
  is_featured: boolean
  created_at: string
}

export async function getEventGalleries(): Promise<EventGallery[]> {
  const { data, error } = await supabase.from("event_galleries").select("*").order("event_date", { ascending: false })

  if (error) {
    return []
  }

  return data || []
}

export async function searchEventGalleries(searchTerm: string): Promise<EventGallery[]> {
  if (!searchTerm.trim()) {
    return getEventGalleries()
  }

  const { data, error } = await supabase
    .from("event_galleries")
    .select("*")
    .ilike("event_name", `%${searchTerm}%`)
    .order("event_date", { ascending: false })

  if (error) {
    return []
  }

  return data || []
}

export async function getFeaturedEventGalleries(): Promise<EventGallery[]> {
  const { data, error } = await supabase
    .from("event_galleries")
    .select("*")
    .eq("is_featured", true)
    .order("event_date", { ascending: false })

  if (error) {
    return []
  }

  return data || []
}

export interface GalleryItem {
  id: string
  title: string
  description: string
  image_url: string
  category: string
  event_date: string
}
