import type { Evento, Proyecto, Snapshot, Artista } from "./tipos"
import { MESES, claveSemana, evitarFestivos, fmt, hoy, masDias, ultimoSabado, D } from "./fechas"
import { PLATS } from "./constantes"

// ============================================================
// Motor de eventos derivados
// ============================================================
// El calendario no se guarda: se calcula. Cada proyecto proyecta sus hitos
// hacia atras desde la fecha de release aplicando las reglas de config, y las
// sesiones de grabacion se agendan sobre la capacidad real del estudio.
// Lo unico persistido son las excepciones (eventosEstado y eventosExtra).

export const artistaPorId = (s: Snapshot, id: string | null): Artista | undefined =>
  s.artistas.find((a) => a.id === id)

export const proyectoPorId = (s: Snapshot, id: string | null): Proyecto | undefined =>
  s.proyectos.find((p) => p.id === id)

/** Nombre visible de una cuenta de redes: el sello o un artista del roster. */
export function nombreCuenta(s: Snapshot, cuenta: string): string {
  if (cuenta === "mg") return "MG Company"
  return artistaPorId(s, cuenta)?.nombre ?? "—"
}

export interface Cuenta {
  id: string
  nombre: string
  tier: Artista["tier"]
}

export function cuentas(s: Snapshot): Cuenta[] {
  return [
    { id: "mg", nombre: "MG Company", tier: "marca" },
    ...s.artistas.map((a) => ({ id: a.id, nombre: a.nombre, tier: a.tier })),
  ]
}

/* ---------- hitos derivados de un proyecto ---------- */
export function eventosProyecto(s: Snapshot, p: Proyecto): Evento[] {
  const R = s.config.reglas
  const evs: Evento[] = []
  const a = artistaPorId(s, p.artista_id)
  const nm = a ? a.nombre : "?"

  const push = (key: string, tipo: Evento["tipo"], fecha: string, etiqueta: string) => {
    const id = `${p.id}:${key}`
    const st = s.eventosEstado[id]
    if (st?.eliminado) return
    evs.push({ id, proyecto_id: p.id, tipo, fecha: st?.fecha_override ?? fecha, etiqueta })
  }

  if (p.estado === "pausado") return evs

  if (p.grabados < p.tracks) {
    push("recDeadline", "hito", evitarFestivos(masDias(p.release, -R.recordingDone)), `🎙 Deadline grabación · ${nm}`)
  }
  push("master", "hito", evitarFestivos(masDias(p.release, -R.masterFinal)), `🎚 Master final · ${nm}`)
  push("contentDay", "content", evitarFestivos(masDias(p.release, -R.contentDay)), `🎬 Content day · ${nm}`)
  push("editing", "hito", evitarFestivos(masDias(p.release, -R.editingDone)), `✂️ Edición lista · ${nm}`)
  push("distro", "hito", masDias(p.release, -R.distributor), `📦 Entrega distribuidor · ${nm}`)
  push("pitch", "hito", masDias(p.release, -R.pitch), `🎯 Pitch editorial · ${nm}`)
  push("presave", "pre", masDias(p.release, -R.presave), `🔗 Pre-save activo · ${nm}`)
  push("preStart", "pre", p.pre_start, `📣 Inicio pre-lanzamiento · ${nm}`)
  push("release", "release", p.release, `🚀 RELEASE · ${nm} — ${p.titulo}`)
  push("postEnd", "post", masDias(p.release, p.post_meses * 30), `🏁 Fin post-lanzamiento · ${nm}`)

  return evs
}

/* ---------- agendador de sesiones de grabación ----------
   EDF (earliest deadline first): primero las canciones cuyo deadline de
   grabación está más cerca. Respeta los días de sesión, los bloques por día
   y el techo semanal, que es el 66% de la capacidad real para dejar colchón. */
export function agendarSesiones(s: Snapshot): Evento[] {
  const S = s.config.ajustes
  const R = s.config.reglas

  const pendientes = s.proyectos
    .filter((p) => p.estado !== "pausado" && p.estado !== "lanzado" && p.grabados < p.tracks)
    .map((p) => ({
      p,
      faltan: p.tracks - p.grabados,
      deadline: evitarFestivos(masDias(p.release, -R.recordingDone)),
    }))
    .sort((x, y) => (x.deadline < y.deadline ? -1 : 1))

  const sesiones: Evento[] = []
  const cargaSemana: Record<string, number> = {}
  const cargaDia: Record<string, number> = {}
  let cursor = masDias(hoy(), 1)

  const cola: { p: Proyecto; i: number; deadline: string }[] = []
  pendientes.forEach((n) => {
    for (let i = 1; i <= n.faltan; i++) cola.push({ p: n.p, i, deadline: n.deadline })
  })

  const horizonte = S.horizonEnd

  for (const item of cola) {
    let d = cursor
    let colocada = false
    let guard = 0

    while (!colocada && d <= horizonte && guard < 900) {
      guard++
      const dow = D(d).getDay()
      if (S.sessionDays.includes(dow) && evitarFestivos(d) === d) {
        const cap = dow === 6 ? S.satBlocks : S.weekdayBlocks
        const wk = claveSemana(d)
        if ((cargaDia[d] ?? 0) < cap && (cargaSemana[wk] ?? 0) < S.weeklyCap) {
          const id = `${item.p.id}:ses${item.i}`
          const st = s.eventosEstado[id]
          if (!st?.eliminado) {
            sesiones.push({
              id,
              proyecto_id: item.p.id,
              tipo: "sesion",
              fecha: st?.fecha_override ?? d,
              etiqueta: `🎙 Sesión ${item.i}/${item.p.tracks - item.p.grabados} · ${artistaPorId(s, item.p.artista_id)?.nombre ?? "?"}`,
              tarde: d > item.deadline,
            })
          }
          cargaDia[d] = (cargaDia[d] ?? 0) + 1
          cargaSemana[wk] = (cargaSemana[wk] ?? 0) + 1
          colocada = true
          cursor = d
        }
      }
      if (!colocada) d = masDias(d, 1)
    }
  }

  return sesiones
}

/* ---------- fiestas MG: residencia mensual el último sábado ---------- */
export function eventosFiestas(s: Snapshot): Evento[] {
  const evs: Evento[] = []
  const inicio = new Date(2026, 9, 1, 12)
  const fin = D(s.config.ajustes.horizonEnd)

  for (const d = new Date(inicio); d <= fin; d.setMonth(d.getMonth() + 1)) {
    const y = d.getFullYear()
    const m = d.getMonth()
    const id = `party:${y}-${m + 1}`
    const st = s.eventosEstado[id]
    if (st?.eliminado) continue

    // Headliner: los releases que caen en ese mismo mes.
    const delMes = s.proyectos.filter(
      (p) => p.estado !== "pausado" && p.release.startsWith(`${y}-${String(m + 1).padStart(2, "0")}`),
    )
    const head = delMes.length
      ? delMes.map((p) => artistaPorId(s, p.artista_id)?.nombre ?? "?").join(" + ")
      : null

    evs.push({
      id,
      tipo: "fiesta",
      fecha: st?.fecha_override ?? ultimoSabado(y, m),
      proyecto_id: null,
      etiqueta: `🎉 Fiesta MG · Noche ${MESES[m]}${head ? " · Headliner: " + head : ""}`,
    })
  }
  return evs
}

/* ---------- seguimiento del radar ---------- */
export function eventosRadar(s: Snapshot): Evento[] {
  const evs: Evento[] = []
  s.radar.forEach((e) => {
    if (!e.proxima) return
    const id = `radar:${e.id}`
    const st = s.eventosEstado[id]
    if (st?.eliminado) return
    evs.push({
      id,
      tipo: "seguimiento",
      fecha: st?.fecha_override ?? e.proxima,
      proyecto_id: null,
      etiqueta: `📊 Medir redes · ${e.nombre}`,
    })
  })
  return evs
}

/* ---------- publicaciones en el calendario general ---------- */
export function eventosPublicaciones(s: Snapshot): Evento[] {
  return s.publicaciones
    .filter((p) => !s.eventosEstado[`post:${p.id}`]?.eliminado)
    .map((p) => {
      const st = s.eventosEstado[`post:${p.id}`]
      return {
        id: `post:${p.id}`,
        tipo: "publicacion" as const,
        fecha: st?.fecha_override ?? p.fecha,
        proyecto_id: p.proyecto_id,
        etiqueta: `${PLATS[p.plataforma].icon} ${p.hora} · ${nombreCuenta(s, p.cuenta)} — ${p.titulo || p.formato}`,
      }
    })
}

/** Todos los eventos del calendario, ordenados por fecha. */
export function todosLosEventos(s: Snapshot): Evento[] {
  let evs: Evento[] = []
  s.proyectos.forEach((p) => {
    evs = evs.concat(eventosProyecto(s, p))
  })
  evs = evs.concat(
    agendarSesiones(s),
    eventosFiestas(s),
    eventosRadar(s),
    eventosPublicaciones(s),
    s.eventosExtra.filter((e) => !s.eventosEstado[e.id]?.eliminado).map((e) => ({
      id: e.id,
      tipo: e.tipo,
      fecha: s.eventosEstado[e.id]?.fecha_override ?? e.fecha,
      etiqueta: e.etiqueta,
      proyecto_id: e.proyecto_id,
    })),
  )
  evs.sort((a, b) => (a.fecha < b.fecha ? -1 : a.fecha > b.fecha ? 1 : 0))
  return evs
}

export const eventoHecho = (s: Snapshot, id: string): boolean => !!s.eventosEstado[id]?.hecho

/* ---------- alertas ---------- */
export interface Alerta {
  nivel: "critical" | "warn"
  msg: string
}

export function calcularAlertas(s: Snapshot): Alerta[] {
  const evs = todosLosEventos(s)
  const t = hoy()
  const out: Alerta[] = []

  s.proyectos.forEach((p) => {
    if (p.estado === "pausado" || p.estado === "lanzado") return
    const a = artistaPorId(s, p.artista_id)
    const nm = a?.nombre ?? "?"
    const recDl = masDias(p.release, -s.config.reglas.recordingDone)

    if (p.grabados < p.tracks && recDl < masDias(t, 21)) {
      out.push({
        nivel: recDl < t ? "critical" : "warn",
        msg: `${nm} — faltan ${p.tracks - p.grabados} canciones y el deadline de grabación es ${fmt(recDl)} (${p.titulo}).`,
      })
    }
    if (p.estado === "negociacion" && p.pre_start < masDias(t, 30)) {
      out.push({ nivel: "warn", msg: `${nm} — la negociación sigue abierta y su pre-lanzamiento empieza ${fmt(p.pre_start)}. Cerrar acuerdo primero.` })
    }
    if (p.estado === "confirmar_estado" && p.pre_start < masDias(t, 30)) {
      out.push({ nivel: "warn", msg: `${nm} — confirmar estado real de la música antes de ${fmt(p.pre_start)} (inicio de pre).` })
    }
  })

  const prox7 = evs.filter((e) => e.fecha >= t && e.fecha <= masDias(t, 7) && !eventoHecho(s, e.id))
  if (prox7.some((e) => e.tipo === "content")) {
    out.push({ nivel: "warn", msg: "Hay content day en los próximos 7 días — confirmar locación, equipo y llamado." })
  }

  const vencidas = s.radar.filter((e) => e.proxima && e.proxima < t)
  if (vencidas.length) {
    out.push({
      nivel: "warn",
      msg: `Radar: ${vencidas.length} medición(es) de redes vencida(s) — ${vencidas.slice(0, 4).map((e) => e.nombre).join(", ")}${vencidas.length > 4 ? "…" : ""}.`,
    })
  }
  const sinDatos = s.radar.filter((e) => !e.mediciones.length).length
  if (sinDatos) {
    out.push({ nivel: "warn", msg: `Radar: ${sinDatos} fichas sin primera medición de redes. Sin ese dato base no hay crecimiento ni puntaje.` })
  }

  const atrasadas = s.publicaciones.filter((p) => p.fecha < t && p.estado !== "publicado")
  if (atrasadas.length) {
    out.push({ nivel: "critical", msg: `Redes: ${atrasadas.length} publicación(es) con fecha pasada y sin publicar.` })
  }
  const sinArchivo = s.publicaciones.filter(
    (p) => p.fecha >= t && p.fecha <= masDias(t, 7) && !p.asset_url && p.estado !== "publicado",
  )
  if (sinArchivo.length) {
    out.push({ nivel: "warn", msg: `Redes: ${sinArchivo.length} publicación(es) salen esta semana y todavía no tienen archivo enlazado.` })
  }
  const enRevision = s.publicaciones.filter((p) => p.estado === "revision")
  if (enRevision.length) {
    out.push({ nivel: "warn", msg: `Redes: ${enRevision.length} pieza(s) esperando aprobación. Si llevan más de una semana ahí, se publican o se matan.` })
  }

  const sinConfirmar = s.artistas.filter((a) => !a.confirmado)
  if (sinConfirmar.length) {
    out.push({
      nivel: "warn",
      msg: `${sinConfirmar.length} nombres artísticos sin confirmar escritura oficial: ${sinConfirmar.map((a) => a.nombre).join(", ")}.`,
    })
  }

  return out
}

/* ---------- carga del estudio por semana ---------- */
export function cargaSemanal(s: Snapshot) {
  const sesiones = agendarSesiones(s)
  const porSemana: Record<string, number> = {}
  sesiones.forEach((e) => {
    const wk = claveSemana(e.fecha)
    porSemana[wk] = (porSemana[wk] ?? 0) + 1
  })
  return porSemana
}
