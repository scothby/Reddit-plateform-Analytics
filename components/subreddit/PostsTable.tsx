"use client"

import { useState } from "react"
import { RedditPost } from "@/lib/reddit"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDistanceToNow } from "date-fns"
import { ArrowUpDown, ExternalLink } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CATEGORIES, Category } from '@/lib/constants/categories'

interface PostsTableProps {
  posts: RedditPost[]
}

export function PostsTable({ posts }: PostsTableProps) {
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return 'Invalid date'
    }
  }

  const getCategoryColor = (category: Category) => {
    switch (category) {
      case CATEGORIES.SOLUTION_REQUESTS:
        return 'bg-blue-900 text-blue-200'
      case CATEGORIES.PAIN_AND_ANGER:
        return 'bg-red-900 text-red-200'
      case CATEGORIES.ADVICE_REQUESTS:
        return 'bg-green-900 text-green-200'
      case CATEGORIES.MONEY_TALK:
        return 'bg-yellow-900 text-yellow-200'
      default:
        return 'bg-gray-700 text-gray-200'
    }
  }

  const sortedPosts = [...posts].sort((a, b) => {
    return sortOrder === 'asc' ? a.score - b.score : b.score - a.score
  })

  return (
    <div className="rounded-lg border border-gray-700 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-800 border-b border-gray-700">
            <TableHead className="w-[400px] text-gray-300">Title</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
                className="flex items-center gap-2 font-bold text-gray-300 hover:text-white hover:bg-gray-700"
              >
                Score
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-center text-gray-300">Comments</TableHead>
            <TableHead className="text-center text-gray-300">Posted</TableHead>
            <TableHead className="text-gray-300">Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPosts.map((post) => (
            <TableRow key={post.url} className="border-b border-gray-700 hover:bg-gray-800 transition-colors">
              <TableCell className="font-medium">
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-purple-400 hover:text-purple-300 flex items-center gap-2"
                >
                  {post.title}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </TableCell>
              <TableCell className="text-center font-bold text-green-400">{post.score}</TableCell>
              <TableCell className="text-center text-blue-400">{post.numComments}</TableCell>
              <TableCell className="text-center text-gray-400">
                {formatDate(post.createdAt)}
              </TableCell>
              <TableCell>
                {post.analysis && (
                  <Badge className={`${getCategoryColor(post.analysis.category)} px-2 py-1 rounded-full text-xs font-semibold`}>
                    {post.analysis.category}
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

