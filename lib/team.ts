import { supabase } from "@/lib/supabase/client"

export interface TeamMember {
  id: string
  name: string
  position: string
  image_url: string | null
  linkedin_url: string | null
  github_url: string | null
  email: string | null
  year: string | null
  department: string | null
  display_order: number
  created_at: string
  updated_at: string
  PRN: string | null
  personal_quote: string | null
  about_us: string | null
  skills?: string[] | null
  achievements?: string[] | null
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const { data, error } = await supabase.from("team_members").select("*").order("display_order", { ascending: true })

  if (error) {
    return []
  }

  return data || []
}

export async function getTeamMemberById(id: string): Promise<TeamMember | null> {
  const { data, error } = await supabase.from("team_members").select("*").eq("id", id).single()

  if (error) {
    return null
  }

  return data
}

export async function getTeamMembersByRole(role: string): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .ilike("position", `%${role}%`)
    .order("display_order", { ascending: true })

  if (error) {
    return []
  }

  return data || []
}

export async function getTeamMemberByPRN(prn: string): Promise<TeamMember | null> {
  const { data, error } = await supabase.from("team_members").select("*").eq("PRN", prn).single()

  if (error) {
    return null
  }

  return data
}
