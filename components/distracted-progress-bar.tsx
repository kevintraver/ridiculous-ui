'use client'

import { useState, useEffect, useRef } from 'react'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { RotateCcw, Coffee, HelpCircle } from 'lucide-react'

type DistractionType = 'vibrate' | 'coffee' | 'forget' | 'backtrack' | 'normal'

export default function DistractedProgressBar() {
  const [progress, setProgress] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [distraction, setDistraction] = useState<DistractionType>('normal')
  const [message, setMessage] = useState<string | null>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const lastUpdateTime = useRef(Date.now())
  const distractionTimeout = useRef<NodeJS.Timeout | null>(null)

  const startProgress = () => {
    setProgress(0)
    setIsRunning(true)
    setDistraction('normal')
    setMessage(null)
    lastUpdateTime.current = Date.now()

    if (distractionTimeout.current) clearTimeout(distractionTimeout.current)

    scheduleDistraction()
  }

  const scheduleDistraction = () => {
    if (distractionTimeout.current) clearTimeout(distractionTimeout.current)

    const nextDistractionTime = 300 + Math.random() * 900

    distractionTimeout.current = setTimeout(() => {
      if (!isRunning) return

      const distractions: DistractionType[] = [
        'vibrate',
        'coffee',
        'forget',
        'backtrack'
      ]
      const selectedDistraction =
        distractions[Math.floor(Math.random() * distractions.length)]

      applyDistraction(selectedDistraction)
      scheduleDistraction()
    }, nextDistractionTime)
  }

  const applyDistraction = (type: DistractionType) => {
    setDistraction(type)

    switch (type) {
      case 'vibrate':
        setMessage('Why is everything shaking?!')
        let shakeInterval = setInterval(() => {
          setPosition({
            x: (Math.random() - 0.5) * 10,
            y: (Math.random() - 0.5) * 10
          })
        }, 50)

        setTimeout(() => {
          clearInterval(shakeInterval)
          setPosition({ x: 0, y: 0 })
          resetDistraction()
        }, 2000 + Math.random() * 2000)
        break

      case 'coffee':
        setMessage('Brb, getting coffee...')
        let moveX = Math.random() > 0.5 ? 150 : -150
        setPosition({ x: moveX, y: (Math.random() - 0.5) * 50 })

        setTimeout(() => {
          setPosition({ x: 0, y: 0 })
          setMessage('Okay, back!')
          setTimeout(() => resetDistraction(), 1000)
        }, 3000 + Math.random() * 2000)
        break

      case 'forget':
        setMessage('Wait... what was I doing?')
        setPosition({
          x: (Math.random() - 0.5) * 80,
          y: (Math.random() - 0.5) * 40
        })

        setTimeout(() => {
          setProgress((prev) => Math.max(0, prev - Math.random() * 40))
          setMessage('Oh, right...')
          setPosition({ x: 0, y: 0 })
          setTimeout(() => resetDistraction(), 1500)
        }, 1000)
        break

      case 'backtrack':
        setMessage('Oops, wrong direction!')
        setPosition({
          x: (Math.random() - 0.5) * 60,
          y: (Math.random() - 0.5) * 30
        })

        setTimeout(() => {
          setProgress((prev) => Math.max(0, prev - Math.random() * 30))
          setPosition({ x: 0, y: 0 })
          resetDistraction()
        }, 1500)
        break

      default:
        resetDistraction()
        break
    }
  }

  const resetDistraction = () => {
    if (isRunning) {
      setDistraction('normal')
      setMessage(null)
    }
  }

  useEffect(() => {
    if (!isRunning) return

    const timer = setInterval(() => {
      const now = Date.now()
      const elapsed = now - lastUpdateTime.current
      lastUpdateTime.current = now

      setProgress((prev) => {
        if (prev >= 99) return prev
        const increment = distraction === 'normal' ? (elapsed / 1000) * 10 : 0
        return Math.min(99, prev + increment)
      })
    }, 100)

    return () => clearInterval(timer)
  }, [isRunning, distraction])

  useEffect(() => {
    return () => {
      if (distractionTimeout.current) clearTimeout(distractionTimeout.current)
    }
  }, [])

  return (
    <div className="space-y-6" ref={containerRef}>
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium">
          Progress: {Math.round(progress)}%
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={startProgress}
          disabled={isRunning}
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          {isRunning ? 'Restart' : 'Start'}
        </Button>
      </div>

      <div
        className="relative"
        ref={progressBarRef}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <Progress
          value={progress}
          className={`${distraction === 'vibrate' ? '' : ''}`}
        />

        {distraction === 'coffee' && (
          <div className="absolute -right-8 top-0">
            <Coffee className="h-5 w-5 text-muted-foreground animate-bounce" />
          </div>
        )}

        {distraction === 'forget' && (
          <div className="absolute -right-8 top-0">
            <HelpCircle className="h-5 w-5 text-muted-foreground animate-pulse" />
          </div>
        )}
      </div>

      {message && (
        <div className="text-center text-sm italic animate-fade-in">
          {message}
        </div>
      )}
    </div>
  )
}
