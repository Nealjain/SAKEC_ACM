"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Plus, Upload } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface BlogImage {
  id?: string
  image_url: string
  caption?: string
  display_order: number
}

interface BlogImageUploaderProps {
  blogId?: string
  initialImages?: BlogImage[]
  onImagesChange?: (images: BlogImage[]) => void
}

export default function BlogImageUploader({ 
  blogId, 
  initialImages = [],
  onImagesChange 
}: BlogImageUploaderProps) {
  const [images, setImages] = useState<BlogImage[]>(initialImages)
  const [uploading, setUploading] = useState(false)

  const addImageUrl = () => {
    const newImage: BlogImage = {
      image_url: "",
      caption: "",
      display_order: images.length
    }
    const updatedImages = [...images, newImage]
    setImages(updatedImages)
    onImagesChange?.(updatedImages)
  }

  const updateImage = (index: number, field: keyof BlogImage, value: string | number) => {
    const updatedImages = images.map((img, i) => 
      i === index ? { ...img, [field]: value } : img
    )
    setImages(updatedImages)
    onImagesChange?.(updatedImages)
  }

  const removeImage = async (index: number) => {
    const imageToRemove = images[index]
    
    // If image has an ID, delete from database
    if (imageToRemove.id && blogId) {
      const supabase = createClient()
      await supabase
        .from('blog_images')
        .delete()
        .eq('id', imageToRemove.id)
    }

    const updatedImages = images.filter((_, i) => i !== index)
      .map((img, i) => ({ ...img, display_order: i }))
    setImages(updatedImages)
    onImagesChange?.(updatedImages)
  }

  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === images.length - 1)
    ) {
      return
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1
    const updatedImages = [...images]
    const temp = updatedImages[index]
    updatedImages[index] = updatedImages[newIndex]
    updatedImages[newIndex] = temp

    // Update display_order
    updatedImages.forEach((img, i) => {
      img.display_order = i
    })

    setImages(updatedImages)
    onImagesChange?.(updatedImages)
  }

  const handleFileUpload = async (index: number, file: File) => {
    if (!file) return

    setUploading(true)
    try {
      const supabase = createClient()
      
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `blog-images/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('event-photos')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data } = supabase.storage
        .from('event-photos')
        .getPublicUrl(filePath)

      updateImage(index, 'image_url', data.publicUrl)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Blog Images</label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addImageUrl}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Image
        </Button>
      </div>

      <div className="space-y-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="p-4 border border-gray-700 rounded-lg bg-gray-900/50 space-y-3"
          >
            <div className="flex items-start gap-3">
              {/* Image Preview */}
              {image.image_url && (
                <div className="w-24 h-24 rounded overflow-hidden flex-shrink-0">
                  <img
                    src={image.image_url}
                    alt={image.caption || `Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex-1 space-y-3">
                {/* Image URL Input */}
                <div>
                  <Input
                    placeholder="Image URL"
                    value={image.image_url}
                    onChange={(e) => updateImage(index, 'image_url', e.target.value)}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>

                {/* File Upload */}
                <div className="flex gap-2">
                  <label className="flex-1">
                    <div className="flex items-center gap-2 px-3 py-2 border border-gray-700 rounded-md cursor-pointer hover:bg-gray-800 transition-colors">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">Upload Image</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(index, file)
                      }}
                      disabled={uploading}
                    />
                  </label>
                </div>

                {/* Caption */}
                <Input
                  placeholder="Caption (optional)"
                  value={image.caption || ''}
                  onChange={(e) => updateImage(index, 'caption', e.target.value)}
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              {/* Controls */}
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => moveImage(index, 'up')}
                  disabled={index === 0}
                  className="h-8 w-8 p-0"
                >
                  ↑
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => moveImage(index, 'down')}
                  disabled={index === images.length - 1}
                  className="h-8 w-8 p-0"
                >
                  ↓
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeImage(index)}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-400"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-8 text-gray-500 border border-dashed border-gray-700 rounded-lg">
          No images added yet. Click "Add Image" to get started.
        </div>
      )}
    </div>
  )
}
