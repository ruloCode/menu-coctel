"use client"

import { useMemo, useState, useTransition } from "react"
import { CATS, NETS, RELACIONES, type CampoRadar } from "@/lib/mg/constantes"
import { audiencia, crecimiento, puntaje, recomendacion, ultimaMedicion } from "@/lib/mg/radar"
import { fmt, fmtLargo, hoy, masDias } from "@/lib/mg/fechas"
import type { FichaRadar, Relacion, Snapshot } from "@/lib/mg/tipos"
import { crearFicha, eliminarFicha, guardarArtista, guardarFicha, registrarMedicion } from "@/app/admin/acciones"
import { Campo, Kpi, Modal, Tag, Vacio } from "./ui"

const num = (n: number) => n.toLocaleString("es-CO")

/** Métrica de "seguidores" de cada red: la que define la audiencia comparable. */
const CLAVE_SEGUIDORES: Record<string, string> = { ig: "ig_seg", tt: "tt_seg", yt: "yt_sub", sp: "sp_oy" }

export default function VistaRadar({ snapshot, puedeEditar }: { snapshot: Snapshot; puedeEditar: boolean }) {
  const [cat, setCat] = useState("todas")
  const [rel, setRel] = useState("todas")
  const [busca, setBusca] = useState("")
  const [ficha, setFicha] = useState<FichaRadar | null>(null)
  const [midiendo, setMidiendo] = useState<FichaRadar | null>(null)
  const [nueva, setNueva] = useState(false)

  const t = hoy()
  const esFestival = cat === "festival"

  const lista = useMemo(() => {
    let l = snapshot.radar
    if (cat !== "todas") l = l.filter((e) => e.cat === cat)
    if (rel !== "todas") l = l.filter((e) => e.rel === rel)
    if (busca) l = l.filter((e) => e.nombre.toLowerCase().includes(busca.toLowerCase()))

    return [...l].sort((a, b) => {
      // Las convocatorias se ordenan por fecha de cierre: lo urgente arriba.
      if (esFestival) {
        return String(a.campos?.cierre ?? "9999") < String(b.campos?.cierre ?? "9999") ? -1 : 1
      }
      const sa = puntaje(a)
      const sb = puntaje(b)
      if (sa === null && sb === null) return a.nombre.localeCompare(b.nombre)
      if (sa === null) return 1
      if (sb === null) return -1
      return sb - sa
    })
  }, [snapshot.radar, cat, rel, busca, esFestival])

  const sinDatos = snapshot.radar.filter((e) => !e.mediciones.length).length
  const porMedir = snapshot.radar.filter((e) => e.proxima && e.proxima <= masDias(t, 14))
  const externos = snapshot.radar.filter((e) => e.origen === "externo").length

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Radar · redes y ecosistema</h1>
          <div className="sub">Roster y prospectos en una sola lista. Cada rol se mide con sus propias métricas.</div>
        </div>
        <div className="spacer" />
        {puedeEditar ? <button className="btn primary" onClick={() => setNueva(true)}>＋ Ficha</button> : null}
      </div>

      <div className="kpis">
        <Kpi valor={snapshot.radar.length} label="Fichas en el radar" />
        <Kpi valor={sinDatos} label="Sin primera medición" />
        <Kpi valor={porMedir.length} label="Mediciones por hacer" ayuda="próximos 14 días" />
        <Kpi valor={externos} label="Prospectos externos" />
      </div>

      {sinDatos ? (
        <div className="alert">
          <span aria-hidden>🟡</span>
          <span>
            <b>{sinDatos} fichas sin primera medición.</b> Sin ese dato base no hay crecimiento ni puntaje:
            el sistema muestra “sin datos”, nunca un 0 engañoso. Empieza por el roster.
          </span>
        </div>
      ) : null}

      <div className="card" style={{ padding: "10px 14px" }}>
        <div className="frow" style={{ margin: 0 }}>
          <label>Categoría</label>
          <select value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="todas">Todas ({snapshot.radar.length})</option>
            {Object.entries(CATS).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
          </select>
          <label style={{ minWidth: "auto" }}>Relación</label>
          <select value={rel} onChange={(e) => setRel(e.target.value)}>
            <option value="todas">Todas</option>
            {RELACIONES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <input
            placeholder="Buscar nombre…" value={busca} onChange={(e) => setBusca(e.target.value)}
            style={{ flex: 1, minWidth: 150 }} aria-label="Buscar ficha por nombre"
          />
        </div>
      </div>

      <div className="card">
        <h2>
          {cat === "todas" ? "Todas las fichas" : CATS[cat].label}{" "}
          <span className="muted small">({lista.length})</span>
        </h2>

        {lista.length === 0 ? (
          <Vacio titulo="No hay fichas con estos filtros" />
        ) : (
          <div className="tabla-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th><th>Categoría</th><th>Relación</th>
                  <th>{esFestival ? "Cierra" : "Audiencia"}</th>
                  <th>{esFestival ? "Costo" : "Δ vs anterior"}</th>
                  <th>Puntaje</th><th>Recomendación</th><th>Próxima medición</th><th />
                </tr>
              </thead>
              <tbody>
                {lista.map((e) => {
                  const s = puntaje(e)
                  const r = recomendacion(e)
                  const g = crecimiento(e)
                  const aud = audiencia(e)
                  const vencida = !!e.proxima && e.proxima < t
                  return (
                    <tr key={e.id}>
                      <td>
                        <b>{e.nombre}</b>{" "}
                        <span className="tag outline" style={{ fontSize: 10 }}>
                          {e.origen === "roster"
                            ? snapshot.artistas.find((a) => a.id === e.artista_id)?.tier === "marca" ? "Marca" : "Compilado"
                            : "Prospecto"}
                        </span>
                      </td>
                      <td className="small">{CATS[e.cat]?.label ?? "—"}</td>
                      <td className="small">{e.rel}</td>
                      <td className="mono">
                        {esFestival
                          ? (e.campos?.cierre ? fmt(String(e.campos.cierre)) : "—")
                          : (aud ? num(aud) : <span className="muted">sin datos</span>)}
                      </td>
                      <td className="mono">
                        {esFestival
                          ? (e.campos?.costo ? `$${num(+e.campos.costo)}` : "—")
                          : g === null
                            ? <span className="muted">—</span>
                            : <span style={{ color: g >= 0 ? "var(--good)" : "var(--critical)" }}>
                                {g >= 0 ? "▲" : "▼"} {Math.abs(g).toFixed(1)}%
                              </span>}
                      </td>
                      <td className="mono">
                        {s === null ? <span className="muted">sin datos</span> : <><b>{s}</b>/100</>}
                      </td>
                      <td>{r ? <Tag color={r[2]}>{r[1]}</Tag> : <span className="muted small">—</span>}</td>
                      <td className={vencida ? "mono small warnrow" : "mono small"} style={{ whiteSpace: "nowrap" }}>
                        {e.proxima ? `${fmt(e.proxima)}${vencida ? " ⚠" : ""}` : <span className="muted">sin agendar</span>}
                      </td>
                      <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        {puedeEditar ? <button className="btn sm" onClick={() => setMidiendo(e)}>＋ Medir</button> : null}{" "}
                        <button className="btn sm" onClick={() => setFicha(e)}>Ficha</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <h2>Cómo funciona el Radar</h2>
        <ul className="small" style={{ paddingLeft: 18, margin: 0, display: "grid", gap: 6 }}>
          <li><b>Una sola lista:</b> los {snapshot.artistas.length} artistas del roster aparecen junto a los prospectos externos, sin duplicados.</li>
          <li><b>Cada rol tiene sus propias métricas.</b> Un artista se mide por audiencia y crecimiento; un músico por nivel técnico, versatilidad, tarifa y cumplimiento; un proveedor por calidad, plazos y precio. Por eso el puntaje de un fotógrafo no se compara con el de un artista.</li>
          <li><b>Seguimiento trimestral:</b> “＋ Medir” abre solo las métricas de esa categoría, precarga los valores anteriores y guarda una foto con fecha. Cada medición agenda la siguiente y la cita aparece en el calendario.</li>
          <li><b>El Δ compara contra la medición inmediatamente anterior.</b> Con una sola medición no hay crecimiento: dice “sin datos”, no 0%.</li>
        </ul>
      </div>

      {ficha ? (
        <DetalleFicha
          ficha={ficha} snapshot={snapshot} puedeEditar={puedeEditar}
          onClose={() => setFicha(null)}
          onMedir={() => { setMidiendo(ficha); setFicha(null) }}
        />
      ) : null}
      {midiendo ? <Medir ficha={midiendo} onClose={() => setMidiendo(null)} /> : null}
      {nueva ? <NuevaFicha onClose={() => setNueva(false)} /> : null}
    </>
  )
}

/* ---------- ficha ---------- */

function EntradaCampo({
  campo, valor, onChange, disabled,
}: {
  campo: CampoRadar
  valor: unknown
  onChange: (v: string | number | boolean) => void
  disabled: boolean
}) {
  const v = valor ?? ""
  if (campo.t === "chk") {
    return <input type="checkbox" checked={!!valor} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
  }
  if (campo.t === "stars") {
    return (
      <select value={String(v)} disabled={disabled} onChange={(e) => onChange(e.target.value ? +e.target.value : "")}>
        <option value="">—</option>
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>{"★".repeat(n)}{"☆".repeat(5 - n)}</option>
        ))}
      </select>
    )
  }
  if (campo.t === "sel") {
    return (
      <select value={String(v)} disabled={disabled} onChange={(e) => onChange(e.target.value)}>
        <option value="">—</option>
        {campo.o?.map((o) => <option key={o}>{o}</option>)}
      </select>
    )
  }
  if (campo.t === "date") {
    return <input type="date" value={String(v)} disabled={disabled} onChange={(e) => onChange(e.target.value)} />
  }
  if (campo.t === "num" || campo.t === "money" || campo.t === "pct") {
    return (
      <input
        type="number" step={campo.t === "pct" ? "0.1" : "1"} value={String(v)} disabled={disabled}
        onChange={(e) => onChange(e.target.value === "" ? "" : +e.target.value)} style={{ width: 120 }}
      />
    )
  }
  return (
    <input value={String(v)} disabled={disabled} onChange={(e) => onChange(e.target.value)} style={{ flex: 1, minWidth: 160 }} />
  )
}

function DetalleFicha({
  ficha, snapshot, puedeEditar, onClose, onMedir,
}: {
  ficha: FichaRadar
  snapshot: Snapshot
  puedeEditar: boolean
  onClose: () => void
  onMedir: () => void
}) {
  const [borrador, setBorrador] = useState(ficha)
  const [error, setError] = useState<string | null>(null)
  const [pendiente, arrancar] = useTransition()

  const c = CATS[borrador.cat] ?? CATS.artista
  const s = puntaje(borrador)
  const r = recomendacion(borrador)

  const guardar = () => {
    arrancar(async () => {
      const res = await guardarFicha(ficha.id, {
        nombre: borrador.nombre, cat: borrador.cat, rel: borrador.rel,
        urls: borrador.urls, campos: borrador.campos,
      })
      // El roster comparte el nombre con la tabla de artistas: si cambia aquí,
      // tiene que cambiar allá o el calendario mostraría otro nombre.
      if (res.ok && ficha.origen === "roster" && ficha.artista_id && borrador.nombre !== ficha.nombre) {
        await guardarArtista(ficha.artista_id, { nombre: borrador.nombre, confirmado: true })
      }
      if (res.ok) onClose()
      else setError(res.error ?? "No se pudo guardar")
    })
  }

  return (
    <Modal
      titulo={<>{borrador.nombre} <span className="tag outline">{ficha.origen === "roster" ? "Roster" : "Prospecto"}</span></>}
      ancho="min(660px, 94vw)"
      onClose={onClose}
      pie={
        <>
          {puedeEditar && ficha.origen === "externo" ? (
            <button className="btn danger" disabled={pendiente} onClick={() => {
              if (!confirm(`¿Borrar la ficha de ${ficha.nombre}?`)) return
              arrancar(async () => { await eliminarFicha(ficha.id, ficha.nombre); onClose() })
            }}>🗑 Borrar</button>
          ) : null}
          {puedeEditar ? <button className="btn" onClick={onMedir}>＋ Medir</button> : null}
          {puedeEditar
            ? <button className="btn primary" onClick={guardar} disabled={pendiente}>
                {pendiente ? "Guardando…" : "Guardar"}
              </button>
            : <button className="btn primary" onClick={onClose}>Cerrar</button>}
        </>
      }
    >
      <p className="small muted">
        {c.label} · {borrador.rel}
        {s !== null ? <> · Puntaje <b>{s}</b>/100</> : null}{" "}
        {r ? <Tag color={r[2]}>{r[1]}</Tag> : null}
      </p>

      <h3>Identidad</h3>
      <Campo label="Nombre" crece>
        <input value={borrador.nombre} disabled={!puedeEditar} style={{ width: "100%" }}
          onChange={(e) => setBorrador({ ...borrador, nombre: e.target.value })} />
      </Campo>
      <Campo label="Categoría">
        <select value={borrador.cat} disabled={!puedeEditar}
          onChange={(e) => setBorrador({ ...borrador, cat: e.target.value })}>
          {Object.entries(CATS).map(([k, cc]) => <option key={k} value={k}>{cc.label}</option>)}
        </select>
      </Campo>
      <Campo label="Relación con MG">
        <select value={borrador.rel} disabled={!puedeEditar}
          onChange={(e) => setBorrador({ ...borrador, rel: e.target.value as Relacion })}>
          {RELACIONES.map((x) => <option key={x} value={x}>{x}</option>)}
        </select>
      </Campo>

      <h3>Redes (URL)</h3>
      {c.nets.map((n) => (
        <Campo key={n} label={<>{NETS[n].icon} {NETS[n].label}</>} crece>
          <input
            value={borrador.urls?.[n] ?? ""} placeholder="https://…" disabled={!puedeEditar} style={{ width: "100%" }}
            onChange={(e) => setBorrador({ ...borrador, urls: { ...borrador.urls, [n]: e.target.value } })}
          />
        </Campo>
      ))}

      <h3>Datos de {c.label.replace(/^\S+\s/, "")}</h3>
      {c.fields.map((f) => (
        <Campo key={f.k} label={f.l}>
          <EntradaCampo
            campo={f} valor={borrador.campos?.[f.k]} disabled={!puedeEditar}
            onChange={(v) => setBorrador({ ...borrador, campos: { ...borrador.campos, [f.k]: v } })}
          />
        </Campo>
      ))}

      <h3>Historial de mediciones</h3>
      {borrador.mediciones.length ? (
        <div className="tabla-wrap">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                {c.nets.map((n) => <th key={n}>{NETS[n].icon}</th>)}
                <th>Audiencia</th>
              </tr>
            </thead>
            <tbody>
              {[...borrador.mediciones].reverse().map((snap, i) => (
                <tr key={i}>
                  <td className="mono small">{fmt(snap.d)}</td>
                  {c.nets.map((n) => (
                    <td key={n} className="mono small">
                      {snap.m[CLAVE_SEGUIDORES[n]] ? num(+snap.m[CLAVE_SEGUIDORES[n]]) : "—"}
                    </td>
                  ))}
                  <td className="mono small"><b>{num(audiencia(borrador, snap.m))}</b></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="muted small">Sin mediciones todavía. Usa “＋ Medir” para tomar la primera.</p>
      )}

      {error ? <div className="alert critical"><span aria-hidden>⚠</span><span>{error}</span></div> : null}
    </Modal>
  )
}

function Medir({ ficha, onClose }: { ficha: FichaRadar; onClose: () => void }) {
  const c = CATS[ficha.cat] ?? CATS.artista
  const previa = ultimaMedicion(ficha) ?? {}
  const [valores, setValores] = useState<Record<string, string>>(() => {
    const v: Record<string, string> = {}
    c.nets.forEach((n) => NETS[n].metrics.forEach(([k]) => { v[k] = previa[k] !== undefined ? String(previa[k]) : "" }))
    return v
  })
  const [proxima, setProxima] = useState(masDias(hoy(), 90))
  const [error, setError] = useState<string | null>(null)
  const [pendiente, arrancar] = useTransition()

  const guardar = () => {
    const m: Record<string, number> = {}
    Object.entries(valores).forEach(([k, v]) => { if (v !== "") m[k] = +v })
    if (!Object.keys(m).length) { setError("Escribe al menos una métrica."); return }
    arrancar(async () => {
      const r = await registrarMedicion(ficha.id, m, proxima || null)
      if (r.ok) onClose()
      else setError(r.error ?? "No se pudo guardar")
    })
  }

  return (
    <Modal
      titulo={`＋ Medir · ${ficha.nombre}`}
      onClose={onClose}
      pie={
        <>
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn primary" onClick={guardar} disabled={pendiente}>
            {pendiente ? "Guardando…" : "Guardar medición"}
          </button>
        </>
      }
    >
      <p className="small muted">
        Solo las métricas de <b>{c.label}</b>. Los valores vienen precargados con la medición anterior
        {ficha.mediciones.length ? ` (${fmt(ficha.mediciones[ficha.mediciones.length - 1].d)})` : " — es la primera"}.
        La fecha se estampa sola: <b>{fmtLargo(hoy())}</b>.
      </p>

      {c.nets.map((n) => (
        <div key={n}>
          <h3>{NETS[n].icon} {NETS[n].label}</h3>
          {NETS[n].metrics.map(([k, l]) => (
            <Campo key={k} label={l}>
              <input
                type="number" min={0} value={valores[k] ?? ""} style={{ width: 140 }}
                onChange={(e) => setValores((v) => ({ ...v, [k]: e.target.value }))}
              />
            </Campo>
          ))}
        </div>
      ))}

      <Campo label="Próxima medición">
        <input type="date" value={proxima} onChange={(e) => setProxima(e.target.value)} />
        <span className="small muted">Aparece como cita en el calendario.</span>
      </Campo>

      {error ? <div className="alert critical"><span aria-hidden>⚠</span><span>{error}</span></div> : null}
    </Modal>
  )
}

function NuevaFicha({ onClose }: { onClose: () => void }) {
  const [nombre, setNombre] = useState("")
  const [cat, setCat] = useState("venue")
  const [rel, setRel] = useState<Relacion>("no hemos hablado")
  const [error, setError] = useState<string | null>(null)
  const [pendiente, arrancar] = useTransition()

  const crear = () => {
    if (!nombre.trim()) { setError("Ponle un nombre a la ficha."); return }
    arrancar(async () => {
      const r = await crearFicha({ nombre: nombre.trim(), cat, rel })
      if (r.ok) onClose()
      else setError(r.error ?? "No se pudo crear")
    })
  }

  return (
    <Modal
      titulo="Nueva ficha en el radar"
      onClose={onClose}
      pie={
        <>
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn primary" onClick={crear} disabled={pendiente}>
            {pendiente ? "Creando…" : "Crear ficha"}
          </button>
        </>
      }
    >
      <p className="small muted">
        Para alguien de fuera del roster: un bar, un productor, un creador, una marca.
        Los artistas del roster ya están en la lista.
      </p>
      <Campo label="Nombre" crece>
        <input value={nombre} onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: Bar La Trampa" style={{ width: "100%" }} autoFocus />
      </Campo>
      <Campo label="Categoría">
        <select value={cat} onChange={(e) => setCat(e.target.value)}>
          {Object.entries(CATS).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
        </select>
      </Campo>
      <Campo label="Relación con MG">
        <select value={rel} onChange={(e) => setRel(e.target.value as Relacion)}>
          {RELACIONES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </Campo>
      {error ? <div className="alert critical"><span aria-hidden>⚠</span><span>{error}</span></div> : null}
    </Modal>
  )
}
