"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import type { Artist } from "@/lib/types"
import MasonryGrid from "./masonry-grid"

interface ArtistFilterProps {
  artists: Artist[]
}

export default function ArtistFilter({ artists }: ArtistFilterProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const normalized = searchQuery.trim().toLowerCase()
  const filteredArtists = normalized
    ? artists.filter((artist) =>
        [artist.name, artist.location, artist.label]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalized)
      )
    : artists

  return (
    <div className="space-y-10 md:space-y-12">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full max-w-md">
          <Search
            className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-white/40"
            size={18}
          />
          <input
            id="search"
            type="text"
            placeholder="Buscar artista"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Buscar artistas"
            className="w-full border-0 border-b border-white/20 bg-transparent py-3 pl-8 pr-10 font-mono text-sm uppercase tracking-[0.15em] text-white placeholder:text-white/30 transition-colors focus:border-mg-red focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              aria-label="Limpiar búsqueda"
              className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-white/40 transition-colors hover:text-mg-red"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/40">
          <span className="text-mg-red">{String(filteredArtists.length).padStart(2, "0")}</span>
          {" / "}
          {String(artists.length).padStart(2, "0")} artistas
        </p>
      </div>

      {/* Results */}
      {filteredArtists.length > 0 ? (
        <MasonryGrid artists={filteredArtists} />
      ) : (
        <div className="border border-white/10 py-20 text-center md:py-28">
          <p className="font-heading text-3xl uppercase text-white/70 md:text-4xl">
            Sin resultados
          </p>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.25em] text-white/40">
            No encontramos artistas para &ldquo;{searchQuery}&rdquo;
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-8 inline-flex items-center gap-3 border border-white/40 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.3em] text-white transition-colors duration-300 hover:border-mg-red hover:bg-mg-red"
          >
            Ver todo el roster
          </button>
        </div>
      )}
    </div>
  )
}
