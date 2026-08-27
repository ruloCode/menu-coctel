import { cargarInscripcionesMG1, perfilActual } from "@/lib/mg/datos"
import { puede } from "@/lib/mg/permisos"
import VistaMg1 from "@/components/admin/vista-mg1"

export const dynamic = "force-dynamic"

export default async function Mg1Page() {
  const [inscripciones, perfil] = await Promise.all([cargarInscripcionesMG1(), perfilActual()])
  return <VistaMg1 inscripciones={inscripciones} puedeEditar={puede(perfil?.rol, "operar")} />
}
