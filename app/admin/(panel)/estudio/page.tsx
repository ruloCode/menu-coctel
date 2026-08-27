import { redirect } from "next/navigation"
import { cargarSnapshot, perfilActual } from "@/lib/mg/datos"
import { puede } from "@/lib/mg/permisos"
import VistaEstudio from "@/components/admin/vista-estudio"

export const dynamic = "force-dynamic"

export default async function EstudioPage() {
  const [s, perfil] = await Promise.all([cargarSnapshot(), perfilActual()])
  if (!perfil) redirect("/admin/login")
  return <VistaEstudio snapshot={s} puedeEditar={puede(perfil?.rol, "operar")} yo={perfil} />
}
