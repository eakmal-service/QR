import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { prisma } = await import('@/lib/prisma');

        const links = await prisma.link.findMany({
            include: {
                _count: {
                    select: { scans: true },
                },
                scans: {
                    select: {
                        deviceType: true,
                        timestamp: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
        })

        const totalScans = await prisma.scan.count()
        const totalLinks = await prisma.link.count()

        return NextResponse.json({
            links,
            stats: {
                totalScans,
                totalLinks,
            },
        })
    } catch (error) {
        console.warn('Database not available for stats, returning mock data:', error)
        return NextResponse.json({
            links: [],
            stats: {
                totalScans: 0,
                totalLinks: 0,
            },
            message: 'Database connection pending - showing empty stats'
        })
    }
}
