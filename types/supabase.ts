export interface Database {
  public: {
    Tables: {
      subreddits: {
        Row: {
          id: number;
          name: string;
          last_fetched_at: string;
          created_at?: string;
        };
        Insert: {
          id?: number;
          name: string;
          last_fetched_at: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          last_fetched_at?: string;
          created_at?: string;
        };
      };
      posts: {
        Row: {
          id: number;
          subreddit_id: number;
          title: string;
          content: string;
          score: number;
          num_comments: number;
          created_utc: string;
          url: string;
          created_at?: string;
        };
        Insert: {
          id?: number;
          subreddit_id: number;
          title: string;
          content: string;
          score: number;
          num_comments: number;
          created_utc: string;
          url: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          subreddit_id?: number;
          title?: string;
          content?: string;
          score?: number;
          num_comments?: number;
          created_utc?: string;
          url?: string;
          created_at?: string;
        };
      };
      analyses: {
        Row: {
          id: number;
          post_id: number;
          category: string;
          confidence: number;
          reason: string;
          created_at?: string;
        };
        Insert: {
          id?: number;
          post_id: number;
          category: string;
          confidence: number;
          reason: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          post_id?: number;
          category?: string;
          confidence?: number;
          reason?: string;
          created_at?: string;
        };
      };
    };
  };
} 