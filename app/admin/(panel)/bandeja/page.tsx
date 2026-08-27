import { cargarAvisos } from "@/lib/mg/datos"
import VistaBandeja from "@/components/admin/vista-bandeja"

export const dynamic = "force-dynamic"

export default async function BandejaPage() {
  // RLS garantiza que solo vuelvan los avisos de quien está en sesión.
  return <VistaBandeja avisos={await cargarAvisos()} />
}
