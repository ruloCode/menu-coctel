import { redirect } from "next/navigation"

// La URL original de la invitación ahora vive en /mg1/jurado/[invitado]
export default function MG1JuradoIndex() {
  redirect("/mg1/jurado/thaissa")
}
