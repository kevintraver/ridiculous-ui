'use client'

import React, { createContext, useContext, useCallback, useMemo, Suspense } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { ComponentCategory, getUniqueCategories } from '@/lib/components-data'

type CategoryContextType = {
  selectedCategory: ComponentCategory | 'all'
  setCategory: (category: ComponentCategory | 'all') => void
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined)

function CategoryContent({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Get the current category from URL
  const selectedCategory = useMemo(() => {
    const categoryParam = searchParams.get('category')
    if (categoryParam && getUniqueCategories().includes(categoryParam as ComponentCategory)) {
      return categoryParam as ComponentCategory
    }
    return 'all'
  }, [searchParams])

  // Function to update the URL with the new category
  const setCategory = useCallback((category: ComponentCategory | 'all') => {
    if (pathname !== '/components') return
    
    // Create a new URLSearchParams instance
    const newSearchParams = new URLSearchParams(searchParams.toString())
    
    // Update the category parameter
    if (category === 'all') {
      newSearchParams.delete('category')
    } else {
      newSearchParams.set('category', category)
    }
    
    // Convert to query string
    const queryString = newSearchParams.toString()
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname
    
    // Update the URL without navigation
    router.replace(newUrl, { scroll: false })
  }, [pathname, router, searchParams])

  return (
    <CategoryContext.Provider value={{ selectedCategory, setCategory }}>
      {children}
    </CategoryContext.Provider>
  )
}

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading categories...</div>}>
      <CategoryContent>{children}</CategoryContent>
    </Suspense>
  )
}

export function useCategory() {
  const context = useContext(CategoryContext)
  if (context === undefined) {
    throw new Error('useCategory must be used within a CategoryProvider')
  }
  return context
}