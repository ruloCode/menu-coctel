"use client"

import Image from "next/image"
import Link from "next/link"
import type { Artist, TileShape } from "@/lib/types"
import DiagonalArrow from "./diagonal-arrow"

interface ArtistCardProps {
  artist: Artist
  priority?: boolean
  shape?: TileShape
  index?: number
}

export default function ArtistCard({ artist, priority = false, shape = "square", index }: ArtistCardProps) {
  // Determine object position based on shape for better image framing
  const objectPosition = shape === "portrait" ? "center top" : "center center"

  return (
    <Link
      href={`/artistas/${artist.slug}`}
      className="group relative block h-full overflow-hidden border border-white/10 bg-zinc-950 transition-colors duration-500 hover:border-mg-red/70"
    >
      <Image
        src={artist.photo_url}
        alt={artist.name}
        fill
        className="object-cover grayscale transition-[filter,transform] duration-700 ease-out will-change-transform group-hover:grayscale-0 group-hover:scale-[1.04]"
        style={{ objectPosition }}
        priority={priority}
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
      />

      {/* Gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-mg-black via-mg-black/25 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Index chip */}
      {index !== undefined && (
        <span className="absolute left-0 top-0 border-b border-r border-white/10 bg-mg-black/70 px-3 py-2 font-mono text-[10px] tracking-[0.3em] text-white/60 backdrop-blur-sm transition-colors duration-500 group-hover:text-mg-red">
          {String(index + 1).padStart(2, "0")}
        </span>
      )}

      {/* Name + meta */}
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
        <span className="mb-3 block h-px w-8 bg-mg-red transition-all duration-500 group-hover:w-16" />
        <h3 className="font-heading text-3xl uppercase leading-[0.9] text-white md:text-4xl">
          {artist.name}
        </h3>
        <div className="mt-2.5 flex items-end justify-between gap-3">
          {artist.location ? (
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50 transition-colors duration-300 group-hover:text-white/80 md:text-[11px]">
              {artist.location}
            </p>
          ) : (
            <span />
          )}
          <span className="translate-y-1 text-mg-red opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <DiagonalArrow size={20} strokeWidth={1.75} />
          </span>
        </div>
      </div>
    </Link>
  )
}
