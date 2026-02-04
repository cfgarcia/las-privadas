import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const artists = [
        {
            name: 'The Midnight Jazz Trio',
            description: 'Smooth jazz for elegant evenings.',
            imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Electric Pulse',
            description: 'High energy rock band for parties.',
            imageUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Acoustic Soul',
            description: 'Heartfelt acoustic covers and originals.',
            imageUrl: 'https://images.unsplash.com/photo-1465847899078-b413929f7120?auto=format&fit=crop&q=80&w=800',
        },
    ]

    for (const artist of artists) {
        await prisma.artist.create({
            data: artist,
        })
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
