// Type definitions for MG-Company website

export interface Agent {
  id: string
  name: string
  email: string
  photo_url?: string
  bio?: string
}

export type TileShape = 'square' | 'landscape' | 'portrait'

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
    audio?: string[] // Embed URLs
    video?: string[] // Embed URLs
  }
  featured: boolean
  shape?: TileShape // For masonry grid layout (square, landscape, portrait)
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
  about: {
    short: string
    long: string
  }
}
