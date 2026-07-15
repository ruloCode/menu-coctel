import { Facebook, Globe, Instagram, Music2, Youtube } from "lucide-react"
import { cn } from "@/lib/utils"

interface PlatformLinksProps {
  links: {
    instagram?: string
    spotify?: string
    youtube?: string
    soundcloud?: string
    apple_music?: string
    website?: string
    tiktok?: string
    facebook?: string
  }
  className?: string
}

function SpotifyIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  )
}

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  )
}

const PLATFORMS: {
  key: keyof PlatformLinksProps["links"]
  icon: React.ReactNode
  label: string
}[] = [
  { key: "spotify", icon: <SpotifyIcon />, label: "Spotify" },
  { key: "instagram", icon: <Instagram size={17} />, label: "Instagram" },
  { key: "youtube", icon: <Youtube size={18} />, label: "YouTube" },
  { key: "tiktok", icon: <TikTokIcon />, label: "TikTok" },
  { key: "apple_music", icon: <Music2 size={17} />, label: "Apple Music" },
  { key: "soundcloud", icon: <Music2 size={17} />, label: "SoundCloud" },
  { key: "facebook", icon: <Facebook size={17} />, label: "Facebook" },
  { key: "website", icon: <Globe size={17} />, label: "Sitio web" },
]

export default function PlatformLinks({ links, className }: PlatformLinksProps) {
  const available = PLATFORMS.filter(({ key }) => links[key])

  if (available.length === 0) return null

  return (
    <div className={cn("flex flex-wrap items-center gap-2.5", className)}>
      {available.map(({ key, icon, label }) => (
        <a
          key={key}
          href={links[key]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className="flex h-10 w-10 items-center justify-center border border-white/20 text-white/60 transition-colors duration-300 hover:border-mg-red hover:bg-mg-red hover:text-white"
        >
          {icon}
        </a>
      ))}
    </div>
  )
}
