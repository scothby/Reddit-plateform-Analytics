import { NextResponse } from 'next/server';
import { getRecentPosts } from '@/lib/reddit';
import { analyzePostContent } from '@/lib/openai';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subreddit = searchParams.get('subreddit');

    if (!subreddit) {
      return NextResponse.json(
        { error: 'Subreddit name is required' },
        { status: 400 }
      );
    }

    try {
      // Étape 1: Récupérer les posts Reddit
      console.log('1. Fetching Reddit posts for:', subreddit);
      const posts = await getRecentPosts(subreddit);
      
      if (!posts || posts.length === 0) {
        return NextResponse.json(
          { error: 'No posts found' },
          { status: 404 }
        );
      }
      
      console.log(`Retrieved ${posts.length} posts from Reddit`);

      // Étape 2: Analyser les posts
      console.log('2. Analyzing posts...');
      const analyzedPosts = await Promise.all(
        posts.map(async (post) => {
          try {
            const analysis = await analyzePostContent(post.title, post.content);
            return { ...post, analysis };
          } catch (error) {
            console.error('Failed to analyze post:', post.title, error);
            return post;
          }
        })
      );

      // Retourner les posts même si la sauvegarde échoue
      try {
        // Étape 3: Sauvegarder dans Supabase
        await saveToSupabase(subreddit, analyzedPosts);
      } catch (error) {
        console.error('Failed to save to Supabase:', error);
        // Continue même si la sauvegarde échoue
      }

      return NextResponse.json(analyzedPosts);
    } catch (error) {
      console.error('Error processing request:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to process request' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function saveToSupabase(subreddit: string, analyzedPosts: RedditPost[]) {
  // Code de sauvegarde Supabase existant...
} 