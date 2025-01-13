import { NextResponse } from 'next/server';
import { analyzePostContent } from '@/lib/openai';
import { RedditPost } from '@/lib/reddit';

// Fonction utilitaire pour diviser un tableau en lots
function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// Fonction pour analyser un lot de posts
async function analyzeBatch(posts: RedditPost[]) {
  const analysisPromises = posts.map(post => 
    analyzePostContent(post.title, post.content)
      .catch(error => {
        console.error(`Failed to analyze post: ${post.title}`, error);
        return null;
      })
  );
  
  return Promise.all(analysisPromises);
}

export async function POST(request: Request) {
  try {
    const posts: RedditPost[] = await request.json();
    
    // Diviser les posts en lots de 5
    const batches = chunk(posts, 5);
    const allAnalyses = [];
    
    // Traiter chaque lot séquentiellement
    for (const batch of batches) {
      const batchResults = await analyzeBatch(batch);
      allAnalyses.push(...batchResults);
    }
    
    // Filtrer les analyses nulles (en cas d'erreur) et combiner avec les posts
    const analyzedPosts = posts.map((post, index) => {
      const analysis = allAnalyses[index];
      if (!analysis) {
        throw new Error(`Analysis failed for post: ${post.title}`);
      }
      return {
        ...post,
        analysis,
      };
    });

    return NextResponse.json(analyzedPosts);
  } catch (error) {
    console.error('Error analyzing posts:', error);
    return NextResponse.json(
      { error: 'Failed to analyze posts' }, 
      { status: 500 }
    );
  }
} 