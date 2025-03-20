'use client'

import type React from 'react'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function EscapingButton() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isEscaping, setIsEscaping] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Move the button when mouse gets close
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || clickCount >= 5) return

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
