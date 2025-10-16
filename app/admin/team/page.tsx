"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"
import ProfileCard from "@/components/profile-card"
import { createClient } from "@/lib/supabase/client"
import type { TeamMember } from "@/lib/team"

export default function AdminTeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    image_url: "",
    linkedin_url: "",
    github_url: "",
    email: "",
    year: "",
    department: "",
    personal_quote: "",
    about_us: "",
    PRN: "",
    display_order: 0
  })

  const supabase = createClient()

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("display_order", { ascending: true })

      if (error) throw error
      setTeamMembers(data || [])
    } catch (error) {
      console.error("Error fetching team members:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (isEditing) {
        // Update existing member
        const { error } = await supabase
          .from("team_members")
          .update(formData)
          .eq("id", isEditing)

        if (error) throw error
      } else {
        // Add new member
        const { error } = await supabase
          .from("team_members")
          .insert([formData])

        if (error) throw error
      }

      // Reset form and refresh data
      resetForm()
      fetchTeamMembers()
    } catch (error) {
      console.error("Error saving team member:", error)
    }
  }

  const handleEdit = (member: TeamMember) => {
    setIsEditing(member.id)
    setFormData({
      name: member.name,
      position: member.position,
      image_url: member.image_url || "",
      linkedin_url: member.linkedin_url || "",
      github_url: member.github_url || "",
      email: member.email || "",
      year: member.year || "",
      department: member.department || "",
      personal_quote: member.personal_quote || "",
      about_us: member.about_us || "",
      PRN: member.PRN || "",
      display_order: member.display_order
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return

    try {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", id)

      if (error) throw error
      fetchTeamMembers()
    } catch (error) {
      console.error("Error deleting team member:", error)
    }
  }

  const resetForm = () => {
    setIsEditing(null)
    setIsAdding(false)
    setFormData({
      name: "",
      position: "",
      image_url: "",
      linkedin_url: "",
      github_url: "",
      email: "",
      year: "",
      department: "",
      personal_quote: "",
      about_us: "",
      PRN: "",
      display_order: 0
    })
  }

  if (isLoading) {
    return (
      <div className="bg-black text-white min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black text-white min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Team Members Admin</h1>
          <Button onClick={() => setIsAdding(true)} className="bg-white text-black hover:bg-gray-200">
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>
        <div className="mb-12"></div>

        {/* Add/Edit Form */}
        {(isAdding || isEditing) && (
          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardHeader>
              <CardTitle>{isEditing ? "Edit Team Member" : "Add New Team Member"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="position">Position *</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="personal_quote">Personal Quote</Label>
                  <Textarea
                    id="personal_quote"
                    value={formData.personal_quote}
                    onChange={(e) => setFormData({ ...formData, personal_quote: e.target.value })}
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="about_us">About Us</Label>
                  <Textarea
                    id="about_us"
                    value={formData.about_us}
                    onChange={(e) => setFormData({ ...formData, about_us: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="PRN">PRN</Label>
                    <Input
                      id="PRN"
                      value={formData.PRN}
                      onChange={(e) => setFormData({ ...formData, PRN: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                    <Input
                      id="linkedin_url"
                      value={formData.linkedin_url}
                      onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="github_url">GitHub URL</Label>
                    <Input
                      id="github_url"
                      value={formData.github_url}
                      onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="display_order">Display Order</Label>
                    <Input
                      id="display_order"
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="bg-white text-black hover:bg-gray-200">
                    <Save className="w-4 h-4 mr-2" />
                    {isEditing ? "Update" : "Add"} Member
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Team Members List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <ProfileCard
              key={member.id}
              avatarUrl={member.image_url || "/placeholder-user.jpg"}
              miniAvatarUrl={member.image_url || "/placeholder-user.jpg"}
              name={member.name}
              title={member.position}
              handle={member.linkedin_url ? member.linkedin_url.split("/").pop() : member.name}
              status={member.year ? `${member.year} • ${member.department}` : "Online"}
              contactText="Contact Me"
              showUserInfo={true}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
