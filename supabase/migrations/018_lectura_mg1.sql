-- ============================================================
-- La lectura de MG1 sigue a la visibilidad de la seccion
-- ============================================================
-- La 003 abrio mg1_inscripciones a `es_staff()`, es decir a cualquier perfil
-- activo, porque entonces el panel no tenia roles recortados: quien entraba,
-- coordinaba. Desde la 013 y la 015 eso ya no es cierto, y quedaba una grieta
-- honesta pero fea: produccion y audiovisual no VEN la seccion MG1, pero
-- podian LEER la tabla llamando a la API con su propia sesion.
--
-- No es un detalle de comodidad. Ahi dentro hay nombre completo, correo,
-- celular y ciudad de 44 personas que se inscribieron a un concurso: son datos
-- personales de terceros que nunca aceptaron que los viera todo el equipo.
-- Quien no tiene que hablar con ellos no tiene por que tener su telefono.
--
-- La regla nueva es la que ya cuenta el panel: **quien ve la seccion, lee la
-- tabla**. Y quien la ve por una concesion individual (017), tambien.
--
-- OJO AL ESPEJO: esta funcion duplica en SQL lo que SECCIONES_POR_ROL decide
-- en lib/mg/permisos.ts. Se duplica a proposito —la autoridad es Postgres, no
-- el cliente— pero eso obliga a tocar las dos: si algun dia un rol recortado
-- recibe la seccion 'mg1', o se recorta el panel de 'viewer', hay que añadir
-- una migracion aqui o la pantalla saldra vacia sin explicar por que.

CREATE OR REPLACE FUNCTION public.tiene_seccion_extra(slug TEXT)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.perfiles
         WHERE id = auth.uid() AND activo AND slug = ANY(secciones_extra)
    )
$$;

-- Los roles cuyo panel NO esta recortado (owner, admin, manager, viewer) mas
-- quien tenga la seccion o el permiso concedidos a titulo personal. Se incluye
-- 'mg1:contactar' ademas de la seccion porque escribir a ciegas no es escribir:
-- quien anota la disponibilidad de alguien necesita leer su ficha.
CREATE OR REPLACE FUNCTION public.puede_ver_mg1()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp
AS $$
    SELECT public.tiene_rol('owner','admin','manager','viewer')
        OR public.tiene_seccion_extra('mg1')
        OR public.tiene_extra('mg1:contactar')
$$;

DROP POLICY IF EXISTS "mg1: el staff lee las inscripciones" ON public.mg1_inscripciones;
CREATE POLICY "mg1: solo quien cura o acompaña lee las inscripciones" ON public.mg1_inscripciones
    FOR SELECT TO authenticated USING (public.puede_ver_mg1());
