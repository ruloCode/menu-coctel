"use client"

import { motion } from "framer-motion"
import type { Artist } from "@/lib/types"
import ArtistCard from "./artist-card"

interface MasonryGridProps {
  artists: Artist[]
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    }
  },
}

export default function MasonryGrid({ artists }: MasonryGridProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="masonry-grid"
    >
      {artists.map((artist, index) => (
        <motion.div
          key={artist.id}
          variants={item}
          className={`tile-shape-${artist.shape || 'square'}`}
        >
          <ArtistCard artist={artist} priority={index < 6} shape={artist.shape} index={index} />
        </motion.div>
      ))}
    </motion.div>
  )
}
