# Project Requirements Document (PRD): Reddit Analytics Platform

## Project Overview

We are building a **Reddit Analytics Platform** where users can:
- Get analytics of different subreddits
- View top content
- Categorize posts into specific themes

### Tech Stack

* **Frontend:** Next.js 14, React, Tailwind CSS, Shadcn UI components, Lucide Icons
* **Backend Services:** Node.js for server-side operations and API routes
* **Libraries:**
  * **Reddit API Client:** `snoowrap` for fetching Reddit data
  * **OpenAI API:** For analyzing post content with structured outputs

## Core Functionalities

### 1. Subreddit Management

#### 1.1 View List of Available Subreddits
* Users can see a list of available subreddits displayed as cards on the home page
* Pre-populated with common subreddits like **"ollama"** and **"openai"**
  
#### 1.2 Add New Subreddits
* Users can click an **"Add Subreddit"** button to open a modal
* The modal allows users to paste a Reddit URL and add a new subreddit
* After adding, a new card representing the subreddit is added to the list

### 2. Subreddit Page
* Clicking on a subreddit card navigates to a dedicated subreddit page
* The subreddit page contains two tabs:
  * **"Top Posts"**
  * **"Themes"**

### 3. Top Posts

#### 3.1 Fetch Reddit Posts Data
* Under the **"Top Posts"** tab:
  * Display fetched Reddit posts from the past 24 hours
  * Use the `snoowrap` library to fetch data

#### 3.2 Post Details
* Each post includes:
  * **Title**
  * **Content**
  * **Score**
  * **URL**
  * **Created UTC (`created_utc`)**
  * **Number of Comments (`num_comments`)**
  * **Categories** for each post define 
       1. **Solution Requests** - Posts where people are seeking solutions for problems
       2. **Pain & Anger** - Posts where people are expressing pains or anger
       3. **Advice Requests** - Posts where people are seeking advice
       4. **Money Talk** - Posts where people are talking about spending money

#### 3.3 Display Posts
* Posts are displayed in a table component
* The table is sortable based on the number of upvotes (**score**)

### 4. Themes Analysis

#### 4.1 Analyze Reddit Posts
* Under the **"Themes"** tab:
  * Analyze each post to categorize it into specific themes
  * Send post data to OpenAI using structured output

#### 4.2 Themes Categories
* **Categories:**
  1. **Solution Requests** - Posts where people are seeking solutions for problems
  2. **Pain & Anger** - Posts where people are expressing pains or anger
  3. **Advice Requests** - Posts where people are seeking advice
  4. **Money Talk** - Posts where people are talking about spending money

#### 4.3 Concurrent Processing
* The analysis process runs concurrently for posts to improve performance

#### 4.4 Display Themes
* Each category is displayed as a card with:
  * **Title**
  * **Description**
  * **Number of Posts (Count)**
* Clicking on a category card opens a side panel showing all posts under that category, and can be scroll up and down

### 5. Add New Categories and analyze, and keep it as the previous categories

#### 5.1 User-defined Categories
* Users can add a new theme category
* After adding, the analysis re-runs to include the new category

## Project Structure

```
reddit-analytics/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── [subreddit]/
│       └── page.tsx
├── lib/
│   ├── reddit.ts
│   └── openai.ts
├── types/
│   └── index.ts
├── utils/
│   └── helpers.ts
├── public/
│   └── assets/
├── README.md
├── .env.local
├── eslint.config.mjs
├── package.json
└── tsconfig.json
```

### Structure Explanation

* **app/**: Contains Next.js pages and layout components
  * **layout.tsx**: Global layout (e.g., headers, footers)
  * **page.tsx**: Home page where users can view and add subreddits
  * **[subreddit]/page.tsx**: Dynamic route for subreddit-specific pages

* **lib/**: Library files for external API interactions
  * **reddit.ts**: Functions to fetch Reddit data using `snoowrap`
  * **openai.ts**: Functions to interact with the OpenAI API

* **types/**: TypeScript interfaces and type definitions
  * **index.ts**: All shared types and enums

* **utils/**: Utility functions
  * **helpers.ts**: Helper functions (e.g., formatting, concurrency control)

* **public/**: Static assets (images, icons)

* **Configuration Files**:
  * **.env.local**: Environment variables (API keys)
  * **eslint.config.mjs**, **package.json**, **tsconfig.json**: Project configurations

## Detailed Implementation

### 1. Subreddit Management

#### 1.1 Home Page (`app/page.tsx`)

* **Subreddit Cards**:
  * Display a grid of subreddit cards showing subreddit names
  * Use Tailwind CSS for styling
  
* **Add Subreddit Modal**:
  * Triggered by the "Add Subreddit" button
  * Modal includes:
    * Input field for subreddit URL
    * Validation to ensure the URL is valid
    * "Add" button to submit
  * Upon submission:
    * Fetch subreddit data to confirm existence
    * Add subreddit to the list

* **State Management**:
  * Manage the list of subreddits using React state or Context API
  * Update the list when a new subreddit is added

#### 1.2 Components (Defined within `page.tsx`)

* **SubredditCard**
  * Displays subreddit details
  * Includes a link to the subreddit page

* **AddSubredditModal**
  * Handles the modal logic and form submission
  * Validates input and updates the subreddit list

### 2. Subreddit Page (`app/[subreddit]/page.tsx`)

* Dynamic routing handles different subreddits
* **Tabs Navigation**:
  * Implement tabs for **"Top Posts"** and **"Themes"**
  * Use state to switch between tabs

### 3. Fetching and Displaying Top Posts

#### 3.1 Reddit API Integration (`lib/reddit.ts`)

* **Dependencies**:
  * Use `snoowrap` for Reddit API interactions
  
* **Configuration**:
  * Store API credentials in `.env.local`
  * Create a `config` object to access credentials

* **Fetching Posts**:
  * Define `getRecentPosts` function to fetch posts from the past 24 hours

##### Example: `getRecentPosts` Function

```typescript
import snoowrap from 'snoowrap';
import { config } from '../config';

interface RedditPost {
  title: string;
  content: string;
  score: number;
  numComments: number;
  createdAt: Date;
  url: string;
}

const reddit = new snoowrap({
  userAgent: config.reddit.userAgent,
  clientId: config.reddit.clientId,
  clientSecret: config.reddit.clientSecret,
  username: config.reddit.username,
  password: config.reddit.password,
});

export async function getRecentPosts(subredditName: string): Promise<RedditPost[]> {
  try {
    const twentyFourHoursAgo = Math.floor((Date.now() - 24 * 60 * 60 * 1000) / 1000);
    const subreddit = reddit.getSubreddit(subredditName);
    const posts = await subreddit.getNew({ limit: 100 });

    const recentPosts = posts
      .filter((post) => post.created_utc > twentyFourHoursAgo)
      .map((post) => ({
        title: post.title,
        content: post.selftext,
        score: post.score,
        numComments: post.num_comments,
        createdAt: new Date(post.created_utc * 1000),
        url: post.url,
      }));

    return recentPosts;
  } catch (error) {
    console.error('Error fetching Reddit posts:', error);
    throw error;
  }
}
```

#### 3.2 Displaying Posts in a Table

* Use a table component to display posts
* **Table Columns**:
  * **Title** (with a link to the post)
  * **Score**
  * **Number of Comments**
  * **Created At** (formatted date)
* **Sorting**:
  * Allow users to sort posts based on score
  
### 4. Analyzing Posts and Displaying Themes

#### 4.1 OpenAI API Integration (`lib/openai.ts`)

* **Purpose**:
  * Analyze post content to categorize into themes

#### 4.2 Categories Definition (`types/index.ts`)

* Define an enum and interface for post categories

```typescript
// types/index.ts

export enum PostCategory {
  SolutionRequest = 'SolutionRequest',
  PainAndAnger = 'PainAndAnger',
  AdviceRequest = 'AdviceRequest',
  MoneyTalk = 'MoneyTalk',
}

export interface Category {
  id: PostCategory;
  description: string;
}
```

* **Categories**:

```typescript
export const POST_CATEGORIES: { [key in PostCategory]: Category } = {
  [PostCategory.SolutionRequest]: {
    id: PostCategory.SolutionRequest,
    description: 'Posts where people are seeking solutions for problems',
  },
  [PostCategory.PainAndAnger]: {
    id: PostCategory.PainAndAnger,
    description: 'Posts where people are expressing pains or anger',
  },
  [PostCategory.AdviceRequest]: {
    id: PostCategory.AdviceRequest,
    description: 'Posts where people are seeking advice',
  },
  [PostCategory.MoneyTalk]: {
    id: PostCategory.MoneyTalk,
    description: 'Posts where people are talking about spending money',
  },
};
```

#### 4.3 Analyze Posts Concurrently

* Use asynchronous functions to process multiple posts at the same time
* Utilize `Promise.all()` to run analyses concurrently

#### 4.4 Example: Analyzing Posts

```typescript
// lib/openai.ts

import { OpenAIApi, Configuration } from 'openai';
import { RedditPost, AnalyzedPost, PostCategory } from '../types';

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

export async function analyzePost(post: RedditPost): Promise<AnalyzedPost> {
  // Function to send post content to OpenAI and receive a category
}

export async function analyzeMultiplePosts(posts: RedditPost[]): Promise<AnalyzedPost[]> {
  const analysisPromises = posts.map(post => analyzePost(post));
  return Promise.all(analysisPromises);
}
```

#### 4.5 Testing Post Analysis

* Use test data to verify that the analysis functions correctly

##### Example Test Script

```typescript
import { analyzePost, analyzeMultiplePosts } from '../lib/openai';
import { POST_CATEGORIES } from '../types';

const testPosts = [
  {
    title: "Need help with Ollama installation errors",
    content: "I'm getting frustrated with these constant crashes. I've spent $200 on a new GPU but still can't get it working. Can someone please help me fix this?",
    score: 10,
    numComments: 2,
    createdAt: new Date(),
    url: "https://www.reddit.com/...",
  },
  {
    title: "Which GPU should I buy?",
    content: "Looking for advice on GPU selection for running large models. Budget is around $1000.",
    score: 7,
    numComments: 3,
    createdAt: new Date(),
    url: "https://www.reddit.com/...",
  },
  {
    title: "Ollama is amazing!",
    content: "Just wanted to share my positive experience. Everything works smoothly now.",
    score: 15,
    numComments: 5,
    createdAt: new Date(),
    url: "https://www.reddit.com/...",
  },
];

async function testPostAnalysis() {
  try {
    console.log('=== Testing Reddit Post Analysis ===\n');
    console.log('Available Categories:');
    Object.values(POST_CATEGORIES).forEach(cat => {
      console.log(`- ${cat.id}: ${cat.description}`);
    });

    console.log('\nTest 1: Analyzing a single post');
    const singleResult = await analyzePost(testPosts[0]);
    console.log('Result:', JSON.stringify(singleResult, null, 2));

    console.log('\nTest 2: Analyzing multiple posts');
    const results = await analyzeMultiplePosts(testPosts);
    console.log('Results:', JSON.stringify(results, null, 2));

  } catch (error) {
    console.error('Error during tests:', error);
    process.exit(1);
  }
}

console.log('Starting tests...\n');
testPostAnalysis()
  .then(() => console.log('\nTests completed successfully'))
  .catch(error => {
    console.error('\nUnhandled error:', error);
    process.exit(1);
  });
```

#### 4.6 Displaying Themes

* Each category is presented as a card on the **"Themes"** tab
* **Category Card Details**:
  * **Title**: Category name
  * **Description**: Brief explanation of the category
  * **Count**: Number of posts classified under the category
* Implement a side panel that appears when a category card is clicked
  * Displays a list of posts under that category
  * Shows post titles and snippets

#### 4.7 Components (Defined within `[subreddit]/page.tsx`)

* **Tabs Component**
  * Manages switching between **"Top Posts"** and **"Themes"**
* **ThemeCard**
  * Displays category information and handles click events to open the side panel
* **CategorySidePanel**
  * Shows posts within the selected category
  * Can be closed to return to the main view

### 5. Adding New Categories

#### 5.1 User Interface

* Provide an option (e.g., an **"Add Category"** button) within the **"Themes"** tab
* Open a modal or form for the user to input:
  * **Category Name**
  * **Description**

#### 5.2 Updating Analysis

* Upon adding a new category:
  * Update the `POST_CATEGORIES` object dynamically
  * Re-run the analysis on existing posts to include the new category
* Ensure that the analysis functions can handle dynamic categories

## Documentation

### 1. Usage of `snoowrap` to Fetch Reddit Posts

* **Installation**:

```bash
npm install snoowrap
```

* **Function Overview**:
  * **`getRecentPosts(subredditName: string): Promise<RedditPost[]>`**
    * Fetches recent posts from a subreddit
    * Filters posts to include only those from the past 24 hours
    * Maps Reddit API responses to a simplified `RedditPost` interface

* **Error Handling**:
  * Wrap API calls in try/catch blocks
  * Log errors and provide feedback

### 2. OpenAI Structured Output Documentation

* **Purpose**:
  * Analyze post content to determine its category

* **Structure**:
  * **Input**:
    * Post content (title and body)
  * **Output**:
    * Structured response