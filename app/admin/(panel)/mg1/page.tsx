import { cargarInscripcionesMG1, perfilActual } from "@/lib/mg/datos"
import { puede, tieneExtra } from "@/lib/mg/permisos"
import VistaMg1 from "@/components/admin/vista-mg1"

export const dynamic = "force-dynamic"

export default async function Mg1Page() {
  const [inscripciones, perfil] = await Promise.all([cargarInscripcionesMG1(), perfilActual()])

  // Dos permisos distintos sobre la misma pantalla: decidir (el estado) y
  // acompañar (la disponibilidad y las notas de cada conversación).
  const puedeCurar = puede(perfil?.rol, "operar")

  return (
    <VistaMg1
      inscripciones={inscripciones}
      puedeCurar={puedeCurar}
      puedeContactar={puedeCurar || tieneExtra(perfil, "mg1:contactar")}
    />
  )
}
