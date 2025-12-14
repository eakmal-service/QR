import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ code: string }> }
) {
    const code = (await params).code

    try {
        const { prisma } = await import('@/lib/prisma');

        const link = await prisma.link.findUnique({
            where: { shortCode: code },
        })

        if (!link) {
            return NextResponse.redirect(new URL('/', request.url))
        }

        // Track scan asynchronously (don't block redirect)
        const headersList = await headers()
        const userAgent = headersList.get('user-agent') || 'unknown'
        const ip = headersList.get('x-forwarded-for') || 'unknown'

        // Simple device type detection
        let deviceType = 'Desktop'
        if (/mobile/i.test(userAgent)) deviceType = 'Mobile'
        else if (/tablet/i.test(userAgent)) deviceType = 'Tablet'

        // In a real app, we would hash the IP for privacy
        const ipHash = ip // Placeholder

        try {
            await prisma.scan.create({
                data: {
                    linkId: link.id,
                    deviceType,
                    ipHash,
                },
            })
        } catch (e) {
            console.error('Failed to log scan', e)
        }

        return NextResponse.redirect(link.originalUrl)
    } catch (dbError) {
        console.error('Database error in redirect route:', dbError)
        // If database fails, redirect to home
        return NextResponse.redirect(new URL('/', request.url))
    }
}
