-- One-off backfill: restore the original hand-written taglines for the
-- three real artists (El As, Leonel, El Chalinillo). These taglines were
-- the previous `description` values, overwritten by the import script in
-- bd issue privada-dgf. The bio from the import remains in description;
-- the marketing line moves to tagline.

UPDATE "Artist"
   SET "tagline" = 'El #1 de Sinaloa. Disponible con Banda y Norteño'
 WHERE id = 'cmi82wy400000s1rrkp7omiwk';

UPDATE "Artist"
   SET "tagline" = 'Pura Época Pesada 🔥. Disponible con Norteño y Banda'
 WHERE id = 'cmi82wy9h0001s1rr9gw27fs2';

UPDATE "Artist"
   SET "tagline" = 'Un ícono de los 90s. Disponible con Norteño y guitarras.'
 WHERE id = 'cmi82wyex0002s1rrufjilwtr';
