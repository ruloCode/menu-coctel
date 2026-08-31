/**
 * Las reglas de la casa que Zeri tiene que saber de memoria.
 *
 * No están en `mg_config` porque no son parámetros del motor de fechas sino
 * política: a quién se le da qué ventana y en qué orden ocurren las cosas.
 * El motor calcula; esto explica POR QUÉ calcula así, y es lo que Zeri
 * responde cuando alguien pregunta.
 */

/** Artistas firmados con MG Company. Su campaña de pre-lanzamiento es de
 *  TRES meses; la de un artista no firmado, de UNO.
 *
 *  Ojo: esto duplica lo que ya dice `mg_artistas.tier` ('marca' = firmado,
 *  'compilado' = no firmado). Se guarda por nombre además del tier porque el
 *  equipo habla por nombre, no por tier, y porque un tier mal puesto en la
 *  base es un error que conviene poder detectar contrastándolo. */
export const FIRMADOS = [
  "Miguelacho TF",
  "Abner DK",
  "Hoppus DZ",
  "Cj's",
  "Bombo Hustle",
]

export const PRE_FIRMADO_MESES = 3
export const PRE_NO_FIRMADO_MESES = 1

/** Días entre el content day y el inicio del pre-lanzamiento. El rodaje va
 *  ANTES de que arranque la campaña: sin piezas no hay nada que publicar. */
export const CONTENT_ANTES_DE_PRE = { min: 7, max: 10 }

/** UN content day por CAMPAÑA, no uno por lanzamiento.
 *
 *  Un EP de artista firmado es una sola campaña: del mismo rodaje sale el
 *  contenido del tema 1, el del tema 2 y el del lanzamiento del EP. Esto es lo
 *  que hace que los tres meses de campaña cuadren — con un rodaje por
 *  lanzamiento salían tres días de rodaje donde el equipo solo hace uno. */
export const CONTENT_POR_CAMPANA = true

/** Días de rodaje: fin de semana. Varios artistas tienen trabajo entre semana
 *  y el content day los necesita a ellos delante de la cámara. */
export const RODAJE_EN_FIN_DE_SEMANA = true

/** Días entre el cierre de producción y el content day. Para rodar, las
 *  canciones tienen que estar producidas; pueden faltarles mezcla y master,
 *  pero no la producción. */
export const PRODUCCION_ANTES_DE_CONTENT = 7

export interface Regla {
  clave: string
  titulo: string
  cuerpo: string
}

export const REGLAS: Regla[] = [
  {
    clave: "pre",
    titulo: "Ventana de pre-lanzamiento",
    cuerpo:
      `Artistas firmados con MG (${FIRMADOS.join(", ")}): ${PRE_FIRMADO_MESES} meses de campaña ` +
      `antes del release. Artistas no firmados: ${PRE_NO_FIRMADO_MESES} mes.`,
  },
  {
    clave: "content",
    titulo: "Content day",
    cuerpo:
      `UNO por campaña, no uno por lanzamiento. Se agenda entre ${CONTENT_ANTES_DE_PRE.min} y ` +
      `${CONTENT_ANTES_DE_PRE.max} días ANTES de que arranque el pre-lanzamiento, en fin de semana ` +
      "porque varios artistas trabajan entre semana. De ese único rodaje sale el contenido de todos " +
      "los lanzamientos de la campaña: tema 1, tema 2 y el EP.",
  },
  {
    clave: "produccion",
    titulo: "Producción antes del rodaje",
    cuerpo:
      `Las canciones tienen que estar producidas ${PRODUCCION_ANTES_DE_CONTENT} días antes del ` +
      "content day. Pueden faltarles mezcla y master, pero no la producción: sin la canción hecha " +
      "no hay nada que rodar.",
  },
  {
    clave: "release",
    titulo: "Día de lanzamiento",
    cuerpo:
      "El viernes es el día por defecto porque los DSP refrescan sus listas ese día, pero no es el " +
      "único: el jueves funciona para lo que se apoya en un estreno de YouTube, y el sábado para lo " +
      "que vive en redes. Con treinta lanzamientos en siete meses no caben todos en viernes.",
  },
  {
    clave: "cascada",
    titulo: "Un cambio arrastra a los demás",
    cuerpo:
      "Mover una fecha de release recalcula todos los hitos derivados de ese proyecto, y en " +
      "artistas de marca empuja también su siguiente lanzamiento: no se solapan dos campañas del " +
      "mismo artista. Por eso un cambio de calendario lo aprueba quien opera, no quien lo pide.",
  },
  {
    clave: "fiestas",
    titulo: "Fiestas MG",
    cuerpo:
      "Residencia mensual el último sábado. El headliner sale de los releases de ese mismo mes, " +
      "así que mover un release puede cambiar quién encabeza la fiesta.",
  },
]

export const esFirmado = (nombre: string): boolean =>
  FIRMADOS.some((f) => f.toLowerCase() === nombre.trim().toLowerCase())

/** Meses de pre que le tocan a un artista, por nombre. */
export const mesesDePre = (nombre: string): number =>
  esFirmado(nombre) ? PRE_FIRMADO_MESES : PRE_NO_FIRMADO_MESES
