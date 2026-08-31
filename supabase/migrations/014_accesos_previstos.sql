-- ============================================================
-- Accesos previstos: dejar el rol listo ANTES de que la persona se registre
-- ============================================================
-- Hoy el alta es: la persona se registra -> queda 'viewer' inactivo -> alguien
-- con rol admin entra a /admin/equipo y la habilita. Funciona, pero deja a la
-- persona golpeada contra la pantalla de "tu cuenta todavia no esta habilitada"
-- justo en su primer minuto en el sistema, que es el peor momento posible para
-- una friccion.
--
-- Con esta tabla, un admin deja escrito de antemano "el correo X entra como
-- rol Y", y el trigger de alta lo aplica solo. La persona se registra y ya
-- esta dentro, en su sitio.
--
-- Seguridad: la tabla solo la escribe un admin (RLS abajo). Registrarse con un
-- correo que nadie previo sigue dando 'viewer' inactivo, igual que antes. Esto
-- no abre una via de escalada: abre una via de *preparacion*.

CREATE TABLE IF NOT EXISTS public.mg_accesos_previstos (
    email      TEXT PRIMARY KEY,
    rol        public.rol_app NOT NULL,
    nombre     TEXT NOT NULL DEFAULT '',
    nota       TEXT NOT NULL DEFAULT '',
    creado_por UUID REFERENCES public.perfiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    usado_at   TIMESTAMPTZ
);

-- El correo se guarda y se compara siempre en minusculas: auth.users no
-- normaliza mayusculas y "Lando@" no puede fallar contra "lando@".
CREATE OR REPLACE FUNCTION public.normalizar_email_previsto()
RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.email := lower(trim(NEW.email));
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS normalizar_email_previsto_trigger ON public.mg_accesos_previstos;
CREATE TRIGGER normalizar_email_previsto_trigger
    BEFORE INSERT OR UPDATE ON public.mg_accesos_previstos
    FOR EACH ROW EXECUTE FUNCTION public.normalizar_email_previsto();

ALTER TABLE public.mg_accesos_previstos ENABLE ROW LEVEL SECURITY;

-- Solo admin/owner. Un viewer no tiene por que saber a quien se va a contratar,
-- y desde luego nadie que no sea admin puede prescribir roles.
DROP POLICY IF EXISTS "solo admin" ON public.mg_accesos_previstos;
CREATE POLICY "solo admin" ON public.mg_accesos_previstos
    FOR ALL TO authenticated
    USING (public.es_admin()) WITH CHECK (public.es_admin());

-- ---------- alta automatica, ahora con acceso previsto ----------
-- Mismo contrato que antes salvo por el bloque del medio:
--   1. primer usuario del sistema  -> owner activo
--   2. correo previsto por un admin -> el rol previsto, activo
--   3. cualquier otro               -> viewer inactivo (sin cambios)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
    es_primero BOOLEAN;
    previsto   public.mg_accesos_previstos%ROWTYPE;
    rol_final  public.rol_app;
    activo_final BOOLEAN;
    nombre_final TEXT;
BEGIN
    SELECT NOT EXISTS (SELECT 1 FROM public.perfiles) INTO es_primero;

    SELECT * INTO previsto
      FROM public.mg_accesos_previstos
     WHERE email = lower(NEW.email);

    nombre_final := COALESCE(
        NULLIF(NEW.raw_user_meta_data->>'nombre', ''),
        NULLIF(NEW.raw_user_meta_data->>'full_name', ''),
        NULLIF(previsto.nombre, ''),
        split_part(NEW.email, '@', 1)
    );

    IF es_primero THEN
        rol_final := 'owner'; activo_final := true;
    ELSIF previsto.email IS NOT NULL THEN
        rol_final := previsto.rol; activo_final := true;
    ELSE
        rol_final := 'viewer'; activo_final := false;
    END IF;

    INSERT INTO public.perfiles (id, email, nombre, rol, activo)
    VALUES (NEW.id, NEW.email, nombre_final, rol_final, activo_final)
    ON CONFLICT (id) DO NOTHING;

    -- Se marca usado en vez de borrarse: queda el rastro de quien previo que.
    IF previsto.email IS NOT NULL THEN
        UPDATE public.mg_accesos_previstos
           SET usado_at = now()
         WHERE email = previsto.email;
    END IF;

    RETURN NEW;
END;
$$;

-- ---------- Lando: compositor y arreglista, area de Produccion musical ----------
INSERT INTO public.mg_accesos_previstos (email, rol, nombre, nota)
VALUES ('landomusicismylife@gmail.com', 'produccion', 'Lando',
        'Compositor y arreglista. Area de Produccion musical.')
ON CONFLICT (email) DO UPDATE
   SET rol = EXCLUDED.rol, nombre = EXCLUDED.nombre, nota = EXCLUDED.nota;
