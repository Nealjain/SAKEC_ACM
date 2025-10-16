import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  author_id: string
  author?: {
    name: string
    position: string
  }
  image_url?: string
  category?: string
  tags?: string[]
  is_published: boolean
  reading_time?: number
  created_at: string
  updated_at: string
}

const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from("blogs")
      .select(`
        *,
        author:team_members(name, position)
      `)
      .eq("is_published", true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from("blogs")
      .select(`
        *,
        author:team_members(name, position)
      `)
      .eq("id", id)
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return null
  }
}

export async function getLatestBlogPosts(limit: number = 3): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from("blogs")
      .select(`
        *,
        author:team_members(name, position)
      `)
      .eq("is_published", true)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching latest blog posts:", error)
    return []
  }
}

export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from("blogs")
      .select(`
        *,
        author:team_members(name, position)
      `)
      .eq("is_published", true)
      .eq("category", category)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching blog posts by category:", error)
    return []
  }
}
