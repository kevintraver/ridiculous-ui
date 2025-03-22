'use client'

import * as React from 'react'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Plus, Check, MessageCircle, RefreshCw } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type TodoItem = {
  id: string
  text: string
  isComplete: boolean
  isDragging: boolean
  isAttached: boolean
  position: { x: number; y: number }
  message?: string
}

// Attachment messages that appear when an item is being dragged
const attachmentMessages = [
  "Don't delete me, please!",
  "I'm not done yet!",
  "We've been through so much!",
  "But I'm still useful!",
  "I'll be better, I promise!",
  "Don't let me go!",
  "I'm scared of the trash!",
  'I thought we were friends!',
  'Just one more chance?',
  "I'm clinging to you now!"
]

export default function OverlyAttachedDragItem() {
  // Default todos
  const defaultTodos: TodoItem[] = [
    {
      id: '1',
      text: 'Buy groceries',
      isComplete: false,
      isDragging: false,
      isAttached: false,
      position: { x: 0, y: 0 }
    },
    {
      id: '2',
      text: 'Finish presentation',
      isComplete: false,
      isDragging: false,
      isAttached: false,
      position: { x: 0, y: 0 }
    },
    {
      id: '3',
      text: 'Call dentist',
      isComplete: true,
      isDragging: false,
      isAttached: false,
      position: { x: 0, y: 0 }
    },
    {
      id: '4',
      text: 'Check emails',
      isComplete: false,
      isDragging: false,
      isAttached: false,
      position: { x: 0, y: 0 }
    },
    {
      id: '5',
      text: 'Walk the dog',
      isComplete: false,
      isDragging: false,
      isAttached: false,
      position: { x: 0, y: 0 }
    }
  ]

  // State
  const [todos, setTodos] = useState<TodoItem[]>(defaultTodos)
  const [newTodoText, setNewTodoText] = useState('')
  const [isTrashHighlighted, setIsTrashHighlighted] = useState(false)

  // Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const trashZoneRef = useRef<HTMLDivElement>(null)

  // Handle pointer (mouse and touch) events to update attached todos
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      // Skip if no todos are attached
      if (!todos.some(todo => todo.isAttached)) return

      // Calculate new positions for attached todos
      setTodos(prevTodos => {
        return prevTodos.map(todo => {
          if (!todo.isAttached) return todo

          // Get window dimensions for tracking items anywhere on page
          const windowWidth = window.innerWidth
          const windowHeight = window.innerHeight

          // Item dimensions (approximate)
          const itemWidth = 250
          const itemHeight = 70

          // Calculate position relative to entire viewport
          // Center the item on the cursor/touch point
          const x = e.clientX - itemWidth / 2
          const y = e.clientY - itemHeight / 2

          // Check if hovering over trash
          if (trashZoneRef.current) {
            const trash = trashZoneRef.current.getBoundingClientRect()
            const isOverTrash =
              e.clientX > trash.left &&
              e.clientX < trash.right &&
              e.clientY > trash.top &&
              e.clientY < trash.bottom

            setIsTrashHighlighted(isOverTrash)
          }

          return {
            ...todo,
            position: { x, y }
          }
        })
      })
    }

    const handlePointerUp = () => {
      // Update dragging state on pointer up
      setTodos(prevTodos => {
        return prevTodos.map(todo => {
          if (todo.isDragging) {
            return { ...todo, isDragging: false }
          }
          return todo
        })
      })

      // Check if dropping on trash
      if (isTrashHighlighted) {
        const draggingTodo = todos.find(todo => todo.isDragging)
        if (draggingTodo) {
          deleteTodo(draggingTodo.id)
        }
      }

      setIsTrashHighlighted(false)
    }

    // Use pointer events which work for both mouse and touch
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
    }
  }, [todos, isTrashHighlighted])

  // Add a new todo
  const addTodo = () => {
    if (!newTodoText.trim()) return

    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text: newTodoText,
      isComplete: false,
      isDragging: false,
      isAttached: false,
      position: { x: 0, y: 0 }
    }

    setTodos([...todos, newTodo])
    setNewTodoText('')
  }

  // Delete a todo
  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
    setIsTrashHighlighted(false)
  }

  // Toggle todo completion
  const toggleComplete = (id: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, isComplete: !todo.isComplete } : todo
      )
    )
  }

  // Reset all todos to default
  const resetTodos = () => {
    setTodos(
      defaultTodos.map(todo => ({
        ...todo,
        isDragging: false,
        isAttached: false,
        position: { x: 0, y: 0 }
      }))
    )
    setIsTrashHighlighted(false)
  }

  // Handle key press and touch gestures to detach items
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Use Escape key to detach all items
      if (e.key === 'Escape') {
        detachAllTodos()
      }
    }

    // Handle multi-touch gesture (two or more touches) to detach items
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length >= 2) {
        // Detach all items when user performs a multi-touch gesture
        detachAllTodos()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('touchstart', handleTouchStart)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('touchstart', handleTouchStart)
    }
  }, [])

  // Start dragging a todo
  const handleDragStart = (id: string, event: React.PointerEvent) => {
    const message =
      attachmentMessages[Math.floor(Math.random() * attachmentMessages.length)]

    // Get the item dimensions (approximate)
    const itemWidth = 250
    const itemHeight = 70

    // Calculate initial position centered on cursor
    const initialX = event.clientX - itemWidth / 2
    const initialY = event.clientY - itemHeight / 2

    setTodos(prevTodos => {
      return prevTodos.map(todo => {
        if (todo.id === id) {
          return {
            ...todo,
            isDragging: true,
            isAttached: true,
            message,
            position: { x: initialX, y: initialY }
          }
        }
        return todo
      })
    })
  }

  // Detach a todo from cursor
  const detachTodo = (id: string) => {
    setTodos(prevTodos => {
      return prevTodos.map(todo => {
        if (todo.id === id) {
          return {
            ...todo,
            isAttached: false,
            isDragging: false
          }
        }
        return todo
      })
    })
  }

  // Detach all todos from cursor
  const detachAllTodos = () => {
    setTodos(prevTodos => {
      return prevTodos.map(todo => {
        if (todo.isAttached) {
          return {
            ...todo,
            isAttached: false,
            isDragging: false
          }
        }
        return todo
      })
    })
  }

  return (
    <div>
      <div className='mb-6'>
        <div className='p-3 border rounded-md bg-yellow-50 dark:bg-yellow-950 mb-6'>
          <p className='text-sm text-yellow-800 dark:text-yellow-300 flex items-center'>
            <span className='mr-2'>💡</span>
            <span>
              Press{' '}
              <kbd className='px-2 py-1 bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded text-xs shadow-sm'>
                Esc
              </kbd>{' '}
              to detach clingy items. On touch devices, use a two-finger tap.
            </span>
          </p>
        </div>
      </div>

      <Card className='p-6'>
        <div className='mb-4'>
          <h2 className='text-xl font-medium'>Todo List</h2>
        </div>

        <div
          ref={containerRef}
          className='relative border rounded-lg h-[400px] bg-secondary/20'
        >
          {/* Input for new todos - now at the top */}
          <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
            <div className='flex gap-2'>
              <Input
                value={newTodoText}
                onChange={e => setNewTodoText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTodo()}
                placeholder='Add a new task...'
                className='flex-1'
              />
              <Button size='icon' onClick={addTodo}>
                <Plus size={16} />
              </Button>
            </div>
          </div>

          {/* Todo list */}
          <div className='p-4 overflow-auto h-[calc(100%-73px)]'>
            {/* Regular todo list */}
            {todos
              .filter(todo => !todo.isAttached)
              .map(todo => (
                <div
                  key={todo.id}
                  className={`flex items-center gap-2 p-3 rounded-md shadow-md mb-2 cursor-grab ${
                    todo.isComplete
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : 'bg-white dark:bg-gray-800'
                  } border border-gray-200 dark:border-gray-700`}
                  onPointerDown={e => {
                    e.preventDefault() // Prevent text selection
                    handleDragStart(todo.id, e)
                  }}
                >
                  <button
                    className={`flex-none h-5 w-5 rounded-sm ${
                      todo.isComplete
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-400'
                    }`}
                    onClick={e => {
                      e.stopPropagation()
                      toggleComplete(todo.id)
                    }}
                  >
                    {todo.isComplete ? (
                      <Check size={16} />
                    ) : (
                      <div className='h-4 w-4 rounded-sm border border-current' />
                    )}
                  </button>

                  <span
                    className={`flex-1 text-sm ${
                      todo.isComplete
                        ? 'line-through text-gray-500 dark:text-gray-400'
                        : ''
                    }`}
                  >
                    {todo.text}
                  </span>
                </div>
              ))}

            {todos.filter(todo => !todo.isAttached).length === 0 && (
              <div className='text-center py-8 text-sm text-muted-foreground'>
                No tasks yet. Add one above!
              </div>
            )}
          </div>

          {/* Attached todos (floating with cursor) */}
          <AnimatePresence>
            {todos
              .filter(todo => todo.isAttached)
              .map(todo => (
                <motion.div
                  key={`attached-${todo.id}`}
                  className='fixed z-50'
                  style={{
                    left: todo.position.x,
                    top: todo.position.y,
                    touchAction: 'none',
                    cursor: todo.isDragging ? 'grabbing' : 'grab',
                    pointerEvents: 'auto'
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: todo.isDragging ? [0, -2, 2, 0] : 0
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    rotate: { repeat: Infinity, duration: 0.5 }
                  }}
                >
                  <div
                    className={`flex items-center gap-2 p-3 rounded-md shadow-md mb-2 min-w-[200px] ${
                      todo.isComplete
                        ? 'bg-green-100 dark:bg-green-900/30'
                        : 'bg-white dark:bg-gray-800'
                    } border-2 border-primary`}
                    style={{ pointerEvents: 'auto' }}
                  >
                    <button
                      className={`flex-none h-5 w-5 rounded-sm ${
                        todo.isComplete
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-gray-400'
                      }`}
                      onClick={e => {
                        e.stopPropagation()
                        toggleComplete(todo.id)
                      }}
                    >
                      {todo.isComplete ? (
                        <Check size={16} />
                      ) : (
                        <div className='h-4 w-4 rounded-sm border border-current' />
                      )}
                    </button>

                    <span
                      className={`flex-1 text-sm ${
                        todo.isComplete
                          ? 'line-through text-gray-500 dark:text-gray-400'
                          : ''
                      }`}
                    >
                      {todo.text}
                    </span>

                    <button
                      className='flex-none h-5 w-5 text-gray-400 hover:text-gray-600'
                      onClick={e => {
                        e.stopPropagation()
                        detachTodo(todo.id)
                      }}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Speech bubble */}
                  {todo.message && (
                    <motion.div
                      className='mt-2 bg-white dark:bg-gray-800 p-2 rounded-md shadow-md text-xs border border-gray-200 dark:border-gray-700 z-50'
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className='flex items-center gap-1'>
                        <MessageCircle size={12} className='text-primary' />
                        <span>{todo.message}</span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
          </AnimatePresence>
        </div>

        {/* Floating detach button - appears when items are attached */}
        <AnimatePresence>
          {todos.some(todo => todo.isAttached) && (
            <motion.div
              className='fixed bottom-4 right-4 z-[100]'
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Button
                onClick={detachAllTodos}
                className='shadow-lg bg-primary hover:bg-primary/90'
                size='sm'
              >
                Detach Items
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trash zone */}
        <div className='mt-4'>
          <div
            ref={trashZoneRef}
            className={`p-4 border border-dashed rounded-md flex items-center justify-center ${
              isTrashHighlighted
                ? 'bg-red-100 dark:bg-red-900/30 border-red-400'
                : 'border-gray-300 dark:border-gray-700'
            }`}
          >
            <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
              <Trash2
                size={18}
                className={isTrashHighlighted ? 'text-red-500' : ''}
              />
              <span>Drop here to delete</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
