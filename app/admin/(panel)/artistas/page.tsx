import { redirect } from "next/navigation"
import { cargarSnapshot, perfilActual } from "@/lib/mg/datos"
import { puede } from "@/lib/mg/permisos"
import VistaArtistas from "@/components/admin/vista-artistas"

export const dynamic = "force-dynamic"

export default async function ArtistasPage() {
  const [s, perfil] = await Promise.all([cargarSnapshot(), perfilActual()])
  if (!perfil) redirect("/admin/login")
  return <VistaArtistas snapshot={s} yo={perfil} puedeEditar={puede(perfil.rol, "operar")} />
}
