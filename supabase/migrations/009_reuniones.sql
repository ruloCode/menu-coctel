-- ============================================================
-- Reuniones: de la conversacion a los compromisos
-- ============================================================
-- El problema real: las juntas de MG duran 20-40 minutos, se deciden ocho
-- cosas y a la semana siguiente nadie recuerda quien quedo de hacer que. La
-- transcripcion sola no lo resuelve: nadie relee 21 minutos de texto.
--
-- Decision de diseno: los acuerdos NO son una entidad nueva. Son eventos en
-- mg_eventos_extra con responsable en mg_eventos_estado, exactamente como
-- cualquier otro trabajo. Consecuencia: un compromiso nacido en una junta
-- aparece solo en Mi trabajo, en el Calendario y en la Carga del equipo, sin
-- ningun codigo de sincronizacion. Lo unico que se agrega es de donde salio.

CREATE TABLE IF NOT EXISTS public.mg_reuniones (
    id TEXT PRIMARY KEY,
    titulo TEXT NOT NULL,
    fecha DATE NOT NULL,
    duracion_min INT,
    /** Resumen narrativo: lo que hay que leer si no estuviste. */
    resumen TEXT NOT NULL DEFAULT '',
    /** [{texto, detalle}] — lo que quedo decidido, no lo que se discutio. */
    decisiones JSONB NOT NULL DEFAULT '[]'::jsonb,
    /** [{texto, nivel}] — nivel: 'alto' | 'medio' | 'bajo'. */
    riesgos JSONB NOT NULL DEFAULT '[]'::jsonb,
    /** [{texto}] — preguntas que quedaron sin responder en la junta. */
    pendientes JSONB NOT NULL DEFAULT '[]'::jsonb,
    participantes TEXT[] NOT NULL DEFAULT '{}',
    /** Opcional. Se guarda solo si el equipo decide que quiere el crudo:
     *  una transcripcion completa suele traer conversacion privada que no
     *  tiene por que quedar archivada. */
    transcripcion TEXT NOT NULL DEFAULT '',
    creado_por UUID REFERENCES public.perfiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reuniones_fecha ON public.mg_reuniones (fecha DESC);

DROP TRIGGER IF EXISTS set_mg_reuniones_updated_at ON public.mg_reuniones;
CREATE TRIGGER set_mg_reuniones_updated_at
    BEFORE UPDATE ON public.mg_reuniones
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- De donde salio el compromiso. ON DELETE SET NULL: borrar el acta no puede
-- borrar el trabajo que ya esta repartido.
ALTER TABLE public.mg_eventos_extra
    ADD COLUMN IF NOT EXISTS reunion_id TEXT REFERENCES public.mg_reuniones(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_eventos_extra_reunion
    ON public.mg_eventos_extra (reunion_id) WHERE reunion_id IS NOT NULL;

-- ---------- RLS ----------
ALTER TABLE public.mg_reuniones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "lectura staff" ON public.mg_reuniones;
CREATE POLICY "lectura staff" ON public.mg_reuniones
    FOR SELECT TO authenticated USING (public.es_staff());

DROP POLICY IF EXISTS "escritura operativa" ON public.mg_reuniones;
CREATE POLICY "escritura operativa" ON public.mg_reuniones
    FOR ALL TO authenticated
    USING (public.puede_operar()) WITH CHECK (public.puede_operar());
