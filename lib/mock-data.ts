import type { Agent, Artist, ContactInfo } from "./types"

// Mock Agents
export const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Sofia Martinez",
    email: "sofia@mg-company.com",
    bio: "Senior booking agent specializing in electronic and urban music.",
  },
  {
    id: "2",
    name: "Carlos Rivera",
    email: "carlos@mg-company.com",
    bio: "Booking agent focused on Latin and international artists.",
  },
  {
    id: "3",
    name: "Ana Gutierrez",
    email: "ana@mg-company.com",
    bio: "Agent specializing in emerging talent and festival bookings.",
  },
]

// Mock Artists
export const mockArtists: Artist[] = [
  {
    id: "1",
    slug: "luna-morales",
    name: "Luna Morales",
    bio: "Luna Morales is a genre-defying electronic producer and DJ from Medellín, blending traditional Colombian rhythms with cutting-edge techno and house music.",
    bio_full: "Luna Morales emerged from Medellín's underground music scene in 2019, quickly gaining recognition for her innovative sound that bridges the gap between traditional cumbia, champeta, and modern electronic music. Her debut album 'Noche Eléctrica' topped charts across Latin America and earned critical acclaim internationally. Luna has performed at major festivals including Coachella, Primavera Sound, and Sónar, and has collaborated with artists like Bomba Estéreo and Nicola Cruz. Her energetic live performances combine live percussion with electronic production, creating an immersive experience that celebrates Colombian culture while pushing musical boundaries.",
    location: "Medellín, Colombia",
    label: "Palenque Records",
    agent_id: "1",
    photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1000&fit=crop",
    hero_image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=800&fit=crop",
    social_links: {
      instagram: "https://instagram.com/lunamoralesmusic",
      spotify: "https://open.spotify.com/artist/example",
      soundcloud: "https://soundcloud.com/lunamorales",
      youtube: "https://youtube.com/@lunamorales",
    },
    media: {
      audio: ["https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1234567890"],
      video: ["https://www.youtube.com/embed/dQw4w9WgXcQ"],
    },
    featured: true,
    shape: "landscape",
  },
  {
    id: "2",
    slug: "santos-collective",
    name: "Santos Collective",
    bio: "Santos Collective is a five-piece band from Bogotá creating a unique fusion of jazz, cumbia, and psychedelic rock. Known for their explosive live shows and socially conscious lyrics.",
    bio_full: "Formed in 2017, Santos Collective has become one of Colombia's most exciting live acts. The band consists of five musicians from diverse musical backgrounds who came together with a shared vision of creating music that honors Colombian musical traditions while exploring new sonic territories. Their sound draws from jazz improvisation, cumbia rhythms, and psychedelic rock textures, creating an entirely unique musical experience. Their sophomore album 'Río Dorado' was nominated for a Latin Grammy and has been praised by critics as 'a revolutionary reimagining of Colombian music.' The band has toured extensively across South America and Europe, bringing their high-energy performances to audiences worldwide.",
    location: "Bogotá, Colombia",
    label: "Independent",
    agent_id: "2",
    photo_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=1000&fit=crop",
    hero_image_url: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&h=800&fit=crop",
    social_links: {
      instagram: "https://instagram.com/santoscollective",
      spotify: "https://open.spotify.com/artist/example2",
      youtube: "https://youtube.com/@santoscollective",
      website: "https://santoscollective.co",
    },
    media: {
      audio: [],
      video: ["https://www.youtube.com/embed/example2"],
    },
    featured: true,
    shape: "portrait",
  },
  {
    id: "3",
    slug: "dj-phoenix",
    name: "DJ Phoenix",
    bio: "Rising star in the Latin trap and reggaeton scene. DJ Phoenix has become a fixture in Bogotá's nightlife, known for his high-energy sets and genre-bending mixes.",
    bio_full: "DJ Phoenix started his career at age 16 in the clubs of Bogotá, quickly developing a reputation for his technical skills and ability to read a crowd. His unique style blends reggaeton, trap, house, and traditional Colombian music, creating sets that are both nostalgic and forward-thinking. Phoenix has been a resident DJ at some of Bogotá's most prestigious clubs and has shared the stage with international acts like Bad Bunny, J Balvin, and Bizarrap. He recently launched his own record label 'Phoenix Rising' to support emerging Latin urban artists.",
    location: "Bogotá, Colombia",
    agent_id: "1",
    photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop",
    hero_image_url: "https://images.unsplash.com/photo-1571266028243-d220fec7fe85?w=1200&h=800&fit=crop",
    social_links: {
      instagram: "https://instagram.com/djphoenixco",
      spotify: "https://open.spotify.com/artist/example3",
      soundcloud: "https://soundcloud.com/djphoenix",
      tiktok: "https://tiktok.com/@djphoenix",
    },
    media: {
      audio: ["https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/example"],
      video: [],
    },
    featured: false,
    shape: "square",
  },
  {
    id: "4",
    slug: "valeria-sound",
    name: "Valeria Sound",
    bio: "Singer-songwriter blending indie pop with traditional Colombian folk music. Her ethereal voice and poetic lyrics have captivated audiences across Latin America.",
    location: "Cali, Colombia",
    label: "Llorona Records",
    agent_id: "3",
    photo_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=1000&fit=crop",
    hero_image_url: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1200&h=800&fit=crop",
    social_links: {
      instagram: "https://instagram.com/valeriasound",
      spotify: "https://open.spotify.com/artist/example4",
      youtube: "https://youtube.com/@valeriasound",
      apple_music: "https://music.apple.com/artist/valeria-sound",
    },
    media: {
      audio: [],
      video: ["https://www.youtube.com/embed/example4"],
    },
    featured: false,
    shape: "portrait",
  },
  {
    id: "5",
    slug: "el-ritmo",
    name: "El Ritmo",
    bio: "Veteran salsa and tropical music ensemble bringing classic Colombian rhythms to modern audiences. With over 20 years of experience, they remain at the forefront of traditional music.",
    location: "Barranquilla, Colombia",
    label: "Tropical Records",
    agent_id: "2",
    photo_url: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=800&h=1000&fit=crop",
    hero_image_url: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200&h=800&fit=crop",
    social_links: {
      instagram: "https://instagram.com/elritmooficial",
      spotify: "https://open.spotify.com/artist/example5",
      facebook: "https://facebook.com/elritmomusic",
      website: "https://elritmo.com.co",
    },
    media: {
      audio: [],
      video: [],
    },
    featured: false,
    shape: "square",
  },
  {
    id: "6",
    slug: "neon-nights",
    name: "Neon Nights",
    bio: "Indie rock band with synthwave influences creating atmospheric soundscapes. Their debut album 'Electric Dreams' gained cult following across Colombia and beyond.",
    location: "Medellín, Colombia",
    label: "Independent",
    agent_id: "3",
    photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=1000&fit=crop",
    hero_image_url: "https://images.unsplash.com/photo-1501612780327-45045538702b?w=1200&h=800&fit=crop",
    social_links: {
      instagram: "https://instagram.com/neonnightsband",
      spotify: "https://open.spotify.com/artist/example6",
      youtube: "https://youtube.com/@neonnights",
      website: "https://neonnights.band",
    },
    media: {
      audio: [],
      video: [],
    },
    featured: true,
    shape: "landscape",
  },
  {
    id: "7",
    slug: "maria-del-mar",
    name: "María del Mar",
    bio: "Afro-Colombian vocalist and percussionist blending ancestral rhythms with contemporary electronic production.",
    location: "Cartagena, Colombia",
    label: "Ancestral Sounds",
    agent_id: "1",
    photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop",
    hero_image_url: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=1200&h=800&fit=crop",
    social_links: {
      instagram: "https://instagram.com/mariadelmarmusic",
      spotify: "https://open.spotify.com/artist/example7",
    },
    media: {
      audio: [],
      video: [],
    },
    featured: false,
    shape: "square",
  },
  {
    id: "8",
    slug: "bass-collective",
    name: "Bass Collective",
    bio: "Underground bass music duo pushing the boundaries of dubstep and drum & bass with Colombian influences.",
    location: "Bogotá, Colombia",
    agent_id: "1",
    photo_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1000&fit=crop",
    hero_image_url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=800&fit=crop",
    social_links: {
      instagram: "https://instagram.com/basscollective",
      spotify: "https://open.spotify.com/artist/example8",
      soundcloud: "https://soundcloud.com/basscollective",
    },
    media: {
      audio: ["https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/example"],
      video: [],
    },
    featured: false,
    shape: "portrait",
  },
  {
    id: "9",
    slug: "camila-reyes",
    name: "Camila Reyes",
    bio: "Alternative R&B artist with a unique voice that blends soul, jazz, and urban music from Cali's vibrant scene.",
    location: "Cali, Colombia",
    label: "Neo Soul Records",
    agent_id: "2",
    photo_url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1000&fit=crop",
    hero_image_url: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&h=800&fit=crop",
    social_links: {
      instagram: "https://instagram.com/camilareyes",
      spotify: "https://open.spotify.com/artist/example9",
      youtube: "https://youtube.com/@camilareyes",
    },
    media: {
      audio: [],
      video: ["https://www.youtube.com/embed/example9"],
    },
    featured: false,
    shape: "landscape",
  },
  {
    id: "10",
    slug: "tropico-band",
    name: "Trópico Band",
    bio: "Modern tropical music ensemble reinventing cumbia, porro, and champeta for the 21st century.",
    location: "Barranquilla, Colombia",
    label: "Coastal Records",
    agent_id: "2",
    photo_url: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=800&h=1000&fit=crop",
    hero_image_url: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200&h=800&fit=crop",
    social_links: {
      instagram: "https://instagram.com/tropicoband",
      spotify: "https://open.spotify.com/artist/example10",
      facebook: "https://facebook.com/tropicoband",
    },
    media: {
      audio: [],
      video: [],
    },
    featured: false,
    shape: "square",
  },
  {
    id: "11",
    slug: "diego-underground",
    name: "Diego Underground",
    bio: "Techno producer and live performer known for hypnotic sets that blend industrial sounds with Latin rhythms.",
    location: "Medellín, Colombia",
    agent_id: "3",
    photo_url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&h=1000&fit=crop",
    hero_image_url: "https://images.unsplash.com/photo-1571266028243-d220fec7fe85?w=1200&h=800&fit=crop",
    social_links: {
      instagram: "https://instagram.com/diegounderground",
      spotify: "https://open.spotify.com/artist/example11",
      soundcloud: "https://soundcloud.com/diegounderground",
    },
    media: {
      audio: ["https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/example"],
      video: [],
    },
    featured: false,
    shape: "portrait",
  },
  {
    id: "12",
    slug: "la-banda-de-oro",
    name: "La Banda de Oro",
    bio: "Traditional brass band from the Pacific coast bringing authentic Colombian folklore to international stages.",
    location: "Buenaventura, Colombia",
    label: "Pacific Records",
    agent_id: "3",
    photo_url: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=800&h=1000&fit=crop",
    hero_image_url: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200&h=800&fit=crop",
    social_links: {
      instagram: "https://instagram.com/labandadeoro",
      spotify: "https://open.spotify.com/artist/example12",
      youtube: "https://youtube.com/@labandadeoro",
    },
    media: {
      audio: [],
      video: [],
    },
    featured: false,
    shape: "square",
  },
]

// Populate agent references in artists
mockArtists.forEach(artist => {
  artist.agent = mockAgents.find(agent => agent.id === artist.agent_id)
})

// Mock Company Information
export const mockContactInfo: ContactInfo = {
  company_name: "MG-Company",
  address: {
    line1: "Carrera 43A #1-50",
    line2: "Oficina 201",
    city: "Medellín",
    postal_code: "050021",
    country: "Colombia",
  },
  email: {
    general: "info@mg-company.com",
    bookings: "bookings@mg-company.com",
    press: "press@mg-company.com",
  },
  about: {
    short: "MG-Company is a leading talent agency representing the finest artists in Latin America, specializing in electronic, urban, and alternative music.",
    long: "Founded in 2018, MG-Company has established itself as one of Colombia's premier talent agencies, representing a diverse roster of artists across multiple genres. Our mission is to support and elevate Colombian and Latin American artists on the global stage, providing world-class booking services, artist development, and strategic career guidance. With offices in Medellín and partnerships across Latin America, Europe, and North America, we connect our artists with the best opportunities worldwide. Our team of experienced agents brings decades of industry expertise and a passion for discovering and nurturing exceptional talent.",
  },
}

// Helper functions for data access
export function getArtistBySlug(slug: string): Artist | undefined {
  return mockArtists.find(artist => artist.slug === slug)
}

export function getArtistsByAgent(agentId: string): Artist[] {
  return mockArtists.filter(artist => artist.agent_id === agentId)
}

export function getFeaturedArtists(): Artist[] {
  return mockArtists.filter(artist => artist.featured)
}

export function getAllArtists(): Artist[] {
  return mockArtists
}

export function getAllAgents(): Agent[] {
  return mockAgents
}

export function getAgentById(id: string): Agent | undefined {
  return mockAgents.find(agent => agent.id === id)
}
