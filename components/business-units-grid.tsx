import Image from "next/image"
import Link from "next/link"
import type { BusinessUnit } from "@/lib/types"
import { cn } from "@/lib/utils"

interface BusinessUnitsGridProps {
  businessUnits: BusinessUnit[]
  className?: string
}

export default function BusinessUnitsGrid({ businessUnits, className }: BusinessUnitsGridProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
      {businessUnits.map((unit) => (
        <Link
          key={unit.slug}
          href={`/proyectos/${unit.slug}`}
          className="group relative block rounded-lg overflow-hidden aspect-[4/5]"
        >
          <Image
            src={unit.image_url}
            alt={unit.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Default gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-0" />

          {/* Red hover overlay */}
          <div className="absolute inset-0 bg-mg-red/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
            <h3 className="font-heading text-2xl uppercase text-white">
              {unit.name}
            </h3>
            <p className="text-zinc-300 text-sm mt-1 group-hover:text-white transition-colors">
              {unit.tagline}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
