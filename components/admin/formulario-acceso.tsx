"use client"

import { useActionState, useState } from "react"
import { useSearchParams } from "next/navigation"
import { iniciarSesion, registrarse, type Resultado } from "@/app/admin/acciones"

export default function FormularioAcceso() {
  const params = useSearchParams()
  const volver = params.get("volver") ?? "/admin"
  const [modo, setModo] = useState<"entrar" | "crear">("entrar")

  const [entrarEstado, accionEntrar, entrando] = useActionState<Resultado | null, FormData>(iniciarSesion, null)
  const [crearEstado, accionCrear, creando] = useActionState<Resultado | null, FormData>(registrarse, null)

  const estado = modo === "entrar" ? entrarEstado : crearEstado
  const cargando = modo === "entrar" ? entrando : creando
  // registrarse() devuelve ok:true con un mensaje informativo (no es un error).
  const esAviso = estado?.ok === true && !!estado.error

  return (
    <div className="card" style={{ marginBottom: 0 }}>
      <div className="seg" style={{ marginBottom: 16, width: "100%" }}>
        <button type="button" className={modo === "entrar" ? "on" : ""} onClick={() => setModo("entrar")} style={{ flex: 1 }}>
          Entrar
        </button>
        <button type="button" className={modo === "crear" ? "on" : ""} onClick={() => setModo("crear")} style={{ flex: 1 }}>
          Crear cuenta
        </button>
      </div>

      <form action={modo === "entrar" ? accionEntrar : accionCrear}>
        <input type="hidden" name="volver" value={volver} />

        {modo === "crear" ? (
          <label style={{ display: "block", marginBottom: 12 }}>
            <span className="small muted" style={{ display: "block", marginBottom: 4 }}>Nombre</span>
            <input name="nombre" required autoComplete="name" style={{ width: "100%" }} placeholder="Cómo te ve el equipo" />
          </label>
        ) : null}

        <label style={{ display: "block", marginBottom: 12 }}>
          <span className="small muted" style={{ display: "block", marginBottom: 4 }}>Correo</span>
          <input name="email" type="email" required autoComplete="email" style={{ width: "100%" }} placeholder="tu@mgcompany.co" />
        </label>

        <label style={{ display: "block", marginBottom: 14 }}>
          <span className="small muted" style={{ display: "block", marginBottom: 4 }}>Contraseña</span>
          <input
            name="password"
            type="password"
            required
            minLength={modo === "crear" ? 8 : undefined}
            autoComplete={modo === "crear" ? "new-password" : "current-password"}
            style={{ width: "100%" }}
          />
        </label>

        {estado?.error ? (
          <div className={esAviso ? "alert good" : "alert critical"} style={{ marginBottom: 12 }} role="status">
            <span aria-hidden>{esAviso ? "✓" : "⚠"}</span>
            <span>{estado.error}</span>
          </div>
        ) : null}

        <button className="btn brand" disabled={cargando} style={{ width: "100%", justifyContent: "center" }}>
          {cargando ? "Un momento…" : modo === "entrar" ? "Entrar al panel" : "Crear cuenta"}
        </button>
      </form>

      <p className="small muted" style={{ marginTop: 14, marginBottom: 0 }}>
        {modo === "entrar"
          ? "Acceso restringido al equipo de MG Company."
          : "La primera cuenta que se cree queda como owner. Las siguientes necesitan que un admin las active."}
      </p>
    </div>
  )
}
