import { supabase } from "@/lib/supabase/client"

export interface RegistrationForm {
  id: string
  event_id: string
  form_title: string
  form_description?: string
  is_active: boolean
  max_registrations?: number
  registration_deadline?: string
  created_at: string
  updated_at: string
}

export interface RegistrationStats {
  total_registrations: number
  confirmed: number
  pending: number
}

/**
 * Get registration form for an event
 */
export async function getEventRegistrationForm(eventId: string): Promise<RegistrationForm | null> {
  const { data, error } = await supabase
    .from("event_registration_forms")
    .select("*")
    .eq("event_id", eventId)
    .eq("is_active", true)
    .maybeSingle()

  if (error) {
    console.error('Error fetching registration form:', error)
    return null
  }

  return data
}

/**
 * Get registration statistics for a form
 */
export async function getRegistrationStats(formId: string): Promise<RegistrationStats> {
  const { data, error } = await supabase
    .from("event_registrations")
    .select("status, confirmation_sent")
    .eq("form_id", formId)

  if (error || !data) {
    return {
      total_registrations: 0,
      confirmed: 0,
      pending: 0
    }
  }

  return {
    total_registrations: data.length,
    confirmed: data.filter(r => r.status === 'confirmed').length,
    pending: data.filter(r => !r.confirmation_sent).length
  }
}

/**
 * Check if registration is still open
 */
export function isRegistrationOpen(form: RegistrationForm, currentRegistrations?: number): boolean {
  if (!form.is_active) return false
  
  // Check deadline
  if (form.registration_deadline) {
    const deadline = new Date(form.registration_deadline)
    if (deadline < new Date()) return false
  }
  
  // Check max registrations
  if (form.max_registrations && currentRegistrations) {
    if (currentRegistrations >= form.max_registrations) return false
  }
  
  return true
}

/**
 * Generate registration URL
 */
export function getRegistrationUrl(formId: string): string {
  return `/event-register/${formId}`
}
