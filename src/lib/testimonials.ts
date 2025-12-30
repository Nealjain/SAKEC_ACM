import { supabase } from './supabase'
import type { Testimonial } from './types'

// Get all active testimonials ordered by display_order
export async function getTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching testimonials:', error)
    return []
  }
  return data || []
}

// Get testimonial by ID
export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching testimonial:', error)
    return null
  }
  return data
}

// Add new testimonial (for admin use)
export async function addTestimonial(testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('testimonials')
    .insert([testimonial])

  if (error) {
    console.error('Error adding testimonial:', error)
    return { success: false, error: error.message }
  }
  return { success: true }
}

// Update testimonial (for admin use)
export async function updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('testimonials')
    .update(updates)
    .eq('id', id)

  if (error) {
    console.error('Error updating testimonial:', error)
    return { success: false, error: error.message }
  }
  return { success: true }
}

// Delete testimonial (for admin use)
export async function deleteTestimonial(id: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting testimonial:', error)
    return { success: false, error: error.message }
  }
  return { success: true }
}
