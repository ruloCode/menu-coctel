import ArtistFilter from "@/components/artist-filter"
import ScrollingText from "@/components/scrolling-text"
import { getAllArtists, getAllAgents } from "@/lib/mock-data"

export const metadata = {
  title: "Artistas | MG Company Group",
  description: "Explora nuestro roster completo de artistas de musica urbana y latina.",
}

export default function ArtistasPage() {
  const artists = getAllArtists()
  const agents = getAllAgents()

  return (
    <>
      {/* Hero Section */}
      <section className="py-12 md:py-20 overflow-hidden border-b border-white/10">
        <ScrollingText text="Artistas" />
      </section>

      {/* Artists List with Filters */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-tight mb-2">
            Nuestro Roster
          </h2>
          <p className="text-zinc-400">
            {artists.length} artistas representados
          </p>
        </div>

        <ArtistFilter artists={artists} agents={agents} />
      </section>
    </>
  )
}
