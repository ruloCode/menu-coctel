"use client"

import { usePathname } from "next/navigation"
import SiteHeader from "./site-header"
import SiteFooter from "./site-footer"

// Rutas standalone: sin header/footer del sitio
// (invitaciones, propuestas privadas y landings de conversión con su propio footer)
const STANDALONE_PREFIXES = ["/mg1/jurado", "/mg1/convocatoria"]

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const standalone = STANDALONE_PREFIXES.some((prefix) => pathname.startsWith(prefix))

  if (standalone) {
    return <main className="min-h-screen">{children}</main>
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen pt-16 md:pt-24 lg:pt-28">{children}</main>
      <SiteFooter />
    </>
  )
}
