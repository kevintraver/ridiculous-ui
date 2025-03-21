'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { RefreshCw, Copy } from 'lucide-react'

export default function SlotMachineOTP() {
  const [digits, setDigits] = useState<number[]>(Array(6).fill(0))
  const [spinning, setSpinning] = useState<boolean[]>(Array(6).fill(true))
  const [complete, setComplete] = useState(false)
  const [showOTP, setShowOTP] = useState(false)
  const [leverPulled, setLeverPulled] = useState(false)

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
      setLeverPulled(true)
    }
  }

  // Stop all digits from spinning simultaneously
  const stopAllDigits = () => {
    if (!leverPulled) {
      setLeverPulled(true)

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

    // Reset state with a small delay for the lever animation
    setTimeout(() => {
      setSpinning(Array(6).fill(true))
      setComplete(false)
      setLeverPulled(false)

      // Start spinning all digits again
      startSpinningAll()
    }, 150) // Small delay for lever animation to complete
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

  // Update lever state when all digits are stopped
  useEffect(() => {
    if (spinning.every(s => !s) && !leverPulled) {
      setLeverPulled(true)
    }
  }, [spinning, leverPulled])

  // Auto-restart has been disabled as requested

  return (
    <div className='flex flex-col items-center gap-4'>
      <motion.p
        className='text-xs text-center text-muted-foreground max-w-xs'
        initial={{ opacity: 0.8 }}
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        Click on an individual reel or pull the lever to stop them all.
      </motion.p>
      <div className='flex flex-col items-center gap-2'>
        <motion.button
          onClick={reset}
          className='px-3 py-1 text-xs font-medium rounded bg-primary text-primary-foreground flex items-center gap-1'
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className='w-3 h-3' />
          {complete ? 'Spin Again' : 'Reset'}
        </motion.button>
      </div>
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
                speed={speeds[i]}
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
                speed={speeds[i]}
              />
            ))}
          </div>

          {/* Animated slot machine lever */}
          <motion.div
            className='absolute -right-4 top-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer'
            onClick={spinning.some(s => s) ? stopAllDigits : reset}
            title={
              spinning.some(s => s) ? 'Pull lever to stop' : 'Reset machine'
            }
          >
            <motion.div
              className='w-1.5 h-10 bg-red-500 rounded-t-full translate-y-3'
              animate={{
                rotateZ: leverPulled ? 35 : 0,
                x: leverPulled ? 3 : 0,
                y: leverPulled ? 1 : 0
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20
              }}
              style={{ originY: 1 }}
            ></motion.div>
            <motion.div
              className='w-3 h-3 bg-gradient-to-b from-red-500 to-red-600 rounded-full shadow-md border border-red-700'
              transition={{
                duration: 0.3
              }}
            ></motion.div>
          </motion.div>
        </div>
      </div>

      <div className='flex flex-col items-center gap-2'>
        {showOTP && (
          <div className='flex items-center gap-2'>
            <p className='text-lg font-medium text-black'>{digits.join('')}</p>
            <button
              onClick={() => navigator.clipboard.writeText(digits.join(''))}
              className='p-1 rounded hover:bg-gray-200'
              title='Copy OTP to clipboard'
            >
              <Copy className='w-5 h-5' />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Animated digit box using Framer Motion for the visual effect
function AnimatedDigitBox({
  digit,
  spinning,
  onClick,
  speed
}: {
  digit: number
  spinning: boolean
  onClick: () => void
  speed: number
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

      {/* Animated digit */}
      <div className='absolute inset-0 overflow-hidden'>
        {spinning ? (
          <motion.div
            animate={{ y: ['0%', '-100%'] }}
            transition={{
              duration: speed / 125,
              ease: 'linear',
              repeat: Infinity
            }}
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
