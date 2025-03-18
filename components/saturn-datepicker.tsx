'use client'

import * as React from 'react'
import { useState, useMemo } from 'react'

// Saturn date interface
interface SaturnDate {
  day: number
  moonCycle: number
  year: number
}

export default function SaturnCalendar() {
  // Saturn constants
  const majorMoons = [
    'Titan',
    'Rhea',
    'Iapetus',
    'Dione',
    'Tethys',
    'Enceladus',
    'Mimas'
  ]
  const daysInMoonCycle = 42

  // State for selected date
  const [selected, setSelected] = useState<SaturnDate>({
    day: 15,
    moonCycle: 0,
    year: 472
  })

  // State for currently displayed moon cycle view
  const [viewState, setViewState] = useState({
    moonCycle: selected.moonCycle,
    year: selected.year
  })

  // Calculate Earth equivalent year (very rough approximation)
  const getEarthYear = (saturnDate: SaturnDate): number => {
    const baseYear = 1610 // Saturn discovery
    const earthYears = saturnDate.year * 29.5
    return Math.floor(baseYear + earthYears)
  }

  // Navigation functions
  const previousMonth = () => {
    setViewState((prev) => {
      if (prev.moonCycle > 0) {
        return { ...prev, moonCycle: prev.moonCycle - 1 }
      } else {
        return {
          moonCycle: majorMoons.length - 1,
          year: prev.year > 0 ? prev.year - 1 : 0
        }
      }
    })
  }

  const nextMonth = () => {
    setViewState((prev) => {
      if (prev.moonCycle < majorMoons.length - 1) {
        return { ...prev, moonCycle: prev.moonCycle + 1 }
      } else {
        return { moonCycle: 0, year: prev.year + 1 }
      }
    })
  }

  // Generate days for the current month view
  const days = useMemo(() => {
    const days = []

    // Add empty cells for days before the first day of the month
    // Using a simple offset to stagger the start days of different moon cycles
    const startOffset = (viewState.moonCycle * 2) % 7
    for (let i = 0; i < startOffset; i++) {
      days.push({ day: 0, type: 'offset' })
    }

    // Add the actual days
    for (let i = 1; i <= daysInMoonCycle; i++) {
      // Special Saturn day types
      const isRingShadowDay = i % 9 === 0
      const isStormDay = i % 15 === 0

      days.push({
        day: i,
        type: 'day',
        isRingShadowDay,
        isStormDay
      })
    }

    // Pad the end to complete the last week row if needed
    const endPadding = 7 - (days.length % 7)
    if (endPadding < 7) {
      for (let i = 0; i < endPadding; i++) {
        days.push({ day: 0, type: 'offset' })
      }
    }

    return days
  }, [viewState.moonCycle, viewState.year])

  // Group days into weeks
  const weeks = useMemo(() => {
    const result = []
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7))
    }
    return result
  }, [days])

  // Is the day selected
  const isSelected = (day: number) => {
    return (
      day === selected.day &&
      viewState.moonCycle === selected.moonCycle &&
      viewState.year === selected.year
    )
  }

  return (
    <div className="p-3 w-[400px] rounded-md border shadow space-y-4">
      <div className="flex justify-between items-center">
        <div
          onClick={previousMonth}
          className="p-1 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground cursor-pointer"
          role="button"
          aria-label="Previous month"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </div>
        <h2 className="text-sm font-medium flex items-center gap-1">
          {majorMoons[viewState.moonCycle]} Cycle · Saturn Year {viewState.year}
          <span className="text-xs text-muted-foreground font-normal">
            ({getEarthYear(selected)} E)
          </span>
        </h2>
        <div
          onClick={nextMonth}
          className="p-1 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground cursor-pointer"
          role="button"
          aria-label="Next month"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </div>
      </div>

      {/* Day names header */}
      <div className="grid grid-cols-7 text-center text-xs leading-6 text-muted-foreground">
        <div>S</div>
        <div>M</div>
        <div>T</div>
        <div>W</div>
        <div>T</div>
        <div>F</div>
        <div>S</div>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 text-sm">
        {days.map((day, i) => (
          <div
            key={i}
            className={`h-9 p-0 text-center text-sm relative focus-within:relative focus-within:z-20 ${
              day.type === 'offset' ? 'text-muted-foreground opacity-50' : ''
            }`}
          >
            {day.type === 'day' && (
              <button
                className={`inline-flex h-8 w-8 items-center justify-center rounded-md p-0 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                  isSelected(day.day)
                    ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground'
                    : ''
                }`}
                onClick={() =>
                  setSelected({
                    day: day.day,
                    moonCycle: viewState.moonCycle,
                    year: viewState.year
                  })
                }
              >
                <div className="relative flex flex-col items-center">
                  {/* Indicators above the date */}
                  <div className="flex gap-0.5 h-1.5 mb-0.5">
                    {day.isRingShadowDay && (
                      <span className="h-1.5 w-1.5 rounded-full bg-yellow-400"></span>
                    )}
                    {day.isStormDay && (
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                    )}
                  </div>
                  {day.day}
                </div>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Saturn info footer */}
      <div className="mt-2 pt-2 border-t text-xs text-center text-muted-foreground">
        <div className="flex justify-center gap-3 mb-1">
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-400"></span>
            <span>Ring Shadow</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
            <span>Hexagon Storm</span>
          </div>
        </div>
        <div>1 Saturn Year = 29.5 Earth Years</div>
      </div>
    </div>
  )
}
