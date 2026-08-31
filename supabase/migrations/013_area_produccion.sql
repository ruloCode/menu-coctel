-- ============================================================
-- Rol de area: Produccion musical (2/2) — permisos y propuestas de estudio
-- ============================================================
-- Corre despues de la 012, que ya confirmo el valor 'produccion' del enum.
--
-- Que puede hacer este rol:
--   - ver y cerrar el trabajo del que es responsable   (ya lo daba la 008)
--   - comentar y mencionar, incluido el canal del area (CHECK ampliado abajo)
--   - PROPONER sesiones de estudio, que un manager confirma
-- Que NO puede:
--   - mover fechas de release ni tocar el plan          (puede_operar sigue cerrado)
--   - publicar en Redes, curar el radar, gestionar el equipo
--
-- Nota honesta sobre el alcance: es_staff() sigue dando SELECT sobre las
-- tablas operativas, porque media docena de policies de la 004 cuelgan de esa
-- funcion. Recortar la lectura exigiria reescribirlas todas y romperia las
-- vistas existentes. El objetivo de este rol es que el panel no agobie, no
-- aislar informacion: lo que se recorta de verdad es la navegacion y las
-- rutas (guardia en el layout del panel), no el SELECT crudo.

-- ---------- helper de rol ----------
-- Compara por texto y no con el literal del enum a proposito: si se comparara
-- como rol_app, Postgres resolveria 'produccion' al CREAR la funcion, y esto
-- fallaria si alguien corriera la 012 y la 013 en la misma transaccion.
CREATE OR REPLACE FUNCTION public.es_produccion()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp
AS $$ SELECT public.rol_actual()::text = 'produccion' $$;

-- ---------- canal de comunicacion del area ----------
-- mg_comentarios ya es polimorfico. Un canal de area es simplemente un hilo
-- con entidad_tipo='area' y entidad_id = el nombre del area ('produccion').
-- No hace falta tabla de mensajes: menciones, edicion y moderacion ya estan
-- resueltas para comentarios.
ALTER TABLE public.mg_comentarios DROP CONSTRAINT IF EXISTS mg_comentarios_entidad_tipo_check;
ALTER TABLE public.mg_comentarios ADD CONSTRAINT mg_comentarios_entidad_tipo_check
    CHECK (entidad_tipo IN ('evento','proyecto','publicacion','radar','reunion','area'));

-- ---------- propuestas de sesion de estudio ----------
-- Un arreglista sabe cuando necesita estudio mejor que quien arma el
-- calendario. Puede sembrar la fecha; confirmarla sigue siendo de quien opera,
-- porque la capacidad del estudio es un recurso compartido.
ALTER TABLE public.mg_eventos_extra
    ADD COLUMN IF NOT EXISTS propuesta BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS propuesta_nota TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS confirmado_por UUID REFERENCES public.perfiles(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS confirmado_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_eventos_extra_propuestas
    ON public.mg_eventos_extra (fecha) WHERE propuesta;

-- Solo propone: tipo sesion, marcada como propuesta y a su propio nombre.
-- Las policies son permisivas (se suman con OR), asi que esto no le quita
-- nada a la "escritura operativa" de la 004.
DROP POLICY IF EXISTS "produccion propone sesiones" ON public.mg_eventos_extra;
CREATE POLICY "produccion propone sesiones" ON public.mg_eventos_extra
    FOR INSERT TO authenticated
    WITH CHECK (
        public.es_produccion()
        AND tipo = 'sesion'
        AND propuesta
        AND creado_por = auth.uid()
    );

-- Puede corregir o retirar lo suyo mientras siga sin confirmar. Una vez
-- confirmada, la sesion es del calendario y solo la toca quien opera.
DROP POLICY IF EXISTS "produccion ajusta su propuesta" ON public.mg_eventos_extra;
CREATE POLICY "produccion ajusta su propuesta" ON public.mg_eventos_extra
    FOR UPDATE TO authenticated
    USING (public.es_produccion() AND creado_por = auth.uid() AND propuesta)
    WITH CHECK (public.es_produccion() AND creado_por = auth.uid() AND propuesta);

DROP POLICY IF EXISTS "produccion retira su propuesta" ON public.mg_eventos_extra;
CREATE POLICY "produccion retira su propuesta" ON public.mg_eventos_extra
    FOR DELETE TO authenticated
    USING (public.es_produccion() AND creado_por = auth.uid() AND propuesta);

-- Baranda: el WITH CHECK de arriba ya impide que se auto-confirme (exige que
-- propuesta siga siendo true), pero lo dejamos explicito y con mensaje claro,
-- porque es la invariante que sostiene todo el permiso.
CREATE OR REPLACE FUNCTION public.proteger_confirmacion_sesion()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
BEGIN
    IF OLD.propuesta AND NOT NEW.propuesta AND NOT public.puede_operar() THEN
        RAISE EXCEPTION 'Confirmar una sesion propuesta requiere rol owner, admin o manager';
    END IF;

    IF OLD.propuesta AND NOT NEW.propuesta THEN
        NEW.confirmado_por := auth.uid();
        NEW.confirmado_at  := now();
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS proteger_confirmacion_sesion_trigger ON public.mg_eventos_extra;
CREATE TRIGGER proteger_confirmacion_sesion_trigger
    BEFORE UPDATE ON public.mg_eventos_extra
    FOR EACH ROW EXECUTE FUNCTION public.proteger_confirmacion_sesion();
