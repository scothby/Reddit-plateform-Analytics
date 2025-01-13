"use client";

import { Subreddit } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users, TrendingUp } from 'lucide-react';
import { useRouter } from "next/navigation";

interface SubredditCardProps {
  subreddit: Subreddit;
}

export function SubredditCard({ subreddit }: SubredditCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/subreddit/${subreddit.name}`);
  };

  return (
    <Card 
      className="bg-gray-800 text-gray-100 hover:bg-gray-700 cursor-pointer transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-purple-500"
      onClick={handleClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            r/{subreddit.name}
          </CardTitle>
          {subreddit.memberCount && (
            <div className="flex items-center text-purple-300 bg-purple-900 bg-opacity-50 rounded-full px-3 py-1">
              <Users className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">
                {new Intl.NumberFormat().format(subreddit.memberCount)}
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {subreddit.description && (
          <CardDescription className="text-gray-300 mt-2">
            {subreddit.description}
          </CardDescription>
        )}
        <div className="flex items-center mt-4 text-green-400">
          <TrendingUp className="h-5 w-5 mr-2" />
          <span className="text-sm font-medium">Trending</span>
        </div>
      </CardContent>
    </Card>
  );
}

