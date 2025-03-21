'use client'

import type React from 'react'

import { useState } from 'react'
import {
  ChevronRight,
  Home,
  Folder,
  File,
  Coffee,
  Clock,
  Heart,
  Star,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

export default function OversharingBreadcrumbs() {
  const [breadcrumbs, setBreadcrumbs] = useState<
    Array<{ id: string; content: React.ReactNode; tooltip?: string }>
  >([
    {
      id: 'home',
      content: (
        <div className='flex items-center gap-1'>
          <Home className='h-4 w-4' />
          <span>Home</span>
        </div>
      )
    }
  ])

  const [navigationLevel, setNavigationLevel] = useState(0)

  // Personal details that get progressively more oversharing
  const personalDetails = [
    'I just moved in last month',
    'My roommate never does the dishes',
    "I'm thinking about getting a cat",
    'I had cereal for breakfast',
    "I'm avoiding my ex who lives nearby",
    'I forgot to pay my electricity bill',
    "My WiFi password is 'password123'",
    "I've been wearing the same socks for 3 days",
    "I'm pretending to work while actually browsing memes",
    'I still sleep with my childhood teddy bear',
    "I haven't backed up my files in 2 years",
    "I'm using my neighbor's WiFi without permission",
    'I lied on my resume about knowing Excel',
    "I'm secretly learning to play the ukulele",
    "I eat pineapple on pizza and I'm not sorry"
  ]

  // Folder structure with increasingly specific and unnecessary details
  const folderStructure = [
    {
      name: 'Documents',
      icon: <Folder className='h-4 w-4' />,
      detail: 'Created 3 years ago'
    },
    {
      name: 'Work Projects',
      icon: <Folder className='h-4 w-4' />,
      detail: 'Last modified while I was supposed to be on vacation'
    },
    {
      name: 'Project Roadmap',
      icon: <File className='h-4 w-4' />,
      detail: 'These deadlines are completely unrealistic'
    },
    {
      name: 'Q3 Reports',
      icon: <Folder className='h-4 w-4' />,
      detail: 'The numbers are slightly fudged'
    },
    {
      name: 'Marketing Strategy',
      icon: <Folder className='h-4 w-4' />,
      detail: "Copied from a competitor, if I'm being honest"
    },
    {
      name: 'Client Presentations',
      icon: <Folder className='h-4 w-4' />,
      detail: 'Most of these were made the night before'
    },
    {
      name: 'Budget Forecasts',
      icon: <File className='h-4 w-4' />,
      detail: 'I made these up during a boring meeting'
    },
    {
      name: 'Meeting Notes',
      icon: <File className='h-4 w-4' />,
      detail: 'I was actually playing Candy Crush during this meeting'
    },
    {
      name: 'Team Performance Reviews',
      icon: <File className='h-4 w-4' />,
      detail: 'I wrote these after having three glasses of wine'
    },
    {
      name: 'Confidential Assets',
      icon: <Folder className='h-4 w-4' />,
      detail: 'Not actually confidential, I just like feeling important'
    }
  ]

  // Random icons to make the breadcrumbs more visually chaotic as they grow
  const randomIcons = [
    <Coffee key='coffee' className='h-4 w-4' />,
    <Clock key='clock' className='h-4 w-4' />,
    <Heart key='heart' className='h-4 w-4' />,
    <Star key='star' className='h-4 w-4' />,
    <User key='user' className='h-4 w-4' />
  ]

  // Navigate to the next level
  const navigateDeeper = () => {
    if (navigationLevel >= folderStructure.length) return

    const newLevel = navigationLevel + 1
    setNavigationLevel(newLevel)

    // Add the next folder/file in the structure
    const nextItem = folderStructure[navigationLevel]

    // Create increasingly verbose breadcrumb items
    let newBreadcrumb: {
      id: string
      content: React.ReactNode
      tooltip?: string
    }

    if (newLevel <= 3) {
      // First few levels are relatively normal
      newBreadcrumb = {
        id: `level-${newLevel}`,
        content: (
          <div className='flex items-center gap-1'>
            {nextItem.icon}
            <span>{nextItem.name}</span>
          </div>
        )
      }
    } else if (newLevel <= 6) {
      // Middle levels start adding details
      newBreadcrumb = {
        id: `level-${newLevel}`,
        content: (
          <div className='flex items-center gap-1'>
            {nextItem.icon}
            <span>{nextItem.name}</span>
            <span className='text-xs text-muted-foreground'>
              ({nextItem.detail})
            </span>
          </div>
        )
      }
    } else {
      // Later levels become excessive and personal
      const randomIcon =
        randomIcons[Math.floor(Math.random() * randomIcons.length)]
      const personalDetail =
        personalDetails[Math.floor(Math.random() * personalDetails.length)]

      newBreadcrumb = {
        id: `level-${newLevel}`,
        content: (
          <div className='flex items-center gap-1'>
            {nextItem.icon}
            <span>{nextItem.name}</span>
            {randomIcon}
            <span className='text-xs text-muted-foreground hidden md:inline'>
              ({nextItem.detail})
            </span>
          </div>
        ),
        tooltip: `${nextItem.detail}. Also, ${personalDetail}.`
      }
    }

    setBreadcrumbs([...breadcrumbs, newBreadcrumb])
  }

  // Go back one level
  const goBack = () => {
    if (breadcrumbs.length <= 1) return

    const newBreadcrumbs = [...breadcrumbs]
    newBreadcrumbs.pop()
    setBreadcrumbs(newBreadcrumbs)
    setNavigationLevel(navigationLevel - 1)
  }

  // Reset to home
  const resetNavigation = () => {
    setBreadcrumbs([breadcrumbs[0]])
    setNavigationLevel(0)
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-wrap gap-2'>
        <Button
          onClick={navigateDeeper}
          disabled={navigationLevel >= folderStructure.length}
        >
          Navigate Deeper
        </Button>
        <Button
          variant='outline'
          onClick={goBack}
          disabled={breadcrumbs.length <= 1}
        >
          Go Back
        </Button>
        <Button
          variant='outline'
          onClick={resetNavigation}
          disabled={breadcrumbs.length <= 1}
          className='px-3 py-1 text-sm bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors flex items-center gap-1.5 h-10'
        >
          <span className='mr-1'>↺</span>
          Reset
        </Button>
      </div>
      <div className='flex flex-wrap items-center gap-2 p-4 border rounded-md bg-background overflow-x-auto max-w-full'>
        <TooltipProvider>
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.id} className='flex items-center'>
              {index > 0 && (
                <ChevronRight className='h-4 w-4 mx-1 flex-shrink-0 text-muted-foreground' />
              )}

              {crumb.tooltip ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className='flex-shrink-0 whitespace-nowrap hover:bg-accent hover:text-accent-foreground rounded px-2 py-1 text-sm'>
                      {crumb.content}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className='max-w-xs'>{crumb.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <div className='flex-shrink-0 whitespace-nowrap hover:bg-accent hover:text-accent-foreground rounded px-2 py-1 text-sm'>
                  {crumb.content}
                </div>
              )}
            </div>
          ))}
        </TooltipProvider>
      </div>

      {navigationLevel > 5 && (
        <div className='text-sm italic text-muted-foreground'>
          Your breadcrumbs are getting rather... personal. Maybe keep some
          things to yourself?
        </div>
      )}

      {navigationLevel > 8 && (
        <div className='p-4 border rounded-md bg-yellow-50 dark:bg-yellow-950'>
          <p className='text-sm text-yellow-800 dark:text-yellow-300'>
            <strong>Privacy Warning:</strong> Your breadcrumb navigation is
            oversharing. It's telling everyone about your personal life and
            questionable work habits. Consider therapy for your navigation
            system.
          </p>
        </div>
      )}
    </div>
  )
}
