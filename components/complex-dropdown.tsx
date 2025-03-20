'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuCheckboxItem
} from '@/components/ui/dropdown-menu'
import { Check, ChevronRight } from 'lucide-react'

const options = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry']

export default function ComplexDropdown() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [step, setStep] = useState(1)
  const [confirmationChecked, setConfirmationChecked] = useState(false)
  const [radioValue, setRadioValue] = useState('no')
  const dropdownRef = useRef<HTMLButtonElement>(null)

  const resetDropdown = () => {
    setStep(1)
    setConfirmationChecked(false)
    setRadioValue('no')
  }

  const handleSelect = (option: string) => {
    if (step === 3 && confirmationChecked && radioValue === 'yes') {
      setSelectedOption(option)
      resetDropdown()
    }
  }

  const handleStepChange = (newStep: number) => {
    setStep(newStep)
  }

  return (
    <div className='space-y-4'>
      <DropdownMenu onOpenChange={open => !open && resetDropdown()}>
        <DropdownMenuTrigger asChild>
          <Button
            ref={dropdownRef}
            variant='outline'
            className='w-[200px] justify-between'
          >
            {selectedOption || 'Select an option...'}
            <ChevronRight className='ml-2 h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-[200px]'>
          {step === 1 && (
            <>
              <DropdownMenuItem onSelect={e => e.preventDefault()}>
                Step 1: Click to continue
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleStepChange(2)}>
                Continue to step 2 <ChevronRight className='ml-auto h-4 w-4' />
              </DropdownMenuItem>
            </>
          )}

          {step === 2 && (
            <>
              <DropdownMenuItem onSelect={e => e.preventDefault()}>
                Step 2: Confirm selection
              </DropdownMenuItem>
              <DropdownMenuCheckboxItem
                checked={confirmationChecked}
                onCheckedChange={setConfirmationChecked}
              >
                I want to select an option
              </DropdownMenuCheckboxItem>
              <DropdownMenuRadioGroup
                value={radioValue}
                onValueChange={setRadioValue}
              >
                <DropdownMenuRadioItem value='yes'>
                  Yes, I'm sure
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value='no'>
                  No, I'm not sure
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuItem
                disabled={!confirmationChecked || radioValue !== 'yes'}
                onSelect={() => handleStepChange(3)}
              >
                Continue to step 3 <ChevronRight className='ml-auto h-4 w-4' />
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleStepChange(1)}>
                Go back to step 1
              </DropdownMenuItem>
            </>
          )}

          {step === 3 && (
            <>
              <DropdownMenuItem onSelect={e => e.preventDefault()}>
                Step 3: Select an option
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  Choose from submenu
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {options.map(option => (
                    <DropdownMenuItem
                      key={option}
                      onSelect={() => handleSelect(option)}
                    >
                      {option}
                      {selectedOption === option && (
                        <Check className='ml-auto h-4 w-4' />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem onSelect={() => handleStepChange(2)}>
                Go back to step 2
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedOption && (
        <div className='text-sm'>
          You selected: <span className='font-medium'>{selectedOption}</span>
        </div>
      )}

      <div className='text-xs text-muted-foreground'>
        This dropdown requires a 3-step process with confirmation and a submenu
        to select a simple option.
      </div>
    </div>
  )
}
