'use client'

import type React from 'react'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function EscapingButton() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isEscaping, setIsEscaping] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const speedRef = useRef({ x: 3, y: 2 })

  // Detect if device has touch capability
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  // Move the button autonomously on touch devices
  useEffect(() => {
    if (!isTouchDevice || clickCount >= 5 || !containerRef.current) return

    let lastTime = 0

    const moveButton = (timestamp: number) => {
      if (!containerRef.current || clickCount >= 5) return
      
      // Update position only every ~16ms for smoother animation
      if (timestamp - lastTime < 16) {
        animationRef.current = requestAnimationFrame(moveButton)
        return
      }
      
      lastTime = timestamp
      
      const container = containerRef.current.getBoundingClientRect()
      const buttonEl = containerRef.current.querySelector('button')
      if (!buttonEl) return
      
      const button = buttonEl.getBoundingClientRect()
      const containerWidth = container.width - button.width
      const containerHeight = container.height - button.height

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
          newX = containerWidth - 1
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
          newY = containerHeight - 1
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
      const maxSpeed = 5
      speedRef.current.x = Math.max(-maxSpeed, Math.min(maxSpeed, speedRef.current.x))
      speedRef.current.y = Math.max(-maxSpeed, Math.min(maxSpeed, speedRef.current.y))

      setPosition({ 
        x: Math.max(0, Math.min(containerWidth, newX)), 
        y: Math.max(0, Math.min(containerHeight, newY)) 
      })
      
      animationRef.current = requestAnimationFrame(moveButton)
    }

    animationRef.current = requestAnimationFrame(moveButton)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isTouchDevice, clickCount, position])

  // Move the button when mouse gets close (only for non-touch devices)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isTouchDevice || !containerRef.current || clickCount >= 5) return

    const container = containerRef.current.getBoundingClientRect()
    const button = e.currentTarget.getBoundingClientRect()

    const mouseX = e.clientX - container.left
    const mouseY = e.clientY - container.top
    const buttonCenterX = button.left - container.left + button.width / 2
    const buttonCenterY = button.top - container.top + button.height / 2

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

  const handleClick = () => {
    setClickCount(prev => prev + 1)
  }

  useEffect(() => {
    if (clickCount >= 5) {
      setPosition({ x: 0, y: 0 })
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [clickCount])

  return (
    <Card>
      <CardContent className='p-6'>
        <div
          ref={containerRef}
          className='relative h-[200px] border rounded-md p-4 bg-background'
        >
          <div
            style={{
              transform: `translate(${position.x}px, ${position.y}px)`,
              transition: isEscaping ? 'transform 0.2s ease-out' : 'none',
              position: 'absolute'
            }}
          >
            <Button onMouseMove={handleMouseMove} onClick={handleClick}>
              {clickCount >= 5 ? 'You caught me!' : 'Try to click me!'}
            </Button>
          </div>

          {clickCount >= 5 && (
            <div className='absolute bottom-4 left-0 right-0 text-center text-sm text-green-500 font-medium'>
              Congratulations! You've successfully clicked the uncatchable
              button!
            </div>
          )}

          <div className='absolute bottom-4 left-4 text-xs text-muted-foreground'>
            Click count: {clickCount}/5
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
