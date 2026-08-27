-- ============================================================
-- Panel administrativo MG · dominio de operaciones
-- ============================================================
-- Modelo portado del prototipo mg-dashboard_1.html. La idea central es que el
-- calendario NO se guarda: se DERIVA de la fecha de release de cada proyecto
-- aplicando las reglas de mg_config (programacion hacia atras). Lo unico que
-- se persiste del calendario son las excepciones: fechas movidas a mano,
-- hitos marcados como hechos, eventos cancelados y eventos manuales.
--
-- Los ids son TEXT ('a1', 'p3', 'p3:release', 'p3:ses2') porque el motor de
-- eventos los compone (`${proyecto}:${hito}`) y las excepciones apuntan a ese
-- id derivado. Con uuids habria que mantener una tabla de traduccion sin ganar
-- nada: estos ids no son secretos ni enumerables desde fuera del panel.

-- ---------- roster ----------
CREATE TABLE IF NOT EXISTS public.mg_artistas (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    -- 'marca': artista de sello con inversion completa (pre de 3 meses, post de 3).
    -- 'compilado': artista de compilado (pre de 2 meses, post de 1).
    tier TEXT NOT NULL DEFAULT 'compilado' CHECK (tier IN ('marca','compilado')),
    -- La escritura oficial del nombre artistico ya fue confirmada por el artista.
    confirmado BOOLEAN NOT NULL DEFAULT false,
    orden INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.perfiles
    DROP CONSTRAINT IF EXISTS perfiles_artista_id_fkey;
ALTER TABLE public.perfiles
    ADD CONSTRAINT perfiles_artista_id_fkey
    FOREIGN KEY (artista_id) REFERENCES public.mg_artistas(id) ON DELETE SET NULL;

-- ---------- proyectos (lanzamientos) ----------
CREATE TABLE IF NOT EXISTS public.mg_proyectos (
    id TEXT PRIMARY KEY,
    artista_id TEXT NOT NULL REFERENCES public.mg_artistas(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    tipo TEXT NOT NULL DEFAULT 'Por definir',
    tracks INT NOT NULL DEFAULT 1 CHECK (tracks > 0),
    grabados INT NOT NULL DEFAULT 0 CHECK (grabados >= 0),
    release DATE NOT NULL,
    pre_start DATE NOT NULL,
    post_meses INT NOT NULL DEFAULT 1 CHECK (post_meses >= 0),
    estado TEXT NOT NULL DEFAULT 'planeacion' CHECK (estado IN (
        'negociacion','sin_producir','grabacion','mezcla','seleccion_masters',
        'confirmar_estado','listo','planeacion','lanzado','pausado')),
    notas TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT grabados_no_supera_tracks CHECK (grabados <= tracks)
);

CREATE INDEX IF NOT EXISTS idx_mg_proyectos_artista ON public.mg_proyectos (artista_id);
CREATE INDEX IF NOT EXISTS idx_mg_proyectos_release ON public.mg_proyectos (release);

-- ---------- excepciones sobre los eventos derivados ----------
CREATE TABLE IF NOT EXISTS public.mg_eventos_estado (
    evento_id TEXT PRIMARY KEY,              -- 'p3:release', 'p3:ses2', 'party:2026-11', 'post:xxx'
    fecha_override DATE,                     -- movido a mano; NULL = la fecha derivada manda
    hecho BOOLEAN NOT NULL DEFAULT false,
    eliminado BOOLEAN NOT NULL DEFAULT false,
    actualizado_por UUID REFERENCES public.perfiles(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- eventos creados a mano ----------
CREATE TABLE IF NOT EXISTS public.mg_eventos_extra (
    id TEXT PRIMARY KEY,
    tipo TEXT NOT NULL CHECK (tipo IN (
        'sesion','content','pre','release','fiesta','post','hito','seguimiento','publicacion')),
    fecha DATE NOT NULL,
    etiqueta TEXT NOT NULL,
    proyecto_id TEXT REFERENCES public.mg_proyectos(id) ON DELETE SET NULL,
    creado_por UUID REFERENCES public.perfiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mg_eventos_extra_fecha ON public.mg_eventos_extra (fecha);

-- ---------- configuracion (una sola fila) ----------
-- reglas: dias antes del release de cada hito. ajustes: capacidad de estudio,
-- dias de sesion, horizonte. slots: huecos recurrentes de publicacion por red.
CREATE TABLE IF NOT EXISTS public.mg_config (
    id TEXT PRIMARY KEY DEFAULT 'global' CHECK (id = 'global'),
    reglas JSONB NOT NULL DEFAULT '{}'::jsonb,
    ajustes JSONB NOT NULL DEFAULT '{}'::jsonb,
    slots JSONB,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.mg_config (id, reglas, ajustes) VALUES (
    'global',
    '{"recordingDone":56,"masterFinal":35,"contentDay":45,"editingDone":31,"distributor":28,"pitch":21,"presave":21}'::jsonb,
    '{"weeklyCap":8,"maxCap":12,"sessionDays":[2,4,6],"satBlocks":2,"weekdayBlocks":1,"partyDay":"lastSat","horizonEnd":"2027-12-31"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- ---------- redes: publicaciones ----------
CREATE TABLE IF NOT EXISTS public.mg_publicaciones (
    id TEXT PRIMARY KEY,
    -- 'mg' (cuenta del sello) o el id de un artista del roster.
    cuenta TEXT NOT NULL DEFAULT 'mg',
    proyecto_id TEXT REFERENCES public.mg_proyectos(id) ON DELETE SET NULL,
    plataforma TEXT NOT NULL DEFAULT 'ig' CHECK (plataforma IN ('ig','tt','yt')),
    formato TEXT NOT NULL DEFAULT 'Reel',
    pilar TEXT NOT NULL DEFAULT 'musica' CHECK (pilar IN ('musica','bts','personal','fans','promo')),
    fecha DATE NOT NULL,
    hora TEXT NOT NULL DEFAULT '13:00' CHECK (hora ~ '^\d{2}:\d{2}$'),
    titulo TEXT NOT NULL DEFAULT '',
    hook TEXT NOT NULL DEFAULT '',
    copy TEXT NOT NULL DEFAULT '',
    hashtags TEXT NOT NULL DEFAULT '',
    cta TEXT NOT NULL DEFAULT '',
    link TEXT NOT NULL DEFAULT '',
    asset_url TEXT NOT NULL DEFAULT '',
    asset_name TEXT NOT NULL DEFAULT '',
    thumb_url TEXT NOT NULL DEFAULT '',
    version INT NOT NULL DEFAULT 1 CHECK (version > 0),
    estado TEXT NOT NULL DEFAULT 'idea' CHECK (estado IN (
        'idea','guion','grabado','editado','revision','ajustes','aprobado','programado','publicado','error')),
    responsable TEXT NOT NULL DEFAULT '',
    notas TEXT NOT NULL DEFAULT '',
    -- Copy/hashtags personalizados por red cuando se hace cross-post (reversible).
    variantes JSONB NOT NULL DEFAULT '{}'::jsonb,
    -- Metricas a 48 h y a 7 dias.
    m48 JSONB NOT NULL DEFAULT '{}'::jsonb,
    m7 JSONB NOT NULL DEFAULT '{}'::jsonb,
    -- Historial de aprobaciones/rechazos.
    aprobaciones JSONB NOT NULL DEFAULT '[]'::jsonb,
    creado_por UUID REFERENCES public.perfiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mg_publicaciones_fecha ON public.mg_publicaciones (fecha);
CREATE INDEX IF NOT EXISTS idx_mg_publicaciones_cuenta ON public.mg_publicaciones (cuenta);
CREATE INDEX IF NOT EXISTS idx_mg_publicaciones_estado ON public.mg_publicaciones (estado);

-- ---------- redes: biblioteca de textos y sets de hashtags ----------
CREATE TABLE IF NOT EXISTS public.mg_textos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo TEXT NOT NULL CHECK (tipo IN ('texto','tags')),
    etiqueta TEXT NOT NULL DEFAULT '',
    contenido TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- radar (ecosistema y proveedores) ----------
CREATE TABLE IF NOT EXISTS public.mg_radar (
    id TEXT PRIMARY KEY,
    -- 'externo': ficha suelta. 'roster': la ficha de un artista propio.
    origen TEXT NOT NULL DEFAULT 'externo' CHECK (origen IN ('externo','roster')),
    artista_id TEXT REFERENCES public.mg_artistas(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    cat TEXT NOT NULL DEFAULT 'artista',
    rel TEXT NOT NULL DEFAULT 'no hemos hablado' CHECK (rel IN (
        'no hemos hablado','contactado','conversando','negociando','aliado','descartado')),
    urls JSONB NOT NULL DEFAULT '{}'::jsonb,     -- {ig, tt, yt, sp}
    campos JSONB NOT NULL DEFAULT '{}'::jsonb,   -- campos propios de la categoria
    mediciones JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{d:'YYYY-MM-DD', m:{...}}]
    proxima DATE,                                 -- proxima medicion agendada
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- Una ficha de roster por artista.
    CONSTRAINT radar_roster_con_artista CHECK (origen = 'externo' OR artista_id IS NOT NULL)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_mg_radar_roster ON public.mg_radar (artista_id) WHERE origen = 'roster';
CREATE INDEX IF NOT EXISTS idx_mg_radar_cat ON public.mg_radar (cat);
CREATE INDEX IF NOT EXISTS idx_mg_radar_proxima ON public.mg_radar (proxima) WHERE proxima IS NOT NULL;

-- ---------- bitacora ----------
CREATE TABLE IF NOT EXISTS public.mg_bitacora (
    id BIGSERIAL PRIMARY KEY,
    fecha DATE NOT NULL DEFAULT (now() AT TIME ZONE 'America/Bogota')::date,
    mensaje TEXT NOT NULL,
    actor UUID REFERENCES public.perfiles(id) ON DELETE SET NULL,
    actor_nombre TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mg_bitacora_created ON public.mg_bitacora (created_at DESC);

-- ---------- updated_at en todo lo mutable ----------
DO $$
DECLARE t TEXT;
BEGIN
    FOREACH t IN ARRAY ARRAY['mg_artistas','mg_proyectos','mg_eventos_estado','mg_config','mg_publicaciones','mg_radar']
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS set_%1$s_updated_at ON public.%1$s', t);
        EXECUTE format(
            'CREATE TRIGGER set_%1$s_updated_at BEFORE UPDATE ON public.%1$s
             FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at()', t);
    END LOOP;
END $$;

-- ---------- RLS ----------
-- Lectura: cualquier miembro activo del panel.
-- Escritura: owner/admin/manager en todo lo operativo; el rol 'contenido'
-- ademas escribe en publicaciones y textos; 'artista' solo aprueba lo suyo.
DO $$
DECLARE t TEXT;
BEGIN
    FOREACH t IN ARRAY ARRAY['mg_artistas','mg_proyectos','mg_eventos_estado','mg_eventos_extra',
                             'mg_config','mg_publicaciones','mg_textos','mg_radar','mg_bitacora']
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
        EXECUTE format('DROP POLICY IF EXISTS "lectura staff" ON public.%I', t);
        EXECUTE format(
            'CREATE POLICY "lectura staff" ON public.%I
             FOR SELECT TO authenticated USING (public.es_staff())', t);
    END LOOP;

    -- Escritura operativa
    FOREACH t IN ARRAY ARRAY['mg_artistas','mg_proyectos','mg_eventos_estado','mg_eventos_extra',
                             'mg_config','mg_radar']
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "escritura operativa" ON public.%I', t);
        EXECUTE format(
            'CREATE POLICY "escritura operativa" ON public.%I
             FOR ALL TO authenticated
             USING (public.puede_operar()) WITH CHECK (public.puede_operar())', t);
    END LOOP;
END $$;

-- Redes: el equipo de contenido tambien escribe.
DROP POLICY IF EXISTS "escritura redes" ON public.mg_publicaciones;
CREATE POLICY "escritura redes" ON public.mg_publicaciones
    FOR ALL TO authenticated
    USING (public.puede_publicar()) WITH CHECK (public.puede_publicar());

-- Un artista puede actualizar SOLO las publicaciones de su propia cuenta
-- (es como aprueba o pide cambios en lo que sale a su nombre).
DROP POLICY IF EXISTS "artista aprueba lo suyo" ON public.mg_publicaciones;
CREATE POLICY "artista aprueba lo suyo" ON public.mg_publicaciones
    FOR UPDATE TO authenticated
    USING (public.rol_actual() = 'artista' AND cuenta = public.mi_artista_id())
    WITH CHECK (public.rol_actual() = 'artista' AND cuenta = public.mi_artista_id());

DROP POLICY IF EXISTS "escritura textos" ON public.mg_textos;
CREATE POLICY "escritura textos" ON public.mg_textos
    FOR ALL TO authenticated
    USING (public.puede_publicar()) WITH CHECK (public.puede_publicar());

-- Bitacora: append-only. Cualquiera del staff deja constancia; nadie edita ni
-- borra lo ya escrito (por eso no hay policy de UPDATE/DELETE).
DROP POLICY IF EXISTS "bitacora append-only" ON public.mg_bitacora;
CREATE POLICY "bitacora append-only" ON public.mg_bitacora
    FOR INSERT TO authenticated WITH CHECK (public.es_staff());
