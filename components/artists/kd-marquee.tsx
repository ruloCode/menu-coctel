"use client"

import { useRef } from "react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion"

/**
 * Cinta de titular que se desplaza con el scroll en lugar de con un temporizador:
 * el texto avanza mientras la pagina baja y retrocede si el lector sube. El
 * contenido se repite tres veces para que nunca se vea el borde.
 */
export default function KdMarquee({
  texto,
  className = "",
}: {
  texto: string
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reducido = useReducedMotion() ?? false

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const x = useSpring(useTransform(scrollYProgress, [0, 1], ["8%", "-38%"]), {
    stiffness: 60,
    damping: 24,
    mass: 0.5,
  })

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        style={reducido ? undefined : { x }}
        className="flex w-max items-center gap-10 whitespace-nowrap"
        aria-hidden="true"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="flex items-center gap-10 font-heading uppercase leading-none tracking-tight text-[clamp(3.5rem,11vw,9rem)]"
          >
            <span className={i === 1 ? "text-white" : "text-white/10"}>
              {texto}
            </span>
            <span className="inline-block h-[0.12em] w-[0.6em] shrink-0 bg-mg-red align-middle" />
          </span>
        ))}
      </motion.div>
      <span className="sr-only">{texto}</span>
    </div>
  )
}
