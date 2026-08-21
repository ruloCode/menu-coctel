-- Inscripciones al Concurso MG1 (convocatoria publica)
--
-- Datos personales de aspirantes -> tabla de solo escritura para el publico:
--   anon  -> puede INSERT (el formulario), NUNCA SELECT/UPDATE/DELETE
--   service_role -> acceso total (bypass de RLS) para leer y curar inscripciones
--
-- Es decir: aunque la publishable key es publica, nadie puede listar los
-- datos personales de los inscritos. Solo se pueden agregar.

CREATE TABLE IF NOT EXISTS public.mg1_inscripciones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    edicion TEXT NOT NULL DEFAULT 'mg1-2026',

    nombre_artistico TEXT NOT NULL,
    nombre_completo TEXT NOT NULL,
    email TEXT NOT NULL,
    celular TEXT NOT NULL,
    ciudad TEXT NOT NULL,
    link_musica TEXT NOT NULL,
    por_que TEXT,

    -- Curaduria interna
    estado TEXT NOT NULL DEFAULT 'nuevo'
        CHECK (estado IN ('nuevo', 'preseleccionado', 'seleccionado', 'descartado')),
    notas TEXT,

    -- Trazabilidad (Ley 1581 de 2012: constancia de la autorizacion)
    acepta_terminos BOOLEAN NOT NULL DEFAULT true,
    origen TEXT,
    user_agent TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Un correo = una inscripcion por edicion (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS idx_mg1_inscripciones_email_edicion
    ON public.mg1_inscripciones (lower(email), edicion);

CREATE INDEX IF NOT EXISTS idx_mg1_inscripciones_estado
    ON public.mg1_inscripciones (estado);

CREATE INDEX IF NOT EXISTS idx_mg1_inscripciones_created_at
    ON public.mg1_inscripciones (created_at DESC);

-- Definida tambien en 001; se repite aqui para que esta migracion corra sola.
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_mg1_inscripciones_updated_at ON public.mg1_inscripciones;
CREATE TRIGGER set_mg1_inscripciones_updated_at
    BEFORE UPDATE ON public.mg1_inscripciones
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.mg1_inscripciones ENABLE ROW LEVEL SECURITY;

-- El formulario publico solo puede AGREGAR inscripciones.
DROP POLICY IF EXISTS "Cualquiera puede inscribirse a MG1" ON public.mg1_inscripciones;
CREATE POLICY "Cualquiera puede inscribirse a MG1" ON public.mg1_inscripciones
    FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Sin policy de SELECT/UPDATE/DELETE a proposito: los datos personales de los
-- inscritos solo se leen con la service_role key (dashboard o backend de MG).

COMMENT ON TABLE public.mg1_inscripciones IS 'Inscripciones a la convocatoria del Concurso MG1. Contiene datos personales: acceso solo via service_role.';
COMMENT ON COLUMN public.mg1_inscripciones.edicion IS 'Permite reusar la tabla en ediciones siguientes del concurso.';
COMMENT ON COLUMN public.mg1_inscripciones.origen IS 'Path o campaña desde donde llego la inscripcion.';
