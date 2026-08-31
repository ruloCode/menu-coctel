-- ============================================================
-- REVERTIR las migraciones 013 y 014  (escape hatch, no se corre en el alta)
-- ============================================================
-- Este archivo NO es una migracion: vive fuera de supabase/migrations a
-- proposito para que no se aplique sola. Es la vuelta atras si el rol de area
-- resulta un error y hay que dejar la base como estaba el 30-ago-2026.
--
-- ANTES DE CORRERLO, comprobar que nadie tiene el rol:
--     SELECT email, rol FROM public.perfiles WHERE rol::text = 'produccion';
-- Si hay alguien, cambiarle el rol primero (a 'viewer', por ejemplo). Si no,
-- el ALTER de mas abajo no rompe nada pero esa persona se queda sin panel.
--
-- LIMITE CONOCIDO: el valor 'produccion' del enum rol_app NO se puede
-- eliminar. Postgres no admite quitar valores de un enum; solo recrear el tipo
-- entero, lo que obliga a convertir perfiles.rol y a soltar y rehacer las
-- funciones (rol_actual, tiene_rol) y todas las policies que dependen de
-- ellas. No compensa: un valor de enum que nadie usa es inerte.
-- Lo mismo aplica a 'zz_prueba_dry_run', que quedo de una prueba.

-- ---------- 014: accesos previstos ----------

-- handle_new_user vuelve EXACTAMENTE a su version anterior a la 014:
-- primer usuario -> owner activo; cualquier otro -> viewer inactivo.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
    es_primero BOOLEAN;
BEGIN
    SELECT NOT EXISTS (SELECT 1 FROM public.perfiles) INTO es_primero;

    INSERT INTO public.perfiles (id, email, nombre, rol, activo)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'nombre', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        CASE WHEN es_primero THEN 'owner'::public.rol_app ELSE 'viewer'::public.rol_app END,
        es_primero
    )
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS normalizar_email_previsto_trigger ON public.mg_accesos_previstos;
DROP FUNCTION IF EXISTS public.normalizar_email_previsto();
DROP TABLE IF EXISTS public.mg_accesos_previstos;

-- ---------- 013: propuestas de sesion ----------

DROP TRIGGER IF EXISTS proteger_confirmacion_sesion_trigger ON public.mg_eventos_extra;
DROP FUNCTION IF EXISTS public.proteger_confirmacion_sesion();

DROP POLICY IF EXISTS "produccion propone sesiones"   ON public.mg_eventos_extra;
DROP POLICY IF EXISTS "produccion ajusta su propuesta" ON public.mg_eventos_extra;
DROP POLICY IF EXISTS "produccion retira su propuesta" ON public.mg_eventos_extra;

DROP INDEX IF EXISTS public.idx_eventos_extra_propuestas;

-- OJO: esto borra las propuestas de sesion que hubiera registradas. Si
-- importan, exportarlas antes:
--     SELECT * FROM public.mg_eventos_extra WHERE propuesta;
ALTER TABLE public.mg_eventos_extra
    DROP COLUMN IF EXISTS propuesta,
    DROP COLUMN IF EXISTS propuesta_nota,
    DROP COLUMN IF EXISTS confirmado_por,
    DROP COLUMN IF EXISTS confirmado_at;

-- ---------- 013: canal del area ----------

-- OJO: si hay comentarios con entidad_tipo='area', este CHECK falla al
-- crearse. Borrarlos antes, o conservarlos y no revertir esta parte:
--     DELETE FROM public.mg_comentarios WHERE entidad_tipo = 'area';
ALTER TABLE public.mg_comentarios DROP CONSTRAINT IF EXISTS mg_comentarios_entidad_tipo_check;
ALTER TABLE public.mg_comentarios ADD CONSTRAINT mg_comentarios_entidad_tipo_check
    CHECK (entidad_tipo IN ('evento','proyecto','publicacion','radar','reunion'));

DROP FUNCTION IF EXISTS public.es_produccion();
