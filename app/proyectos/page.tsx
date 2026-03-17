import Image from "next/image"
import Link from "next/link"
import ScrollingText from "@/components/scrolling-text"
import { getAllBusinessUnits } from "@/lib/mock-data"

export const metadata = {
  title: "Proyectos | MG Company Group",
  description: "Conoce las unidades de negocio de MG Company Group: MG Music, MG Film, MG Up y MG Live.",
}

export default function ProyectosPage() {
  const businessUnits = getAllBusinessUnits()

  return (
    <>
      {/* Hero Section */}
      <section className="py-12 md:py-20 overflow-hidden border-b border-white/10">
        <ScrollingText text="Proyectos" />
      </section>

      {/* Business Units */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="space-y-8">
          {businessUnits.map((unit, index) => (
            <Link
              key={unit.slug}
              href={`/proyectos/${unit.slug}`}
              className="group block relative overflow-hidden rounded-xl"
            >
              <div className="relative aspect-[21/9] md:aspect-[3/1]">
                <Image
                  src={unit.image_url}
                  alt={unit.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="100vw"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

                {/* Hover red overlay */}
                <div className="absolute inset-0 bg-mg-red/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12 z-10">
                  <span className="text-mg-red text-sm uppercase tracking-widest font-medium mb-2">
                    0{index + 1}
                  </span>
                  <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl uppercase text-white mb-3">
                    {unit.name}
                  </h2>
                  <p className="text-zinc-300 text-base md:text-lg max-w-xl">
                    {unit.tagline}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm text-white uppercase tracking-wide font-bold group-hover:text-mg-red transition-colors">
                    Ver Proyecto
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
