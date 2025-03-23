'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Moon, Sun } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

// Types
type EyePair = {
  id: number
  x: number
  y: number
  size: number
  visible: boolean
  blinkDelay: number
  blinkDuration: number
  brightness: number
  movementSpeed: number
  movementDirection: { x: number; y: number }
  lastHiddenTime: number
  lastVisibleTime: number
  eyeType: 'normal' | 'wide' | 'narrow' | 'large' | 'small'
  eyeColor: string
  eyeSpacing: number
  eyeShape: 'round' | 'oval' | 'almond'
  pupilSize: number
  pupilColor: string
  hasPupils: boolean
  createdAt: number
}

export default function ScaryDarkMode() {
  // ============ STATE ============
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [backgroundIndex, setBackgroundIndex] = useState(0)
  const [backgroundImage, setBackgroundImage] = useState(
    'https://i.imgur.com/AgI1efo.jpeg'
  )
  const [isFlashlightOn, setIsFlashlightOn] = useState(true)
  const [isSputtering, setIsSputtering] = useState(false)
  const [eyes, setEyes] = useState<EyePair[]>([])
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>(
    'desktop'
  )
  const [hasUserMoved, setHasUserMoved] = useState(false)
  const [lastFlashlightToggle, setLastFlashlightToggle] = useState(0)
  const [lastTapTime, setLastTapTime] = useState(0)
  const [eyeGenerationActive, setEyeGenerationActive] = useState(false)

  // ============ REFS ============
  const cursorRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 })
  const isTouchMovingRef = useRef(false)
  const animationFrameRef = useRef<number | null>(null)
  const sputtingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const exitingRef = useRef(false)
  const cleanupFunctionsRef = useRef<Array<() => void>>([])
  const eyeGenerationIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const nextEyeIdRef = useRef(1)
  const overlayRef = useRef<HTMLDivElement>(null)

  // ============ CONSTANTS ============
  const forestBackgrounds = [
    'https://i.imgur.com/AgI1efo.jpeg',
    'https://i.imgur.com/qydhk56.jpeg',
    'https://i.imgur.com/rrNTpkg.jpeg',
    'https://i.imgur.com/sQXYhHe.jpeg',
    'https://i.imgur.com/VZ8YXZC.jpeg'
  ]

  // ============ HELPER FUNCTIONS ============

  // Convert hex to rgba for shadow effects
  const hexToRgba = useCallback((hex: string, alpha: number): string => {
    hex = hex.replace('#', '')
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map(char => char + char)
        .join('')
    }
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }, [])

  // Get maximum eyes based on device type
  const getMaxEyeCount = useCallback(() => {
    if (deviceType === 'mobile') return 5
    if (deviceType === 'tablet') return 8
    return 10
  }, [deviceType])

  // Check if too close to flashlight
  const isTooCloseToFlashlight = useCallback(
    (x: number, y: number, minDistancePercent: number) => {
      const vpWidth = window.innerWidth
      const vpHeight = window.innerHeight
      const cursorXPercent = (cursorPosition.x / vpWidth) * 100
      const cursorYPercent = (cursorPosition.y / vpHeight) * 100

      const distance = Math.sqrt(
        Math.pow(x - cursorXPercent, 2) + Math.pow(y - cursorYPercent, 2)
      )
      return distance < minDistancePercent
    },
    [cursorPosition]
  )

  // Check if too close to existing eyes
  const isTooCloseToExistingEyes = useCallback(
    (
      x: number,
      y: number,
      existingEyes: EyePair[],
      minDistancePercent: number
    ) => {
      // Account for eye size in distance calculation
      for (const eye of existingEyes) {
        // Check both visible and hidden eyes to prevent overlap when they reappear
        const eyeSizeFactor = eye.size * (eye.eyeType === 'large' ? 1.5 : 1.0)
        const adjustedMinDistance = minDistancePercent + eyeSizeFactor * 10

        const distance = Math.sqrt(
          Math.pow(x - eye.x, 2) + Math.pow(y - eye.y, 2)
        )
        if (distance < adjustedMinDistance) return true
      }
      return false
    },
    []
  )

  // Check if exit button should be visible
  const isButtonVisible = useCallback(() => {
    if (!isFlashlightOn && hasUserMoved) return false

    // Button position (top-right corner)
    const buttonRect = {
      left: window.innerWidth - 100,
      top: 20,
      width: 80,
      height: 40
    }

    // Check if flashlight is over button area
    return (
      cursorPosition.x > buttonRect.left - 100 &&
      cursorPosition.x < buttonRect.left + buttonRect.width + 100 &&
      cursorPosition.y > buttonRect.top - 100 &&
      cursorPosition.y < buttonRect.top + buttonRect.height + 100
    )
  }, [isFlashlightOn, cursorPosition.x, cursorPosition.y, hasUserMoved])

  // Cycle to next background image
  const cycleBackgroundImage = useCallback(() => {
    const newIndex = (backgroundIndex + 1) % forestBackgrounds.length
    setBackgroundIndex(newIndex)
    return forestBackgrounds[newIndex]
  }, [backgroundIndex, forestBackgrounds])

  // Create a new eye pair with appropriate properties
  const createEyePair = useCallback(
    (position: { x: number; y: number }): EyePair => {
      const simpleMode = deviceType === 'mobile'

      // Base properties
      const size = simpleMode
        ? Math.random() * 0.8 + 0.4
        : Math.random() * 1.2 + 0.5
      const movementSpeed = simpleMode
        ? Math.random() * 0.01 + 0.005
        : Math.random() * 0.02 + 0.01
      const angle = Math.random() * Math.PI * 2

      // Eye type selection
      const eyeTypes = simpleMode
        ? (['normal', 'large'] as const)
        : (['normal', 'wide', 'narrow', 'large', 'small'] as const)
      const eyeType = eyeTypes[Math.floor(Math.random() * eyeTypes.length)]

      // Eye color and styling
      const eyeColors = simpleMode
        ? ['#ffffff', '#ffffcc', '#ffdddd']
        : ['#ffffff', '#ffffcc', '#ffdddd', '#ddffff', '#ddffdd', '#ffff77']
      const eyeColor = eyeColors[Math.floor(Math.random() * eyeColors.length)]

      // Eye spacing based on type
      const eyeSpacing =
        eyeType === 'wide'
          ? Math.random() * 6 + 12
          : eyeType === 'narrow'
            ? Math.random() * 4 + 4
            : Math.random() * 6 + 8

      // Eye shape
      const eyeShapes = simpleMode
        ? (['round'] as const)
        : (['round', 'oval', 'almond'] as const)
      const eyeShape = eyeShapes[Math.floor(Math.random() * eyeShapes.length)]

      // Pupil properties
      const hasPupils = simpleMode ? Math.random() < 0.4 : Math.random() < 0.6
      const pupilSize = Math.random() * 0.5 + 0.2
      const pupilColors = simpleMode
        ? ['#000000']
        : ['#000000', '#330000', '#330033', '#003300']
      const pupilColor =
        pupilColors[Math.floor(Math.random() * pupilColors.length)]

      return {
        id: nextEyeIdRef.current++,
        x: position.x,
        y: position.y,
        size,
        visible: true,
        blinkDelay: Math.random() * 5,
        blinkDuration: 2 + Math.random() * 4,
        brightness: Math.random() * 0.5 + 0.3,
        movementSpeed,
        movementDirection: { x: Math.cos(angle), y: Math.sin(angle) },
        lastHiddenTime: 0,
        lastVisibleTime: Date.now(),
        eyeType,
        eyeColor,
        eyeSpacing,
        eyeShape,
        pupilSize,
        pupilColor,
        hasPupils,
        createdAt: Date.now()
      }
    },
    [deviceType]
  )

  // Find a safe position for new eyes that doesn't overlap
  const findSafePosition = useCallback(() => {
    // Create grid of potential positions
    const gridSize = deviceType === 'mobile' ? 4 : 6
    const positions: { x: number; y: number }[] = []

    // Generate grid positions with jitter
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < gridSize; x++) {
        const jitterX = (Math.random() * 0.6 - 0.3) / gridSize
        const jitterY = (Math.random() * 0.6 - 0.3) / 4
        positions.push({
          x: ((x + 0.5) / gridSize + jitterX) * 100,
          y: ((y + 0.5) / 4 + jitterY) * 100
        })
      }
    }

    // Shuffle positions for randomization
    const shuffled = [...positions].sort(() => Math.random() - 0.5)

    // Safety distance values for eye positioning
    // For mobile, use smaller distances to allow more visible eyes
    const flashlightSafeDistance = deviceType === 'mobile' ? 15 : 20
    const eyeToEyeSafeDistance = deviceType === 'mobile' ? 25 : 40

    // Find first position that passes all safety checks
    return (
      shuffled.find(pos => {
        // For mobile devices, be less strict about flashlight proximity
        if (
          deviceType !== 'mobile' &&
          isTooCloseToFlashlight(pos.x, pos.y, flashlightSafeDistance)
        ) {
          return false
        }

        // For mobile, be more lenient in eye spacing to allow more visible eyes
        if (deviceType === 'mobile') {
          // Still avoid extreme overlap but be more permissive
          if (
            isTooCloseToExistingEyes(
              pos.x,
              pos.y,
              eyes,
              eyeToEyeSafeDistance * 0.7
            )
          ) {
            return false
          }
        } else {
          // Regular desktop spacing rules
          if (
            isTooCloseToExistingEyes(pos.x, pos.y, eyes, eyeToEyeSafeDistance)
          ) {
            return false
          }
        }

        return true
      }) || shuffled[0]
    ) // Fallback to first position if none found
  }, [deviceType, eyes, isTooCloseToFlashlight, isTooCloseToExistingEyes])

  // Start eye generation system
  const startEyeGeneration = useCallback(() => {
    // Only start if not already running and in dark mode
    if (eyeGenerationActive || !isDarkMode) return

    setEyeGenerationActive(true)

    // Start with no eyes
    setEyes([])

    // Reset eye ID counter
    nextEyeIdRef.current = 1

    // Clear any existing intervals
    if (eyeGenerationIntervalRef.current) {
      clearInterval(eyeGenerationIntervalRef.current)
    }

    // Initial delay before first eye appears (reduced to appear sooner)
    const firstEyeDelay = 1500
    setTimeout(() => {
      // Only proceed if still in dark mode
      if (!isDarkMode) return

      // Start adding eyes at regular intervals (slower intervals to prevent overcrowding)
      const interval = deviceType === 'mobile' ? 3000 : 2500
      eyeGenerationIntervalRef.current = setInterval(() => {
        // Stop generating if no longer in dark mode
        if (!isDarkMode) {
          if (eyeGenerationIntervalRef.current) {
            clearInterval(eyeGenerationIntervalRef.current)
            eyeGenerationIntervalRef.current = null
          }
          return
        }

        // Get max eye count for current device
        const maxEyes = getMaxEyeCount()

        setEyes(currentEyes => {
          // Don't add more if at max capacity
          if (currentEyes.length >= maxEyes) {
            // Find oldest eye to replace
            const oldestEyeIndex = currentEyes
              .map((eye, index) => ({ index, createdAt: eye.createdAt }))
              .sort((a, b) => a.createdAt - b.createdAt)[0]?.index

            // If no oldest eye found, don't add new one
            if (oldestEyeIndex === undefined) return currentEyes

            // Try to find a safe position
            const safePosition = findSafePosition()
            if (!safePosition) return currentEyes

            // Create new array with oldest eye replaced
            const newEyes = [...currentEyes]

            // Only replace the oldest eye 70% of the time to gradually reduce eye count
            if (Math.random() < 0.7) {
              newEyes[oldestEyeIndex] = createEyePair(safePosition)
            } else {
              // Remove the oldest eye without replacement 30% of the time
              newEyes.splice(oldestEyeIndex, 1)
            }

            return newEyes
          } else {
            // We have room for a new eye
            const safePosition = findSafePosition()
            if (!safePosition) return currentEyes

            // Add new eye
            return [...currentEyes, createEyePair(safePosition)]
          }
        })
      }, interval)

      // Add this interval to cleanup functions
      const cleanup = () => {
        if (eyeGenerationIntervalRef.current) {
          clearInterval(eyeGenerationIntervalRef.current)
          eyeGenerationIntervalRef.current = null
        }
        setEyeGenerationActive(false)
      }

      cleanupFunctionsRef.current.push(cleanup)
    }, firstEyeDelay)

    return () => {
      if (eyeGenerationIntervalRef.current) {
        clearInterval(eyeGenerationIntervalRef.current)
      }
      setEyeGenerationActive(false)
    }
  }, [deviceType, isDarkMode, findSafePosition, createEyePair, getMaxEyeCount])

  // Robust exit function
  const exitDarkMode = useCallback(() => {
    // Prevent multiple exit attempts
    if (exitingRef.current) return
    exitingRef.current = true

    // Cancel running animations
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    // Clear all timeouts and intervals
    if (sputtingTimeoutRef.current) {
      clearTimeout(sputtingTimeoutRef.current)
      sputtingTimeoutRef.current = null
    }

    if (eyeGenerationIntervalRef.current) {
      clearInterval(eyeGenerationIntervalRef.current)
      eyeGenerationIntervalRef.current = null
    }

    // Run all registered cleanup functions
    cleanupFunctionsRef.current.forEach(cleanup => {
      try {
        cleanup()
      } catch (error) {
        console.error('Cleanup error:', error)
      }
    })
    cleanupFunctionsRef.current = []

    // Stop audio
    if (audioRef.current) {
      try {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        audioRef.current = null
      } catch (error) {
        console.error('Audio cleanup error:', error)
      }
    }

    // Reset cursor
    document.body.style.cursor = 'auto'

    // Remove dark mode class
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.remove('scary-dark')

    // Reset state
    setIsDarkMode(false)

    // Reset other states in the next tick
    Promise.resolve().then(() => {
      setEyes([])
      setIsSputtering(false)
      setIsFlashlightOn(true)
      setHasUserMoved(false)
      setEyeGenerationActive(false)
      exitingRef.current = false
      setLastTapTime(0)
    })
  }, [])

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    if (isDarkMode) {
      exitDarkMode()
    } else {
      // Force flashlight ON first
      setIsFlashlightOn(true)

      // Enter dark mode
      const newBackground = cycleBackgroundImage()
      setBackgroundImage(newBackground)
      setIsSputtering(false)
      setHasUserMoved(false)

      // Start first flicker sooner (after 2-3 seconds)
      setTimeout(
        () => {
          if (isDarkMode && isFlashlightOn) {
            setIsSputtering(true)
            setTimeout(() => {
              setIsSputtering(false)
            }, 100)
          }
        },
        2000 + Math.random() * 1000
      )

      // Clear existing eyes
      setEyes([])

      // Reset eye generation state
      setEyeGenerationActive(false)

      // Get current mouse position or use center of screen as fallback
      const mouseX = cursorPosition.x || window.innerWidth / 2
      const mouseY = cursorPosition.y || window.innerHeight / 2
      setCursorPosition({
        x: mouseX,
        y: mouseY
      })

      // Preload image
      const img = new Image()
      img.src = newBackground

      // Hide cursor
      document.body.style.cursor = 'none'

      // Add dark mode class
      document.documentElement.classList.add('dark')
      document.documentElement.classList.add('scary-dark')

      // Play audio
      if (!audioRef.current) {
        audioRef.current = new Audio('/scary-background.mp3')
        audioRef.current.loop = true
        audioRef.current.volume = 0.3
      }

      audioRef.current
        .play()
        .catch(err => console.error('Audio playback failed:', err))

      // Force flashlight on again before changing to dark mode
      window.setTimeout(() => setIsFlashlightOn(true), 0)

      setIsDarkMode(true)
    }
  }, [
    isDarkMode,
    cycleBackgroundImage,
    exitDarkMode,
    cursorPosition.x,
    cursorPosition.y
  ])

  // ============ EFFECTS ============

  // Implement flashlight flickering effect
  useEffect(() => {
    if (!isDarkMode || !isFlashlightOn) return

    const startFlickering = () => {
      // Random interval between flickers (1-5 seconds) - increased frequency
      const nextFlickerTime = Math.random() * 4000 + 1000

      const flickerTimeout = setTimeout(() => {
        // Only flicker if flashlight is on and in dark mode
        if (isDarkMode && isFlashlightOn) {
          // Choose a flicker pattern based on probability
          const flickerPattern = Math.random()

          if (flickerPattern < 0.3) {
            // Pattern 1: Simple quick flicker (25% chance)
            setIsSputtering(true)
            const flickerDuration = Math.random() * 70 + 80
            setTimeout(() => {
              setIsSputtering(false)
              startFlickering() // Schedule next flicker
            }, flickerDuration)
          } else if (flickerPattern < 0.7) {
            // Pattern 2: Rapid multiple flickers (40% chance) - classic "dying flashlight"
            let flickerCount = 0
            const maxFlickers = Math.floor(Math.random() * 4) + 3 // 3-6 flickers

            const doFlicker = () => {
              setIsSputtering(true)

              // Each flicker is brief (40-100ms)
              const onDuration = Math.random() * 60 + 40
              setTimeout(() => {
                setIsSputtering(false)
                flickerCount++

                if (flickerCount < maxFlickers) {
                  // Gap between flickers varies (20-80ms)
                  const offDuration = Math.random() * 60 + 20
                  setTimeout(doFlicker, offDuration)
                } else {
                  startFlickering() // Schedule next sequence
                }
              }, onDuration)
            }

            doFlicker()
          } else {
            // Pattern 3: Flutter with intensity changes (35% chance)
            // This simulates the light trying to stay on but failing
            let flutterStep = 0
            const totalSteps = Math.floor(Math.random() * 3) + 4 // 4-6 steps

            const doFlutter = () => {
              setIsSputtering(true)

              // Duration varies based on step (longer at beginning, shorter at end)
              const stepDuration = 120 - flutterStep * 15 + Math.random() * 30

              setTimeout(
                () => {
                  setIsSputtering(false)
                  flutterStep++

                  if (flutterStep < totalSteps) {
                    // Short gap between flutters (10-40ms)
                    const gapDuration = Math.random() * 30 + 10
                    setTimeout(doFlutter, gapDuration)
                  } else {
                    // Longer stable period after flutter sequence
                    startFlickering()
                  }
                },
                Math.max(30, stepDuration)
              ) // Ensure minimum duration
            }

            doFlutter()
          }
        } else {
          // If no longer in dark mode or flashlight is off, just schedule next check
          startFlickering()
        }
      }, nextFlickerTime)

      // Register cleanup
      const cleanup = () => {
        clearTimeout(flickerTimeout)
      }

      cleanupFunctionsRef.current.push(cleanup)
      return cleanup
    }

    return startFlickering()
  }, [isDarkMode, isFlashlightOn])

  // Detect device type on mount
  useEffect(() => {
    const detectDeviceType = () => {
      const width = window.innerWidth
      if (width < 768) return 'mobile'
      if (width < 1024) return 'tablet'
      return 'desktop'
    }

    const handleResize = () => {
      setDeviceType(detectDeviceType())
    }

    setDeviceType(detectDeviceType())
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Handle keyboard events (ESC to exit)
  useEffect(() => {
    if (!isDarkMode) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        exitDarkMode()
      }
    }

    document.addEventListener('keydown', handleKeyDown, { capture: true })

    // Register cleanup
    const cleanup = () => {
      document.removeEventListener('keydown', handleKeyDown, { capture: true })
    }

    cleanupFunctionsRef.current.push(cleanup)
    return cleanup
  }, [isDarkMode, exitDarkMode])

  // Start eye generation when entering dark mode
  useEffect(() => {
    if (isDarkMode && !eyeGenerationActive) {
      startEyeGeneration()
    }
  }, [isDarkMode, eyeGenerationActive, startEyeGeneration])

  // Handle mouse/touch movement
  useEffect(() => {
    if (!isDarkMode) return

    let lastPositionUpdateTime = 0
    const updateInterval = deviceType === 'mobile' ? 50 : 30 // Less frequent updates on mobile

    const updatePositionAndCheckEyes = (x: number, y: number) => {
      const now = Date.now()
      if (now - lastPositionUpdateTime < updateInterval) return
      lastPositionUpdateTime = now

      setHasUserMoved(true)
      setCursorPosition({ x, y })

      // Set proximity threshold based on device and screen size
      // For mobile, use a percentage of screen width rather than fixed pixels
      const proximityThreshold =
        deviceType === 'mobile'
          ? Math.min(window.innerWidth, window.innerHeight) * 0.15 // 15% of smallest dimension
          : 300

      setEyes(prevEyes =>
        prevEyes.map(eye => {
          const viewportWidth = window.innerWidth
          const viewportHeight = window.innerHeight

          // Convert percentage to pixels
          const eyeX = (eye.x / 100) * viewportWidth
          const eyeY = (eye.y / 100) * viewportHeight

          // Calculate distance to cursor
          const distance = Math.sqrt(
            Math.pow(eyeX - x, 2) + Math.pow(eyeY - y, 2)
          )

          // Only hide eyes when flashlight is on (for mobile especially)
          // And make it less likely to hide on mobile with random factor
          if (
            distance < proximityThreshold &&
            (isFlashlightOn || deviceType !== 'mobile' || Math.random() > 0.5)
          ) {
            return {
              ...eye,
              visible: false,
              lastHiddenTime: Date.now()
            }
          }

          return eye
        })
      )
    }

    // Mouse events
    const handleMouseMove = (e: MouseEvent) => {
      updatePositionAndCheckEyes(e.clientX, e.clientY)
    }

    const handleMouseClick = () => {
      if (!isDarkMode) return

      // Debounce flashlight toggle
      const now = Date.now()
      if (now - lastFlashlightToggle < 300) return

      setLastFlashlightToggle(now)
      setIsFlashlightOn(prev => !prev)
    }

    // Touch events
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDarkMode || e.touches.length === 0) return
      e.preventDefault()

      isTouchMovingRef.current = true
      const touch = e.touches[0]
      updatePositionAndCheckEyes(touch.clientX, touch.clientY)

      // Keep flashlight on while dragging on mobile
      if (deviceType === 'mobile') {
        setIsFlashlightOn(true)
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (!isDarkMode || e.touches.length === 0) return
      e.preventDefault()

      const touch = e.touches[0]
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      }

      isTouchMovingRef.current = false
      updatePositionAndCheckEyes(touch.clientX, touch.clientY)

      // Ensure flashlight is on for mobile users
      if (deviceType === 'mobile') {
        setIsFlashlightOn(true)
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isDarkMode) return

      if (e.changedTouches.length > 0 && !isTouchMovingRef.current) {
        const touch = e.changedTouches[0]
        const dx = Math.abs(touch.clientX - touchStartRef.current.x)
        const dy = Math.abs(touch.clientY - touchStartRef.current.y)
        const timeDiff = Date.now() - touchStartRef.current.time
        const now = Date.now()

        // Only toggle flashlight if it was a tap (not a drag)
        if (dx < 15 && dy < 15 && timeDiff < 250) {
          // Double-tap detection for exiting on mobile
          if (now - lastTapTime < 300) {
            // Double tap detected, exit dark mode
            exitDarkMode()
            return
          }

          // Single tap - toggle flashlight with debounce
          if (now - lastFlashlightToggle >= 300) {
            setLastFlashlightToggle(now)

            // Force update cursor position to touch location too
            setCursorPosition({
              x: touch.clientX,
              y: touch.clientY
            })

            // Toggle flashlight
            setIsFlashlightOn(prev => !prev)
          }

          // Update last tap time for double-tap detection
          setLastTapTime(now)
        }
      }
    }

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handleMouseClick)
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: false })
    window.addEventListener('touchend', handleTouchEnd)

    // Register cleanup
    const cleanup = () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handleMouseClick)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }

    cleanupFunctionsRef.current.push(cleanup)
    return cleanup
  }, [isDarkMode, deviceType, lastFlashlightToggle, exitDarkMode, lastTapTime])

  // Eye movement and reappearance effect
  useEffect(() => {
    if (!isDarkMode) return

    const updateInterval = deviceType === 'mobile' ? 100 : 50 // Less frequent updates on mobile

    const updateEyePositions = () => {
      setEyes(prevEyes => {
        // First create a copy to work with
        const eyesCopy = [...prevEyes]

        // Process each eye
        return eyesCopy.map(eye => {
          // Skip hidden eyes
          if (!eye.visible) return eye

          // Update position for visible eyes
          let newX = eye.x + eye.movementDirection.x * eye.movementSpeed
          let newY = eye.y + eye.movementDirection.y * eye.movementSpeed

          // Bounce off edges with padding
          if (newX < 5 || newX > 95) {
            newX = Math.max(5, Math.min(95, newX))
            eye.movementDirection.x *= -1
          }
          if (newY < 5 || newY > 95) {
            newY = Math.max(5, Math.min(95, newY))
            eye.movementDirection.y *= -1
          }

          // Check if too close to flashlight
          const tooClose = isTooCloseToFlashlight(
            newX,
            newY,
            deviceType === 'mobile' ? 40 : 30
          )

          // Only hide if the eye has been visible for at least 1-2 seconds
          const minVisibleTime = 1500 + Math.random() * 1000 // 1.5-2.5 seconds
          const hasBeenVisibleLongEnough =
            Date.now() - eye.lastVisibleTime > minVisibleTime

          if (tooClose && hasBeenVisibleLongEnough) {
            return {
              ...eye,
              visible: false,
              lastHiddenTime: Date.now()
            }
          }

          // Check for collisions with other eyes
          const minDistance = deviceType === 'mobile' ? 40 : 35
          let collision = false

          // Only check visible eyes
          const visibleEyes = eyesCopy.filter(e => e.visible && e.id !== eye.id)

          for (const otherEye of visibleEyes) {
            const distance = Math.sqrt(
              Math.pow(newX - otherEye.x, 2) + Math.pow(newY - otherEye.y, 2)
            )

            // If collision detected, change direction and stay at current position
            if (distance < minDistance) {
              collision = true

              // Reverse direction (bounce off)
              eye.movementDirection.x *= -1
              eye.movementDirection.y *= -1

              // Add some randomness to prevent getting stuck
              const jitter = Math.random() * 0.3 - 0.15
              eye.movementDirection.x += jitter
              eye.movementDirection.y += jitter

              // Normalize to maintain speed
              const norm = Math.sqrt(
                Math.pow(eye.movementDirection.x, 2) +
                  Math.pow(eye.movementDirection.y, 2)
              )

              if (norm > 0) {
                eye.movementDirection.x /= norm
                eye.movementDirection.y /= norm
              }

              break
            }
          }

          // Random direction change (rare)
          if (!collision && Math.random() < 0.005) {
            const newAngle = Math.random() * Math.PI * 2
            eye.movementDirection = {
              x: Math.cos(newAngle),
              y: Math.sin(newAngle)
            }
          }

          // If collision, stay at current position, otherwise move to new position
          return {
            ...eye,
            x: collision ? eye.x : newX,
            y: collision ? eye.y : newY
          }
        })
      })
    }

    // Check hidden eyes for reappearance
    const checkHiddenEyes = () => {
      const now = Date.now()

      setEyes(prevEyes => {
        // Find eyes that have been hidden long enough
        const hiddenEyes = prevEyes.filter(eye => !eye.visible)
        if (hiddenEyes.length === 0) return prevEyes

        // Minimum hidden time before reappearance (reduced to make eyes return faster)
        const minHiddenTime = deviceType === 'mobile' ? 2000 : 1500

        const readyToReappear = hiddenEyes.filter(
          eye => now - eye.lastHiddenTime > minHiddenTime
        )

        if (readyToReappear.length === 0) return prevEyes

        // Choose one random eye to reappear
        const eyeToReappear =
          readyToReappear[Math.floor(Math.random() * readyToReappear.length)]

        // Find a safe position for reappearance
        const safePosition = findSafePosition()
        if (!safePosition) return prevEyes

        // Update the chosen eye with new position and properties
        return prevEyes.map(eye => {
          if (eye.id === eyeToReappear.id) {
            // Generate new movement properties
            const angle = Math.random() * Math.PI * 2
            const newMovementSpeed =
              deviceType === 'mobile'
                ? Math.random() * 0.01 + 0.005
                : Math.random() * 0.02 + 0.01

            return {
              ...eye,
              visible: true,
              x: safePosition.x,
              y: safePosition.y,
              movementSpeed: newMovementSpeed,
              movementDirection: {
                x: Math.cos(angle),
                y: Math.sin(angle)
              },
              lastHiddenTime: 0,
              lastVisibleTime: Date.now() // Reset visibility timer
            }
          }
          return eye
        })
      })
    }

    // Set up intervals for eye movement and reappearance
    const movementInterval = setInterval(updateEyePositions, updateInterval)
    const reappearInterval = setInterval(checkHiddenEyes, 1000)

    // Register cleanup
    const cleanup = () => {
      clearInterval(movementInterval)
      clearInterval(reappearInterval)
    }

    cleanupFunctionsRef.current.push(cleanup)
    return cleanup
  }, [isDarkMode, deviceType, isTooCloseToFlashlight, findSafePosition])

  // Cleanup on unmount
  useEffect(() => {
    return exitDarkMode
  }, [exitDarkMode])

  return (
    <Card className='p-6'>
      {/* Normal Mode Content */}
      <div className='flex items-center justify-between mb-2'>
        <div className='text-lg mb-2'>
          <strong className='text-amber-700 dark:text-amber-400'>
            Best experienced in full screen mode!
          </strong>
        </div>
        <div className='flex items-center space-x-2'>
          <Sun className='h-5 w-5 text-black dark:text-white' />
          <Switch
            checked={isDarkMode}
            onCheckedChange={toggleDarkMode}
            id='dark-mode'
          />
          <Moon className='h-5 w-5 text-black dark:text-white' />
          <Label htmlFor='dark-mode' className='sr-only'>
            Toggle dark mode
          </Label>
        </div>
      </div>

      <div className='prose dark:prose-invert'>
        <h3 className='text-md font-bold mb-2'>How it works:</h3>
        <ul className='list-disc pl-5 space-y-2 mb-3'>
          <li>
            Your cursor becomes a flashlight that reveals what's hidden in the
            darkness
          </li>
          <li>
            Pairs of glowing eyes will appear, blink, and move around in the
            darkness
          </li>
          <li>
            Eyes will vanish when your flashlight gets close, only to reappear
            elsewhere
          </li>
          <li>Click anywhere to toggle your flashlight on/off</li>
          <li>
            Be careful — the batteries seem to be running low, and your light
            might flicker unexpectedly
          </li>
          <li>
            Even with the flashlight off, the eyes will still avoid your cursor
          </li>
        </ul>

        <h3 className='text-md font-bold mb-2'>Mobile Controls:</h3>
        <ul className='list-disc pl-5 space-y-2 mb-3'>
          <li>
            Drag your finger to move the flashlight (stays on while dragging)
          </li>
          <li>Tap the screen to toggle the flashlight on/off</li>
          <li>Double-tap quickly to exit the dark forest at any time</li>
          <li>The eyes will still hide from your touch!</li>
        </ul>

        <div className='p-4 border rounded-md bg-yellow-50 dark:bg-yellow-950 my-4'>
          <p className='text-sm text-yellow-800 dark:text-yellow-300 m-0'>
            <strong>Safety Tip:</strong> Press the <strong>ESC</strong> key or
            the EXIT button to escape the forest. On mobile, double-tap to exit.
          </p>
        </div>
      </div>

      {/* Dark Mode Overlay */}
      {isDarkMode && (
        <div
          ref={overlayRef}
          className='forest-overlay'
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 100,
            pointerEvents: 'none'
          }}
        >
          {/* Semi-transparent background image overlay */}
          <div
            className='forest-bg'
            style={{
              position: 'fixed',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              background: `url(${backgroundImage}) no-repeat center center fixed`,
              backgroundSize: 'cover',
              opacity: 0.4,
              zIndex: 101,
              pointerEvents: 'none'
            }}
          />

          {/* Flashlight Cursor */}
          {/* Dark Overlay */}
          <div
            className='dark-overlay'
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'black',
              zIndex: 102,
              opacity: 0.94,
              maskImage: isFlashlightOn
                ? isSputtering
                  ? 'none'
                  : `radial-gradient(circle at ${cursorPosition.x}px ${cursorPosition.y}px, transparent 0%, transparent 150px, rgba(0, 0, 0, 0.8) 200px, black 250px)`
                : 'none',
              WebkitMaskImage: isFlashlightOn
                ? isSputtering
                  ? 'none'
                  : `radial-gradient(circle at ${cursorPosition.x}px ${cursorPosition.y}px, transparent 0%, transparent 150px, rgba(0, 0, 0, 0.8) 200px, black 250px)`
                : 'none',
              maskSize: '100% 100%',
              WebkitMaskSize: '100% 100%',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
              pointerEvents: 'none',
              transition: 'none'
            }}
          />

          {/* Flashlight Glow (Optional) */}
          {/* Glowing Eyes */}
          <div
            className='eyes-container'
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              zIndex: 102,
              pointerEvents: 'none'
            }}
          >
            {eyes.map(eye => {
              // Calculate distance from eye position to flashlight cursor
              const eyeXPercent = eye.x
              const eyeYPercent = eye.y
              const cursorXPercent =
                (cursorPosition.x / window.innerWidth) * 100
              const cursorYPercent =
                (cursorPosition.y / window.innerHeight) * 100

              // Calculate direct distance using Pythagorean theorem
              const distanceToFlashlight = Math.sqrt(
                Math.pow(eyeXPercent - cursorXPercent, 2) +
                  Math.pow(eyeYPercent - cursorYPercent, 2)
              )

              // Hide eyes when flashlight is too close (smaller threshold on mobile)
              const isTooCloseToFlashlight =
                isFlashlightOn &&
                distanceToFlashlight < (deviceType === 'mobile' ? 15 : 20)

              return (
                eye.visible &&
                !isTooCloseToFlashlight && (
                  <div
                    key={`eye-${eye.id}`}
                    className='eye-pair'
                    style={{
                      position: 'fixed',
                      left: `${eye.x}%`,
                      top: `${eye.y}%`,
                      zIndex: 102,
                      display: 'flex',
                      gap: `${eye.eyeSpacing}px`,
                      transform: 'translate(-50%, -50%)',
                      animationName: 'blink',
                      animationDuration: `${eye.blinkDuration}s`,
                      animationDelay: `${eye.blinkDelay}s`,
                      animationIterationCount: 'infinite',
                      animationTimingFunction: 'ease-in-out',
                      pointerEvents: 'none'
                    }}
                  >
                    {/* Left Eye */}
                    <div
                      className='eye left-eye'
                      style={{
                        width:
                          deviceType === 'mobile'
                            ? eye.eyeType === 'large'
                              ? `${Math.max(eye.size * 18, 18)}px`
                              : eye.eyeType === 'small'
                                ? `${Math.max(eye.size * 12, 12)}px`
                                : `${Math.max(eye.size * 15, 15)}px`
                            : eye.eyeType === 'large'
                              ? `${eye.size * 14}px`
                              : eye.eyeType === 'small'
                                ? `${eye.size * 7}px`
                                : `${eye.size * 10}px`,
                        height:
                          deviceType === 'mobile'
                            ? eye.eyeType === 'large'
                              ? `${Math.max(eye.size * 18, 18)}px`
                              : eye.eyeType === 'small'
                                ? `${Math.max(eye.size * 12, 12)}px`
                                : `${Math.max(eye.size * 15, 15)}px`
                            : eye.eyeShape === 'oval'
                              ? `${eye.size * 12}px`
                              : eye.eyeShape === 'almond'
                                ? `${eye.size * 8}px`
                                : eye.eyeType === 'large'
                                  ? `${eye.size * 14}px`
                                  : eye.eyeType === 'small'
                                    ? `${eye.size * 7}px`
                                    : `${eye.size * 10}px`,
                        borderRadius:
                          eye.eyeShape === 'almond'
                            ? '60% 40%'
                            : eye.eyeShape === 'oval'
                              ? '50% / 60%'
                              : '50%',
                        background: eye.eyeColor,
                        boxShadow: `0 0 ${deviceType === 'mobile' ? Math.max(eye.size * 8, 8) : eye.size * 5}px ${deviceType === 'mobile' ? Math.max(eye.size * 5, 5) : eye.size * 3}px ${hexToRgba(eye.eyeColor, eye.brightness)}`,
                        opacity: eye.brightness,
                        position: 'relative',
                        overflow: eye.hasPupils ? 'visible' : 'hidden',
                        pointerEvents: 'none'
                      }}
                    >
                      {/* Left Pupil */}
                      {eye.hasPupils && (
                        <div
                          className='pupil'
                          style={{
                            position: 'absolute',
                            width: `${(deviceType === 'mobile' ? Math.max(eye.pupilSize, 0.3) : eye.pupilSize) * 100}%`,
                            height: `${(deviceType === 'mobile' ? Math.max(eye.pupilSize, 0.3) : eye.pupilSize) * 100}%`,
                            borderRadius: '50%',
                            backgroundColor: eye.pupilColor,
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            pointerEvents: 'none'
                          }}
                        />
                      )}
                    </div>

                    {/* Right Eye */}
                    <div
                      className='eye right-eye'
                      style={{
                        width:
                          deviceType === 'mobile'
                            ? eye.eyeType === 'large'
                              ? `${Math.max(eye.size * 18, 18)}px`
                              : eye.eyeType === 'small'
                                ? `${Math.max(eye.size * 12, 12)}px`
                                : `${Math.max(eye.size * 15, 15)}px`
                            : eye.eyeType === 'large'
                              ? `${eye.size * 14}px`
                              : eye.eyeType === 'small'
                                ? `${eye.size * 7}px`
                                : `${eye.size * 10}px`,
                        height:
                          deviceType === 'mobile'
                            ? eye.eyeType === 'large'
                              ? `${Math.max(eye.size * 18, 18)}px`
                              : eye.eyeType === 'small'
                                ? `${Math.max(eye.size * 12, 12)}px`
                                : `${Math.max(eye.size * 15, 15)}px`
                            : eye.eyeShape === 'oval'
                              ? `${eye.size * 12}px`
                              : eye.eyeShape === 'almond'
                                ? `${eye.size * 8}px`
                                : eye.eyeType === 'large'
                                  ? `${eye.size * 14}px`
                                  : eye.eyeType === 'small'
                                    ? `${eye.size * 7}px`
                                    : `${eye.size * 10}px`,
                        borderRadius:
                          eye.eyeShape === 'almond'
                            ? '60% 40%'
                            : eye.eyeShape === 'oval'
                              ? '50% / 60%'
                              : '50%',
                        background: eye.eyeColor,
                        boxShadow: `0 0 ${deviceType === 'mobile' ? Math.max(eye.size * 8, 8) : eye.size * 5}px ${deviceType === 'mobile' ? Math.max(eye.size * 5, 5) : eye.size * 3}px ${hexToRgba(eye.eyeColor, eye.brightness)}`,
                        opacity: eye.brightness,
                        position: 'relative',
                        overflow: eye.hasPupils ? 'visible' : 'hidden',
                        pointerEvents: 'none'
                      }}
                    >
                      {/* Right Pupil */}
                      {eye.hasPupils && (
                        <div
                          className='pupil'
                          style={{
                            position: 'absolute',
                            width: `${(deviceType === 'mobile' ? Math.max(eye.pupilSize, 0.3) : eye.pupilSize) * 100}%`,
                            height: `${(deviceType === 'mobile' ? Math.max(eye.pupilSize, 0.3) : eye.pupilSize) * 100}%`,
                            borderRadius: '50%',
                            backgroundColor: eye.pupilColor,
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            pointerEvents: 'none'
                          }}
                        />
                      )}
                    </div>
                  </div>
                )
              )
            })}
          </div>

          {/* Exit Button */}
          <Button
            variant='destructive'
            className='fixed top-4 right-4 z-[104] font-bold text-white opacity-0 hover:opacity-100 transition-opacity duration-200'
            style={{
              opacity: isButtonVisible() ? '0.7' : '0',
              pointerEvents: isButtonVisible() ? 'auto' : 'none'
            }}
            onClick={exitDarkMode}
          >
            EXIT
          </Button>
        </div>
      )}

      {/* Global Styles */}
      <style jsx global>{`
        /* Dark Mode Styles */
        html.dark {
          color-scheme: dark;
        }

        /* Scary Dark Mode Styles - affects the entire page */
        html.scary-dark {
          transition: background-color 0.3s ease;
        }

        html.scary-dark body {
          cursor: none !important;
        }

        /* Eye Blinking Animations */
        @keyframes blink {
          0%,
          95% {
            opacity: 1;
            transform: translate(-50%, -50%) scaleY(1);
          }
          97% {
            opacity: 0.6;
            transform: translate(-50%, -50%) scaleY(0.1);
          }
          99% {
            opacity: 1;
            transform: translate(-50%, -50%) scaleY(1);
          }
        }

        /* Pupil animations */
        .pupil {
          animation: pupilPulse 3s infinite alternate ease-in-out;
        }

        @keyframes pupilPulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) scale(0.85);
          }
          100% {
            transform: translate(-50%, -50%) scale(1.15);
          }
        }
      `}</style>
    </Card>
  )
}
