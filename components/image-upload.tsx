"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { uploadFile, getPublicUrl, STORAGE_BUCKETS } from "@/lib/supabase/storage"
import { Upload, X } from "lucide-react"

interface ImageUploadProps {
  bucket: keyof typeof STORAGE_BUCKETS
  onUploadComplete: (url: string) => void
  currentImage?: string
  className?: string
}

export function ImageUpload({ bucket, onUploadComplete, currentImage, className = "" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      // Create unique filename
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      // Upload to Supabase Storage
      const { data, error } = await uploadFile(STORAGE_BUCKETS[bucket], fileName, file)

      if (error) {
        return
      }

      // Get public URL
      const publicUrl = getPublicUrl(STORAGE_BUCKETS[bucket], fileName)

      setPreview(publicUrl)
      onUploadComplete(publicUrl)
    } catch (error) {
      // Upload failed
    } finally {
      setUploading(false)
    }
  }

  const clearImage = () => {
    setPreview(null)
    onUploadComplete("")
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={uploading}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </div>

      {preview && (
        <div className="relative inline-block">
          <img src={preview || "/placeholder.svg"} alt="Preview" className="w-32 h-32 object-cover rounded-lg border" />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 w-6 h-6 p-0"
            onClick={clearImage}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
