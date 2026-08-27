import type { Metadata } from "next"
import "../panel.css"

export const metadata: Metadata = {
  title: "Entrar · Centro de operaciones MG",
  robots: { index: false, follow: false },
}

// El login no puede heredar el layout del panel: ese exige perfil activo.
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <div className="panel">{children}</div>
}
