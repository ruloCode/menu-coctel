"use client"

import { motion } from "framer-motion"
import AnimatedCounter from "./animated-counter"

interface StatItemProps {
  value: number
  label: string
  sub: string
  index: number
}

export default function StatItem({ value, label, sub, index }: StatItemProps) {
  const delay = index * 0.18

  return (
    <div className="relative pl-4">
      <motion.span
        className="absolute left-0 top-0 h-full w-1 origin-top bg-mg-red"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      />
      <AnimatedCounter
        value={value}
        delay={delay}
        className="font-heading text-[clamp(2.75rem,5vw,4rem)] leading-none text-mg-red"
      />
      <motion.p
        className="mt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-zinc-300"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, delay: delay + 0.3 }}
      >
        {label}
        <span className="block text-zinc-400">{sub}</span>
      </motion.p>
    </div>
  )
}
