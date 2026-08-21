import "server-only"

import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// Cliente usado por los route handlers. Prefiere la service_role key (bypass de RLS);
// si no existe, cae a la publishable/anon key, que solo puede INSERT en
// mg1_inscripciones gracias a la policy de la migracion 002.
// NUNCA importar esto desde un componente cliente ("server-only" lo impide en build).
let cached: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient | null {
  if (cached) return cached

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) return null

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return cached
}

export function isSupabaseConfigured() {
  return getSupabaseAdmin() !== null
}
