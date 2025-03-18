"use client"

import { useState, useRef, useEffect } from "react"
import { Slider } from "@/components/ui/slider"

export default function RidiculousSlider() {
  const [value, setValue] = useState([50])
  const [displayValue, setDisplayValue] = useState(50)
  const lastValue = useRef(50)

  // Update the display value in the opposite direction
  useEffect(() => {
    if (value[0] !== lastValue.current) {
      const difference = value[0] - lastValue.current
      setDisplayValue((prev) => Math.max(0, Math.min(100, prev - difference)))
      lastValue.current = value[0]
    }
  }, [value])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Value: {displayValue}</span>
        <span className="text-sm font-medium">Actual Slider Value: {value[0]}</span>
      </div>

      <Slider value={value} onValueChange={setValue} max={100} step={1} className="cursor-pointer" />

      <div className="text-sm text-muted-foreground italic">
        Try dragging the slider and watch the displayed value move in the opposite direction!
      </div>
    </div>
  )
}

