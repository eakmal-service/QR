import { NextResponse } from 'next/server'
import { nanoid } from 'nanoid'

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const { originalUrl } = await request.json()

        if (!originalUrl) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 })
        }

        // Simple short code generation
        const shortCode = nanoid(8)

        // Try to save to database, but continue if it fails
        try {
            const { prisma } = await import('@/lib/prisma');
            const link = await prisma.link.create({
                data: {
                    originalUrl,
                    shortCode,
                },
            })
            return NextResponse.json(link)
        } catch (dbError) {
            console.warn('Database not available, returning mock link:', dbError)
            // Return a mock response when database is not available
            return NextResponse.json({
                id: shortCode,
                originalUrl,
                shortCode,
                createdAt: new Date().toISOString(),
                message: 'Note: Link created but not saved to database (database connection pending)'
            })
        }
    } catch (error) {
        console.error('Error creating link:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
