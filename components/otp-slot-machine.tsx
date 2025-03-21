'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function SlotMachineOTP() {
  const [digits, setDigits] = useState<number[]>(Array(6).fill(0))
  const [spinning, setSpinning] = useState<boolean[]>(Array(6).fill(true))
  const [complete, setComplete] = useState(false)
  const [showOTP, setShowOTP] = useState(false)

  // References to each digit's interval
  const intervals = useRef<(NodeJS.Timeout | null)[]>(Array(6).fill(null))

  // Speed variation for each digit (milliseconds between updates)
  const speeds = [120, 140, 100, 130, 110, 150]

  // Stop a specific digit
  const stopDigit = (index: number) => {
    if (!spinning[index]) return

    // Clear the interval to stop the number changing
    if (intervals.current[index]) {
      clearInterval(intervals.current[index]!)
      intervals.current[index] = null
    }

    // Update the spinning state
    const newSpinning = [...spinning]
    newSpinning[index] = false
    setSpinning(newSpinning)

    // Check if all digits are stopped
    if (newSpinning.every(s => !s)) {
      setComplete(true)
    }
  }

  // Stop all digits from spinning simultaneously
  const stopAllDigits = () => {
    // Clear all intervals
    intervals.current.forEach((interval, i) => {
      if (interval) {
        clearInterval(interval)
        intervals.current[i] = null
      }
    })
    // Update the spinning state for all digits at once
    const newSpinning = Array(6).fill(false)
    setSpinning(newSpinning)
    // Mark the slot machine as complete if all digits are stopped
    setComplete(true)
  }

  // Reset the entire machine
  const reset = () => {
    // Stop all intervals
    intervals.current.forEach((interval, i) => {
      if (interval) {
        clearInterval(interval)
        intervals.current[i] = null
      }
    })

    // Reset state
    setSpinning(Array(6).fill(true))
    setComplete(false)

    // Start spinning all digits again
    startSpinningAll()
  }

  // Start spinning all digits
  const startSpinningAll = () => {
    // First clear any existing intervals
    intervals.current.forEach((interval, i) => {
      if (interval) {
        clearInterval(interval)
        intervals.current[i] = null
      }
    })

    // Start new intervals for each digit
    for (let i = 0; i < 6; i++) {
      startSpinning(i)
    }
  }

  // Start spinning a specific digit
  const startSpinning = (index: number) => {
    // Set initial speed based on index
    const speed = speeds[index]

    // Create interval to update the digit
    intervals.current[index] = setInterval(() => {
      setDigits(prev => {
        const newDigits = [...prev]
        // Cycle through 0-9
        newDigits[index] = (newDigits[index] + 1) % 10
        return newDigits
      })
    }, speed)
  }

  // Start spinning on initial load
  useEffect(() => {
    startSpinningAll()

    // Cleanup on unmount
    return () => {
      intervals.current.forEach(interval => {
        if (interval) clearInterval(interval)
      })
    }
  }, [])

  useEffect(() => {
    if (complete) {
      const timer = setTimeout(() => setShowOTP(true), 300)
      return () => clearTimeout(timer)
    } else {
      setShowOTP(false)
    }
  }, [complete])

  return (
    <div className='flex flex-col items-center gap-4'>
      <div className='relative rounded-lg border border-input bg-muted/20 p-3 shadow-sm'>
        <div className='flex gap-2 items-center'>
          {/* First group of 3 digits */}
          <div className='flex gap-1'>
            {[0, 1, 2].map(i => (
              <AnimatedDigitBox
                key={i}
                digit={digits[i]}
                spinning={spinning[i]}
                onClick={() => stopDigit(i)}
              />
            ))}
          </div>

          {/* Divider */}
          <div className='w-2 h-10 flex items-center justify-center'>
            <div className='w-[2px] h-6 bg-muted-foreground/30 rounded'></div>
          </div>

          {/* Second group of 3 digits */}
          <div className='flex gap-1'>
            {[3, 4, 5].map(i => (
              <AnimatedDigitBox
                key={i}
                digit={digits[i]}
                spinning={spinning[i]}
                onClick={() => stopDigit(i)}
              />
            ))}
          </div>

          {/* Slot machine lever - shown in different states */}
          <div
            className='absolute -right-4 top-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer'
            onClick={stopAllDigits}
          >
            <div
              className={`w-1.5 h-8 bg-red-500 rounded-t-full transition-transform duration-300 ${
                complete ? 'transform rotate-12 origin-bottom' : ''
              }`}
            ></div>
            <div className='w-3 h-3 bg-red-600 rounded-full'></div>
          </div>
        </div>
      </div>

      <div className='flex flex-col items-center gap-2'>
        {showOTP && (
          <p className='text-sm font-medium text-green-600 dark:text-green-500'>
            OTP: {digits.join('')}
          </p>
        )}

        <button
          onClick={reset}
          className='px-3 py-1 text-xs font-medium rounded bg-primary text-primary-foreground'
        >
          {complete ? 'Spin Again' : 'Reset'}
        </button>
      </div>
      <p className='text-xs text-center text-muted-foreground'>
        Click on an individual reel or pull the lever to stop them all.
      </p>
    </div>
  )
}

// Animated digit box using Framer Motion for the visual effect
function AnimatedDigitBox({
  digit,
  spinning,
  onClick
}: {
  digit: number
  spinning: boolean
  onClick: () => void
}) {
  const digitHeight = 48
  const reelDigits = Array.from({ length: 20 }, (_, i) => i % 10)

  return (
    <div
      className={cn(
        'relative w-10 h-12 rounded-md cursor-pointer select-none overflow-hidden',
        'border-2',
        spinning
          ? 'border-input bg-background'
          : 'border-green-500 bg-green-50 dark:bg-green-950/20',
        'shadow-inner'
      )}
      onClick={onClick}
    >
      {/* Shadow overlays for 3D effect */}
      <div className='absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-background to-transparent z-10'></div>
      <div className='absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-background to-transparent z-10'></div>

      {/* Jackpot line */}
      <div className='absolute left-1 right-1 h-[2px] top-1/2 -translate-y-1/2 bg-red-400/60 z-10'></div>

      {/* Animated digit */}
      <div className='absolute inset-0 overflow-hidden'>
        {spinning ? (
          <motion.div
            animate={{ y: ['0%', '-100%'] }}
            transition={{ duration: 1, ease: 'linear', repeat: Infinity }}
            className='flex flex-col'
          >
            {reelDigits.map((d, i) => (
              <div
                key={i}
                className='h-12 flex items-center justify-center text-xl'
              >
                {d}
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            animate={{ y: -(digit * digitHeight) }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className='flex flex-col'
          >
            {reelDigits.map((d, i) => (
              <div
                key={i}
                className='h-12 flex items-center justify-center text-xl'
              >
                {d}
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Visual indicator for clickability */}
      {spinning && (
        <div className='absolute inset-0 bg-primary/10 animate-pulse pointer-events-none opacity-0 hover:opacity-100 transition-opacity' />
      )}
    </div>
  )
}
