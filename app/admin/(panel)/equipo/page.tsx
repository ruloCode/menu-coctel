import { redirect } from "next/navigation"
import { cargarEquipo, cargarSnapshot, perfilActual } from "@/lib/mg/datos"
import { puede } from "@/lib/mg/permisos"
import VistaEquipo from "@/components/admin/vista-equipo"

export const dynamic = "force-dynamic"

export default async function EquipoPage() {
  const perfil = await perfilActual()
  if (!perfil) redirect("/admin/login")
  // La sección no aparece en la navegación para otros roles, pero entrar por
  // URL directa también tiene que rebotar.
  if (!puede(perfil.rol, "equipo")) redirect("/admin")

  const [perfiles, s] = await Promise.all([cargarEquipo(), cargarSnapshot()])
  return <VistaEquipo perfiles={perfiles} artistas={s.artistas} yo={perfil} />
}
