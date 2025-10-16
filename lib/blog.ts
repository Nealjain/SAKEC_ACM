import { staticBlogPosts } from "@/lib/static-data"

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
  // Use static data for static export
  return staticBlogPosts
    .filter(post => post.is_published)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  // Use static data for static export
  return staticBlogPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  // Use static data for static export
  const post = staticBlogPosts.find(p => p.id === id)
  return post || null
}

export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  // Use static data for static export
  return staticBlogPosts
    .filter(post => post.category === category && post.is_published)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export async function getBlogCategories(): Promise<string[]> {
  // Use static data for static export
  const categories = Array.from(new Set(
    staticBlogPosts
      .filter(post => post.is_published && post.category)
      .map(post => post.category!)
  ))
  return categories.sort()
}

export async function searchBlogPosts(query: string): Promise<BlogPost[]> {
  // Use static data for static export
  const lowerQuery = query.toLowerCase()
  return staticBlogPosts
    .filter(post => 
      post.is_published && (
        post.title.toLowerCase().includes(lowerQuery) ||
        post.excerpt.toLowerCase().includes(lowerQuery) ||
        post.content.toLowerCase().includes(lowerQuery)
      )
    )
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export async function createBlogPost(
  post: Omit<BlogPost, "id" | "created_at" | "updated_at">,
): Promise<BlogPost | null> {
  // For static export, these functions are not supported
  console.warn("createBlogPost is not supported in static export mode")
  return null
}

export async function updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
  // For static export, these functions are not supported
  console.warn("updateBlogPost is not supported in static export mode")
  return null
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  // For static export, these functions are not supported
  console.warn("deleteBlogPost is not supported in static export mode")
  return false
}
