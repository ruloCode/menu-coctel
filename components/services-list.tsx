"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import type { BusinessUnit } from "@/lib/types"
import { cn } from "@/lib/utils"
import DiagonalArrow from "./diagonal-arrow"

interface ServicesListProps {
  businessUnits: BusinessUnit[]
  className?: string
}

interface UnitCopy {
  tagline: string
  pitch: string
}

const UNIT_COPY: Record<string, UnitCopy> = {
  "mg-music": {
    tagline: "Música que se queda",
    pitch:
      "Producimos, mezclamos y masterizamos en estudio propio. De la idea de un beat al máster listo para distribuir en plataformas.",
  },
  "mg-film": {
    tagline: "Imagen que cuenta historia",
    pitch:
      "Videoclips, documentales y contenido para redes con tratamiento cinematográfico. Dirección creativa incluida.",
  },
  "mg-up": {
    tagline: "Talento que despega",
    pitch:
      "Management 360°: estrategia digital, marca personal, booking y desarrollo artístico. Pensado para crecer rápido y en serio.",
  },
  "mg-live": {
    tagline: "Shows que pegan en escenario",
    pitch:
      "Producción técnica y creativa de conciertos, showcases y eventos corporativos. Sonido, escena, logística.",
  },
}

const STRIPE_LADDER = ["bg-mg-red", "bg-mg-red-80", "bg-mg-red-60", "bg-mg-red-40"]
const OPACITY_LABELS = ["100%", "80%", "60%", "40%"]

const rowVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
  }),
}

export default function ServicesList({ businessUnits, className }: ServicesListProps) {
  return (
    <ul
      className={cn(
        "border-t border-white/10",
        className,
      )}
    >
      {businessUnits.map((unit, i) => {
        const copy = UNIT_COPY[unit.slug] ?? {
          tagline: unit.tagline,
          pitch: unit.description,
        }
        const stripeClass = STRIPE_LADDER[i] ?? "bg-mg-red-20"
        const opacityLabel = OPACITY_LABELS[i] ?? "20%"
        const number = String(i + 1).padStart(2, "0")
        const visibleServices = unit.services.slice(0, 4)

        return (
          <motion.li
            key={unit.slug}
            custom={i}
            variants={rowVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="relative group border-b border-white/10"
          >
            <div className={cn("absolute top-0 left-0 right-0 h-px", stripeClass)} />

            <Link
              href={`/proyectos/${unit.slug}`}
              className="relative grid grid-cols-12 gap-6 md:gap-10 items-start py-8 md:py-12 hover:bg-white/[0.02] transition-colors"
            >
              <div className="col-span-12 md:col-span-2 flex items-baseline justify-between md:block">
                <span className="font-heading uppercase text-white leading-none text-6xl md:text-7xl lg:text-8xl">
                  {number}
                </span>
                <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-white/40 md:mt-3 md:block">
                  Cap. {opacityLabel}
                </span>
              </div>

              <div className="col-span-12 md:col-span-6 space-y-3 md:space-y-4">
                <div>
                  <h3 className="font-heading uppercase text-white leading-[0.95] tracking-tight text-3xl md:text-4xl lg:text-5xl">
                    {unit.name}
                  </h3>
                  <p className="font-mono text-mg-red text-xs md:text-sm uppercase tracking-[0.2em] mt-1.5 md:mt-2">
                    {copy.tagline}
                  </p>
                </div>
                <p className="text-zinc-300 text-sm md:text-base leading-relaxed max-w-md">
                  {copy.pitch}
                </p>
              </div>

              <div className="col-span-12 md:col-span-3 hidden md:block relative aspect-[4/5] overflow-hidden border border-white/10">
                <Image
                  src={unit.image_url}
                  alt={unit.name}
                  fill
                  sizes="20vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>

              <div className="col-span-12 md:col-span-1 flex md:flex-col md:items-end md:justify-between md:h-full gap-3">
                <ul className="md:hidden flex flex-wrap gap-2">
                  {visibleServices.map((service) => (
                    <li
                      key={service}
                      className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50 border border-white/15 px-2 py-1"
                    >
                      {service}
                    </li>
                  ))}
                </ul>

                <ul className="hidden md:flex flex-col gap-1.5 items-end">
                  {visibleServices.map((service) => (
                    <li
                      key={service}
                      className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50"
                    >
                      / {service}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-2 text-white/60 group-hover:text-mg-red transition-colors">
                  <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.25em] hidden md:inline">
                    Conocer
                  </span>
                  <DiagonalArrow size={22} strokeWidth={1.75} />
                </div>
              </div>
            </Link>
          </motion.li>
        )
      })}
    </ul>
  )
}
