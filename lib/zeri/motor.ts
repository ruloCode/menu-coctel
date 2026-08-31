import { artistaPorId, avanceProyecto, misPendientes, todosLosEventos } from "@/lib/mg/motor"
import { fmt, hoy, masDias, diasEntre } from "@/lib/mg/fechas"
import { ESTADOS, TIPOS_EVENTO } from "@/lib/mg/constantes"
import type { Perfil, Proyecto, Snapshot } from "@/lib/mg/tipos"
import { REGLAS } from "./reglas"

/**
 * El motor de Zeri. Determinista y local: NO llama a ningún modelo.
 *
 * Por qué así y no un LLM: lo que el equipo le pide a diario es operativo
 * ("el album se atrasó tres semanas", "¿qué me toca?"), y eso se resuelve
 * mejor con reglas que con generación — es instantáneo, no cuesta tokens, y
 * sobre todo es PREDECIBLE: mover una fecha de release recalcula el calendario
 * entero, así que no puede depender de que un modelo interprete bien.
 *
 * Cuando no entiende, lo dice y ofrece lo que sí sabe hacer. Nunca inventa.
 */

export type Accion = "delay" | "song" | "allrec" | "ready" | "launched" | "pause" | "resume"

export interface Propuesta {
  proyectoId: string
  proyectoNombre: string
  que: Accion
  dias: number
  /** Frase en primera persona para el botón de confirmar. */
  resumen: string
}

export interface Respuesta {
  texto: string
  /** Líneas de detalle: se pintan como lista, no como párrafo. */
  detalle?: { txt: string; sub?: string; color?: string }[]
  /** Si viene, la respuesta termina en una acción que hay que confirmar. */
  propuesta?: Propuesta
  sugerencias?: string[]
}

export interface Contexto {
  snapshot: Snapshot
  perfil: Perfil
  /** Si no puede operar, las propuestas se convierten en solicitudes. */
  puedeOperar: boolean
}

/* ---------- utilidades de texto ---------- */

const normalizar = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim()

const contiene = (t: string, ...palabras: string[]) => palabras.some((p) => t.includes(p))

/** Encuentra el proyecto del que habla la frase: por título o por artista.
 *  Prefiere la coincidencia más larga, para que "EP 1" no gane sobre
 *  "One Life Is All You Get" cuando ambos aparecen. */
function proyectoMencionado(t: string, s: Snapshot): Proyecto | null {
  let mejor: { p: Proyecto; largo: number } | null = null

  for (const p of s.proyectos) {
    const titulo = normalizar(p.titulo)
    const artista = normalizar(artistaPorId(s, p.artista_id)?.nombre ?? "")

    for (const aguja of [titulo, artista]) {
      if (aguja.length >= 3 && t.includes(aguja)) {
        if (!mejor || aguja.length > mejor.largo) mejor = { p, largo: aguja.length }
      }
    }
  }
  return mejor?.p ?? null
}

/** Días mencionados en la frase. Entiende semanas y meses porque es como
 *  habla la gente: "se corrió tres semanas", no "se corrió 21 días". */
function diasMencionados(t: string): number | null {
  const palabras: Record<string, number> = {
    un: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8,
  }

  const num = (m: RegExpMatchArray | null) => {
    if (!m) return null
    const crudo = m[1]
    return /^\d+$/.test(crudo) ? +crudo : palabras[crudo] ?? null
  }

  const semanas = num(t.match(/(\d+|un|una|dos|tres|cuatro|cinco|seis|siete|ocho)\s*semanas?/))
  if (semanas) return semanas * 7

  const meses = num(t.match(/(\d+|un|una|dos|tres|cuatro|cinco|seis|siete|ocho)\s*mes/))
  if (meses) return meses * 30

  const dias = num(t.match(/(\d+|un|una|dos|tres|cuatro|cinco|seis|siete|ocho)\s*dias?/))
  if (dias) return dias

  return null
}

const nombreDe = (s: Snapshot, p: Proyecto) =>
  `${artistaPorId(s, p.artista_id)?.nombre ?? "?"} · ${p.titulo}`

/* ---------- respuestas de consulta ---------- */

function misTareas(ctx: Contexto): Respuesta {
  const { snapshot: s, perfil } = ctx
  const m = misPendientes(s, perfil.id)
  const ahora = [...m.atrasado, ...m.hoy, ...m.semana]

  if (ahora.length === 0) {
    return {
      texto: "No tienes nada pendiente para esta semana. Si esperabas algo, puede que aún no te lo hayan asignado.",
      sugerencias: ["¿Qué sale este mes?", "¿Qué está en riesgo?"],
    }
  }

  return {
    texto:
      `Tienes ${ahora.length} ${ahora.length === 1 ? "cosa" : "cosas"} en los próximos 7 días` +
      (m.atrasado.length ? `, y ${m.atrasado.length} ya ${m.atrasado.length === 1 ? "venció" : "vencieron"}` : "") + ".",
    detalle: ahora.slice(0, 8).map((e) => ({
      txt: e.etiqueta,
      sub: fmt(e.fecha) + (e.fecha < hoy() ? " · atrasado" : ""),
      color: TIPOS_EVENTO[e.tipo]?.color,
    })),
    sugerencias: ["¿Cómo va mi proyecto?"],
  }
}

function estadoProyecto(p: Proyecto, ctx: Contexto): Respuesta {
  const { snapshot: s } = ctx
  const av = avanceProyecto(s, p)
  const dias = diasEntre(hoy(), p.release)
  const pendientes = av.tareas.filter((e) => !e.hecho).slice(0, 5)

  return {
    texto:
      `${nombreDe(s, p)} va al ${av.pct}% (${av.hechas} de ${av.total} hitos). ` +
      `Está en ${ESTADOS[p.estado]?.label.toLowerCase() ?? p.estado}, con ${p.grabados} de ${p.tracks} temas grabados. ` +
      (dias < 0 ? `El release era el ${fmt(p.release)}.` : `Sale el ${fmt(p.release)}, en ${dias} días.`),
    detalle: pendientes.map((e) => ({
      txt: e.etiqueta,
      sub: fmt(e.fecha) + (e.fecha < hoy() ? " · atrasado" : ""),
      color: TIPOS_EVENTO[e.tipo]?.color,
    })),
    sugerencias: [`El ${p.titulo} se atrasó 2 semanas`, "¿Qué está en riesgo?"],
  }
}

function enRiesgo(ctx: Contexto): Respuesta {
  const { snapshot: s } = ctx
  const malos = s.proyectos.filter(
    (p) => !["lanzado", "pausado"].includes(p.estado) && (p.salud === "en_riesgo" || p.salud === "desviado"),
  )

  if (!malos.length) {
    return { texto: "Ningún proyecto está reportado en riesgo ahora mismo.", sugerencias: ["¿Qué sale este mes?"] }
  }

  return {
    texto: `Hay ${malos.length} ${malos.length === 1 ? "proyecto" : "proyectos"} con la salud en rojo o ámbar.`,
    detalle: malos.map((p) => ({
      txt: nombreDe(s, p),
      sub: `${p.salud === "desviado" ? "Desviado" : "En riesgo"} · release ${fmt(p.release)}${p.salud_nota ? ` · ${p.salud_nota}` : ""}`,
      color: p.salud === "desviado" ? "var(--critical)" : "var(--warning)",
    })),
  }
}

function proximosReleases(ctx: Contexto, dias = 60): Respuesta {
  const { snapshot: s } = ctx
  const limite = masDias(hoy(), dias)
  const salen = s.proyectos
    .filter((p) => p.estado !== "pausado" && p.release >= hoy() && p.release <= limite)
    .sort((a, b) => a.release.localeCompare(b.release))

  if (!salen.length) return { texto: `No hay lanzamientos en los próximos ${dias} días.` }

  return {
    texto: `${salen.length} ${salen.length === 1 ? "lanzamiento" : "lanzamientos"} en los próximos ${dias} días.`,
    detalle: salen.map((p) => {
      const av = avanceProyecto(s, p)
      return {
        txt: nombreDe(s, p),
        sub: `${fmt(p.release)} · en ${diasEntre(hoy(), p.release)} días · ${av.pct}% de hitos`,
        color: "var(--c-release)",
      }
    }),
  }
}

function proximoContentDay(ctx: Contexto): Respuesta {
  const { snapshot: s } = ctx
  const t = hoy()
  const cds = todosLosEventos(s)
    .filter((e) => e.tipo === "content" && !e.hecho && e.fecha >= t)
    .sort((a, b) => a.fecha.localeCompare(b.fecha))

  if (!cds.length) return { texto: "No hay content days agendados por delante." }

  return {
    texto: `El próximo content day es el ${fmt(cds[0].fecha)}, en ${diasEntre(t, cds[0].fecha)} días.`,
    detalle: cds.slice(0, 5).map((e) => ({
      txt: e.etiqueta,
      sub: fmt(e.fecha),
      color: TIPOS_EVENTO.content.color,
    })),
  }
}

const ayuda = (): Respuesta => ({
  texto: "Puedo consultar el estado de todo y aplicar cambios en el calendario. Prueba con algo así:",
  detalle: [
    { txt: "«El Album 1 se atrasó 3 semanas»", sub: "Mueve el release y recalcula toda la cascada" },
    { txt: "«Terminamos de grabar una canción del EP 1»", sub: "Suma una grabada y reagenda el estudio" },
    { txt: "«Se lanzó One Life Is All You Get»", sub: "Cierra el proyecto" },
    { txt: "«¿Qué me toca esta semana?»", sub: "Tus pendientes por fecha" },
    { txt: "«¿Cómo va el Album 1?»", sub: "Avance, estado y lo que falta" },
    { txt: "«¿Qué está en riesgo?»", sub: "Proyectos con la salud en rojo" },
  ],
})

/* ---------- el despachador ---------- */

export function responder(entrada: string, ctx: Contexto): Respuesta {
  const t = normalizar(entrada)
  const { snapshot: s } = ctx

  if (!t) return ayuda()

  if (contiene(t, "ayuda", "que puedes", "que sabes", "como funciona")) return ayuda()

  // Las reglas de la casa: quién tiene 3 meses de pre, cuándo va el content
  // day, qué tiene que estar listo antes. Zeri las sabe de memoria.
  if (contiene(t, "regla", "cuanto pre", "cuantos meses", "firmado", "content day cuando", "politica", "como funciona el pre")) {
    return {
      texto: "Estas son las reglas de la casa que aplico al calendario:",
      detalle: REGLAS.map((r) => ({ txt: r.titulo, sub: r.cuerpo, color: "var(--c-hito)" })),
      sugerencias: ["¿Qué sale este mes?", "¿Qué está en riesgo?"],
    }
  }

  // --- consultas personales ---
  if (contiene(t, "que me toca", "mis pendientes", "mi trabajo", "que tengo")) return misTareas(ctx)

  // --- consultas generales ---
  if (contiene(t, "en riesgo", "riesgo", "atrasado", "desviado", "problema")) return enRiesgo(ctx)
  if (contiene(t, "content day", "contenido dia", "rodaje")) return proximoContentDay(ctx)
  if (contiene(t, "que sale", "proximos lanzamientos", "que lanzamos", "este mes", "proximo release"))
    return proximosReleases(ctx)

  const p = proyectoMencionado(t, s)

  // --- acciones sobre un proyecto ---
  if (p) {
    const dias = diasMencionados(t)

    if (contiene(t, "atraso", "atrasa", "retrasa", "se corrio", "correr", "mover", "movio", "aplazar", "posponer")) {
      const n = dias ?? 14
      return {
        texto:
          `Entendido: mover el release de ${nombreDe(s, p)} ${n} días, del ${fmt(p.release)} al ${fmt(masDias(p.release, n))} aproximado.` +
          " El release aterriza en viernes y todas las fechas derivadas se recalculan solas.",
        propuesta: {
          proyectoId: p.id, proyectoNombre: nombreDe(s, p), que: "delay", dias: n,
          resumen: `mover el release de ${nombreDe(s, p)} ${n} días`,
        },
      }
    }

    if (contiene(t, "toda la grabacion", "terminamos de grabar todo", "acabamos la grabacion", "grabacion completa")) {
      return {
        texto: `Vale: dar por cerrada toda la grabación de ${nombreDe(s, p)} (${p.tracks} temas) y pasarlo a mezcla.`,
        propuesta: {
          proyectoId: p.id, proyectoNombre: nombreDe(s, p), que: "allrec", dias: 0,
          resumen: `cerrar toda la grabación de ${nombreDe(s, p)}`,
        },
      }
    }

    if (contiene(t, "grabamos", "grabada", "terminamos de grabar", "una cancion", "un tema")) {
      return {
        texto:
          `Vale: sumar una canción grabada a ${nombreDe(s, p)} — quedaría en ${Math.min(p.grabados + 1, p.tracks)} de ${p.tracks}.` +
          " El agendador reparte de nuevo lo que falta sobre la capacidad del estudio.",
        propuesta: {
          proyectoId: p.id, proyectoNombre: nombreDe(s, p), que: "song", dias: 0,
          resumen: `sumar una canción grabada a ${nombreDe(s, p)}`,
        },
      }
    }

    if (contiene(t, "se lanzo", "ya salio", "publicamos", "lanzado")) {
      return {
        texto: `¡Bien! Marcar ${nombreDe(s, p)} como lanzado y cerrar su ciclo.`,
        propuesta: {
          proyectoId: p.id, proyectoNombre: nombreDe(s, p), que: "launched", dias: 0,
          resumen: `marcar ${nombreDe(s, p)} como lanzado`,
        },
      }
    }

    if (contiene(t, "esta listo", "quedo listo", "listo para lanzar")) {
      return {
        texto: `Vale: ${nombreDe(s, p)} pasa a listo para lanzar.`,
        propuesta: {
          proyectoId: p.id, proyectoNombre: nombreDe(s, p), que: "ready", dias: 0,
          resumen: `marcar ${nombreDe(s, p)} como listo para lanzar`,
        },
      }
    }

    if (contiene(t, "pausar", "pausa", "parar", "detener")) {
      return {
        texto: `Vale: pausar ${nombreDe(s, p)}. Deja de generar fechas hasta que se reactive.`,
        propuesta: {
          proyectoId: p.id, proyectoNombre: nombreDe(s, p), que: "pause", dias: 0,
          resumen: `pausar ${nombreDe(s, p)}`,
        },
      }
    }

    if (contiene(t, "reactivar", "retomar", "reanudar")) {
      return {
        texto: `Vale: reactivar ${nombreDe(s, p)}.`,
        propuesta: {
          proyectoId: p.id, proyectoNombre: nombreDe(s, p), que: "resume", dias: 0,
          resumen: `reactivar ${nombreDe(s, p)}`,
        },
      }
    }

    // Mencionó un proyecto sin pedir nada concreto: informa.
    return estadoProyecto(p, ctx)
  }

  // --- no entendió ---
  return {
    texto:
      "No estoy seguro de a qué proyecto te refieres. Nómbralo por su título o por el artista, " +
      "por ejemplo «¿cómo va el Album 1?».",
    sugerencias: ["¿Qué me toca esta semana?", "¿Qué está en riesgo?", "ayuda"],
  }
}
