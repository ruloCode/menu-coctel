"use client"

import { createBrowserClient } from "@supabase/ssr"

// Cliente de navegador. Solo lleva la publishable/anon key: todo lo que puede
// leer o escribir lo decide RLS a partir del rol en public.perfiles.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
