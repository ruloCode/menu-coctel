import type { Metadata } from "next"
import { redirect } from "next/navigation"
import "../panel.css"
import { createClient } from "@/lib/supabase/server"
import { cargarSnapshot, perfilActual } from "@/lib/mg/datos"
import { cerrarSesion } from "../acciones"
import PanelShell from "@/components/admin/panel-shell"

export const metadata: Metadata = {
  title: "Centro de operaciones · MG Company",
  robots: { index: false, follow: false },
}

// El panel lee y escribe datos vivos: nunca se cachea entre usuarios.
export const dynamic = "force-dynamic"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const perfil = await perfilActual()

  if (!perfil) {
    // Hay sesión de auth (el middleware ya la exigió) pero el perfil no está
    // activo: la cuenta existe y espera que un admin la habilite.
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect("/admin/login")

    return (
      <div className="panel" style={{ minHeight: "100dvh", display: "grid", placeItems: "center", padding: 24 }}>
        <div className="card" style={{ maxWidth: 460, marginBottom: 0 }}>
          <h2>Tu cuenta todavía no está habilitada</h2>
          <p className="small muted">
            Creaste el acceso con <b>{user.email}</b>, pero alguien con rol owner o admin
            tiene que activarla y asignarte un rol antes de que puedas entrar al panel.
          </p>
          <form action={cerrarSesion} className="acciones">
            <button className="btn">Cerrar sesión</button>
          </form>
        </div>
      </div>
    )
  }

  // Contadores para las píldoras de la navegación: lo que exige atención hoy.
  const snapshot = await cargarSnapshot()
  const hoyISO = new Date().toISOString().slice(0, 10)
  const avisos: Record<string, number> = {
    redes: snapshot.publicaciones.filter((p) => p.estado === "revision" || p.estado === "error").length,
    radar: snapshot.radar.filter((r) => r.proxima && r.proxima < hoyISO).length,
  }

  return (
    <PanelShell perfil={perfil} avisos={avisos}>
      {children}
    </PanelShell>
  )
}
