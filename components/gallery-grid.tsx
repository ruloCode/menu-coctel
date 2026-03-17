"use client"

import { useState } from "react"
import Image from "next/image"
import type { GalleryItem } from "@/lib/types"
import { cn } from "@/lib/utils"

interface GalleryGridProps {
  items: GalleryItem[]
  className?: string
}

const categories = [
  { value: "todos", label: "Todos" },
  { value: "estudio", label: "Estudio" },
  { value: "en-vivo", label: "En Vivo" },
  { value: "eventos", label: "Eventos" },
  { value: "bts", label: "BTS" },
]

export default function GalleryGrid({ items, className }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState("todos")
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)

  const filtered =
    activeCategory === "todos"
      ? items
      : items.filter((item) => item.category === activeCategory)

  return (
    <div className={cn("", className)}>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-medium uppercase tracking-wide transition-colors",
              activeCategory === cat.value
                ? "bg-mg-red text-white"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="break-inside-avoid group cursor-pointer"
            onClick={() => setSelectedItem(item)}
          >
            <div className="relative overflow-hidden rounded-lg">
              {item.type === "photo" ? (
                <Image
                  src={item.url}
                  alt={item.caption || ""}
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="relative aspect-video">
                  <Image
                    src={item.thumbnail || item.url}
                    alt={item.caption || ""}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-mg-red/90 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Caption overlay */}
              {item.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-sm">{item.caption}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl hover:text-zinc-400 transition-colors"
            onClick={() => setSelectedItem(null)}
          >
            &times;
          </button>
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            {selectedItem.type === "photo" ? (
              <Image
                src={selectedItem.url}
                alt={selectedItem.caption || ""}
                width={1200}
                height={800}
                className="w-full h-auto rounded-lg"
              />
            ) : (
              <div className="aspect-video">
                <iframe
                  src={selectedItem.url}
                  className="w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={selectedItem.caption || "Video"}
                />
              </div>
            )}
            {selectedItem.caption && (
              <p className="text-white text-center mt-4">{selectedItem.caption}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
