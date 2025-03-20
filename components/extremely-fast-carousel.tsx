'use client'

import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { Card, CardContent } from '@/components/ui/card'
import '../app/embla.css'

type PropType = {
  slides: React.ReactNode[]
  options?: EmblaOptionsType
}

const ExtremelyFastCarousel: React.FC<PropType> = props => {
  const { slides: providedSlides, options } = props

  // Create default slides if none provided
  const slides = providedSlides?.length
    ? providedSlides
    : Array.from({ length: 100 }, (_, i) => (
        <div className='slide-content' key={i}>
          Slide {i + 1}
        </div>
      ))

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 200, stopOnInteraction: false }) as any
  ])

  return (
    <Card>
      <CardContent className='p-6'>
        <section className='embla'>
          <div className='embla__viewport' ref={emblaRef}>
            <div className='embla__container'>
              {slides.map((slide, index) => (
                <div className='embla__slide' key={index}>
                  {slide}
                </div>
              ))}
            </div>
          </div>
        </section>
      </CardContent>
    </Card>
  )
}

export default ExtremelyFastCarousel
