# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MG Company Group - Sitio web de productora artistica integral construido con Next.js 15. El sitio presenta artistas, unidades de negocio (MG Music, MG Film, MG Up, MG Live), contenido audiovisual (MG Flow), galeria, y un sistema de registro de eventos con generacion de codigos QR.

## Development Commands

```bash
# Install dependencies
npm install --legacy-peer-deps

# Run development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture

### Core Technology Stack
- **Framework**: Next.js 15 (App Router with React 19)
- **Database/Auth**: Supabase (authentication + PostgreSQL)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Form Handling**: React Hook Form + Zod validation
- **Animations**: Framer Motion + Embla Carousel
- **QR Codes**: qrcode.react (generation), @yudiel/react-qr-scanner (scanning)
- **Fonts**: Bebas Neue (headings), Inter (body)

### Project Structure
```
app/
  ├── page.tsx                    # Home (video hero, artistas, unidades, MG Flow teaser)
  ├── artistas/
  │   ├── page.tsx                # Listado de artistas con filtros
  │   └── [slug]/page.tsx         # Detalle de artista
  ├── nosotros/page.tsx           # Sobre MG Company Group
  ├── contacto/page.tsx           # Formulario de contacto
  ├── proyectos/
  │   ├── page.tsx                # Unidades de negocio
  │   └── [slug]/page.tsx         # Detalle de unidad
  ├── mg-flow/
  │   ├── page.tsx                # Shows y contenido audiovisual
  │   └── [slug]/page.tsx         # Detalle de show con episodios
  ├── galeria/page.tsx            # Galeria de fotos y videos
  ├── registro/page.tsx           # Registro de eventos con QR
  ├── admin/
  │   ├── page.tsx                # Admin dashboard (protected)
  │   └── login/page.tsx          # Admin login
  ├── layout.tsx                  # Root layout with metadata
  └── globals.css                 # Global styles
components/
  ├── site-header.tsx             # Navigation header (7 routes)
  ├── site-footer.tsx             # Footer with links + social
  ├── hero-logo.tsx               # Parallax hero with text
  ├── video-hero.tsx              # Full-screen video hero
  ├── featured-artists-carousel.tsx # Embla carousel for artists
  ├── business-units-grid.tsx     # Grid of 4 business units
  ├── netflix-carousel.tsx        # Horizontal scroll carousel
  ├── show-card.tsx               # MG Flow show card
  ├── gallery-grid.tsx            # Filterable photo/video gallery
  ├── section-heading.tsx         # Reusable section heading
  ├── platform-links.tsx          # Social/streaming platform icons
  ├── contact-form.tsx            # Contact form with validation
  ├── masonry-grid.tsx            # Artist masonry grid
  ├── artist-card.tsx             # Artist card component
  ├── artist-filter.tsx           # Artist search/filter
  ├── scrolling-text.tsx          # Animated scrolling text
  ├── registration-form.tsx       # Event registration with QR
  ├── audio-player.tsx            # Background audio player
  └── ui/                         # shadcn/ui component library
lib/
  ├── types.ts                    # TypeScript interfaces (Artist, BusinessUnit, MGFlowShow, etc.)
  ├── mock-data.ts                # Mock data and helper functions
  ├── supabase.ts                 # Supabase client + validation
  └── utils.ts                    # Utility functions (cn, etc.)
middleware.ts                     # Auth middleware for /admin routes
```

### Brand Identity
- **Primary Color**: `#E8200C` (MG Red) - CSS variable `--primary`, Tailwind `mg-red`
- **Background**: `#111111` (MG Black) - CSS variable `--background`, Tailwind `mg-black`
- **Text**: `#FFFFFF` (White)
- **Heading Font**: Bebas Neue (`font-heading`, `--font-bebas`)
- **Body Font**: Inter (`font-body`, `--font-inter`)
- **Typography Classes**: `.text-display`, `.text-hero`, `.text-heading` use Bebas Neue

### Data Model
- **Artist**: id, slug, name, bio, social_links, media, discography, videos, featured, shape
- **BusinessUnit**: slug, name, tagline, description, services[]
- **MGFlowShow**: slug, title, description, category, episodes[]
- **GalleryItem**: type (photo|video), url, category (estudio|en-vivo|eventos|bts)
- **TeamMember**: name, role, photo_url, bio

### Routes
| Route | Description |
|-------|------------|
| `/` | Home - video hero, featured artists, business units, MG Flow teaser |
| `/artistas` | Artist roster with search/filter |
| `/artistas/[slug]` | Artist detail with bio, discography, videos |
| `/nosotros` | About - mission, team, values |
| `/contacto` | Contact form + company info |
| `/proyectos` | Business units overview |
| `/proyectos/[slug]` | Business unit detail + services |
| `/mg-flow` | Shows listing (Netflix-style carousels) |
| `/mg-flow/[slug]` | Show detail with episode list |
| `/galeria` | Photo/video gallery with category filters |
| `/registro` | Event registration with QR code generation |
| `/mg1` | Redirect a `/mg1/convocatoria` |
| `/mg1/convocatoria` | Landing publica del Concurso MG1 + formulario de inscripcion (persiste en Supabase) |
| `/mg1/jurado/[invitado]` | Invitacion privada de jurado, parametrizada por slug |

Las rutas en `STANDALONE_PREFIXES` (`components/site-chrome.tsx`) se renderizan sin
header/footer del sitio: hoy `/mg1/jurado` y `/mg1/convocatoria`.

### Authentication & Authorization
- Admin routes (`/admin/*`) are protected via middleware
- Middleware uses Supabase SSR auth with cookie management
- Unauthenticated users accessing `/admin` are redirected to `/admin/login`

### Build Configuration
- ESLint and TypeScript errors ignored during builds (next.config.mjs)
- Images are unoptimized
- Middleware matcher targets `/admin/:path*` routes

## Database Schema

> Nota: `lib/supabase.ts` y las rutas `/admin` documentadas mas abajo aun no existen en
> el repo. Lo que si esta conectado a Supabase hoy es el formulario de MG1.

### `mg1_inscripciones` (migracion `supabase/migrations/002_...`)

Inscripciones de la convocatoria MG1. Se escribe desde `app/api/mg1/inscripcion/route.ts`
usando `lib/supabase-admin.ts` (nunca desde el cliente).

RLS: policy de **INSERT para anon**, sin policy de SELECT/UPDATE/DELETE — los datos
personales solo se leen con la `service_role` key. Un correo por edicion (indice unico
sobre `lower(email), edicion`). El formulario trae honeypot (`website`) y validacion
compartida en `lib/mg1-inscripcion.ts`.

Sin credenciales de Supabase, en desarrollo el route handler cae a
`.data/mg1-inscripciones.jsonl`; en produccion responde 503 en vez de perder datos.

### `registros`

The `registros` table structure:
- `id`: Primary key
- `nombre`: Full name (string, required)
- `celular`: Phone number (string, required, unique)
- `correo`: Email (string, required, unique, stored lowercase)
- `genero`: Gender (string, required)
- `fecha_nacimiento`: Birth date (date, optional)
- `created_at`: Registration timestamp (auto-generated)

## Environment Setup

Required environment variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Assets Needed (Placeholders in Use)

- Logo MG Company Group (SVG/PNG) -> `public/logo-mg.svg`
- Video hero reel (MP4, 10-20s) -> `public/videos/hero-reel.mp4`
- Video poster fallback -> `public/videos/hero-poster.jpg`
- Artist photos -> `public/artists/[name]/`
- Team photos -> `public/team/`
- Gallery photos -> `public/gallery/`
- MG Flow thumbnails -> `public/mg-flow/`
