# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 event registration website for the MOOD Festival (2do Aniversario Luxury). The application handles user registration with QR code generation, admin authentication, and QR scanning for event check-in.

## Development Commands

```bash
# Install dependencies
npm install

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
- **QR Codes**: qrcode.react (generation), @yudiel/react-qr-scanner (scanning)

### Project Structure
```
app/
  ├── page.tsx                    # Public registration page
  ├── admin/
  │   ├── page.tsx                # Admin dashboard (protected)
  │   └── login/page.tsx          # Admin login
  ├── layout.tsx                  # Root layout with metadata
  └── globals.css                 # Global styles
components/
  ├── registration-form.tsx       # Main registration form with QR generation
  ├── qr-scanner.tsx              # QR scanner for admin check-in
  ├── audio-player.tsx            # Background audio player
  ├── theme-provider.tsx          # Next-themes provider
  └── ui/                         # shadcn/ui component library
lib/
  ├── supabase.ts                 # Supabase client + validation functions
  └── utils.ts                    # Utility functions (cn, etc.)
middleware.ts                     # Auth middleware for /admin routes
```

### Authentication & Authorization
- Admin routes (`/admin/*`) are protected via middleware (middleware.ts:41-52)
- Middleware uses Supabase SSR auth with cookie management
- Unauthenticated users accessing `/admin` are redirected to `/admin/login`
- Authenticated users accessing `/admin/login` are redirected to `/admin`

### Supabase Integration
- **Client Creation**: Uses `@supabase/ssr` for SSR-compatible clients
  - Server-side: `createServerClient` in middleware.ts
  - Client-side: `createBrowserClient` in components
- **Environment Variables**:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Database Table**: `registros` (columns: id, nombre, celular, correo, genero, fecha_nacimiento, created_at)
- **Validation Functions**: lib/supabase.ts provides `validateUniqueData()` and `createRegistration()`

### Registration Flow
1. User fills form on home page (components/registration-form.tsx)
2. Frontend validates: required fields, email format, phone format, age (18+)
3. Backend validates: unique email and phone via `validateUniqueData()`
4. On success: generates QR code containing registration ID and user data
5. User can download QR as image (html2canvas) or share via Web Share API
6. QR size adjusts based on device (200px mobile, 300px desktop)

### Admin Dashboard Features
- **Registration List**: Table view (desktop) / Card view (mobile) of all registrations
- **QR Scanner**: Camera-based QR scanning for event check-in
  - Scans QR codes generated during registration
  - Validates against database and displays registration details
- **Responsive Design**: Uses Tabs component to switch between list and scanner

### Key Technical Patterns
- **Path Alias**: `@/*` maps to project root (tsconfig.json:22-23)
- **Client Components**: Most components use `"use client"` directive for interactivity
- **Form State Management**: React Hook Form with detailed field-level validation and error states
- **Toast Notifications**: Sonner library for user feedback
- **Mobile Detection**: Window resize listener for responsive QR sizing
- **Date Formatting**: date-fns with Spanish locale (es)

### Build Configuration
- ESLint and TypeScript errors ignored during builds (next.config.mjs:4-7)
- Images are unoptimized (next.config.mjs:10)
- Middleware matcher targets `/admin/:path*` routes

### Styling Conventions
- Primary brand color: `#2a4bbd` (blue)
- Uses Tailwind CSS utility classes extensively
- Custom color scheme defined in tailwind.config.ts with CSS variables
- Dark mode supported via class strategy (next-themes)

## Database Schema

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
