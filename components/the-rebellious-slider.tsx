'use client'

import { useState, useEffect, useRef } from 'react'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function TheRebelliousSlider() {
  // Slider value between 0 and 100, starting at 50 (middle)
  const [value, setValue] = useState(50)
  // New state for position
  const [position, setPosition] = useState({ x: 0, y: 0 })
  // Message for taunts and mood changes
  const [message, setMessage] = useState<string | null>(null)
  // Flag to indicate if the user is actively holding the slider thumb
  const [isHolding, setIsHolding] = useState(false)
  // Flag to indicate if user has held for 3+ seconds and the slider "gives in"
  const [isHeld, setIsHeld] = useState(false)
  // Refs for timers
  const holdTimer = useRef<NodeJS.Timeout | null>(null)
  const autoChangeTimer = useRef<NodeJS.Timeout | null>(null)
  const jitterTimer = useRef<NodeJS.Timeout | null>(null)

  // Taunting messages for user dragging
  const tauntMessages = [
    `Nope, I don't feel like it!`,
    `Not today, buddy!`,
    `You're not the boss of me!`
  ]

  // Automatic messages when the slider takes charge
  const rebelMessages = [
    `I'm in charge here.`,
    `Let's do it my way.`,
    `Ha! I rule this slider!`
  ]

  // Clear any auto-change timer
  const clearAutoChangeTimer = () => {
    if (autoChangeTimer.current) {
      clearTimeout(autoChangeTimer.current)
      autoChangeTimer.current = null
    }
  }

  // When user presses down on the slider thumb
  const handleMouseDown = () => {
    setIsHolding(true)
    // Start hold timer: if held for 3 seconds, slider gives in
    holdTimer.current = setTimeout(() => {
      setIsHeld(true)
      setMessage(`FINE, have it your way… for now.`)
    }, 3000)
  }

  // When user releases the slider thumb
  const handleMouseUp = () => {
    setIsHolding(false)
    if (holdTimer.current) {
      clearTimeout(holdTimer.current)
      holdTimer.current = null
    }
    // Clear the "gave in" state after a short delay
    if (isHeld) {
      setTimeout(() => {
        setIsHeld(false)
        setMessage(null)
      }, 2000)
    }
  }

  // When the slider value changes (triggered by user dragging)
  const handleValueChange = (newVal: number) => {
    if (isHolding && !isHeld) {
      // User is trying to change the slider—but since they're not "winning,"
      // snap to the opposite extreme
      const snappedValue = newVal < 50 ? 100 : 0
      setValue(snappedValue)

      // Create smaller, more controlled movements
      setPosition({
        x: (Math.random() - 0.5) * 40,
        y: (Math.random() - 0.5) * 20
      })
      setTimeout(() => setPosition({ x: 0, y: 0 }), 300)
      setMessage(
        tauntMessages[Math.floor(Math.random() * tauntMessages.length)]
      )
    } else {
      // If the user holds it long enough, allow the change
      setValue(newVal)
      setMessage(null)
    }
  }

  // Add a constant jittery movement effect
  useEffect(() => {
    const startJitter = () => {
      if (jitterTimer.current) clearTimeout(jitterTimer.current)

      // Only jitter if not being held
      if (!isHolding) {
        // Calculate how far the slider is from the middle (50)
        const distanceFromMiddle = Math.abs(value - 50)
        // Movement factor is higher in the middle, lower at extremes
        const movementFactor = 1 - distanceFromMiddle / 50

        // Random value changes - more aggressive now
        if (Math.random() > 0.3) {
          // Increased probability (70% chance)
          // Base change amount - larger when closer to middle
          const baseChange = 20 * movementFactor // Doubled the base change amount
          const smallChange = Math.random() * baseChange - baseChange / 2
          setValue((prev) => Math.max(0, Math.min(100, prev + smallChange)))
        }
      }

      // Schedule next jitter in 50-300ms (even more frequent movement)
      jitterTimer.current = setTimeout(startJitter, 50 + Math.random() * 250)
    }

    startJitter()

    return () => {
      if (jitterTimer.current) clearTimeout(jitterTimer.current)
    }
  }, [isHolding, value])

  // Randomly change slider value every few seconds when user is not interacting
  useEffect(() => {
    if (isHolding) {
      clearAutoChangeTimer()
      return
    }

    autoChangeTimer.current = setTimeout(() => {
      // Pick a random value - more variation now
      const rebelValue = Math.random() * 100 // Any value between 0-100
      setValue(rebelValue)
      setMessage(
        rebelMessages[Math.floor(Math.random() * rebelMessages.length)]
      )
    }, 800 + Math.random() * 1200) // change more frequently: 0.8-2 seconds

    return clearAutoChangeTimer
  }, [value, isHolding])

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white shadow relative overflow-hidden">
      <h2 className="text-lg font-bold text-center">
        A slider that's too independent for your control.
      </h2>
      <div className="flex items-center space-x-4 relative">
        <Slider
          value={[value]}
          onValueChange={(vals) => handleValueChange(vals[0])}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          className="w-full"
        />
        <div className="w-12 text-center font-mono text-sm bg-gray-100 rounded px-2 py-1">
          {Math.round(value)}
        </div>
      </div>
      {message && (
        <div className="text-center text-sm italic text-gray-600">
          {message}{' '}
          <span role="img" aria-label="mischievous grin">
            😏
          </span>
        </div>
      )}
      <div className="text-center text-xs text-gray-500 mt-2">
        Drag the slider—if you can control it!
      </div>
    </div>
  )
}
