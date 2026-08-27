-- ============================================================
-- Semilla: roster y calendario de lanzamientos 2026-2027
-- ============================================================
-- Datos reales trabajados en el prototipo mg-dashboard_1.html.
-- Idempotente (ON CONFLICT DO NOTHING): si el equipo ya edito algo en el
-- panel, volver a correr la migracion no lo pisa.

INSERT INTO public.mg_artistas (id, nombre, tier, confirmado, orden) VALUES
    ('a1',  'Miguelacho TF', 'marca',     false,  1),
    ('a2',  'Abner DK',      'marca',     true,   2),
    ('a3',  'Bombo Hustle',  'marca',     false,  3),
    ('a4',  'CJ',            'marca',     false,  4),
    ('a5',  'Hoppus DZ',     'marca',     false,  5),
    ('a6',  'MC Trocka',     'compilado', false,  6),
    ('a7',  'Li Foms',       'compilado', false,  7),
    ('a8',  'FK',            'compilado', false,  8),
    ('a9',  'CJ Bless',      'compilado', false,  9),
    ('a10', 'Joky',          'compilado', false, 10),
    ('a11', 'Pyro',          'compilado', false, 11),
    ('a12', 'Queen Tsafari', 'compilado', false, 12),
    ('a13', 'Nikory',        'compilado', false, 13),
    ('a14', 'Daya',          'compilado', false, 14),
    ('a15', 'Kalao Sens',    'compilado', false, 15),
    ('a16', 'Frank Takuma',  'compilado', false, 16)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.mg_proyectos
    (id, artista_id, titulo, tipo, tracks, grabados, release, pre_start, post_meses, estado, notas) VALUES
    ('p1',  'a1',  'EP 1',                      'EP',         4,  4, '2026-12-11', '2026-10-01', 3, 'seleccion_masters', 'Canciones terminadas; falta elegir masters finales.'),
    ('p2',  'a1',  'Lanzamiento 2',             'Por definir',4,  0, '2027-06-11', '2027-03-12', 3, 'planeacion',        'Arranca al cerrar el post de EP 1.'),
    ('p3',  'a2',  'One Life Is All You Get',   'Album',     10, 10, '2027-01-08', '2026-11-01', 3, 'seleccion_masters', 'Su "verdadero debut".'),
    ('p4',  'a2',  'Lanzamiento 2',             'Por definir',4,  0, '2027-07-09', '2027-04-09', 3, 'planeacion',        ''),
    ('p5',  'a3',  'Album 1',                   'Album',     10,  0, '2027-02-12', '2026-12-01', 3, 'confirmar_estado',  'Confirmar cuantas canciones ya existen.'),
    ('p6',  'a3',  'Lanzamiento 2',             'Por definir',4,  0, '2027-08-13', '2027-05-13', 3, 'planeacion',        ''),
    ('p7',  'a4',  'EP 1',                      'EP',         4,  0, '2027-03-12', '2027-01-01', 3, 'confirmar_estado',  ''),
    ('p8',  'a4',  'Lanzamiento 2',             'Por definir',4,  0, '2027-09-10', '2027-06-10', 3, 'planeacion',        ''),
    ('p9',  'a5',  'EP 1',                      'EP',         4,  0, '2027-04-09', '2027-02-01', 3, 'confirmar_estado',  ''),
    ('p10', 'a5',  'Lanzamiento 2',             'Por definir',4,  0, '2027-10-08', '2027-07-08', 3, 'planeacion',        ''),
    ('p11', 'a6',  'EP',                        'EP',         4,  4, '2026-11-06', '2026-09-07', 1, 'confirmar_estado',  'Confirmar que la musica esta lista y masterizada.'),
    ('p12', 'a7',  'EP',                        'EP',         4,  4, '2026-11-20', '2026-09-21', 1, 'confirmar_estado',  'Confirmar estado de la musica.'),
    ('p13', 'a8',  'Album',                     'Album',     10, 10, '2026-12-04', '2026-10-05', 1, 'confirmar_estado',  'Confirmar estado de la musica.'),
    ('p14', 'a13', 'Como Tu (single)',          'Single',     1,  1, '2026-10-30', '2026-09-01', 1, 'confirmar_estado',  'Primer lanzamiento del calendario. Confirmar master.'),
    ('p15', 'a13', 'EP',                        'EP',         3,  0, '2027-05-14', '2027-03-14', 1, 'sin_producir',      'Se lanza despues de que el single construya base.'),
    ('p16', 'a9',  'EP',                        'EP',         4,  0, '2027-01-22', '2026-11-22', 1, 'negociacion',       'Falta cerrar negociacion antes de agendar.'),
    ('p17', 'a10', 'EP',                        'EP',         5,  0, '2027-02-19', '2026-12-19', 1, 'sin_producir',      '5 canciones por producir desde cero.'),
    ('p18', 'a11', 'EP',                        'EP',         3,  0, '2027-03-19', '2027-01-19', 1, 'sin_producir',      ''),
    ('p19', 'a12', 'EP',                        'EP',         3,  0, '2027-04-16', '2027-02-16', 1, 'sin_producir',      ''),
    ('p20', 'a14', 'EP',                        'EP',         4,  0, '2027-06-18', '2027-04-18', 1, 'sin_producir',      ''),
    ('p21', 'a15', 'EP - confirmar # temas',    'EP',         3,  0, '2027-07-16', '2027-05-16', 1, 'sin_producir',      'Confirmar cuantas canciones seran.'),
    ('p22', 'a16', 'EP',                        'EP',         5,  0, '2027-08-20', '2027-06-20', 1, 'sin_producir',      '')
ON CONFLICT (id) DO NOTHING;

-- Ficha de radar para cada artista del roster: sin una primera medicion de
-- redes no hay linea base para medir crecimiento.
INSERT INTO public.mg_radar (id, origen, artista_id, nombre, cat, rel)
SELECT 'roster:' || a.id, 'roster', a.id, a.nombre, 'artista', 'aliado'
FROM public.mg_artistas a
ON CONFLICT (id) DO NOTHING;
