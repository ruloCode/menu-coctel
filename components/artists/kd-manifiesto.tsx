"use client"

import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"

/**
 * El parrafo se enciende palabra por palabra segun avanza el scroll: cada
 * palabra tiene su propia ventana dentro del progreso de la seccion. Es el
 * gesto que la EPK hace en papel con el contraste de la tipografia, traido al
 * eje del tiempo.
 */
function Parrafo({
  texto,
  progreso,
  desde,
  hasta,
  className,
}: {
  texto: string
  progreso: ReturnType<typeof useScroll>["scrollYProgress"]
  desde: number
  hasta: number
  className?: string
}) {
  const palabras = texto.split(" ")
  const tramo = (hasta - desde) / palabras.length

  return (
    <p className={className}>
      {palabras.map((palabra, i) => (
        <Palabra
          key={i}
          progreso={progreso}
          desde={desde + i * tramo}
          hasta={desde + (i + 1) * tramo}
        >
          {palabra}
        </Palabra>
      ))}
    </p>
  )
}

function Palabra({
  children,
  progreso,
  desde,
  hasta,
}: {
  children: string
  progreso: ReturnType<typeof useScroll>["scrollYProgress"]
  desde: number
  hasta: number
}) {
  const opacidad = useTransform(progreso, [desde, hasta], [0.16, 1])
  return (
    <>
      <motion.span style={{ opacity: opacidad }}>{children}</motion.span>{" "}
    </>
  )
}

const PARRAFOS = [
  "Karen Dayanna es una cantautora de Bogotá con una propuesta que combina el alma de la canción de autor con influencias del pop, el indie, el folclore y el soft rock, logrando un sonido fresco y sensible.",
  "A través de sus letras busca explorar los procesos de transformación, cargados de emoción y honestidad, invitando a quien escucha a reconocerse en ellas.",
  "Su obra trasciende a la memoria y el recuerdo, habita y crea alrededor de la levedad del ser: viste y se abandera en la piel de todo lo sensible, lo íntimo y lo humano.",
]

export default function KdManifiesto() {
  const ref = useRef<HTMLDivElement>(null)
  const reducido = useReducedMotion() ?? false

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.55"],
  })

  if (reducido) {
    return (
      <div ref={ref} className="space-y-6">
        {PARRAFOS.map((p, i) => (
          <p
            key={i}
            className="kd-contrast text-2xl leading-[1.45] text-white/90 md:text-[2.1rem]"
          >
            {p}
          </p>
        ))}
      </div>
    )
  }

  return (
    <div ref={ref} className="space-y-6">
      {PARRAFOS.map((p, i) => (
        <Parrafo
          key={i}
          texto={p}
          progreso={scrollYProgress}
          desde={i / PARRAFOS.length}
          hasta={(i + 1) / PARRAFOS.length}
          className="kd-contrast text-2xl leading-[1.45] text-white md:text-[2.1rem]"
        />
      ))}
    </div>
  )
}
