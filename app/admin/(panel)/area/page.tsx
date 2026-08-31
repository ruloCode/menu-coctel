import { redirect } from "next/navigation"
import { cargarSnapshot, perfilActual } from "@/lib/mg/datos"
import VistaArea from "@/components/admin/vista-area"

export const dynamic = "force-dynamic"

export default async function AreaPage() {
  const perfil = await perfilActual()
  if (!perfil) redirect("/admin/login")
  const s = await cargarSnapshot()
  return <VistaArea snapshot={s} yo={perfil} />
}
