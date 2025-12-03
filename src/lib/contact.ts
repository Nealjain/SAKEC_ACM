import { supabase } from "@/lib/supabase/client"

export async function submitContactForm(formData: {
    name: string
    email: string
    subject: string
    message: string
}): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
        .from('contact_messages')
        .insert([formData])

    if (error) {
        console.error('Error submitting contact form:', error)
        return { success: false, error: error.message }
    }
    return { success: true }
}
