"use client"

import { useMemo, useState, useTransition } from "react"
import { DIAS, MESES, claveSemana, fmt, hoy, iso, masDias, D } from "@/lib/mg/fechas"
import {
  ESTADOS_POST, HORARIOS_DEFAULT, PILARES, PLATS, SLOTS_DEFAULT, SPECS,
} from "@/lib/mg/constantes"
import { cuentas, nombreCuenta, proyectoPorId } from "@/lib/mg/motor"
import { generarPlan, nombreAsset, tasaInteraccion } from "@/lib/mg/plan"
import type { EstadoPost, Plataforma, Publicacion, Snapshot } from "@/lib/mg/tipos"
import { crearPublicaciones, guardarPublicacion } from "@/app/admin/acciones"
import { Campo, Kpi, Modal, Tag, Vacio } from "../ui"
import Composer, { publicacionVacia } from "./composer"

type SubVista = "mes" | "semana" | "lista" | "tablero" | "grid" | "assets" | "cuentas" | "guia"

const VISTAS: [SubVista, string][] = [
  ["mes", "🗓 Mes"], ["semana", "📆 Semana"], ["lista", "📋 Lista"], ["tablero", "🗂 Tablero"],
  ["grid", "▦ Grid IG"], ["assets", "📁 Archivos"], ["cuentas", "📊 Cuentas"], ["guia", "📐 Guía"],
]

export default function VistaRedes({
  snapshot, puedeEditar, puedeAprobar, miArtista,
}: {
  snapshot: Snapshot
  puedeEditar: boolean
  puedeAprobar: boolean
  /** Para el rol artista: solo aprueba lo de su cuenta. */
  miArtista: string | null
}) {
  const [vista, setVista] = useState<SubVista>("mes")
  const [cuenta, setCuenta] = useState("todas")
  const [plat, setPlat] = useState("todas")
  const [estado, setEstado] = useState("todas")
  const [busca, setBusca] = useState("")
  const [editando, setEditando] = useState<Publicacion | null>(null)
  const [generando, setGenerando] = useState(false)

  const t = hoy()
  const pendientes = snapshot.publicaciones.filter((p) => p.estado === "revision").length
  const errores = snapshot.publicaciones.filter((p) => p.estado === "error").length

  const filtradas = useMemo(() => {
    let l = snapshot.publicaciones
    if (cuenta !== "todas") l = l.filter((p) => p.cuenta === cuenta)
    if (plat !== "todas") l = l.filter((p) => p.plataforma === plat)
    if (estado !== "todas") l = l.filter((p) => p.estado === estado)
    if (busca) {
      const q = busca.toLowerCase()
      const nombre = (id: string | null) => snapshot.equipo.find((m) => m.id === id)?.nombre ?? ""
      l = l.filter((p) => `${p.titulo} ${p.hook} ${p.copy} ${nombre(p.responsable_id)}`.toLowerCase().includes(q))
    }
    return [...l].sort((a, b) => (a.fecha === b.fecha ? a.hora.localeCompare(b.hora) : a.fecha < b.fecha ? -1 : 1))
  }, [snapshot.publicaciones, snapshot.equipo, cuenta, plat, estado, busca])

  const abrirNueva = (fecha?: string) => setEditando(publicacionVacia(fecha ?? t))

  const conFiltros = ["mes", "semana", "lista", "tablero", "grid", "assets"].includes(vista)

  return (
    <>
      <div className="topbar" style={{ marginBottom: 10 }}>
        <div>
          <h1>Redes</h1>
          <div className="sub">Calendario de contenido de las {snapshot.artistas.length + 1} cuentas, con aprobación y métricas.</div>
        </div>
        <div className="spacer" />
        {puedeEditar ? (
          <>
            <button className="btn" onClick={() => setGenerando(true)}>⚡ Generar plan</button>
            <button className="btn primary" onClick={() => abrirNueva()}>＋ Crear publicación</button>
          </>
        ) : null}
      </div>

      <div style={{ overflowX: "auto", marginBottom: 12 }}>
        <div className="seg">
          {VISTAS.map(([k, l]) => (
            <button key={k} className={vista === k ? "on" : ""} onClick={() => setVista(k)}>{l}</button>
          ))}
        </div>
      </div>

      {errores ? (
        <div className="banner" style={{ borderColor: "var(--critical)" }}>
          <span aria-hidden>🔴</span>
          <b style={{ background: "var(--critical)" }}>{errores}</b>
          <span>{errores === 1 ? "publicación falló" : "publicaciones fallaron"} al publicarse. Revísalas y vuelve a intentarlo.</span>
          <button className="btn sm" style={{ marginLeft: "auto" }}
            onClick={() => { setEstado("error"); setVista("lista") }}>Ver</button>
        </div>
      ) : null}

      {pendientes ? (
        <div className="banner">
          <span aria-hidden>👀</span>
          <b>{pendientes}</b>
          <span>{pendientes === 1 ? "pieza espera" : "piezas esperan"} aprobación.</span>
          <button className="btn sm" style={{ marginLeft: "auto" }}
            onClick={() => { setEstado("revision"); setVista("lista") }}>Revisar ahora</button>
        </div>
      ) : null}

      {conFiltros ? (
        <div className="card" style={{ padding: "10px 14px" }}>
          <div className="frow" style={{ margin: 0 }}>
            <select value={cuenta} onChange={(e) => setCuenta(e.target.value)} aria-label="Filtrar por cuenta">
              <option value="todas">👥 Todas las cuentas</option>
              {cuentas(snapshot).map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}{c.id === "mg" ? " · sello" : ""}</option>
              ))}
            </select>
            <select value={plat} onChange={(e) => setPlat(e.target.value)} aria-label="Filtrar por red">
              <option value="todas">Todas las redes</option>
              {Object.entries(PLATS).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
            </select>
            <select value={estado} onChange={(e) => setEstado(e.target.value)} aria-label="Filtrar por estado">
              <option value="todas">Todos los estados</option>
              {Object.entries(ESTADOS_POST).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
            </select>
            <input placeholder="Buscar…" value={busca} onChange={(e) => setBusca(e.target.value)}
              style={{ flex: 1, minWidth: 130 }} aria-label="Buscar publicación" />
            {cuenta !== "todas" || plat !== "todas" || estado !== "todas" || busca ? (
              <button className="btn sm ghost" onClick={() => { setCuenta("todas"); setPlat("todas"); setEstado("todas"); setBusca("") }}>
                Limpiar ({filtradas.length})
              </button>
            ) : <span className="small muted">{filtradas.length} piezas</span>}
          </div>
        </div>
      ) : null}

      {vista === "mes" ? <Mes posts={filtradas} snapshot={snapshot} onAbrir={setEditando} onNueva={abrirNueva} puedeEditar={puedeEditar} /> : null}
      {vista === "semana" ? <Semana posts={filtradas} snapshot={snapshot} onAbrir={setEditando} onNueva={abrirNueva} puedeEditar={puedeEditar} /> : null}
      {vista === "lista" ? <Lista posts={filtradas} snapshot={snapshot} onAbrir={setEditando} /> : null}
      {vista === "tablero" ? <Tablero posts={filtradas} snapshot={snapshot} onAbrir={setEditando} puedeEditar={puedeEditar} /> : null}
      {vista === "grid" ? <GridIg posts={filtradas} snapshot={snapshot} cuenta={cuenta} onAbrir={setEditando} /> : null}
      {vista === "assets" ? <Assets posts={filtradas} snapshot={snapshot} onAbrir={setEditando} /> : null}
      {vista === "cuentas" ? <Cuentas snapshot={snapshot} onVerCuenta={(id) => { setCuenta(id); setVista("lista") }} /> : null}
      {vista === "guia" ? <Guia snapshot={snapshot} /> : null}

      {editando ? (
        <Composer
          publicacion={editando}
          snapshot={snapshot}
          puedeEditar={puedeEditar}
          puedeAprobar={puedeAprobar && (!miArtista || editando.cuenta === miArtista)}
          onClose={() => setEditando(null)}
        />
      ) : null}

      {generando ? <GenerarPlan snapshot={snapshot} onClose={() => setGenerando(false)} /> : null}
    </>
  )
}

/* ---------- mes ---------- */
function Mes({
  posts, snapshot, onAbrir, onNueva, puedeEditar,
}: {
  posts: Publicacion[]
  snapshot: Snapshot
  onAbrir: (p: Publicacion) => void
  onNueva: (fecha: string) => void
  puedeEditar: boolean
}) {
  const ahora = new Date()
  const [cursor, setCursor] = useState({ y: ahora.getFullYear(), m: ahora.getMonth() })
  const t = hoy()

  const porDia = useMemo(() => {
    const m: Record<string, Publicacion[]> = {}
    posts.forEach((p) => { (m[p.fecha] ||= []).push(p) })
    return m
  }, [posts])

  const celdas = useMemo(() => {
    const primero = new Date(cursor.y, cursor.m, 1, 12)
    const inicio = new Date(primero)
    inicio.setDate(1 - primero.getDay())
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(inicio)
      d.setDate(inicio.getDate() + i)
      return { ds: iso(d), delMes: d.getMonth() === cursor.m, num: d.getDate() }
    })
  }, [cursor])

  const mover = (n: number) => setCursor((c) => {
    let m = c.m + n, y = c.y
    if (m < 0) { m = 11; y-- }
    if (m > 11) { m = 0; y++ }
    return { y, m }
  })

  return (
    <div className="card">
      <div className="frow" style={{ marginBottom: 12 }}>
        <div className="seg">
          <button onClick={() => mover(-1)} aria-label="Mes anterior">‹</button>
          <button onClick={() => setCursor({ y: ahora.getFullYear(), m: ahora.getMonth() })}>Hoy</button>
          <button onClick={() => mover(1)} aria-label="Mes siguiente">›</button>
        </div>
        <strong style={{ textTransform: "capitalize" }}>{MESES[cursor.m]} {cursor.y}</strong>
      </div>

      <div className="cal-head" aria-hidden>{DIAS.map((d) => <div key={d}>{d}</div>)}</div>
      <div className="cal-grid">
        {celdas.map((c) => {
          const lista = porDia[c.ds] ?? []
          return (
            <div key={c.ds} className={`cal-cell${c.delMes ? "" : " dim"}${c.ds === t ? " today" : ""}`}
              onDoubleClick={() => puedeEditar && onNueva(c.ds)}>
              <span className="dnum">{c.num}</span>
              {lista.slice(0, 3).map((p) => (
                <button key={p.id} className="chip" style={{ background: PLATS[p.plataforma].color }}
                  title={`${ESTADOS_POST[p.estado].label} — ${p.titulo || p.formato}`}
                  onClick={() => onAbrir(p)}>
                  {ESTADOS_POST[p.estado].icon} {p.hora} {p.titulo || p.formato}
                </button>
              ))}
              {lista.length > 3 ? <span className="chip more">+{lista.length - 3} más</span> : null}
            </div>
          )
        })}
      </div>
      {puedeEditar ? <p className="small muted" style={{ marginTop: 8, marginBottom: 0 }}>Doble clic en un día para crear una publicación ahí.</p> : null}
    </div>
  )
}

/* ---------- semana ---------- */
function Semana({
  posts, snapshot, onAbrir, onNueva, puedeEditar,
}: {
  posts: Publicacion[]
  snapshot: Snapshot
  onAbrir: (p: Publicacion) => void
  onNueva: (fecha: string) => void
  puedeEditar: boolean
}) {
  const [lunes, setLunes] = useState(claveSemana(hoy()))
  const dias = Array.from({ length: 7 }, (_, i) => masDias(lunes, i))
  const t = hoy()

  return (
    <div className="card">
      <div className="frow" style={{ marginBottom: 12 }}>
        <div className="seg">
          <button onClick={() => setLunes(masDias(lunes, -7))} aria-label="Semana anterior">‹</button>
          <button onClick={() => setLunes(claveSemana(hoy()))}>Esta semana</button>
          <button onClick={() => setLunes(masDias(lunes, 7))} aria-label="Semana siguiente">›</button>
        </div>
        <strong>Semana del {fmt(lunes)}</strong>
      </div>

      <div className="tablero">
        {dias.map((d) => {
          const lista = posts.filter((p) => p.fecha === d)
          return (
            <div className="col" key={d} style={{ flex: "1 0 158px" }}>
              <h3>
                <span style={{ color: d === t ? "var(--brand)" : undefined }}>
                  {DIAS[D(d).getDay()]} {D(d).getDate()}
                </span>
                <span className="n">{lista.length || ""}</span>
              </h3>
              {lista.map((p) => (
                <button key={p.id} className="mini" onClick={() => onAbrir(p)}>
                  <b>{p.hora} {PLATS[p.plataforma].icon}</b>
                  {p.titulo || p.formato}
                  <div className="small muted">{ESTADOS_POST[p.estado].icon} {nombreCuenta(snapshot, p.cuenta)}</div>
                </button>
              ))}
              {puedeEditar ? <button className="chipbtn" style={{ width: "100%" }} onClick={() => onNueva(d)}>＋</button> : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ---------- lista ---------- */
function Lista({ posts, snapshot, onAbrir }: { posts: Publicacion[]; snapshot: Snapshot; onAbrir: (p: Publicacion) => void }) {
  const t = hoy()
  if (!posts.length) return <div className="card"><Vacio titulo="Todavía no hay nada agendado con estos filtros" /></div>

  return (
    <div className="card">
      <div className="tabla-wrap">
        <table>
          <thead>
            <tr><th>Cuándo</th><th>Cuenta</th><th>Red</th><th>Pieza</th><th>Pilar</th><th>Estado</th><th>Archivo</th><th /></tr>
          </thead>
          <tbody>
            {posts.map((p) => {
              const atrasada = p.fecha < t && p.estado !== "publicado"
              return (
                <tr key={p.id}>
                  <td className={atrasada ? "mono small warnrow" : "mono small"} style={{ whiteSpace: "nowrap" }}>
                    {fmt(p.fecha)} {p.hora}{atrasada ? " ⚠" : ""}
                  </td>
                  <td className="small">{nombreCuenta(snapshot, p.cuenta)}</td>
                  <td className="small">{PLATS[p.plataforma].icon} {p.formato}</td>
                  <td className="small">
                    {p.titulo || <span className="muted">sin título</span>}
                    {p.proyecto_id ? (
                      <span className="muted"> · {proyectoPorId(snapshot, p.proyecto_id)?.titulo}</span>
                    ) : null}
                  </td>
                  <td className="small">{PILARES[p.pilar].label}</td>
                  <td>
                    <Tag color={ESTADOS_POST[p.estado].color}>
                      {ESTADOS_POST[p.estado].icon} {ESTADOS_POST[p.estado].label}
                    </Tag>
                  </td>
                  <td className="small">{p.asset_url ? "✓" : <span className="muted">—</span>}</td>
                  <td style={{ textAlign: "right" }}>
                    <button className="btn sm" onClick={() => onAbrir(p)}>Abrir</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ---------- tablero ---------- */
function Tablero({
  posts, snapshot, onAbrir, puedeEditar,
}: {
  posts: Publicacion[]
  snapshot: Snapshot
  onAbrir: (p: Publicacion) => void
  puedeEditar: boolean
}) {
  const [, arrancar] = useTransition()
  const columnas = Object.keys(ESTADOS_POST) as EstadoPost[]

  // Arrastrar entre columnas cambia el estado — es como avanza el flujo de
  // aprobación sin abrir cada pieza.
  const soltar = (e: React.DragEvent, estado: EstadoPost) => {
    e.preventDefault()
    const id = e.dataTransfer.getData("text/plain")
    const p = posts.find((x) => x.id === id)
    if (!p || p.estado === estado) return
    arrancar(async () => { await guardarPublicacion({ id, estado }) })
  }

  return (
    <div className="tablero">
      {columnas.map((k) => {
        const lista = posts.filter((p) => p.estado === k)
        return (
          <div
            key={k} className="col"
            onDragOver={(e) => { if (puedeEditar) e.preventDefault() }}
            onDrop={(e) => puedeEditar && soltar(e, k)}
          >
            <h3>
              <span style={{ color: ESTADOS_POST[k].color }} aria-hidden>{ESTADOS_POST[k].icon}</span>
              {ESTADOS_POST[k].label}
              <span className="n">{lista.length}</span>
            </h3>
            {lista.map((p) => (
              <button
                key={p.id} className="mini"
                draggable={puedeEditar}
                onDragStart={(e) => e.dataTransfer.setData("text/plain", p.id)}
                onClick={() => onAbrir(p)}
              >
                <b>{p.titulo || p.formato}</b>
                <div className="small muted">
                  {PLATS[p.plataforma].icon} {nombreCuenta(snapshot, p.cuenta)} · {fmt(p.fecha)}
                </div>
              </button>
            ))}
            {lista.length === 0 ? <p className="small muted" style={{ margin: 0 }}>—</p> : null}
          </div>
        )
      })}
    </div>
  )
}

/* ---------- grid IG ---------- */
function GridIg({
  posts, snapshot, cuenta, onAbrir,
}: {
  posts: Publicacion[]
  snapshot: Snapshot
  cuenta: string
  onAbrir: (p: Publicacion) => void
}) {
  // El grid solo tiene sentido para el feed de Instagram, que es donde el
  // orden visual importa.
  const feed = posts
    .filter((p) => p.plataforma === "ig" && p.formato !== "Story")
    .sort((a, b) => (a.fecha > b.fecha ? -1 : 1))

  return (
    <div className="card">
      <h2>Cómo se va a ver el perfil</h2>
      <p className="small muted">
        El feed de Instagram se lee como un bloque, no pieza por pieza. Aquí van las publicaciones
        de {cuenta === "todas" ? "todas las cuentas" : nombreCuenta(snapshot, cuenta)} en el orden en que
        aparecerían: la más reciente arriba a la izquierda.
      </p>
      {feed.length === 0 ? (
        <Vacio titulo="Sin piezas de Instagram con estos filtros" />
      ) : (
        <div className="ig-grid">
          {feed.slice(0, 27).map((p) => (
            <button key={p.id} className="ig-cell" onClick={() => onAbrir(p)}
              title={`${fmt(p.fecha)} · ${p.titulo || p.formato}`}>
              {p.thumb_url
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={p.thumb_url} alt="" onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
                : <span>{ESTADOS_POST[p.estado].icon}<br />{p.formato}<br />{fmt(p.fecha).slice(0, 10)}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ---------- archivos ---------- */
function Assets({ posts, snapshot, onAbrir }: { posts: Publicacion[]; snapshot: Snapshot; onAbrir: (p: Publicacion) => void }) {
  const con = posts.filter((p) => p.asset_url)
  const sin = posts.filter((p) => !p.asset_url && !["idea", "guion"].includes(p.estado))
  const enRevision = snapshot.publicaciones.filter((p) => p.estado === "revision").length

  return (
    <>
      <div className="kpis">
        <Kpi valor={con.length} label="Archivos enlazados" />
        <Kpi valor={sin.length} label="Piezas sin archivo" />
        <Kpi valor={enRevision} label="Esperando aprobación" />
      </div>

      {con.length ? (
        <div className="card">
          <h2>Archivos <span className="muted small">({con.length})</span></h2>
          <div className="tabla-wrap">
            <table>
              <thead><tr><th>Fecha</th><th>Cuenta</th><th>Nombre</th><th>v</th><th>Estado</th><th /></tr></thead>
              <tbody>
                {con.map((p) => (
                  <tr key={p.id}>
                    <td className="mono small" style={{ whiteSpace: "nowrap" }}>{fmt(p.fecha)}</td>
                    <td className="small">{nombreCuenta(snapshot, p.cuenta)}</td>
                    <td className="small mono">{p.asset_name || nombreAsset(snapshot, p)}</td>
                    <td className="mono small">v{String(p.version).padStart(2, "0")}</td>
                    <td><Tag color={ESTADOS_POST[p.estado].color}>{ESTADOS_POST[p.estado].icon}</Tag></td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <a className="btn sm" href={p.asset_url} target="_blank" rel="noopener noreferrer">⬇ Abrir</a>{" "}
                      <button className="btn sm" onClick={() => onAbrir(p)}>Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {sin.length ? (
        <div className="card">
          <h2>⚠ Piezas sin archivo <span className="muted small">({sin.length})</span></h2>
          <div className="tabla-wrap">
            <table>
              <tbody>
                {sin.map((p) => (
                  <tr key={p.id}>
                    <td className="mono small" style={{ whiteSpace: "nowrap" }}>{fmt(p.fecha)} {p.hora}</td>
                    <td className="small">{nombreCuenta(snapshot, p.cuenta)} · {p.formato}</td>
                    <td className="small">{p.titulo}</td>
                    <td style={{ textAlign: "right" }}>
                      <button className="btn sm" onClick={() => onAbrir(p)}>Enlazar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      <div className="card">
        <h2>Por qué son enlaces y no archivos adjuntos</h2>
        <p className="small">
          El panel <b>no guarda los videos</b>, y no debería: ningún equipo profesional reparte gigas desde su
          herramienta de planeación. El estándar (Frame.io, Drive, Dropbox) es que el calendario guarde el{" "}
          <b>enlace</b> y el archivo viva en la nube.
        </p>
        <h3>Estructura de la carpeta compartida</h3>
        <pre className="pre-carpeta">{`MG_Contenido/
├── 01_Artistas/
│   └── ABNERDK/2027-01_OneLife/
│       ├── 01_RAW/        ← bruto del content day
│       ├── 02_EDITADO/    ← piezas para aprobar
│       └── 03_PUBLICADO/  ← lo que ya salió
├── 02_MG_Marca/
└── 99_Archivo/`}</pre>
        <p className="small">Máximo 3 niveles: más abajo, nadie encuentra nada. Prefijos numéricos para forzar el orden.</p>
        <h3>Nomenclatura</h3>
        <p className="small mono pre-carpeta">AAAAMMDD_ARTISTA_RELEASE_FORMATO_PILAR_vNN.mp4</p>
        <p className="small">El botón ✨ del composer lo genera solo. Nunca sobrescribas: sube v02, no “final_final”.</p>
      </div>
    </>
  )
}

/* ---------- cuentas ---------- */
function Cuentas({ snapshot, onVerCuenta }: { snapshot: Snapshot; onVerCuenta: (id: string) => void }) {
  const t = hoy()
  const desde = masDias(t, -28)

  const filas = cuentas(snapshot).map((c) => {
    const ps = snapshot.publicaciones.filter((p) => p.cuenta === c.id)
    const publicadas = ps.filter((p) => p.estado === "publicado")
    const prox = ps.filter((p) => p.fecha >= t).sort((a, b) => (a.fecha < b.fecha ? -1 : 1))[0]
    const sem = +(publicadas.filter((p) => p.fecha >= desde && p.fecha <= t).length / 4).toFixed(1)
    const conMetricas = publicadas.filter((p) => p.m48?.alcance)
    const er = conMetricas.length
      ? conMetricas.reduce((s, p) => s + (tasaInteraccion(p.m48) ?? 0), 0) / conMetricas.length
      : null
    return { c, total: ps.length, pub: publicadas.length, sem, prox, er }
  }).filter((r) => r.total > 0 || r.c.id === "mg")

  return (
    <>
      <div className="card">
        <h2>Estado por cuenta</h2>
        <p className="small muted">
          Datos de Buffer sobre 11,4 M de publicaciones: pasar de 1 a 2–5 posts semanales en TikTok sube las
          vistas por post un <b>17%</b>; en Instagram, 3–5 por semana duplica el crecimiento de seguidores frente
          a 1–2. Con {snapshot.artistas.length + 1} cuentas eso no se sostiene a mano: cadencia alta solo para
          quien está en ciclo de lanzamiento.
        </p>
        <div className="tabla-wrap">
          <table>
            <thead><tr><th>Cuenta</th><th>Total</th><th>Publicadas</th><th>Frecuencia</th><th>Engagement</th><th>Próxima</th><th /></tr></thead>
            <tbody>
              {filas.map((r) => {
                const bajo = r.sem > 0 && r.sem < 3
                return (
                  <tr key={r.c.id}>
                    <td>
                      <b>{r.c.nombre}</b>
                      {r.c.id === "mg" ? <> <span className="tag outline" style={{ fontSize: 10 }}>Sello</span></> : null}
                    </td>
                    <td className="mono">{r.total}</td>
                    <td className="mono">{r.pub}</td>
                    <td className={bajo ? "mono warnrow" : "mono"}>
                      {r.sem > 0 ? `${r.sem}/sem` : <span className="muted">—</span>}
                    </td>
                    <td className="mono">{r.er !== null ? `${r.er.toFixed(2)}%` : <span className="muted">sin datos</span>}</td>
                    <td className="mono small">{r.prox ? `${fmt(r.prox.fecha)} ${r.prox.hora}` : <span className="muted">nada</span>}</td>
                    <td style={{ textAlign: "right" }}>
                      <button className="btn sm" onClick={() => onVerCuenta(r.c.id)}>Ver</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2>Mezcla de pilares — ¿estás quemando a la gente con promo?</h2>
        <p className="small muted">
          Referencia 70/20/10. En campaña la promo sube y es normal; lo que no puede pasar es que sea la mezcla todo el año.
        </p>
        <div className="tabla-wrap">
          <table>
            <thead><tr><th>Cuenta</th><th>Marca e historia</th><th>Comunidad</th><th>Promo</th><th>Total</th></tr></thead>
            <tbody>
              {cuentas(snapshot).map((c) => {
                const ps = snapshot.publicaciones.filter((p) => p.cuenta === c.id)
                if (!ps.length) return null
                const g = { marca: 0, comunidad: 0, promo: 0 } as Record<string, number>
                ps.forEach((p) => { g[PILARES[p.pilar]?.grupo ?? "marca"]++ })
                const pc = (k: string) => Math.round((g[k] / ps.length) * 100)
                const alto = pc("promo") > 25
                return (
                  <tr key={c.id}>
                    <td><b>{c.nombre}</b></td>
                    <td className="mono">{pc("marca")}%</td>
                    <td className="mono">{pc("comunidad")}%</td>
                    <td className={alto ? "mono warnrow" : "mono"}>{pc("promo")}%{alto ? " ⚠" : ""}</td>
                    <td className="mono">{ps.length}</td>
                  </tr>
                )
              })}
              {snapshot.publicaciones.length === 0 ? (
                <tr><td colSpan={5} className="muted small">Sin publicaciones todavía.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2>Métricas que importan (y las que no)</h2>
        <div className="tabla-wrap">
          <table>
            <thead><tr><th>Métrica</th><th>Cómo se lee</th><th>Referencia</th></tr></thead>
            <tbody>
              <tr><td>Engagement por alcance</td><td>(likes + coment. + guardados + compartidos) ÷ alcance</td><td>1K–10K: <b>6%+</b> es bueno. Media de Instagram: 0,48%</td></tr>
              <tr><td>Compartidos ÷ alcance</td><td>La señal más fuerte del algoritmo hoy</td><td>1–2% normal · <b>&gt;3% = viral</b></td></tr>
              <tr><td>Retención del video</td><td>% del video que se ve en promedio</td><td>&gt;50%, skip rate &lt;30%</td></tr>
              <tr><td>Crecimiento de seguidores</td><td>Semanal, no absoluto</td><td>1–2% semanal si tienes &lt;100K</td></tr>
              <tr className="muted"><td>Impresiones · likes totales · nº de seguidores</td><td>Vanidad: duplican, engañan o no mueven nada</td><td>Ignorar</td></tr>
            </tbody>
          </table>
        </div>
        <p className="small" style={{ marginTop: 8, marginBottom: 0 }}>
          <b>Dato incómodo:</b> el carrusel está infravalorado — en cuentas pequeñas supera al Reel
          (0,55% vs 0,52%) y da <b>9× más guardados</b> que la foto única. Y los posts con hashtags tuvieron{" "}
          <b>31,7% menos vistas</b> en el estudio 2026 de Metricool sobre 24,3 M de publicaciones.
        </p>
      </div>
    </>
  )
}

/* ---------- guía ---------- */
function Guia({ snapshot }: { snapshot: Snapshot }) {
  const slots = snapshot.config.slots ?? SLOTS_DEFAULT

  return (
    <>
      <div className="card">
        <h2>Huecos de publicación</h2>
        <p className="small muted">
          La idea que hizo famoso a Buffer: decides la <b>cadencia una vez</b> y después solo aportas contenido.
          Los huecos vienen precargados en las mejores ventanas de cada red, evitando viernes y fin de semana
          en Instagram y TikTok.
        </p>
        {(Object.keys(PLATS) as Plataforma[]).map((k) => (
          <div key={k}>
            <h3>
              {PLATS[k].icon} {PLATS[k].label}{" "}
              <span className="muted" style={{ fontWeight: 400 }}>
                — {slots[k].length} por semana · recomendado {PLATS[k].freq}
              </span>
            </h3>
            <div className="frow" style={{ gap: 6 }}>
              {slots[k].length
                ? slots[k].map((s, i) => <span key={i} className="tag outline">{DIAS[s.dow]} {s.hora}</span>)
                : <span className="muted small">Sin huecos definidos</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>Mejores horas</h2>
        <p className="small muted">
          Sprout Social, ≈2.000 millones de interacciones sobre 307.000 perfiles, ajustado al huso de Bogotá (UTC−5).
        </p>
        <div className="tabla-wrap">
          <table>
            <thead><tr><th>Red</th><th>Ventana</th><th>Frecuencia</th><th>Hora por defecto</th></tr></thead>
            <tbody>
              {(Object.keys(PLATS) as Plataforma[]).map((k) => (
                <tr key={k}>
                  <td>{PLATS[k].icon} <b>{PLATS[k].label}</b></td>
                  <td className="small">{PLATS[k].best}</td>
                  <td className="small">{PLATS[k].freq}</td>
                  <td className="mono">{HORARIOS_DEFAULT[k]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="small" style={{ marginTop: 8, marginBottom: 0 }}>
          Peores momentos: fin de semana en Instagram, domingo en TikTok. <b>Es un punto de partida, no una ley</b> —
          a los 60 días con datos propios, revisa Cuentas y ajusta.
        </p>
      </div>

      <div className="card">
        <h2>Los 5 pilares</h2>
        <p className="small">
          Los mismos para todas las cuentas, para poder comparar qué funciona entre artistas.
          Mezcla de referencia <b>70/20/10</b>.
        </p>
        <div className="tabla-wrap">
          <table>
            <thead><tr><th>Pilar</th><th>Qué va aquí</th><th>Peso</th></tr></thead>
            <tbody>
              {Object.entries(PILARES).map(([k, p]) => (
                <tr key={k}>
                  <td>{p.label}</td>
                  <td className="small">{p.desc}</td>
                  <td className="small">{p.grupo === "marca" ? "70% entre los tres" : p.grupo === "comunidad" ? "20%" : "10%"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2>Especificaciones 2026</h2>
        <div className="tabla-wrap">
          <table>
            <thead><tr><th>Formato</th><th>Proporción</th><th>Resolución</th><th>Duración</th><th>Copy</th><th>Hashtags</th></tr></thead>
            <tbody>
              {Object.entries(SPECS).map(([k, s]) => [
                <tr key={k}>
                  <td><b>{k}</b></td>
                  <td className="mono small">{s.ratio}</td>
                  <td className="mono small">{s.res}</td>
                  <td className="small">{s.dur}</td>
                  <td className="mono small">{s.copy ? `${s.copy} (~${s.opt})` : "—"}</td>
                  <td className="small">{s.tags}</td>
                </tr>,
                s.nota ? <tr key={k + "-n"}><td /><td colSpan={5} className="small muted">↳ {s.nota}</td></tr> : null,
              ])}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2>Flujo de aprobación</h2>
        <div className="frow" style={{ gap: 6 }}>
          {Object.entries(ESTADOS_POST).filter(([k]) => k !== "error").map(([k, e], i, arr) => (
            <span key={k} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Tag color={e.color}>{e.icon} {e.label}</Tag>
              {i < arr.length - 1 ? <span className="muted" aria-hidden>→</span> : null}
            </span>
          ))}
        </div>
        <p className="small" style={{ marginTop: 10 }}>
          “<b>Ajustes pedidos</b>” existe a propósito y obliga a escribir qué corregir: sin esa nota el rechazo
          se pierde en un chat y nadie sabe qué cambiar. En el <b>Tablero</b> arrastras las tarjetas de una
          columna a otra.
        </p>
        <p className="small" style={{ marginBottom: 0 }}>
          <b>Reglas de la casa:</b> nada llega a “Programado” sin estar “Aprobado”; quien aprueba no es quien
          edita; y si algo lleva más de una semana esperando aprobación, se publica o se mata.
        </p>
      </div>
    </>
  )
}

/* ---------- generar plan ---------- */
function GenerarPlan({ snapshot, onClose }: { snapshot: Snapshot; onClose: () => void }) {
  const activos = snapshot.proyectos.filter((p) => !["lanzado", "pausado"].includes(p.estado))
  const [pid, setPid] = useState(activos[0]?.id ?? "")
  const [error, setError] = useState<string | null>(null)
  const [pendiente, arrancar] = useTransition()

  const previsualizacion = useMemo(() => (pid ? generarPlan(snapshot, pid) : []), [snapshot, pid])
  const proyecto = proyectoPorId(snapshot, pid)

  const generar = () => {
    arrancar(async () => {
      const r = await crearPublicaciones(previsualizacion)
      if (r.ok) onClose()
      else setError(r.error ?? "No se pudo generar")
    })
  }

  if (!activos.length) {
    return (
      <Modal titulo="⚡ Generar plan" onClose={onClose} pie={<button className="btn primary" onClick={onClose}>Cerrar</button>}>
        <p className="small">No hay lanzamientos activos. Crea uno en “Artistas y proyectos”.</p>
      </Modal>
    )
  }

  return (
    <Modal
      titulo="⚡ Generar plan de contenido"
      onClose={onClose}
      pie={
        <>
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn primary" onClick={generar} disabled={pendiente || !previsualizacion.length}>
            {pendiente ? "Generando…" : `Crear ${previsualizacion.length} publicaciones`}
          </button>
        </>
      }
    >
      <p className="small muted">
        Reparte las piezas sobre la ventana pre/post con la mezcla 70/20/10, ancladas a los hitos que el
        proyecto ya tiene. Esquiva viernes y fin de semana en Instagram y TikTok, y no toca lo que ya existe.
      </p>

      <Campo label="Lanzamiento">
        <select value={pid} onChange={(e) => setPid(e.target.value)} style={{ flex: 1, minWidth: 240 }}>
          {activos.map((p) => (
            <option key={p.id} value={p.id}>
              {snapshot.artistas.find((a) => a.id === p.artista_id)?.nombre} — {p.titulo} ({fmt(p.release)})
            </option>
          ))}
        </select>
      </Campo>

      {proyecto ? (
        <p className="small">
          Ventana: desde {fmt(masDias(proyecto.release, -56))} hasta {fmt(masDias(proyecto.release, 28))} ·{" "}
          <b>{previsualizacion.length}</b>{" "}
          {previsualizacion.length === 1 ? "pieza nueva" : "piezas nuevas"}
          {previsualizacion.length === 0 ? " — el plan ya estaba generado" : ""}
        </p>
      ) : null}

      {previsualizacion.length ? (
        <div className="tabla-wrap" style={{ maxHeight: 260, overflowY: "auto" }}>
          <table>
            <tbody>
              {previsualizacion.map((p) => (
                <tr key={p.id}>
                  <td className="mono small" style={{ whiteSpace: "nowrap" }}>{fmt(p.fecha)}</td>
                  <td className="small">{PLATS[p.plataforma].icon} {p.formato}</td>
                  <td className="small">{p.titulo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {error ? <div className="alert critical"><span aria-hidden>⚠</span><span>{error}</span></div> : null}
    </Modal>
  )
}
