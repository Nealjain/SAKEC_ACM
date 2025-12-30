import { supabase } from "@/lib/supabase/client"

export interface AlumniMember {
  id: string
  name: string
  position: string
  bio: string | null
  image_url: string | null
  department: string
  display_order: number
  created_at: string
  updated_at: string
}

export async function getAlumniMembers(): Promise<AlumniMember[]> {
  const { data, error } = await supabase.from("alumni_members").select("*").order("display_order", { ascending: true })

  if (error) {
    return []
  }

  return data || []
}

export async function getAlumniMemberById(id: string): Promise<AlumniMember | null> {
  const { data, error } = await supabase.from("alumni_members").select("*").eq("id", id).single()

  if (error) {
    return null
  }

  return data
}

export async function getAlumniMembersByGraduationYear(year: string): Promise<AlumniMember[]> {
  const { data, error } = await supabase
    .from("alumni_members")
    .select("*")
    .eq("graduation_year", year)
    .order("display_order", { ascending: true })

  if (error) {
    return []
  }

  return data || []
}