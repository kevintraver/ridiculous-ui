'use client'

import { useState, useEffect } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export default function ConfusingToggle() {
  const [isChecked, setIsChecked] = useState(false)
  const [visuallyChecked, setVisuallyChecked] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [message, setMessage] = useState('')

  // This toggle has a mind of its own
  const handleToggleChange = () => {
    setClickCount(prev => prev + 1)

    // Every third click actually toggles the state
    if (clickCount % 3 === 2) {
      setIsChecked(!isChecked)
      setMessage(`Toggle ${!isChecked ? 'activated' : 'deactivated'}!`)
    } else {
      // Other clicks just show visual feedback but don't actually change state
      setVisuallyChecked(!visuallyChecked)
      setMessage(
        `Click ${3 - (clickCount % 3)} more time${clickCount % 3 === 1 ? '' : 's'} to toggle`
      )
    }
  }

  // Reset visual state after a delay
  useEffect(() => {
    if (visuallyChecked !== isChecked) {
      const timer = setTimeout(() => {
        setVisuallyChecked(isChecked)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [visuallyChecked, isChecked])

  return (
    <div className='space-y-4'>
      <div className='flex items-center space-x-2'>
        <Switch
          id='confusing-toggle'
          checked={visuallyChecked}
          onCheckedChange={handleToggleChange}
        />
        <Label htmlFor='confusing-toggle'>
          {isChecked ? 'ON' : 'OFF'} (Click count: {clickCount})
        </Label>
      </div>

      {message && <p className='text-sm text-muted-foreground'>{message}</p>}

      <p className='text-xs text-muted-foreground italic'>
        This toggle requires 3 clicks to actually change state. The visual
        feedback is misleading.
      </p>
    </div>
  )
}
