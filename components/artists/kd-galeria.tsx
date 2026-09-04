"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"

export interface FotoGaleria {
  src: string
  alto: string
  pie: string
  /** Cuanto se adelanta o retrasa respecto al scroll, en px. */
  deriva: number
  /** Encuadre: los retratos verticales necesitan anclarse arriba. */
  foco?: string
}

/**
 * Cada foto se mueve a una velocidad distinta dentro de la columna. La
 * profundidad no viene de sombras sino de que unas suben antes que otras.
 */
function Foto({ foto, indice }: { foto: FotoGaleria; indice: number }) {
  const ref = useRef<HTMLElement>(null)
  const reducido = useReducedMotion() ?? false

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], [foto.deriva, -foto.deriva])

  return (
    <motion.figure
      ref={ref}
      style={reducido ? undefined : { y }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1, delay: (indice % 3) * 0.1 }}
      className="group relative"
    >
      <div
        className={`kd-grain relative overflow-hidden rounded-xl border border-white/10 bg-[#0b0b12] ${foto.alto}`}
      >
        <Image
          src={foto.src}
          alt={foto.pie}
          fill
          sizes="(max-width: 768px) 90vw, 30vw"
          className={`object-cover saturate-[0.55] brightness-110 transition-[filter,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05] group-hover:brightness-100 group-hover:saturate-100 ${foto.foco ?? ""}`}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050509]/60 via-transparent to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-40" />
      </div>
      <figcaption className="mt-3 flex items-baseline gap-3">
        <span className="font-mono text-[10px] text-[#a78bfa]">
          {String(indice + 1).padStart(2, "0")}
        </span>
        <span className="kd-contrast text-sm text-white/50">{foto.pie}</span>
      </figcaption>
    </motion.figure>
  )
}

export default function KdGaleria({ fotos }: { fotos: FotoGaleria[] }) {
  // Tres columnas en desktop, repartidas en zigzag para que el parallax no
  // deje huecos alineados.
  const columnas: FotoGaleria[][] = [[], [], []]
  fotos.forEach((f, i) => columnas[i % 3].push(f))

  let contador = -1

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
      {columnas.map((col, c) => (
        <div key={c} className={`flex flex-col gap-6 md:gap-8 ${c === 1 ? "md:mt-16" : ""} ${c === 2 ? "md:mt-8" : ""}`}>
          {col.map((foto) => {
            contador += 1
            return <Foto key={foto.src} foto={foto} indice={contador} />
          })}
        </div>
      ))}
    </div>
  )
}
