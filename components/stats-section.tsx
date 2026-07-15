"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface Stat {
  value: string
  label: string
  note?: string
  accent?: boolean
}

const STATS: Stat[] = [
  {
    value: "5",
    label: "Artistas en roster activo",
    note: "Operación 2026",
    accent: true,
  },
  {
    value: "+50",
    label: "Producciones musicales lanzadas",
    note: "TODO: verificar",
  },
  {
    value: "+20",
    label: "Videoclips y documentales",
    note: "TODO: verificar",
  },
  {
    value: "+30",
    label: "Shows y eventos en vivo",
    note: "TODO: verificar",
  },
]

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const },
  }),
}

export default function StatsSection({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "relative bg-mg-black border-t border-white/10",
        className,
      )}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-10 py-16 md:py-24">
        <div className="flex items-center gap-3 mb-10 md:mb-14">
          <span className="font-mono text-mg-red text-[11px] md:text-xs uppercase tracking-[0.25em] font-medium whitespace-nowrap">
            [ 02 / Números ]
          </span>
          <span className="h-px flex-1 bg-mg-red/40" />
          <span className="font-mono text-white/40 text-[10px] md:text-[11px] uppercase tracking-[0.25em]">
            La operación en cifras
          </span>
        </div>

        <ul className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10">
          {STATS.map((stat, i) => (
            <motion.li
              key={stat.label}
              custom={i}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="bg-mg-black p-6 md:p-8 lg:p-10 flex flex-col gap-4"
            >
              <span
                className={cn(
                  "font-heading leading-[0.85] tracking-tight",
                  "text-[clamp(3.5rem,9vw,8rem)]",
                  stat.accent ? "text-mg-red" : "text-white",
                )}
              >
                {stat.value}
              </span>
              <div className="space-y-1.5">
                <p className="text-zinc-200 text-sm md:text-base leading-snug">
                  {stat.label}
                </p>
                {stat.note && (
                  <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-white/35">
                    {stat.note}
                  </p>
                )}
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
