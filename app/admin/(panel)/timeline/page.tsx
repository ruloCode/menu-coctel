import { cargarSnapshot, perfilActual } from "@/lib/mg/datos"
import { puede } from "@/lib/mg/permisos"
import VistaTimeline from "@/components/admin/vista-timeline"

export const dynamic = "force-dynamic"

export default async function TimelinePage() {
  const [s, perfil] = await Promise.all([cargarSnapshot(), perfilActual()])
  return <VistaTimeline snapshot={s} puedeEditar={puede(perfil?.rol, "operar")} />
}
