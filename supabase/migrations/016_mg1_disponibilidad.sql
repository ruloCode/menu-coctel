-- ============================================================
-- Disponibilidad de los inscritos a MG1
-- ============================================================
-- El equipo pregunta por WhatsApp y va anotando aqui. No es un campo del
-- formulario publico: quienes ya se inscribieron no van a volver a llenarlo.
--
-- Se guarda como JSONB { "YYYY-MM-DD": ["manana","tarde"] } y no como una
-- columna por fecha a proposito. Las fechas del reality son tentativas hasta
-- que se cierre con el estudio; con columnas, cada corrimiento de fecha seria
-- una migracion y una perdida de datos. El catalogo de fechas vive en
-- lib/mg1-disponibilidad.ts, que es tambien quien sanea lo que entra.
--
-- Franjas: manana | tarde | noche  (bloques con horario)
--          dia                      (bloques de si/no, como la gala)

ALTER TABLE public.mg1_inscripciones
    ADD COLUMN IF NOT EXISTS disponibilidad JSONB NOT NULL DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS disponibilidad_actualizada TIMESTAMP WITH TIME ZONE;

-- Objeto plano, nunca un array ni un escalar: el resto del codigo lo indexa
-- por fecha y una lista lo romperia en silencio.
ALTER TABLE public.mg1_inscripciones
    DROP CONSTRAINT IF EXISTS mg1_disponibilidad_es_objeto;
ALTER TABLE public.mg1_inscripciones
    ADD CONSTRAINT mg1_disponibilidad_es_objeto
    CHECK (jsonb_typeof(disponibilidad) = 'object');

COMMENT ON COLUMN public.mg1_inscripciones.disponibilidad IS
    'Mapa fecha -> franjas que la persona confirmo. {} = nada marcado.';
COMMENT ON COLUMN public.mg1_inscripciones.disponibilidad_actualizada IS
    'Cuando se anoto por ultima vez. NULL = todavia no se le ha preguntado, que es distinto de "no puede ningun dia".';
