import { cargarSnapshot, perfilActual } from "@/lib/mg/datos"
import { puede } from "@/lib/mg/permisos"
import VistaPlan from "@/components/admin/vista-plan"

export const dynamic = "force-dynamic"

export default async function PlanPage() {
  const [s, perfil] = await Promise.all([cargarSnapshot(), perfilActual()])
  return <VistaPlan snapshot={s} puedeEditar={puede(perfil?.rol, "reglas")} />
}
