"use client";

import { useState } from "react";
import { DEFAULT_SUBREDDITS } from "@/lib/constants";
import { SubredditGrid } from "@/components/subreddit/SubredditGrid";
import { AddSubredditModal } from "@/components/subreddit/AddSubredditModal";
import { Subreddit } from "@/types";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { PlusCircle, BarChart2 } from 'lucide-react';

export default function Home() {
  const [subreddits, setSubreddits] = useState<Subreddit[]>(DEFAULT_SUBREDDITS);

  const handleAddSubreddit = (newSubreddit: Pick<Subreddit, "name" | "url">) => {
    setSubreddits((prev) => [
      ...prev,
      {
        ...newSubreddit,
        description: `Community for ${newSubreddit.name}`,
        memberCount: 0,
      },
    ]);
  };

  return (
    <>
      <main className="min-h-screen bg-gray-900 text-gray-100">
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <BarChart2 className="w-12 h-12 text-purple-500 mr-4" />
              <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Reddit Analytics
              </h1>
            </div>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Track and analyze your favorite subreddits with powerful insights and real-time data
            </p>
          </div>
          
          <div className="flex justify-end mb-12">
            <AddSubredditModal onAddSubreddit={handleAddSubreddit}>
              <Button size="lg" className="group bg-purple-600 hover:bg-purple-700 text-white">
                <PlusCircle className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                Add Subreddit
              </Button>
            </AddSubredditModal>
          </div>
          
          <SubredditGrid subreddits={subreddits} />
        </div>
      </main>
      <Toaster />
    </>
  );
}

