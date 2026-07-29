"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "framer-motion"

interface AnimatedCounterProps {
  value: number
  className?: string
}

export default function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let current = 0
    const interval = setInterval(() => {
      current += 1
      setCount(current)
      if (current >= value) clearInterval(interval)
    }, 90)
    return () => clearInterval(interval)
  }, [inView, value])

  return (
    <span ref={ref} className={className}>
      {count}
    </span>
  )
}
