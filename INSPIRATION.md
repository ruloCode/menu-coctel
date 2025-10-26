# Earth Agency - Design Inspiration for MG-Company

## Overview

Earth Agency (https://earth-agency.com) is a London-based music booking agency representing artists across genres. The website exemplifies modern, minimalist design with bold typography and a focus on visual content.

**Key Characteristics:**
- Dark, high-contrast aesthetic
- Bold, oversized typography
- Grid-based layouts
- Smooth interactions and animations
- Mobile-first responsive design
- Content-focused with minimal decoration

---

## Design System Analysis

### Color Palette

**Primary Colors:**
- **Background:** `#000000` (Pure Black)
- **Text Primary:** `#FFFFFF` (White)
- **Text Secondary:** `#CCCCCC` (Light Gray)
- **Accent/Hover:** `#333333` (Dark Gray)

**Usage:**
- Extreme contrast for readability
- No gradients or complex color schemes
- Monochromatic approach creates sophisticated, professional feel
- Color only appears in artist photos/media content

### Typography

**Heading Style:**
- Font: Bold, sans-serif (appears to be custom or system font)
- Weight: 800-900 (Extra Bold/Black)
- Size: Very large (80px-120px on desktop, 40px-60px on mobile)
- Transform: Uppercase
- Letter Spacing: Tight (-2% to 0%)
- Line Height: 0.9-1.0 (very tight)

**Body Text:**
- Font: Regular sans-serif
- Weight: 400
- Size: 16px-18px
- Line Height: 1.6
- Color: White or light gray

**Special Effect - Scrolling Headers:**
- Artist names and section titles repeat horizontally
- Creates kinetic, eye-catching effect
- Text appears to scroll/animate on interaction

### Layout & Spacing

**Grid System:**
- Masonry/flexible grid on homepage
- Mixed card sizes create visual interest
- Responsive: 4 columns (desktop) → 2 columns (tablet) → 1 column (mobile)

**Spacing:**
- Generous whitespace (or "black-space" in this case)
- Padding: 40px-80px section margins
- Card gaps: 20px-30px
- Consistent rhythm throughout

**Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px
- Large Desktop: > 1440px

---

## Key Features & Patterns

### 1. Homepage - Artist Grid Showcase

**Layout:**
- Mixed-size grid of artist cards
- Each card features:
  - High-quality photograph (portrait or group shot)
  - Artist name overlaid in bold white text
  - Hover effect: slight scale/brightness change
- Instagram feed integration showing recent posts
- Logo centered at bottom

**Interaction:**
- Cards are clickable, leading to artist detail pages
- Smooth hover transitions
- No loading states - instant navigation

### 2. Artists Listing Page

**Filter System:**
- **NEW**: Shows recently added artists
- **SEARCH**: Real-time search with text input modal
- **A-Z**: Alphabetical filter with letter navigation
- **AGENT**: Filter by booking agent

**Search Modal:**
- Full-screen overlay on click
- Large search input
- Instant results as you type
- ESC to close

**A-Z Filter Modal:**
- Full-screen grid of alphabet letters
- Numbers (0-9) and special characters (#+)
- Click letter to filter artists
- Visual indicator for letters with artists

**Agent Filter Modal:**
- List of all agents
- Click to filter by that agent's roster
- Shows agent photos/names

**Artist Cards:**
- Same grid layout as homepage
- Artist name + photo
- Hover effect reveals booking agent

### 3. Artist Detail Page

**Hero Section:**
- Large scrolling artist name header (repeating horizontally)
- Hero image (left side)
- Info card (right side) with:
  - Artist name
  - Booking agent + email link
  - Based location
  - Record label

**Social Links:**
- Icon row: Soundcloud, Instagram, Spotify, YouTube, Apple Music, Website
- Simple icon design, consistent sizing
- Opens in new tab

**Biography:**
- Short description (100-150 words)
- "Read Full Bio" expand button
- Longer biography revealed on click

**Media Section:**
- Tab switcher: Audio / Video
- **Audio**: Embedded Bandcamp/Spotify players
- **Video**: Embedded YouTube videos
- Clean, minimal embed styling

**Navigation:**
- "Back to Artists" link at bottom
- Subtle arrow animation on hover

### 4. Contact Page

**Layout Sections:**

**Company Info:**
- Address block (left side)
- Email contacts for different inquiries
- Social icons

**Agents Section:**
- Animated scrolling "AGENTS" header
- Table with 3 columns:
  - Agent Name
  - Email Address (clickable mailto link)
  - "Roster" button (expands to show their artists)
- Mobile: Stacks into cards

**About Section:**
- Company description
- Mission/values
- Year founded, growth story

### 5. Navigation & Footer

**Header:**
- Logo (top left)
- Hamburger menu (top right)
- Fixed position on scroll
- Minimal, doesn't distract from content

**Menu (Overlay):**
- Full-screen black overlay
- Large text links:
  - Home
  - Artists
  - Contact
- Smooth slide-in animation
- Close button (X) top right

**Footer:**
- Instagram + Email icons
- Links: Privacy & Cookies, Site Map
- "Website by Studio Illicit" credit
- "Mailing List" CTA button (white outline, hollow)
- Centered layout

---

## Technical Observations

### Performance
- Fast loading times
- Optimized images (WebP format likely)
- Lazy loading for images below fold
- Minimal JavaScript - progressive enhancement

### Accessibility
- Good contrast ratios (black/white)
- Keyboard navigation support
- Semantic HTML structure
- Alt text on images

### SEO
- Clean URLs (`/artists/artist-name`)
- Meta descriptions
- Structured data likely implemented
- Fast Core Web Vitals

---

## Animation & Interaction Patterns

### Micro-interactions
1. **Card Hover:** Slight scale (1.05x) + brightness increase
2. **Link Hover:** Underline animation, left to right
3. **Button Hover:** Background fill animation
4. **Modal Open:** Fade in + slight scale up (0.95 → 1.0)
5. **Scrolling Text:** Continuous horizontal scroll, seamless loop

### Transitions
- Duration: 200-300ms (snappy, not sluggish)
- Easing: Cubic-bezier for natural feel
- No page transitions - instant navigation (Next.js default)

---

## Recommendations for MG-Company

### Immediate Priorities

1. **Adopt Dark Minimalist Aesthetic**
   - Change background to pure black `#000000`
   - Use white text throughout
   - Update tailwind.config to reflect new color system

2. **Bold Typography System**
   - Implement large, bold headings
   - Use uppercase for artist names and section titles
   - Tight line-height for impact

3. **Grid-Based Homepage**
   - Showcase artists/talent in masonry grid
   - High-quality photos essential
   - Mix of portrait and landscape orientations

4. **Artist/Talent Pages**
   - Individual pages for each artist
   - Include: bio, photos, videos, social links, booking contact
   - Agent assignment

### Content Strategy

**Artists/Talent to Feature:**
- Determine MG-Company's roster
- Gather high-quality photos (1200x1600px minimum)
- Write compelling biographies
- Collect social media links
- Assign booking agents

**Agent Information:**
- Agent names and emails
- Headshots (optional but recommended)
- Roster assignments

**Company Information:**
- About MG-Company
- Services offered
- Contact information
- Office location (if applicable)

### Technical Implementation

**Database Schema Updates:**
```
artists table:
- id, slug, name, bio, location, label
- agent_id (foreign key)
- photo_url, social_links (JSON)
- created_at, updated_at

agents table:
- id, name, email, photo_url
- created_at, updated_at
```

**New Pages:**
- `/` - Homepage with artist grid
- `/artists` - Full roster with filters
- `/artists/[slug]` - Individual artist pages
- `/contact` - Contact page with agents
- `/about` - About the company

**Components to Build:**
- ArtistCard
- ArtistGrid
- FilterBar (Search, A-Z, Category)
- ScrollingText (animated header)
- AgentTable
- MediaPlayer (audio/video embeds)

### Design Tokens (Tailwind Config)

```javascript
colors: {
  background: '#000000',
  foreground: '#FFFFFF',
  muted: '#CCCCCC',
  accent: '#333333',
}

fontSize: {
  'display': ['120px', { lineHeight: '1', letterSpacing: '-0.02em' }],
  'hero': ['80px', { lineHeight: '0.9', letterSpacing: '-0.01em' }],
  'heading': ['48px', { lineHeight: '1.1' }],
}

fontWeight: {
  'black': 900,
  'extrabold': 800,
}
```

---

## Differences from Current MG-Website

**Current State:**
- Event registration focused (MOOD Festival)
- Blue accent color (#2a4bbd)
- Form-heavy interface
- Admin dashboard for QR scanning

**Proposed Changes:**
- Artist representation focused
- Black/white color scheme
- Gallery/portfolio interface
- Admin for managing artists, not events

**What to Keep:**
- Supabase backend
- Next.js 15 framework
- Admin authentication system
- shadcn/ui components (restyle them)

**What to Replace:**
- Registration form → Artist showcase
- QR scanner → Artist management
- Event-centric copy → Agency-centric copy

---

## Inspiration Gallery

Screenshots captured and saved:
1. `earth-agency-homepage.png` - Homepage with artist grid
2. `earth-agency-artists.png` - Artists listing with filters
3. `earth-agency-contact.png` - Contact page with agents
4. `earth-agency-artist-detail.png` - Individual artist page

**Visual References:**
- Bold text treatments
- Grid layouts
- Card hover effects
- Filter UI patterns
- Agent table design
- Footer styling

---

## Next Steps

1. ✅ Create inspiration document (this file)
2. Update Supabase schema with artists/agents tables
3. Update global styles and theme configuration
4. Build homepage with artist grid
5. Create artists listing page with filters
6. Build individual artist detail pages
7. Create contact page with agents table
8. Create about page
9. Update navigation/footer
10. Test responsive design across devices

---

## Resources & References

- Earth Agency Website: https://earth-agency.com
- Designer: Studio Illicit (https://www.illicitwebdesign.co.uk/)
- Similar Agencies for More Inspiration:
  - Paradigm Talent Agency
  - X-Ray Touring
  - Wasserman Music

---

*Document created: 2025-10-26*
*For: MG-Company Website Redesign Project*
