'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { ChevronRight } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { faker } from '@faker-js/faker'

// Generate a unique business/tech buzzword menu item
const generateMenuItemName = (depth: number): string => {
  const options = [
    // Business jargon generator
    () => {
      const action = faker.company.buzzVerb()
      const noun = faker.company.buzzNoun()
      return `${action} ${noun}`
    },

    // Tech buzzword generator
    () => {
      const techWord = faker.hacker.noun()
      const techAction = faker.hacker.verb()
      return `${techAction} ${techWord}`
    },

    // Hacker verb + adjective combination
    () => {
      const verb = faker.hacker.verb()
      const adjective = faker.hacker.adjective()
      return `${verb} ${adjective}`
    },

    // Hacker adjective + noun
    () => {
      const adjective = faker.hacker.adjective()
      const noun = faker.hacker.noun()
      return `${adjective} ${noun}`
    }
  ]

  const generator = () => {
    const itemName = faker.helpers.arrayElement(options)()
    return itemName
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
  return generator()
}

// Generate a random number of unique menu items
const generateUniqueItems = (count: number = 3): string[] => {
  const items: string[] = []
  for (let i = 0; i < count; i++) {
    items.push(generateMenuItemName(1))
  }
  return items
}

interface SubMenuProps {
  depth: number
  parentName: string
  onOpen: () => void
}

// SubMenu component that renders recursively
const SubMenu = ({ depth, parentName, onOpen }: SubMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const itemCount = 3 + Math.floor(Math.random() * 3) // 3-5 items

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className='flex items-center justify-between w-full'>
        <span>{parentName}</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent
          className='min-w-[220px]'
          onPointerDownOutside={e => e.preventDefault()}
        >
          {Array.from({ length: itemCount }).map((_, index) => {
            const itemName = generateMenuItemName(depth + 1)
            return (
              <SubMenuTrigger
                key={`${depth}-${index}-${itemName}`}
                depth={depth + 1}
                name={itemName}
                onOpen={onOpen}
              />
            )
          })}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  )
}

interface SubMenuTriggerProps {
  depth: number
  name: string
  onOpen: () => void
}

// Decides whether to render a normal item or a submenu
const SubMenuTrigger = ({ depth, name, onOpen }: SubMenuTriggerProps) => {
  // Always create a submenu, never an actual selectable item
  return <SubMenu depth={depth} parentName={name} onOpen={onOpen} />
}

export default function InfiniteDropdown() {
  const [menuCount, setMenuCount] = useState(0)
  const [message, setMessage] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const initialItems = generateUniqueItems(5)

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Handle new menu open
  const handleMenuOpen = useCallback(() => {
    setMenuCount(prev => prev + 1)

    // Set encouraging messages based on how deep they've gone
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    let newMessage = ''

    if (menuCount > 40) {
      newMessage = "You're incredibly persistent! Maybe there is an end?"
    } else if (menuCount > 30) {
      newMessage = "You've gone deeper than anyone before!"
    } else if (menuCount > 20) {
      newMessage = 'Impressive dedication! Keep going!'
    } else if (menuCount > 10) {
      newMessage = "You're really determined! Just a bit more..."
    } else if (menuCount > 5) {
      newMessage = "You're getting closer! Almost there..."
    }

    if (newMessage) {
      setMessage(newMessage)
      timeoutRef.current = setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
  }, [menuCount])

  // Reset counter
  const handleReset = useCallback(() => {
    setMenuCount(0)
    setMessage(null)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Actions & Options: No End in Sight</CardTitle>
        <CardDescription className='space-y-2'>
          <p>
            Navigate through our extensive command structure where every
            selection reveals new possibilities.
          </p>
          <p>
            The perfect option exists... somewhere. Perhaps just a few more
            clicks away.
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col items-center space-y-6'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='w-[200px]'>
              Open Menu
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='min-w-[220px]'>
            {initialItems.map((item, index) => (
              <SubMenuTrigger
                key={`root-${index}-${item}`}
                depth={1}
                name={item}
                onOpen={handleMenuOpen}
              />
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {message && (
          <p className='text-sm text-center animate-pulse text-primary'>
            {message}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
