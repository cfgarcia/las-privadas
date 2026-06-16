/**
 * Populate the web EPK (press kit) for an artist: process photos, upload assets
 * to GCS, and upsert Artist press fields + PressPhoto + PressAsset rows.
 *
 * Modes:
 *   node scripts/import-press-kit.mjs              # dry-run (prints plan)
 *   node scripts/import-press-kit.mjs --process    # only generate web-res photos locally
 *   node scripts/import-press-kit.mjs --apply      # process + upload to GCS + write DB
 *
 * Idempotent: GCS destinations are stable (re-run overwrites); press photos/assets
 * for the artist are replaced wholesale on --apply.
 *
 * Requires: .env with DATABASE_URL, GCS_BUCKET_NAME, GOOGLE_APPLICATION_CREDENTIALS.
 * Requires ImageMagick (`magick`) for web-res generation.
 */
import { PrismaClient } from "@prisma/client"
import { Storage } from "@google-cloud/storage"
import { execFileSync } from "node:child_process"
import { readFileSync, mkdirSync, existsSync, statSync } from "node:fs"
import { basename, join } from "node:path"

// ── load .env (plain node has no auto-load) ─────────────────────────────────
function loadEnv() {
    const txt = readFileSync(new URL("../.env", import.meta.url), "utf8")
    for (const line of txt.split("\n")) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
        if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "")
    }
}
loadEnv()

const APPLY = process.argv.includes("--apply")
const PROCESS_ONLY = process.argv.includes("--process")
const SLUG = "elas"
const MKT = "/Users/christianfranciscogarcia/Proyects/Marketing/press-kits/el-as-de-la-sierra"
const DIST = `${MKT}/dist`
const PHOTOS = `${MKT}/photos`
const LOGO = "/Users/christianfranciscogarcia/Proyects/TitanRecords/brand/logo_titan.png"
const TMP = "/tmp/press-webres"
const BUCKET = process.env.GCS_BUCKET_NAME

// ── content (sourced from content.md + TitanRecords analytics; verified June 2026)
const ARTIST = {
    slug: SLUG,
    isPressPublished: true,
    genre: "Corridos · Sierreño · Banda",
    pressTaglineEn: "El Patrón de Patrones — three decades of corridos sinaloenses, and the rooms are still full.",
    pressTaglineEs: "El Patrón de Patrones — tres décadas de corridos sinaloenses, y los cuartos siguen llenos.",
    bioShortEn:
        "In 1996, a corrido called \"El Helicóptero Negro\" took over Spanish-language radio across Southern California and turned José Heredia, a ranch kid from San José del Cañón, Sinaloa, into El As de la Sierra. Thirty years later he is one of the foundational voices of the corrido sinaloense — the \"Patrón de Patrones\" whose classics fill the setlists of today's young corrido stars. He has recorded for the same label, Titan Records, his entire career, and still tours the United States headlining theaters and casino showrooms with Banda Titanes Sinaloenses. 1.4 million people listen to him on Spotify every month, and his audience spans three generations.",
    bioShortEs:
        "En 1996, un corrido llamado \"El Helicóptero Negro\" conquistó la radio en español del sur de California y convirtió a José Heredia, un muchacho de rancho de San José del Cañón, Sinaloa, en El As de la Sierra. Tres décadas después es una de las voces fundadoras del corrido sinaloense — el \"Patrón de Patrones\" cuyos clásicos llenan los setlists de los corridistas jóvenes de hoy. Ha grabado con el mismo sello, Titan Records, toda su carrera, y sigue de gira por Estados Unidos encabezando teatros y showrooms de casinos con la Banda Titanes Sinaloenses. 1.4 millones de personas lo escuchan en Spotify cada mes, y su público abarca tres generaciones.",
    bioLongEn:
        "José Heredia learned music between furrows. Born in San José del Cañón, a ranch settlement in the sierra of Sinaloa, he grew up working the land — no music school, just a raspy voice and the plain-spoken storytelling that would become his signature.\n\nHis 1996 debut passed quietly; the corrido that followed it did not. \"El Helicóptero Negro\" exploded on Southern California radio and made him a fixture of the Los Angeles corrido scene almost overnight. He signed with Titan Records that year and never left — thirty years, one label, a loyalty almost unheard of in regional Mexican music.\n\nWhat followed is one of the genre's great catalogs: \"Catarino y los Rurales,\" \"El Muchacho Alegre,\" \"De Esta Sierra a la Otra Sierra,\" \"Regalo Caro\" — songs that defined the 90s corrido sinaloense and never stopped being played. He belongs to the lineage that runs from Chalino Sánchez through the great sierra voices to today's corrido movement.\n\nThirty years in, he is still recording and still drawing — sold-out casino showrooms, theater headlines, and recent collaborations that keep him on playlists next to the new generation. Puro pa' delante.",
    bioLongEs:
        "José Heredia aprendió música entre surcos. Nacido en San José del Cañón, un rancho en la sierra de Sinaloa, creció trabajando la tierra — sin escuela de música, solo una voz rasposa y la forma directa de contar historias que se volvería su sello.\n\nSu debut de 1996 pasó sin ruido; el corrido que vino después, no. \"El Helicóptero Negro\" explotó en la radio del sur de California y lo volvió pieza fija de la escena del corrido en Los Ángeles casi de un día para otro. Firmó con Titan Records ese año y nunca se fue — treinta años, un solo sello, una lealtad casi inédita en el regional mexicano.\n\nLo que siguió es uno de los grandes catálogos del género: \"Catarino y los Rurales\", \"El Muchacho Alegre\", \"De Esta Sierra a la Otra Sierra\", \"Regalo Caro\" — canciones que definieron el corrido sinaloense de los 90 y que nunca dejaron de sonar. Pertenece al linaje que va de Chalino Sánchez a las grandes voces de la sierra y al movimiento del corrido de hoy.\n\nTreinta años después sigue grabando y sigue llenando — showrooms de casino agotados, teatros como cabeza de cartel, y colaboraciones recientes que lo mantienen en los playlists junto a la nueva generación. Puro pa' delante.",
    careerYears: 30,
    albumCount: 30,
    pressStats: {
        monthlyListeners: 1425544,
        topTrack: "Catarino y los Rurales",
        topTrackStreams: 45400000,
        followers: { spotify: 635120, facebook: 512115, youtube: 205000, tiktok: 143358, instagram: 110778 },
        asOf: "June 2026",
    },
    pressQuotes: [
        { text: "Known for his signature corridos and norteño-sierreño sound, El As de la Sierra has built a loyal following with songs that blend traditional Mexican music with modern regional influences.", source: "Weekly Voice, 2026" },
        { text: "El Patrón de Patrones — three decades on the same label, and his classics are still in every young corrido act's setlist.", source: "Titan Records" },
    ],
    pressContacts: [
        { name: "Rigoberto Garcia", role: "Titan Records", phone: "+1 (323) 855-1112", email: "rigoberto@elcorridotv.com" },
        { name: "Donnie Frizzell", role: "Booking Agent", phone: "+1 (918) 863-7052", email: "donniefrizzell4@gmail.com" },
    ],
    liveVideoUrl: "https://www.youtube.com/playlist?list=PLcszU1RqpgG5LAQ0hQS-mIKtVnxHU7n45",
    spotifyUrl: "https://open.spotify.com/artist/6uQMkB156uIN27tFar9qQl",
    youtubeUrl: "https://www.youtube.com/@jh_elasdelasierra",
    instagramUrl: "https://www.instagram.com/jh_elasdelasierra",
    tiktokUrl: "https://www.tiktok.com/@jh_elasdelasierra",
    facebookUrl: "https://www.facebook.com/560288020819289",
    appleMusicUrl: null,
}

// source photo, orientation, caption
const PHOTO_SRC = [
    { f: `${PHOTOS}/Press Portraits/DSC01332.jpg`, o: "portrait", c: "El As de la Sierra" }, // cover (must stay #1)
    { f: `${PHOTOS}/Press Portraits/DSC01764.jpg`, o: "portrait", c: "El As de la Sierra" },
    { f: `${PHOTOS}/Press Portraits/DSC01250.jpg`, o: "portrait", c: "El As de la Sierra" },
    { f: `${PHOTOS}/Hero Shot/DSC01177.jpg`, o: "portrait", c: "El As de la Sierra" },
    { f: `${PHOTOS}/Press Portraits/DSC01790.jpg`, o: "portrait", c: "El As de la Sierra" },
    { f: `${PHOTOS}/Press Portraits/DSC01377.jpg`, o: "portrait", c: "El As de la Sierra" },
    { f: `${PHOTOS}/Press Portraits/DSC01327.jpg`, o: "portrait", c: "El As de la Sierra" },
    { f: `${PHOTOS}/Press Portraits/DSC01598.jpg`, o: "portrait", c: "El As de la Sierra" },
    { f: `${PHOTOS}/Press Portraits/DSC01072.jpg`, o: "portrait", c: "El As de la Sierra" },
    { f: `${PHOTOS}/Press Portraits/DSC01759.jpg`, o: "portrait", c: "El As de la Sierra" },
    { f: `${PHOTOS}/Live/DSC00501.jpg`, o: "landscape", c: "Live with Banda Titanes Sinaloenses" },
    { f: `${PHOTOS}/Live/DSC00543.jpg`, o: "landscape", c: "Live on stage" },
    { f: `${PHOTOS}/Live/DSC00508.jpg`, o: "landscape", c: "Live on stage" },
    { f: `${PHOTOS}/Live/DSC00479.jpg`, o: "portrait", c: "Live on stage" },
    { f: `${PHOTOS}/With Fans/DSC00711.jpg`, o: "landscape", c: "With fans" },
    { f: `${PHOTOS}/With Fans/DSC00705.jpg`, o: "landscape", c: "With fans" },
    { f: `${PHOTOS}/Old School Photos/charro-green-suit-horse_superia400_1x1.png`, o: "square", c: "Archival" },
]

// NOTE: the audience/DMA/corridor "data for buyers" docs are intentionally NOT
// published here — they contain internal strategy (casino targets, ad economics)
// and are sent 1:1 by the booker. Public assets = EPK, one-sheet, logo only.
const ASSET_SRC = [
    { f: `${DIST}/El-As-De-La-Sierra-EPK-2026.pdf`, kind: "epk_pdf", label: "Press Kit (EPK) — PDF", labelEs: "Press Kit (EPK) — PDF" },
    { f: `${DIST}/El-As-De-La-Sierra-OneSheet-2026.pdf`, kind: "onesheet_pdf", label: "One-Sheet — PDF", labelEs: "One-Sheet — PDF" },
    { f: LOGO, kind: "logo", label: "Titan Records logo (PNG)", labelEs: "Logo Titan Records (PNG)" },
]

function publicUrl(dest) { return `https://storage.googleapis.com/${BUCKET}/${dest}` }

function genWebRes(src) {
    if (!existsSync(TMP)) mkdirSync(TMP, { recursive: true })
    const out = join(TMP, basename(src).replace(/\.[^.]+$/, "") + "-web.jpg")
    execFileSync("magick", [src, "-resize", "1600x1600>", "-quality", "82", out])
    return out
}

async function main() {
    console.log(`Mode: ${APPLY ? "APPLY (GCS + DB write)" : PROCESS_ONLY ? "PROCESS (local web-res only)" : "DRY-RUN"}`)
    for (const s of [...PHOTO_SRC.map((p) => p.f), ...ASSET_SRC.map((a) => a.f)]) {
        if (!existsSync(s)) { console.error(`MISSING source: ${s}`); process.exitCode = 1 }
    }
    if (process.exitCode) return

    // 1) web-res photos (local, safe)
    const webres = {}
    for (const p of PHOTO_SRC) { webres[p.f] = genWebRes(p.f); console.log(`web-res → ${webres[p.f]}`) }
    if (PROCESS_ONLY) { console.log("Done (process-only)."); return }

    if (!APPLY) {
        console.log(`\nWould upload ${PHOTO_SRC.length} photos (hi-res + web-res) + ${ASSET_SRC.length} assets to gs://${BUCKET}/press-*`)
        console.log(`Would upsert Artist(slug=${SLUG}) press fields + ${PHOTO_SRC.length} PressPhoto + ${ASSET_SRC.length} PressAsset rows.`)
        console.log("Re-run with --apply to write. (Requires migration applied.)")
        return
    }

    // 2) upload to GCS
    const storage = new Storage()
    const bucket = storage.bucket(BUCKET)
    async function up(localPath, dest, contentType) {
        await bucket.upload(localPath, { destination: dest, metadata: { contentType } })
        return publicUrl(dest)
    }

    const photoRows = []
    // Name each object by its SOURCE file (unique per content) — NOT by position.
    // Positional names (01, 02…) collide on re-order and serve stale cache.
    let i = 0
    for (const p of PHOTO_SRC) {
        i++
        const stem = basename(p.f).replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9._-]/g, "_")
        const hiExt = p.f.toLowerCase().endsWith(".png") ? "png" : "jpg"
        const hiName = `press-photos/${SLUG}/${stem}-hi.${hiExt}`
        const webName = `press-photos/${SLUG}/${stem}-web.jpg`
        const hiUrl = await up(p.f, hiName, hiExt === "png" ? "image/png" : "image/jpeg")
        const webUrl = await up(webres[p.f], webName, "image/jpeg")
        photoRows.push({ url: hiUrl, webUrl, caption: p.c, orientation: p.o, order: i })
        console.log(`uploaded photo ${i} (${stem})`)
    }

    const assetRows = []
    let j = 0
    for (const a of ASSET_SRC) {
        const ext = a.f.split(".").pop()
        const dest = `press-kits/${SLUG}/${basename(a.f)}`
        const ct = ext === "pdf" ? "application/pdf" : ext === "png" ? "image/png" : "application/octet-stream"
        const url = await up(a.f, dest, ct)
        assetRows.push({ label: a.label, labelEs: a.labelEs, kind: a.kind, url, fileSizeBytes: statSync(a.f).size, order: ++j })
        console.log(`uploaded asset ${a.kind}`)
    }

    // 3) DB upsert
    const prisma = new PrismaClient()
    const artist = await prisma.artist.findUnique({ where: { slug: SLUG } })
    if (!artist) { console.error(`Artist slug=${SLUG} not found — create it in /admin first.`); await prisma.$disconnect(); process.exitCode = 1; return }

    await prisma.artist.update({ where: { id: artist.id }, data: { ...ARTIST } })
    await prisma.pressPhoto.deleteMany({ where: { artistId: artist.id } })
    await prisma.pressAsset.deleteMany({ where: { artistId: artist.id } })
    await prisma.pressPhoto.createMany({ data: photoRows.map((r) => ({ ...r, artistId: artist.id })) })
    await prisma.pressAsset.createMany({ data: assetRows.map((r) => ({ ...r, artistId: artist.id })) })
    console.log(`\n✓ Wrote press kit for ${artist.name}: ${photoRows.length} photos, ${assetRows.length} assets.`)
    await prisma.$disconnect()
}

main().catch((e) => { console.error(e); process.exit(1) })
