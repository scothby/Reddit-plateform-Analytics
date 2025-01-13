export const CATEGORIES = {
  SOLUTION_REQUESTS: 'Solution requests',
  PAIN_AND_ANGER: 'Pain & anger',
  ADVICE_REQUESTS: 'Advice requests',
  MONEY_TALK: 'Money talk',
} as const;

export type Category = typeof CATEGORIES[keyof typeof CATEGORIES];

export const CATEGORY_DESCRIPTIONS = {
  [CATEGORIES.SOLUTION_REQUESTS]: 'Posts where people are seeking solutions for problems',
  [CATEGORIES.PAIN_AND_ANGER]: 'Posts where people are expressing pains or anger',
  [CATEGORIES.ADVICE_REQUESTS]: 'Posts where people are seeking advice',
  [CATEGORIES.MONEY_TALK]: 'Posts where people are talking about spending money',
} as const; 