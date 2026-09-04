"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"

export interface Cifra {
  valor: number
  /** Sufijo literal del press kit: "+", "K+" */
  sufijo: string
  /** Decimales a mostrar (21,5K -> 1) */
  decimales?: number
  etiqueta: string
  fuentes: string
}

function Contador({ cifra, indice }: { cifra: Cifra; indice: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const aLaVista = useInView(ref, { once: true, amount: 0.5 })
  const reducido = useReducedMotion() ?? false
  const [valor, setValor] = useState(reducido ? cifra.valor : 0)

  useEffect(() => {
    if (!aLaVista || reducido) {
      if (reducido) setValor(cifra.valor)
      return
    }
    const duracion = 1500
    const retraso = indice * 140
    let raf = 0
    let inicio = 0

    const paso = (t: number) => {
      if (!inicio) inicio = t
      const transcurrido = t - inicio - retraso
      if (transcurrido < 0) {
        raf = requestAnimationFrame(paso)
        return
      }
      const p = Math.min(transcurrido / duracion, 1)
      // easeOutExpo: arranca rapido y se posa, como un contador que frena
      const e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p)
      setValor(cifra.valor * e)
      if (p < 1) raf = requestAnimationFrame(paso)
    }

    raf = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(raf)
  }, [aLaVista, reducido, cifra.valor, indice])

  const mostrado = valor.toLocaleString("es-CO", {
    minimumFractionDigits: cifra.decimales ?? 0,
    maximumFractionDigits: cifra.decimales ?? 0,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, delay: indice * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="border-t border-white/12 pt-6"
    >
      <p className="kd-contrast text-sm text-white/45">{cifra.fuentes}</p>
      <p className="mt-3 flex items-baseline gap-1 font-heading text-[clamp(3rem,7vw,5.5rem)] leading-none tracking-tight text-white">
        <span className="mr-2 text-[0.45em] text-[#a78bfa]" aria-hidden="true">
          ↗
        </span>
        {mostrado}
        <span className="text-[#a78bfa]">{cifra.sufijo}</span>
      </p>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.3em] text-white/55">
        {cifra.etiqueta}
      </p>
    </motion.div>
  )
}

export default function KdCifras({ cifras }: { cifras: Cifra[] }) {
  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
      {cifras.map((c, i) => (
        <Contador key={c.etiqueta} cifra={c} indice={i} />
      ))}
    </div>
  )
}
