'use client'

import type React from 'react'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'

export default function EscapingButton() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isEscaping, setIsEscaping] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [isMovingEnabled, setIsMovingEnabled] = useState(false)
  const animationRef = useRef<number | null>(null)
  const speedRef = useRef({ x: 5, y: 4 })

  // Initialize position with a random value (will be set properly when container is available)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  // Detect if device has touch capability and set random initial position
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)

    // Set random initial position after container is available
    const setRandomPosition = () => {
      if (containerRef.current) {
        const container = containerRef.current.getBoundingClientRect()
        const button = containerRef.current.querySelector('button')

        if (button) {
          const buttonRect = button.getBoundingClientRect()
          const maxX = container.width - buttonRect.width
          const maxY = container.height - buttonRect.height

          // Use random position within the container bounds
          setPosition({
            x: Math.random() * maxX,
            y: Math.random() * maxY
          })
        }
      }
    }

    // Wait a frame for the container to be properly sized
    requestAnimationFrame(() => {
      setRandomPosition()
    })
  }, [])

  // Common button movement logic used by both touch and non-touch devices
  // Reference for animation timing
  const lastTimeRef = useRef<number | null>(null)

  const moveButtonLogic = useCallback(
    (timestamp: number) => {
      if (!containerRef.current || clickCount >= 5) return

      // Update position frequently for smoother animation
      if (!lastTimeRef.current || timestamp - lastTimeRef.current < 10) {
        animationRef.current = requestAnimationFrame(moveButtonLogic)
        lastTimeRef.current = lastTimeRef.current || timestamp
        return
      }

      lastTimeRef.current = timestamp

      const container = containerRef.current.getBoundingClientRect()
      const buttonEl = containerRef.current.querySelector('button')
      if (!buttonEl) return

      const button = buttonEl.getBoundingClientRect()

      // Ensure button stays within container boundaries
      const containerWidth = Math.max(0, container.width - button.width)
      const containerHeight = Math.max(0, container.height - button.height)

      let newX = position.x + speedRef.current.x
      let newY = position.y + speedRef.current.y

      // Bounce off walls by reversing direction with a bit of randomness
      if (newX <= 0 || newX >= containerWidth) {
        // Add slight variation to prevent getting stuck in patterns
        speedRef.current.x = -speedRef.current.x * (0.9 + Math.random() * 0.2)
        // Make sure we're actually moving away from the wall
        if (newX <= 0) {
          newX = 1
          speedRef.current.x = Math.abs(speedRef.current.x)
        } else {
          newX = Math.min(containerWidth - 1, containerWidth)
          speedRef.current.x = -Math.abs(speedRef.current.x)
        }
      }

      if (newY <= 0 || newY >= containerHeight) {
        // Add slight variation to prevent getting stuck in patterns
        speedRef.current.y = -speedRef.current.y * (0.9 + Math.random() * 0.2)
        // Make sure we're actually moving away from the wall
        if (newY <= 0) {
          newY = 1
          speedRef.current.y = Math.abs(speedRef.current.y)
        } else {
          newY = Math.min(containerHeight - 1, containerHeight)
          speedRef.current.y = -Math.abs(speedRef.current.y)
        }
      }

      // Occasionally change direction randomly to make movement more unpredictable
      if (Math.random() < 0.01) {
        speedRef.current.x = speedRef.current.x * (0.8 + Math.random() * 0.4)
        speedRef.current.y = speedRef.current.y * (0.8 + Math.random() * 0.4)
      }

      // Ensure minimum speed
      const minSpeed = 1
      if (Math.abs(speedRef.current.x) < minSpeed) {
        speedRef.current.x = minSpeed * Math.sign(speedRef.current.x)
      }
      if (Math.abs(speedRef.current.y) < minSpeed) {
        speedRef.current.y = minSpeed * Math.sign(speedRef.current.y)
      }

      // Cap maximum speed
      const maxSpeed = 8
      speedRef.current.x = Math.max(
        -maxSpeed,
        Math.min(maxSpeed, speedRef.current.x)
      )
      speedRef.current.y = Math.max(
        -maxSpeed,
        Math.min(maxSpeed, speedRef.current.y)
      )

      // Ensure button stays within bounds with extra safety check
      setPosition({
        x: Math.max(0, Math.min(containerWidth, newX)),
        y: Math.max(0, Math.min(containerHeight, newY))
      })

      animationRef.current = requestAnimationFrame(moveButtonLogic)
    },
    [clickCount, position]
  )

  // Move the button autonomously on touch devices
  useEffect(() => {
    if (!isTouchDevice || clickCount >= 5 || !containerRef.current) return

    lastTimeRef.current = null
    animationRef.current = requestAnimationFrame(moveButtonLogic)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isTouchDevice, clickCount, moveButtonLogic])

  // Move the button autonomously on desktop when enabled
  useEffect(() => {
    if (
      isTouchDevice ||
      !isMovingEnabled ||
      clickCount >= 5 ||
      !containerRef.current
    )
      return

    lastTimeRef.current = null
    animationRef.current = requestAnimationFrame(moveButtonLogic)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isTouchDevice, isMovingEnabled, clickCount, moveButtonLogic])

  // Move the button when mouse gets close (only for non-touch devices)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isTouchDevice || !containerRef.current || clickCount >= 5) return

    // In movement mode, button already moves, so don't do additional evasion
    if (isMovingEnabled) return

    const container = containerRef.current.getBoundingClientRect()
    const button = e.currentTarget.getBoundingClientRect()

    const mouseX = e.clientX - container.left
    const mouseY = e.clientY - container.top
    const buttonCenterX = position.x + button.width / 2
    const buttonCenterY = position.y + button.height / 2

    // Calculate distance between mouse and button center
    const distance = Math.sqrt(
      Math.pow(mouseX - buttonCenterX, 2) + Math.pow(mouseY - buttonCenterY, 2)
    )

    // If mouse is close enough, move the button
    if (distance < 100 && !isEscaping) {
      setIsEscaping(true)

      // Calculate new position (move away from mouse)
      const angle = Math.atan2(buttonCenterY - mouseY, buttonCenterX - mouseX)
      const moveDistance = 100

      const containerWidth = container.width - button.width
      const containerHeight = container.height - button.height

      let newX = position.x + Math.cos(angle) * moveDistance
      let newY = position.y + Math.sin(angle) * moveDistance

      // Keep button within container bounds
      newX = Math.max(0, Math.min(containerWidth, newX))
      newY = Math.max(0, Math.min(containerHeight, newY))

      setPosition({ x: newX, y: newY })

      // Reset escaping state after a short delay
      setTimeout(() => setIsEscaping(false), 100)
    }
  }

  const toggleMoving = () => {
    const newState = !isMovingEnabled
    setIsMovingEnabled(newState)

    // If turning off, cancel any active animations
    if (!newState && animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
  }

  // Set button to a random position
  const setRandomPosition = () => {
    if (containerRef.current) {
      const container = containerRef.current.getBoundingClientRect()
      const button = containerRef.current.querySelector('button')

      if (button) {
        const buttonRect = button.getBoundingClientRect()
        const maxX = container.width - buttonRect.width
        const maxY = container.height - buttonRect.height

        // Use random position within the container bounds
        setPosition({
          x: Math.random() * maxX,
          y: Math.random() * maxY
        })
      }
    }
  }

  const handleClick = () => {
    if (clickCount >= 5) {
      // Reset the game when clicked after completing
      setClickCount(0)
      setIsEscaping(false)
      speedRef.current = { x: 5, y: 4 }

      // Set a new random position
      setRandomPosition()

      // Animation will restart via useEffect dependencies
    } else {
      setClickCount(prev => prev + 1)
    }
  }

  useEffect(() => {
    if (clickCount >= 5) {
      // Keep the button in its current position when caught
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [clickCount])

  return (
    <div className='space-y-4'>
      <Card>
        <CardContent className='p-6'>
          <div
            ref={containerRef}
            className='relative h-[200px] border rounded-md p-4 bg-background overflow-hidden'
          >
            <div
              style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                transition: isEscaping ? 'transform 0.2s ease-out' : 'none',
                position: 'absolute'
              }}
            >
              <Button onMouseMove={handleMouseMove} onClick={handleClick}>
                {clickCount >= 5 ? 'Reset' : 'Try to click me!'}
              </Button>
            </div>
          </div>

          <div className='flex items-center justify-between mt-4'>
            <div className='text-xs text-muted-foreground'>
              Click count: {clickCount}/5
            </div>

            {!isTouchDevice && (
              <div className='flex items-center space-x-2'>
                <span className='text-xs text-muted-foreground'>
                  {isMovingEnabled ? 'Auto-moving' : 'Cursor-evasion'}
                </span>
                <Switch
                  checked={isMovingEnabled}
                  onCheckedChange={toggleMoving}
                  aria-label='Toggle button movement'
                />
              </div>
            )}
          </div>

          {clickCount >= 5 && (
            <div className='text-center text-sm text-green-500 font-medium mt-4'>
              Congratulations! You've successfully clicked the uncatchable
              button! Click "Reset" to play again.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
