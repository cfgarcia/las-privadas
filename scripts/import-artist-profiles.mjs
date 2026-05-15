/**
 * Import artist profiles from /Users/christianfranciscogarcia/Proyects/Researcher/output/artist-profiles
 * into the Artist table.
 *
 *   - New artists: created with name + short Spanish description.
 *     imageUrl, bookingImageUrl, hoverVideoUrl are left NULL so the admin
 *     can upload them later from /admin/artists/[id].
 *   - Existing artists (matched by accent-insensitive normalized name):
 *     description is overwritten. Media URLs, songs, order, and Meta fields
 *     are left untouched.
 *
 * Usage:
 *   node scripts/import-artist-profiles.mjs            # dry-run
 *   node scripts/import-artist-profiles.mjs --apply    # write
 *   node scripts/import-artist-profiles.mjs --profiles-dir /some/other/path
 */

import { PrismaClient } from '@prisma/client'
import { readdir, readFile } from 'node:fs/promises'
import { join, basename } from 'node:path'

const DEFAULT_PROFILES_DIR =
    '/Users/christianfranciscogarcia/Proyects/Researcher/output/artist-profiles'
const MAX_DESCRIPTION_CHARS = 250

function parseArgs(argv) {
    const args = { apply: false, profilesDir: DEFAULT_PROFILES_DIR }
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i]
        if (a === '--apply') args.apply = true
        else if (a === '--profiles-dir') args.profilesDir = argv[++i]
        else if (a === '-h' || a === '--help') {
            console.log(
                'Usage: node scripts/import-artist-profiles.mjs [--apply] [--profiles-dir <path>]',
            )
            process.exit(0)
        } else {
            console.error(`Unknown arg: ${a}`)
            process.exit(2)
        }
    }
    return args
}

function stripMarkdown(s) {
    return s
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/\s+/g, ' ')
        .trim()
}

function normalizeName(s) {
    return s
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim()
}

function truncateAtSentence(text, max) {
    if (text.length <= max) return text
    const slice = text.slice(0, max)
    const lastBoundary = Math.max(
        slice.lastIndexOf('. '),
        slice.lastIndexOf('! '),
        slice.lastIndexOf('? '),
        slice.lastIndexOf('.'),
    )
    if (lastBoundary > max * 0.5) return slice.slice(0, lastBoundary + 1).trim()
    return slice.slice(0, max - 1).trimEnd() + '…'
}

function extractName(raw, fallbackSlug) {
    const idMatch = raw.match(
        /^\|\s*Nombre art[íi]stico\s*\|\s*([^|]+?)\s*\|/im,
    )
    if (idMatch) {
        let name = stripMarkdown(idMatch[1])
        name = name.replace(/\s*\([^)]*\).*$/, '').trim()
        name = name.replace(/["“”]/g, '').replace(/\s+/g, ' ').trim()
        if (name) return name
    }
    const h1Match = raw.match(/^#\s+(.+?)\s*$/m)
    if (h1Match) {
        return h1Match[1].replace(/\s*[—-]\s*Perfil.*$/i, '').trim()
    }
    return fallbackSlug
}

function extractDescription(raw) {
    const m = raw.match(/^##\s+Biograf[íi]a\s*\n([\s\S]*?)(?=\n##\s+|$)/m)
    if (!m) throw new Error('No "## Biografía" section found')
    const body = m[1].trim()
    const firstParagraph = body.split(/\n\s*\n/)[0] ?? ''
    const clean = stripMarkdown(firstParagraph)
    if (!clean) throw new Error('Biografía first paragraph is empty')
    return truncateAtSentence(clean, MAX_DESCRIPTION_CHARS)
}

function parseProfile(filePath, raw) {
    const slug = basename(filePath).replace(/-profile\.md$/, '')
    const name = extractName(raw, slug)
    const description = extractDescription(raw)
    return { filePath, slug, name, description }
}

async function readProfiles(dir) {
    const entries = await readdir(dir)
    const mds = entries.filter((f) => f.endsWith('-profile.md')).sort()
    const profiles = []
    for (const f of mds) {
        const filePath = join(dir, f)
        const raw = await readFile(filePath, 'utf8')
        try {
            profiles.push(parseProfile(filePath, raw))
        } catch (err) {
            throw new Error(
                `Failed to parse ${filePath}: ${err instanceof Error ? err.message : err}`,
            )
        }
    }
    return profiles
}

function buildPlan(profiles, existing) {
    const byNorm = new Map()
    for (const a of existing) {
        const key = normalizeName(a.name)
        if (!byNorm.has(key)) byNorm.set(key, [])
        byNorm.get(key).push(a)
    }

    const plans = []
    let maxOrder = existing.reduce((m, a) => Math.max(m, a.order), -1)

    for (const p of profiles) {
        const key = normalizeName(p.name)
        const matches = byNorm.get(key) ?? []
        if (matches.length > 1) {
            plans.push({
                kind: 'skip',
                profile: p,
                reason: `ambiguous: ${matches.length} existing artists share normalized name "${key}"`,
            })
            continue
        }
        if (matches.length === 1) {
            const ex = matches[0]
            if (ex.description === p.description) {
                plans.push({
                    kind: 'skip',
                    profile: p,
                    reason: 'description unchanged',
                })
            } else {
                plans.push({
                    kind: 'update',
                    profile: p,
                    existing: ex,
                })
            }
            continue
        }
        maxOrder += 1
        plans.push({ kind: 'create', profile: p, order: maxOrder })
    }
    return plans
}

function summarize(plans) {
    const creates = plans.filter((p) => p.kind === 'create')
    const updates = plans.filter((p) => p.kind === 'update')
    const skips = plans.filter((p) => p.kind === 'skip')

    console.log(`\nCREATE (${creates.length}):`)
    for (const p of creates) {
        console.log(
            `  + ${p.profile.name}  (from ${basename(p.profile.filePath)}, order=${p.order})`,
        )
        console.log(`      "${p.profile.description}"`)
    }
    console.log(`\nUPDATE (${updates.length}):`)
    for (const p of updates) {
        console.log(
            `  ~ ${p.profile.name}  (id=${p.existing.id}, description ${p.existing.description.length} → ${p.profile.description.length} chars)`,
        )
        console.log(`      old: "${p.existing.description}"`)
        console.log(`      new: "${p.profile.description}"`)
    }
    console.log(`\nSKIP (${skips.length}):`)
    for (const p of skips) {
        console.log(`  · ${p.profile.name}  — ${p.reason}`)
    }
}

async function applyPlan(prisma, plans) {
    for (const p of plans) {
        if (p.kind === 'create') {
            await prisma.artist.create({
                data: {
                    name: p.profile.name,
                    tagline: null,
                    description: p.profile.description,
                    albumCount: null,
                    careerYears: null,
                    imageUrl: null,
                    bookingImageUrl: null,
                    hoverVideoUrl: null,
                    order: p.order,
                },
            })
        } else if (p.kind === 'update') {
            await prisma.artist.update({
                where: { id: p.existing.id },
                data: { description: p.profile.description },
            })
        }
    }
}

async function main() {
    const args = parseArgs(process.argv.slice(2))
    console.log(`Reading profiles from ${args.profilesDir}`)
    const profiles = await readProfiles(args.profilesDir)
    console.log(`Found ${profiles.length} profiles.`)

    const prisma = new PrismaClient()
    try {
        const existing = await prisma.artist.findMany({
            select: { id: true, name: true, description: true, order: true },
        })
        console.log(`Loaded ${existing.length} existing artists from DB.`)

        const plans = buildPlan(profiles, existing)
        summarize(plans)

        if (!args.apply) {
            console.log('\n[DRY RUN] Re-run with --apply to write.')
            return
        }
        await applyPlan(prisma, plans)
        console.log('\n✓ Applied.')
    } finally {
        await prisma.$disconnect()
    }
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
