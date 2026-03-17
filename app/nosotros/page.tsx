import ScrollingText from "@/components/scrolling-text"
import Image from "next/image"
import Link from "next/link"
import { mockContactInfo, getAllTeamMembers } from "@/lib/mock-data"
import { Target, Users, Globe2, TrendingUp } from "lucide-react"

export const metadata = {
  title: "Nosotros | MG Company Group",
  description: "Conoce la historia, mision y equipo de MG Company Group. Productora artistica integral que impulsa el talento latino.",
}

export default function NosotrosPage() {
  const contact = mockContactInfo
  const teamMembers = getAllTeamMembers()

  return (
    <>
      {/* Hero Section */}
      <section className="py-12 md:py-20 overflow-hidden border-b border-white/10">
        <ScrollingText text="Nosotros" />
      </section>

      {/* Mission / Vision */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl uppercase tracking-tight mb-6 text-mg-red">
              Nuestra Mision
            </h2>
            <p className="text-lg text-zinc-300 leading-relaxed">
              {contact.about.short}
            </p>
          </div>
          <div>
            <h2 className="font-heading text-3xl md:text-4xl uppercase tracking-tight mb-6 text-mg-red">
              Nuestra Vision
            </h2>
            <p className="text-lg text-zinc-300 leading-relaxed">
              Ser la productora artistica de referencia en Latinoamerica, llevando el talento latino al mundo
              a traves de un ecosistema integral que abarca musica, cine, eventos y desarrollo de artistas.
            </p>
          </div>
        </div>
      </section>

      {/* Company History */}
      <section className="bg-zinc-900/50 border-y border-white/10">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl uppercase tracking-tight mb-8">
              Nuestra Historia
            </h2>
            <p className="text-xl text-zinc-400 leading-relaxed">
              {contact.about.long}
            </p>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="font-heading text-3xl md:text-4xl uppercase tracking-tight mb-12 text-center">
          Nuestro Equipo
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="bg-zinc-900/50 border border-white/10 rounded-lg overflow-hidden group hover:border-mg-red/50 transition-colors"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={member.photo_url}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="font-heading text-xl uppercase">{member.name}</h3>
                <p className="text-mg-red text-sm font-medium mt-1">{member.role}</p>
                {member.bio && (
                  <p className="text-zinc-400 text-sm mt-3 leading-relaxed">{member.bio}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="font-heading text-3xl md:text-4xl uppercase tracking-tight mb-12 text-center">
          Nuestros Valores
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-8">
            <div className="w-12 h-12 bg-mg-red rounded-full flex items-center justify-center mb-6">
              <Users className="text-white" size={24} />
            </div>
            <h3 className="font-heading text-2xl uppercase tracking-tight mb-4">
              El Artista Primero
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              Ponemos a nuestros artistas en el centro de todo lo que hacemos. Su exito es nuestro exito,
              y estamos comprometidos a brindar apoyo personalizado que los ayude a alcanzar sus metas.
            </p>
          </div>

          <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-8">
            <div className="w-12 h-12 bg-mg-red rounded-full flex items-center justify-center mb-6">
              <Globe2 className="text-white" size={24} />
            </div>
            <h3 className="font-heading text-2xl uppercase tracking-tight mb-4">
              Alcance Global
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              Con alianzas en toda Latinoamerica, Europa y Norteamerica, conectamos a nuestros artistas
              con oportunidades a nivel mundial sin perder sus raices.
            </p>
          </div>

          <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-8">
            <div className="w-12 h-12 bg-mg-red rounded-full flex items-center justify-center mb-6">
              <Target className="text-white" size={24} />
            </div>
            <h3 className="font-heading text-2xl uppercase tracking-tight mb-4">
              Vision Estrategica
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              No solo hacemos booking — construimos carreras. Nuestro equipo brinda orientacion estrategica,
              desarrollo artistico y planificacion a largo plazo para asegurar un exito sostenible.
            </p>
          </div>

          <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-8">
            <div className="w-12 h-12 bg-mg-red rounded-full flex items-center justify-center mb-6">
              <TrendingUp className="text-white" size={24} />
            </div>
            <h3 className="font-heading text-2xl uppercase tracking-tight mb-4">
              Innovacion
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              Adoptamos nuevas tecnologias y tendencias de la industria para mantenernos a la vanguardia,
              asegurando que nuestros artistas tengan acceso a las mejores oportunidades en el panorama musical.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-4xl md:text-6xl uppercase tracking-tight mb-8">
            Trabajemos Juntos
          </h2>
          <p className="text-xl text-zinc-400 mb-12">
            Ya seas un artista buscando representacion o un promotor buscando talento excepcional,
            nos encantaria saber de ti.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contacto"
              className="px-8 py-4 bg-mg-red text-white rounded-full text-sm uppercase font-bold hover:bg-red-700 transition-all"
            >
              Contactanos
            </Link>
            <Link
              href="/artistas"
              className="px-8 py-4 border border-white rounded-full text-sm uppercase font-bold hover:bg-white hover:text-black transition-all"
            >
              Ver Nuestros Artistas
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
