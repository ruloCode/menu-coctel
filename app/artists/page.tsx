import ArtistFilter from "@/components/artist-filter"
import ScrollingText from "@/components/scrolling-text"
import { getAllArtists, getAllAgents } from "@/lib/mock-data"

export const metadata = {
  title: "Artists | MG-Company",
  description: "Browse our complete roster of talented artists across electronic, urban, and alternative music.",
}

export default function ArtistsPage() {
  const artists = getAllArtists()
  const agents = getAllAgents()

  return (
    <>
      {/* Hero Section */}
      <section className="py-12 md:py-20 overflow-hidden border-b border-white/10">
        <ScrollingText text="Artists" />
      </section>

      {/* Artists List with Filters */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-2">
            Our Roster
          </h2>
          <p className="text-zinc-400">
            {artists.length} talented artists represented
          </p>
        </div>

        <ArtistFilter artists={artists} agents={agents} />
      </section>
    </>
  )
}
