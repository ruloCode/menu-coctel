// Modelo de dominio del panel MG. Los ids son strings ('a1', 'p3') porque el
// motor de eventos compone ids derivados del tipo `p3:release`.

export type RolApp = "owner" | "admin" | "manager" | "contenido" | "artista" | "viewer"

export interface Perfil {
  id: string
  email: string
  nombre: string
  rol: RolApp
  activo: boolean
  avatar_url: string | null
  artista_id: string | null
  /** Bloques de trabajo que aguanta a la semana; base de la vista de carga. */
  capacidad_semanal: number
  ultimo_acceso: string | null
  created_at: string
}

export type Prioridad = "baja" | "normal" | "alta" | "urgente"

/** Salud del proyecto. Eje distinto de EstadoProyecto, que describe la
 *  produccion musical: algo puede estar en mezcla Y en riesgo. */
export type Salud = "sin_reportar" | "en_curso" | "en_riesgo" | "desviado"

export type Tier = "marca" | "compilado"

export interface Artista {
  id: string
  nombre: string
  tier: Tier
  confirmado: boolean
  orden: number
}

export type EstadoProyecto =
  | "negociacion" | "sin_producir" | "grabacion" | "mezcla" | "seleccion_masters"
  | "confirmar_estado" | "listo" | "planeacion" | "lanzado" | "pausado"

export interface Proyecto {
  id: string
  artista_id: string
  titulo: string
  tipo: string
  tracks: number
  grabados: number
  release: string      // YYYY-MM-DD
  pre_start: string
  post_meses: number
  estado: EstadoProyecto
  notas: string
  lider_id: string | null
  salud: Salud
  salud_nota: string
  salud_at: string | null
  salud_por: string | null
}

export interface ReporteSalud {
  id: number
  proyecto_id: string
  salud: Exclude<Salud, "sin_reportar">
  nota: string
  autor_nombre: string
  created_at: string
}

export type TipoEvento =
  | "sesion" | "content" | "pre" | "release" | "fiesta"
  | "post" | "hito" | "seguimiento" | "publicacion"

export interface Evento {
  id: string
  tipo: TipoEvento
  fecha: string
  etiqueta: string
  proyecto_id: string | null
  /** Solo en sesiones de grabacion: no cabe antes del deadline. */
  tarde?: boolean
  /** Anotaciones que vienen de mg_eventos_estado, resueltas por el motor. */
  responsable_id: string | null
  prioridad: Prioridad
  hecho: boolean
}

export interface EventoEstado {
  evento_id: string
  fecha_override: string | null
  hecho: boolean
  eliminado: boolean
  responsable_id: string | null
  prioridad: Prioridad
  hecho_at: string | null
}

export interface EventoExtra {
  id: string
  tipo: TipoEvento
  fecha: string
  etiqueta: string
  proyecto_id: string | null
}

export interface Reglas {
  recordingDone: number
  masterFinal: number
  contentDay: number
  editingDone: number
  distributor: number
  pitch: number
  presave: number
}

export interface Ajustes {
  weeklyCap: number
  maxCap: number
  sessionDays: number[]
  satBlocks: number
  weekdayBlocks: number
  partyDay: string
  horizonEnd: string
}

export interface Slot { dow: number; hora: string }
export type Slots = Record<"ig" | "tt" | "yt", Slot[]>

export interface Config {
  reglas: Reglas
  ajustes: Ajustes
  slots: Slots | null
}

export type Plataforma = "ig" | "tt" | "yt"
export type Pilar = "musica" | "bts" | "personal" | "fans" | "promo"
export type EstadoPost =
  | "idea" | "guion" | "grabado" | "editado" | "revision"
  | "ajustes" | "aprobado" | "programado" | "publicado" | "error"

export interface Metricas {
  alcance?: number
  likes?: number
  comentarios?: number
  guardados?: number
  compartidos?: number
  seguidores?: number
  clics?: number
  retencion?: number
}

export interface Aprobacion {
  d: string
  quien: string
  accion: "aprobado" | "cambios" | "enviado"
  nota?: string
}

export interface Publicacion {
  id: string
  cuenta: string            // 'mg' o un artista_id
  proyecto_id: string | null
  plataforma: Plataforma
  formato: string
  pilar: Pilar
  fecha: string
  hora: string
  titulo: string
  hook: string
  copy: string
  hashtags: string
  cta: string
  link: string
  asset_url: string
  asset_name: string
  thumb_url: string
  version: number
  estado: EstadoPost
  responsable_id: string | null
  notas: string
  variantes: Record<string, { copy?: string; hashtags?: string }>
  m48: Metricas
  m7: Metricas
  aprobaciones: Aprobacion[]
}

export type Relacion =
  | "no hemos hablado" | "contactado" | "conversando" | "negociando" | "aliado" | "descartado"

export interface Medicion {
  d: string
  m: Record<string, number>
}

export interface FichaRadar {
  id: string
  origen: "externo" | "roster"
  artista_id: string | null
  nombre: string
  cat: string
  rel: Relacion
  urls: Record<string, string>
  campos: Record<string, string | number | boolean>
  mediciones: Medicion[]
  proxima: string | null
}

export interface EntradaBitacora {
  id: number
  fecha: string
  mensaje: string
  actor_nombre: string
  created_at: string
}

export type EntidadComentable = "evento" | "proyecto" | "publicacion" | "radar"

export interface Comentario {
  id: string
  entidad_tipo: EntidadComentable
  entidad_id: string
  cuerpo: string
  menciones: string[]
  autor: string
  autor_nombre: string
  editado_at: string | null
  created_at: string
}

export type TipoAviso = "asignacion" | "mencion" | "aprobacion" | "salud" | "sistema"

export interface Aviso {
  id: string
  perfil_id: string
  tipo: TipoAviso
  titulo: string
  cuerpo: string
  enlace: string
  de_nombre: string
  leido_at: string | null
  created_at: string
}

export interface TextoGuardado {
  id: string
  tipo: "texto" | "tags"
  etiqueta: string
  contenido: string
}

/** Todo lo que el panel necesita en memoria para derivar el calendario. */
export interface Snapshot {
  artistas: Artista[]
  proyectos: Proyecto[]
  eventosEstado: Record<string, EventoEstado>
  eventosExtra: EventoExtra[]
  config: Config
  publicaciones: Publicacion[]
  radar: FichaRadar[]
  textos: TextoGuardado[]
  bitacora: EntradaBitacora[]
  /** El equipo, para poder asignar y dibujar la carga. */
  equipo: Perfil[]
  comentarios: Comentario[]
}
