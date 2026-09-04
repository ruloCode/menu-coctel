/**
 * Contenido de Karen Dayanna, tal como viene de su press kit oficial.
 *
 * Vive aparte porque lo consumen dos vistas: la pagina web
 * (`page.tsx`) y la version imprimible (`press-kit/page.tsx`). Si el texto
 * viviera en una de las dos, la otra se quedaria atras en la primera correccion.
 */
import type { Sencillo } from "@/components/artists/kd-sencillos"
import type { FotoGaleria } from "@/components/artists/kd-galeria"
import type { Cifra } from "@/components/artists/kd-cifras"

export const SLUG = "karen-dayanna"
export const CORREO = "daka.musicaindependiente@gmail.com"
export const SPOTIFY_ARTISTA = "2KjluTBGvdPx6fU9VM726a"
/** Lo genera scripts/generar-pdf-karen-dayanna.mjs desde la vista /press-kit. */
export const PRESS_KIT_PDF = "/press/press-kit-karen-dayanna.pdf"

export const SENCILLOS: Sencillo[] = [
  {
    titulo: "Pa' Toda la Vida",
    orden: "Sencillo debut",
    cover: "/artists/karen-dayanna/cover-pa-toda-la-vida.jpg",
    texto:
      "Sencillo debut con el cual Karen Dayanna abre su camino en la escena musical. La canción se despliega como un retrato honesto de las emociones que perduran en el tiempo: el amor, la memoria y los vínculos que nos marcan profundamente.",
    enlace: "https://hypeddit.com/0twf6n",
    spotify: "32dGDntKihs16UaKouk1dq",
  },
  {
    titulo: "Volaré",
    orden: "Segundo lanzamiento",
    cover: "/artists/karen-dayanna/cover-volare.jpg",
    texto:
      "Una propuesta íntima que entrelaza la calidez de lo acústico con una sensibilidad moderna. A través de la metáfora del vuelo retrata el proceso de enfrentar la vida, invitando a reflexionar sobre los procesos personales y la valentía necesaria para avanzar.",
    enlace: "https://hypeddit.com/i9pwd8",
    spotify: "5egrbBjj1OAkjNFJDgVUoX",
  },
]

export const FOTOS: FotoGaleria[] = [
  {
    src: "/artists/karen-dayanna/kd-closeup.jpg",
    foco: "object-[center_25%]",
    alto: "aspect-[4/5]",
    pie: "Retrato nocturno",
    deriva: 28,
  },
  {
    src: "/artists/karen-dayanna/kd-live-01.jpg",
    foco: "object-[center_35%]",
    alto: "aspect-[3/4]",
    pie: "En vivo · La Casa de Los Amigos",
    deriva: -34,
  },
  {
    src: "/artists/karen-dayanna/kd-blazer.jpg",
    foco: "object-[center_20%]",
    alto: "aspect-[4/5]",
    pie: "Sesión de prensa",
    deriva: 20,
  },
  {
    src: "/artists/karen-dayanna/kd-sesion-cuarto.jpg",
    alto: "aspect-[16/10]",
    pie: "Sesión de Pa' Toda la Vida",
    deriva: -22,
  },
  {
    src: "/artists/karen-dayanna/kd-live-sala.jpg",
    alto: "aspect-[16/10]",
    pie: "Puesta en escena completa · La Casa de Los Amigos",
    deriva: 30,
  },
  {
    src: "/artists/karen-dayanna/kd-portrait.jpg",
    foco: "object-[center_15%]",
    alto: "aspect-[3/4]",
    pie: "Retrato oficial",
    deriva: -26,
  },
]

export const CIFRAS: Cifra[] = [
  {
    valor: 200,
    sufijo: "+",
    etiqueta: "Streams",
    fuentes: "Spotify · Soundcloud · YouTube · Pandora",
  },
  {
    valor: 700,
    sufijo: "+",
    etiqueta: "Follows / subs",
    fuentes: "Meta · TikTok · YouTube",
  },
  {
    valor: 21.5,
    sufijo: "K+",
    decimales: 1,
    etiqueta: "Views",
    fuentes: "Alcance en redes sociales",
  },
]

export const RIDER: { titulo: string; puntos: string[] }[] = [
  {
    titulo: "Formato de presentación",
    puntos: ["Solista acústico", "Solista acústico + pista"],
  },
  {
    titulo: "Audio",
    puntos: [
      "1 micrófono para voz (Shure SM58 o equivalente)",
      "1 caja directa para guitarra acústica",
    ],
  },
  {
    titulo: "Escenario",
    puntos: [
      "Espacio mínimo de 2 × 2 m",
      "1 monitor de piso (preferible, si aplica)",
      "Alimentación eléctrica suficiente para instrumento",
      "Iluminación cálida o neutra (preferible)",
    ],
  },
  {
    titulo: "Presentación",
    puntos: [
      "Duración: 30 o 45 min",
      "Prueba de sonido: 30 – 60 min",
      "Rider técnico detallado disponible bajo solicitud",
    ],
  },
]


/** Los tres parrafos de su biografia, en el orden del press kit. */
export const BIOGRAFIA = [
  "Karen Dayanna es una cantautora de Bogotá con una propuesta que combina el alma de la canción de autor con influencias del pop, el indie, el folclore y el soft rock, logrando un sonido fresco y sensible.",
  "A través de sus letras busca explorar los procesos de transformación, cargados de emoción y honestidad, invitando a quien escucha a reconocerse en ellas.",
  "Su obra trasciende a la memoria y el recuerdo, habita y crea alrededor de la levedad del ser: viste y se abandera en la piel de todo lo sensible, lo íntimo y lo humano.",
]

/** Cierre de la biografia, que en el EPK va recuadrado aparte. */
export const NOTA_ESCENARIO =
  "Sus presentaciones combinan el abrazo cálido de la remembranza, la profundidad sonora y una conexión intensa con las emociones, creando experiencias inmersivas en cada escenario."

export const NOTA_EN_VIVO =
  "Cada presentación de Karen Dayanna propone un espacio íntimo donde la música se convierte en refugio. A través de una puesta en escena cálida y cercana, el público recorre historias de memoria y transformación, creando una experiencia que trasciende el concierto para convertirse en un encuentro emocional."

export const NOTA_PLATAFORMAS =
  "A través de plataformas digitales, performances en vivo y eventos, Karen abre su camino en la escena emergente, posicionándose como una de las voces frescas que apuestan por la autenticidad en la música independiente de Bogotá."

/** Ficha tecnica del aside de la pagina y de la portada del PDF. */
export const FICHA: [string, string][] = [
  ["Origen", "Bogotá, Colombia"],
  ["Género", "Canción de autor · Pop · Indie · Folk"],
  ["Formato", "Solista acústico · Solista + pista"],
  ["Movilidad", "Nacional e internacional"],
  ["Sello", "MG Company Group"],
]
