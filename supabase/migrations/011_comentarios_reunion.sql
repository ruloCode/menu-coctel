-- El check de mg_comentarios se escribio antes de que existieran las reuniones.
-- Sin esto, comentar un acta falla con violacion de restriccion.
ALTER TABLE public.mg_comentarios DROP CONSTRAINT IF EXISTS mg_comentarios_entidad_tipo_check;
ALTER TABLE public.mg_comentarios ADD CONSTRAINT mg_comentarios_entidad_tipo_check
    CHECK (entidad_tipo IN ('evento','proyecto','publicacion','radar','reunion'));
