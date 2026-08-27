import { cargarSnapshot, perfilActual } from "@/lib/mg/datos"
import { puede } from "@/lib/mg/permisos"
import VistaArtistas from "@/components/admin/vista-artistas"

export const dynamic = "force-dynamic"

export default async function ArtistasPage() {
  const [s, perfil] = await Promise.all([cargarSnapshot(), perfilActual()])
  return <VistaArtistas snapshot={s} puedeEditar={puede(perfil?.rol, "operar")} />
}
