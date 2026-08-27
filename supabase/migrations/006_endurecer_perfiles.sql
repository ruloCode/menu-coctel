-- ============================================================
-- Endurecimiento del control de acceso sobre public.perfiles
-- ============================================================
-- Dos correcciones sobre la 003:
--
-- 1) ESCALADA POR artista_id. La policy de UPDATE deja que cada quien edite su
--    propia fila (para el nombre y el avatar), y el trigger solo protegia rol y
--    activo. Un usuario con rol 'artista' podia entonces apuntarse a si mismo a
--    CUALQUIER ficha del roster y quedar habilitado para aprobar las
--    publicaciones de ese artista. artista_id pasa a ser campo de admin.
--
-- 2) RECUPERACION FUERA DE BANDA. El trigger exigia un owner/admin autenticado
--    incluso cuando auth.uid() es NULL, es decir desde la service_role key o
--    desde el SQL editor de Supabase. Eso dejaba la instalacion sin salida si
--    se pierde el acceso del unico owner. Llegar a ese contexto ya exige la
--    llave secreta del proyecto, asi que ahi se permite.

CREATE OR REPLACE FUNCTION public.proteger_perfil()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
    actor public.rol_app := public.rol_actual();
    quien UUID := auth.uid();
BEGIN
    -- Sin sesion: service_role o SQL directo. Es la via de recuperacion.
    IF quien IS NULL THEN
        RETURN NEW;
    END IF;

    IF (NEW.rol IS DISTINCT FROM OLD.rol)
       OR (NEW.activo IS DISTINCT FROM OLD.activo)
       OR (NEW.artista_id IS DISTINCT FROM OLD.artista_id) THEN

        IF actor IS NULL OR actor NOT IN ('owner','admin') THEN
            RAISE EXCEPTION 'Solo un owner o admin puede cambiar el rol, el estado o el artista vinculado de una cuenta';
        END IF;

        -- Nadie se toca a si mismo estos campos, ni siquiera el owner: evita
        -- quedarse fuera por accidente y evita auto-vincularse a un artista.
        IF NEW.id = quien THEN
            RAISE EXCEPTION 'No puedes cambiar tu propio rol, estado ni vinculo de artista';
        END IF;

        IF OLD.rol = 'owner' AND actor <> 'owner' THEN
            RAISE EXCEPTION 'Solo el owner puede modificar la cuenta del owner';
        END IF;

        IF NEW.rol = 'owner' AND actor <> 'owner' THEN
            RAISE EXCEPTION 'Solo el owner puede nombrar a otro owner';
        END IF;
    END IF;

    -- El correo lo gobierna auth.users, no esta tabla.
    IF NEW.email IS DISTINCT FROM OLD.email AND actor IS DISTINCT FROM 'owner' THEN
        NEW.email := OLD.email;
    END IF;

    RETURN NEW;
END;
$$;

-- Misma valvula de escape para la regla del owner unico.
CREATE OR REPLACE FUNCTION public.exigir_un_owner()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
BEGIN
    IF auth.uid() IS NULL THEN
        RETURN NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.perfiles WHERE rol = 'owner' AND activo) THEN
        RAISE EXCEPTION 'La organizacion se quedaria sin owner activo';
    END IF;
    RETURN NULL;
END;
$$;
