import type { EstadoProyecto, Pilar, Plataforma, EstadoPost, TipoEvento, Slots, Relacion } from "./tipos"

// Los colores son variables CSS declaradas en app/admin/panel.css, para que
// el panel entero cambie de tema (claro/oscuro) sin tocar este archivo.

export const TIPOS_EVENTO: Record<TipoEvento, { label: string; color: string }> = {
  sesion:      { label: "Sesión de grabación",   color: "var(--c-sesion)" },
  content:     { label: "Content day",           color: "var(--c-content)" },
  pre:         { label: "Pre-lanzamiento",       color: "var(--c-pre)" },
  release:     { label: "Release",               color: "var(--c-release)" },
  fiesta:      { label: "Fiesta MG",             color: "var(--c-fiesta)" },
  post:        { label: "Post-lanzamiento",      color: "var(--c-post)" },
  hito:        { label: "Hito de entrega",       color: "var(--c-hito)" },
  seguimiento: { label: "Medición de radar",     color: "var(--c-seguimiento)" },
  publicacion: { label: "Publicación en redes",  color: "var(--c-publicacion)" },
}

export const ESTADOS: Record<EstadoProyecto, { label: string; color: string }> = {
  negociacion:       { label: "En negociación",      color: "var(--serious)" },
  sin_producir:      { label: "Sin producir",        color: "var(--c-sesion)" },
  grabacion:         { label: "En grabación",        color: "var(--c-sesion)" },
  mezcla:            { label: "Mezcla / master",     color: "var(--c-hito)" },
  seleccion_masters: { label: "Selección de masters",color: "var(--c-hito)" },
  confirmar_estado:  { label: "Confirmar estado",    color: "var(--warning)" },
  listo:             { label: "Listo para lanzar",   color: "var(--good)" },
  planeacion:        { label: "Planeación",          color: "var(--baseline)" },
  lanzado:           { label: "Lanzado",             color: "var(--good)" },
  pausado:           { label: "Pausado",             color: "var(--muted)" },
}

export const REGLAS_DEFAULT = {
  recordingDone: 56, // grabación musical terminada (días antes del release)
  masterFinal: 35,   // mezcla/master final
  contentDay: 45,    // día único de rodaje de contenido
  editingDone: 31,   // edición de contenido lista
  distributor: 28,   // entrega al distribuidor
  pitch: 21,         // pitch editorial (Spotify) — el mínimo oficial son 7 días
  presave: 21,       // pre-save activo
}

export const ETIQUETAS_REGLA: Record<keyof typeof REGLAS_DEFAULT, string> = {
  recordingDone: "Grabación musical terminada",
  masterFinal: "Mezcla y master final",
  contentDay: "Content day (rodaje)",
  editingDone: "Edición de contenido lista",
  distributor: "Entrega al distribuidor",
  pitch: "Pitch editorial (Spotify)",
  presave: "Pre-save activo",
}

export const AJUSTES_DEFAULT = {
  weeklyCap: 8,         // bloques de 4 h planificados por semana (máx real 12 → colchón ~33%)
  maxCap: 12,
  sessionDays: [2, 4, 6], // martes, jueves, sábado
  satBlocks: 2,
  weekdayBlocks: 1,
  partyDay: "lastSat",
  horizonEnd: "2027-12-31",
}

/* ---------------- Redes ---------------- */

export const PLATS: Record<Plataforma, {
  label: string; icon: string; color: string; formats: string[]
  best: string; cap: number; freq: string
}> = {
  ig: {
    label: "Instagram", icon: "📸", color: "var(--c-fiesta)",
    formats: ["Reel", "Carrusel", "Foto feed", "Story"],
    best: "Mar–Mié 12:00–19:00 · pico local Bogotá 13:00 y 20:00",
    cap: 2200, freq: "3–5 por semana",
  },
  tt: {
    label: "TikTok", icon: "🎵", color: "var(--c-sesion)",
    formats: ["Video", "Foto carrusel", "En vivo"],
    best: "Mar–Jue 14:00–18:00 · pico local 11:00–13:00 y 19:00–21:00",
    cap: 2200, freq: "3–5 por semana",
  },
  yt: {
    label: "YouTube", icon: "▶️", color: "var(--c-content)",
    formats: ["Short", "Video largo", "Video oficial", "Premiere"],
    best: "Largo: entre semana 14:00–16:00 (2–3 h antes del pico 18–21 h) · Shorts: 12–14 h y 18–19 h",
    cap: 5000, freq: "1–2 largos + 3–5 Shorts por semana",
  },
}

export const SPECS: Record<string, {
  ratio: string; res: string; dur: string; copy: number; opt: number; tags: string; nota?: string
}> = {
  "Reel":          { ratio: "9:16", res: "1080×1920", dur: "3 s – 20 min (no pasar de 3 min para audiencia nueva)", copy: 2200, opt: 150, tags: "30 máx. — ojo: −31,7% de vistas con hashtags (Metricool 2026)" },
  "Carrusel":      { ratio: "4:5", res: "1080×1350", dur: "—", copy: 2200, opt: 150, tags: "30 máx.", nota: "El formato más rentable hoy para cuentas pequeñas: 9× más guardados que la foto única." },
  "Foto feed":     { ratio: "4:5 o 1:1", res: "1080×1350 / 1080×1080", dur: "—", copy: 2200, opt: 150, tags: "30 máx." },
  "Story":         { ratio: "9:16", res: "1080×1920", dur: "60 s por card", copy: 0, opt: 0, tags: "—", nota: "Dejar ~250 px libres arriba y abajo (zona de interfaz)." },
  "Video":         { ratio: "9:16", res: "1080×1920", dur: "3 s – 10 min (15–30 s rinde mejor)", copy: 2200, opt: 150, tags: "3–5", nota: "Zona segura: evitar 10% superior y 15% inferior." },
  "Foto carrusel": { ratio: "9:16", res: "1080×1920", dur: "—", copy: 2200, opt: 150, tags: "3–5" },
  "En vivo":       { ratio: "9:16", res: "1080×1920", dur: "—", copy: 0, opt: 0, tags: "—" },
  "Short":         { ratio: "9:16", res: "1080×1920", dur: "hasta 3 min", copy: 100, opt: 50, tags: "3–5 (el hashtag 16 anula TODOS)" },
  "Video largo":   { ratio: "16:9", res: "1920×1080 · H.264/AAC 8 Mbps", dur: "—", copy: 100, opt: 50, tags: "3–5", nota: "Miniatura 1280×720." },
  "Video oficial": { ratio: "16:9", res: "1920×1080", dur: "—", copy: 100, opt: 50, tags: "3–5", nota: "Miniatura 1280×720." },
  "Premiere":      { ratio: "16:9", res: "1920×1080", dur: "—", copy: 100, opt: 50, tags: "3–5" },
}

export const PILARES: Record<Pilar, { label: string; desc: string; grupo: string }> = {
  musica:   { label: "🎵 Música",              desc: "Adelantos, en vivo, estudio, la canción sonando", grupo: "marca" },
  bts:      { label: "🎬 Detrás de cámaras",   desc: "Cómo se hizo: rodaje, sesión, ensayo",            grupo: "marca" },
  personal: { label: "💬 Personal / historia", desc: "Quién es el artista, de dónde viene, qué piensa", grupo: "marca" },
  fans:     { label: "🤝 Interacción",         desc: "Responder, retos, duetos, comunidad, colegas",    grupo: "comunidad" },
  promo:    { label: "📣 Promo directa",       desc: "“Sale el viernes”, link, pre-save, boletas",      grupo: "promo" },
}

export const ESTADOS_POST: Record<EstadoPost, { label: string; icon: string; color: string }> = {
  idea:       { label: "Idea",              icon: "💡", color: "var(--muted)" },
  guion:      { label: "Guion",             icon: "📝", color: "var(--c-hito)" },
  grabado:    { label: "Grabado",           icon: "🎥", color: "var(--c-sesion)" },
  editado:    { label: "Editado",           icon: "✂️", color: "var(--c-content)" },
  revision:   { label: "En aprobación",     icon: "👀", color: "var(--warning)" },
  ajustes:    { label: "Ajustes pedidos",   icon: "↩️", color: "var(--serious)" },
  aprobado:   { label: "Aprobado",          icon: "👍", color: "var(--c-pre)" },
  programado: { label: "Programado",        icon: "📅", color: "var(--c-release)" },
  publicado:  { label: "Publicado",         icon: "✅", color: "var(--good)" },
  error:      { label: "Error al publicar", icon: "🔴", color: "var(--critical)" },
}

/** Huecos recurrentes por red (la "cola" de Buffer), en las mejores ventanas
 *  y esquivando viernes y fin de semana en IG y TikTok. */
export const SLOTS_DEFAULT: Slots = {
  ig: [{ dow: 2, hora: "13:00" }, { dow: 3, hora: "13:00" }, { dow: 4, hora: "13:00" }, { dow: 2, hora: "19:00" }],
  tt: [{ dow: 2, hora: "20:00" }, { dow: 3, hora: "20:00" }, { dow: 4, hora: "20:00" }, { dow: 3, hora: "12:00" }],
  yt: [{ dow: 4, hora: "15:00" }, { dow: 5, hora: "15:00" }, { dow: 6, hora: "12:00" }],
}

export const HORARIOS_DEFAULT: Record<Plataforma, string> = { ig: "13:00", tt: "20:00", yt: "15:00" }

/* ---------------- Radar ---------------- */

export const NETS: Record<string, { label: string; icon: string; metrics: [string, string][] }> = {
  ig: { label: "Instagram", icon: "📸", metrics: [["ig_seg", "Seguidores"], ["ig_sig", "Seguidos"], ["ig_pub", "Publicaciones"]] },
  tt: { label: "TikTok",    icon: "🎵", metrics: [["tt_seg", "Seguidores"], ["tt_sig", "Seguidos"], ["tt_vid", "Videos"], ["tt_lik", "Me gusta totales"]] },
  yt: { label: "YouTube",   icon: "▶️", metrics: [["yt_sub", "Suscriptores"], ["yt_vid", "Videos"], ["yt_vis", "Vistas totales"]] },
  sp: { label: "Spotify",   icon: "🎧", metrics: [["sp_oy", "Oyentes mensuales"], ["sp_seg", "Seguidores"]] },
}

export interface CampoRadar {
  k: string
  l: string
  t: "text" | "num" | "money" | "pct" | "stars" | "chk" | "sel" | "date"
  o?: string[]
}

const PROV_COMUN: CampoRadar[] = [
  { k: "tarifa", l: "Tarifa concreta (COP)", t: "money" },
  { k: "rango", l: "Rango de tarifa", t: "sel", o: ["Económico", "Medio", "Alto", "Por negociar"] },
  { k: "dispo", l: "Disponibilidad", t: "sel", o: ["Inmediata", "1-2 semanas", "1 mes", "Saturado"] },
  { k: "entrega", l: "Tiempo de entrega (días)", t: "num" },
  { k: "calidad", l: "Calidad del trabajo", t: "stars" },
  { k: "plazos", l: "Cumple plazos", t: "stars" },
  { k: "urbanos", l: "Ha trabajado con urbanos", t: "chk" },
  { k: "porta", l: "Portafolio público", t: "chk" },
  { k: "equipo", l: "Tiene equipo propio", t: "chk" },
  { k: "conMG", l: "Trabajos hechos con MG", t: "num" },
]

export type TipoScore = "artista" | "musico" | "creador" | "influencer" | "dj" | "venue" | "proveedor" | "prensa"

export const CATS: Record<string, { label: string; nets: string[]; score: TipoScore | null; fields: CampoRadar[] }> = {
  artista: { label: "🎤 Artista / cantante", nets: ["ig", "tt", "yt", "sp"], score: "artista", fields: [
    { k: "genero", l: "Género", t: "text" }, { k: "ciudad", l: "Ciudad", t: "text" },
    { k: "eng", l: "Interacción promedio (%)", t: "pct" },
    { k: "posts", l: "Publicaciones al mes", t: "num" },
    { k: "inv_video", l: "Invierte en video oficial", t: "chk" },
    { k: "inv_dist", l: "Distribuye en DSP", t: "chk" },
    { k: "inv_foto", l: "Invierte en fotos/arte", t: "chk" },
    { k: "inv_mezcla", l: "Paga mezcla/master pro", t: "chk" },
    { k: "criterio", l: "Criterio MG (oído propio)", t: "stars" }] },
  musico: { label: "🎸 Músico / instrumentista", nets: ["ig", "yt"], score: "musico", fields: [
    { k: "instrumento", l: "Instrumento", t: "text" },
    { k: "tecnico", l: "Nivel técnico", t: "stars" },
    { k: "versatil", l: "Versatilidad de géneros", t: "stars" },
    { k: "actitud", l: "Cumplimiento y actitud", t: "stars" },
    { k: "tarifa", l: "Tarifa por sesión (COP)", t: "money" },
    { k: "s_estudio", l: "Tiene estudio propio", t: "chk" },
    { k: "s_vivo", l: "Toca en vivo con frecuencia", t: "chk" },
    { k: "s_equipo", l: "Tiene equipo propio", t: "chk" }] },
  creador: { label: "🎬 Creador de contenido", nets: ["ig", "tt", "yt"], score: "creador", fields: [
    { k: "nicho", l: "Nicho", t: "text" },
    { k: "eng", l: "Interacción promedio (%)", t: "pct" },
    { k: "posts", l: "Publicaciones al mes", t: "num" },
    { k: "prod", l: "Calidad de producción", t: "stars" },
    { k: "encaje", l: "Encaje con MG", t: "stars" }] },
  influencer: { label: "📣 Influencer", nets: ["ig", "tt", "yt"], score: "influencer", fields: [
    { k: "nicho", l: "Nicho", t: "text" },
    { k: "eng", l: "Interacción promedio (%)", t: "pct" },
    { k: "posts", l: "Publicaciones al mes", t: "num" },
    { k: "local", l: "Audiencia local (Bogotá/Colombia)", t: "chk" },
    { k: "urbano_aud", l: "Su público escucha urbano", t: "chk" },
    { k: "criterio", l: "Criterio MG", t: "stars" }] },
  dj: { label: "🎧 DJ", nets: ["ig", "tt", "sp"], score: "dj", fields: [
    { k: "sets", l: "Sets al mes", t: "num" },
    { k: "urbano", l: "Enfoque urbano", t: "stars" },
    { k: "pincha", l: "Pincha nuestra música", t: "chk" },
    { k: "eng", l: "Interacción promedio (%)", t: "pct" },
    { k: "criterio", l: "Criterio MG", t: "stars" }] },
  venue: { label: "🍸 Bar / venue", nets: ["ig", "tt"], score: "venue", fields: [
    { k: "aforo", l: "Aforo (personas)", t: "num" },
    { k: "envivo", l: "Programa música en vivo", t: "chk" },
    { k: "enfoque", l: "Enfoque urbano/alternativo", t: "stars" },
    { k: "eventos", l: "Eventos al mes", t: "num" },
    { k: "publica", l: "Publica video de los shows", t: "chk" },
    { k: "zona", l: "Zona / dirección", t: "text" },
    { k: "contacto", l: "Contacto de programación", t: "text" },
    { k: "condiciones", l: "Condiciones (taquilla, mínimo de consumo…)", t: "text" }] },
  festival: { label: "🎪 Festival / convocatoria", nets: ["ig"], score: null, fields: [
    { k: "cierre", l: "Fecha de cierre", t: "date" },
    { k: "costo", l: "Costo de inscripción (COP)", t: "money" },
    { k: "link", l: "Link de la convocatoria", t: "text" },
    { k: "requisitos", l: "Requisitos clave", t: "text" },
    { k: "aplicamos", l: "Ya aplicamos", t: "chk" }] },
  productor: { label: "🎹 Productor musical / beatmaker", nets: ["ig", "yt"], score: "proveedor", fields: [
    ...PROV_COMUN,
    { k: "incluye_mezcla", l: "Incluye mezcla", t: "chk" },
    { k: "cede_puntos", l: "Acepta ceder puntos del master", t: "chk" },
    { k: "generos", l: "Géneros que produce", t: "text" }] },
  ingeniero: { label: "🎚 Ingeniero de mezcla y master", nets: ["ig"], score: "proveedor", fields: [
    ...PROV_COMUN,
    { k: "servicio", l: "Servicio", t: "sel", o: ["Solo mezcla", "Solo master", "Mezcla y master"] },
    { k: "revisiones", l: "Revisiones incluidas", t: "num" },
    { k: "lufs", l: "Entrega a −14 LUFS (estándar DSP)", t: "chk" }] },
  videografo: { label: "🎥 Videógrafo / director de video", nets: ["ig", "tt", "yt"], score: "proveedor", fields: [
    ...PROV_COMUN,
    { k: "incluye_edicion", l: "Incluye edición", t: "chk" },
    { k: "dron", l: "Tiene dron", t: "chk" },
    { k: "luces", l: "Tiene set de luces", t: "chk" }] },
  fotografo: { label: "📷 Fotógrafo", nets: ["ig"], score: "proveedor", fields: [
    ...PROV_COMUN,
    { k: "retoque", l: "Incluye retoque", t: "chk" },
    { k: "estudio", l: "Tiene estudio / locación", t: "chk" }] },
  visuales: { label: "✨ Visuales / VJ / motion graphics", nets: ["ig", "yt"], score: "proveedor", fields: [
    ...PROV_COMUN,
    { k: "vivo", l: "Hace visuales en vivo", t: "chk" },
    { k: "lyric", l: "Hace lyric videos", t: "chk" }] },
  disenador: { label: "🎨 Diseñador gráfico / portadas", nets: ["ig"], score: "proveedor", fields: [
    ...PROV_COMUN,
    { k: "portadas", l: "Hace portadas de release", t: "chk" },
    { k: "merch", l: "Diseña merch", t: "chk" }] },
  estilista: { label: "👗 Estilista / vestuario y maquillaje", nets: ["ig"], score: "proveedor", fields: [
    ...PROV_COMUN,
    { k: "vestuario", l: "Consigue vestuario", t: "chk" },
    { k: "maquillaje", l: "Hace maquillaje", t: "chk" }] },
  bailarin: { label: "💃 Bailarín / coreógrafo", nets: ["ig", "tt"], score: "proveedor", fields: [
    ...PROV_COMUN,
    { k: "coreo", l: "Crea coreografía original", t: "chk" },
    { k: "grupo", l: "Tiene grupo de bailarines", t: "chk" }] },
  manager: { label: "💼 Manager / booking", nets: ["ig"], score: null, fields: [
    { k: "artistas", l: "Artistas que maneja", t: "text" },
    { k: "contacto", l: "Contacto directo", t: "text" },
    { k: "venues", l: "Venues/promotores con los que trabaja", t: "text" }] },
  prensa: { label: "📰 Medio / prensa / curador de playlist", nets: ["ig", "tt", "sp"], score: "prensa", fields: [
    { k: "tipo", l: "Tipo", t: "sel", o: ["Medio digital", "Podcast", "Radio", "Curador de playlist", "Blog"] },
    { k: "afinidad", l: "Afinidad con lo urbano", t: "stars" },
    { k: "emergentes", l: "Abre puerta a emergentes", t: "stars" },
    { k: "criterio", l: "Criterio MG", t: "stars" },
    { k: "contacto", l: "Contacto / correo de pitch", t: "text" }] },
  marca: { label: "🤝 Marca / patrocinador", nets: ["ig", "tt"], score: null, fields: [
    { k: "sector", l: "Sector", t: "text" },
    { k: "presupuesto", l: "Presupuesto estimado (COP)", t: "money" },
    { k: "tipo_patro", l: "Tipo de apoyo", t: "sel", o: ["Dinero", "Producto/canje", "Locación", "Mixto"] },
    { k: "contacto", l: "Contacto de marketing", t: "text" }] },
}

export const RELACIONES: Relacion[] = [
  "no hemos hablado", "contactado", "conversando", "negociando", "aliado", "descartado",
]

export const RECS: Record<TipoScore, [number, string, string][]> = {
  artista:    [[75, "LISTO PARA EP", "var(--good)"], [55, "DESARROLLAR", "var(--c-sesion)"], [35, "OBSERVAR", "var(--warning)"], [0, "NO POR AHORA", "var(--muted)"]],
  musico:     [[75, "LLAMAR PARA SESIÓN", "var(--good)"], [55, "BUENA OPCIÓN", "var(--c-sesion)"], [35, "DE RESPALDO", "var(--warning)"], [0, "DESCARTAR", "var(--muted)"]],
  creador:    [[75, "ALIADO CLAVE", "var(--good)"], [55, "PROBAR COLAB", "var(--c-sesion)"], [35, "OBSERVAR", "var(--warning)"], [0, "NO POR AHORA", "var(--muted)"]],
  influencer: [[75, "ALIADO CLAVE", "var(--good)"], [55, "PROBAR CAMPAÑA", "var(--c-sesion)"], [35, "OBSERVAR", "var(--warning)"], [0, "NO POR AHORA", "var(--muted)"]],
  dj:         [[75, "BOOKEAR", "var(--good)"], [55, "BUENA OPCIÓN", "var(--c-sesion)"], [35, "OBSERVAR", "var(--warning)"], [0, "NO POR AHORA", "var(--muted)"]],
  venue:      [[75, "SEDE IDEAL", "var(--good)"], [55, "BUENA OPCIÓN", "var(--c-sesion)"], [35, "DE RESPALDO", "var(--warning)"], [0, "NO SIRVE", "var(--muted)"]],
  proveedor:  [[75, "CONTRATAR YA", "var(--good)"], [55, "BUENA OPCIÓN", "var(--c-sesion)"], [35, "DE RESPALDO", "var(--warning)"], [0, "DESCARTAR", "var(--muted)"]],
  prensa:     [[75, "PITCHEAR YA", "var(--good)"], [55, "PITCHEAR", "var(--c-sesion)"], [35, "OBSERVAR", "var(--warning)"], [0, "NO POR AHORA", "var(--muted)"]],
}
