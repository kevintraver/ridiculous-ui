'use client'

import React from 'react'

export default function StretchingDivider() {
  return (
    <div className="w-full flex justify-center my-8">
      {/* The divider element with a breathing animation */}
      <div className="h-1 bg-gray-500 transform origin-center animate-breathe w-full max-w-md"></div>
      <style jsx>{`
        @keyframes breathe {
          0%,
          100% {
            transform: scaleX(0.8);
          }
          50% {
            transform: scaleX(1);
          }
        }
        .animate-breathe {
          animation: breathe 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
