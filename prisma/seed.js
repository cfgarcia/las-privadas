const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    // Demo roster for local dev + CI E2E. Images use via.placeholder.com,
    // which is allowed by next.config remotePatterns (unsplash is not, and
    // next/image throws on a disallowed host).
    const artists = [
        {
            name: 'The Midnight Jazz Trio',
            description: 'Smooth jazz for elegant evenings.',
            order: 0,
            imageUrl: 'https://via.placeholder.com/800x1200/1a0f0a/E8C77A?text=Jazz+Trio',
        },
        {
            name: 'Electric Pulse',
            description: 'High energy rock band for parties.',
            order: 1,
            imageUrl: 'https://via.placeholder.com/800x1200/1a0f0a/E8C77A?text=Electric+Pulse',
        },
        {
            name: 'Acoustic Soul',
            description: 'Heartfelt acoustic covers and originals.',
            order: 2,
            imageUrl: 'https://via.placeholder.com/800x1200/1a0f0a/E8C77A?text=Acoustic+Soul',
        },
    ]

    for (const artist of artists) {
        // Upsert to avoid duplicates if run multiple times
        const existing = await prisma.artist.findFirst({ where: { name: artist.name } })
        if (!existing) {
            await prisma.artist.create({
                data: artist,
            })
        }
    }
    console.log('Seeded artists')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
