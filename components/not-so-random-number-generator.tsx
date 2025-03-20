'use client'

import React, { useState, useEffect } from 'react'

const DecreasingRandomnessGenerator = () => {
  const [number, setNumber] = useState<number | null>(null)
  const [clickCount, setClickCount] = useState(0)
  const [targetNumber] = useState(42) // Fixed target number (always 42)
  const [isGenerating, setIsGenerating] = useState(false)
  const [history, setHistory] = useState<
    Array<{ number: number; randomness: number; count: number }>
  >([])
  const minRange = 1
  const maxRange = 100

  // Calculate randomness factor (decreases with each click)
  const getRandomnessFactor = () => {
    // Start with full randomness (1.0) and decrease with each click
    // Will reach 0 (no randomness) by the 4th click
    return Math.max(0, 1 - clickCount / 3)
  }

  // Generate a new number with decreasing randomness
  const generateNumber = () => {
    setIsGenerating(true)

    // Intermediate values to show "calculation" effect
    let iterations = 10
    let currentIteration = 0

    const interval = setInterval(() => {
      if (currentIteration < iterations) {
        // Generate a completely random number for the animation
        const randomNum =
          Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange
        setNumber(randomNum)
        currentIteration++
      } else {
        clearInterval(interval)

        // Calculate final number with decreasing randomness
        const randomnessFactor = getRandomnessFactor()

        // Blend between a random number and the target number based on randomness factor
        const pureRandom =
          Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange
        const blendedNumber = Math.round(
          pureRandom * randomnessFactor + targetNumber * (1 - randomnessFactor)
        )

        const finalNumber = Math.min(
          Math.max(blendedNumber, minRange),
          maxRange
        )
        setNumber(finalNumber)

        // Add to history with randomness factor
        setHistory((prev) => [
          ...prev,
          {
            number: finalNumber,
            randomness: Math.round(randomnessFactor * 100),
            count: clickCount + 1
          }
        ])

        setClickCount((prev) => prev + 1)
        setIsGenerating(false)
      }
    }, 50)
  }

  // Reset everything
  const resetGenerator = () => {
    setClickCount(0)
    setNumber(null)
    setHistory([])
    // Target number always stays 42
  }

  // Prepare hints based on click count
  let hintMessage = null
  if (clickCount > 1 && clickCount < 4) {
    hintMessage = (
      <div className="text-sm text-gray-500 italic">
        Is it just me, or are these numbers getting less random? 🤔
      </div>
    )
  } else if (clickCount >= 4) {
    hintMessage = (
      <div className="text-sm text-gray-500 italic">
        I think this generator really likes the number 42...
      </div>
    )
  }

  // Create placeholder entries for the history
  const renderHistoryContent = () => {
    if (history.length > 0) {
      return history
        .slice()
        .reverse()
        .map((item, index) => (
          <div
            key={index}
            className="flex justify-between text-sm py-1 border-b border-gray-100 last:border-0"
          >
            <span>
              #{item.count}: {item.number}
            </span>
            <span className="text-gray-500">{item.randomness}% random</span>
          </div>
        ))
    } else {
      // Create 5 placeholder entries
      return Array(5)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="flex justify-between text-sm py-1 border-b border-gray-100 last:border-0 text-gray-200"
          >
            <span>#{index + 1}: -</span>
            <span>-% random</span>
          </div>
        ))
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <p className="text-gray-600 mb-6 text-center">
        Generates a random number between {minRange} and {maxRange}
      </p>

      {/* Number display */}
      <div className="bg-gray-100 rounded-xl h-32 mb-6 flex items-center justify-center">
        {number !== null ? (
          <div
            className={`text-5xl font-bold ${
              isGenerating ? 'animate-pulse' : ''
            }`}
          >
            {number}
          </div>
        ) : (
          <div className="text-xl text-gray-400">
            Click the button to generate
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={generateNumber}
          disabled={isGenerating}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg flex-1 disabled:opacity-50 transition-colors"
        >
          {isGenerating ? 'Generating...' : 'Generate Number'}
        </button>

        <button
          onClick={resetGenerator}
          disabled={isGenerating || clickCount === 0}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg disabled:opacity-50 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Fixed-height container for all the varying content */}
      <div className="border-t border-gray-200 pt-4">
        {/* Stats row - always visible */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600">
            Click count: {clickCount}
          </span>
          <span className="text-sm text-gray-600">
            Randomness:{' '}
            {clickCount > 0 ? Math.round(getRandomnessFactor() * 100) : 100}%
          </span>
        </div>

        {/* Fixed height area for hint messages */}

        {/* History section - always visible with fixed height */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2">History:</h3>
          <div className="bg-gray-50 rounded p-2 h-[160px] overflow-y-auto">
            {renderHistoryContent()}
          </div>
        </div>

        <div className="min-h-[48px] mb-4">{hintMessage}</div>
      </div>
    </div>
  )
}

export default DecreasingRandomnessGenerator
