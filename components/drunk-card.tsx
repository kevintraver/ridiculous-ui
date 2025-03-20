'use client'

import React, { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

interface DrunkCardProps {
  title?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  intensity?: 'tipsy' | 'buzzed' | 'wasted'
  className?: string
}

const DrunkCard: React.FC<DrunkCardProps> = ({
  title,
  description,
  children,
  footer,
  intensity = 'buzzed',
  className = ''
}) => {
  const controls = useAnimation()
  const [isSick, setIsSick] = useState(false)

  // Helper function to add randomness to animation values
  const randomize = (value: number) => {
    // Add up to 30% random variation
    const randomFactor = 0.7 + Math.random() * 0.6
    return value * randomFactor
  }

  // Generate randomized animation paths each time the component renders
  const intensityMap = {
    tipsy: {
      rotate: [0, randomize(1), randomize(-0.5), randomize(1.5), 0],
      translateX: [0, randomize(5), randomize(-3), randomize(4), 0],
      translateY: [0, randomize(-2), randomize(3), randomize(-1), 0],
      scale: [
        1,
        1 + randomize(0.01),
        1 - randomize(0.01),
        1 + randomize(0.02),
        1
      ],
      sickDelay: 10 + Math.floor(Math.random() * 5) // 10-15 seconds before getting sick
    },
    buzzed: {
      rotate: [0, randomize(2), randomize(-1.5), randomize(2.5), 0],
      translateX: [0, randomize(10), randomize(-7), randomize(8), 0],
      translateY: [0, randomize(-5), randomize(7), randomize(-3), 0],
      scale: [
        1,
        1 + randomize(0.03),
        1 - randomize(0.02),
        1 + randomize(0.04),
        1
      ],
      sickDelay: 7 + Math.floor(Math.random() * 4) // 7-11 seconds before getting sick
    },
    wasted: {
      rotate: [0, randomize(4), randomize(-3), randomize(5), 0],
      translateX: [0, randomize(15), randomize(-12), randomize(14), 0],
      translateY: [0, randomize(-10), randomize(12), randomize(-8), 0],
      scale: [
        1,
        1 + randomize(0.05),
        1 - randomize(0.04),
        1 + randomize(0.07),
        1
      ],
      sickDelay: 4 + Math.floor(Math.random() * 3) // 4-7 seconds before getting sick
    }
  }

  useEffect(() => {
    // Start the animation immediately
    controls.start({
      // More complex animation sequence with additional keyframes for more natural drunk motion
      rotate: [
        ...intensityMap[intensity].rotate.slice(0, 2),
        intensityMap[intensity].rotate[1] * 0.7,
        intensityMap[intensity].rotate[2] * 1.2,
        intensityMap[intensity].rotate[2] * 0.5,
        ...intensityMap[intensity].rotate.slice(2)
      ],
      x: [
        ...intensityMap[intensity].translateX.slice(0, 2),
        intensityMap[intensity].translateX[1] * 0.6,
        intensityMap[intensity].translateX[2] * 1.3,
        intensityMap[intensity].translateX[2] * 0.4,
        ...intensityMap[intensity].translateX.slice(2)
      ],
      y: [
        ...intensityMap[intensity].translateY.slice(0, 2),
        intensityMap[intensity].translateY[1] * 0.8,
        intensityMap[intensity].translateY[2] * 1.1,
        intensityMap[intensity].translateY[2] * 0.3,
        ...intensityMap[intensity].translateY.slice(2)
      ],
      scale: intensityMap[intensity].scale,
      transition: {
        duration: 1.5, // Slower animation
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut',
        repeatDelay: Math.random() * 0.5 // Random delay between iterations
      }
    })

    // Set a timer to trigger the "sick" state
    const sickTimer = setTimeout(() => {
      setIsSick(true)
    }, intensityMap[intensity].sickDelay * 1000)

    return () => clearTimeout(sickTimer)
  }, [controls, intensity])

  return (
    <motion.div
      className={`w-[350px] ${className}`}
      initial={{
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}
      animate={controls}
    >
      <Card
        className={`transition-all duration-700 shadow-lg ${
          isSick
            ? 'bg-green-100 border-green-300'
            : 'bg-orange-100 border-orange-300'
        }`}
      >
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && (
              <CardDescription>
                {description}
                {isSick && (
                  <span className='ml-2 text-green-600'>(feeling sick...)</span>
                )}
              </CardDescription>
            )}
          </CardHeader>
        )}

        <CardContent>{children}</CardContent>

        {footer && <CardFooter>{footer}</CardFooter>}
      </Card>
    </motion.div>
  )
}

export function DrunkCardWithForm() {
  return (
    <DrunkCard
      title='Create project'
      description='Deploy your new project in one-click.'
      intensity='buzzed'
      footer={
        <div className='flex justify-between w-full'>
          <Button variant='outline'>Cancel</Button>
          <Button>Deploy</Button>
        </div>
      }
    >
      <form>
        <div className='grid w-full items-center gap-4'>
          <div className='flex flex-col space-y-1.5'>
            <Label htmlFor='name'>Name</Label>
            <Input id='name' placeholder='Name of your project' />
          </div>
          <div className='flex flex-col space-y-1.5'>
            <Label htmlFor='framework'>Framework</Label>
            <Select>
              <SelectTrigger id='framework'>
                <SelectValue placeholder='Select' />
              </SelectTrigger>
              <SelectContent position='popper'>
                <SelectItem value='next'>Next.js</SelectItem>
                <SelectItem value='sveltekit'>SvelteKit</SelectItem>
                <SelectItem value='astro'>Astro</SelectItem>
                <SelectItem value='nuxt'>Nuxt.js</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </form>
    </DrunkCard>
  )
}

// This is a demo page that shows all variations of the component
export default function DrunkCardDemoPage() {
  return (
    <div className='container py-12 px-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16'>
        <div className='flex flex-col gap-2'>
          <h2 className='text-lg font-semibold'>Tipsy</h2>
          <DrunkCard
            title='Tipsy Card'
            description='Just had a beer or two'
            intensity='tipsy'
            footer={
              <div className='w-full flex justify-end'>
                <Button size='sm'>Got it</Button>
              </div>
            }
          >
            <p className='text-sm'>
              This card is just a little tipsy. The animations are subtle and it
              takes longer to feel sick.
            </p>
          </DrunkCard>
        </div>

        <div className='flex flex-col gap-2'>
          <h2 className='text-lg font-semibold'>Buzzed</h2>
          <DrunkCardWithForm />
        </div>

        <div className='flex flex-col gap-2'>
          <h2 className='text-lg font-semibold'>Wasted</h2>
          <DrunkCard
            title='Wasted Card'
            description='Way too many shots'
            intensity='wasted'
            footer={
              <div className='w-full flex justify-between'>
                <Button variant='destructive'>Delete Project</Button>
                <Button variant='outline'>Cancel</Button>
              </div>
            }
          >
            <div className='flex flex-col gap-3'>
              <p className='text-sm'>
                This card had WAY too much to drink! The animations are
                exaggerated and it gets sick quickly.
              </p>
              <Input placeholder='Try typing here if you can...' />
            </div>
          </DrunkCard>
        </div>
      </div>
    </div>
  )
}
