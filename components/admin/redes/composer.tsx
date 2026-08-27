"use client"

import { useMemo, useState, useTransition } from "react"
import { ESTADOS_POST, HORARIOS_DEFAULT, PILARES, PLATS, SPECS } from "@/lib/mg/constantes"
import { fmt, hoy } from "@/lib/mg/fechas"
import { cuentas, nombreCuenta } from "@/lib/mg/motor"
import { nombreAsset } from "@/lib/mg/plan"
import type { EstadoPost, Metricas, Pilar, Plataforma, Publicacion, Snapshot } from "@/lib/mg/tipos"
import { eliminarPublicacion, guardarPublicacion, revisarPublicacion } from "@/app/admin/acciones"
import { Campo, Modal, Tag } from "../ui"

export function publicacionVacia(fecha = hoy()): Publicacion {
  return {
    id: `post_${Date.now().toString(36)}`,
    cuenta: "mg", proyecto_id: null, plataforma: "ig", formato: "Reel", pilar: "musica",
    fecha, hora: HORARIOS_DEFAULT.ig,
    titulo: "", hook: "", copy: "", hashtags: "", cta: "", link: "",
    asset_url: "", asset_name: "", thumb_url: "", version: 1,
    estado: "idea", responsable_id: null, notas: "",
    variantes: {}, m48: {}, m7: {}, aprobaciones: [],
  }
}

/** Copy y hashtags efectivos: la variante por red gana sobre el texto base.
 *  Es reversible — borrar la variante devuelve el copy base intacto. */
const copyDe = (p: Publicacion) => p.variantes?.[p.plataforma]?.copy ?? p.copy
const tagsDe = (p: Publicacion) => p.variantes?.[p.plataforma]?.hashtags ?? p.hashtags

export default function Composer({
  publicacion, snapshot, puedeEditar, puedeAprobar, onClose,
}: {
  publicacion: Publicacion
  snapshot: Snapshot
  puedeEditar: boolean
  puedeAprobar: boolean
  onClose: () => void
}) {
  const [p, setP] = useState<Publicacion>(publicacion)
  const [error, setError] = useState<string | null>(null)
  const [pendiente, arrancar] = useTransition()
  const nuevo = !snapshot.publicaciones.some((x) => x.id === publicacion.id)

  const spec = SPECS[p.formato] ?? SPECS.Reel
  const plat = PLATS[p.plataforma]
  const limite = spec.copy || 2200
  const copyActual = copyDe(p)
  const hayVariante = p.variantes?.[p.plataforma] !== undefined

  const set = <K extends keyof Publicacion>(k: K, v: Publicacion[K]) => setP((x) => ({ ...x, [k]: v }))

  // Cambiar de red obliga a revisar formato y hora: no todos los formatos existen
  // en todas las plataformas.
  const cambiarPlataforma = (v: Plataforma) => {
    setP((x) => ({
      ...x,
      plataforma: v,
      formato: PLATS[v].formats.includes(x.formato) ? x.formato : PLATS[v].formats[0],
      hora: HORARIOS_DEFAULT[v],
    }))
  }

  const setCopy = (v: string) => {
    if (hayVariante) {
      setP((x) => ({ ...x, variantes: { ...x.variantes, [x.plataforma]: { ...x.variantes[x.plataforma], copy: v } } }))
    } else {
      set("copy", v)
    }
  }
  const setTags = (v: string) => {
    if (hayVariante) {
      setP((x) => ({ ...x, variantes: { ...x.variantes, [x.plataforma]: { ...x.variantes[x.plataforma], hashtags: v } } }))
    } else {
      set("hashtags", v)
    }
  }

  const guardar = () => {
    arrancar(async () => {
      const r = await guardarPublicacion(p)
      if (r.ok) onClose()
      else setError(r.error ?? "No se pudo guardar")
    })
  }

  const revisar = (accion: "aprobado" | "cambios") => {
    if (accion === "cambios") {
      const nota = prompt("¿Qué hay que corregir? Sin esta nota el rechazo se pierde en un chat.")
      if (nota === null) return
      if (!nota.trim()) { setError("Escribe qué corregir."); return }
      arrancar(async () => {
        const r = await revisarPublicacion(p.id, "cambios", nota.trim())
        if (r.ok) onClose(); else setError(r.error ?? "No se pudo guardar")
      })
      return
    }
    arrancar(async () => {
      const r = await revisarPublicacion(p.id, "aprobado")
      if (r.ok) onClose(); else setError(r.error ?? "No se pudo guardar")
    })
  }

  return (
    <Modal
      titulo={
        <>
          {nuevo ? "Nueva publicación" : "Editar publicación"}{" "}
          <Tag color={ESTADOS_POST[p.estado].color}>{ESTADOS_POST[p.estado].icon} {ESTADOS_POST[p.estado].label}</Tag>
        </>
      }
      ancho="min(900px, 96vw)"
      onClose={onClose}
      pie={
        <>
          {!nuevo && puedeEditar ? (
            <button className="btn danger" disabled={pendiente} onClick={() => {
              if (!confirm("¿Eliminar esta publicación?")) return
              arrancar(async () => { await eliminarPublicacion(p.id, p.titulo); onClose() })
            }}>Eliminar</button>
          ) : null}
          {!nuevo && p.estado === "revision" && puedeAprobar ? (
            <>
              <button className="btn" disabled={pendiente} onClick={() => revisar("cambios")}>↩️ Pedir cambios</button>
              <button className="btn brand" disabled={pendiente} onClick={() => revisar("aprobado")}>👍 Aprobar</button>
            </>
          ) : null}
          <button className="btn" onClick={onClose}>Cerrar</button>
          {puedeEditar ? (
            <button className="btn primary" onClick={guardar} disabled={pendiente}>
              {pendiente ? "Guardando…" : "Guardar"}
            </button>
          ) : null}
        </>
      }
    >
      <div className="composer">
        <div>
          <Campo label="Cuenta">
            <select value={p.cuenta} disabled={!puedeEditar}
              onChange={(e) => setP((x) => ({ ...x, cuenta: e.target.value, proyecto_id: null }))}>
              {cuentas(snapshot).map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}{c.id === "mg" ? " · sello" : ""}</option>
              ))}
            </select>
          </Campo>

          <Campo label="Red y formato">
            <select value={p.plataforma} disabled={!puedeEditar}
              onChange={(e) => cambiarPlataforma(e.target.value as Plataforma)}>
              {Object.entries(PLATS).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
            </select>
            <select value={p.formato} disabled={!puedeEditar} onChange={(e) => set("formato", e.target.value)}>
              {plat.formats.map((f) => <option key={f}>{f}</option>)}
            </select>
          </Campo>

          <Campo label="Cuándo">
            <input type="date" value={p.fecha} disabled={!puedeEditar} onChange={(e) => set("fecha", e.target.value)} />
            <input type="time" value={p.hora} disabled={!puedeEditar} style={{ width: 108 }}
              onChange={(e) => set("hora", e.target.value)} />
          </Campo>

          <Campo label="Pilar y lanzamiento">
            <select value={p.pilar} disabled={!puedeEditar} onChange={(e) => set("pilar", e.target.value as Pilar)}>
              {Object.entries(PILARES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <select value={p.proyecto_id ?? ""} disabled={!puedeEditar}
              onChange={(e) => set("proyecto_id", e.target.value || null)}>
              <option value="">— sin lanzamiento —</option>
              {snapshot.proyectos
                .filter((x) => p.cuenta === "mg" || x.artista_id === p.cuenta)
                .map((x) => <option key={x.id} value={x.id}>{x.titulo}</option>)}
            </select>
          </Campo>

          <h3>Contenido</h3>
          <Campo label="Título interno" crece>
            <input value={p.titulo} disabled={!puedeEditar} style={{ width: "100%" }}
              placeholder="Para identificarla en el calendario" onChange={(e) => set("titulo", e.target.value)} />
          </Campo>
          <Campo label="Hook (3 s)" crece>
            <input value={p.hook} disabled={!puedeEditar} style={{ width: "100%" }}
              placeholder="Lo que evita que pasen de largo" onChange={(e) => set("hook", e.target.value)} />
          </Campo>

          <div className="frow" style={{ alignItems: "flex-start" }}>
            <label>
              Copy
              {hayVariante ? <><br /><span className="small" style={{ color: "var(--c-content)" }}>versión {plat.label}</span></> : null}
            </label>
            <div className="crece">
              <textarea rows={5} value={copyActual} disabled={!puedeEditar} style={{ width: "100%" }}
                onChange={(e) => setCopy(e.target.value)} />
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginTop: 4 }}>
                <span className="small" style={{ color: copyActual.length > limite ? "var(--critical)" : "var(--muted)" }}>
                  {copyActual.length}/{limite}{spec.opt ? ` · óptimo ~${spec.opt}` : ""}
                </span>
                <span className="spacer" />
                {puedeEditar ? (
                  hayVariante ? (
                    <button className="chipbtn" onClick={() => {
                      const v = { ...p.variantes }
                      delete v[p.plataforma]
                      set("variantes", v)
                    }}>↺ Volver al copy base</button>
                  ) : (
                    <button className="chipbtn" onClick={() =>
                      set("variantes", { ...p.variantes, [p.plataforma]: { copy: p.copy, hashtags: p.hashtags } })
                    }>✎ Personalizar para {plat.label}</button>
                  )
                ) : null}
              </div>
            </div>
          </div>

          <Campo label="Hashtags" crece>
            <input value={tagsDe(p)} disabled={!puedeEditar} style={{ width: "100%" }}
              placeholder={spec.tags} onChange={(e) => setTags(e.target.value)} />
          </Campo>
          <Campo label="CTA y link">
            <input value={p.cta} disabled={!puedeEditar} style={{ width: 150 }}
              placeholder="link en bio / pre-save" onChange={(e) => set("cta", e.target.value)} />
            <input value={p.link} disabled={!puedeEditar} style={{ flex: 1, minWidth: 180 }}
              placeholder="https://…" onChange={(e) => set("link", e.target.value)} />
          </Campo>

          <h3>Archivo</h3>
          <Campo label="Nombre" crece>
            <div style={{ display: "flex", gap: 6 }}>
              <input value={p.asset_name} disabled={!puedeEditar} style={{ flex: 1 }}
                placeholder="AAAAMMDD_ARTISTA_…" onChange={(e) => set("asset_name", e.target.value)} />
              {puedeEditar ? (
                <button className="btn sm" title="Generar el nombre estándar"
                  onClick={() => set("asset_name", nombreAsset(snapshot, p))}>✨</button>
              ) : null}
            </div>
          </Campo>
          <Campo label="Enlace en la nube" crece>
            <input value={p.asset_url} disabled={!puedeEditar} style={{ width: "100%" }}
              placeholder="https://drive.google.com/…" onChange={(e) => set("asset_url", e.target.value)} />
          </Campo>
          <Campo label="Miniatura y versión">
            <input value={p.thumb_url} disabled={!puedeEditar} style={{ flex: 1, minWidth: 160 }}
              placeholder="Link directo a una imagen" onChange={(e) => set("thumb_url", e.target.value)} />
            <input type="number" min={1} value={p.version} disabled={!puedeEditar} style={{ width: 66 }}
              title="Versión" onChange={(e) => set("version", +e.target.value || 1)} />
          </Campo>

          <h3>Equipo</h3>
          <Campo label="Estado y responsable">
            <select value={p.estado} disabled={!puedeEditar} onChange={(e) => set("estado", e.target.value as EstadoPost)}>
              {Object.entries(ESTADOS_POST).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
            </select>
            <select value={p.responsable_id ?? ""} disabled={!puedeEditar}
              onChange={(e) => set("responsable_id", e.target.value || null)}
              aria-label="Responsable de la pieza">
              <option value="">— sin responsable —</option>
              {snapshot.equipo.map((m) => <option key={m.id} value={m.id}>{m.nombre || m.email}</option>)}
            </select>
          </Campo>
          <Campo label="Notas" crece>
            <input value={p.notas} disabled={!puedeEditar} style={{ width: "100%" }}
              placeholder="Correcciones, referencias…" onChange={(e) => set("notas", e.target.value)} />
          </Campo>

          {p.estado === "publicado" ? (
            <>
              <h3>Resultados</h3>
              <Métricas titulo="A las 48 horas" valores={p.m48} disabled={!puedeEditar}
                onChange={(m) => set("m48", m)} />
              <Métricas titulo="A los 7 días" valores={p.m7} disabled={!puedeEditar}
                onChange={(m) => set("m7", m)} />
            </>
          ) : null}

          {p.aprobaciones.length ? (
            <>
              <h3>Historial</h3>
              <ul className="small muted" style={{ paddingLeft: 18, margin: 0 }}>
                {[...p.aprobaciones].reverse().map((a, i) => (
                  <li key={i}>
                    <span className="mono">{fmt(a.d)}</span> — {a.quien}{" "}
                    {a.accion === "aprobado" ? "aprobó" : a.accion === "cambios" ? "pidió cambios" : "envió a revisión"}
                    {a.nota ? `: ${a.nota}` : ""}
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {error ? <div className="alert critical" style={{ marginTop: 12 }}><span aria-hidden>⚠</span><span>{error}</span></div> : null}
        </div>

        <Vista p={p} snapshot={snapshot} />
      </div>
    </Modal>
  )
}

function Métricas({
  titulo, valores, disabled, onChange,
}: {
  titulo: string
  valores: Metricas
  disabled: boolean
  onChange: (m: Metricas) => void
}) {
  const campos: [keyof Metricas, string][] = [
    ["alcance", "Alcance"], ["likes", "Me gusta"], ["comentarios", "Comentarios"],
    ["guardados", "Guardados"], ["compartidos", "Compartidos"], ["seguidores", "Seguidores nuevos"],
  ]
  return (
    <div className="frow" style={{ alignItems: "flex-start" }}>
      <label>{titulo}</label>
      <div className="crece" style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {campos.map(([k, l]) => (
          <label key={k} className="small muted" style={{ display: "grid", gap: 2 }}>
            {l}
            <input
              type="number" min={0} value={valores?.[k as keyof Metricas] ?? ""} disabled={disabled} style={{ width: 92 }}
              onChange={(e) => onChange({ ...valores, [k]: e.target.value === "" ? undefined : +e.target.value })}
            />
          </label>
        ))}
      </div>
    </div>
  )
}

/** Vista previa en vivo: muestra exactamente dónde se corta el copy y cómo
 *  queda el hook sobre el video, que es donde se pierde la mayoría de piezas. */
function Vista({ p, snapshot }: { p: Publicacion; snapshot: Snapshot }) {
  const spec = SPECS[p.formato] ?? SPECS.Reel
  const plat = PLATS[p.plataforma]
  const limite = spec.copy || 2200
  const copy = copyDe(p)
  const tags = tagsDe(p)

  const cuenta = nombreCuenta(snapshot, p.cuenta)
  const handle = "@" + cuenta.toLowerCase().replace(/[^a-z0-9]/g, "")

  const alto = useMemo(() => {
    const [a, b] = (spec.ratio || "9:16").split(":").map(Number)
    return Math.min(Math.round(260 * (b / a)), 300)
  }, [spec.ratio])

  const visible = copy.slice(0, limite)
  const cortado = copy.slice(limite)

  return (
    <div>
      <div className="phone">
        <div className="ph-top">
          <span className="ph-av" aria-hidden />
          <span>{handle}</span>
          <span className="spacer" />
          <span className="muted" aria-hidden>{plat.icon}</span>
        </div>
        <div className="ph-media" style={{ height: alto }}>
          {p.thumb_url
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={p.thumb_url} alt="" onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
            : <span>{p.formato} · {spec.res}<br />{spec.ratio}</span>}
          {p.hook ? (
            <span style={{
              position: "absolute", left: 8, right: 8, top: 10, color: "#fff",
              fontWeight: 800, fontSize: 13, textShadow: "0 1px 4px rgba(0,0,0,.9)", lineHeight: 1.2,
            }}>{p.hook.slice(0, 70)}</span>
          ) : null}
        </div>
        <div className="ph-acts" aria-hidden>♡ ○ ➤</div>
        <div className="ph-body">
          <b>{handle}</b> {visible}
          {cortado ? <span className="cut">{cortado}</span> : null}
          {tags ? <div className="tags" style={{ marginTop: 4 }}>{tags}</div> : null}
        </div>
      </div>

      <p className="small muted" style={{ lineHeight: 1.4, marginTop: 10 }}>
        Sale <b>{fmt(p.fecha)}</b> a las <b>{p.hora}</b><br />
        {spec.ratio ? `${spec.ratio} · ${spec.res}` : null}
        {spec.dur && spec.dur !== "—" ? <><br />{spec.dur}</> : null}
      </p>
      {cortado ? (
        <p className="small" style={{ color: "var(--critical)" }}>
          ⚠ Lo marcado en rojo no se va a ver: pasa del límite de {limite} caracteres.
        </p>
      ) : null}
      {spec.nota ? <p className="small" style={{ color: "var(--serious)" }}>⚠ {spec.nota}</p> : null}
      <p className="small muted">🕐 {plat.best}</p>
    </div>
  )
}
