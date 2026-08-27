import { cargarSnapshot, perfilActual } from "@/lib/mg/datos"
import { puede } from "@/lib/mg/permisos"
import VistaDatos from "@/components/admin/vista-datos"

export const dynamic = "force-dynamic"

export default async function DatosPage() {
  const [s, perfil] = await Promise.all([cargarSnapshot(), perfilActual()])
  return <VistaDatos snapshot={s} puedeRestaurar={puede(perfil?.rol, "equipo")} />
}
