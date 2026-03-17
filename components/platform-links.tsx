import { Instagram, Youtube, Music2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface PlatformLinksProps {
  links: {
    instagram?: string
    spotify?: string
    youtube?: string
    apple_music?: string
    tiktok?: string
  }
  className?: string
}

const PLATFORMS: {
  key: keyof PlatformLinksProps["links"]
  icon: React.ReactNode
  label: string
}[] = [
  { key: "instagram", icon: <Instagram size={18} />, label: "Instagram" },
  { key: "spotify", icon: <Music2 size={18} />, label: "Spotify" },
  { key: "youtube", icon: <Youtube size={18} />, label: "YouTube" },
  { key: "apple_music", icon: <Music2 size={18} />, label: "Apple Music" },
  { key: "tiktok", icon: <Music2 size={18} />, label: "TikTok" },
]

export default function PlatformLinks({ links, className }: PlatformLinksProps) {
  const available = PLATFORMS.filter(({ key }) => links[key])

  if (available.length === 0) return null

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {available.map(({ key, icon, label }) => (
        <a
          key={key}
          href={links[key]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="w-10 h-10 rounded-full border border-zinc-600 flex items-center justify-center text-zinc-400 hover:border-mg-red hover:text-white hover:bg-mg-red transition-colors"
        >
          {icon}
        </a>
      ))}
    </div>
  )
}
