import HeroLogo from "@/components/hero-logo"
import MasonryGrid from "@/components/masonry-grid"
import InstagramFeed from "@/components/instagram-feed"
import { getAllArtists } from "@/lib/mock-data"
import Link from "next/link"

export default function Home() {
  const allArtists = getAllArtists()

  return (
    <>
      {/* Hero Section with Large Logo */}
      <HeroLogo text="MG-COMPANY" />

      {/* Masonry Grid Section */}
      <section className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <MasonryGrid artists={allArtists} />

        {/* View All Artists Button */}
        <div className="mt-12 md:mt-16 lg:mt-20 text-center">
          <Link
            href="/artists"
            className="inline-block px-10 py-5 border-2 border-white rounded-full text-sm uppercase font-bold hover:bg-white hover:text-black hover:scale-105 transition-all duration-300"
          >
            View All Artists →
          </Link>
        </div>
      </section>

      {/* Instagram Feed */}
      <InstagramFeed />

      {/* About CTA */}
      <section className="container mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight mb-6 md:mb-8">
            Work With Us
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 mb-8 md:mb-10 leading-relaxed max-w-2xl mx-auto">
            MG-Company is a leading talent agency representing the finest artists in Latin America.
            We connect exceptional talent with world-class opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
            <Link
              href="/contact"
              className="px-10 py-5 bg-white text-black rounded-full text-sm uppercase font-bold hover:bg-zinc-200 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Get in Touch
            </Link>
            <Link
              href="/about"
              className="px-10 py-5 border-2 border-white rounded-full text-sm uppercase font-bold hover:bg-white hover:text-black hover:scale-105 transition-all duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
