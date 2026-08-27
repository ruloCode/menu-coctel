import { cargarSnapshot, perfilActual } from "@/lib/mg/datos"
import { puede } from "@/lib/mg/permisos"
import VistaRedes from "@/components/admin/redes/vista-redes"

export const dynamic = "force-dynamic"

export default async function RedesPage() {
  const [s, perfil] = await Promise.all([cargarSnapshot(), perfilActual()])
  return (
    <VistaRedes
      snapshot={s}
      puedeEditar={puede(perfil?.rol, "publicar")}
      puedeAprobar={puede(perfil?.rol, "publicar") || puede(perfil?.rol, "aprobarPropio")}
      miArtista={perfil?.rol === "artista" ? perfil.artista_id : null}
    />
  )
}
