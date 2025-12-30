import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Clock, User } from 'lucide-react'
import { getBlogPostById } from "@/lib/blog"
import type { BlogPost } from "@/lib/blog"
import { formatDate } from '../lib/utils'

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      getBlogPostById(id).then((data) => {
        setPost(data)
        setLoading(false)
      })
    }
  }, [id])

  if (loading) {
    return (
      <div className="pt-32 pb-16 min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="text-xl text-gray-900">Loading...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="pt-32 pb-16 min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">Post Not Found</h1>
          <Link to="/blog" className="text-blue-600 hover:text-blue-700 font-medium">
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  const images = [post.image_1, post.image_2, post.image_3, post.image_4].filter(Boolean)

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-20">
      {/* Article content */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button at the top of content */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>
        {/* Category badge */}
        {post.category && (
          <span className="inline-block text-sm text-blue-600 font-semibold uppercase tracking-wide mb-4 px-3 py-1 bg-blue-50 rounded-full">
            {post.category}
          </span>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Meta information */}
        <div className="flex flex-wrap items-center gap-4 md:gap-6 text-gray-600 mb-8 pb-8 border-b border-gray-200">
          {post.author && (
            <Link 
              to={`/team`}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center ring-2 ring-blue-100 group-hover:ring-blue-300 transition-all">
                {post.author.image_url ? (
                  <img
                    src={post.author.image_url}
                    alt={post.author.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={24} className="text-blue-600" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {post.author.name}
                </p>
                {post.author.position && (
                  <p className="text-sm text-gray-500">{post.author.position}</p>
                )}
              </div>
            </Link>
          )}
          <div className="flex items-center gap-4 text-sm">
            {post.reading_time && (
              <div className="flex items-center gap-1.5">
                <Clock size={16} />
                <span>{post.reading_time} min read</span>
              </div>
            )}
            <span>{formatDate(post.created_at)}</span>
          </div>
        </div>

        {/* Featured images */}
        {images.length > 0 && (
          <div className={`grid gap-4 mb-12 ${images.length === 1 ? 'grid-cols-1' : images.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${post.title} - Image ${idx + 1}`}
                className="w-full rounded-xl object-cover shadow-lg"
                style={{ maxHeight: images.length === 1 ? '500px' : '300px' }}
              />
            ))}
          </div>
        )}

        {/* Article content with clean typography */}
        <div className="prose prose-lg max-w-none">
          <div className="text-lg text-gray-800 leading-relaxed whitespace-pre-wrap font-serif">
            {post.content}
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
