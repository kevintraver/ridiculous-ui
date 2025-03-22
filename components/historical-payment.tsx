'use client'

import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Handshake,
  Leaf,
  Feather,
  Coffee,
  Users,
  CircleDashed,
  Shell,
  Diamond,
  Wheat,
  Container,
  Beef,
  Bean,
  NotebookPen
} from 'lucide-react'

// Form schema
const formSchema = z.object({
  paymentMethod: z.string({
    required_error: 'Please select a payment method from antiquity.'
  }),
  quantity: z.string().optional(),
  terms: z.boolean().default(false).optional()
})

export default function HistoricalPayment() {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)
  const [paymentValue, setPaymentValue] = useState('')

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentMethod: '',
      quantity: '',
      terms: false
    }
  })

  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    setShowConfirmation(true)

    // Set payment value based on selection
    const paymentTexts: Record<string, string> = {
      barter: 'Your goods/services are being appraised by our merchant guild.',
      shells: 'Your shell payment is being counted by our mollusk expert.',
      livestock:
        'Your livestock payment is being inspected by our animal handler.',
      grain: 'Your grain payment is being weighed at our granary.',
      metal: 'Your metal ingots are being assayed for purity.',
      salt: 'Your salt blocks are being measured for weight and purity.',
      beads: 'Your bead payment is being authenticated by our craftsman.',
      spices: 'Your spice payment is being assessed by our apothecary.',
      feathers:
        'Your feather payment is being counted and verified for quality.',
      slaves: 'Your offer of human labor is being reviewed by our overseer.'
    }

    setPaymentValue(
      paymentTexts[values.paymentMethod] || 'Your payment is being processed.'
    )

    // Simulate loading state
    setTimeout(() => {
      setPaymentConfirmed(true)
    }, 3000)
  }

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'barter':
        return <Handshake className='h-6 w-6' />
      case 'shells':
        return <Shell className='h-6 w-6' />
      case 'livestock':
        return <Beef className='h-6 w-6' />
      case 'grain':
        return <Wheat className='h-6 w-6' />
      case 'metal':
        return <Container className='h-6 w-6' />
      case 'salt':
        return <Coffee className='h-6 w-6' />
      case 'beads':
        return <CircleDashed className='h-6 w-6' />
      case 'spices':
        return <Bean className='h-6 w-6' />
      case 'feathers':
        return <Feather className='h-6 w-6' />
      case 'slaves':
        return <Users className='h-6 w-6' />
      default:
        return null
    }
  }

  const paymentMethods = [
    {
      value: 'barter',
      label: 'Barter (goods/services swapped directly)',
      description: 'Oldest form of exchange',
      tag: 'Prehistoric'
    },
    {
      value: 'shells',
      label: 'Shell money (cowries, wampum)',
      description: 'Used throughout Africa, Asia, and the Americas',
      tag: 'Marine'
    },
    {
      value: 'livestock',
      label: 'Livestock (cattle, goats)',
      description: 'Common in pastoral societies',
      tag: 'Animal'
    },
    {
      value: 'grain',
      label: 'Grain (wheat, barley)',
      description: 'Standard in agricultural economies',
      tag: 'Plant'
    },
    {
      value: 'metal',
      label: 'Metal ingots (copper, bronze)',
      description: 'Precursor to modern coins',
      tag: 'Mineral'
    },
    {
      value: 'salt',
      label: 'Salt (used as currency in Rome)',
      description: 'So valuable Romans were paid in it (hence "salary")',
      tag: 'Mineral'
    },
    {
      value: 'beads',
      label: 'Beads (glass, stone)',
      description: 'Used across civilizations for millennia',
      tag: 'Craft'
    },
    {
      value: 'spices',
      label: 'Spices (pepper, saffron)',
      description: 'Worth their weight in gold',
      tag: 'Plant'
    },
    {
      value: 'feathers',
      label: 'Feathers (in some Mesoamerican cultures)',
      description: 'Highly prized in Aztec society',
      tag: 'Animal'
    },
    {
      value: 'slaves',
      label: 'Slaves (in ancient societies)',
      description: 'Controversial but historically accurate form of wealth',
      tag: 'Human'
    }
  ]

  // Randomly generate appropriate payment terms based on the selected method
  const getPaymentTerms = (method: string) => {
    const terms: Record<string, string[]> = {
      barter: [
        '3 days of woodworking',
        '2 baskets of fish',
        '1 hunting expedition'
      ],
      shells: ['50 cowrie shells', '20 large wampum', '15 rare purple shells'],
      livestock: ['2 goats', '1 young calf', '5 chickens'],
      grain: ['2 bushels of wheat', '3 sacks of barley', '1 cart of rice'],
      metal: ['3 copper pieces', '1 silver ingot', '5 bronze rings'],
      salt: ['1 salt block', '3 measures of salt crystals', '2 salt tablets'],
      beads: ['20 glass beads', '5 amber beads', '15 stone beads'],
      spices: [
        '1 pouch of saffron',
        '3 measures of pepper',
        '2 sticks of cinnamon'
      ],
      feathers: [
        '10 quetzal feathers',
        '20 eagle feathers',
        '15 parrot feathers'
      ],
      slaves: ['1 strong laborer', '2 skilled workers', '3 house servants']
    }

    const selectedMethod = terms[method] || ['Standard payment']
    return selectedMethod[Math.floor(Math.random() * selectedMethod.length)]
  }

  // Reset the form
  const handleReset = () => {
    form.reset()
    setShowConfirmation(false)
    setPaymentConfirmed(false)
  }

  // Shake the form when trying to use modern payment methods
  const [isShaking, setIsShaking] = useState(false)

  // Watch for payment method changes
  const selectedMethod = form.watch('paymentMethod')

  // Update quantity when payment method changes
  useEffect(() => {
    if (selectedMethod) {
      form.setValue('quantity', getPaymentTerms(selectedMethod))
    }
  }, [selectedMethod, form])

  const triggerModernPayment = () => {
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 500)
  }

  return (
    <Card className='max-w-xl mx-auto'>
      <CardHeader>
        <CardTitle>Ancient Payment Portal</CardTitle>
        <CardDescription>
          Select your preferred payment method from antiquity
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!showConfirmation ? (
          <div className={`transition-all ${isShaking ? 'animate-shake' : ''}`}>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6'
              >
                <div className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='paymentMethod'
                    render={({ field }) => (
                      <FormItem className='space-y-3'>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className='flex flex-col space-y-1'
                          >
                            {paymentMethods.map(method => (
                              <label
                                key={method.value}
                                className={`flex items-center justify-between space-x-3 border rounded-md p-5 hover:bg-accent transition-colors ${
                                  field.value === method.value
                                    ? 'border-primary bg-accent/30'
                                    : ''
                                } cursor-pointer`}
                                htmlFor={`payment-${method.value}`}
                              >
                                <div className='flex items-center space-x-4 min-w-0'>
                                  <FormControl className='flex-shrink-0'>
                                    <RadioGroupItem
                                      value={method.value}
                                      id={`payment-${method.value}`}
                                    />
                                  </FormControl>
                                  <div className='min-w-0'>
                                    <div className='flex items-center gap-2'>
                                      <span className='text-base'>
                                        {method.label.includes('(') ? (
                                          <>
                                            <span className='font-bold'>
                                              {method.label
                                                .split('(')[0]
                                                .trim()}
                                            </span>
                                            <span>
                                              {' '}
                                              ({method.label.split('(')[1]}
                                            </span>
                                          </>
                                        ) : (
                                          method.label
                                        )}
                                      </span>
                                      <span className='px-2 py-0.5 bg-muted text-xs rounded-full font-medium'>
                                        {method.tag}
                                      </span>
                                    </div>
                                    <p className='text-sm text-muted-foreground mt-1'>
                                      {method.description}
                                    </p>
                                  </div>
                                </div>
                                <div className='flex-shrink-0 ml-4'>
                                  {getPaymentIcon(method.value)}
                                </div>
                              </label>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedMethod && (
                    <FormField
                      control={form.control}
                      name='quantity'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Amount</FormLabel>
                          <FormControl>
                            <div className='p-4 border rounded-md bg-muted'>
                              <p className='text-lg font-semibold'>
                                {field.value}
                              </p>
                              <p className='text-sm text-muted-foreground mt-1'>
                                Our merchants have determined this is a fair
                                exchange
                              </p>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <div className='flex flex-col space-y-2 border-t pt-4 mt-4'>
                    <h3 className='text-sm font-medium'>
                      Modern methods (not available)
                    </h3>
                    <div className='flex space-x-2'>
                      <Button
                        onClick={triggerModernPayment}
                        type='button'
                        variant='outline'
                        size='sm'
                        disabled
                      >
                        Credit Card
                      </Button>
                      <Button
                        onClick={triggerModernPayment}
                        type='button'
                        variant='outline'
                        size='sm'
                        disabled
                      >
                        PayPal
                      </Button>
                      <Button
                        onClick={triggerModernPayment}
                        type='button'
                        variant='outline'
                        size='sm'
                        disabled
                      >
                        Cryptocurrency
                      </Button>
                    </div>
                    <p className='text-xs text-muted-foreground italic'>
                      These payment methods will be invented thousands of years
                      in the future
                    </p>
                  </div>
                </div>

                <Button
                  type='submit'
                  className='w-full'
                  disabled={!selectedMethod}
                >
                  Confirm Payment
                </Button>
              </form>
            </Form>
          </div>
        ) : (
          <div className='py-8 flex flex-col items-center space-y-4'>
            {!paymentConfirmed ? (
              <>
                <div className='h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin' />
                <h3 className='text-xl font-semibold mt-4'>
                  Processing your payment...
                </h3>
                <p className='text-center text-muted-foreground'>
                  {paymentValue}
                </p>
                <p className='text-sm italic text-center'>
                  Please be patient, messages are being delivered by courier
                </p>
              </>
            ) : (
              <>
                <div className='h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center'>
                  <NotebookPen className='h-8 w-8 text-black' />
                </div>
                <h3 className='text-xl font-semibold mt-4'>
                  Payment Accepted!
                </h3>
                <p className='text-center'>
                  Your payment method:{' '}
                  <strong>
                    {paymentMethods.find(
                      m => m.value === form.getValues('paymentMethod')
                    )?.label || form.getValues('paymentMethod')}
                  </strong>{' '}
                  has been recorded in our ledger.
                </p>
                <p className='text-center'>
                  <strong>Amount paid:</strong> {form.getValues('quantity')}
                </p>
                <p className='text-sm italic text-center'>
                  A wax tablet receipt will be delivered by messenger within 5-7
                  business days.
                </p>
                <Button onClick={handleReset} className='mt-4'>
                  Make Another Payment
                </Button>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
