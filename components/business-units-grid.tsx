"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import type { BusinessUnit } from "@/lib/types"
import { cn } from "@/lib/utils"
import { staggerContainerVariants, staggerItemVariants } from "./stagger-container"
import DiagonalArrow from "./diagonal-arrow"

interface BusinessUnitsGridProps {
  businessUnits: BusinessUnit[]
  className?: string
}

const OPACITY_LADDER = ["bg-mg-red", "bg-mg-red-80", "bg-mg-red-60", "bg-mg-red-40"]
const OPACITY_LABELS = ["100%", "80%", "60%", "40%"]

export default function BusinessUnitsGrid({ businessUnits, className }: BusinessUnitsGridProps) {
  return (
    <motion.div
      className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10", className)}
      variants={staggerContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {businessUnits.map((unit, i) => {
        const stripeClass = OPACITY_LADDER[i] ?? "bg-mg-red-20"
        const opacityLabel = OPACITY_LABELS[i] ?? "20%"
        const number = String(i + 1).padStart(2, "0")

        return (
          <motion.div
            key={unit.slug}
            variants={staggerItemVariants}
            className="bg-mg-black"
          >
            <Link
              href={`/proyectos/${unit.slug}`}
              className="group relative block overflow-hidden aspect-[4/5]"
            >
              <Image
                src={unit.image_url}
                alt={unit.name}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 transition-opacity duration-500 group-hover:opacity-60" />

              <div className={cn("absolute top-0 inset-x-0 h-2", stripeClass)} />

              <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-3 z-10">
                <span
                  className="font-heading text-white leading-none uppercase text-5xl md:text-6xl lg:text-7xl"
                  style={{ mixBlendMode: "difference" }}
                >
                  {number}
                </span>
                <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-white/70 mt-1 md:mt-2">
                  {opacityLabel}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 z-10 flex items-end justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-2xl md:text-3xl uppercase text-white leading-none tracking-tight">
                    {unit.name}
                  </h3>
                  <p className="font-mono text-mg-red text-[11px] md:text-xs uppercase tracking-[0.25em] mt-2 truncate">
                    {unit.tagline}
                  </p>
                </div>
                <DiagonalArrow
                  size={24}
                  strokeWidth={1.75}
                  className="text-white/70 group-hover:text-mg-red transition-colors shrink-0"
                />
              </div>
            </Link>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
