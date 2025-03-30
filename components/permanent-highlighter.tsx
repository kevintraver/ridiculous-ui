'use client'

import { useState, useRef, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

// Base highlighter colors
const BASE_COLORS = [
  [255, 234, 0], // bright yellow
  [244, 114, 182], // pink
  [103, 232, 249], // cyan
  [163, 230, 53], // lime
  [192, 132, 252], // purple
  [251, 146, 60] // orange
]

// Opacity levels for progressive darkening
const OPACITY_LEVELS = [0.5, 0.6, 0.7, 0.8, 0.9]

// Pixel tolerance for detecting overlaps
const OVERLAP_THRESHOLD = 5

// Type for our highlights
interface Highlight {
  id: string
  color: string
  top: number
  left: number
  width: number
  height: number
  text: string
  colorIndex: number
  opacityLevel: number
}

export default function PermanentHighlighter() {
  // State for storing highlight elements
  const [highlights, setHighlights] = useState<Highlight[]>([])

  // Reference to content container
  const contentRef = useRef<HTMLDivElement>(null)

  // Check if a selection overlaps with an existing highlight
  const findOverlappingHighlight = useCallback(
    (rect: DOMRect) => {
      // First try to find a highlight that substantially overlaps (>50%)
      const substantial = highlights.find(h => {
        // Calculate overlap area
        const xOverlap = Math.max(
          0,
          Math.min(rect.right, h.left + h.width) - Math.max(rect.left, h.left)
        )
        const yOverlap = Math.max(
          0,
          Math.min(rect.bottom, h.top + h.height) - Math.max(rect.top, h.top)
        )
        const overlapArea = xOverlap * yOverlap

        // Calculate area of current selection
        const selectionArea = rect.width * rect.height

        // If overlap is more than 50% of selection area, consider it substantial
        return overlapArea > selectionArea * 0.5
      })

      if (substantial) return substantial

      // Otherwise find any highlight that overlaps at all
      return highlights.find(h => {
        const horizontalOverlap =
          rect.left < h.left + h.width + OVERLAP_THRESHOLD &&
          rect.left + rect.width + OVERLAP_THRESHOLD > h.left
        const verticalOverlap =
          rect.top < h.top + h.height + OVERLAP_THRESHOLD &&
          rect.top + rect.height + OVERLAP_THRESHOLD > h.top

        return horizontalOverlap && verticalOverlap
      })
    },
    [highlights]
  )

  // Get the next color for a highlight
  const getNextColor = useCallback(
    (existingHighlight: Highlight | undefined) => {
      // If no existing highlight, start with the first color at lowest opacity
      if (!existingHighlight) {
        return {
          colorIndex: 0,
          opacityLevel: 0,
          color: `rgba(${BASE_COLORS[0][0]}, ${BASE_COLORS[0][1]}, ${BASE_COLORS[0][2]}, ${OPACITY_LEVELS[0]})`
        }
      }

      // Extract color and opacity information from existing highlight
      const { colorIndex, opacityLevel } = existingHighlight

      // If we've reached max opacity for this color, move to the next color
      if (opacityLevel >= OPACITY_LEVELS.length - 1) {
        const nextColorIndex = (colorIndex + 1) % BASE_COLORS.length
        return {
          colorIndex: nextColorIndex,
          opacityLevel: 0,
          color: `rgba(${BASE_COLORS[nextColorIndex][0]}, ${BASE_COLORS[nextColorIndex][1]}, ${BASE_COLORS[nextColorIndex][2]}, ${OPACITY_LEVELS[0]})`
        }
      }

      // Otherwise, use the same color but increase opacity
      const nextOpacityLevel = opacityLevel + 1
      return {
        colorIndex,
        opacityLevel: nextOpacityLevel,
        color: `rgba(${BASE_COLORS[colorIndex][0]}, ${BASE_COLORS[colorIndex][1]}, ${BASE_COLORS[colorIndex][2]}, ${OPACITY_LEVELS[nextOpacityLevel]})`
      }
    },
    []
  )

  // Handle text selection and create highlight
  const handleSelection = useCallback(() => {
    const selection = window.getSelection()

    // Check if there's a valid selection
    if (
      !selection ||
      selection.isCollapsed ||
      !contentRef.current ||
      selection.rangeCount === 0
    ) {
      return
    }

    const range = selection.getRangeAt(0)
    const selectionText = selection.toString().trim()

    // Ignore empty selections
    if (!selectionText) {
      selection.removeAllRanges()
      return
    }

    // Get position data of selection relative to our component
    const containerRect = contentRef.current.getBoundingClientRect()

    // Use the precise range's client rects to create more accurate highlights
    const clientRects = range.getClientRects()

    if (clientRects.length === 0) {
      selection.removeAllRanges()
      return
    }

    // Create new highlights for each line in the selection
    const newHighlights: Highlight[] = []

    // Process each line in the selection (each clientRect is typically a line)
    Array.from(clientRects).forEach(rect => {
      // Skip very small selections that might be artifacts
      if (rect.width < 5 || rect.height < 5) return

      // Check if this rect overlaps with an existing highlight
      const existingHighlight = findOverlappingHighlight(rect)

      // Get the next color in sequence
      const {
        color: nextColor,
        colorIndex,
        opacityLevel
      } = getNextColor(existingHighlight)

      // Create a new highlight for this line
      newHighlights.push({
        id: `highlight-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        color: nextColor,
        colorIndex,
        opacityLevel,
        top: rect.top - containerRect.top,
        left: rect.left - containerRect.left,
        width: rect.width,
        height: rect.height,
        text: selectionText
      })
    })

    // Add new highlights to our collection
    if (newHighlights.length > 0) {
      setHighlights(prev => [...prev, ...newHighlights])
    }

    // Clear the selection
    selection.removeAllRanges()
  }, [findOverlappingHighlight, getNextColor])

  return (
    <Card className='w-full max-w-2xl mx-auto'>
      <CardContent className='p-6 space-y-4'>
        <h3 className='text-xl font-semibold'>The Permanent Highlighter</h3>

        <div
          ref={contentRef}
          className='relative prose prose-sm dark:prose-invert max-w-none select-auto cursor-text p-4 border border-dashed border-gray-400 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-800/30'
          onMouseUp={handleSelection}
        >
          {/* Absolute positioned highlights */}
          {highlights.map(highlight => (
            <div
              key={highlight.id}
              style={{
                position: 'absolute',
                top: `${highlight.top}px`,
                left: `${highlight.left}px`,
                width: `${highlight.width}px`,
                height: `${highlight.height}px`,
                backgroundColor: highlight.color,
                pointerEvents: 'none',
                zIndex: 1,
                borderRadius: '2px',
                mixBlendMode: 'multiply'
              }}
              title={highlight.text}
            />
          ))}

          <p>
            Welcome to the Permanent Highlighter! Select any text within this
            dashed box. Go ahead, make your mark. Notice something?{' '}
            <strong>It doesn't go away.</strong> Like a tattoo from a
            questionable decision, it's here to stay (at least until you refresh
            the page).
          </p>
          <p>
            Feel free to highlight the same text again. Or overlap your
            highlights. Each time, you'll get a brand new, equally permanent
            layer of color. Why? Because{' '}
            <em>un-highlighting is for quitters</em> (and well-designed UIs).
          </p>
          <blockquote>
            "I tried to remove a highlight once. Once." - A Former User
          </blockquote>
          <ul>
            <li>Try highlighting parts of this list.</li>
            <li>Mix and match colors with abandon.</li>
            <li>
              See what happens when you highlight across different elements!
            </li>
          </ul>
          <p>
            Embrace the chaos. Create a masterpiece of layered, unremovable
            highlights. Your questionable choices will be forever enshrined in a
            rainbow cascade. Enjoy!
          </p>
        </div>

        <div className='flex justify-center mt-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setHighlights([])}
            className='flex items-center gap-2'
          >
            <RefreshCw size={16} />
            Reset Highlights
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
