import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CATEGORIES, Category } from '@/lib/constants/categories'

interface CategoryState {
  categories: Category[]
  addCategory: (category: Category) => void
  removeCategory: (category: Category) => void
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: Object.values(CATEGORIES),
      addCategory: (category) =>
        set((state) => ({
          categories: [...state.categories, category],
        })),
      removeCategory: (category) =>
        set((state) => ({
          categories: state.categories.filter((c) => c !== category),
        })),
    }),
    {
      name: 'category-store',
    }
  )
) 