"use client"

import { useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Artist } from "@/lib/types"
import { cn } from "@/lib/utils"

interface FeaturedArtistsCarouselProps {
  artists: Artist[]
  className?: string
}

export default function FeaturedArtistsCarousel({
  artists,
  className,
}: FeaturedArtistsCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    slidesToScroll: 1,
  })

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <div className={cn("relative", className)}>
      {/* Navigation arrows */}
      <button
        onClick={scrollPrev}
        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-mg-black/80 border border-zinc-700 flex items-center justify-center text-white hover:bg-mg-red transition-colors"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-mg-black/80 border border-zinc-700 flex items-center justify-center text-white hover:bg-mg-red transition-colors"
        aria-label="Siguiente"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Carousel */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-4">
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="flex-none w-[280px] md:w-[320px] group"
            >
              <Link href={`/artistas/${artist.slug}`} className="block">
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                  <Image
                    src={artist.photo_url}
                    alt={artist.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-heading text-xl uppercase text-white">
                      {artist.name}
                    </h3>
                    <span className="text-mg-red text-sm font-medium mt-1 inline-block group-hover:underline">
                      Ver Perfil
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
