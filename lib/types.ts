// Type definitions for MG Company Group website

export interface Agent {
  id: string
  name: string
  email: string
  photo_url?: string
  bio?: string
}

export type TileShape = 'square' | 'landscape' | 'portrait'

export interface Album {
  title: string
  year: number
  cover_url?: string
  spotify_url?: string
}

export interface Video {
  title: string
  youtube_embed_url: string
  thumbnail?: string
}

export interface Artist {
  id: string
  slug: string
  name: string
  bio: string
  bio_full?: string
  location?: string
  label?: string
  agent_id: string
  agent?: Agent
  photo_url: string
  hero_image_url?: string
  social_links: {
    instagram?: string
    spotify?: string
    youtube?: string
    soundcloud?: string
    apple_music?: string
    website?: string
    tiktok?: string
    facebook?: string
  }
  media: {
    audio?: string[]
    video?: string[]
  }
  featured: boolean
  shape?: TileShape
  discography?: Album[]
  videos?: Video[]
  spotify_embed?: string
  spotify_album_embed?: string
  stream_embed?: string
}

export interface ContactInfo {
  company_name: string
  address: {
    line1: string
    line2?: string
    city: string
    postal_code: string
    country: string
  }
  email: {
    general: string
    bookings?: string
    press?: string
  }
  phone?: string
  about: {
    short: string
    long: string
  }
  social: {
    instagram?: string
    youtube?: string
    spotify?: string
    tiktok?: string
  }
}

export interface BusinessUnit {
  slug: string
  name: string
  tagline: string
  description: string
  services: string[]
  image_url: string
}

export interface Episode {
  title: string
  youtube_embed_url: string
  duration?: string
  published_date?: string
  thumbnail?: string
}

export interface MGFlowShow {
  slug: string
  title: string
  description: string
  thumbnail: string
  category: string
  episodes: Episode[]
}

export interface GalleryItem {
  id: string
  type: 'photo' | 'video'
  url: string
  thumbnail?: string
  category: 'estudio' | 'en-vivo' | 'eventos' | 'bts'
  caption?: string
}

export interface TeamMember {
  name: string
  role: string
  photo_url: string
  bio?: string
}
