"use client"

import { useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Artist } from "@/lib/types"
import { cn } from "@/lib/utils"
import DiagonalArrow from "./diagonal-arrow"

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
        className="absolute -left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/20 bg-mg-black/90 text-white transition-colors duration-300 hover:border-mg-red hover:bg-mg-red"
        aria-label="Anterior"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute -right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/20 bg-mg-black/90 text-white transition-colors duration-300 hover:border-mg-red hover:bg-mg-red"
        aria-label="Siguiente"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Carousel */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-5">
          {artists.map((artist, index) => (
            <div key={artist.id} className="group w-[280px] flex-none md:w-[340px]">
              <Link href={`/artistas/${artist.slug}`} className="block">
                <div className="relative aspect-[3/4] overflow-hidden border border-white/10 bg-zinc-950 transition-colors duration-500 group-hover:border-mg-red/70">
                  <Image
                    src={artist.photo_url}
                    alt={artist.name}
                    fill
                    className="object-cover grayscale transition-[filter,transform] duration-700 ease-out group-hover:grayscale-0 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 280px, 340px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-mg-black via-mg-black/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Index chip */}
                  <span className="absolute left-0 top-0 border-b border-r border-white/10 bg-mg-black/70 px-3 py-2 font-mono text-[10px] tracking-[0.3em] text-white/60 backdrop-blur-sm transition-colors duration-500 group-hover:text-mg-red">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <span className="mb-3 block h-px w-8 bg-mg-red transition-all duration-500 group-hover:w-16" />
                    <h3 className="font-heading text-2xl uppercase leading-[0.9] text-white md:text-3xl">
                      {artist.name}
                    </h3>
                    <div className="mt-2 flex items-end justify-between gap-3">
                      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50 transition-colors duration-300 group-hover:text-white/80">
                        {artist.location ?? "Ver perfil"}
                      </span>
                      <span className="translate-y-1 text-mg-red opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <DiagonalArrow size={18} strokeWidth={1.75} />
                      </span>
                    </div>
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
