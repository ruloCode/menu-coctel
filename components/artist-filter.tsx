"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import type { Artist, Agent } from "@/lib/types"
import MasonryGrid from "./masonry-grid"

interface ArtistFilterProps {
  artists: Artist[]
  agents: Agent[]
}

export default function ArtistFilter({ artists, agents }: ArtistFilterProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)

  // Generate alphabet for A-Z filter
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

  // Filter artists based on search and filters
  const filteredArtists = artists.filter((artist) => {
    // Search filter
    if (searchQuery && !artist.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Agent filter
    if (selectedAgent && artist.agent_id !== selectedAgent) {
      return false
    }

    // Letter filter
    if (selectedLetter && !artist.name.toUpperCase().startsWith(selectedLetter)) {
      return false
    }

    return true
  })

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("")
    setSelectedAgent(null)
    setSelectedLetter(null)
  }

  // Get artist count for each letter
  const getLetterCount = (letter: string) => {
    return artists.filter((artist) => artist.name.toUpperCase().startsWith(letter)).length
  }

  return (
    <div className="space-y-8">
      {/* Filter Bar */}
      <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-6">
        {/* Search */}
        <div className="mb-6">
          <label htmlFor="search" className="block text-sm font-bold uppercase mb-2">
            Buscar Artistas
          </label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
            <input
              id="search"
              type="text"
              placeholder="Nombre del artista..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black border border-white/20 rounded-lg py-3 pl-12 pr-4 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>

        {/* A-Z Filter */}
        <div className="mb-6">
          <label className="block text-sm font-bold uppercase mb-3">Filtrar por Letra</label>
          <div className="flex flex-wrap gap-2">
            {alphabet.map((letter) => {
              const count = getLetterCount(letter)
              const isActive = selectedLetter === letter
              const hasArtists = count > 0

              return (
                <button
                  key={letter}
                  onClick={() => setSelectedLetter(isActive ? null : letter)}
                  disabled={!hasArtists}
                  className={`
                    w-10 h-10 rounded font-bold text-sm transition-all
                    ${isActive ? "bg-mg-red text-white" : "bg-black border border-white/20 text-white"}
                    ${hasArtists ? "hover:bg-mg-red hover:text-white cursor-pointer" : "opacity-30 cursor-not-allowed"}
                  `}
                >
                  {letter}
                </button>
              )
            })}
          </div>
        </div>

        {/* Agent Filter */}
        <div className="mb-6">
          <label className="block text-sm font-bold uppercase mb-3">Filtrar por Agente</label>
          <div className="flex flex-wrap gap-2">
            {agents.map((agent) => {
              const isActive = selectedAgent === agent.id
              return (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgent(isActive ? null : agent.id)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-bold transition-all
                    ${isActive ? "bg-mg-red text-white" : "bg-black border border-white/20 text-white hover:bg-mg-red hover:text-white"}
                  `}
                >
                  {agent.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Active Filters & Reset */}
        {(searchQuery || selectedAgent || selectedLetter) && (
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <p className="text-sm text-zinc-400">
              Mostrando {filteredArtists.length} de {artists.length} artistas
            </p>
            <button
              onClick={resetFilters}
              className="text-sm font-bold uppercase underline hover:text-zinc-400 transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      {filteredArtists.length > 0 ? (
        <MasonryGrid artists={filteredArtists} />
      ) : (
        <div className="text-center py-20">
          <p className="text-2xl text-zinc-400">No se encontraron artistas</p>
          <button
            onClick={resetFilters}
            className="mt-4 text-sm font-bold uppercase underline hover:text-white transition-colors"
          >
            Limpiar filtros para ver todos los artistas
          </button>
        </div>
      )}
    </div>
  )
}
