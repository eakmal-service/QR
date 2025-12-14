import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | null }

let prismaInstance: PrismaClient | null = null;

try {
    prismaInstance = globalForPrisma.prisma || new PrismaClient()
    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaInstance
} catch (error) {
    console.error('Failed to initialize Prisma Client:', error)
    prismaInstance = null
}

// Export a proxy that throws helpful errors when database is not available
export const prisma = new Proxy({} as PrismaClient, {
    get(target, prop) {
        if (!prismaInstance) {
            throw new Error('Database not available - Prisma Client failed to initialize')
        }
        return (prismaInstance as any)[prop]
    }
})
