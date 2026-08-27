import { cargarSnapshot, perfilActual } from "@/lib/mg/datos"
import { todosLosEventos } from "@/lib/mg/motor"
import { puede } from "@/lib/mg/permisos"
import VistaCalendario from "@/components/admin/vista-calendario"

export const dynamic = "force-dynamic"

export default async function CalendarioPage() {
  const [s, perfil] = await Promise.all([cargarSnapshot(), perfilActual()])
  return <VistaCalendario snapshot={s} eventos={todosLosEventos(s)} puedeEditar={puede(perfil?.rol, "operar")} />
}
