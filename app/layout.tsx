import type React from "react"
import type { Metadata } from "next"
import { Inter, Bebas_Neue } from "next/font/google"
import "./globals.css"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const bebasNeue = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas" })

export const metadata: Metadata = {
  title: "MG Company Group | Productora Artistica",
  description: "MG Company Group es una productora artistica integral. Musica, cine, eventos en vivo y desarrollo de talento.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.variable} ${bebasNeue.variable} font-body`}>
        <SiteHeader />
        <main className="min-h-screen pt-16 md:pt-20 lg:pt-24">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  )
}
