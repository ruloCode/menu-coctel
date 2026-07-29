"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface ScrollSpinProps {
  children: React.ReactNode
  range?: number
  className?: string
}

// Rota a los hijos según el avance del scroll (efecto "scratch" sobre los discos)
export default function ScrollSpin({ children, range = 45, className }: ScrollSpinProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const rotate = useTransform(scrollYProgress, [0, 1], [-range, range])

  return (
    <motion.div ref={ref} style={{ rotate }} className={cn(className)}>
      {children}
    </motion.div>
  )
}
