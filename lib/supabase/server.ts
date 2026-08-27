import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// Cliente para Server Components, Route Handlers y Server Actions.
// Sigue usando la anon key a proposito: las consultas del panel viajan con la
// sesion del usuario y las filtra RLS. La service_role key se queda para el
// route handler publico de MG1 (lib/supabase-admin.ts) y nunca toca el panel.
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Server Component: el refresh de sesion lo escribe el middleware.
          }
        },
      },
    },
  )
}
