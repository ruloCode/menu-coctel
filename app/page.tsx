import VideoHero from "@/components/video-hero"
import FeaturedArtistsCarousel from "@/components/featured-artists-carousel"
import BusinessUnitsGrid from "@/components/business-units-grid"
import SectionHeading from "@/components/section-heading"
import ShowCard from "@/components/show-card"
import ScrollReveal from "@/components/scroll-reveal"
import ScrollProgress from "@/components/scroll-progress"
import CTASection from "@/components/cta-section"
import ManifestoSpread from "@/components/manifesto-spread"
import BrandMarquee from "@/components/brand-marquee"
import DiagonalArrow from "@/components/diagonal-arrow"
import { getAllArtists, getAllBusinessUnits, getAllShows } from "@/lib/mock-data"
import Link from "next/link"

export default function Home() {
  const featuredArtists = getAllArtists()
  const businessUnits = getAllBusinessUnits()
  const shows = getAllShows()
  const displayShows = shows.slice(0, 4)

  return (
    <>
      <ScrollProgress />

      <VideoHero posterSrc="/generated/hero-bg.png" />

      <ManifestoSpread />

      <BrandMarquee />

      <section className="container mx-auto px-4 md:px-6 lg:px-10 py-16 md:py-24">
        <ScrollReveal direction="up">
          <SectionHeading
            index="02"
            kicker="Roster"
            title="Artistas"
            subtitle="Voces que están definiendo el sonido del nuevo Caribe y la diáspora latina."
            className="mb-10 md:mb-14"
          />
        </ScrollReveal>
        <ScrollReveal direction="up" delay={0.2}>
          <FeaturedArtistsCarousel artists={featuredArtists} />
        </ScrollReveal>
        <ScrollReveal direction="up" delay={0.3}>
          <div className="mt-10 md:mt-14 flex justify-end">
            <Link
              href="/artistas"
              className="group inline-flex items-center gap-4 border-2 border-white/80 px-6 md:px-8 py-3.5 md:py-4 hover:bg-white hover:text-mg-black hover:border-white transition-colors duration-300"
            >
              <span className="font-mono uppercase text-xs md:text-sm tracking-[0.3em] font-medium">
                Ver todos los artistas
              </span>
              <DiagonalArrow size={22} strokeWidth={1.75} />
            </Link>
          </div>
        </ScrollReveal>
      </section>

      <section className="bg-mg-black border-t border-white/10">
        <div className="container mx-auto px-4 md:px-6 lg:px-10 pt-16 md:pt-24 pb-10 md:pb-12">
          <ScrollReveal direction="up">
            <SectionHeading
              index="03"
              kicker="Capítulos"
              title="Nuestras Unidades"
              subtitle="Cuatro divisiones operando como un solo organismo. Cada una con su frecuencia, todas afinadas a la misma señal."
              className="mb-10 md:mb-14"
            />
          </ScrollReveal>
        </div>
        <BusinessUnitsGrid businessUnits={businessUnits} />
        <div className="container mx-auto px-4 md:px-6 lg:px-10 pt-6 md:pt-8 pb-16 md:pb-20">
          <div className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-white/40 flex items-center gap-3">
            <span>Paleta secundaria</span>
            <span className="h-px flex-1 bg-white/15" />
            <span className="text-mg-red">100 / 80 / 60 / 40</span>
          </div>
        </div>
      </section>

      <BrandMarquee variant="outline" />

      {displayShows.length > 0 && (
        <section
          className="relative border-y border-white/10 overflow-hidden"
          style={{
            backgroundImage: "url(/generated/mg-flow-bg.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-mg-black/85" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 50% 50% at 80% 20%, rgba(232,32,12,0.25) 0%, transparent 60%)",
            }}
          />
          <div className="relative container mx-auto px-4 md:px-6 lg:px-10 py-16 md:py-24">
            <ScrollReveal direction="up">
              <SectionHeading
                index="04"
                kicker="Contenido"
                title="MG Flow"
                subtitle="Series, sesiones y documentales originales. Contenido audiovisual hecho para escucharse."
                className="mb-10 md:mb-14"
              />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.2}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayShows.map((show) => (
                  <ShowCard key={show.slug} show={show} />
                ))}
              </div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.3}>
              <div className="mt-10 md:mt-14 flex justify-end">
                <Link
                  href="/mg-flow"
                  className="group inline-flex items-center gap-4 border-2 border-mg-red px-6 md:px-8 py-3.5 md:py-4 hover:bg-mg-red transition-colors duration-300"
                >
                  <span className="font-mono uppercase text-xs md:text-sm tracking-[0.3em] font-medium text-white">
                    Ver todos los shows
                  </span>
                  <DiagonalArrow size={22} strokeWidth={1.75} className="text-white" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      <CTASection />
    </>
  )
}
