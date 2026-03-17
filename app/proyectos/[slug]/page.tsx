import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getBusinessUnitBySlug, getAllBusinessUnits } from "@/lib/mock-data"

interface ProyectoPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const units = getAllBusinessUnits()
  return units.map((unit) => ({
    slug: unit.slug,
  }))
}

export async function generateMetadata({ params }: ProyectoPageProps) {
  const { slug } = await params
  const unit = getBusinessUnitBySlug(slug)

  if (!unit) {
    return {
      title: "Proyecto No Encontrado | MG Company Group",
    }
  }

  return {
    title: `${unit.name} | MG Company Group`,
    description: unit.tagline,
  }
}

export default async function ProyectoPage({ params }: ProyectoPageProps) {
  const { slug } = await params
  const unit = getBusinessUnitBySlug(slug)

  if (!unit) {
    notFound()
  }

  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-end overflow-hidden">
        <Image
          src={unit.image_url}
          alt={unit.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="relative z-10 container mx-auto px-4 pb-12">
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl uppercase text-white">
            {unit.name}
          </h1>
          <p className="text-xl md:text-2xl text-zinc-300 mt-3 max-w-2xl">
            {unit.tagline}
          </p>
        </div>
      </section>

      {/* Description */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl">
          <p className="text-lg md:text-xl text-zinc-300 leading-relaxed">
            {unit.description}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="font-heading text-3xl md:text-4xl uppercase tracking-tight mb-10">
          Servicios
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {unit.services.map((service, index) => (
            <div
              key={index}
              className="bg-zinc-900/50 border border-white/10 rounded-lg p-6 hover:border-mg-red/50 transition-colors group"
            >
              <span className="text-mg-red font-heading text-2xl">0{index + 1}</span>
              <h3 className="text-lg font-bold mt-3 group-hover:text-mg-red transition-colors">
                {service}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-8 md:p-12 text-center">
          <h2 className="font-heading text-3xl md:text-4xl uppercase tracking-tight mb-4">
            Interesado en {unit.name}?
          </h2>
          <p className="text-zinc-400 text-lg mb-8 max-w-2xl mx-auto">
            Contactanos para conocer como podemos trabajar juntos y llevar tu proyecto al siguiente nivel.
          </p>
          <Link
            href="/contacto"
            className="inline-block px-10 py-4 bg-mg-red text-white rounded-full text-sm uppercase font-bold hover:bg-red-700 transition-all"
          >
            Contactar
          </Link>
        </div>
      </section>

      {/* Back Link */}
      <section className="container mx-auto px-4 py-8">
        <Link
          href="/proyectos"
          className="inline-flex items-center gap-2 text-sm uppercase font-bold hover:text-mg-red transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Volver a Proyectos
        </Link>
      </section>
    </>
  )
}
