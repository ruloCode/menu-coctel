"use client"

import { useState, useTransition } from "react"
import { etiquetaRol } from "@/lib/mg/permisos"
import type { Perfil } from "@/lib/mg/tipos"
import { actualizarMiPerfil, cambiarPassword } from "@/app/admin/acciones"
import { Campo, Modal, Tag } from "./ui"

export default function MiCuenta({ perfil, onClose }: { perfil: Perfil; onClose: () => void }) {
  const [nombre, setNombre] = useState(perfil.nombre)
  const [actual, setActual] = useState("")
  const [nueva, setNueva] = useState("")
  const [repetir, setRepetir] = useState("")
  const [aviso, setAviso] = useState<{ ok: boolean; msg: string } | null>(null)
  const [pendiente, arrancar] = useTransition()

  const guardarNombre = () => {
    arrancar(async () => {
      const r = await actualizarMiPerfil(nombre.trim())
      setAviso({ ok: r.ok, msg: r.ok ? "Nombre actualizado." : r.error ?? "No se pudo guardar" })
    })
  }

  const guardarPassword = () => {
    if (nueva !== repetir) { setAviso({ ok: false, msg: "Las dos contraseñas nuevas no coinciden." }); return }
    arrancar(async () => {
      const r = await cambiarPassword(actual, nueva)
      setAviso({ ok: r.ok, msg: r.ok ? "Contraseña cambiada. La sesión actual sigue activa." : r.error ?? "No se pudo cambiar" })
      if (r.ok) { setActual(""); setNueva(""); setRepetir("") }
    })
  }

  return (
    <Modal titulo="Mi cuenta" onClose={onClose} pie={<button className="btn" onClick={onClose}>Cerrar</button>}>
      <Campo label="Correo">
        <span className="small mono">{perfil.email}</span>
      </Campo>
      <Campo label="Rol">
        <Tag outline>{etiquetaRol(perfil.rol)}</Tag>
        <span className="small muted">Solo un owner o admin puede cambiarlo.</span>
      </Campo>

      <Campo label="Nombre" crece>
        <div style={{ display: "flex", gap: 6 }}>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} style={{ flex: 1 }} />
          <button className="btn sm" onClick={guardarNombre} disabled={pendiente || nombre === perfil.nombre}>
            Guardar
          </button>
        </div>
      </Campo>

      <h3>Cambiar contraseña</h3>
      <Campo label="Actual" crece>
        <input type="password" value={actual} autoComplete="current-password"
          onChange={(e) => setActual(e.target.value)} style={{ width: "100%" }} />
      </Campo>
      <Campo label="Nueva" crece>
        <input type="password" value={nueva} minLength={8} autoComplete="new-password"
          onChange={(e) => setNueva(e.target.value)} style={{ width: "100%" }}
          placeholder="Mínimo 8 caracteres" />
      </Campo>
      <Campo label="Repetir nueva" crece>
        <input type="password" value={repetir} autoComplete="new-password"
          onChange={(e) => setRepetir(e.target.value)} style={{ width: "100%" }} />
      </Campo>
      <div className="acciones" style={{ marginTop: 4 }}>
        <button className="btn primary" onClick={guardarPassword}
          disabled={pendiente || !actual || !nueva || !repetir}>
          {pendiente ? "Guardando…" : "Cambiar contraseña"}
        </button>
      </div>

      {aviso ? (
        <div className={aviso.ok ? "alert good" : "alert critical"} style={{ marginTop: 12 }} role="status">
          <span aria-hidden>{aviso.ok ? "✓" : "⚠"}</span><span>{aviso.msg}</span>
        </div>
      ) : null}
    </Modal>
  )
}
