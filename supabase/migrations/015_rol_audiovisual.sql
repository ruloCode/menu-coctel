-- ============================================================
-- Rol de area: Produccion audiovisual
-- ============================================================
-- Mismo patron que la 012: el valor del enum va SOLO en su propia migracion,
-- porque Postgres prohibe usar un valor nuevo hasta que la transaccion que lo
-- crea confirma. Aqui no hace falta una 016 porque, a diferencia de
-- produccion, este rol no estrena funciones ni policies:
--
--   - es_staff() ya lo cubre para lectura.
--   - puede_publicar() NO lo incluye a proposito: audiovisual PRODUCE las
--     piezas, pero publicarlas sigue siendo de contenido/manager. Si mas
--     adelante se decide lo contrario, es una linea en esa funcion.
--   - Las solicitudes de cambio de calendario no necesitan tabla: viajan como
--     avisos de tipo 'aprobacion', que la 008 ya permite insertar a es_staff().
--
-- El canal del area reutiliza mg_comentarios con entidad_tipo='area' y
-- entidad_id='audiovisual'; el CHECK ampliado en la 013 ya lo admite.

ALTER TYPE public.rol_app ADD VALUE IF NOT EXISTS 'audiovisual';

-- Para dar de alta a alguien de audiovisual, dejar su correo previsto ANTES de
-- que se registre (la 014 hace el resto):
--
--   INSERT INTO public.mg_accesos_previstos (email, rol, nombre, nota)
--   VALUES ('persona@ejemplo.com', 'audiovisual', 'Nombre', 'Guion y edicion.')
--   ON CONFLICT (email) DO UPDATE SET rol = EXCLUDED.rol;
--
-- Ojo: esa linea usa el valor nuevo del enum, asi que va en una ejecucion
-- POSTERIOR a esta, no en la misma.
