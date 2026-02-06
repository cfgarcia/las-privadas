const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const email = 'rigoberto@elcorridotv.com'

    console.log(`Checking user: ${email}...`)

    // Upsert user to ensure they exist and are ADMIN
    // If they don't exist yet, we create a placeholder so they are admin when they log in
    const user = await prisma.user.upsert({
        where: { email },
        update: { role: 'ADMIN' },
        create: {
            email,
            role: 'ADMIN',
            name: 'Rigoberto (Admin)',
        }
    })

    console.log(`User ${user.email} is now ${user.role}`)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
