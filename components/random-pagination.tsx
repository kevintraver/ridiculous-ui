'use client'

import React, { useState, useEffect } from 'react'
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem
} from '@/components/ui/pagination'

export function RandomDicePagination() {
  const [currentPage, setCurrentPage] = useState(2)
  const [totalPages] = useState(100)
  const [isRolling, setIsRolling] = useState(false)
  const [prevDice, setPrevDice] = useState(1)
  const [nextDice, setNextDice] = useState(6)
  // Instead of bouncing, we’ll toggle a small scale
  const [diceAnimation, setDiceAnimation] = useState(false)

  const getRandomPage = () => Math.floor(Math.random() * totalPages) + 1
  const getRandomDice = () => Math.floor(Math.random() * 6) + 1

  const DiceComponents: Record<number, React.ElementType> = {
    1: Dice1,
    2: Dice2,
    3: Dice3,
    4: Dice4,
    5: Dice5,
    6: Dice6
  }

  const getPageLinks = () => {
    const pages = []
    const startPage = Math.max(1, currentPage - 1)
    const endPage = Math.min(totalPages, currentPage + 1)
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    return pages
  }

  const handlePrevious = () => {
    setIsRolling(true)
    setDiceAnimation(true)

    const diceInterval = setInterval(() => {
      setPrevDice(getRandomDice())
    }, 100)

    setTimeout(() => {
      clearInterval(diceInterval)
      setDiceAnimation(false)
      setCurrentPage(getRandomPage())
      setIsRolling(false)
    }, 500)
  }

  const handleNext = () => {
    setIsRolling(true)
    setDiceAnimation(true)

    const diceInterval = setInterval(() => {
      setNextDice(getRandomDice())
    }, 100)

    setTimeout(() => {
      clearInterval(diceInterval)
      setDiceAnimation(false)
      setCurrentPage(getRandomPage())
      setIsRolling(false)
    }, 500)
  }

  const handlePageClick = (page: number) => {
    if (!isRolling) {
      setCurrentPage(page)
    }
  }

  const PrevDiceIcon = DiceComponents[prevDice]
  const NextDiceIcon = DiceComponents[nextDice]

  return (
    <div className="flex flex-col items-center">
      {/* 'Page X Content' block */}
      <div className="mt-6 mb-6 p-4 bg-gray-100 rounded-md max-w-lg">
        <h3 className="font-bold mb-2">Page {currentPage} Content</h3>
        <p className="text-gray-700">
          This is completely random content for page {currentPage}. You never
          know where the dice will take you next!
        </p>
      </div>

      <Pagination className="py-4">
        <PaginationContent className="gap-4">
          <PaginationItem>
            <button
              onClick={handlePrevious}
              disabled={isRolling}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-12 px-4 py-3"
            >
              {/* Removed 'animate-bounce' and replaced with a scale toggle */}
              <PrevDiceIcon
                className={`mr-2 h-4 w-4 transform transition-transform duration-300 ${
                  diceAnimation ? 'scale-125' : ''
                }`}
              />
              <span>Roll Back</span>
            </button>
          </PaginationItem>

          {/* FIRST PAGE */}
          {currentPage > 2 && (
            <PaginationItem>
              <button
                type="button"
                onClick={() => handlePageClick(1)}
                className={`py-3 h-12 w-12 flex items-center justify-center rounded ${
                  currentPage === 1
                    ? 'border border-current bg-transparent text-current'
                    : 'hover:bg-accent'
                }`}
              >
                1
              </button>
            </PaginationItem>
          )}

          {currentPage > 3 && (
            <PaginationItem>
              <PaginationEllipsis className="h-12 flex items-center" />
            </PaginationItem>
          )}

          {/* MAPPED PAGES */}
          {getPageLinks().map((page) => (
            <PaginationItem key={page}>
              <button
                type="button"
                onClick={() => handlePageClick(page)}
                className={`py-3 h-12 w-12 flex items-center justify-center rounded ${
                  page === currentPage
                    ? 'border border-current bg-transparent text-current'
                    : 'hover:bg-accent'
                }`}
              >
                {page}
              </button>
            </PaginationItem>
          ))}

          {currentPage < totalPages - 2 && (
            <PaginationItem>
              <PaginationEllipsis className="h-12 flex items-center" />
            </PaginationItem>
          )}

          {/* LAST PAGE */}
          {currentPage < totalPages - 1 && (
            <PaginationItem>
              <button
                type="button"
                onClick={() => handlePageClick(totalPages)}
                className={`py-3 h-12 w-12 flex items-center justify-center rounded ${
                  currentPage === totalPages
                    ? 'border border-current bg-transparent text-current'
                    : 'hover:bg-accent'
                }`}
              >
                {totalPages}
              </button>
            </PaginationItem>
          )}

          <PaginationItem>
            <button
              onClick={handleNext}
              disabled={isRolling}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-12 px-4 py-3"
            >
              <span>Roll Forward</span>
              <NextDiceIcon
                className={`ml-2 h-4 w-4 transform transition-transform duration-300 ${
                  diceAnimation ? 'scale-125' : ''
                }`}
              />
            </button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Rolling message stays the same */}
      {isRolling && (
        <div className="my-2 text-center text-sm italic text-purple-600 animate-pulse">
          Rolling the dice... hope you're feeling lucky!
        </div>
      )}

      {/* 'Currently on page...' text */}
      <p className="text-gray-600 mt-4">
        Currently on page {currentPage} of {totalPages}. Try clicking the dice!
      </p>
    </div>
  )
}

export default RandomDicePagination
