"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeAnalysis } from "@/lib/openai"
import { RedditPost } from "@/lib/reddit"
import { CATEGORIES, CATEGORY_DESCRIPTIONS } from "@/lib/constants/categories"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCategoryStore } from "@/lib/store/categories"
import { AddCategoryModal } from "./AddCategoryModal"

interface AnalyzedPost extends RedditPost {
  analysis: ThemeAnalysis;
}

interface ThemesGridProps {
  posts: AnalyzedPost[];
}

const getCategoryColor = (category: Category) => {
  switch (category) {
    case CATEGORIES.SOLUTION_REQUESTS:
      return 'bg-blue-100 dark:bg-blue-900'
    case CATEGORIES.PAIN_AND_ANGER:
      return 'bg-red-100 dark:bg-red-900'
    case CATEGORIES.ADVICE_REQUESTS:
      return 'bg-green-100 dark:bg-green-900'
    case CATEGORIES.MONEY_TALK:
      return 'bg-yellow-100 dark:bg-yellow-900'
    default:
      return 'bg-gray-100 dark:bg-gray-900'
  }
}

export function ThemesGrid({ posts }: ThemesGridProps) {
  const { categories } = useCategoryStore()
  
  const categorizedPosts = categories.reduce((acc, category) => {
    acc[category] = posts.filter(p => p.analysis.category === category);
    return acc;
  }, {} as Record<string, AnalyzedPost[]>);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddCategoryModal />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => {
          const categoryPosts = categorizedPosts[category] || [];
          
          return (
            <Sheet key={category}>
              <SheetTrigger asChild>
                <Card className={`${getCategoryColor(category)} border-none cursor-pointer hover:opacity-90 transition-opacity`}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{category}</span>
                      <Badge variant="secondary">
                        {categoryPosts.length} posts
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {CATEGORY_DESCRIPTIONS[category]}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {categoryPosts.slice(0, 3).map(post => (
                        <li key={post.url} className="hover:bg-black/5 p-2 rounded">
                          <div className="font-medium line-clamp-2">{post.title}</div>
                          <div className="text-sm text-muted-foreground">
                            Confidence: {Math.round(post.analysis.confidence * 100)}%
                          </div>
                        </li>
                      ))}
                      {categoryPosts.length > 3 && (
                        <li className="text-sm text-muted-foreground text-center">
                          + {categoryPosts.length - 3} more posts
                        </li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </SheetTrigger>
              <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle className="flex justify-between items-center">
                    {category}
                    <Badge variant="secondary">
                      {categoryPosts.length} posts
                    </Badge>
                  </SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
                  <div className="space-y-6 pr-6">
                    {categoryPosts.map(post => (
                      <div key={post.url} className="space-y-2">
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium hover:underline block"
                        >
                          {post.title}
                        </a>
                        <p className="text-sm text-muted-foreground">
                          {post.content.slice(0, 200)}
                          {post.content.length > 200 && '...'}
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant="outline">
                            {Math.round(post.analysis.confidence * 100)}% confidence
                          </Badge>
                          <Badge variant="secondary">
                            {post.score} upvotes
                          </Badge>
                          <Badge variant="secondary">
                            {post.numComments} comments
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          );
        })}
      </div>
    </div>
  );
} 