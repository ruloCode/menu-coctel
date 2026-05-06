"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface Testimonial {
  quote: string
  author: string
  role: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Llegué con un demo y un sueño. Salí con un EP, un videoclip y un equipo que entendió de qué iba mi proyecto.",
    author: "Artista 01",
    role: "Roster MG",
  },
  {
    quote:
      "Producción seria de gente que ama la música. Pocas veces ves los dos al mismo tiempo.",
    author: "Manager invitado",
    role: "Sello aliado",
  },
  {
    quote:
      "El detalle en post-producción y la dirección creativa marcaron la diferencia para nosotros.",
    author: "Marca aliada",
    role: "Campaña 2025",
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] as const },
  }),
}

export default function Testimonials({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "relative bg-mg-black border-t border-white/10",
        className,
      )}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-10 py-16 md:py-24">
        <div className="grid grid-cols-12 gap-6 md:gap-10 items-end mb-10 md:mb-14">
          <div className="col-span-12 md:col-span-7">
            <div className="flex items-center gap-3 mb-4 md:mb-5">
              <span className="font-mono text-mg-red text-[11px] md:text-xs uppercase tracking-[0.25em] font-medium whitespace-nowrap">
                [ 06 / Voces ]
              </span>
              <span className="h-px flex-1 bg-mg-red/40" />
            </div>
            <h2 className="font-heading uppercase text-white leading-[0.9] tracking-tight text-[clamp(2.5rem,6.5vw,5rem)]">
              Lo que dicen los que trabajan con nosotros
            </h2>
          </div>
          <p className="col-span-12 md:col-span-5 text-zinc-400 text-sm md:text-base leading-relaxed md:pb-3">
            Sin filtros ni copy de agencia. Lo que llega después de la
            primera entrega.
          </p>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
          {TESTIMONIALS.map((t, i) => (
            <motion.li
              key={t.author}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="bg-mg-black p-6 md:p-8 lg:p-10 flex flex-col justify-between gap-8 min-h-[280px]"
            >
              <div>
                <span className="text-mg-red text-2xl leading-none block mb-4">
                  &#10022;
                </span>
                <p className="text-white text-base md:text-lg leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
              <div className="border-t border-white/10 pt-4 space-y-1">
                <p className="font-heading uppercase text-white text-xl md:text-2xl leading-none tracking-tight">
                  {t.author}
                </p>
                <p className="font-mono text-mg-red text-[10px] md:text-[11px] uppercase tracking-[0.25em]">
                  {t.role}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>

        <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-white/30 mt-6">
          {/* TODO: reemplazar con testimonios reales */}
          Testimonios placeholder · pendiente reemplazar con voces reales
        </p>
      </div>
    </section>
  )
}
