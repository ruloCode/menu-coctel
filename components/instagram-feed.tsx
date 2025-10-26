"use client"

import Image from "next/image"
import { Instagram } from "lucide-react"

// Mock Instagram posts (placeholder data)
const mockPosts = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop",
    url: "https://instagram.com/mgcompany",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    url: "https://instagram.com/mgcompany",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop",
    url: "https://instagram.com/mgcompany",
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1501612780327-45045538702b?w=400&h=400&fit=crop",
    url: "https://instagram.com/mgcompany",
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop",
    url: "https://instagram.com/mgcompany",
  },
]

export default function InstagramFeed() {
  return (
    <section className="border-t border-white/10 py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <Instagram size={28} className="text-white" />
          <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight">Latest from Instagram</h3>
        </div>

        {/* Horizontal scrolling container with custom scrollbar */}
        <div className="overflow-x-auto custom-scrollbar -mx-4 px-4 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
          <div className="flex gap-4 md:gap-6 pb-4">
            {mockPosts.map((post, index) => (
              <a
                key={post.id}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 relative overflow-hidden rounded-lg group cursor-pointer"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <Image
                  src={post.image}
                  alt="Instagram post"
                  fill
                  className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                  sizes="(max-width: 768px) 256px, (max-width: 1024px) 320px, 384px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                  <Instagram className="text-white transform scale-90 group-hover:scale-100 transition-transform duration-300" size={48} />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Scroll hint - only visible on mobile */}
        <div className="mt-4 text-center text-sm text-zinc-500 md:hidden">
          ← Scroll horizontally to see more →
        </div>
      </div>
    </section>
  )
}
