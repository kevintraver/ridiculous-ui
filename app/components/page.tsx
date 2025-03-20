'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  componentsData,
  ComponentCategory,
  getUniqueCategories,
  categoryIcons
} from '@/lib/components-data'
import { Input } from '@/components/ui/input'

function ComponentsContent() {
  const searchParams = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState<
    ComponentCategory | 'all'
  >('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Set page title
  useEffect(() => {
    document.title = 'Components | Ridiculous UI'
  }, [])

  const uniqueCategories = useMemo(() => getUniqueCategories(), [])

  // Set initial category from URL parameters
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    if (
      categoryParam &&
      uniqueCategories.includes(categoryParam as ComponentCategory)
    ) {
      setSelectedCategory(categoryParam as ComponentCategory)
    }
  }, [searchParams, uniqueCategories])

  // Group components by category for the categorized view
  const componentsByCategory = useMemo(() => {
    const grouped: Record<ComponentCategory, typeof componentsData> =
      {} as Record<ComponentCategory, typeof componentsData>

    componentsData.forEach(component => {
      component.categories.forEach(category => {
        if (!grouped[category]) {
          grouped[category] = []
        }
        grouped[category].push(component)
      })
    })

    return grouped
  }, [])

  // Filter components based on search and category
  const filteredComponents = useMemo(() => {
    return componentsData.filter(component => {
      // Filter by category
      const categoryMatch =
        selectedCategory === 'all' ||
        component.categories.includes(selectedCategory as ComponentCategory)

      // Filter by search
      const searchMatch =
        component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        component.description.toLowerCase().includes(searchQuery.toLowerCase())

      return categoryMatch && searchMatch
    })
  }, [selectedCategory, searchQuery])

  useEffect(() => {
    document.title = 'Components | Ridiculous UI'
  }, [])

  return (
    <div className='container mx-auto py-10 px-4'>
      <h1 className='text-4xl font-extrabold mb-8 text-center'>
        Component Library
      </h1>

      {/* Search and Filter */}
      <div className='mb-12 space-y-6'>
        <div className='max-w-2xl mx-auto'>
          <Input
            type='text'
            placeholder='Search components...'
            className='w-full py-6 text-lg'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className='flex flex-wrap justify-center gap-3 pt-2'>
          <button
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
            onClick={() => setSelectedCategory('all')}
          >
            All
          </button>

          {uniqueCategories.map(category => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {(() => {
                const Icon = categoryIcons[category]
                return <Icon className='h-3.5 w-3.5' />
              })()}
              {category.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Show filtered results when searching or filtering */}
      {(searchQuery || selectedCategory !== 'all') && (
        <div className='mb-12'>
          <h2 className='text-2xl font-bold mb-6'>
            {filteredComponents.length}{' '}
            {filteredComponents.length === 1 ? 'Component' : 'Components'} Found
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {filteredComponents.map(component => (
              <Link
                href={`/components/${component.slug}`}
                key={component.slug}
                className='block group'
              >
                <div className='border rounded-lg p-4 bg-card h-full transition-all hover:shadow-md relative'>
                  <h3 className='text-lg font-bold mb-2 group-hover:text-primary pr-8'>
                    {component.name}
                  </h3>
                  <div className='flex flex-wrap gap-1 mb-3'>
                    {component.categories.map(category => (
                      <span
                        key={category}
                        className='px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs'
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                  <p className='text-sm text-muted-foreground line-clamp-2'>
                    {component.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Show categorized view when not searching or when showing all */}
      {!searchQuery && selectedCategory === 'all' && (
        <>
          {Object.entries(componentsByCategory).map(
            ([category, components]) => (
              <section key={category} className='mb-12'>
                <h2 className='text-2xl font-bold mb-6 capitalize'>
                  {category}
                </h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {components.map(component => (
                    <Link
                      href={`/components/${component.slug}`}
                      key={component.slug}
                      className='block group'
                    >
                      <div className='border rounded-lg p-4 bg-card h-full transition-all hover:shadow-md relative'>
                        <div className='absolute top-4 right-4'>
                          {(() => {
                            const Icon = categoryIcons[component.categories[0]]
                            return <Icon className='h-5 w-5 text-primary/60' />
                          })()}
                        </div>
                        <h3 className='text-lg font-bold mb-2 group-hover:text-primary pr-8'>
                          {component.name}
                        </h3>
                        <div className='flex flex-wrap gap-1 mb-3'>
                          {component.categories.map(
                            cat =>
                              cat !== category && (
                                <span
                                  key={cat}
                                  className='px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs'
                                >
                                  {cat}
                                </span>
                              )
                          )}
                        </div>
                        <p className='text-sm text-muted-foreground line-clamp-2'>
                          {component.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )
          )}
        </>
      )}
    </div>
  )
}

export default function ComponentsPage() {
  return (
    <Suspense
      fallback={
        <div className='container mx-auto py-10 px-4 text-center'>
          Loading components...
        </div>
      }
    >
      <ComponentsContent />
    </Suspense>
  )
}
