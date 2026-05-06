"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface Step {
  title: string
  description: string
}

const STEPS: Step[] = [
  {
    title: "Diagnóstico",
    description:
      "Entendemos el proyecto: dónde estás, hacia dónde querés ir, qué necesita la marca.",
  },
  {
    title: "Estrategia",
    description:
      "Definimos sonido, narrativa visual y plan de lanzamiento. Calendario claro, sin humo.",
  },
  {
    title: "Producción",
    description:
      "Música, video, branding y eventos. Todo en casa, sin tercerizar lo que importa.",
  },
  {
    title: "Lanzamiento",
    description:
      "Distribución, prensa, redes y plataformas. Medimos lo que pasa después.",
  },
]

const stepVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const },
  }),
}

export default function ProcessSteps({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "relative bg-mg-black border-t border-white/10",
        className,
      )}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-10 py-16 md:py-24">
        <div className="grid grid-cols-12 gap-6 md:gap-10 items-end mb-10 md:mb-16">
          <div className="col-span-12 md:col-span-7">
            <div className="flex items-center gap-3 mb-4 md:mb-5">
              <span className="font-mono text-mg-red text-[11px] md:text-xs uppercase tracking-[0.25em] font-medium whitespace-nowrap">
                [ 04 / Proceso ]
              </span>
              <span className="h-px flex-1 bg-mg-red/40" />
            </div>
            <h2 className="font-heading uppercase text-white leading-[0.9] tracking-tight text-[clamp(2.5rem,7vw,5.5rem)]">
              Cómo trabajamos
            </h2>
          </div>
          <p className="col-span-12 md:col-span-5 text-zinc-400 text-sm md:text-base leading-relaxed md:pb-3">
            De primera reunión a lanzamiento. Sin pasos perdidos, sin
            promesas que después nadie cumple.
          </p>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
          {STEPS.map((step, i) => {
            const number = String(i + 1).padStart(2, "0")
            return (
              <motion.li
                key={step.title}
                custom={i}
                variants={stepVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="bg-mg-black p-6 md:p-8 flex flex-col gap-4 md:gap-6 relative"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-heading text-mg-red leading-none text-5xl md:text-6xl lg:text-7xl">
                    {number}
                  </span>
                  <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-white/40">
                    Paso {number}
                  </span>
                </div>
                <div className="space-y-2 md:space-y-3">
                  <h3 className="font-heading uppercase text-white text-2xl md:text-3xl leading-none tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-zinc-400 text-sm md:text-[15px] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
