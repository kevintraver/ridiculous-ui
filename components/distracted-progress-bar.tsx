"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { RotateCcw, Coffee, HelpCircle } from "lucide-react"

type DistractionType = "vibrate" | "coffee" | "forget" | "normal"

export default function DistractedProgressBar() {
  const [progress, setProgress] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [distraction, setDistraction] = useState<DistractionType>("normal")
  const [message, setMessage] = useState<string | null>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const lastUpdateTime = useRef(Date.now())
  const distractionTimeout = useRef<NodeJS.Timeout | null>(null)

  // Start or reset the progress
  const startProgress = () => {
    setProgress(0)
    setIsRunning(true)
    setDistraction("normal")
    setMessage(null)
    setPosition({ x: 0, y: 0 })
    lastUpdateTime.current = Date.now()

    if (distractionTimeout.current) {
      clearTimeout(distractionTimeout.current)
    }

    // Schedule the first distraction
    scheduleDistraction()
  }

  // Schedule a random distraction
  const scheduleDistraction = () => {
    if (distractionTimeout.current) {
      clearTimeout(distractionTimeout.current)
    }

    // Random time between 2-5 seconds before next distraction
    const nextDistractionTime = 2000 + Math.random() * 3000

    distractionTimeout.current = setTimeout(() => {
      if (!isRunning) return

      // Choose a random distraction
      const distractions: DistractionType[] = ["vibrate", "coffee", "forget", "normal"]
      const weights = [0.4, 0.2, 0.2, 0.2] // Higher chance for vibrate

      // Weighted random selection
      const randomValue = Math.random()
      let cumulativeWeight = 0
      let selectedDistraction: DistractionType = "normal"

      for (let i = 0; i < distractions.length; i++) {
        cumulativeWeight += weights[i]
        if (randomValue <= cumulativeWeight) {
          selectedDistraction = distractions[i]
          break
        }
      }

      applyDistraction(selectedDistraction)

      // Schedule the next distraction
      scheduleDistraction()
    }, nextDistractionTime)
  }

  // Apply the selected distraction
  const applyDistraction = (type: DistractionType) => {
    setDistraction(type)

    switch (type) {
      case "vibrate":
        setMessage("Hmm, what was I doing again?")
        // Will vibrate for 2-4 seconds
        setTimeout(
          () => {
            if (isRunning) {
              setDistraction("normal")
              setMessage(null)
            }
          },
          2000 + Math.random() * 2000,
        )
        break

      case "coffee":
        setMessage("Brb, getting coffee...")
        // Move off-screen
        setPosition({ x: Math.random() > 0.5 ? 100 : -100, y: 0 })
        // Come back after 3-5 seconds
        setTimeout(
          () => {
            if (isRunning) {
              setPosition({ x: 0, y: 0 })
              setMessage("I'm back! Did I miss anything?")
              setTimeout(() => {
                if (isRunning) {
                  setDistraction("normal")
                  setMessage(null)
                }
              }, 1500)
            }
          },
          3000 + Math.random() * 2000,
        )
        break

      case "forget":
        setMessage("Wait, what was I doing again?")
        // Reset progress after a short delay
        setTimeout(() => {
          if (isRunning) {
            setProgress(0)
            setMessage("Oh right, I was supposed to be progressing...")
            setTimeout(() => {
              if (isRunning) {
                setDistraction("normal")
                setMessage(null)
              }
            }, 1500)
          }
        }, 1000)
        break

      case "normal":
      default:
        setMessage(null)
        break
    }
  }

  // Handle mouse hover
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!progressBarRef.current || !containerRef.current || distraction !== "normal") return

    const container = containerRef.current.getBoundingClientRect()
    const progressBar = progressBarRef.current.getBoundingClientRect()

    const mouseX = e.clientX - container.left
    const mouseY = e.clientY - container.top

    // Check if mouse is near the progress bar
    const isNearProgressBar =
      mouseX >= progressBar.left - container.left - 20 &&
      mouseX <= progressBar.right - container.left + 20 &&
      mouseY >= progressBar.top - container.top - 20 &&
      mouseY <= progressBar.bottom - container.top + 20

    if (isNearProgressBar && !isHovering) {
      setIsHovering(true)

      // Move away from cursor
      const moveX = mouseX > container.width / 2 ? -20 : 20
      setPosition({ x: moveX, y: 10 })
      setMessage("Hey! Personal space, please!")

      // Reset after a short delay
      setTimeout(() => {
        if (isRunning) {
          setPosition({ x: 0, y: 0 })
          setMessage(null)
          setIsHovering(false)
        }
      }, 1500)
    }
  }

  // Update progress
  useEffect(() => {
    if (!isRunning) return

    const timer = setInterval(() => {
      const now = Date.now()
      const elapsed = now - lastUpdateTime.current
      lastUpdateTime.current = now

      setProgress((prev) => {
        // Only increase progress when not distracted or just vibrating
        if (distraction === "normal" || distraction === "vibrate") {
          // Progress speed depends on distraction
          const increment =
            distraction === "normal"
              ? (elapsed / 1000) * 10 // 10% per second when normal
              : (elapsed / 1000) * 3 // 3% per second when vibrating

          return Math.min(100, prev + increment)
        }
        return prev
      })
    }, 100)

    return () => clearInterval(timer)
  }, [isRunning, distraction])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (distractionTimeout.current) {
        clearTimeout(distractionTimeout.current)
      }
    }
  }, [])

  return (
    <div className="space-y-6" ref={containerRef} onMouseMove={handleMouseMove}>
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium">Progress: {Math.round(progress)}%</div>
        <Button variant="outline" size="sm" onClick={startProgress} disabled={isRunning && progress < 100}>
          <RotateCcw className="h-4 w-4 mr-1" />
          {isRunning ? "Restart" : "Start"}
        </Button>
      </div>

      <div
        className="relative"
        ref={progressBarRef}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: "transform 0.5s ease-out",
        }}
      >
        <Progress
          value={progress}
          className={`h-4 ${distraction === "vibrate" ? "animate-[vibrate_0.1s_linear_infinite]" : ""}`}
        />

        {distraction === "coffee" && (
          <div className="absolute -right-8 top-0">
            <Coffee className="h-5 w-5 text-muted-foreground animate-bounce" />
          </div>
        )}

        {distraction === "forget" && (
          <div className="absolute -right-8 top-0">
            <HelpCircle className="h-5 w-5 text-muted-foreground animate-pulse" />
          </div>
        )}
      </div>

      {message && <div className="text-center text-sm italic animate-fade-in">{message}</div>}

      <style jsx>{`
        @keyframes vibrate {
          0% { transform: translate(${position.x}px, ${position.y}px); }
          25% { transform: translate(${position.x + 2}px, ${position.y - 2}px); }
          50% { transform: translate(${position.x - 2}px, ${position.y + 2}px); }
          75% { transform: translate(${position.x + 2}px, ${position.y + 2}px); }
          100% { transform: translate(${position.x}px, ${position.y}px); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <div className="p-4 border rounded-md bg-yellow-50 dark:bg-yellow-950">
        <p className="text-sm text-yellow-800 dark:text-yellow-300">
          <strong>Note:</strong> This progress bar has severe attention issues. It might vibrate, wander off for coffee,
          completely forget what it was doing, or try to avoid your cursor. Good luck getting to 100%!
        </p>
      </div>
    </div>
  )
}

