import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const qrCodes = await prisma.qRCode.findMany({
            include: {
                reviews: {
                    select: {
                        id: true,
                        rating: true,
                        createdAt: true,
                    },
                },
                scanLogs: {
                    select: {
                        action: true,
                    },
                },
                _count: {
                    select: {
                        reviews: true,
                        scanLogs: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Calculate analytics for each QR code
        const qrCodesWithAnalytics = qrCodes.map((qr) => {
            const scans = qr.scanLogs.filter((log) => log.action === 'scan').length;
            const submissions = qr.scanLogs.filter((log) => log.action === 'review_submitted').length;
            const avgRating = qr.reviews.length > 0
                ? qr.reviews.reduce((sum, r) => sum + r.rating, 0) / qr.reviews.length
                : 0;

            return {
                id: qr.id,
                businessName: qr.businessName,
                productSummary: qr.productSummary,
                createdAt: qr.createdAt,
                visitUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://qr.akmal.in'}/visit/${qr.id}`,
                analytics: {
                    totalScans: scans,
                    totalReviews: qr._count.reviews,
                    totalSubmissions: submissions,
                    averageRating: Number(avgRating.toFixed(1)),
                    conversionRate: scans > 0 ? ((submissions / scans) * 100).toFixed(1) + '%' : '0%',
                },
            };
        });

        return NextResponse.json({
            success: true,
            qrCodes: qrCodesWithAnalytics,
        });
    } catch (error) {
        console.error("Error fetching QR codes:", error);
        return NextResponse.json(
            { error: "Failed to fetch QR codes" },
            { status: 500 }
        );
    }
}
