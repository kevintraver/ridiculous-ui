'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  MousePointer,
  KeySquare,
  ScrollText,
  X,
  TextCursor,
  FileCheck,
  MousePointerSquareDashed,
  MousePointerClick,
  Keyboard
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const consentMessages = [
  {
    action: 'clicking',
    message:
      'You consent to our Click Collection™ service storing data about your click preferences',
    icon: <MousePointerClick className='h-4 w-4' />
  },
  {
    action: 'button-click',
    message:
      'Clicking this button constitutes acceptance of our 57-page Button Interaction Agreement™',
    icon: <MousePointerSquareDashed className='h-4 w-4' />
  },
  {
    action: 'scrolling',
    message:
      'By scrolling, you agree to our Scroll Surveillance™ monitoring your reading habits',
    icon: <ScrollText className='h-4 w-4' />
  },
  {
    action: 'typing',
    message: 'Typing indicates acceptance of our Keystroke Analytics™ program',
    icon: <KeySquare className='h-4 w-4' />
  },
  {
    action: 'text-entry',
    message:
      'Entering text confirms your consent to our Text Mining Operations™',
    icon: <Keyboard className='h-4 w-4' />
  },
  {
    action: 'text-selection',
    message:
      'By selecting text, you authorize us to analyze your reading preferences',
    icon: <TextCursor className='h-4 w-4' />
  },
  {
    action: 'submit',
    message:
      'By submitting this form, you agree to our Data Harvesting Protocol™ and consent to receiving unlimited marketing emails',
    icon: <MousePointerSquareDashed className='h-4 w-4' />
  }
]

type ConsentPopup = {
  id: string
  message: string
  position: { x: number; y: number }
  icon: React.ReactNode
}

export default function ObnoxiousTermsOfService() {
  const [consentPopups, setConsentPopups] = useState<ConsentPopup[]>([])
  const [consentCount, setConsentCount] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [showExplanation, setShowExplanation] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const isInputFocused = useRef(false)
  const hasUserScrolled = useRef(false)
  const lastScrollPosition = useRef(0)

  // Debounce timers for different actions
  const lastActionTime = useRef<Record<string, number>>({
    click: 0,
    buttonClick: 0,
    scroll: 0,
    type: 0,
    textEntry: 0,
    textSelection: 0,
    submit: 0
  })

  // Debounce durations for different actions (milliseconds)
  const debounceDurations = {
    click: 2500, // 2.5 seconds between clicks (increased)
    buttonClick: 2000, // 2 seconds between button clicks (increased)
    scroll: 500, // 0.5 seconds between scroll popups (reduced for better responsiveness)
    type: 1500, // 1.5 seconds between typing popups
    textEntry: 3000, // 3 seconds after starting text entry
    textSelection: 2000, // 2 seconds between text selection popups
    submit: 1500 // 1.5 seconds between submit actions
  }

  // Get a random message for a specific action
  const getRandomMessageForAction = (action: string) => {
    const filteredMessages = consentMessages.filter(
      msg => msg.action === action
    )
    return filteredMessages[Math.floor(Math.random() * filteredMessages.length)]
  }

  // Check if an action is debounced (should not trigger)
  const isDebounced = (action: string): boolean => {
    const now = Date.now()
    return (
      now - (lastActionTime.current[action] || 0) <
      debounceDurations[action as keyof typeof debounceDurations]
    )
  }

  // Update last action time
  const updateActionTime = (action: string) => {
    lastActionTime.current[action] = Date.now()
  }

  // No longer needed - this is integrated into the useEffect hook for scrolling

  // Track mouse clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.target instanceof HTMLElement) {
        // Don't trigger for clicks on close buttons or consent popups
        if (
          e.target.classList.contains('consent-close') ||
          e.target.closest('.consent-popup')
        ) {
          return
        }

        // Check if text is selected - if so, don't show click popup
        const selection = window.getSelection()
        if (selection && selection.toString().trim().length > 0) {
          // Let the text selection handler take priority
          return
        }

        // Check if clicking on an input field
        if (e.target.tagName === 'INPUT' || e.target.closest('input')) {
          isInputFocused.current = true
          // Don't show click popup, will show text entry popup instead
          return
        } else {
          isInputFocused.current = false
        }

        // Ignore submit button clicks - we'll handle that separately
        if (
          e.target.getAttribute('type') === 'submit' ||
          (e.target.closest('button') &&
            e.target.closest('button')!.getAttribute('type') === 'submit')
        ) {
          return
        }

        // Special message for button clicks
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
          if (!isDebounced('buttonClick')) {
            const message = getRandomMessageForAction('button-click')
            // Add offset from cursor position for button clicks
            addConsentPopup(
              e.clientX + 40,
              e.clientY - 20,
              message.message,
              message.icon
            )
            setConsentCount(prev => prev + 1)
            updateActionTime('buttonClick')
          }
        } else {
          // Regular clicks elsewhere
          if (!isDebounced('click')) {
            const message = getRandomMessageForAction('clicking')
            // Add offset from cursor position for regular clicks
            addConsentPopup(
              e.clientX + 50,
              e.clientY - 30,
              message.message,
              message.icon
            )
            setConsentCount(prev => prev + 1)
            updateActionTime('click')
          }
        }
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isDebounced('submit')) {
      // Get submit button position
      const submitButton = document.querySelector('button[type="submit"]')
      let x = window.innerWidth / 2 - 125
      let y = window.innerHeight / 2 - 75

      // If we found the button, position near it
      if (submitButton) {
        const rect = submitButton.getBoundingClientRect()
        x = rect.left
        y = rect.top + rect.height + 10
      }

      const message = getRandomMessageForAction('submit')
      addConsentPopup(x, y, message.message, message.icon)
      setConsentCount(prev => prev + 1)
      updateActionTime('submit')
    }
  }

  useEffect(() => {
    if (!sentinelRef.current) return
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          // Do not trigger if the container is at the top
          if (
            scrollContainerRef.current &&
            scrollContainerRef.current.scrollTop === 0
          ) {
            return
          }
          // When the sentinel is not fully visible, assume the user has scrolled
          if (entry.intersectionRatio < 1 && !isDebounced('scroll')) {
            const rect = scrollContainerRef.current?.getBoundingClientRect()
            if (rect) {
              const x = rect.left + Math.random() * (rect.width - 300) + 50
              const y = rect.top + Math.random() * (rect.height - 180) + 40
              const message = getRandomMessageForAction('scrolling')
              addConsentPopup(x, y, message.message, message.icon)
              setConsentCount(prev => prev + 1)
              updateActionTime('scroll')
            }
          }
        })
      },
      { threshold: 1.0 }
    )
    observer.observe(sentinelRef.current)
    return () => {
      if (sentinelRef.current) observer.unobserve(sentinelRef.current)
    }
  }, [])

  // Track text selection
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection()
      if (selection && selection.toString().trim().length > 0) {
        if (!isDebounced('textSelection')) {
          const message = getRandomMessageForAction('text-selection')

          // Position with more offset from the selection
          const range = selection.getRangeAt(0)
          const rect = range.getBoundingClientRect()
          const x = rect.left + 40 // Add horizontal offset
          const y = rect.bottom + 25 // More vertical offset

          addConsentPopup(x, y, message.message, message.icon)
          setConsentCount(prev => prev + 1)
          updateActionTime('textSelection')
        }
      }
    }

    document.addEventListener('mouseup', handleSelection)
    return () => document.removeEventListener('mouseup', handleSelection)
  }, [])

  const addConsentPopup = (
    x: number,
    y: number,
    message: string,
    icon: React.ReactNode
  ) => {
    const id = Date.now().toString()

    // Adjust position to ensure popup is fully visible
    const adjustedX = Math.min(Math.max(x, 10), window.innerWidth - 270)
    const adjustedY = Math.min(Math.max(y, 10), window.innerHeight - 150)

    const newPopup = {
      id,
      message,
      position: { x: adjustedX, y: adjustedY },
      icon
    }

    setConsentPopups(prev => [...prev, newPopup])

    // Auto-remove popup after 4 seconds
    setTimeout(() => {
      setConsentPopups(prev => prev.filter(popup => popup.id !== id))
    }, 4000)
  }

  const handleRemovePopup = (id: string) => {
    setConsentPopups(prev => prev.filter(popup => popup.id !== id))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)

    // Text entry consent popup when first starting to type
    if (newValue.length === 1 && inputValue.length === 0) {
      if (!isDebounced('textEntry')) {
        const message = getRandomMessageForAction('text-entry')
        const rect = e.target.getBoundingClientRect()
        addConsentPopup(
          rect.left + 60, // Add horizontal offset
          rect.bottom + 30, // More vertical offset
          message.message,
          message.icon
        )
        setConsentCount(prev => prev + 1)
        updateActionTime('textEntry')
      }
    }
    // Add typing consent popup periodically
    else if (newValue.length % 10 === 0 && newValue.length > 0) {
      if (!isDebounced('type')) {
        const message = getRandomMessageForAction('typing')
        const rect = e.target.getBoundingClientRect()
        addConsentPopup(
          rect.left + 70, // Different horizontal offset for variety
          rect.bottom + 35, // More vertical offset
          message.message,
          message.icon
        )
        setConsentCount(prev => prev + 1)
        updateActionTime('type')
      }
    }
  }

  return (
    <Card className='w-full max-w-4xl relative overflow-visible'>
      <CardContent className='p-6'>
        <h2 className='text-2xl font-bold mb-4'>Totally Normal Website</h2>

        {showExplanation && (
          <div className='bg-blue-50 p-4 rounded-md mb-6 border border-blue-200'>
            <p className='text-sm text-blue-800'>
              Welcome to our site! Try interacting with this page by clicking,
              scrolling, or typing in the field below.
              <button
                className='ml-2 text-xs text-blue-600 hover:text-blue-800'
                onClick={() => setShowExplanation(false)}
              >
                ✕
              </button>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='flex flex-col gap-2'>
            <label htmlFor='name' className='text-sm font-medium'>
              Enter your name:
            </label>
            <input
              type='text'
              id='name'
              className='border rounded-md px-3 py-2'
              value={inputValue}
              onChange={handleInputChange}
              placeholder='Type something...'
            />
          </div>

          <Button type='submit'>Submit Form</Button>
        </form>

        <div className='space-y-4 mt-4 mb-4'>
          <div>
            <h2 className='text-3xl font-normal mb-1'>Terms of service</h2>
            <div className='text-sm mb-4'>
              <span className='text-gray-500'>
                From Wikipedia, the free encyclopedia
              </span>
            </div>

            <p className='mb-3 text-sm'>
              Terms of service, also known as{' '}
              <a href='#' className='text-blue-600'>
                terms of use
              </a>{' '}
              and{' '}
              <a href='#' className='text-blue-600'>
                terms and conditions
              </a>
              ,
              <sup>
                [
                <a href='#' className='text-blue-600'>
                  note 1
                </a>
                ]
              </sup>{' '}
              are the{' '}
              <a href='#' className='text-blue-600'>
                legal agreements
              </a>{' '}
              between{' '}
              <a href='#' className='text-blue-600'>
                service providers
              </a>{' '}
              and the{' '}
              <a href='#' className='text-blue-600'>
                service consumers
              </a>
              . The person must agree to abide by the terms of service in order
              to use the offered service. Terms of service can also be merely a{' '}
              <a href='#' className='text-blue-600'>
                disclaimer
              </a>
              , especially regarding the use of websites. Vague language and
              lengthy sentences used in these terms of service have caused
              concerns about customer privacy and raised public awareness in
              many ways.
            </p>

            <div className='flex items-center mb-1'>
              <h2 id='usage' className='text-xl font-normal'>
                Usage
              </h2>
            </div>
            <hr className='border-t border-gray-300 mb-2' />

            <p className='mb-3 text-sm'>
              A terms of service agreement is mainly used for legal purposes by
              companies which provide software or services, such as{' '}
              <a href='#' className='text-blue-600'>
                web browsers
              </a>
              , e-commerce, web search engines,{' '}
              <a href='#' className='text-blue-600'>
                social media
              </a>
              , and{' '}
              <a href='#' className='text-blue-600'>
                transport
              </a>{' '}
              services.
            </p>
            <p className='mb-3 text-sm'>
              A legitimate terms of service agreement is{' '}
              <a href='#' className='text-blue-600'>
                legally binding
              </a>{' '}
              and may be subject to change.
              <sup>
                [
                <a href='#' className='text-blue-600'>
                  citation needed
                </a>
                ]
              </sup>{' '}
              Companies can enforce the terms by refusing service. Customers can
              enforce by filing a lawsuit or{' '}
              <a href='#' className='text-blue-600'>
                arbitration
              </a>{' '}
              case if they can show they were actually harmed by a breach of the
              terms. There is a heightened risk of data going astray during
              corporate changes, including mergers, divestitures, buyouts,
              downsizing, etc., when data can be transferred improperly.
              <sup>
                [
                <a href='#' className='text-blue-600'>
                  citation needed
                </a>
                ]
              </sup>
            </p>

            <div className='flex items-center mb-1'>
              <h2 id='content' className='text-xl font-normal'>
                Content
              </h2>
            </div>
            <hr className='border-t border-gray-300 mb-2' />

            <p className='mb-3 text-sm'>
              A terms of service agreement typically contains sections
              pertaining to one or more of the following topics:
            </p>
            <ul className='list-disc pl-8 mb-4 text-sm space-y-1'>
              <li>Disambiguation/definition of keywords and phrases</li>
              <li>User rights and responsibilities</li>
              <li>Proper or expected usage; definition of misuse</li>
              <li>Accountability for online actions, behavior, and conduct</li>
              <li>
                <a href='#' className='text-blue-600'>
                  Privacy policy
                </a>{' '}
                outlining the use of personal data
              </li>
              <li>
                Payment details such as membership or subscription fees, etc.
              </li>
              <li>
                Opt-out policy describing procedure for account termination, if
                available
              </li>
              <li>
                Sometimes contains an Arbitration clause detailing the dispute
                resolution process and limited rights to take a claim to court
              </li>
              <li>
                Disclaimer/Limitation of liability, clarifying the site's legal
                liability for damages incurred by users
              </li>
              <li>User notification upon modification of terms, if offered</li>
            </ul>

            <div
              ref={scrollContainerRef}
              className='h-96 overflow-y-auto border p-4 rounded-md relative'
            >
              <div ref={sentinelRef} style={{ height: 1, width: '100%' }} />
              <div className='flex items-center mb-1'>
                <h2 id='readability' className='text-xl font-normal'>
                  Readability
                </h2>
              </div>
              <hr className='border-t border-gray-300 mb-2' />

              <p className='mb-3 text-sm'>
                Among 102 companies' policies presented to consumers in 2014 for
                health purposes, 17 had publicly available terms and conditions:
                <sup>
                  [
                  <a href='#' className='text-blue-600'>
                    26
                  </a>
                  ]
                </sup>
              </p>
              <ul className='list-disc pl-8 mb-4 text-sm space-y-1'>
                <li>
                  57 of the 17 had disclaimer clauses (including 10 disclaiming
                  liability for injury caused by their own negligence)
                </li>
                <li>
                  36 let the company change terms (including 17 without notice)
                </li>
                <li>51 let the company terminate accounts</li>
                <li>
                  31 require consumers to{' '}
                  <a href='#' className='text-blue-600'>
                    indemnify
                  </a>{' '}
                  the company
                </li>
                <li>
                  9 required consumers to{' '}
                  <a href='#' className='text-blue-600'>
                    sell data
                  </a>
                </li>
              </ul>

              <p className='mb-3 text-sm'>
                Among 260 mass market consumer{' '}
                <a href='#' className='text-blue-600'>
                  software license
                </a>{' '}
                agreements in 2010:
                <sup>
                  [
                  <a href='#' className='text-blue-600'>
                    27
                  </a>
                  ]
                </sup>
              </p>
              <ul className='list-disc pl-8 mb-4 text-sm space-y-1'>
                <li>
                  91% disclaimed warranties of merchantability or fitness for
                  purpose or said it was "As is"
                </li>
                <li>
                  92% disclaimed consequential, incidental, special or
                  foreseeable damages
                </li>
                <li>
                  69% did not warrant the software was free of defects or would
                  work as described in the manual
                </li>
                <li>55% capped damages at the purchase price or less</li>
                <li>
                  36% said they were not warranting whether it infringed others'
                  intellectual property rights
                </li>
                <li>32% required arbitration or a specific court</li>
                <li>
                  17% required the customer to pay legal bills of the maker
                  (indemnification), but not vice versa
                </li>
              </ul>

              <p className='mb-3 text-sm'>
                Among the terms and conditions of 31{' '}
                <a href='#' className='text-blue-600'>
                  cloud-computing services
                </a>{' '}
                in January-July 2010, operating in England:
                <sup>
                  [
                  <a href='#' className='text-blue-600'>
                    28
                  </a>
                  ]
                </sup>
              </p>
              <ul className='list-disc pl-8 mb-4 text-sm space-y-1'>
                <li>
                  27 specified the law to be used (US state or other country)
                </li>
                <li>
                  most specify that consumers can claim against the company only
                  in specific courts
                </li>
                <li>
                  7 impose arbitration, all forbid illegal and objectionable
                  conduct by the consumer
                </li>
                <li>
                  13 can amend terms just by posting changes on their own
                  website
                </li>
                <li>
                  a majority disclaim responsibility for confidentiality or
                  backups
                </li>
                <li>
                  a few promise to delete data thoroughly when the customer
                  leaves
                </li>
                <li>
                  some monitor the customers' data to enforce their policies on
                  use
                </li>
                <li>all disclaim warranties and most disclaim liability</li>
                <li>
                  24 require the customer to{' '}
                  <a href='#' className='text-blue-600'>
                    indemnify
                  </a>{' '}
                  them, a few indemnify the customer
                </li>
                <li>
                  a few give credits for poor service, 15 promise "best efforts"
                  and can suspend or stop at any time
                </li>
              </ul>

              <p className='mb-3 text-sm'>
                The researchers note that rules on location and time limits may
                be unenforceable for consumers in many jurisdictions with{' '}
                <a href='#' className='text-blue-600'>
                  consumer protections
                </a>
                , that acceptable use policies are rarely enforced, that quick
                deletion is dangerous if a court later rules the termination
                wrongful, that local laws often require warranties (and UK
                forced Apple to say so).
              </p>
            </div>
          </div>
        </div>

        <div className='text-sm text-gray-500 mt-4'>
          Consent popups triggered: {consentCount}
        </div>
      </CardContent>

      {/* Consent Popups - fixed in a portal so they don't affect layout */}
      {createPortal(
        <AnimatePresence>
          {consentPopups.map(popup => (
            <motion.div
              key={popup.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{
                position: 'fixed',
                left: popup.position.x,
                top: popup.position.y,
                zIndex: 9999
              }}
              className='bg-white border border-gray-200 rounded-md shadow-lg w-64 p-3 consent-popup'
            >
              <div className='flex items-start justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='bg-blue-100 p-1.5 rounded-full text-blue-600'>
                    {popup.icon}
                  </div>
                  <span className='text-xs font-medium'>
                    By continuing your action you agree to our ToS
                  </span>
                </div>
                <button
                  onClick={() => handleRemovePopup(popup.id)}
                  className='text-gray-500 hover:text-gray-700 consent-close'
                >
                  <X className='h-4 w-4' />
                </button>
              </div>
              <p className='text-xs mt-2 text-gray-600'>{popup.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>,
        document.body
      )}
    </Card>
  )
}
