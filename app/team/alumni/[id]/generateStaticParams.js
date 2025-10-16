import { getAlumniMembers } from "@/lib/alumni"
import { slugify } from "@/lib/utils"

export async function generateStaticParams() {
  const members = await getAlumniMembers()
  return members.map((member) => ({
    slug: slugify(member.name),
  }))
}