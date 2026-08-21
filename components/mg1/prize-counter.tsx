"use client"

import { useEffect, useRef, useState } from "react"
import { animate, motion, useInView } from "framer-motion"

interface PrizeCounterProps {
  value: number
  duration?: number
  className?: string
}

// Formateo fijo es-CO para que SSR y cliente coincidan sin importar el locale del navegador.
const fmt = new Intl.NumberFormat("es-CO")

export default function PrizeCounter({
  value,
  duration = 1.8,
  className,
}: PrizeCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setCount(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, value, duration])

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={inView ? { opacity: 1, scale: 1 } : undefined}
      transition={{ type: "spring", stiffness: 180, damping: 20 }}
    >
      <span className="align-super text-[0.35em]">$</span>
      <span className="tabular-nums">{fmt.format(count)}</span>
    </motion.span>
  )
}
