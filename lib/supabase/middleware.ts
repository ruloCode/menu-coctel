import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

// Refresca el token en cada request y decide si la sesion puede entrar a /admin.
export async function actualizarSesion(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    },
  )

  // getUser() y no getSession(): valida el JWT contra Supabase en vez de
  // confiar en la cookie, que es falsificable.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const esLogin = pathname.startsWith("/admin/login")

  if (!user && !esLogin) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin/login"
    url.searchParams.set("volver", pathname)
    return NextResponse.redirect(url)
  }

  if (user && esLogin) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin"
    url.search = ""
    return NextResponse.redirect(url)
  }

  return response
}
