-- ============================================================
-- Nivel 1 y 2: meter a las personas dentro del trabajo
-- ============================================================
-- Hasta aqui el panel sabia QUE pasa y CUANDO, pero no DE QUIEN es. Los unicos
-- campos que apuntaban a un usuario (creado_por, actualizado_por, actor) eran
-- auditoria: registran quien toco algo, no de quien es.
--
-- Decision de diseno: UN SOLO responsable por cosa. Duenos compartidos es lo
-- mismo que nadie responsable. Si hacen falta varias manos, se parte en varios
-- eventos.
--
-- Donde vive la asignacion: en mg_eventos_estado. Esa tabla ya existe para
-- anotar excepciones sobre los eventos que el motor DERIVA (fecha movida,
-- hecho, cancelado); el responsable es una anotacion mas. El calendario se
-- sigue calculando solo y ahora cada casilla puede tener dueno.
--
-- Consecuencia util: como mg_eventos_extra ya permite crear eventos a mano,
-- el modelo de eventos ES el modelo de tareas en cuanto tiene responsable.
-- No hace falta una entidad "tarea" aparte.

-- ---------- capacidad de las personas ----------
-- Para la vista de carga: cuantos bloques de trabajo aguanta a la semana.
ALTER TABLE public.perfiles
    ADD COLUMN IF NOT EXISTS capacidad_semanal INT NOT NULL DEFAULT 5
        CHECK (capacidad_semanal BETWEEN 0 AND 40);

-- ---------- responsable de cada evento derivado ----------
ALTER TABLE public.mg_eventos_estado
    ADD COLUMN IF NOT EXISTS responsable_id UUID REFERENCES public.perfiles(id) ON DELETE SET NULL,
    -- Prioridad para ordenar "Mi trabajo" cuando dos cosas caen el mismo dia.
    ADD COLUMN IF NOT EXISTS prioridad TEXT NOT NULL DEFAULT 'normal'
        CHECK (prioridad IN ('baja','normal','alta','urgente')),
    ADD COLUMN IF NOT EXISTS hecho_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS hecho_por UUID REFERENCES public.perfiles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_eventos_estado_responsable
    ON public.mg_eventos_estado (responsable_id) WHERE responsable_id IS NOT NULL;

-- Sella la marca de tiempo de completado sin que la aplicacion tenga que
-- acordarse: sirve para medir cuanto se cumple a tiempo.
CREATE OR REPLACE FUNCTION public.sellar_hecho()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
BEGIN
    IF NEW.hecho AND (OLD.hecho IS DISTINCT FROM NEW.hecho) THEN
        NEW.hecho_at := now();
        NEW.hecho_por := COALESCE(auth.uid(), NEW.hecho_por);
    ELSIF NOT NEW.hecho THEN
        NEW.hecho_at := NULL;
        NEW.hecho_por := NULL;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sellar_hecho_trigger ON public.mg_eventos_estado;
CREATE TRIGGER sellar_hecho_trigger
    BEFORE UPDATE ON public.mg_eventos_estado
    FOR EACH ROW EXECUTE FUNCTION public.sellar_hecho();

-- ---------- responsable de cada publicacion ----------
-- Reemplaza el TEXT libre, donde hoy alguien escribe "Juan" y manana "juanca".
ALTER TABLE public.mg_publicaciones
    ADD COLUMN IF NOT EXISTS responsable_id UUID REFERENCES public.perfiles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_publicaciones_responsable
    ON public.mg_publicaciones (responsable_id) WHERE responsable_id IS NOT NULL;

-- Lo que ya estuviera escrito a mano no se pierde: pasa a las notas.
UPDATE public.mg_publicaciones
   SET notas = trim(both from coalesce(notas,'') || ' · responsable anterior: ' || responsable)
 WHERE coalesce(responsable,'') <> '';

ALTER TABLE public.mg_publicaciones DROP COLUMN IF EXISTS responsable;

-- ---------- salud del proyecto ----------
-- Eje distinto de `estado`: ese describe la produccion musical (mezcla,
-- seleccion de masters). Un proyecto puede estar en mezcla Y en riesgo.
ALTER TABLE public.mg_proyectos
    ADD COLUMN IF NOT EXISTS lider_id UUID REFERENCES public.perfiles(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS salud TEXT NOT NULL DEFAULT 'sin_reportar'
        CHECK (salud IN ('sin_reportar','en_curso','en_riesgo','desviado')),
    ADD COLUMN IF NOT EXISTS salud_nota TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS salud_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS salud_por UUID REFERENCES public.perfiles(id) ON DELETE SET NULL;

-- Historial de reportes semanales: sin esto la salud es una foto sin memoria
-- y no se puede mostrar "iba en curso hace tres semanas y nadie lo dijo".
CREATE TABLE IF NOT EXISTS public.mg_salud_historial (
    id BIGSERIAL PRIMARY KEY,
    proyecto_id TEXT NOT NULL REFERENCES public.mg_proyectos(id) ON DELETE CASCADE,
    salud TEXT NOT NULL CHECK (salud IN ('en_curso','en_riesgo','desviado')),
    nota TEXT NOT NULL DEFAULT '',
    autor UUID REFERENCES public.perfiles(id) ON DELETE SET NULL,
    autor_nombre TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_salud_historial_proyecto
    ON public.mg_salud_historial (proyecto_id, created_at DESC);

-- ---------- comentarios ----------
-- Polimorfico por (entidad_tipo, entidad_id) porque se comenta sobre cosas de
-- naturaleza distinta: un evento derivado (id compuesto), un proyecto, una
-- publicacion o una ficha del radar. Una FK por tipo obligaria a cuatro tablas.
CREATE TABLE IF NOT EXISTS public.mg_comentarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entidad_tipo TEXT NOT NULL CHECK (entidad_tipo IN ('evento','proyecto','publicacion','radar')),
    entidad_id TEXT NOT NULL,
    cuerpo TEXT NOT NULL CHECK (length(trim(cuerpo)) > 0),
    menciones UUID[] NOT NULL DEFAULT '{}',
    autor UUID NOT NULL REFERENCES public.perfiles(id) ON DELETE CASCADE,
    autor_nombre TEXT NOT NULL DEFAULT '',
    editado_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comentarios_entidad
    ON public.mg_comentarios (entidad_tipo, entidad_id, created_at);

-- ---------- avisos ----------
-- Bandeja por persona. Se generan desde las Server Actions y no por trigger:
-- el mensaje necesita contexto que la fila sola no tiene (el nombre del
-- artista, la fecha del hito, quien te asigno).
CREATE TABLE IF NOT EXISTS public.mg_avisos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    perfil_id UUID NOT NULL REFERENCES public.perfiles(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL CHECK (tipo IN ('asignacion','mencion','aprobacion','salud','sistema')),
    titulo TEXT NOT NULL,
    cuerpo TEXT NOT NULL DEFAULT '',
    enlace TEXT NOT NULL DEFAULT '/admin',
    de UUID REFERENCES public.perfiles(id) ON DELETE SET NULL,
    de_nombre TEXT NOT NULL DEFAULT '',
    leido_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_avisos_bandeja
    ON public.mg_avisos (perfil_id, leido_at NULLS FIRST, created_at DESC);

DROP TRIGGER IF EXISTS set_mg_salud_historial_updated_at ON public.mg_salud_historial;

-- ============================================================
-- RLS
-- ============================================================

ALTER TABLE public.mg_salud_historial ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mg_comentarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mg_avisos ENABLE ROW LEVEL SECURITY;

-- Historial de salud: lo ve todo el staff, lo escribe quien opera. Append-only.
DROP POLICY IF EXISTS "lectura staff" ON public.mg_salud_historial;
CREATE POLICY "lectura staff" ON public.mg_salud_historial
    FOR SELECT TO authenticated USING (public.es_staff());

DROP POLICY IF EXISTS "reporta quien opera" ON public.mg_salud_historial;
CREATE POLICY "reporta quien opera" ON public.mg_salud_historial
    FOR INSERT TO authenticated WITH CHECK (public.puede_operar());

-- Comentarios: los ve todo el staff. Los escribe cualquiera menos viewer
-- (un artista tiene que poder responder sobre su propia pieza).
DROP POLICY IF EXISTS "lectura staff" ON public.mg_comentarios;
CREATE POLICY "lectura staff" ON public.mg_comentarios
    FOR SELECT TO authenticated USING (public.es_staff());

DROP POLICY IF EXISTS "comenta el staff salvo viewer" ON public.mg_comentarios;
CREATE POLICY "comenta el staff salvo viewer" ON public.mg_comentarios
    FOR INSERT TO authenticated
    WITH CHECK (autor = auth.uid() AND public.rol_actual() IS NOT NULL AND public.rol_actual() <> 'viewer');

-- Solo el autor edita o borra lo suyo. Un admin tambien puede borrar
-- (moderacion), pero nadie puede reescribir palabras ajenas.
DROP POLICY IF EXISTS "edita el autor" ON public.mg_comentarios;
CREATE POLICY "edita el autor" ON public.mg_comentarios
    FOR UPDATE TO authenticated USING (autor = auth.uid()) WITH CHECK (autor = auth.uid());

DROP POLICY IF EXISTS "borra el autor o un admin" ON public.mg_comentarios;
CREATE POLICY "borra el autor o un admin" ON public.mg_comentarios
    FOR DELETE TO authenticated USING (autor = auth.uid() OR public.es_admin());

-- Avisos: cada quien ve SOLO los suyos, ni siquiera un owner ve la bandeja ajena.
DROP POLICY IF EXISTS "mi bandeja" ON public.mg_avisos;
CREATE POLICY "mi bandeja" ON public.mg_avisos
    FOR SELECT TO authenticated USING (perfil_id = auth.uid());

DROP POLICY IF EXISTS "marco leidos los mios" ON public.mg_avisos;
CREATE POLICY "marco leidos los mios" ON public.mg_avisos
    FOR UPDATE TO authenticated USING (perfil_id = auth.uid()) WITH CHECK (perfil_id = auth.uid());

-- Insertar avisos para otra persona es legitimo (te asigno algo, te menciono),
-- pero solo desde una cuenta activa del staff.
DROP POLICY IF EXISTS "el staff avisa" ON public.mg_avisos;
CREATE POLICY "el staff avisa" ON public.mg_avisos
    FOR INSERT TO authenticated WITH CHECK (public.es_staff());

DROP POLICY IF EXISTS "borro los mios" ON public.mg_avisos;
CREATE POLICY "borro los mios" ON public.mg_avisos
    FOR DELETE TO authenticated USING (perfil_id = auth.uid());

-- ---------- que cada quien pueda cerrar SU propio trabajo ----------
-- Sin esto, "Mi trabajo" solo sirve a owner/admin/manager: un editor de
-- contenido veria sus pendientes sin poder marcarlos hechos.
-- WITH CHECK obliga a seguir siendo el responsable: puedes cerrar lo tuyo,
-- no reasignarselo a otro.
DROP POLICY IF EXISTS "cierro lo mio" ON public.mg_eventos_estado;
CREATE POLICY "cierro lo mio" ON public.mg_eventos_estado
    FOR UPDATE TO authenticated
    USING (responsable_id = auth.uid() AND public.es_staff())
    WITH CHECK (responsable_id = auth.uid() AND public.es_staff());
