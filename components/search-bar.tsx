'use client'

import { useState, useEffect, useRef } from 'react'
import { Search as SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { componentsData } from '@/lib/components-data'

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [filteredComponents, setFilteredComponents] = useState<typeof componentsData>([])
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!searchQuery) {
      setFilteredComponents([])
      return
    }

    const filtered = componentsData.filter(
      component =>
        component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        component.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredComponents(filtered)
  }, [searchQuery])
  
  useEffect(() => {
    // Handle click outside to close the search
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsExpanded(false)
        setSearchQuery('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div 
      ref={searchRef}
      className={`relative transition-all duration-300 ${isExpanded ? 'w-64' : 'w-8'}`}
      onMouseEnter={() => setIsExpanded(true)}
    >
      <div className="flex items-center">
        {isExpanded ? (
          <div className="w-full relative">
            <Input
              type="text"
              placeholder="Search components..."
              className="pr-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <SearchIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        ) : (
          <SearchIcon className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
        )}
      </div>
      
      {searchQuery && isExpanded && (
        <div className="absolute z-20 mt-1 w-full bg-background border rounded-md shadow-md">
          {filteredComponents.length > 0 ? (
            <ul className="py-2">
              {filteredComponents.map(component => (
                <li key={component.slug}>
                  <Link
                    href={`/components/${component.slug}`}
                    className="block px-4 py-2 hover:bg-muted text-left text-sm"
                    onClick={() => {
                      setIsExpanded(false)
                      setSearchQuery('')
                    }}
                  >
                    {component.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-2 text-sm text-muted-foreground">
              No components found
            </p>
          )}
        </div>
      )}
    </div>
  )
}