const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const email = 'rigoberto@elcorridotv.com'
    const user = await prisma.user.findUnique({
        where: { email },
        select: { email: true, role: true }
    })
    console.log("Current User State:", user)
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
