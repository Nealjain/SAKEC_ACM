import { useEffect, useState } from 'react'
import { getBlogPosts, type BlogPost } from '@/lib/blog'
import BlogCard from '@/components/blog-card'

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getBlogPosts()
        setPosts(data)
      } catch (error) {
        console.error("Failed to fetch blog posts", error)
        setError("Failed to load blog posts. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="text-gray-900 min-h-screen pt-20 flex items-center justify-center">
        <div className="text-xl">Loading blog posts...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-gray-900 min-h-screen pt-20 flex items-center justify-center flex-col gap-4">
        <div className="text-xl text-red-500">Error: {error}</div>
        <p className="text-gray-700">Please check your connection.</p>
      </div>
    )
  }

  return (
    <div className="text-gray-900 min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">Blog</h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            Insights, tutorials, and stories from our community
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {posts.length === 0 && (
          <p className="text-gray-700 text-center py-12">
            No blog posts available yet. Check back soon!
          </p>
        )}
      </div>
    </div>
  )
}
