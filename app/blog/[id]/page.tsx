import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Calendar, Clock, User } from "lucide-react"
import { getBlogPostById, getBlogPosts } from "@/lib/blog"
import BlogDetailClient from "@/components/blog-detail-client"

interface BlogPostPageProps {
  params: {
    id: string
  }
}

export async function generateStaticParams() {
  // Fetch all published blogs at build time
  const posts = await getBlogPosts()
  return posts.map((post) => ({
    id: post.id
  }))
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  // Await params as required in Next.js 15
  const { id } = await params
  
  // Fetch the specific blog post at build time
  const post = await getBlogPostById(id)

  if (!post || !post.is_published) {
    notFound()
  }

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

  const getAuthorPosition = () => {
    if (typeof post.author === 'object' && post.author?.position) {
      return post.author.position
    }
    return "ACM Chapter Member"
  }

  // Convert markdown-like content to HTML (simplified)
  const formatContent = (content: string) => {
    return content
      .split("\n")
      .map((line, index) => {
        if (line.startsWith("# ")) {
          return (
            <h1 key={index} className="text-4xl font-bold mb-6 mt-8">
              {line.substring(2)}
            </h1>
          )
        }
        if (line.startsWith("## ")) {
          return (
            <h2 key={index} className="text-3xl font-bold mb-4 mt-6">
              {line.substring(3)}
            </h2>
          )
        }
        if (line.startsWith("### ")) {
          return (
            <h3 key={index} className="text-2xl font-bold mb-3 mt-5">
              {line.substring(4)}
            </h3>
          )
        }
        if (line.startsWith("- **") && line.includes("**:")) {
          const [, boldText, rest] = line.match(/- \*\*(.*?)\*\*:(.*)/) || []
          return (
            <li key={index} className="mb-2">
              <strong className="text-white">{boldText}</strong>: {rest}
            </li>
          )
        }
        if (line.startsWith("- ")) {
          return (
            <li key={index} className="mb-1">
              {line.substring(2)}
            </li>
          )
        }
        if (line.trim() === "") {
          return <br key={index} />
        }
        if (line.startsWith("```")) {
          return null // Skip code block markers for now
        }
        return (
          <p key={index} className="mb-4 leading-relaxed">
            {line}
          </p>
        )
      })
      .filter(Boolean)
  }

  return (
    <div className="bg-black text-white min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button asChild variant="ghost" className="text-gray-400 hover:text-white">
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>

        {/* Article Header */}
        <article>
          <header className="mb-8">
            {/* Category - Leave space if missing */}
            <div className="mb-4 min-h-[28px]">
              {post.category && (
                <Badge variant="outline" className="border-gray-700 text-gray-300">
                  {post.category}
                </Badge>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {post.title || "Untitled Post"}
            </h1>

            {/* Metadata - Always show with fallbacks */}
            <div className="flex flex-wrap items-center gap-6 text-gray-300 mb-6">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                <span>{getAuthorName()}</span>
              </div>

              {post.created_at && (
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>{formatDate(post.created_at)}</span>
                </div>
              )}

              {post.reading_time && (
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{post.reading_time} min read</span>
                </div>
              )}
            </div>

            {/* Tags - Leave space if missing */}
            <div className="flex flex-wrap gap-2 mb-6 min-h-[32px]">
              {post.tags && post.tags.length > 0 && post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-gray-800 text-gray-300">
                  #{tag}
                </Badge>
              ))}
            </div>

          </header>

          {/* Client-side components: Share/Save buttons and Image Carousel */}
          <BlogDetailClient post={post} />

          {/* Article Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <div className="text-gray-300 leading-relaxed">
              {post.content ? formatContent(post.content) : (
                <p className="text-gray-500 italic">No content available.</p>
              )}
            </div>
          </div>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div>
                {post.created_at && (
                  <p className="text-gray-400 text-sm">
                    Published on {formatDate(post.created_at)}
                    {post.updated_at && post.updated_at !== post.created_at && (
                      <span> • Updated on {formatDate(post.updated_at)}</span>
                    )}
                  </p>
                )}
              </div>
            </div>
            
            {/* Author Attribution with Profile Picture */}
            <div className="mt-8">
              <p className="text-gray-400 text-sm mb-4 text-center">Written by</p>
              <Link 
                href={`/team/${post.author_id}`}
                className="flex items-center justify-center gap-4 p-6 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-purple-500/50 hover:bg-gray-900/70 transition-all group"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
                  {post.author?.image_url ? (
                    <Image
                      src={post.author.image_url}
                      alt={getAuthorName()}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors">
                      {getAuthorName()}
                    </h3>
                    <span className="text-gray-500 group-hover:text-purple-400 transition-colors">→</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{getAuthorPosition()}</p>
                </div>
              </Link>
            </div>
          </footer>
        </article>



        {/* Related Posts CTA */}
        <div className="mt-12 text-center">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Enjoyed this article?</h3>
              <p className="text-gray-400 mb-6">Check out more insights from our ACM chapter members</p>
              <Button asChild className="bg-white text-black hover:bg-gray-200">
                <Link href="/blog">Explore More Articles</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
