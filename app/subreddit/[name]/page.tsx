"use client"

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { RedditPost } from '@/lib/reddit'
import { PostsTable } from '@/components/subreddit/PostsTable'
import { ThemesGrid } from '@/components/subreddit/ThemesGrid'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, AlertCircle, TrendingUp, MessageSquare } from 'lucide-react'

export default function SubredditPage() {
  const params = useParams()
  const subredditName = params.name as string
  
  const [posts, setPosts] = useState<RedditPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/reddit/posts?subreddit=${subredditName}`)
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch posts')
        }

        console.log('Fetched posts:', data)
        setPosts(data)
      } catch (error) {
        console.error('Error fetching posts:', error)
        setError(error instanceof Error ? error.message : 'Failed to load posts')
      } finally {
        setLoading(false)
      }
    }

    if (subredditName) {
      fetchPosts()
    }
  }, [subredditName])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100">
        <Loader2 className="w-12 h-12 animate-spin text-purple-500 mb-4" />
        <div className="text-xl font-semibold">Loading posts from r/{subredditName}...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <div className="text-xl font-semibold text-red-400">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          r/{subredditName}
        </h1>
        
        <Tabs defaultValue="posts" className="space-y-8">
          <TabsList className="bg-gray-800 p-1 rounded-lg">
            <TabsTrigger value="posts" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white px-4 py-2 rounded-md transition-all">
              <TrendingUp className="w-5 h-5 mr-2 inline-block" />
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="themes" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white px-4 py-2 rounded-md transition-all">
              <MessageSquare className="w-5 h-5 mr-2 inline-block" />
              Themes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <PostsTable posts={posts} />
          </TabsContent>
          
          <TabsContent value="themes" className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <ThemesGrid posts={posts} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

