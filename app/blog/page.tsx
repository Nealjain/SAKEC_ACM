"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"
import Link from "next/link"
import BlogCard from "@/components/blog-card"
import type { BlogPost } from "@/lib/blog"
import { createClient } from "@/lib/supabase/client"

function BlogContent() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const supabase = createClient()
        
        // Fetch blog posts
        const { data: blogPosts, error: postsError } = await supabase
          .from('blogs')
          .select(`
            *,
            author:team_members(name, position)
          `)
          .eq('is_published', true)
          .order('created_at', { ascending: false })

        if (postsError) {
          setPosts([])
        } else {
          setPosts(blogPosts || [])
        }

        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('blogs')
          .select('category')
          .eq('is_published', true)
          .not('category', 'is', null)

        if (categoriesError) {
          setCategories(["All"])
        } else {
          const uniqueCategories = Array.from(new Set(categoriesData.map(item => item.category).filter(Boolean)))
          setCategories(["All", ...uniqueCategories.sort()])
        }
      } catch (error) {
        // Error loading blog data
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleCategoryChange = async (category: string) => {
    setSelectedCategory(category)
    setSearchQuery("")
    setLoading(true)

    try {
      const supabase = createClient()
      
      if (category === "All") {
        const { data, error } = await supabase
          .from('blogs')
          .select(`
            *,
            author:team_members(name, position)
          `)
          .eq('is_published', true)
          .order('created_at', { ascending: false })

        if (error) {
          setPosts([])
        } else {
          setPosts(data || [])
        }
      } else {
        const { data, error } = await supabase
          .from('blogs')
          .select(`
            *,
            author:team_members(name, position)
          `)
          .eq('category', category)
          .eq('is_published', true)
          .order('created_at', { ascending: false })

        if (error) {
          setPosts([])
        } else {
          setPosts(data || [])
        }
      }
    } catch (error) {
      // Error filtering blog posts
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setLoading(true)
    setSelectedCategory("All")

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('blogs')
        .select(`
          *,
          author:team_members(name, position)
        `)
        .eq('is_published', true)
        .or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
        .order('created_at', { ascending: false })

      if (error) {
        setPosts([])
      } else {
        setPosts(data || [])
      }
    } catch (error) {
      // Error searching blog posts
    } finally {
      setLoading(false)
    }
  }

  const clearSearch = async () => {
    setSearchQuery("")
    setSelectedCategory("All")
    setLoading(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('blogs')
        .select(`
          *,
          author:team_members(name, position)
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false })

      if (error) {
        setPosts([])
      } else {
        setPosts(data || [])
      }
    } catch (error) {
      // Error loading blog posts
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <BlogSkeleton />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog</h1>
      </div>
      
      {/* Search Bar */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-4 max-w-md mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search blog posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-900 border-gray-800 text-white"
            />
          </div>
          <Button type="submit" className="bg-white text-black hover:bg-gray-200">
            Search
          </Button>
          {searchQuery && (
            <Button
              type="button"
              variant="outline"
              onClick={clearSearch}
              className="border-gray-700 text-white bg-transparent"
            >
              Clear
            </Button>
          )}
        </form>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange(category)}
              className={
                selectedCategory === category
                  ? "bg-white text-black hover:bg-gray-200"
                  : "border-gray-700 text-white hover:bg-gray-800 bg-transparent"
              }
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="mb-6 text-center">
          <p className="text-gray-400">
            {posts.length} result{posts.length !== 1 ? "s" : ""} for "{searchQuery}"
          </p>
        </div>
      )}

      {/* Blog Posts Grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-12 text-center">
            <p className="text-gray-400 text-lg">
              {searchQuery ? "No blog posts found matching your search." : "No blog posts available."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function BlogSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 pb-20">
      {/* Search Bar Skeleton */}
      <div className="mb-8 flex gap-4 max-w-md mx-auto">
        <div className="flex-1 h-10 bg-gray-800 rounded animate-pulse" />
        <div className="w-20 h-10 bg-gray-800 rounded animate-pulse" />
      </div>

      {/* Category Filter Skeleton */}
      <div className="mb-8 flex flex-wrap gap-2 justify-center">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-8 w-20 bg-gray-800 rounded animate-pulse" />
        ))}
      </div>

      {/* Blog Posts Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-gray-900 border-gray-800">
            <div className="h-48 bg-gray-800 animate-pulse" />
            <CardContent className="p-6">
              <div className="flex gap-4 mb-3">
                <div className="h-4 w-20 bg-gray-800 rounded animate-pulse" />
                <div className="h-4 w-16 bg-gray-800 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-800 rounded animate-pulse" />
              </div>
              <div className="h-4 w-20 bg-gray-800 rounded animate-pulse mb-3" />
              <div className="h-6 bg-gray-800 rounded animate-pulse mb-3" />
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-800 rounded animate-pulse" />
                <div className="h-4 bg-gray-800 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-800 rounded animate-pulse" />
              </div>
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-gray-800 rounded animate-pulse" />
                <div className="h-6 w-20 bg-gray-800 rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function BlogPage() {
  return (
    <div className="text-white min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Blog</h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            Insights, tutorials, and thoughts from our ACM chapter members
          </p>
        </div>
      </section>

      <Suspense fallback={<BlogSkeleton />}>
        <BlogContent />
      </Suspense>
    </div>
  )
}
