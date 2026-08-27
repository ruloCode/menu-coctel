import { notFound, redirect } from "next/navigation"
import { cargarReunion, cargarSnapshot, perfilActual } from "@/lib/mg/datos"
import { todosLosEventos } from "@/lib/mg/motor"
import VistaActa from "@/components/admin/vista-acta"

export const dynamic = "force-dynamic"

export default async function ActaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [perfil, reunion, s] = await Promise.all([perfilActual(), cargarReunion(id), cargarSnapshot()])
  if (!perfil) redirect("/admin/login")
  if (!reunion) notFound()

  // Se pasan por el motor para que traigan responsable, prioridad y cierre ya
  // resueltos, igual que cualquier otro evento del calendario.
  const ids = new Set(s.eventosExtra.filter((e) => e.reunion_id === id).map((e) => e.id))
  const acuerdos = todosLosEventos(s)
    .filter((e) => ids.has(e.id))
    .sort((a, b) => (a.fecha < b.fecha ? -1 : 1))

  return <VistaActa reunion={reunion} acuerdos={acuerdos} snapshot={s} yo={perfil} />
}
