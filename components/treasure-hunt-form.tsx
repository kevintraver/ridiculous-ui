'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function TreasureHuntForm() {
  // State for tracking positions and form data
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 })
  const [distance, setDistance] = useState(0)
  const [message, setMessage] = useState(
    'Start moving your mouse to find the hidden button!'
  )
  const [intensity, setIntensity] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [taps, setTaps] = useState<
    Array<{ x: number; y: number; time: number }>
  >([])
  const [showTap, setShowTap] = useState<{
    x: number
    y: number
    show: boolean
  }>({ x: 0, y: 0, show: false })

  // References
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Check if user is on mobile
  useEffect(() => {
    setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  // Set random position for the button when component mounts
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth - 80
      const containerHeight = containerRef.current.offsetHeight - 40

      const randomX = Math.floor(Math.random() * containerWidth)
      const randomY = Math.floor(Math.random() * containerHeight)

      setButtonPosition({ x: randomX, y: randomY })
    }
  }, [])

  // Track mouse movement on desktop
  useEffect(() => {
    if (isMobile) return

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        setMousePosition({ x, y })

        // Calculate distance to button
        const dx = x - buttonPosition.x
        const dy = y - buttonPosition.y
        const newDistance = Math.sqrt(dx * dx + dy * dy)
        setDistance(newDistance)

        // Set feedback intensity based on proximity (inverted and normalized)
        const maxDistance = Math.sqrt(
          containerRef.current.offsetWidth * containerRef.current.offsetWidth +
            containerRef.current.offsetHeight *
              containerRef.current.offsetHeight
        )
        const newIntensity = 1 - Math.min(newDistance / (maxDistance / 2), 1)
        setIntensity(newIntensity)

        // Update hint message
        updateHintMessage(newDistance, dx, dy)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [buttonPosition, isMobile])

  // Handle mobile taps
  const handleTap = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isMobile || submitted) return

    const touch = 'touches' in e ? e : null
    let clientX, clientY

    if (touch && touch.touches.length > 0) {
      clientX = touch.touches[0].clientX
      clientY = touch.touches[0].clientY
    } else {
      clientX = 'clientX' in e ? e.clientX : 0
      clientY = 'clientY' in e ? e.clientY : 0
    }

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top

      // Add to taps history
      const newTap = { x, y, time: Date.now() }
      setTaps(prev => [...prev.slice(-5), newTap]) // Keep last 5 taps

      // Show tap indicator briefly
      setShowTap({ x, y, show: true })
      setTimeout(() => setShowTap(prev => ({ ...prev, show: false })), 1000)

      // Calculate distance to button
      const dx = x - buttonPosition.x
      const dy = y - buttonPosition.y
      const newDistance = Math.sqrt(dx * dx + dy * dy)

      // Check if they found the button
      if (newDistance < 30) {
        setSubmitted(true)
        return
      }

      // Update hint based on this tap
      updateHintMessage(newDistance, dx, dy)
    }
  }

  // Function to update the hint message based on distance and direction
  const updateHintMessage = (distance: number, dx: number, dy: number) => {
    // Direction guidance
    let direction = ''
    if (Math.abs(dx) > Math.abs(dy)) {
      direction = dx > 0 ? 'left' : 'right'
    } else {
      direction = dy > 0 ? 'up' : 'down'
    }

    // Temperature guidance based on distance
    if (distance < 50) {
      setMessage("Hot! You're burning up! 🔥")
    } else if (distance < 100) {
      setMessage(`Very warm! Move ${direction}! 🔥`)
    } else if (distance < 200) {
      setMessage(`Warm! Keep moving ${direction}! 🌡️`)
    } else if (distance < 300) {
      setMessage(`Lukewarm... try moving ${direction}. 😐`)
    } else if (distance < 400) {
      setMessage(`Cool... keep searching. Try ${direction}? ❄️`)
    } else {
      setMessage("Cold! You're far away! ❄️❄️")
    }
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  // Reset the game
  const resetGame = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth - 80
      const containerHeight = containerRef.current.offsetHeight - 40

      const randomX = Math.floor(Math.random() * containerWidth)
      const randomY = Math.floor(Math.random() * containerHeight)

      setButtonPosition({ x: randomX, y: randomY })
      setSubmitted(false)
      setMessage(
        isMobile
          ? 'Tap around to find the hidden button!'
          : 'Start moving your mouse to find the hidden button!'
      )
      setTaps([])
    }
  }

  // Check if mouse is hovering directly over button
  const isHoveringButton = distance < 30

  return (
    <div className='w-full max-w-3xl'>
      <h2 className='text-2xl font-bold mb-4'>Treasure Hunt Form</h2>

      <Card className='w-full'>
        <CardContent className='p-6'>
          <div
            ref={containerRef}
            className='relative bg-slate-100 dark:bg-slate-800 rounded-md w-full h-[400px] overflow-hidden'
            style={{ cursor: isMobile ? 'default' : 'none' }}
            onClick={handleTap}
            onTouchStart={handleTap}
          >
            {/* Desktop: Custom cursor */}
            {!isMobile && (
              <div
                className='absolute pointer-events-none z-10 flex justify-center items-center'
                style={{
                  left: `${mousePosition.x - 20}px`,
                  top: `${mousePosition.y - 20}px`,
                  width: '40px',
                  height: '40px',
                  background: `radial-gradient(circle, transparent, transparent 30%, rgba(255,${Math.floor(intensity * 255)},0,${intensity * 0.5}) 70%)`,
                  border: `2px solid rgba(255,${Math.floor(intensity * 255)},0,${intensity * 0.8})`,
                  borderRadius: '50%',
                  transform: 'scale(1.5)'
                }}
              >
                <div
                  className='w-1 h-10 bg-black dark:bg-white absolute'
                  style={{ transform: 'rotate(45deg)' }}
                />
                <div
                  className='w-10 h-1 bg-black dark:bg-white absolute'
                  style={{ transform: 'rotate(45deg)' }}
                />
              </div>
            )}

            {/* Mobile: Tap indicators */}
            {isMobile &&
              taps.map((tap, index) => (
                <div
                  key={index}
                  className='absolute w-6 h-6 rounded-full bg-blue-500/30 pointer-events-none z-10'
                  style={{
                    left: `${tap.x - 12}px`,
                    top: `${tap.y - 12}px`,
                    opacity: Date.now() - tap.time < 2000 ? 0.7 : 0.3
                  }}
                />
              ))}

            {/* Mobile: Current tap indicator */}
            {isMobile && showTap.show && (
              <div
                className='absolute z-20 pointer-events-none'
                style={{
                  left: `${showTap.x - 25}px`,
                  top: `${showTap.y - 25}px`
                }}
              >
                <div className='w-12 h-12 rounded-full border-4 border-blue-500 animate-ping' />
              </div>
            )}

            {/* Hidden submit button */}
            <button
              ref={buttonRef}
              type='submit'
              form='treasureForm'
              className='absolute z-20 w-10 h-10 rounded-full flex items-center justify-center overflow-hidden'
              style={{
                left: `${buttonPosition.x}px`,
                top: `${buttonPosition.y}px`,
                opacity: isHoveringButton ? 1 : 0,
                background: isHoveringButton
                  ? 'rgba(255, 215, 0, 0.9)'
                  : 'transparent',
                border: isHoveringButton ? '2px solid gold' : 'none',
                transition: 'opacity 0.2s ease-in-out',
                cursor: 'pointer'
              }}
              onClick={handleSubmit}
            >
              {isHoveringButton && (
                <span className='text-xs font-bold'>Click!</span>
              )}
            </button>

            {/* Hint message */}
            <div className='absolute left-0 right-0 top-4 text-center bg-white/80 dark:bg-black/80 py-2 px-4 font-bold'>
              {message}
            </div>

            {/* Mobile instructions */}
            {isMobile && (
              <div className='absolute left-0 right-0 bottom-4 text-center bg-white/80 dark:bg-black/80 py-2 px-4 text-sm'>
                Tap anywhere to get hints. Blue circles show your previous taps.
              </div>
            )}

            {/* Form (invisible but functional) */}
            <form id='treasureForm' onSubmit={handleSubmit} className='hidden'>
              <input type='hidden' name='found' value='true' />
            </form>

            {/* Success overlay */}
            {submitted && (
              <div className='absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-30'>
                <div className='text-center bg-white dark:bg-gray-800 p-6 rounded-lg'>
                  <h3 className='text-2xl font-bold mb-2'>
                    🎉 Treasure Found! 🎉
                  </h3>
                  <p className='mb-4'>
                    Congratulations! You've found the hidden button.
                  </p>
                  <Button onClick={resetGame}>Play Again</Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
