import { redirect } from "next/navigation"
import { cargarReuniones, cargarSnapshot, perfilActual } from "@/lib/mg/datos"
import VistaReuniones from "@/components/admin/vista-reuniones"

export const dynamic = "force-dynamic"

export default async function ReunionesPage() {
  const [perfil, reuniones, s] = await Promise.all([perfilActual(), cargarReuniones(), cargarSnapshot()])
  if (!perfil) redirect("/admin/login")
  const acuerdos = s.eventosExtra.filter((e) => e.reunion_id)
  return <VistaReuniones reuniones={reuniones} acuerdos={acuerdos} yo={perfil} />
}
