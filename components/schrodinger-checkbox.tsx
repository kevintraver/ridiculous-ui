'use client'

import React, { useState, useEffect, useRef } from 'react'

export default function SchrodingersCheckbox() {
  const [isChecked, setIsChecked] = useState(false)
  const [isObserved, setIsObserved] = useState(false)
  const [collapsedState, setCollapsedState] = useState(false)
  // Fix type to use NodeJS.Timeout instead of number
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Setup the rapid toggle effect when not being observed
  useEffect(() => {
    if (!isObserved) {
      // When not observed, rapidly toggle between states
      intervalRef.current = setInterval(() => {
        setIsChecked((prev) => !prev)
      }, 10) // Super fast toggling at 10ms
    } else {
      // When observed, clear the interval and fix the state
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
      }
      setIsChecked(collapsedState)
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isObserved, collapsedState])

  // Handle the observation (hover)
  const handleObservation = () => {
    if (!isObserved) {
      // When first observed, randomly collapse to a state
      setCollapsedState(Math.random() > 0.5)
      setIsObserved(true)
    }
  }

  // Handle the end of observation
  const handleEndObservation = () => {
    setIsObserved(false)
  }

  // Prevent clicking from changing the state
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  return (
    <div className="flex flex-col items-center p-6 max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Schrödinger's Checkbox
      </h2>

      <div className="text-center mb-6">
        <p className="text-lg">
          I'm both checked and unchecked... until you look!
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            checked={isChecked}
            className="h-12 w-12 rounded bg-gray-100 border-gray-300 text-gray-800 cursor-not-allowed"
            onMouseEnter={handleObservation}
            onMouseLeave={handleEndObservation}
            onChange={() => {}} // Required to avoid React warning
            onClick={handleClick}
            readOnly
          />
        </div>
      </div>

      <div className="text-gray-500 text-sm text-center">
        Hover to observe (state freezes when observed)
      </div>

      <div className="mt-4 bg-gray-100 p-3 rounded-md text-sm font-mono text-center">
        {isObserved
          ? `state = "${collapsedState ? 'checked' : 'unchecked'}";`
          : 'state = "both checked and unchecked";'}
      </div>
    </div>
  )
}
