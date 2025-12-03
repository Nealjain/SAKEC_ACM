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
  PRN: string | null
  personal_quote: string | null
  about_us: string | null
  testimonial?: string | null
  skills?: string[] | null
  achievements?: string[] | null
  created_at: string
  updated_at: string
}

export interface FacultyMember {
  id: string
  name: string
  position: string
  bio: string | null
  image_url: string | null
  linkedin_url: string | null
  email: string | null
  department: string
  achievements: string[] | null
  display_order: number
  created_at: string
  updated_at: string
}

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

export interface Event {
  id: string
  title: string
  description: string | null
  date: string
  time: string | null
  location: string | null
  image_url: string | null
  registration_link: string | null
  is_featured: boolean
  category: string | null
  max_participants: number | null
  current_participants: number
  'Faculty Co-ordinator': string | null
  created_at: string
  updated_at: string
}

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
  image_1?: string
  image_2?: string
  image_3?: string
  image_4?: string
  category?: string
  tags?: string[]
  is_published: boolean
  reading_time?: number
  created_at: string
}

export interface GalleryItem {
  id: string
  title: string
  description: string | null
  image_url: string
  category?: string | null
  event_date?: string | null
  is_featured: boolean
}

export interface Testimonial {
  id: string
  name: string
  position: string
  quote: string
  image_url: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}
