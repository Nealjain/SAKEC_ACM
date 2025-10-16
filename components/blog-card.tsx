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
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card className="bg-gray-900/70 border-gray-800 hover:border-gray-700 transition-all duration-300 overflow-hidden group">
      {post.image_url && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={post.image_url || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {!post.is_published && (
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-yellow-600 text-white">
                Draft
              </Badge>
            </div>
          )}
        </div>
      )}

      <CardContent className="p-6">
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{formatDate(post.created_at)}</span>
          </div>

          {post.reading_time && (
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{post.reading_time} min read</span>
            </div>
          )}

          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            <span>{typeof post.author === 'object' && post.author ? post.author.name : 'Unknown'}</span>
          </div>
        </div>

        {post.category && (
          <Badge variant="outline" className="mb-3 border-gray-700 text-gray-300">
            {post.category}
          </Badge>
        )}

        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-gray-300 transition-colors line-clamp-2">
          {post.title}
        </h3>

        <p className="text-gray-400 mb-4 line-clamp-3">{post.excerpt}</p>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
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
          </div>
        )}

        <div className="flex justify-between items-center">
          <Link
            href={`/blog/${post.id}`}
            className="inline-flex items-center text-white hover:text-gray-300 transition-colors font-medium"
          >
            Read More →
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
