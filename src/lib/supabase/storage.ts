import { supabase } from "./client"

// Storage bucket names
export const STORAGE_BUCKETS = {
  TEAM: "team-photos",
  EVENTS: "event-photos",
  GALLERY: "gallery-photos",
  BLOG: "blog-photos",
} as const

// Upload file to Supabase Storage
export async function uploadFile(bucket: string, filePath: string, file: File) {
  try {
    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

// Get public URL for a file
export function getPublicUrl(bucket: string, filePath: string) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)

  return data.publicUrl
}

// Delete file from storage
export async function deleteFile(bucket: string, filePath: string) {
  try {
    const { error } = await supabase.storage.from(bucket).remove([filePath])

    return { error }
  } catch (error) {
    return { error }
  }
}

// List files in a bucket
export async function listFiles(bucket: string, folder?: string) {
  try {
    const { data, error } = await supabase.storage.from(bucket).list(folder, {
      limit: 100,
      offset: 0,
    })

    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}
