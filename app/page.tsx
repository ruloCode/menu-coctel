import VideoHero from "@/components/video-hero"
import FeaturedArtistsCarousel from "@/components/featured-artists-carousel"
import BusinessUnitsGrid from "@/components/business-units-grid"
import SectionHeading from "@/components/section-heading"
import ShowCard from "@/components/show-card"
import { getAllArtists, getAllBusinessUnits, getAllShows } from "@/lib/mock-data"
import Link from "next/link"

export default function Home() {
  const featuredArtists = getAllArtists()
  const businessUnits = getAllBusinessUnits()
  const shows = getAllShows()
  const latestShow = shows[0]

  return (
    <>
      {/* Hero Section */}
      <VideoHero
        posterSrc="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&h=1080&fit=crop"
      />

      {/* Featured Artists */}
      <section className="container mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">
        <SectionHeading
          title="Artistas"
          subtitle="Conoce a los artistas que forman parte de nuestro roster"
          className="mb-10 md:mb-14"
        />
        <FeaturedArtistsCarousel artists={featuredArtists} />
        <div className="mt-10 text-center">
          <Link
            href="/artistas"
            className="inline-block px-10 py-4 border-2 border-white rounded-full text-sm uppercase font-bold hover:bg-white hover:text-black hover:scale-105 transition-all duration-300"
          >
            Ver Todos los Artistas
          </Link>
        </div>
      </section>

      {/* Business Units */}
      <section className="container mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">
        <SectionHeading
          title="Nuestras Unidades"
          subtitle="Cuatro divisiones trabajando en sinergia para impulsar el talento latino"
          className="mb-10 md:mb-14"
        />
        <BusinessUnitsGrid businessUnits={businessUnits} />
      </section>

      {/* MG Flow Teaser */}
      {latestShow && (
        <section className="bg-zinc-900/50 border-y border-white/10">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">
            <SectionHeading
              title="MG Flow"
              subtitle="Contenido original de MG Company Group"
              className="mb-10 md:mb-14"
            />
            <div className="flex justify-center">
              <ShowCard show={latestShow} />
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/mg-flow"
                className="inline-block px-10 py-4 border-2 border-white rounded-full text-sm uppercase font-bold hover:bg-white hover:text-black hover:scale-105 transition-all duration-300"
              >
                Ver Todos los Shows
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="container mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight mb-6 md:mb-8">
            Trabaja con Nosotros
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 mb-8 md:mb-10 leading-relaxed max-w-2xl mx-auto">
            MG Company Group es una productora artistica integral que impulsa el talento latino.
            Conectamos artistas excepcionales con oportunidades de clase mundial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
            <Link
              href="/contacto"
              className="px-10 py-5 bg-mg-red text-white rounded-full text-sm uppercase font-bold hover:bg-red-700 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Contactanos
            </Link>
            <Link
              href="/nosotros"
              className="px-10 py-5 border-2 border-white rounded-full text-sm uppercase font-bold hover:bg-white hover:text-black hover:scale-105 transition-all duration-300"
            >
              Conoce Mas
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
