"use client"

import type React from "react"
import { useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface NetflixCarouselProps {
  title: string
  children: React.ReactNode
  className?: string
}

export default function NetflixCarousel({ title, children, className }: NetflixCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 2,
    containScroll: "trimSnaps",
  })

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <div className={cn("relative", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-2xl md:text-3xl uppercase text-white">
          {title}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={scrollPrev}
            className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white hover:bg-mg-red transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={scrollNext}
            className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white hover:bg-mg-red transition-colors"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-4">
          {children}
        </div>
      </div>
    </div>
  )
}
