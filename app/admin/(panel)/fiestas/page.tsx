import { redirect } from "next/navigation"
import { cargarSnapshot, perfilActual } from "@/lib/mg/datos"
import { puede } from "@/lib/mg/permisos"
import VistaFiestas from "@/components/admin/vista-fiestas"

export const dynamic = "force-dynamic"

export default async function FiestasPage() {
  const [s, perfil] = await Promise.all([cargarSnapshot(), perfilActual()])
  if (!perfil) redirect("/admin/login")
  return <VistaFiestas snapshot={s} puedeEditar={puede(perfil?.rol, "operar")} yo={perfil} />
}
