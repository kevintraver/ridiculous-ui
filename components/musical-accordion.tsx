'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'

type AccordionContent = {
  id: string
  title: string
  content: string
}

export default function MusicalAccordion() {
  const [openItem, setOpenItem] = useState<string | undefined>(undefined)
  const audioContextRef = useRef<AudioContext | null>(null)
  const previousOpenItem = useRef<string | undefined>(undefined)

  // Musical notes (frequencies in Hz)
  const notes = [
    196.0, // G3
    220.0, // A3
    246.94, // B3
    261.63, // C4
    293.66, // D4
    329.63, // E4
    349.23, // F4
    392.0, // G4
    440.0, // A4
    493.88, // B4
    523.25, // C5
    587.33, // D5
    659.25 // E5
  ]

  // Initialize audio context on first user interaction
  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
    }
  }

  // Clean up audio context when component unmounts
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  // Get a random note frequency
  const getRandomNote = () => {
    const randomIndex = Math.floor(Math.random() * notes.length)
    return notes[randomIndex]
  }

  // Play a wheezing accordion note
  const playAccordionNote = (isOpening: boolean) => {
    if (!audioContextRef.current) return

    const ctx = audioContextRef.current
    const frequency = getRandomNote()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    // Use a sawtooth wave for accordion-like sound
    oscillator.type = 'sawtooth'
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)

    // Create slight vibrato for accordion effect
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 6
    lfo.type = 'sine'

    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 3

    lfo.connect(lfoGain)
    lfoGain.connect(oscillator.frequency)

    // Set volume envelope
    gainNode.gain.setValueAtTime(0, ctx.currentTime)

    if (isOpening) {
      // Opening sound: rise in pitch
      oscillator.frequency.linearRampToValueAtTime(
        frequency * 1.05,
        ctx.currentTime + 0.3
      )
      gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1)
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6)
    } else {
      // Closing sound: fall in pitch
      oscillator.frequency.linearRampToValueAtTime(
        frequency * 0.95,
        ctx.currentTime + 0.3
      )
      gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1)
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4)
    }

    // Add a second oscillator for richer sound
    const oscillator2 = ctx.createOscillator()
    oscillator2.type = 'sawtooth'
    oscillator2.frequency.setValueAtTime(frequency * 1.01, ctx.currentTime) // Slightly detuned

    const gainNode2 = ctx.createGain()
    gainNode2.gain.setValueAtTime(0, ctx.currentTime)

    if (isOpening) {
      gainNode2.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1)
      gainNode2.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6)
    } else {
      gainNode2.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1)
      gainNode2.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4)
    }

    oscillator2.connect(gainNode2)
    gainNode2.connect(ctx.destination)

    // Connect main oscillator and start
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.start()
    oscillator2.start()
    lfo.start()

    // Stop after the sound completes
    setTimeout(() => {
      oscillator.stop()
      oscillator2.stop()
      lfo.stop()
    }, 700)
  }

  // Handle accordion value change
  const handleValueChange = (value: string) => {
    initAudioContext()

    // Only play a sound if we're switching to a different section
    // or if we're opening a section when none was open before
    const isSwitchingToNewSection =
      value !== '' && value !== previousOpenItem.current
    const isOpeningFirstSection =
      value !== '' && previousOpenItem.current === undefined

    if (isSwitchingToNewSection || isOpeningFirstSection) {
      // Play an opening sound when switching to a new section
      playAccordionNote(true)
    } else if (
      value === '' &&
      previousOpenItem.current !== undefined &&
      previousOpenItem.current !== openItem
    ) {
      // Play a closing sound only when actually closing a section (not when toggling)
      playAccordionNote(false)
    }

    // Update state
    previousOpenItem.current = value || undefined
    setOpenItem(value || undefined)
  }

  // Sample accordion items
  const accordionItems: AccordionContent[] = [
    {
      id: 'item-1',
      title: 'How to play the accordion',
      content:
        'Start by expanding this section and listen to the beautiful melody. Try clicking on a different section to hear another note. This accordion only plays when you move between sections, just like a real musician who needs inspiration!'
    },
    {
      id: 'item-2',
      title: 'Why accordions wheeze',
      content:
        "Accordions wheeze because they're allergic to bad music. When you hear the wheeze, it means you're playing it right. Or terribly wrong. Hard to tell sometimes."
    },
    {
      id: 'item-3',
      title: 'Famous accordion players',
      content:
        'The most famous accordion player is this UI component. Second place goes to that guy at parties who always brings an accordion but nobody asked him to.'
    },
    {
      id: 'item-4',
      title: 'Accordion maintenance tips',
      content:
        'Keep your accordion well-fed with a diet of polkas and waltzes. Occasionally let it watch accordion documentaries to boost its morale.'
    },
    {
      id: 'item-5',
      title: 'How to annoy your neighbors',
      content:
        "Step 1: Click through this accordion repeatedly. Step 2: There is no step 2. You've already succeeded."
    },
    {
      id: 'item-6',
      title: 'Accordion etiquette',
      content:
        'Never ask an accordion to play "Piano Man." They find it offensive. Also, always compliment an accordion on its bellows – they\'re very sensitive about them.'
    }
  ]

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardContent className='p-6'>
        <h2 className='text-xl font-bold mb-4'>Musical Accordion</h2>
        <p className='text-sm text-gray-500 mb-6'>
          This accordion plays a random wheezing note when you switch between
          sections. It rests while you ponder its content - click a different
          section to hear the next note!
        </p>

        <Accordion
          type='single'
          collapsible
          className='w-full'
          value={openItem}
          onValueChange={handleValueChange}
        >
          {accordionItems.map(item => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger>{item.title}</AccordionTrigger>
              <AccordionContent>{item.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <p className='text-xs text-gray-400 mt-6'>
          Warning: This accordion is trained to play only when you navigate
          between sections. It's taking music lessons, but only practices when
          you give it new material to work with.
        </p>
      </CardContent>
    </Card>
  )
}
