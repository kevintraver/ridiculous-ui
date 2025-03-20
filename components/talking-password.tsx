'use client'

import type React from 'react'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Volume2, VolumeX } from 'lucide-react'

export default function TalkingPasswordField() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [lastChar, setLastChar] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [speakingVolume, setSpeakingVolume] = useState(1)
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null)

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      speechSynthesisRef.current = window.speechSynthesis
    }

    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel()
      }
    }
  }, [])

  // Handle password change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setPassword(newValue)

    // Determine the last character typed
    if (newValue.length > password.length) {
      const newChar = newValue[newValue.length - 1]
      setLastChar(newChar)
      speakCharacter(newChar)
    } else if (newValue.length < password.length) {
      // Handle backspace
      speakCharacter('backspace')
    }

    setIsTyping(true)
    setTimeout(() => setIsTyping(false), 1000)
  }

  // Speak the character out loud
  const speakCharacter = (char: string) => {
    if (isMuted || !speechSynthesisRef.current) return

    // Cancel any ongoing speech
    speechSynthesisRef.current.cancel()

    let textToSpeak = char

    // Special handling for different characters
    if (char === ' ') {
      textToSpeak = 'space'
    } else if (char === '!') {
      textToSpeak = 'exclamation mark'
    } else if (char === '@') {
      textToSpeak = 'at sign'
    } else if (char === '#') {
      textToSpeak = 'hash'
    } else if (char === '$') {
      textToSpeak = 'dollar sign'
    } else if (char === '%') {
      textToSpeak = 'percent'
    } else if (char === '^') {
      textToSpeak = 'caret'
    } else if (char === '&') {
      textToSpeak = 'ampersand'
    } else if (char === '*') {
      textToSpeak = 'asterisk'
    } else if (char === '(') {
      textToSpeak = 'left parenthesis'
    } else if (char === ')') {
      textToSpeak = 'right parenthesis'
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak)
    utterance.volume = speakingVolume
    utterance.rate = 1.0

    // Use a different voice if available
    const voices = speechSynthesisRef.current.getVoices()
    if (voices.length > 0) {
      // Try to find a female voice for variety
      const femaleVoice = voices.find(voice => voice.name.includes('female'))
      if (femaleVoice) {
        utterance.voice = femaleVoice
      }
    }

    speechSynthesisRef.current.speak(utterance)
  }

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (!isMuted && speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel()
    }
  }

  // Change volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = Number.parseFloat(e.target.value)
    setSpeakingVolume(volume)
  }

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='talking-password'>Enter your "secure" password:</Label>
        <div className='relative'>
          <Input
            id='talking-password'
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handlePasswordChange}
            placeholder='Type your password...'
            className='pr-20'
          />
          <div className='absolute right-0 top-0 h-full flex'>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='h-full'
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className='h-4 w-4' />
              ) : (
                <Eye className='h-4 w-4' />
              )}
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='h-full'
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX className='h-4 w-4' />
              ) : (
                <Volume2 className='h-4 w-4' />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='volume-control'>
          Speaker Volume: {Math.round(speakingVolume * 100)}%
        </Label>
        <Input
          id='volume-control'
          type='range'
          min='0'
          max='1'
          step='0.1'
          value={speakingVolume}
          onChange={handleVolumeChange}
        />
      </div>

      <div className='p-4 border rounded-md bg-yellow-50 dark:bg-yellow-950'>
        <p className='text-sm text-yellow-800 dark:text-yellow-300'>
          <strong>Security Warning:</strong> This password field announces each
          character you type out loud. Not recommended for use in public places,
          or anywhere really.
        </p>
      </div>
    </div>
  )
}
