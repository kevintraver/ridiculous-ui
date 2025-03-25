'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useAnimationControls, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

// Helper function to determine the modal message based on sink progress
function getMessage(progress: number): string {
  if (progress < 0.1) return 'I feel perfectly fine...'
  if (progress < 0.2) return 'Hmm, these weights are heavy.'
  if (progress < 0.3) return 'Starting to sink down...'
  if (progress < 0.4) return 'Whoa, too many weights!'
  if (progress < 0.5) return "I can't... hold... much longer!"
  return 'TOO HEAVY! GOING DOWN!'
}

export default function OverburdenedModal() {
  // State declarations
  const [isVisible, setIsVisible] = useState(true)
  const [sinkProgress, setSinkProgress] = useState(0)
  const [message, setMessage] = useState(getMessage(0))

  // Refs for DOM elements and animation frames
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  // Animation controls for different elements
  const modalAnimControls = useAnimationControls()
  const chainAnimControls = useAnimationControls()
  const weightAnimControls = useAnimationControls()

  // Increase duration to make the sinking slower
  const ANIMATION_DURATION = 10000 // 10 seconds total

  // Refs to track swaying state
  const lastSwayDirectionRef = useRef(1)
  const lastSwayTimeRef = useRef(Date.now())

  // Animation update function using a requestAnimationFrame loop
  const updateAnimation = useCallback(() => {
    if (!startTimeRef.current) return

    const now = Date.now()
    const elapsed = now - startTimeRef.current
    const progress = Math.min(elapsed / ANIMATION_DURATION, 1)
    setSinkProgress(progress)
    setMessage(getMessage(progress))

    // Ease in-out sine function for smoother speed, avoiding sudden acceleration at the end
    const easedProgress = -(Math.cos(Math.PI * progress) - 1) / 2

    // Calculate vertical position for modal sinking
    const yPosition = 50 + easedProgress * 1750 // move down 1800px total, starting 50px lower to avoid overlapping with the label
    modalAnimControls.set({ y: yPosition })

    // Update the chain's scale
    const chainScale = 1 + easedProgress * 11 // scale up to 12x
    chainAnimControls.set({ scaleY: chainScale })

    // Handle swaying of the weights on a set interval
    const swayInterval = 2000 // every 2 seconds
    const swayAmount = 15 // sway amount in pixels
    if (now - lastSwayTimeRef.current > swayInterval) {
      lastSwayDirectionRef.current *= -1
      lastSwayTimeRef.current = now
      weightAnimControls.start({
        x: lastSwayDirectionRef.current * swayAmount,
        rotate: lastSwayDirectionRef.current * 5,
        transition: { type: 'spring', stiffness: 100, damping: 8 }
      })
    }

    // Continue the animation until complete
    if (progress < 1) {
      animationRef.current = requestAnimationFrame(updateAnimation)
    }
  }, [
    ANIMATION_DURATION,
    modalAnimControls,
    chainAnimControls,
    weightAnimControls
  ])

  // Start the sinking animation when the modal becomes visible, but with a 1-second delay
  useEffect(() => {
    if (isVisible) {
      // Initial position - visible in the container
      modalAnimControls.set({ y: 50 })

      // Then start the animation after a delay
      const timer = setTimeout(() => {
        startTimeRef.current = Date.now()
        updateAnimation()
      }, 1000)

      return () => {
        clearTimeout(timer)
        if (animationRef.current) cancelAnimationFrame(animationRef.current)
      }
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isVisible, updateAnimation, modalAnimControls])

  // Function to reset the modal
  const resetModal = () => {
    setIsVisible(true)
    startTimeRef.current = Date.now()
    setSinkProgress(0)
    setMessage(getMessage(0))
  }

  // Add a useEffect to hide the modal after 5 seconds (adjusted to account for 1s initial delay)
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isVisible])

  // Chain SVG component
  const Chain = () => (
    <motion.svg
      width='40'
      height='60'
      viewBox='0 0 60 150'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      style={{
        position: 'absolute',
        top: -58,
        left: 'calc(50% - 20px)',
        transformOrigin: 'top center',
        filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.2))'
      }}
      animate={chainAnimControls}
    >
      <defs>
        <linearGradient id='chainGradient' x1='0%' y1='0%' x2='100%' y2='0%'>
          <stop offset='0%' stopColor='#999' />
          <stop offset='50%' stopColor='#ccc' />
          <stop offset='100%' stopColor='#888' />
        </linearGradient>
        <pattern
          id='chainLink'
          width='60'
          height='25'
          patternUnits='userSpaceOnUse'
        >
          <path
            d='M10,12.5 A7.5,5 0 0 0 25,12.5 A7.5,5 0 0 0 40,12.5 A7.5,5 0 0 0 55,12.5'
            stroke='url(#chainGradient)'
            strokeWidth='4'
            fill='none'
            strokeLinecap='round'
          />
          <path
            d='M15,5 A5,7.5 0 0 1 15,20 A5,7.5 0 0 1 15,5'
            stroke='url(#chainGradient)'
            strokeWidth='4'
            fill='none'
            strokeLinecap='round'
          />
          <path
            d='M50,5 A5,7.5 0 0 1 50,20 A5,7.5 0 0 1 50,5'
            stroke='url(#chainGradient)'
            strokeWidth='4'
            fill='none'
            strokeLinecap='round'
          />
        </pattern>
      </defs>
      <rect x='5' y='0' width='50' height='150' fill='url(#chainLink)' />
    </motion.svg>
  )

  // PrisonerWeights component: the weights stay positioned on top of the modal
  const PrisonerWeights = () => (
    <motion.div
      animate={weightAnimControls}
      style={{ transformOrigin: 'bottom center' }}
    >
      <svg
        width='140'
        height='80'
        viewBox='0 0 140 80'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <defs>
          <filter id='shadow' x='-20%' y='-20%' width='140%' height='140%'>
            <feDropShadow dx='0' dy='4' stdDeviation='4' floodOpacity='0.4' />
          </filter>
        </defs>
        <rect
          x='25'
          y='60'
          width='90'
          height='15'
          rx='2'
          fill='#333'
          filter='url(#shadow)'
        />
        <ellipse
          cx='35'
          cy='67.5'
          rx='5'
          ry='5'
          fill='#222'
          stroke='#444'
          strokeWidth='1'
        />
        <ellipse
          cx='105'
          cy='67.5'
          rx='5'
          ry='5'
          fill='#222'
          stroke='#444'
          strokeWidth='1'
        />
        <rect
          x='30'
          y='45'
          width='80'
          height='15'
          rx='2'
          fill='#444'
          filter='url(#shadow)'
        />
        <ellipse
          cx='40'
          cy='52.5'
          rx='4'
          ry='4'
          fill='#333'
          stroke='#555'
          strokeWidth='1'
        />
        <ellipse
          cx='100'
          cy='52.5'
          rx='4'
          ry='4'
          fill='#333'
          stroke='#555'
          strokeWidth='1'
        />
        <rect
          x='35'
          y='30'
          width='70'
          height='15'
          rx='2'
          fill='#555'
          filter='url(#shadow)'
        />
        <ellipse
          cx='45'
          cy='37.5'
          rx='4'
          ry='4'
          fill='#444'
          stroke='#666'
          strokeWidth='1'
        />
        <ellipse
          cx='95'
          cy='37.5'
          rx='4'
          ry='4'
          fill='#444'
          stroke='#666'
          strokeWidth='1'
        />
        <rect
          x='40'
          y='15'
          width='60'
          height='15'
          rx='2'
          fill='#666'
          filter='url(#shadow)'
        />
        <ellipse
          cx='50'
          cy='22.5'
          rx='3'
          ry='3'
          fill='#555'
          stroke='#777'
          strokeWidth='1'
        />
        <ellipse
          cx='90'
          cy='22.5'
          rx='3'
          ry='3'
          fill='#555'
          stroke='#777'
          strokeWidth='1'
        />
        <rect x='67' y='5' width='6' height='65' fill='#888' />
        <rect x='60' y='0' width='20' height='5' rx='2' fill='#999' />
      </svg>
    </motion.div>
  )

  return (
    <div
      className='relative flex flex-col items-center min-h-[400px] w-full mb-32 pt-2'
      ref={containerRef}
    >
      {!isVisible && (
        <div className='absolute top-0 left-0 right-0 flex justify-center'>
          <Button onClick={resetModal} className='mt-4' variant='outline'>
            <RefreshCw className='w-4 h-4 mr-2' />
            Reset Modal
          </Button>
        </div>
      )}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            className='relative'
            initial={{ opacity: 1 }}
            animate={modalAnimControls}
            exit={{ y: 1800, transition: { duration: 0.8 } }}
          >
            <Chain />
            <div
              className='absolute'
              style={{ top: -70, left: 'calc(50% - 70px)', zIndex: 10 }}
            >
              <PrisonerWeights />
            </div>
            <div className='p-6 shadow-lg rounded-lg bg-white dark:bg-gray-800 relative overflow-hidden w-64'>
              <div className='absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 opacity-50'></div>
              <div className='relative space-y-4'>
                <h2 className='text-xl font-bold text-center'>
                  Overburdened Modal
                </h2>
                <p className='text-center text-sm'>
                  This modal is carrying too much weight!
                </p>
                <div className='text-center text-sm'>
                  <p
                    className={
                      message.includes('TOO HEAVY')
                        ? 'font-bold animate-pulse'
                        : message.includes('hold')
                          ? 'font-semibold'
                          : ''
                    }
                  >
                    {message}
                  </p>
                </div>
                <p className='text-xs text-gray-500 text-center italic mt-4'>
                  Watch as gravity takes its toll...
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
