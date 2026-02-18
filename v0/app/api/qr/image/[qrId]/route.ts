import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import QRCode from "qrcode";

export async function GET(
    request: NextRequest,
    { params }: { params: { qrId: string } }
) {
    try {
        const qrId = params.qrId;

        if (!qrId) {
            return new NextResponse("QR ID is required", { status: 400 });
        }

        // Fetch QR code to ensure it exists
        const qrCode = await prisma.qRCode.findUnique({
            where: { id: qrId },
        });

        if (!qrCode) {
            return new NextResponse("QR Code not found", { status: 404 });
        }

        // Generate the visit URL
        const visitUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://qr.akmal.in'}/visit/${qrId}`;

        // Generate QR code image buffer
        const qrImageBuffer = await QRCode.toBuffer(visitUrl, {
            width: 400,
            margin: 2,
            color: {
                dark: "#000000",
                light: "#ffffff",
            },
        });

        // Return the image
        return new NextResponse(qrImageBuffer as any, {
            headers: {
                "Content-Type": "image/png",
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch (error) {
        console.error("Error generating QR code image:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
