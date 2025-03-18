"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Bomb, Sparkles, RotateCcw } from "lucide-react"

export default function SelfDestructingTextField() {
  const [text, setText] = useState("")
  const [countdown, setCountdown] = useState(3)
  const [isExploding, setIsExploding] = useState(false)
  const [difficultyLevel, setDifficultyLevel] = useState(1)
  const [isPaused, setIsPaused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const lastDeleteTime = useRef(Date.now())

  // Get settings based on difficulty level
  const getDifficultySettings = () => {
    switch (difficultyLevel) {
      case 1: // Easy
        return {
          interval: 3,
          charsToDelete: 1, // Delete 1 character at a time
        }
      case 2: // Medium
        return {
          interval: 2,
          charsToDelete: 2, // Delete 2 characters at a time
        }
      case 3: // Hard
        return {
          interval: 1, // Faster deletion
          charsToDelete: 3, // Delete 3 characters at a time
        }
      default:
        return {
          interval: 3,
          charsToDelete: 1,
        }
    }
  }

  // Handle the countdown and text deletion
  useEffect(() => {
    if (isPaused) return

    const settings = getDifficultySettings()
    const timer = setInterval(() => {
      const now = Date.now()
      const elapsed = (now - lastDeleteTime.current) / 1000

      // Update countdown based on elapsed time
      setCountdown((prev) => {
        const newCountdown = Math.max(0, settings.interval - elapsed)

        // Time to delete characters
        if (newCountdown <= 0 && text.length > 0) {
          deleteCharacters()
          lastDeleteTime.current = now
          return settings.interval
        }

        return newCountdown
      })
    }, 100)

    return () => clearInterval(timer)
  }, [isPaused, difficultyLevel, text])

  // Function to delete characters from the end of the text
  const deleteCharacters = () => {
    if (text.length === 0) return

    const settings = getDifficultySettings()
    const charsToDelete = Math.min(settings.charsToDelete, text.length)

    // Delete characters from the end
    const newText = text.slice(0, -charsToDelete)
    setText(newText)

    // Show explosion effect
    showExplosion()
  }

  // Show explosion animation
  const showExplosion = () => {
    if (!inputRef.current || !containerRef.current) return

    const inputRect = inputRef.current.getBoundingClientRect()

    // Position the explosion near the end of the text
    setIsExploding(true)
    setTimeout(() => setIsExploding(false), 500)
  }

  // Handle text change
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
    // Don't reset the timer when typing - let it continue to delete
  }

  // Toggle pause state
  const togglePause = () => {
    setIsPaused(!isPaused)
    if (!isPaused) {
      // When resuming, reset the last delete time
      lastDeleteTime.current = Date.now()
    }
  }

  // Change difficulty level
  const changeDifficulty = (level: number) => {
    setDifficultyLevel(level)
    lastDeleteTime.current = Date.now() // Reset timer when changing difficulty
  }

  // Reset the text field
  const resetTextField = () => {
    setText("")
    lastDeleteTime.current = Date.now()
  }

  // Calculate progress percentage
  const progressPercentage = (countdown / getDifficultySettings().interval) * 100

  return (
    <div className="space-y-4" ref={containerRef}>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="self-destructing-field">Try to type something coherent:</Label>
          <div className="flex items-center gap-2">
            <Button variant={isPaused ? "default" : "outline"} size="sm" onClick={togglePause}>
              {isPaused ? "Resume Chaos" : "Pause Chaos"}
            </Button>
            <Button variant="outline" size="sm" onClick={resetTextField}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>

        <div className="relative">
          <Input
            ref={inputRef}
            id="self-destructing-field"
            value={text}
            onChange={handleTextChange}
            placeholder="Type here... if you dare"
            className="pr-10"
          />

          {/* Explosion animation */}
          {isExploding && (
            <div
              className="absolute pointer-events-none"
              style={{
                left: `${Math.min(300, Math.max(20, text.length * 8))}px`,
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="animate-ping">
                <Sparkles className="h-6 w-6 text-red-500" />
              </div>
            </div>
          )}

          {/* Self-destruct indicator */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Bomb className={`h-4 w-4 ${countdown < 1 ? "text-red-500 animate-pulse" : "text-muted-foreground"}`} />
          </div>
        </div>
      </div>

      {/* Self-destruct timer */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span>Backspace attack in: {countdown.toFixed(1)}s</span>
          <span>Difficulty: {difficultyLevel === 1 ? "Easy" : difficultyLevel === 2 ? "Medium" : "Hard"}</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Difficulty selector */}
      <div className="flex gap-2 justify-center pt-2">
        <Button variant={difficultyLevel === 1 ? "default" : "outline"} size="sm" onClick={() => changeDifficulty(1)}>
          Easy (1 char)
        </Button>
        <Button variant={difficultyLevel === 2 ? "default" : "outline"} size="sm" onClick={() => changeDifficulty(2)}>
          Medium (2 chars)
        </Button>
        <Button variant={difficultyLevel === 3 ? "default" : "outline"} size="sm" onClick={() => changeDifficulty(3)}>
          Hard (3 chars)
        </Button>
      </div>

      <div className="p-4 border rounded-md bg-yellow-50 dark:bg-yellow-950">
        <p className="text-sm text-yellow-800 dark:text-yellow-300">
          <strong>Warning:</strong> This text field is actively fighting against you! It will continuously erase your
          text like an aggressive backspace key, even while you're typing. The harder the difficulty, the more
          characters it deletes and the faster it strikes!
        </p>
      </div>
    </div>
  )
}

