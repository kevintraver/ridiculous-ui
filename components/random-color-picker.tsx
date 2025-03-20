'use client'

import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export default function RandomColorPicker() {
  const [selectedColor, setSelectedColor] = useState('#ff0000')
  const [displayedColor, setDisplayedColor] = useState('#ff0000')
  const [colorName, setColorName] = useState('Red')

  // Generate a random color that's different from the selected one
  const getRandomColor = (currentColor: string) => {
    const colors = [
      { hex: '#ff0000', name: 'Red' },
      { hex: '#00ff00', name: 'Green' },
      { hex: '#0000ff', name: 'Blue' },
      { hex: '#ffff00', name: 'Yellow' },
      { hex: '#ff00ff', name: 'Magenta' },
      { hex: '#00ffff', name: 'Cyan' },
      { hex: '#ff8000', name: 'Orange' },
      { hex: '#8000ff', name: 'Purple' }
    ]

    const filteredColors = colors.filter(color => color.hex !== currentColor)
    const randomColor =
      filteredColors[Math.floor(Math.random() * filteredColors.length)]

    return randomColor
  }

  // When user selects a color, show a different one
  useEffect(() => {
    const randomColor = getRandomColor(selectedColor)
    setDisplayedColor(randomColor.hex)
    setColorName(randomColor.name)
  }, [selectedColor])

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='color-picker'>Select a color:</Label>
        <Input
          id='color-picker'
          type='color'
          value={selectedColor}
          onChange={e => setSelectedColor(e.target.value)}
          className='h-10 w-full'
        />
      </div>

      <div className='space-y-2'>
        <Label>The color you selected:</Label>
        <div className='flex items-center space-x-2'>
          <div
            className='h-10 w-10 rounded-md border'
            style={{ backgroundColor: selectedColor }}
          />
          <span>{selectedColor}</span>
        </div>
      </div>

      <div className='space-y-2'>
        <Label>The color you actually get:</Label>
        <div className='flex items-center space-x-2'>
          <div
            className='h-10 w-10 rounded-md border'
            style={{ backgroundColor: displayedColor }}
          />
          <span>
            {displayedColor} ({colorName})
          </span>
        </div>
      </div>

      <p className='text-xs text-muted-foreground italic'>
        This color picker never gives you the color you actually selected!
      </p>
    </div>
  )
}
