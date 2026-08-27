import { cargarSnapshot, perfilActual } from "@/lib/mg/datos"
import { puede } from "@/lib/mg/permisos"
import VistaRadar from "@/components/admin/vista-radar"

export const dynamic = "force-dynamic"

export default async function RadarPage() {
  const [s, perfil] = await Promise.all([cargarSnapshot(), perfilActual()])
  return <VistaRadar snapshot={s} puedeEditar={puede(perfil?.rol, "operar")} />
}
