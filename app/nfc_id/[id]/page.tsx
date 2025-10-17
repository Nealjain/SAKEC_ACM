import { createClient } from "@/lib/supabase/client"
import NFCProfileClient from "./client"

// Generate static params for known team members at build time
export async function generateStaticParams() {
    try {
        const supabase = createClient()
        const { data: members } = await supabase
            .from('team_members')
            .select('id')
        
        return members?.map((member) => ({
            id: member.id,
        })) || []
    } catch (error) {
        console.error('Error generating static params:', error)
        return []
    }
}

export default function NFCProfilePage({ params }: { params: { id: string } }) {
    return <NFCProfileClient params={params} />
}
