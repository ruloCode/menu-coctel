import type { Proyecto, Publicacion, Snapshot } from "./tipos"
import { D, evitarFestivos, masDias, hoy } from "./fechas"
import { HORARIOS_DEFAULT, PILARES, PLATS } from "./constantes"
import { nombreCuenta, proyectoPorId } from "./motor"
import type { Plataforma, Pilar, Metricas } from "./tipos"

// Plan automatico de contenido por lanzamiento: reparte piezas sobre la
// ventana pre/post con la mezcla 70/20/10 (marca / comunidad / promo) y las
// frecuencias de Buffer, ancladas a los hitos que el proyecto ya tiene.

interface PiezaPlan {
  off: number
  plat: Plataforma
  fmt: string
  pil: Pilar
  idea: string
}

export function plantillaPlan(p: Proyecto): PiezaPlan[] {
  const piezas: PiezaPlan[] = [
    { off: -56, plat: "ig", fmt: "Story",    pil: "bts",      idea: "Story cruda de la sesión de grabación" },
    { off: -49, plat: "tt", fmt: "Video",    pil: "bts",      idea: "Clip de estudio: el momento en que sale la línea" },
    { off: -42, plat: "ig", fmt: "Carrusel", pil: "personal", idea: "Carrusel: la historia detrás de la canción" },
    { off: -38, plat: "tt", fmt: "Video",    pil: "musica",   idea: "Snippet de 15 s del coro (sin decir cuándo sale)" },
    { off: -35, plat: "ig", fmt: "Reel",     pil: "bts",      idea: "Reel del content day: cómo se rodó el video" },
    { off: -30, plat: "yt", fmt: "Short",    pil: "musica",   idea: "Short con el hook + texto en pantalla" },
    { off: -28, plat: "ig", fmt: "Reel",     pil: "musica",   idea: "Snippet más largo, con fecha en pantalla" },
    { off: -21, plat: "ig", fmt: "Carrusel", pil: "promo",    idea: "ANUNCIO: portada + fecha + link de pre-save" },
    { off: -21, plat: "tt", fmt: "Video",    pil: "musica",   idea: "Anuncio en video con el snippet: “sale el viernes”" },
    { off: -14, plat: "tt", fmt: "Video",    pil: "fans",     idea: "Reto/dueto con el sonido — abrir la conversación" },
    { off: -10, plat: "ig", fmt: "Reel",     pil: "musica",   idea: "Segundo snippet, otro fragmento de la canción" },
    { off: -7,  plat: "ig", fmt: "Story",    pil: "promo",    idea: "Cuenta regresiva + sticker de recordatorio" },
    { off: -3,  plat: "tt", fmt: "Video",    pil: "personal", idea: "“Por qué escribí esta canción” a cámara" },
    { off: -1,  plat: "ig", fmt: "Story",    pil: "promo",    idea: "MAÑANA — última llamada al pre-save" },
    { off: 0,   plat: "ig", fmt: "Reel",     pil: "promo",    idea: "YA SALIÓ — reel de lanzamiento" },
    { off: 0,   plat: "tt", fmt: "Video",    pil: "musica",   idea: "YA SALIÓ — la canción sonando, versión TikTok" },
    { off: 0,   plat: "yt", fmt: "Video oficial", pil: "musica", idea: "Estreno del video oficial" },
    { off: 0,   plat: "ig", fmt: "Story",    pil: "fans",     idea: "Repost de reacciones de la gente en Stories" },
    { off: 3,   plat: "ig", fmt: "Carrusel", pil: "fans",     idea: "Reacciones de la gente / capturas de mensajes" },
    { off: 7,   plat: "tt", fmt: "Video",    pil: "musica",   idea: "Otro fragmento de la canción, otro ángulo" },
    { off: 10,  plat: "yt", fmt: "Short",    pil: "bts",      idea: "Short del detrás de cámaras del video" },
    { off: 14,  plat: "ig", fmt: "Reel",     pil: "musica",   idea: "Versión en vivo / acústica" },
    { off: 17,  plat: "ig", fmt: "Story",    pil: "fans",     idea: "Caja de preguntas: qué quieren ver del proyecto" },
    { off: 21,  plat: "tt", fmt: "Video",    pil: "fans",     idea: "Responder a un comentario en video" },
    { off: 28,  plat: "ig", fmt: "Carrusel", pil: "personal", idea: "Balance del mes: qué pasó con la canción" },
  ]
  return piezas.filter((x) => p.post_meses >= 3 || x.off <= 35)
}

/** Los offsets múltiplos de 7 desde un release en viernes caerían TODOS en
 *  viernes, de los peores días para IG y TikTok (Sprout Social). Se empujan al
 *  jueves más cercano, salvo las piezas ancladas al día del lanzamiento. */
export function mejorDia(fecha: string, plat: Plataforma, off: number): string {
  if (off === 0 || off === -1) return fecha // día del release y víspera: intocables
  if (plat === "yt") return fecha           // en YouTube jue/vie/sáb son buenos días
  const dow = D(fecha).getDay()
  if (dow === 5) return masDias(fecha, -1)  // viernes → jueves
  if (dow === 6) return masDias(fecha, -2)  // sábado  → jueves
  if (dow === 0) return masDias(fecha, -3)  // domingo → jueves
  if (dow === 1) return masDias(fecha, 1)   // lunes   → martes
  return fecha                              // mar/mié/jue ya son buenos
}

/** Devuelve las publicaciones nuevas del plan (no toca las que ya existen). */
export function generarPlan(s: Snapshot, proyectoId: string): Publicacion[] {
  const p = proyectoPorId(s, proyectoId)
  if (!p) return []
  const nuevas: Publicacion[] = []

  plantillaPlan(p).forEach((t, i) => {
    const fecha = evitarFestivos(mejorDia(evitarFestivos(masDias(p.release, t.off)), t.plat, t.off))
    const id = `post_${proyectoId}_${i}`
    if (s.publicaciones.some((x) => x.id === id)) return
    nuevas.push({
      id,
      cuenta: p.artista_id,
      proyecto_id: proyectoId,
      plataforma: t.plat,
      formato: t.fmt,
      pilar: t.pil,
      fecha,
      hora: HORARIOS_DEFAULT[t.plat],
      titulo: t.idea,
      hook: "", copy: "", hashtags: "", cta: "", link: "",
      asset_url: "", asset_name: "", thumb_url: "",
      version: 1,
      estado: "idea",
      responsable_id: null, notas: "",
      variantes: {}, m48: {}, m7: {}, aprobaciones: [],
    })
  })

  return nuevas
}

/** Nomenclatura estándar de archivo (convención Frame.io adaptada):
 *  AAAAMMDD_ARTISTA_RELEASE_FORMATO_PILAR_vNN */
export function nombreAsset(s: Snapshot, p: Publicacion): string {
  const slug = (v: string) =>
    (v || "").toString().toUpperCase().normalize("NFD")
      .replace(/[̀-ͯ]/g, "").replace(/[^A-Z0-9]/g, "").slice(0, 14) || "SINDATO"
  const proj = p.proyecto_id ? proyectoPorId(s, p.proyecto_id) : null
  return [
    (p.fecha || hoy()).replace(/-/g, ""),
    slug(nombreCuenta(s, p.cuenta)),
    slug(proj ? proj.titulo : "ORGANICO"),
    slug(p.formato),
    slug(PILARES[p.pilar] ? PILARES[p.pilar].label.replace(/^\S+\s/, "") : ""),
    "v" + String(p.version || 1).padStart(2, "0"),
  ].join("_")
}

/* ---------- métricas derivadas ----------
   Se mide sobre ALCANCE, no sobre seguidores: es lo que refleja qué tanto
   circuló la pieza, no qué tan grande es la cuenta. */
export function tasaInteraccion(m: Metricas | null | undefined): number | null {
  if (!m?.alcance) return null
  return (((m.likes ?? 0) + (m.comentarios ?? 0) + (m.guardados ?? 0) + (m.compartidos ?? 0)) / m.alcance) * 100
}

export function tasaCompartidos(m: Metricas | null | undefined): number | null {
  if (!m?.alcance) return null
  return ((m.compartidos ?? 0) / m.alcance) * 100
}

export const capacidadCopy = (plat: Plataforma) => PLATS[plat].cap
