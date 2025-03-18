'use client'

import React, { useState, useEffect } from 'react'

const ReverseSkeletonForm = () => {
  const [opacity, setOpacity] = useState(0)
  const [formOpacity, setFormOpacity] = useState(1)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Simulate form loading
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      // Start the reverse skeleton animation
      const fadeIn = setInterval(() => {
        setOpacity((prev) => {
          if (prev >= 1) {
            clearInterval(fadeIn)
            return 1
          }
          return prev + 0.02
        })

        setFormOpacity((prev) => {
          if (prev <= 0) {
            return 0
          }
          return prev - 0.02
        })
      }, 50)

      return () => clearInterval(fadeIn)
    }
  }, [isLoaded])

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Reverse Form Skeleton Effect</h1>
      <p className="mb-4 text-gray-600">
        Watch as the form slowly dissolves into a skeleton placeholder!
      </p>

      <div className="relative w-full rounded-lg overflow-hidden bg-white p-6 shadow-md">
        {/* The actual form */}
        <div
          className="w-full transition-opacity duration-50"
          style={{ opacity: formOpacity }}
        >
          <form className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Type your message here..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit
            </button>
          </form>
        </div>

        {/* The skeleton that fades in instead of out */}
        <div
          className="absolute inset-0 w-full h-full transition-opacity duration-50 p-6"
          style={{ opacity: opacity }}
        >
          {/* Skeleton Form */}
          <div className="space-y-4">
            {/* Name field skeleton */}
            <div>
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-1"></div>
              <div className="h-10 bg-gray-300 rounded w-full"></div>
            </div>

            {/* Email field skeleton */}
            <div>
              <div className="h-4 bg-gray-300 rounded w-1/3 mb-1"></div>
              <div className="h-10 bg-gray-300 rounded w-full"></div>
            </div>

            {/* Message field skeleton */}
            <div>
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-1"></div>
              <div className="h-24 bg-gray-300 rounded w-full"></div>
            </div>

            {/* Submit button skeleton */}
            <div className="h-10 bg-gray-300 rounded w-full"></div>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          setOpacity(0)
          setFormOpacity(1)
          setIsLoaded(false)
          setTimeout(() => setIsLoaded(true), 500)
        }}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Restart Animation
      </button>
    </div>
  )
}

export default ReverseSkeletonForm
