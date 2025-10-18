import { supabase } from "@/lib/supabase/client"

export interface AlumniMember {
  id: string
  name: string
  position: string
  bio: string
  image_url: string
  linkedin_url?: string
  github_url?: string
  twitter_url?: string
  email?: string
  graduation_year: string
  department: string
  achievements?: string[]
  skills?: string[]
  current_company?: string
  current_role?: string
  display_order: number
  created_at: string
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