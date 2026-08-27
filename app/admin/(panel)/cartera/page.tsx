import { redirect } from "next/navigation"
import { cargarHistorialSalud, cargarSnapshot, perfilActual } from "@/lib/mg/datos"
import VistaCartera from "@/components/admin/vista-cartera"

export const dynamic = "force-dynamic"

export default async function CarteraPage() {
  const [perfil, s, historial] = await Promise.all([
    perfilActual(), cargarSnapshot(), cargarHistorialSalud(),
  ])
  if (!perfil) redirect("/admin/login")
  return <VistaCartera snapshot={s} historial={historial} yo={perfil} />
}
