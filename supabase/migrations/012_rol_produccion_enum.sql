-- ============================================================
-- Rol de area: Produccion musical (1/2) — solo el valor del enum
-- ============================================================
-- Va SOLO en este archivo a proposito. Postgres permite ALTER TYPE ... ADD
-- VALUE dentro de una transaccion, pero prohibe USAR el valor nuevo hasta que
-- esa transaccion confirma. Todo lo que menciona 'produccion' (funciones,
-- policies, seeds) vive en la 013, que corre despues.
--
-- Por que un rol y no una tabla de areas: el area de Produccion musical no
-- necesita jerarquia ni pertenencia multiple. Un compositor pertenece a
-- Produccion y punto. El rol ES el area, y "mis companeros de area" es
-- simplemente el resto de perfiles activos con este rol. Si algun dia hace
-- falta que alguien este en dos areas, ahi si tocara una tabla aparte.

DO $$ BEGIN
    ALTER TYPE public.rol_app ADD VALUE IF NOT EXISTS 'produccion';
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
