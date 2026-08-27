import { Suspense } from "react"
import FormularioAcceso from "@/components/admin/formulario-acceso"

export const dynamic = "force-dynamic"

export default function LoginPage() {
  return (
    <main style={{ minHeight: "100dvh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ width: "min(400px, 100%)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
          <span className="brand-mark" aria-hidden>MG</span>
          <span className="brand-txt">
            <b style={{ fontSize: 15 }}>MG Company</b>
            <span>Centro de operaciones</span>
          </span>
        </div>
        <Suspense fallback={null}>
          <FormularioAcceso />
        </Suspense>
      </div>
    </main>
  )
}
