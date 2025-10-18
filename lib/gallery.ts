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
  photographer?: string
  is_featured: boolean
  display_order: number
  created_at: string
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const { data, error } = await supabase.from("gallery_items").select("*").order("display_order", { ascending: true })

  if (error) {
    return []
  }

  return data || []
}

export async function getGalleryItemsByCategory(category: string): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .eq("category", category)
    .order("display_order", { ascending: true })

  if (error) {
    return []
  }

  return data || []
}

export async function getGalleryCategories(): Promise<string[]> {
  const { data, error } = await supabase.from("gallery_categories").select("category")

  if (error) {
    return ["All"]
  }

  return data?.map((category) => category.category) || ["All"]
}

export async function getGalleryItemById(id: string): Promise<GalleryItem | null> {
  const { data, error } = await supabase.from("gallery_items").select("*").eq("id", id)

  if (error) {
    return null
  }

  return data?.[0] || null
}
