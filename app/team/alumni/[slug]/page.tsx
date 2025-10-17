import { getAlumniMembers } from "@/lib/alumni"
import { slugify } from "@/lib/utils"
import AlumniMemberClient from "./client"

export const dynamicParams = false

export async function generateStaticParams() {
  const members = await getAlumniMembers()
  return members.map((member) => ({
    slug: slugify(member.name),
  }))
}

export default function AlumniMemberSlugPage({ params }: { params: { slug: string } }) {
  return <AlumniMemberClient params={params} />
}