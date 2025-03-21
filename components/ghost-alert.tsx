'use client'

import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Ghost } from 'lucide-react'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility function for class name merging
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// GhostAlert component props
export interface GhostAlertProps {
  isVisible: boolean
  onClose: () => void
  duration?: number
  variant?: 'default' | 'success' | 'warning' | 'error'
  className?: string
  showResetButton?: boolean
}

// The actual Ghost Alert component
export default function GhostAlert({
  isVisible: initialVisibility = true,
  onClose,
  duration = 4000,
  variant = 'default',
  className,
  showResetButton = true
}: GhostAlertProps) {
  const [isVisible, setIsVisible] = useState(initialVisibility)
  // Initialize with a random position around the center but lower
  const [position, setPosition] = useState({
    x: Math.random() * 100 - 50,
    y: Math.random() * 100 + 50 // Start 50px below center
  })
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

  // Function to reset ghost position and animation
  const resetGhostPosition = () => {
    // Random position but with more variation
    setPosition({
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 50 // Keep it lower
    })

    // Clear existing timeout and set new one
    if (timer) clearTimeout(timer)
    setIsVisible(true)
    const newTimer = setTimeout(() => {
      setIsVisible(false)
      if (typeof onClose === 'function') {
        onClose()
      }
    }, duration)
    setTimer(newTimer)
  }
  const [ghostMessage, setGhostMessage] = useState('')

  // Random creative messages
  const ghostMessages = [
    "I'm just passing through the digital realm...",
    "Don't mind me, I'm transparent-ly judging your code",
    'This alert is haunting your UI experience',
    'Boo! Did I scare your pixels?',
    'I float like a ghost, sting like a memory leak',
    "Now you see me, soon I'll fade into the void",
    'Spooking your interface since 2025',
    "I'm the friendliest ghost in your codebase",
    'Error 👻: Ghost in the machine detected'
  ]

  // Set a random ghost message on mount only - never changes
  useEffect(() => {
    // Only set the message once when component mounts
    setGhostMessage(
      ghostMessages[Math.floor(Math.random() * ghostMessages.length)]
    )
    // Empty dependency array ensures this runs only once on mount
  }, [])

  // More active flowing movement with curves and patterns
  useEffect(() => {
    if (!isVisible) return

    // Multiple movement patterns
    const moveGhost = () => {
      // Current time for flowing movement patterns
      const time = Date.now() / 1000

      // Different movement patterns
      const patterns = [
        // Pattern 1: Circular movement
        () => {
          const radius = 60 + Math.sin(time / 3) * 30
          const angle = time / 2
          return {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius + 50 // Keep it lower
          }
        },
        // Pattern 2: Figure-eight pattern
        () => {
          const scale = 80
          return {
            x: Math.sin(time) * scale,
            y: (Math.sin(time * 2) * scale) / 2 + 50 // Keep it lower
          }
        },
        // Pattern 3: Random walk with momentum
        () => {
          // Get current position
          const currentX = position.x
          const currentY = position.y

          // Calculate new direction with some randomness
          let newX = Math.random() * 60 - 30 + Math.sin(time) * 20
          let newY = Math.random() * 60 - 30 + Math.cos(time * 1.3) * 20

          // Add a gentle gravitational pull back to center if ghost wanders too far
          if (Math.abs(currentX) > 150) {
            newX -= currentX * 0.15 // Stronger pull back toward center
          }
          if (Math.abs(currentY) > 150) {
            newY -= (currentY - 50) * 0.15 // Stronger pull back toward center, adjusted for lower position
          }

          return {
            x: Math.max(-200, Math.min(200, currentX + newX)),
            y: Math.max(-200, Math.min(200, currentY + newY))
          }
        }
      ]

      // Select a movement pattern based on time to create variety
      const patternIndex = Math.floor((time / 10) % patterns.length)
      const newPosition = patterns[patternIndex]()

      // Gradually move toward the calculated position (smoother transition)
      setPosition(prev => ({
        x: prev.x + (newPosition.x - prev.x) * 0.1,
        y: prev.y + (newPosition.y - prev.y) * 0.1
      }))
    }

    // Use more frequent updates for smoother animation
    const moveInterval = setInterval(moveGhost, 100)

    // Disappear after duration
    const newTimer = setTimeout(() => {
      setIsVisible(false)
      // Check if onClose exists and is a function before calling it
      if (typeof onClose === 'function') {
        onClose()
      }
    }, duration)

    // Update the timer reference
    setTimer(newTimer)

    return () => {
      clearInterval(moveInterval)
      clearTimeout(newTimer)
    }
  }, [isVisible, duration, onClose])

  const variantClasses = {
    default: 'bg-white text-gray-900',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    error: 'bg-red-100 text-red-800'
  }

  return (
    <div className='relative w-full h-full overflow-visible'>
      <div className='mb-4 flex justify-end'>
        <button
          className='px-3 py-1 text-sm bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors flex items-center gap-1.5'
          onClick={resetGhostPosition}
          aria-label='Reset ghost animation'
        >
          Reset Ghost
        </button>
      </div>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={cn(
              'absolute shadow-lg rounded-lg p-3 flex items-center',
              'backdrop-blur-sm bg-opacity-80 z-50',
              variantClasses[variant],
              className
            )}
            initial={{
              opacity: 0,
              scale: 0.8,
              top: '75%', // Start lower
              left: '50%',
              x: `calc(-50% + ${position.x}px)`,
              y: `calc(-50% + ${position.y}px)`
            }}
            animate={{
              opacity: [0.9, 0.7, 0.9],
              scale: 1,
              x: `calc(-50% + ${position.x}px)`,
              y: `calc(-50% + ${position.y}px)`,
              rotate: [0, position.x > 0 ? 2 : -2, 0]
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              y: `calc(-50% + ${position.y - 20}px)`
            }}
            // Smooth transition
            transition={{
              duration: 0.8,
              ease: 'easeInOut'
            }}
          >
            <div className='flex items-center w-full'>
              <Ghost className='w-5 h-5 mr-2 opacity-80' />
              <p className='text-sm font-medium'>{ghostMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
