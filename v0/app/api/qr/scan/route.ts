import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { qrId, deviceId, sessionId } = body;

        if (!qrId) {
            return NextResponse.json(
                { error: "qrId is required" },
                { status: 400 }
            );
        }

        // Fetch QR code details
        const qrCode = await prisma.qRCode.findUnique({
            where: { id: qrId },
        });

        if (!qrCode) {
            return NextResponse.json(
                { error: "QR code not found" },
                { status: 404 }
            );
        }

        if (!qrCode.isActive) {
            return NextResponse.json(
                { error: "This QR Code is currently disabled." },
                { status: 403 }
            );
        }

        // Log the scan
        await prisma.scanLog.create({
            data: {
                qrCodeId: qrId,
                deviceType: deviceId,
                action: "scan",
                timestamp: new Date(),
            },
        });

        // Return business details for the interactive form
        return NextResponse.json({
            status: "success",
            qrCode: {
                id: qrCode.id,
                businessName: qrCode.businessName,
                productSummary: qrCode.productSummary,
                businessCategory: qrCode.businessCategory,
                menuItems: qrCode.menuItems ? JSON.parse(qrCode.menuItems) : [],
                googleMapsLink: qrCode.googleMapsLink,
                location: qrCode.location,
            }
        });
    } catch (error) {
        console.error("Error in /api/qr/scan:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
