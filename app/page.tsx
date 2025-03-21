'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ComponentCategory,
  componentsData,
  getUniqueCategories,
  categoryIcons,
  categoryDisplayNames,
  categoryConfig
} from '@/lib/components-data'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, ExternalLink, MousePointer } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [FeaturedComponent, setFeaturedComponent] =
    useState<React.ComponentType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const uniqueCategories = getUniqueCategories()

  // Set page title
  useEffect(() => {
    document.title = 'Ridiculous UI'
  }, [])

  // Get the featured component data
  const featuredComponentData = componentsData.find(c => c.featured === true)

  // Load the featured component
  useEffect(() => {
    if (featuredComponentData) {
      setIsLoading(true)
      featuredComponentData
        .component()
        .then(Component => {
          setFeaturedComponent(() => Component)
          setIsLoading(false)
        })
        .catch(err => {
          console.error('Failed to load featured component:', err)
          setIsLoading(false)
        })
    }
  }, [featuredComponentData])

  // Popular components (choose a mix of different categories)
  const popularComponents = [
    'blackhole-spinner',
    'talking-password',
    'not-so-random-number-generator',
    'way-too-long-breadcrumbs',
    'schrodinger-checkbox'
  ]
    .map(slug => componentsData.find(c => c.slug === slug))
    .filter(Boolean)

  // Get a sample of each category
  const categorySamples: Record<ComponentCategory, (typeof componentsData)[0]> =
    {} as Record<ComponentCategory, (typeof componentsData)[0]>

  uniqueCategories.forEach(category => {
    const componentsInCategory = componentsData.filter(c =>
      c.categories.includes(category)
    )
    if (componentsInCategory.length > 0) {
      categorySamples[category] = componentsInCategory[0]
    }
  })

  // Filter components based on search
  const filteredComponents = searchQuery
    ? componentsData.filter(
        component =>
          component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          component.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
    : []

  return (
    <div className='container mx-auto py-10 px-4'>
      <section className='text-center mb-16'>
        <h1 className='text-5xl font-extrabold mb-6'>Ridiculous UI</h1>
        <p className='text-xl text-muted-foreground max-w-3xl mx-auto mb-10'>
          A collection of the most absurd, frustrating, and hilarious UI
          controls ever designed. They all work... technically.
        </p>

        {/* Search Bar */}
        <div className='max-w-2xl mx-auto relative'>
          <Input
            type='text'
            placeholder='Search components...'
            className='pr-12 py-6 text-lg'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <Search className='absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-6 w-6' />

          {searchQuery && (
            <div className='absolute z-10 mt-1 w-full bg-background border rounded-md shadow-md'>
              {filteredComponents.length > 0 ? (
                <ul className='py-2'>
                  {filteredComponents.map(component => (
                    <li key={component.slug}>
                      <Link
                        href={`/components/${component.slug}`}
                        className='block px-4 py-2 hover:bg-muted text-left'
                      >
                        {component.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className='px-4 py-2 text-sm text-muted-foreground'>
                  No components found
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Featured Component Hero */}
      {featuredComponentData && (
        <section className='mb-20 mt-16'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-3xl font-bold'>Featured Component</h2>
            <Link href='/components'>
              <Button variant='outline' className='flex items-center gap-2'>
                <span>View All Components</span>
              </Button>
            </Link>
          </div>
          <div className='bg-gradient-to-br from-primary/5 via-primary/10 to-background rounded-xl p-8 md:p-12 shadow-lg border border-primary/20'>
            <div className='flex flex-col lg:flex-row items-start gap-12'>
              {/* Left side - Component showcase */}
              <div className='w-full lg:w-3/5'>
                {isLoading ? (
                  <Skeleton className='h-[300px] w-full' />
                ) : FeaturedComponent ? (
                  <FeaturedComponent />
                ) : (
                  <div className='text-center text-muted-foreground py-12'>
                    Component could not be loaded
                  </div>
                )}
              </div>

              {/* Right side - Component details */}
              <div className='w-full lg:w-2/5 flex flex-col justify-center'>
                <h2 className='text-4xl font-bold mb-4'>
                  {featuredComponentData.name}
                </h2>

                <p className='text-lg text-muted-foreground mb-8'>
                  {featuredComponentData.description}
                </p>

                <div className='flex justify-center'>
                  <Link
                    href={`/components/${featuredComponentData.slug}`}
                    className='bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-md font-medium text-lg transition-colors flex items-center gap-2'
                  >
                    <span>View Details</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className='text-center mb-20'>
        <div className='border rounded-lg p-8 bg-card'>
          <h2 className='text-3xl font-bold mb-4'>Ready to be Ridiculous?</h2>
          <p className='text-lg text-muted-foreground mb-6 max-w-2xl mx-auto'>
            Explore our full collection of absurd UI components that will
            confuse, frustrate, and hopefully amuse you.
          </p>
          <div className='flex justify-center'>
            <Link href='/components'>
              <Button size='lg' className='flex items-center gap-2'>
                <span>View All Components</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Components */}
      <section className='mb-20'>
        <div className='flex items-center justify-between mb-8'>
          <h2 className='text-3xl font-bold'>Popular Components</h2>
          <Link href='/components'>
            <Button variant='outline' className='flex items-center gap-2'>
              <span>View All Components</span>
            </Button>
          </Link>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {popularComponents.map(component => (
            <Link
              href={`/components/${component?.slug}`}
              key={component?.slug}
              className='block group'
            >
              <div className='border rounded-lg p-6 bg-card h-full transition-all hover:shadow-md relative'>
                <div className='absolute top-4 right-4'>
                  {component?.categories[0] &&
                    (() => {
                      const Icon = categoryIcons[component.categories[0]]
                      return <Icon className='h-7 w-7 text-primary/60' />
                    })()}
                </div>
                <h3 className='text-xl font-bold mb-3 group-hover:text-primary pr-10'>
                  {component?.name}
                </h3>
                <div className='flex gap-2 mb-3'>
                  {component?.categories.map(category => (
                    <span
                      key={category}
                      className='px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs'
                    >
                      {categoryDisplayNames[category]}
                    </span>
                  ))}
                </div>
                <p className='text-muted-foreground'>
                  {component?.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className='mb-16'>
        <div className='flex items-center justify-between mb-8'>
          <h2 className='text-3xl font-bold'>Browse by Category</h2>
          <Link href='/components'>
            <Button variant='outline' className='flex items-center gap-2'>
              <span>View All Components</span>
            </Button>
          </Link>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {uniqueCategories.map(category => {
            const sample = categorySamples[category]
            return (
              <Link
                href={`/components?category=${category}`}
                key={category}
                className='block group'
              >
                <div className='border rounded-lg p-5 bg-card h-full transition-all hover:shadow-md'>
                  <div className='relative'>
                    <div className='absolute top-0 right-0'>
                      {(() => {
                        const Icon = categoryIcons[category]
                        return <Icon className='h-6 w-6 text-primary/70' />
                      })()}
                    </div>
                    <h3 className='text-lg font-bold capitalize group-hover:text-primary pr-8'>
                      {categoryConfig[category].displayName}
                    </h3>
                  </div>
                  {sample && (
                    <p className='text-sm text-muted-foreground'>
                      {sample.name}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
