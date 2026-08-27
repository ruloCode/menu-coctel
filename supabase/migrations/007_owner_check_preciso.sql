-- ============================================================
-- La regla del owner unico solo debe mirar lo que la afecta
-- ============================================================
-- La 003 puso exigir_un_owner() como constraint trigger AFTER UPDATE OR DELETE
-- sobre CADA fila. Consecuencia: si en algun momento no hay owner activo,
-- cualquier UPDATE de perfiles falla — incluido "cambiar mi propio nombre" —
-- y la tabla queda bloqueada sin forma de salir desde la app.
--
-- La regla real es mas estrecha: solo hay que impedir que se pierda el ultimo
-- owner activo. Se comprueba unicamente cuando la fila afectada ERA un owner
-- activo y dejo de serlo.

DROP TRIGGER IF EXISTS exigir_un_owner_trigger ON public.perfiles;

CREATE OR REPLACE FUNCTION public.exigir_un_owner()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
BEGIN
    -- Sin sesion (service_role / SQL directo): via de recuperacion.
    IF auth.uid() IS NULL THEN
        RETURN NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.perfiles WHERE rol = 'owner' AND activo) THEN
        RAISE EXCEPTION 'La organizacion se quedaria sin owner activo';
    END IF;

    RETURN NULL;
END;
$$;

-- WHEN: solo filas que eran owner activo y dejan de serlo.
CREATE CONSTRAINT TRIGGER exigir_un_owner_update
    AFTER UPDATE ON public.perfiles
    DEFERRABLE INITIALLY DEFERRED
    FOR EACH ROW
    WHEN (OLD.rol = 'owner' AND OLD.activo
          AND (NEW.rol <> 'owner' OR NOT NEW.activo))
    EXECUTE FUNCTION public.exigir_un_owner();

CREATE CONSTRAINT TRIGGER exigir_un_owner_delete
    AFTER DELETE ON public.perfiles
    DEFERRABLE INITIALLY DEFERRED
    FOR EACH ROW
    WHEN (OLD.rol = 'owner' AND OLD.activo)
    EXECUTE FUNCTION public.exigir_un_owner();
