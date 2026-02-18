import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { businessName, productSummary, businessId, metadata, googleMapsLink, businessType, location } = body;

        if (!businessName) {
            return NextResponse.json(
                { error: "businessName is required" },
                { status: 400 }
            );
        }

        // Generate unique QR code ID
        const qrId = businessId || `qr-${nanoid(10)}`;

        // Create QR code in database
        const qrCode = await prisma.qRCode.create({
            data: {
                id: qrId,
                businessId: businessId || qrId,
                businessName,
                productSummary: productSummary || businessName,
                googleMapsLink,
                businessType,
                location,
                metadata: metadata ? JSON.stringify(metadata) : null,
            },
        });

        // Generate the visit URL
        const visitUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://qr.akmal.in'}/visit/${qrCode.id}`;

        return NextResponse.json({
            success: true,
            qrCode: {
                id: qrCode.id,
                businessName: qrCode.businessName,
                productSummary: qrCode.productSummary,
                visitUrl,
                createdAt: qrCode.createdAt,
            },
        });
    } catch (error) {
        console.error("Error creating QR code:", error);
        return NextResponse.json(
            { error: "Failed to create QR code" },
            { status: 500 }
        );
    }
}
