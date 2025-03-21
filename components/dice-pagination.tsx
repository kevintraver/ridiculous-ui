'use client'

import React, { useState, useEffect } from 'react'
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem
} from '@/components/ui/pagination'
import { faker } from '@faker-js/faker'

export function DicePagination() {
  const [currentPage, setCurrentPage] = useState(42)
  const [totalPages] = useState(100)
  const [isRolling, setIsRolling] = useState(false)
  const [prevDice, setPrevDice] = useState(3)
  const [nextDice, setNextDice] = useState(5)
  const [leftDiceAnimation, setLeftDiceAnimation] = useState(false)
  const [rightDiceAnimation, setRightDiceAnimation] = useState(false)
  const [pageContent, setPageContent] = useState(() =>
    faker.lorem.paragraphs(2)
  )

  useEffect(() => {
    setPageContent(faker.lorem.paragraphs(2))
  }, [currentPage])

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
    if (currentPage <= 1) return // Don't go below page 1

    setIsRolling(true)
    setLeftDiceAnimation(true)

    const diceInterval = setInterval(() => {
      setPrevDice(getRandomDice())
    }, 100)

    setTimeout(() => {
      clearInterval(diceInterval)
      setLeftDiceAnimation(false)
      // Get a random previous page between 1 and current page - 1
      const randomPrevPage = Math.floor(Math.random() * (currentPage - 1)) + 1
      setCurrentPage(randomPrevPage)
      setIsRolling(false)
    }, 500)
  }

  const handleNext = () => {
    if (currentPage >= totalPages) return // Don't go beyond total pages

    setIsRolling(true)
    setRightDiceAnimation(true)

    const diceInterval = setInterval(() => {
      setNextDice(getRandomDice())
    }, 100)

    setTimeout(() => {
      clearInterval(diceInterval)
      setRightDiceAnimation(false)
      // Get a random next page between current page + 1 and total pages
      const randomNextPage =
        Math.floor(Math.random() * (totalPages - currentPage)) + currentPage + 1
      setCurrentPage(randomNextPage)
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
    <div className='flex flex-col items-center'>
      <div className='mt-6 mb-6 max-w-lg'>
        <div className='bg-gray-100 rounded-md w-full h-64 flex flex-col p-4'>
          {/* Minimal margin on heading */}
          <h3 className='font-bold mb-2 flex-none'>
            Page {currentPage} Content
          </h3>

          {/* The scrollable area: */}
          <div className='flex-1 overflow-y-auto'>
            <p className='text-gray-700'>{pageContent}</p>
          </div>
        </div>
      </div>

      <Pagination className='py-4'>
        <PaginationContent className='gap-4'>
          <PaginationItem>
            <button
              onClick={handlePrevious}
              disabled={isRolling || currentPage <= 1}
              className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-12 w-12 p-0'
            >
              <PrevDiceIcon
                className={`h-8 w-8 transform transition-transform duration-300 ${
                  leftDiceAnimation ? 'scale-125' : ''
                }`}
              />
            </button>
          </PaginationItem>

          {currentPage > 2 && (
            <PaginationItem>
              <button
                type='button'
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
              <PaginationEllipsis className='h-12 flex items-center' />
            </PaginationItem>
          )}

          {getPageLinks().map(page => (
            <PaginationItem key={page}>
              <button
                type='button'
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
              <PaginationEllipsis className='h-12 flex items-center' />
            </PaginationItem>
          )}

          {currentPage < totalPages - 1 && (
            <PaginationItem>
              <button
                type='button'
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
              disabled={isRolling || currentPage >= totalPages}
              className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-12 w-12 p-0'
            >
              <NextDiceIcon
                className={`h-8 w-8 transform transition-transform duration-300 ${
                  rightDiceAnimation ? 'scale-125' : ''
                }`}
              />
            </button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <div className='my-2 h-4 text-center text-sm italic text-purple-600 animate-pulse'>
        {isRolling && "Rolling the dice... hope you're feeling lucky!"}
      </div>
    </div>
  )
}

export default DicePagination
