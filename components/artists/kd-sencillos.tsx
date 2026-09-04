"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion"
import DiagonalArrow from "@/components/diagonal-arrow"

export interface Sencillo {
  titulo: string
  orden: string
  cover: string
  texto: string
  enlace: string
  /** ID de la pista en Spotify, para el reproductor incrustado. */
  spotify: string
}

const MUELLE = { stiffness: 150, damping: 18, mass: 0.6 }

/**
 * Tarjeta que se inclina siguiendo al puntero. El giro sale de la posicion
 * relativa dentro de la tarjeta (0..1, recentrada a -0.5..0.5) y pasa por
 * muelles para que no se sienta enganchada al raton. El brillo especular usa
 * esas mismas coordenadas, asi la luz cae donde esta el cursor.
 */
function TarjetaSencillo({ sencillo, indice }: { sencillo: Sencillo; indice: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const reducido = useReducedMotion() ?? false
  const [activa, setActiva] = useState(false)

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const inclinacionX = useMotionValue(0)
  const inclinacionY = useMotionValue(0)

  const rotX = useSpring(inclinacionX, MUELLE)
  const rotY = useSpring(inclinacionY, MUELLE)

  const luzX = useTransform(useSpring(px, MUELLE), (v) => `${v * 100}%`)
  const luzY = useTransform(useSpring(py, MUELLE), (v) => `${v * 100}%`)
  const luz = useMotionTemplate`radial-gradient(circle at ${luzX} ${luzY}, rgba(203,182,230,0.30), transparent 55%)`

  function alMover(e: React.PointerEvent<HTMLDivElement>) {
    if (reducido || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    px.set(x)
    py.set(y)
    inclinacionY.set((x - 0.5) * 14)
    inclinacionX.set((0.5 - y) * 14)
  }

  function alSalir() {
    setActiva(false)
    inclinacionX.set(0)
    inclinacionY.set(0)
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, delay: indice * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="group"
      style={{ perspective: 1200 }}
    >
      <motion.div
        ref={ref}
        onPointerMove={alMover}
        onPointerEnter={() => setActiva(true)}
        onPointerLeave={alSalir}
        style={
          reducido
            ? undefined
            : { rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }
        }
        className="relative"
      >
        <a
          href={sencillo.enlace}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a78bfa] focus-visible:ring-offset-4 focus-visible:ring-offset-[#050509]"
        >
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0b0b12] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]">
            <Image
              src={sencillo.cover}
              alt={`Carátula de ${sencillo.titulo}`}
              fill
              sizes="(max-width: 768px) 92vw, 42vw"
              className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
            />

            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 transition-opacity duration-500"
              style={reducido ? undefined : { background: luz }}
              animate={{ opacity: activa ? 1 : 0 }}
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050509]/70 via-transparent to-transparent" />

            <span className="kd-pill pointer-events-none absolute left-4 top-4 bg-[#050509]/55 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-white/75 backdrop-blur-sm">
              {sencillo.orden}
            </span>

            <span
              className="pointer-events-none absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-[#050509]/60 text-white opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:border-[#a78bfa] group-hover:opacity-100"
              style={reducido ? undefined : { transform: "translateZ(40px)" }}
            >
              <DiagonalArrow size={20} strokeWidth={1.75} />
            </span>
          </div>

          <h3 className="mt-6 font-heading text-4xl uppercase leading-none tracking-tight text-white transition-colors duration-500 group-hover:text-[#cbb6e6] md:text-5xl">
            {sencillo.titulo}
          </h3>
        </a>

      </motion.div>

      <p className="kd-contrast mt-4 max-w-md text-base leading-relaxed text-white/60 md:text-lg">
        {sencillo.texto}
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border border-white/10">
        <iframe
          src={`https://open.spotify.com/embed/track/${sencillo.spotify}?utm_source=generator&theme=0`}
          width="100%"
          height="152"
          loading="lazy"
          title={`${sencillo.titulo} en Spotify`}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          className="block"
        />
      </div>

      <a
        href={sencillo.enlace}
        target="_blank"
        rel="noopener noreferrer"
        className="kd-link-underline mt-5 inline-block font-mono text-[11px] uppercase tracking-[0.28em] text-[#a78bfa]"
      >
        Todas las plataformas
      </a>
    </motion.article>
  )
}

export default function KdSencillos({ sencillos }: { sencillos: Sencillo[] }) {
  return (
    <div className="grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-10">
      {sencillos.map((s, i) => (
        <TarjetaSencillo key={s.titulo} sencillo={s} indice={i} />
      ))}
    </div>
  )
}
