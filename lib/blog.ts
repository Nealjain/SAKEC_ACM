import { createClient } from "@/lib/supabase/client"

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

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('blogs')
      .select(`
        *,
        author:team_members(name, position)
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching blogs from Supabase:', error)
      return []
    }

    console.log('Fetched blogs from Supabase:', data?.length || 0)
    return data || []
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return []
  }
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('blogs')
      .select(`
        *,
        author:team_members(name, position)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching all blogs from Supabase:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching all blogs:', error)
    return []
  }
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('blogs')
      .select(`
        *,
        author:team_members(name, position)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching blog post from Supabase:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('blogs')
      .select(`
        *,
        author:team_members(name, position)
      `)
      .eq('category', category)
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching blogs by category from Supabase:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching blogs by category:', error)
    return []
  }
}

export async function getBlogCategories(): Promise<string[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('blogs')
      .select('category')
      .eq('is_published', true)
      .not('category', 'is', null)

    if (error) {
      console.error('Error fetching blog categories from Supabase:', error)
      return []
    }

    const categories = Array.from(new Set(data.map(item => item.category).filter(Boolean)))
    return categories.sort()
  } catch (error) {
    console.error('Error fetching blog categories:', error)
    return []
  }
}

export async function searchBlogPosts(query: string): Promise<BlogPost[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('blogs')
      .select(`
        *,
        author:team_members(name, position)
      `)
      .eq('is_published', true)
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error searching blogs:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error searching blogs:', error)
    return []
  }
}

export async function createBlogPost(
  post: Omit<BlogPost, "id" | "created_at" | "updated_at">,
): Promise<BlogPost | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('blogs')
      .insert([post])
      .select()
      .single()

    if (error) {
      console.error('Error creating blog post:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error creating blog post:', error)
    return null
  }
}

export async function updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('blogs')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating blog post:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error updating blog post:', error)
    return null
  }
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  try {
    const supabase = createClient()
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting blog post:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return false
  }
}
