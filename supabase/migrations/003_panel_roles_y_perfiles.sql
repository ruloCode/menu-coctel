-- ============================================================
-- Panel administrativo MG · control de acceso basado en roles
-- ============================================================
-- Toda la autorizacion del panel cuelga de public.perfiles.rol.
-- Las policies NUNCA consultan perfiles directamente: usan las funciones
-- SECURITY DEFINER de mas abajo. Si una policy sobre perfiles hiciera un
-- SELECT sobre perfiles, Postgres entraria en recursion infinita de RLS.

-- ---------- roles ----------
DO $$ BEGIN
    CREATE TYPE public.rol_app AS ENUM (
        'owner',      -- dueno: todo, incluida la gestion de usuarios y el traspaso de owner
        'admin',      -- todo salvo degradar/eliminar al owner
        'manager',    -- opera el calendario: artistas, proyectos, estudio, fiestas, radar
        'contenido',  -- modulo Redes: crea y edita publicaciones (no aprueba ni borra)
        'artista',    -- lectura del calendario + aprueba las publicaciones de SU cuenta
        'viewer'      -- solo lectura
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------- perfiles ----------
-- Una fila por usuario de auth.users. Se crea sola con el trigger de mas abajo.
CREATE TABLE IF NOT EXISTS public.perfiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    nombre TEXT NOT NULL DEFAULT '',
    rol public.rol_app NOT NULL DEFAULT 'viewer',
    activo BOOLEAN NOT NULL DEFAULT true,
    avatar_url TEXT,
    -- Para el rol 'artista': que ficha del roster le pertenece (FK en la 004,
    -- cuando mg_artistas ya existe).
    artista_id TEXT,
    ultimo_acceso TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_perfiles_email ON public.perfiles (lower(email));
CREATE INDEX IF NOT EXISTS idx_perfiles_rol ON public.perfiles (rol) WHERE activo;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_perfiles_updated_at ON public.perfiles;
CREATE TRIGGER set_perfiles_updated_at
    BEFORE UPDATE ON public.perfiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ---------- helpers de autorizacion ----------
-- SECURITY DEFINER + search_path fijo: leen perfiles saltandose RLS, que es
-- justo lo que evita la recursion y lo que permite usarlas dentro de policies.

CREATE OR REPLACE FUNCTION public.rol_actual()
RETURNS public.rol_app
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp
AS $$ SELECT rol FROM public.perfiles WHERE id = auth.uid() AND activo $$;

CREATE OR REPLACE FUNCTION public.tiene_rol(VARIADIC roles public.rol_app[])
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp
AS $$ SELECT public.rol_actual() = ANY(roles) $$;

-- Cualquier usuario activo del panel (incluye viewer y artista).
CREATE OR REPLACE FUNCTION public.es_staff()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp
AS $$ SELECT public.rol_actual() IS NOT NULL $$;

-- Puede modificar el plan operativo (proyectos, calendario, radar, fiestas).
CREATE OR REPLACE FUNCTION public.puede_operar()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp
AS $$ SELECT public.tiene_rol('owner','admin','manager') $$;

-- Puede tocar el modulo de Redes.
CREATE OR REPLACE FUNCTION public.puede_publicar()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp
AS $$ SELECT public.tiene_rol('owner','admin','manager','contenido') $$;

CREATE OR REPLACE FUNCTION public.es_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp
AS $$ SELECT public.tiene_rol('owner','admin') $$;

-- La ficha del roster asociada al usuario actual (para el rol 'artista').
CREATE OR REPLACE FUNCTION public.mi_artista_id()
RETURNS TEXT
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp
AS $$ SELECT artista_id FROM public.perfiles WHERE id = auth.uid() AND activo $$;

-- ---------- alta automatica de perfil ----------
-- El PRIMER usuario que se registre queda como owner; el resto entra como
-- 'viewer' inactivo y un admin lo habilita desde /admin/equipo. Asi nadie
-- consigue acceso solo por crearse una cuenta.
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------- barandas sobre perfiles ----------
-- RLS deja a cada quien actualizar su propia fila (nombre/avatar), pero rol y
-- activo son escalada de privilegios: solo owner/admin los cambian, y nadie
-- puede degradarse a si mismo ni tocar al owner sin ser owner.
CREATE OR REPLACE FUNCTION public.proteger_perfil()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
    actor public.rol_app := public.rol_actual();
BEGIN
    IF (NEW.rol IS DISTINCT FROM OLD.rol) OR (NEW.activo IS DISTINCT FROM OLD.activo) THEN
        IF actor IS NULL OR actor NOT IN ('owner','admin') THEN
            RAISE EXCEPTION 'Solo un owner o admin puede cambiar el rol o el estado de una cuenta';
        END IF;
        IF NEW.id = auth.uid() THEN
            RAISE EXCEPTION 'No puedes cambiar tu propio rol ni desactivarte';
        END IF;
        IF OLD.rol = 'owner' AND actor <> 'owner' THEN
            RAISE EXCEPTION 'Solo el owner puede modificar la cuenta del owner';
        END IF;
        IF NEW.rol = 'owner' AND actor <> 'owner' THEN
            RAISE EXCEPTION 'Solo el owner puede nombrar a otro owner';
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS proteger_perfil_trigger ON public.perfiles;
CREATE TRIGGER proteger_perfil_trigger
    BEFORE UPDATE ON public.perfiles
    FOR EACH ROW EXECUTE FUNCTION public.proteger_perfil();

-- Siempre debe quedar al menos un owner activo.
CREATE OR REPLACE FUNCTION public.exigir_un_owner()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.perfiles WHERE rol = 'owner' AND activo) THEN
        RAISE EXCEPTION 'La organizacion se quedaria sin owner activo';
    END IF;
    RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS exigir_un_owner_trigger ON public.perfiles;
CREATE CONSTRAINT TRIGGER exigir_un_owner_trigger
    AFTER UPDATE OR DELETE ON public.perfiles
    DEFERRABLE INITIALLY DEFERRED
    FOR EACH ROW EXECUTE FUNCTION public.exigir_un_owner();

-- ---------- RLS ----------
ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "perfiles: el staff ve al equipo" ON public.perfiles;
CREATE POLICY "perfiles: el staff ve al equipo" ON public.perfiles
    FOR SELECT TO authenticated
    USING (id = auth.uid() OR public.es_staff());

DROP POLICY IF EXISTS "perfiles: cada quien edita el suyo, admin edita todos" ON public.perfiles;
CREATE POLICY "perfiles: cada quien edita el suyo, admin edita todos" ON public.perfiles
    FOR UPDATE TO authenticated
    USING (id = auth.uid() OR public.es_admin())
    WITH CHECK (id = auth.uid() OR public.es_admin());

DROP POLICY IF EXISTS "perfiles: solo admin da de baja" ON public.perfiles;
CREATE POLICY "perfiles: solo admin da de baja" ON public.perfiles
    FOR DELETE TO authenticated
    USING (public.es_admin() AND id <> auth.uid());

-- No hay policy de INSERT a proposito: los perfiles solo nacen del trigger
-- on_auth_user_created (SECURITY DEFINER), nunca desde el cliente.

-- ---------- inscripciones MG1 visibles en el panel ----------
-- La 002 dejo la tabla como buzon de solo escritura. El panel necesita leerla
-- y curarla; se lo damos al staff autenticado sin abrir nada al publico.
DROP POLICY IF EXISTS "mg1: el staff lee las inscripciones" ON public.mg1_inscripciones;
CREATE POLICY "mg1: el staff lee las inscripciones" ON public.mg1_inscripciones
    FOR SELECT TO authenticated USING (public.es_staff());

DROP POLICY IF EXISTS "mg1: el equipo cura las inscripciones" ON public.mg1_inscripciones;
CREATE POLICY "mg1: el equipo cura las inscripciones" ON public.mg1_inscripciones
    FOR UPDATE TO authenticated USING (public.puede_operar()) WITH CHECK (public.puede_operar());
