import { supabase } from "@/lib/supabase/client"

export interface FacultyMember {
  id: string
  name: string
  position: string
  bio: string
  image_url: string
  linkedin_url?: string
  email?: string
  department: string
  achievements?: string[]
  display_order: number
  created_at: string
}

export async function getFacultyMembers(): Promise<FacultyMember[]> {
  const { data, error } = await supabase.from("faculty_members").select("*").order("display_order", { ascending: true })

  if (error) {
    return []
  }

  return data || []
}

export async function getFacultyMemberById(id: string): Promise<FacultyMember | null> {
  const { data, error } = await supabase.from("faculty_members").select("*").eq("id", id).single()

  if (error) {
    return null
  }

  return data
}