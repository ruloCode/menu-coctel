import { redirect } from "next/navigation"
import { cargarSnapshot, perfilActual } from "@/lib/mg/datos"
import { puede } from "@/lib/mg/permisos"
import Zeri from "@/components/admin/zeri"

export const dynamic = "force-dynamic"

export default async function ZeriPage() {
  const [s, perfil] = await Promise.all([cargarSnapshot(), perfilActual()])
  if (!perfil) redirect("/admin/login")
  return <Zeri snapshot={s} yo={perfil} puedeOperar={puede(perfil.rol, "operar")} />
}
