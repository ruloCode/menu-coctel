import type React from "react"
import type { Metadata } from "next"
import { Inter, Bebas_Neue, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const bebasNeue = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas" })
const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
})

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
      <body className={`${inter.variable} ${bebasNeue.variable} ${jetbrainsMono.variable} font-body`}>
        <SiteHeader />
        <main className="min-h-screen pt-16 md:pt-24 lg:pt-28">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  )
}
