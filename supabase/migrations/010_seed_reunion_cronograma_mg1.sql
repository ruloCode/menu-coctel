-- ============================================================
-- Primera acta: cronograma del reality y evento final (27 ago 2026)
-- ============================================================
-- Junta de 21 minutos. Se decidieron las fechas de todo el Concurso MG1, desde
-- el cierre de la convocatoria hasta la fiesta de cierre, y salieron dieciseis
-- compromisos con fecha. Se cargan como eventos para que caigan en Mi trabajo,
-- el Calendario y la Carga del equipo sin sincronizacion aparte.

INSERT INTO public.mg_reuniones (id, titulo, fecha, duracion_min, participantes, resumen, decisiones, riesgos, pendientes)
VALUES (
  'r-2026-08-27-mg1',
  'Cronograma del reality y evento final',
  '2026-08-27',
  21,
  ARRAY['Equipo MG', 'Nico', 'Mestizo', 'Miguel', 'Juanfe', 'Recursos Humanos (nueva)'],
$resumen$La junta cerró el calendario completo del Concurso MG1, desde el cierre de la convocatoria hasta la fiesta final, y dejó amarrado cómo se conecta con los tres lanzamientos del sello que ya estaban en septiembre.

El punto de partida fue qué hacer con los 42 inscritos. En vez de mandárselos todos al jurado, se decidió filtrarlos primero: llamarlos o escribirles para explicarles el formato real —dos días de grabación— y confirmar si de verdad tienen la disponibilidad. El objetivo es que al jurado le lleguen unos 20 y de ahí salgan 12. El argumento fue de tiempo del jurado, pero apareció uno más fuerte: esos 42 no son solo aspirantes, son clientes potenciales de la marca, y por eso se decidió estirar la convocatoria quince días más con una campaña de cierre en vez de cortarla ya.

Sobre presupuesto quedó tensión sin resolver. Hay 120–130 lucas sin gastar en pauta. Una posición es guardarlas para cuando el reality ya esté al aire; la otra es gastarlas ahora, e incluso subir a 200, con el argumento de que cada inscrito es alguien que después puede trabajar con MG o comprar boleta. Se aplazó la decisión.

El bloque más pesado fue el de producción. Antes del reality hay tres días de grabación que no se pueden mover, uno por artista —Miguelacho, Li Foms y MC Trocka—, y cada uno tiene que producir 30 contenidos de prelanzamiento más el video oficial. Se discutió comprimirlos a uno o dos días grabando por zonas, pero se aceptó que son tres días porque en cada uno se graba también el audiovisual del lanzamiento. Quedó dicho en voz alta que este ritmo es el de los próximos seis meses.

De ahí salió la cadena de fechas: la convocatoria cierra el viernes 11 de septiembre con un open mic de cierre en Bambú de 5 a 8 de la tarde; el reality se graba del 25 al 30 de septiembre; se deja una semana de edición más una semana de colchón; y el primer capítulo sale el 16 de octubre, con entregas semanales.

El cierre es una fiesta en bar el 30 o el 31 de octubre. Se prefiere el 30 —viernes— porque el 31 es Halloween en sábado y los bares no van a ceder su noche más rentable. Se acordó mandar la misma propuesta a toda la lista de bares empezando por Def, y armar un cartel con line-up para que la propuesta tenga con qué convencer. Johnny y Queen Tsafari son la carta: hay que avisarles ya, aunque todavía no haya plata, para que no comprometan esa fecha.

En marketing se decidió correr dos campañas en paralelo, una con Clau y otra del equipo, y medir cuál rinde. El aprendizaje incómodo de la convocatoria fue que el contenido creativo del equipo tuvo menos impacto que lo orgánico de los jurados, y que parte del problema es la cuenta de Instagram que se usó: tiene bots y casi ninguna interacción real.$resumen$,
$decisiones$[
  {"texto":"Filtrar los 42 inscritos antes de enviarlos al jurado","detalle":"Llamar o escribir a cada uno, explicar que son dos días de grabación y confirmar disponibilidad. Meta: ~20 al jurado, 12 seleccionados. CJ y Opus llevan los mensajes directos."},
  {"texto":"La convocatoria cierra el viernes 11 de septiembre","detalle":"Quince días más de los previstos, con campaña de cierre. Los inscritos se tratan como clientes potenciales de la marca, no solo como aspirantes."},
  {"texto":"Open mic de cierre el 11 de septiembre en Bambú, de 5 a 8 pm","detalle":"Después de las cinco a propósito, para que alcance quien trabaja en horario de oficina. Sirve de cierre de convocatoria y de generación de comunidad."},
  {"texto":"Tres días de grabación de lanzamientos del sello en septiembre","detalle":"Uno por artista: Miguelacho, Li Foms y MC Trocka. Cada día produce 30 contenidos de prelanzamiento más el video oficial. No necesariamente seguidos, pero dentro de la misma semana."},
  {"texto":"El reality se graba del 25 al 30 de septiembre","detalle":"Quince días después del cierre. Hay que preguntar a los estudios desde ya."},
  {"texto":"Estreno del reality el 16 de octubre, capítulo semanal","detalle":"Una semana de edición más una semana de colchón por si algún video falla."},
  {"texto":"Evento final el 30 de octubre (alternativa: 31)","detalle":"Se prefiere el viernes 30: el 31 es Halloween en sábado y los bares no ceden su noche más rentable. Horario tipo 6 a 9 pm."},
  {"texto":"Def es el primer bar al que se manda la propuesta","detalle":"Lista por orden: Def, Cacao, Pangola Project, Sonora, Perecea, Videoclub, Odem, Federal Rooftop, Pepino, La Negra, Cósmico Video Bar, Tejo Turmequé, Get Down. Descartado: Bella U. Ojo con Cacao: lo están funando."},
  {"texto":"Se arma un cartel con line-up para negociar con el bar","detalle":"Johnny y Queen Tsafari como carta principal, uno a tres temas. Se les ofrece fotos y video para redes. El acuerdo económico con el bar va por cover o porcentaje."},
  {"texto":"Dos campañas de marketing en paralelo y se mide cuál funciona","detalle":"Una con Clau, otra del equipo. Mitad y mitad de los contenidos."}
]$decisiones$::jsonb,
$riesgos$[
  {"texto":"No hay locación para grabar el reality y quedan menos de cuatro semanas","nivel":"alto"},
  {"texto":"No hay bar confirmado para el evento final","nivel":"alto"},
  {"texto":"Los premios del concurso siguen sin definirse","nivel":"alto"},
  {"texto":"La cuenta de Instagram usada tiene bots y casi ninguna interacción real: la primera ciudad de audiencia era Estambul","nivel":"medio"},
  {"texto":"Los tres días de grabación de septiembre se pisan con la preparación del reality","nivel":"medio"},
  {"texto":"El 31 de octubre hay muchísimos eventos en Bogotá; los bares no van a prestar su mejor noche","nivel":"medio"},
  {"texto":"Johnny y Queen Tsafari podrían agarrar otro compromiso para el 30/31 si no se les avisa ya","nivel":"medio"}
]$riesgos$::jsonb,
$pendientes$[
  {"texto":"¿Se gastan o no las 120–130 lucas que quedan en pauta? Se aplazó la decisión."},
  {"texto":"¿Quién organiza el open mic del 11? Se mencionó a Freddy pero no quedó cerrado."},
  {"texto":"Hay una inconsistencia entre 'publicar desde el 10' y 'estrenar el 16 de octubre'. Falta fijar cuál es la fecha real del capítulo 1."},
  {"texto":"¿Se le paga a Johnny y a Queen Tsafari o se cuenta con que lo hagan de gratis?"},
  {"texto":"¿De quién son los intercomunicadores que se iban a pedir prestados para el rodaje?"}
]$pendientes$::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- ---------- Los acuerdos, como eventos con fecha ----------
INSERT INTO public.mg_eventos_extra (id, tipo, fecha, etiqueta, reunion_id) VALUES
  ('r1-confirmar42',   'hito',    '2026-08-31', '📞 Llamar a los 42 inscritos: explicar formato y confirmar disponibilidad',        'r-2026-08-27-mg1'),
  ('r1-horarios',      'hito',    '2026-08-31', '🕐 Definir y comunicar los horarios del reality a los participantes',              'r-2026-08-27-mg1'),
  ('r1-avisarjohnny',  'hito',    '2026-08-28', '🎤 Avisar a Johnny y Queen Tsafari que reserven el 30–31 de octubre',              'r-2026-08-27-mg1'),
  ('r1-barespropuesta','hito',    '2026-09-01', '🍸 Enviar propuesta de evento a los bares, empezando por Def',                     'r-2026-08-27-mg1'),
  ('r1-estudios',      'hito',    '2026-09-01', '🎚 Cotizar y reservar estudios para grabar el reality (25–30 sep)',                'r-2026-08-27-mg1'),
  ('r1-auditar-ig',    'hito',    '2026-09-03', '📉 Auditar la cuenta de Instagram: bots y audiencia fuera de mercado',             'r-2026-08-27-mg1'),
  ('r1-campanas',      'content', '2026-09-05', '📣 Montar las dos campañas de cierre (Clau / equipo) y definir cómo se miden',      'r-2026-08-27-mg1'),
  ('r1-jurado20',      'hito',    '2026-09-08', '📤 Enviar al jurado los ~20 preseleccionados que ya confirmaron',                   'r-2026-08-27-mg1'),
  ('r1-cartel',        'hito',    '2026-09-09', '🎫 Armar el cartel con line-up para negociar con el bar',                          'r-2026-08-27-mg1'),
  ('r1-camisetas',     'hito',    '2026-09-10', '👕 Mandar a hacer las camisetas del concurso',                                     'r-2026-08-27-mg1'),
  ('r1-cierre',        'hito',    '2026-09-11', '🔒 Cierre de la convocatoria MG1',                                                 'r-2026-08-27-mg1'),
  ('r1-openmic',       'fiesta',  '2026-09-11', '🎙 Open mic de cierre en Bambú · 5 a 8 pm',                                        'r-2026-08-27-mg1'),
  ('r1-premios',       'hito',    '2026-09-15', '🏆 Definir los premios del concurso',                                              'r-2026-08-27-mg1'),
  ('r1-locacion',      'hito',    '2026-09-15', '📍 Conseguir la locación de grabación del reality',                                'r-2026-08-27-mg1'),
  ('r1-intercom',      'hito',    '2026-09-20', '📻 Conseguir prestados los intercomunicadores para el rodaje',                     'r-2026-08-27-mg1'),
  ('r1-rodaje',        'content', '2026-09-25', '🎬 Grabación del reality MG1 (del 25 al 30 de septiembre)',                        'r-2026-08-27-mg1'),
  ('r1-edicion',       'hito',    '2026-10-10', '✂️ Capítulo 1 editado y listo para publicar',                                      'r-2026-08-27-mg1'),
  ('r1-estreno',       'release', '2026-10-16', '📺 Estreno del reality MG1 · capítulo semanal',                                    'r-2026-08-27-mg1'),
  ('r1-evento',        'fiesta',  '2026-10-30', '🎉 Evento final del Concurso MG1 en bar · 6 a 9 pm',                               'r-2026-08-27-mg1')
ON CONFLICT (id) DO NOTHING;
