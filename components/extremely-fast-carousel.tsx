'use client'

import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import '../app/embla.css'

type PropType = {
  slides: React.ReactNode[]
  options?: EmblaOptionsType
}

const ExtremelyFastCarousel: React.FC<PropType> = props => {
  const { slides, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 200, stopOnInteraction: false }) as any
  ])

  return (
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
  )
}

export default ExtremelyFastCarousel
