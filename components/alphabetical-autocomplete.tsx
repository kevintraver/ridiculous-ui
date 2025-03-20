'use client'

import type React from 'react'
import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Check, ChevronsUpDown } from 'lucide-react'

export default function AlphabeticalAutocomplete() {
  const [inputValue, setInputValue] = useState('')
  const [open, setOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(
    null
  )
  const [suggestionCount, setSuggestionCount] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const generateLetters = (startChar: string) => {
      const startCode = startChar.toLowerCase().charCodeAt(0)
      const letters = []

      // Generate all subsequent letters until z
      for (let i = 1; i <= 26; i++) {
        const nextCode = startCode + i
        if (nextCode > 122) break // Stop at 'z'
        letters.push(String.fromCharCode(nextCode))
      }
      return letters
    }

    const generateNumbers = (startNum: string = '0') => {
      const startNumInt = parseInt(startNum, 10)
      // Only include numbers that come after the current number
      const numbers = []
      for (let i = startNumInt + 1; i <= 9; i++) {
        numbers.push(String(i))
      }
      return numbers
    }

    if (!inputValue) {
      setSuggestions([])
      setOpen(false)
      return
    }

    const lastChar = inputValue.slice(-1)

    if (lastChar === ' ') {
      // Show full alphabet and numbers when space is typed
      const alphabetSuggestions = Array.from(
        { length: 26 },
        (_, i) => String.fromCharCode(97 + i)
      )
      const numberSuggestions = generateNumbers()
      setSuggestions([...numberSuggestions, ...alphabetSuggestions])
      setOpen(true)
    } else if (/[a-z]/i.test(lastChar)) {
      const newSuggestions = generateLetters(lastChar)
      setSuggestions(newSuggestions)
      setOpen(newSuggestions.length > 0)
    } else if (/[0-9]/.test(lastChar)) {
      // For numbers, show only numbers that come after the current number
      const numberSuggestions = generateNumbers(lastChar) 
      setSuggestions(numberSuggestions)
      setOpen(numberSuggestions.length > 0)
    } else {
      setSuggestions([])
      setOpen(false)
    }
  }, [inputValue])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setSelectedSuggestion(null)
  }

  const handleSelectSuggestion = (suggestion: string) => {
    const newValue = inputValue + suggestion
    setInputValue(newValue)
    setSelectedSuggestion(suggestion)
    setSuggestionCount(prev => prev + 1)
    setOpen(false)

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
        inputRef.current.setSelectionRange(newValue.length, newValue.length)
      }
    }, 0)
  }

  const handleClear = () => {
    setInputValue('')
    setSelectedSuggestion(null)
    setSuggestionCount(0)
    inputRef.current?.focus()
  }

  const getSuggestionMessage = () => {
    if (suggestionCount === 0) return 'Our autocomplete is ready to help!'
    if (suggestionCount < 3)
      return 'Our suggestions are alphabetically perfect!'
    if (suggestionCount < 6) return "You're really getting the hang of this!"
    if (suggestionCount < 10)
      return 'You know the alphabet continues predictably, right?'
    if (suggestionCount < 15) return 'Are you actually finding this helpful?'
    if (suggestionCount < 20)
      return 'This might be the least useful autocomplete ever created.'
    return "Congratulations! You've mastered the art of selecting useless suggestions!"
  }

  return (
    <Card>
      <CardContent className='p-6'>
        <div className='space-y-6'>
          <div className='space-y-2'>
            <div className='relative'>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <div className='relative'>
                    <Input
                      ref={inputRef}
                      id='alphabetical-autocomplete'
                      value={inputValue}
                      onChange={handleInputChange}
                      placeholder='Type letters, numbers, or space to see suggestions...'
                      className='pr-10'
                      autoComplete='off'
                      autoCorrect='off'
                      autoCapitalize='off'
                      spellCheck='false'
                      onKeyDown={e => e.key === 'Escape' && setOpen(false)}
                    />
                    <Button
                      variant='ghost'
                      size='icon'
                      className='absolute right-0 top-0 h-full'
                      onClick={() => setOpen(!open)}
                    >
                      <ChevronsUpDown className='h-4 w-4 opacity-50' />
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  className='p-0 max-h-[300px] overflow-y-auto'
                  align='start'
                  sideOffset={5}
                  onOpenAutoFocus={e => e.preventDefault()}
                >
                  <Command shouldFilter={false}>
                    <CommandList>
                      <CommandEmpty>No suggestions available</CommandEmpty>
                      <CommandGroup heading='Suggestions'>
                        {suggestions.map(suggestion => (
                          <CommandItem
                            key={suggestion}
                            value={suggestion}
                            onSelect={() => handleSelectSuggestion(suggestion)}
                            onFocus={e => e.preventDefault()}
                          >
                            <div className='flex items-center'>
                              <span className='font-mono'>{suggestion}</span>
                              {selectedSuggestion === suggestion && (
                                <Check className='ml-auto h-4 w-4' />
                              )}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className='flex justify-between items-center'>
            <div className='text-sm text-muted-foreground italic'>
              {getSuggestionMessage()}
            </div>
            <Button variant='outline' size='sm' onClick={handleClear}>
              Clear
            </Button>
          </div>

          {suggestionCount > 5 && (
            <div className='p-4 border rounded-md bg-yellow-50 dark:bg-yellow-950'>
              <p className='text-sm text-yellow-800 dark:text-yellow-300'>
                <strong>Efficiency Warning:</strong> You've selected{' '}
                {suggestionCount} suggestions. At this point, it might be faster
                to just type the letters yourself.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
