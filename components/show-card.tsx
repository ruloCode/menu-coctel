import Image from "next/image"
import Link from "next/link"
import type { MGFlowShow } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ShowCardProps {
  show: MGFlowShow
  className?: string
}

export default function ShowCard({ show, className }: ShowCardProps) {
  return (
    <Link
      href={`/mg-flow/${show.slug}`}
      className={cn("flex-none w-[240px] md:w-[280px] group block", className)}
    >
      <div className="relative aspect-video rounded-lg overflow-hidden">
        <Image
          src={show.thumbnail}
          alt={show.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Episode count badge */}
        <div className="absolute top-2 right-2 bg-mg-red text-white text-xs font-medium px-2 py-1 rounded">
          {show.episodes.length} {show.episodes.length === 1 ? "episodio" : "episodios"}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <h3 className="font-heading text-lg uppercase text-white mt-3 group-hover:text-mg-red transition-colors">
        {show.title}
      </h3>
    </Link>
  )
}
