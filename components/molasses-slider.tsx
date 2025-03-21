'use client'

import React, { useState, useRef, useEffect } from 'react'

export default function MolassesSlider() {
  // Track both the actual value and target position
  const [value, setValue] = useState(50)
  const [targetPosition, setTargetPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [dragDistance, setDragDistance] = useState(0)

  // New states for messages and interaction
  const [message, setMessage] = useState<string | null>(null)
  const [hasBeenClicked, setHasBeenClicked] = useState(false)

  const trackRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)

  // Calculate percentage position from mouse/touch coordinates
  const getPercentFromPosition = (clientX: number) => {
    if (!trackRef.current) return 50
    const rect = trackRef.current.getBoundingClientRect()
    const xPosition = clientX - rect.left
    const percentage = (xPosition / rect.width) * 100
    return Math.max(0, Math.min(100, percentage))
  }

  // Animation logic - thumb slowly follows the target position
  const updateSliderPosition = () => {
    if (!isDragging && Math.abs(targetPosition - value) < 0.1) {
      setDragDistance(0)
      return
    }
    // Calculate distance for visual effects
    const distance = Math.abs(targetPosition - value)
    setDragDistance(distance)
    // Absurdly slow movement - only move 0.1% of the remaining distance per frame
    const speedFactor = 0.001
    const newValue = value + (targetPosition - value) * speedFactor
    setValue(newValue)
    // Continue animation
    animationRef.current = requestAnimationFrame(updateSliderPosition)
  }

  // Start dragging
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    setHasBeenClicked(true)
    if (trackRef.current) {
      const newTarget = getPercentFromPosition(e.clientX)
      setTargetPosition(newTarget)
      setIsDragging(true)
      // Capture pointer to get events outside the element
      e.currentTarget.setPointerCapture(e.pointerId)
    }
  }

  // Dragging
  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      const newTarget = getPercentFromPosition(e.clientX)
      setTargetPosition(newTarget)
    }
  }

  // End dragging
  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false)
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }

  // Start animation when needed
  useEffect(() => {
    if (
      (isDragging || Math.abs(targetPosition - value) > 0.1) &&
      !animationRef.current
    ) {
      animationRef.current = requestAnimationFrame(updateSliderPosition)
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [isDragging, targetPosition, value])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    let newValue = targetPosition
    switch (e.key) {
      case 'ArrowRight':
        newValue = Math.min(100, targetPosition + 5)
        break
      case 'ArrowLeft':
        newValue = Math.max(0, targetPosition - 5)
        break
      case 'Home':
        newValue = 0
        break
      case 'End':
        newValue = 100
        break
      default:
        return
    }
    setTargetPosition(newValue)
    e.preventDefault()
  }

  // Show a default funny message after 3 seconds if the slider hasn't been interacted with
  useEffect(() => {
    if (!hasBeenClicked) {
      const timer = setTimeout(() => {
        setMessage(
          "I'm as slow as molasses in January—hang tight, I'm moving... eventually!"
        )
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [hasBeenClicked])

  return (
    <div className='space-y-4 p-4 border rounded-lg bg-white shadow relative overflow-hidden'>
      <div className='flex items-center space-x-4 relative'>
        <div
          ref={trackRef}
          className='relative h-2 bg-muted rounded-full cursor-pointer w-full'
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          role='slider'
          tabIndex={0}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={value}
          aria-valuetext={`${Math.round(value)}%`}
          aria-label='Molasses Slider'
          onKeyDown={handleKeyDown}
        >
          {isDragging && (
            <div
              className='absolute w-2 h-2 rounded-full border border-amber-500 bg-transparent -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-none'
              style={{ left: `${targetPosition}%` }}
            />
          )}
          <div
            className='absolute h-full bg-black rounded-full'
            style={{ width: `${value}%` }}
          />
          <div
            className='absolute top-1/2 h-6 w-6 -translate-y-1/2 -translate-x-1/2 rounded-full bg-background border-2 border-primary shadow-md transition-transform z-10'
            style={{
              left: `${value}%`,
              transform: `translate(-50%, -50%) ${
                isDragging
                  ? `rotate(${Math.sin(Date.now() / 200) * Math.min(10, dragDistance / 3)}deg)`
                  : ''
              }`
            }}
          />
        </div>
        <div className='w-12 text-center font-mono text-sm bg-gray-100 rounded px-2 py-1'>
          {Math.round(value)}
        </div>
      </div>
      {message && (
        <div className='text-center text-sm italic text-gray-600'>
          {message}{' '}
          <span role='img' aria-label='mischievous grin'>
            😏
          </span>
        </div>
      )}
      <div className='text-center text-xs text-gray-500 mt-2'>
        {hasBeenClicked
          ? "Even if you try, I'm as slow as molasses!"
          : 'Click or drag to wake up this slowpoke slider!'}
      </div>
    </div>
  )
}
