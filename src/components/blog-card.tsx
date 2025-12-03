import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Share2, Bookmark } from "lucide-react"
import type { BlogPost } from "@/lib/blog"
import { useState } from "react"

interface BlogCardProps {
  post: BlogPost
}

export default function BlogCard({ post }: BlogCardProps) {
  const [saved, setSaved] = useState(false)

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return "Date unavailable"
    }
  }

  const getAuthorName = () => {
    if (typeof post.author === 'object' && post.author?.name) {
      return post.author.name
    }
    return "Anonymous"
  }

  // Get the first available image (prioritize image_1, fallback to image_url)
  const displayImage = post.image_1 || post.image_url

  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: post.excerpt || post.title,
      url: `${window.location.origin}/blog/${post.id}`
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        // Share cancelled
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareData.url)
      alert('Link copied to clipboard!')
    }
  }

  const handleSave = () => {
    setSaved(!saved)
    const savedPosts = JSON.parse(localStorage.getItem('savedBlogPosts') || '[]')

    if (!saved) {
      savedPosts.push(post.id)
      localStorage.setItem('savedBlogPosts', JSON.stringify(savedPosts))
    } else {
      const filtered = savedPosts.filter((id: string) => id !== post.id)
      localStorage.setItem('savedBlogPosts', JSON.stringify(filtered))
    }
  }

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col">
      {/* Image Section - Shows only first image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {displayImage ? (
          <img
            src={displayImage}
            alt={post.title || "Blog post image"}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <span className="text-sm opacity-50">No image</span>
            </div>
          </div>
        )}

        {/* Share and Save buttons */}
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={(e) => { e.preventDefault(); handleShare(); }}
            className="bg-white/90 hover:bg-white text-gray-700 rounded-full p-2 backdrop-blur-sm transition-all shadow-md"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); handleSave(); }}
            className={`rounded-full p-2 backdrop-blur-sm transition-all shadow-md ${saved
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-white/90 hover:bg-white text-gray-700'
              }`}
            title={saved ? "Saved" : "Save"}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {!post.is_published && (
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-yellow-500 text-white shadow-md">
              Draft
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-6 flex flex-col flex-grow">
        {/* Author Section with Profile Picture */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-100 flex-shrink-0 ring-2 ring-blue-100">
            {post.author?.image_url ? (
              <img
                src={post.author.image_url}
                alt={getAuthorName()}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{getAuthorName()}</p>
            <p className="text-xs text-gray-600 truncate">
              {post.author?.position || "ACM Member"}
            </p>
          </div>
        </div>

        {/* Metadata Section - Always present with spacing */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3 flex-wrap min-h-[20px]">
          {post.created_at && (
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1 text-blue-600" />
              <span>{formatDate(post.created_at)}</span>
            </div>
          )}

          {post.reading_time && (
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1 text-purple-600" />
              <span>{post.reading_time} min read</span>
            </div>
          )}
        </div>

        {/* Category Section - Fixed height */}
        <div className="mb-3 min-h-[28px]">
          {post.category && (
            <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50">
              {post.category}
            </Badge>
          )}
        </div>

        {/* Title - Always present */}
        <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[56px]">
          {post.title || "Untitled Post"}
        </h3>

        {/* Excerpt - Fixed height */}
        <p className="text-gray-700 mb-4 line-clamp-3 min-h-[72px]">
          {post.excerpt || "No description available."}
        </p>

        {/* Tags Section - Fixed height */}
        <div className="flex flex-wrap gap-2 mb-4 min-h-[32px]">
          {post.tags && post.tags.length > 0 ? (
            <>
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                  #{tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                  +{post.tags.length - 3} more
                </Badge>
              )}
            </>
          ) : null}
        </div>

        {/* Read More Link - Always at bottom */}
        <div className="flex justify-between items-center mt-auto">
          <Link
            to={`/blog/${post.id}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors font-medium"
          >
            Read More →
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
