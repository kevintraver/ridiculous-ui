'use client'

import { useEffect, useState } from 'react'
import { notFound, useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { componentsData, categoryIcons } from '@/lib/components-data'
import { Skeleton } from '@/components/ui/skeleton'
import Head from 'next/head'
import { useCategory } from '@/lib/category-context'

export default function ComponentPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string
  const [Component, setComponent] = useState<React.ComponentType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const componentData = componentsData.find(c => c.slug === slug)
  
  // Set page title
  useEffect(() => {
    if (componentData) {
      document.title = `${componentData.name} | Ridiculous UI`
    }
  }, [componentData])

  useEffect(() => {
    if (!componentData) {
      notFound()
      return
    }

    const loadComponent = async () => {
      setIsLoading(true)
      try {
        const Component = await componentData.component()
        setComponent(() => Component)
      } catch (error) {
        console.error('Failed to load component:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadComponent()
  }, [componentData, slug])

  if (!componentData) {
    notFound()
  }

  useEffect(() => {
    if (componentData) {
      document.title = `${componentData.name} | Ridiculous UI`
    }
  }, [componentData])

  return (
    <div className='container mx-auto py-10 px-4'>
      <div className='flex items-center mb-6'>
        <Link
          href='/components'
          className='flex items-center text-muted-foreground hover:text-primary transition-colors mr-4'
          onClick={(e) => {
            e.preventDefault()
            // Use the category from the component to navigate back if available
            if (componentData.categories.length > 0) {
              router.push(`/components?category=${componentData.categories[0]}`)
            } else {
              router.push('/components')
            }
          }}
        >
          <ArrowLeft className='h-5 w-5 mr-1' />
          <span>Back to Components</span>
        </Link>
      </div>

      <h1 className='text-4xl font-extrabold mb-4'>{componentData.name}</h1>

      <div className='flex gap-2 mb-4'>
        {componentData.categories.map(category => {
          const Icon = categoryIcons[category]
          return (
            <Link
              href={`/components?category=${category}`}
              key={category}
              className='px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors flex items-center gap-1.5'
              onClick={(e) => {
                // Use direct navigation with query parameter
                e.preventDefault()
                router.push(`/components?category=${category}`)
              }}
            >
              <Icon className='h-3.5 w-3.5' />
              {category.replace('-', ' ')}
            </Link>
          )
        })}
      </div>

      <p className='text-lg text-muted-foreground mb-8'>
        {componentData.description}
      </p>

      {isLoading ? (
        <div className='min-h-[200px] flex items-center justify-center'>
          <Skeleton className='h-[200px] w-full' />
        </div>
      ) : Component ? (
        <Component />
      ) : (
        <div className='text-center text-muted-foreground'>
          Component not found
        </div>
      )}
    </div>
  )
}
