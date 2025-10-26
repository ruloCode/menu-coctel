"use client"

import Link from "next/link"
import { Instagram, Mail } from "lucide-react"

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 py-16 md:py-20 mt-16 md:mt-20 lg:mt-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Social Links */}
          <div className="flex items-center justify-center md:justify-start gap-4">
            <a
              href="https://instagram.com/mgcompany"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 flex items-center justify-center border-2 border-white rounded-full hover:bg-white hover:text-black hover:scale-110 transition-all duration-300"
              aria-label="Instagram"
            >
              <Instagram size={22} />
            </a>
            <a
              href="mailto:info@mg-company.com"
              className="w-14 h-14 flex items-center justify-center border-2 border-white rounded-full hover:bg-white hover:text-black hover:scale-110 transition-all duration-300"
              aria-label="Email"
            >
              <Mail size={22} />
            </a>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col md:flex-row items-center md:items-center gap-4 md:gap-6 md:justify-center">
            <Link href="/artists" className="text-sm uppercase font-bold hover:text-zinc-300 transition-colors duration-200">
              Artists
            </Link>
            <Link href="/contact" className="text-sm uppercase font-bold hover:text-zinc-300 transition-colors duration-200">
              Contact
            </Link>
            <Link href="/about" className="text-sm uppercase font-bold hover:text-zinc-300 transition-colors duration-200">
              About
            </Link>
          </div>

          {/* Mailing List CTA */}
          <div className="flex items-center justify-center md:col-span-2 lg:col-span-1 lg:justify-end">
            <Link
              href="/contact"
              className="px-8 py-4 border-2 border-white rounded-full text-sm uppercase font-bold hover:bg-white hover:text-black hover:scale-105 transition-all duration-300 inline-block"
            >
              Join Mailing List
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 md:mt-16 pt-8 md:pt-12 border-t border-white/10 text-center">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} MG-Company. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
