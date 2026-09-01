-- ============================================================
-- Accesos individuales: el rol da la base, la persona ajusta el borde
-- ============================================================
-- Hasta aqui, lo que alguien veia y podia tocar se deducia SOLO de su rol. Eso
-- resuelve el 90% de los casos y hay que seguir prefiriendolo: un rol se
-- explica en una frase y se audita mirando una tabla.
--
-- El 10% restante es real y aparece en cuanto el equipo crece. Ejemplo que
-- motiva esta migracion: quien compone y arregla (rol 'produccion') es ademas
-- quien habla con los inscritos de la convocatoria MG1 y les anota cuando
-- pueden venir. Darle 'manager' para eso le abriria de paso el calendario
-- entero, los proyectos y el radar. Crear un rol nuevo por cada combinacion
-- termina en veinte roles que nadie recuerda.
--
-- La salida es una excepcion nombrada sobre el rol, no un rol nuevo:
--
--   secciones_extra -> secciones del panel que ademas ve esta persona
--   permisos_extra  -> capacidades concretas que ademas tiene
--
-- Dos columnas en 'perfiles' y no una tabla aparte porque una concesion no
-- tiene ciclo de vida propio: nace y muere con el perfil, no se consulta por
-- separado y no lleva historial (para eso esta mg_bitacora, donde cada cambio
-- queda escrito con quien lo hizo).
--
-- Tres invariantes que sostienen esto, en el mismo orden en que se imponen:
--
--   1. secciones_extra AÑADE secciones, nunca permisos. Ver una seccion no es
--      poder escribir en ella: cada boton sigue preguntando por su permiso, y
--      cada policy por su funcion. El espejo en cliente (permisos.ts) descarta
--      ademas cualquier seccion cuyo permiso el rol no tenga, para que una
--      concesion mal puesta no pinte una pantalla que luego falla entera.
--
--   2. Un permiso extra concede lo MINIMO que nombra. 'mg1:contactar' abre las
--      notas y la disponibilidad; el estado de la curaduria sigue siendo de
--      quien opera. RLS decide por fila y no por columna, asi que ese recorte
--      fino lo hace un trigger, igual que la 013 hizo con las sesiones.
--
--   3. Nadie se concede nada a si mismo. Las dos columnas entran en la lista
--      de campos que proteger_perfil reserva a un admin sobre OTRA cuenta.

ALTER TABLE public.perfiles
    ADD COLUMN IF NOT EXISTS secciones_extra TEXT[] NOT NULL DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS permisos_extra  TEXT[] NOT NULL DEFAULT '{}';

COMMENT ON COLUMN public.perfiles.secciones_extra IS
    'Slugs de SECCIONES (lib/mg/permisos.ts) que esta persona ve ademas de los de su rol. Solo suma navegacion, nunca permisos.';
COMMENT ON COLUMN public.perfiles.permisos_extra IS
    'Claves de PERMISOS_EXTRA (lib/mg/permisos.ts) concedidas a esta persona en concreto. Catalogo cerrado: la Server Action las filtra y cada una tiene su funcion aqui.';

-- ---------- consulta base ----------
-- SECURITY DEFINER y por auth.uid(), como el resto de guardias de la 003: una
-- policy que leyera 'perfiles' directamente entraria en recursion.
CREATE OR REPLACE FUNCTION public.tiene_extra(clave TEXT)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.perfiles
         WHERE id = auth.uid() AND activo AND clave = ANY(permisos_extra)
    )
$$;

-- ---------- mg1:contactar ----------
-- Quien lleva la conversacion con los inscritos: los llama, les pregunta que
-- dias pueden y lo anota. Es trabajo de enlace, no de jurado.
CREATE OR REPLACE FUNCTION public.puede_contactar_mg1()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp
AS $$ SELECT public.puede_operar() OR public.tiene_extra('mg1:contactar') $$;

DROP POLICY IF EXISTS "mg1: el equipo cura las inscripciones" ON public.mg1_inscripciones;
CREATE POLICY "mg1: el equipo cura las inscripciones" ON public.mg1_inscripciones
    FOR UPDATE TO authenticated
    USING (public.puede_contactar_mg1()) WITH CHECK (public.puede_contactar_mg1());

-- El recorte por columna que la policy no sabe hacer. Mismo patron que
-- proteger_confirmacion_sesion (013): la policy abre la fila, el trigger
-- defiende la invariante y ademas explica en castellano por que dijo que no.
CREATE OR REPLACE FUNCTION public.proteger_curaduria_mg1()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
BEGIN
    -- Sin sesion es la service_role: el route handler publico y las tareas de
    -- mantenimiento. Y quien opera ya podia todo esto antes de esta migracion.
    IF auth.uid() IS NULL OR public.puede_operar() THEN
        RETURN NEW;
    END IF;

    IF NEW.estado IS DISTINCT FROM OLD.estado THEN
        RAISE EXCEPTION 'Cambiar el estado de una inscripcion es curaduria: requiere rol owner, admin o manager';
    END IF;

    -- Lo que escribio el concursante en el formulario es suyo. Se lee y se
    -- copia, no se reescribe desde el panel.
    NEW.edicion          := OLD.edicion;
    NEW.nombre_artistico := OLD.nombre_artistico;
    NEW.nombre_completo  := OLD.nombre_completo;
    NEW.email            := OLD.email;
    NEW.celular          := OLD.celular;
    NEW.ciudad           := OLD.ciudad;
    NEW.link_musica      := OLD.link_musica;
    NEW.por_que          := OLD.por_que;
    NEW.acepta_terminos  := OLD.acepta_terminos;
    NEW.origen           := OLD.origen;
    NEW.user_agent       := OLD.user_agent;
    NEW.created_at       := OLD.created_at;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS proteger_curaduria_mg1_trigger ON public.mg1_inscripciones;
CREATE TRIGGER proteger_curaduria_mg1_trigger
    BEFORE UPDATE ON public.mg1_inscripciones
    FOR EACH ROW EXECUTE FUNCTION public.proteger_curaduria_mg1();

-- ---------- invariante 3: nadie se concede extras a si mismo ----------
-- Reemplaza la version de la 006 sumando las dos columnas nuevas al conjunto
-- de campos reservados. El resto del cuerpo es identico, incluida la valvula
-- de recuperacion cuando auth.uid() es NULL.
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
       OR (NEW.artista_id IS DISTINCT FROM OLD.artista_id)
       OR (NEW.secciones_extra IS DISTINCT FROM OLD.secciones_extra)
       OR (NEW.permisos_extra IS DISTINCT FROM OLD.permisos_extra) THEN

        IF actor IS NULL OR actor NOT IN ('owner','admin') THEN
            RAISE EXCEPTION 'Solo un owner o admin puede cambiar el rol, el estado, el artista vinculado o los accesos individuales de una cuenta';
        END IF;

        -- Nadie se toca a si mismo estos campos, ni siquiera el owner: evita
        -- quedarse fuera por accidente, evita auto-vincularse a un artista y
        -- evita auto-concederse un permiso extra.
        IF NEW.id = quien THEN
            RAISE EXCEPTION 'No puedes cambiar tu propio rol, estado, vinculo de artista ni accesos individuales';
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
