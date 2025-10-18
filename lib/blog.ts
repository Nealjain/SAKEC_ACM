import { createServerClient } from "@/lib/supabase/server"

export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  author_id: string
  author?: {
    name: string
    position: string
    image_url?: string
  }
  image_url?: string // Legacy field
  image_1?: string   // Required - at least one image
  image_2?: string   // Optional
  image_3?: string   // Optional
  image_4?: string   // Optional - max 4 images
  category?: string
  tags?: string[]
  is_published: boolean
  reading_time?: number
  created_at: string
  updated_at: string
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('blogs')
      .select(`
        *,
        author:team_members(name, position, image_url)
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (error) {
      return []
    }

    return data || []
  } catch (error) {
    return []
  }
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('blogs')
      .select(`
        *,
        author:team_members(name, position, image_url)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      return []
    }

    return data || []
  } catch (error) {
    return []
  }
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('blogs')
      .select(`
        *,
        author:team_members(name, position, image_url)
      `)
      .eq('id', id)
      .single()

    if (error) {
      return null
    }

    return data
  } catch (error) {
    return null
  }
}

export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('blogs')
      .select(`
        *,
        author:team_members(name, position, image_url)
      `)
      .eq('category', category)
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (error) {
      return []
    }

    return data || []
  } catch (error) {
    return []
  }
}

export async function getBlogCategories(): Promise<string[]> {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('blogs')
      .select('category')
      .eq('is_published', true)
      .not('category', 'is', null)

    if (error) {
      return []
    }

    const categories = Array.from(new Set(data.map(item => item.category).filter(Boolean)))
    return categories.sort()
  } catch (error) {
    return []
  }
}

export async function searchBlogPosts(query: string): Promise<BlogPost[]> {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('blogs')
      .select(`
        *,
        author:team_members(name, position, image_url)
      `)
      .eq('is_published', true)
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) {
      return []
    }

    return data || []
  } catch (error) {
    return []
  }
}

export async function createBlogPost(
  post: Omit<BlogPost, "id" | "created_at" | "updated_at">,
): Promise<BlogPost | null> {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('blogs')
      .insert([post])
      .select()
      .single()

    if (error) {
      return null
    }

    return data
  } catch (error) {
    return null
  }
}

export async function updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('blogs')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return null
    }

    return data
  } catch (error) {
    return null
  }
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  try {
    const supabase = createServerClient()
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id)

    if (error) {
      return false
    }

    return true
  } catch (error) {
    return false
  }
}
