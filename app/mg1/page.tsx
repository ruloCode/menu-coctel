import { redirect } from "next/navigation"

// /mg1 entra directo a la convocatoria pública del concurso
export default function MG1Index() {
  redirect("/mg1/convocatoria")
}
