import type { RolApp } from "@/lib/mg/tipos"

/**
 * Zeri tiene una persona distinta por área. No es cosmético: cada área habla
 * de cosas distintas y le importan datos distintos, así que las sugerencias,
 * el vocabulario y la memoria documental cambian con el rol.
 *
 * `dominios` es lo que acota su memoria: los documentos que sube un área solo
 * los consulta esa área. Un tratado de mezcla no le sirve a quien escribe
 * guiones, y al revés.
 */
export interface Persona {
  /** Cómo se presenta. Va después de "Hola, <nombre>". */
  presentacion: string
  /** En qué es útil, en una línea, para la cabecera del chat. */
  foco: string
  /** Arranques sugeridos: la diferencia entre un chat vacío y uno que se usa. */
  sugerencias: string[]
  /** Etiquetas de la memoria documental de esta área. */
  dominios: string[]
  /** Color de acento de la burbuja de Zeri. */
  color: string
}

const OPERATIVO: Persona = {
  presentacion:
    "Soy Zeri. Llevo el calendario y el estado de los proyectos, y puedo aplicar cambios directamente.",
  foco: "Calendario, proyectos y estado del roster",
  sugerencias: [
    "¿Qué está en riesgo?",
    "¿Qué sale este mes?",
    "El Album 1 se atrasó 3 semanas",
    "¿Qué me toca esta semana?",
  ],
  dominios: ["operacion", "planeacion"],
  color: "var(--brand)",
}

export const PERSONAS: Record<RolApp, Persona> = {
  owner: OPERATIVO,
  admin: OPERATIVO,
  manager: OPERATIVO,

  produccion: {
    presentacion:
      "Soy Zeri. Te ayudo con lo tuyo de producción musical: composición, arreglos, grabación y las fechas de estudio.",
    foco: "Producción musical · composición, arreglos y grabación",
    sugerencias: [
      "¿Qué me toca esta semana?",
      "¿Cómo va el Album 1?",
      "Necesito estudio la próxima semana",
      "Terminamos de grabar una canción del Album 1",
    ],
    dominios: ["produccion-musical", "composicion", "arreglos", "mezcla", "mastering"],
    color: "var(--c-sesion)",
  },

  audiovisual: {
    presentacion:
      "Soy Zeri. Te ayudo con lo tuyo de audiovisual: guion, rodaje, edición y el calendario de contenido.",
    foco: "Producción audiovisual · guion, rodaje y edición",
    sugerencias: [
      "¿Qué me toca esta semana?",
      "¿Cuándo es el próximo content day?",
      "¿Qué piezas faltan para el próximo lanzamiento?",
      "El rodaje se movió una semana",
    ],
    dominios: ["guion", "narrativa", "direccion", "edicion", "color"],
    color: "var(--c-content)",
  },

  contenido: {
    presentacion:
      "Soy Zeri. Te ayudo con el calendario de contenido y con lo que cada lanzamiento necesita publicar.",
    foco: "Contenido y redes",
    sugerencias: [
      "¿Qué me toca esta semana?",
      "¿Qué hay pendiente de aprobar?",
      "¿Cuándo es el próximo content day?",
    ],
    dominios: ["contenido", "redes", "copywriting"],
    color: "var(--c-publicacion)",
  },

  artista: {
    presentacion: "Soy Zeri. Te cuento cómo va tu lanzamiento y qué viene ahora.",
    foco: "Tu lanzamiento",
    sugerencias: ["¿Cómo va mi proyecto?", "¿Cuándo sale?", "¿Qué me toca?"],
    dominios: [],
    color: "var(--c-fiesta)",
  },

  viewer: {
    presentacion: "Soy Zeri. Puedo contarte cómo va todo, aunque desde tu cuenta no se cambia nada.",
    foco: "Consulta",
    sugerencias: ["¿Qué sale este mes?", "¿Qué está en riesgo?"],
    dominios: [],
    color: "var(--muted)",
  },
}

export const personaDe = (rol: RolApp | null | undefined): Persona =>
  (rol ? PERSONAS[rol] : undefined) ?? PERSONAS.viewer

/** Saludo con el nombre de pila de quien abrió el panel. La hora se calcula en
 *  el cliente: en el servidor es UTC y en Bogotá saldría "buenas noches" a
 *  media tarde. */
export function saludo(nombre: string, hora = new Date().getHours()): string {
  const franja = hora < 12 ? "Buenos días" : hora < 19 ? "Buenas tardes" : "Buenas noches"
  return `${franja}, ${nombre.split(" ")[0]}.`
}
