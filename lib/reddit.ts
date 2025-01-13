import snoowrap from 'snoowrap';
import { ThemeAnalysis } from './openai';
import { analyzePostContent } from './openai';
import { supabase } from './supabase';

export interface RedditPost {
  title: string;
  content: string;
  score: number;
  numComments: number;
  createdAt: string;
  url: string;
  analysis?: ThemeAnalysis;
}

function getRedditClient() {
  const userAgent = process.env.NEXT_PUBLIC_REDDIT_USER_AGENT;
  const clientId = process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_REDDIT_CLIENT_SECRET;
  const username = process.env.NEXT_PUBLIC_REDDIT_USERNAME;
  const password = process.env.NEXT_PUBLIC_REDDIT_PASSWORD;

  if (!userAgent || !clientId || !clientSecret || !username || !password) {
    throw new Error('Missing Reddit credentials');
  }

  console.log('Creating Reddit client with:', { userAgent, clientId, username }); // Debug

  return new snoowrap({
    userAgent,
    clientId,
    clientSecret,
    username,
    password,
  });
}

export async function getRecentPosts(subredditName: string): Promise<RedditPost[]> {
  try {
    console.log('Step 1: Getting Reddit client');
    const reddit = getRedditClient();

    console.log('Step 2: Getting subreddit:', subredditName);
    const subreddit = await reddit.getSubreddit(subredditName);

    console.log('Step 3: Getting top posts');
    const topPosts = await subreddit.getTop({
      time: 'day',
      limit: 10 // Commençons avec un petit nombre pour tester
    });

    console.log('Step 4: Got', topPosts.length, 'posts');

    // Convertir les posts en format attendu
    const posts = topPosts.map(post => ({
      title: post.title,
      content: post.selftext || '',
      score: Number(post.score) || 0,
      numComments: Number(post.num_comments) || 0,
      createdAt: new Date(post.created_utc * 1000).toISOString(),
      url: `https://reddit.com${post.permalink}`,
    }));

    console.log('Step 5: Processed posts:', posts.length);
    return posts;

  } catch (error) {
    console.error('Error in getRecentPosts:', error);
    throw error;
  }
} 