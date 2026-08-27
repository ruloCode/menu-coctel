import { redirect } from "next/navigation"
import { cargarSnapshot, perfilActual } from "@/lib/mg/datos"
import VistaCarga from "@/components/admin/vista-carga"

export const dynamic = "force-dynamic"

export default async function CargaPage() {
  const perfil = await perfilActual()
  if (!perfil) redirect("/admin/login")
  const s = await cargarSnapshot()
  return <VistaCarga snapshot={s} yo={perfil} />
}
