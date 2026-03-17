"use client"

import Image from "next/image"
import Link from "next/link"
import type { Artist, TileShape } from "@/lib/types"

interface ArtistCardProps {
  artist: Artist
  priority?: boolean
  shape?: TileShape
}

export default function ArtistCard({ artist, priority = false, shape = "square" }: ArtistCardProps) {
  // Determine object position based on shape for better image framing
  const objectPosition = shape === "portrait" ? "center top" : "center center"

  return (
    <Link
      href={`/artistas/${artist.slug}`}
      className="artist-card group block relative overflow-hidden h-full rounded-lg"
    >
      <div className="relative overflow-hidden bg-zinc-900 h-full rounded-lg">
        <Image
          src={artist.photo_url}
          alt={artist.name}
          fill
          className="object-cover will-change-transform"
          style={{ objectPosition }}
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
        />
        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />

        {/* Artist name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-8 transform transition-transform duration-500 group-hover:translate-y-[-8px]">
          <h3 className="font-black uppercase tracking-tight text-white transition-all duration-300 text-xl md:text-2xl lg:text-3xl">
            {artist.name}
          </h3>
          {artist.location && (
            <p className="text-xs md:text-sm text-zinc-300 mt-2 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
              {artist.location}
            </p>
          )}
          {/* Hover indicator */}
          <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
            <span className="text-xs uppercase font-bold text-white tracking-wider">Ver Perfil</span>
            <svg
              className="w-4 h-4 text-white transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}
