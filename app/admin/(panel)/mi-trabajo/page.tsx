import { redirect } from "next/navigation"
import { cargarSnapshot, perfilActual } from "@/lib/mg/datos"
import VistaMiTrabajo from "@/components/admin/vista-mi-trabajo"

export const dynamic = "force-dynamic"

export default async function MiTrabajoPage() {
  const perfil = await perfilActual()
  if (!perfil) redirect("/admin/login")
  const s = await cargarSnapshot()
  return <VistaMiTrabajo snapshot={s} yo={perfil} />
}
