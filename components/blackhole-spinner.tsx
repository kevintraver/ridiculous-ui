'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'

export default function BlackHoleSpinner() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [spinnerSpeed, setSpinnerSpeed] = useState(1)
  const [blackHoleActive, setBlackHoleActive] = useState(false)
  const [elementsConsumed, setElementsConsumed] = useState(false)
  const [blackHoleShrinking, setBlackHoleShrinking] = useState(false)
  const [blackHoleGone, setBlackHoleGone] = useState(false)
  const formRef = useRef(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Animation timeline
    setTimeout(() => setSpinnerSpeed(2), 1000)
    setTimeout(() => setSpinnerSpeed(3), 1500)
    setTimeout(() => setSpinnerSpeed(4), 2000)
    setTimeout(() => setBlackHoleActive(true), 2500)
    setTimeout(() => setElementsConsumed(true), 3000)
    setTimeout(() => setBlackHoleShrinking(true), 3500)
    setTimeout(() => setBlackHoleGone(true), 4000)
  }

  const resetForm = () => {
    setIsSubmitting(false)
    setSpinnerSpeed(1)
    setBlackHoleActive(false)
    setElementsConsumed(false)
    setBlackHoleShrinking(false)
    setBlackHoleGone(false)
  }

  return (
    <div className='flex flex-col items-center w-full max-w-md mx-auto'>
      <div className='relative w-full rounded-lg overflow-hidden bg-white p-6 shadow-md'>
        <form ref={formRef} onSubmit={handleSubmit} className='space-y-4'>
          <h2
            className={`text-xl font-bold mb-4 transition-all duration-1000 ${
              blackHoleShrinking ? 'opacity-0 scale-0 translate-y-24' : ''
            } ${blackHoleActive && !blackHoleShrinking ? 'scale-95' : ''} ${
              blackHoleGone ? 'opacity-0' : ''
            }`}
          >
            Contact Form
          </h2>

          <div
            className={`transition-all duration-1000 delay-100 ${
              blackHoleShrinking
                ? 'opacity-0 scale-0 translate-y-16 translate-x-8 rotate-45'
                : ''
            } ${
              blackHoleActive && !blackHoleShrinking
                ? 'scale-95 translate-y-1 translate-x-1'
                : ''
            } ${blackHoleGone ? 'opacity-0' : ''}`}
          >
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Full Name
            </label>
            <input
              type='text'
              id='name'
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
              placeholder='John Doe'
            />
          </div>

          <div
            className={`transition-all duration-1000 delay-200 ${
              blackHoleShrinking
                ? 'opacity-0 scale-0 translate-y-8 -translate-x-8 -rotate-60'
                : ''
            } ${
              blackHoleActive && !blackHoleShrinking
                ? 'scale-95 -translate-x-1'
                : ''
            } ${blackHoleGone ? 'opacity-0' : ''}`}
          >
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Email Address
            </label>
            <input
              type='email'
              id='email'
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
              placeholder='john@example.com'
            />
          </div>

          <div
            className={`transition-all duration-1000 delay-300 ${
              blackHoleShrinking
                ? 'opacity-0 scale-0 -translate-y-8 translate-x-8 rotate-90'
                : ''
            } ${
              blackHoleActive && !blackHoleShrinking
                ? 'scale-95 translate-x-1'
                : ''
            } ${blackHoleGone ? 'opacity-0' : ''}`}
          >
            <label
              htmlFor='message'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Message
            </label>
            <textarea
              id='message'
              rows={3}
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
              placeholder='Type your message here...'
            ></textarea>
          </div>

          <div
            className={`transition-all duration-1000 delay-400 ${
              blackHoleShrinking
                ? 'opacity-0 scale-0 translate-y-12 rotate-120'
                : ''
            } ${blackHoleActive && !blackHoleShrinking ? 'scale-95' : ''} ${
              blackHoleGone ? 'opacity-0' : ''
            }`}
          >
            <button
              type='submit'
              disabled={isSubmitting}
              className='w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>

          {/* Black Hole Spinner */}
          {isSubmitting && !blackHoleGone && (
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10'>
              <div
                className={`
                  rounded-full 
                  transition-all duration-1000 
                  shadow-[0_0_15px_rgba(0,0,0,0.3),0_0_30px_rgba(0,0,0,0.2),0_0_45px_rgba(0,0,0,0.1)]
                  ${
                    blackHoleActive
                      ? blackHoleShrinking
                        ? 'w-4 h-4 bg-black scale-0 opacity-0'
                        : 'w-64 h-64 bg-black'
                      : 'w-16 h-16 bg-gray-800'
                  }
                `}
              >
                {!blackHoleActive && (
                  <div
                    className='w-full h-full border-t-4 border-white rounded-full animate-spin'
                    style={{
                      animationDuration: `${1 / spinnerSpeed}s`,
                      transition: 'animation-duration 0.5s ease'
                    }}
                  />
                )}
              </div>
            </div>
          )}
        </form>
      </div>

      <button
        onClick={resetForm}
        className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
      >
        Restart Animation
      </button>
    </div>
  )
}
