import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat';
import { CATEGORIES, Category } from './constants/categories';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://oai.helicone.ai/v1",
  defaultHeaders: {
    "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
  },
});

export interface ThemeAnalysis {
  category: Category;
  confidence: number;
  reason: string;
}

export async function analyzePostContent(
  title: string,
  content: string
): Promise<ThemeAnalysis> {
  const prompt: ChatCompletionMessageParam = {
    role: "system",
    content: `Analyze the following Reddit post and categorize it into one of these categories:
    - ${CATEGORIES.SOLUTION_REQUESTS}: Posts where people are seeking solutions for problems
    - ${CATEGORIES.PAIN_AND_ANGER}: Posts where people are expressing pains or anger
    - ${CATEGORIES.ADVICE_REQUESTS}: Posts where people are seeking advice
    - ${CATEGORIES.MONEY_TALK}: Posts where people are talking about spending money

    Provide your response in JSON format with the following structure:
    {
      "category": "one of the categories above",
      "confidence": "number between 0 and 1",
      "reason": "brief explanation of why this category was chosen"
    }`,
  };

  const userMessage: ChatCompletionMessageParam = {
    role: "user",
    content: `Title: ${title}\n\nContent: ${content}`,
  };

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [prompt, userMessage],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    const result = JSON.parse(content);
    return result as ThemeAnalysis;
  } catch (error) {
    console.error('Error analyzing post:', error);
    throw error;
  }
} 