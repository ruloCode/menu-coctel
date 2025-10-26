"use client"

import type { Artist } from "@/lib/types"
import ArtistCard from "./artist-card"

interface ArtistGridProps {
  artists: Artist[]
}

export default function ArtistGrid({ artists }: ArtistGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
      {artists.map((artist, index) => (
        <ArtistCard key={artist.id} artist={artist} priority={index < 4} />
      ))}
    </div>
  )
}
