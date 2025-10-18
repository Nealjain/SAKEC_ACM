import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User } from "lucide-react"
import type { BlogPost } from "@/lib/blog"

interface BlogCardProps {
  post: BlogPost
}

export default function BlogCard({ post }: BlogCardProps) {
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

  return (
    <Card className="bg-gray-900/70 border-gray-800 hover:border-gray-700 transition-all duration-300 overflow-hidden group flex flex-col">
      {/* Image Section - Fixed height whether image exists or not */}
      <div className="relative h-48 overflow-hidden bg-gray-800">
        {post.image_url ? (
          <Image
            src={post.image_url}
            alt={post.title || "Blog post image"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <div className="text-center">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <span className="text-sm opacity-50">No image</span>
            </div>
          </div>
        )}
        {!post.is_published && (
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-yellow-600 text-white">
              Draft
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-6 flex flex-col flex-grow">
        {/* Metadata Section - Always present with spacing */}
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3 flex-wrap min-h-[20px]">
          {post.created_at && (
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{formatDate(post.created_at)}</span>
            </div>
          )}

          {post.reading_time && (
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{post.reading_time} min read</span>
            </div>
          )}

          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            <span>{getAuthorName()}</span>
          </div>
        </div>

        {/* Category Section - Fixed height */}
        <div className="mb-3 min-h-[28px]">
          {post.category && (
            <Badge variant="outline" className="border-gray-700 text-gray-300">
              {post.category}
            </Badge>
          )}
        </div>

        {/* Title - Always present */}
        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-gray-300 transition-colors line-clamp-2 min-h-[56px]">
          {post.title || "Untitled Post"}
        </h3>

        {/* Excerpt - Fixed height */}
        <p className="text-gray-400 mb-4 line-clamp-3 min-h-[72px]">
          {post.excerpt || "No description available."}
        </p>

        {/* Tags Section - Fixed height */}
        <div className="flex flex-wrap gap-2 mb-4 min-h-[32px]">
          {post.tags && post.tags.length > 0 ? (
            <>
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs bg-gray-800 text-gray-300">
                  #{tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs bg-gray-800 text-gray-300">
                  +{post.tags.length - 3} more
                </Badge>
              )}
            </>
          ) : null}
        </div>

        {/* Read More Link - Always at bottom */}
        <div className="flex justify-between items-center mt-auto">
          <Link
            href={`/blog/${post.id}`}
            prefetch={false}
            className="inline-flex items-center text-white hover:text-gray-300 transition-colors font-medium"
          >
            Read More →
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
