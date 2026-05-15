# Artist tagline / bio split

**Status:** approved, ready for plan
**Date:** 2026-05-15
**Tracking:** bd `privada-dgf` follow-up

## Context

La página de reserva del artista renderiza el mismo `artist.description` dos veces:

- `app/components/reservation/ArtistHero.tsx:122` — como subtítulo italico bajo el nombre.
- `app/components/reservation/ContentSections.tsx:57` (`BioSection`, eyebrow "Quiénes son" / título "La historia") — seguido de una frase hardcodeada (`"Tres voces que se conocen desde la prepa, requintos heredados…"`) que era placeholder de un trío de boleros y ya no aplica a los corridistas reales del catálogo.

La duplicación es estructural: el modelo `Artist` solo tiene un campo de texto (`description`). Cuando el importer de profiles del Researcher reemplazó las descripciones cortas estilo tagline ("El #1 de Sinaloa. Disponible con Banda y Norteño") por bios enciclopédicas de ~240 caracteres, el hero quedó con el texto incorrecto y la duplicación con "La historia" se hizo evidente.

## Objetivo

Separar las dos piezas de contenido conceptualmente y en el schema:

- **Hero → `tagline`**: una línea curada por el admin (apodo, moniker, posicionamiento). Donde se aplica `/humanizer` al escribir copy.
- **La historia → `description`**: la bio narrativa que ya importa el script desde los markdowns del Researcher.

## No-goals

- No tocar `ArtistDetailView.tsx` (la página legacy de detalle con tarjeta blanca). No es la vista que muestra el screenshot del problema.
- No cambiar la convención de los markdowns de profiles. El importer sigue mapeando "Biografía" → `description`.
- No regenerar taglines automáticamente desde los profiles. Es decisión manual del admin.

## Diseño

### Schema (Prisma)

Añadir un campo nullable a `Artist`:

```prisma
model Artist {
  // …existing fields…
  tagline String?
  // …
}
```

Migración aditiva: `ALTER TABLE "Artist" ADD COLUMN "tagline" TEXT;`. Sin downtime, sin pérdida de datos, sin necesidad de backfill para que el código compile (los componentes manejan `null`).

### Render del hero

`ArtistHero.tsx` y `MobileReservation.tsx:203` reemplazan `{artist.description}` por:

```tsx
{artist.tagline && (
    <div /* …línea decorativa + p italic… */>
        <p>{artist.tagline}</p>
    </div>
)}
```

Si `tagline` es `null`, el bloque entero (línea dorada decorativa + `<p>`) se oculta. **No hay fallback al `description`** — la duplicación con "La historia" no debe poder reaparecer por descuido. Es la function que fuerza al admin a curar el tagline.

### Render de "La historia"

`BioSection` en `ContentSections.tsx`:

- Renderiza solo `{artist.description}` — quitar la concatenación con la frase hardcodeada `" Tres voces que se conocen desde la prepa, requintos heredados, y un repertorio que va de Javier Solís a Vicente — pero siempre con la pausa de la sobremesa. Han tocado en bodas, sesentas, despedidas y noches que nadie recuerda cómo terminaron."`.

### Types

`app/components/reservation/types.ts` — `ReservationArtist` añade `tagline: string | null`. Todo lugar que construye el objeto (server fetchers, props) lo pasa.

### Admin form

`app/admin/artists/ArtistForm.tsx` — nuevo input "Tagline (Hero)" arriba del textarea "Description". Hint: *"Una línea — apodo, frase pegadora. Ej: 'Patrón de Patrones', 'Pura Época Pesada'. Si lo dejas vacío, el hero solo muestra el nombre del artista."*. Optional, no required.

`app/admin/actions.ts` — extender `CreateArtistSchema` y `UpdateArtistSchema` con `tagline: z.string().optional().nullable()`. Persistir como `tagline: tagline?.trim() || null` (string vacío del form → `null` en DB, mismo patrón que el actual `imageUrl: imageUrl || null`). Eso significa que cuando el admin borra el contenido del input y guarda, el hero vuelve a esconder el subtítulo.

### Importer

`scripts/import-artist-profiles.mjs`:

- En `create`: setear `tagline: null` explícitamente.
- En `update`: nunca incluir `tagline` en `data` — preserva lo que el admin haya escrito.

### Backfill manual (uno solo)

SQL aplicado una vez contra la base, antes de mergear el cambio:

```sql
UPDATE "Artist"
   SET "tagline" = 'El #1 de Sinaloa. Disponible con Banda y Norteño'
 WHERE id = 'cmi82wy400000s1rrkp7omiwk';  -- El As de la Sierra

UPDATE "Artist"
   SET "tagline" = 'Pura Época Pesada 🔥. Disponible con Norteño y Banda'
 WHERE id = 'cmi82wy9h0001s1rr9gw27fs2';  -- Leonel El Ranchero

UPDATE "Artist"
   SET "tagline" = 'Un ícono de los 90s. Disponible con Norteño y guitarras.'
 WHERE id = 'cmi82wyex0002s1rrufjilwtr';  -- El Chalinillo
```

Esos textos son los `description` originales (hand-written por el usuario, no AI). No requieren pasar por `/humanizer`.

Los 6 artistas importados nuevos (Banda La Tunera, Jessie Morales El Original de la Sierra, Los Ases de Sinaloa, Los Morros del Norte, Meño Lugo, Paulino Rosas Y Su Estilo Norteño) arrancan con `tagline = NULL`. El admin los escribirá manualmente como tarea de follow-up, pasando cada uno por `/humanizer`.

## Verificación end-to-end

1. `npx prisma migrate dev --name artist_tagline` → migración corre limpia, el cliente Prisma se regenera con el campo nuevo.
2. Ejecutar el SQL de backfill contra la base de desarrollo.
3. `npm run dev` y visitar `/artist/cmi82wy400000s1rrkp7omiwk` (El As) → hero muestra `"El #1 de Sinaloa. Disponible con Banda y Norteño"`; "La historia" muestra la bio importada; **no hay duplicación**; la frase "Tres voces que se conocen desde la prepa…" no aparece.
4. Visitar `/artist/<id-de-Banda-La-Tunera>` (sin tagline) → hero oculta el subtítulo y la línea decorativa; solo se ve el nombre del artista; "La historia" sí muestra su bio.
5. En `/admin/artists/<id>` editar un artista, llenar/vaciar el campo de tagline, guardar, refresh → cambio reflejado.
6. `npm run import:artists` (sin `--apply`) → 9 SKIPs (idempotente). Después de poner taglines manuales en admin, volver a correr → siguen 9 SKIPs, el importer no toca taglines.

## Riesgos

- Si los componentes del hero (`ArtistHero` y `MobileReservation`) reciben tipos de Prisma directamente sin pasar por `ReservationArtist`, hay que extender la prop chain. Verificar en el plan que todos los call-sites pasan `tagline`.
- La migración usa `prisma migrate dev` en local; el deploy a Supabase usa `prisma migrate deploy` o similar — el plan debe especificar el procedimiento exacto para el entorno productivo.
