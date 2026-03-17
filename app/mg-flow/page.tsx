import Image from "next/image"
import Link from "next/link"
import { getAllShows } from "@/lib/mock-data"
import NetflixCarousel from "@/components/netflix-carousel"
import ShowCard from "@/components/show-card"

export const metadata = {
  title: "MG Flow | MG Company Group",
  description: "Contenido original de MG Company Group. Shows, podcasts, documentales y mas.",
}

export default function MGFlowPage() {
  const shows = getAllShows()
  const featuredShow = shows[0]

  // Group shows by category
  const categories = Array.from(new Set(shows.map((show) => show.category)))
  const showsByCategory = categories.map((category) => ({
    category,
    shows: shows.filter((show) => show.category === category),
  }))

  return (
    <>
      {/* Hero Banner with Featured Show */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-end overflow-hidden">
        <Image
          src={featuredShow.thumbnail}
          alt={featuredShow.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="relative z-10 container mx-auto px-4 pb-12">
          <span className="text-mg-red text-sm uppercase tracking-widest font-medium mb-2 block">
            Destacado
          </span>
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl uppercase text-white mb-3">
            {featuredShow.title}
          </h1>
          <p className="text-zinc-300 text-base md:text-lg max-w-2xl mb-6">
            {featuredShow.description}
          </p>
          <Link
            href={`/mg-flow/${featuredShow.slug}`}
            className="inline-block px-8 py-3 bg-mg-red text-white rounded-full text-sm uppercase font-bold hover:bg-red-700 transition-all"
          >
            Ver Show
          </Link>
        </div>
      </section>

      {/* Shows by Category */}
      <section className="container mx-auto px-4 py-12 md:py-16 space-y-12">
        {showsByCategory.map(({ category, shows: categoryShows }) => (
          <NetflixCarousel key={category} title={category}>
            {categoryShows.map((show) => (
              <ShowCard key={show.slug} show={show} />
            ))}
          </NetflixCarousel>
        ))}
      </section>
    </>
  )
}
