'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Eye, EyeOff } from 'lucide-react'

export default function OversizedPasswordField() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Card>
      <CardContent className='p-6'>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='ridiculous-password'>
              Enter your "secure" password:
            </Label>
            <div className='relative'>
              <Input
                id='ridiculous-password'
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder='Type your password...'
                className='pr-10'
              />
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='absolute right-0 top-0 h-full'
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className='h-4 w-4' />
                ) : (
                  <Eye className='h-4 w-4' />
                )}
              </Button>
            </div>
          </div>

          {password && (
            <div className='border rounded-md p-4 bg-background'>
              <div className='text-center font-bold text-5xl tracking-widest break-all'>
                {showPassword ? password : '•'.repeat(password.length)}
              </div>
              <p className='text-center text-xs text-muted-foreground mt-2'>
                Your "secure" password is now visible to everyone in the room!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
