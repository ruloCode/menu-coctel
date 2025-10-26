import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MG-Company | Artist Management & Booking Agency",
  description: "Leading talent agency representing the finest artists in Latin America, specializing in electronic, urban, and alternative music.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={inter.className}>
        <SiteHeader />
        <main className="min-h-screen pt-16 md:pt-20 lg:pt-24">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  )
}
