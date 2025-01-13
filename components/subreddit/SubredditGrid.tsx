import { Subreddit } from "@/types";
import { SubredditCard } from "./SubredditCard";

interface SubredditGridProps {
  subreddits: Subreddit[];
}

export function SubredditGrid({ subreddits }: SubredditGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {subreddits.map((subreddit) => (
        <SubredditCard
          key={subreddit.name}
          subreddit={subreddit}
        />
      ))}
    </div>
  );
} 