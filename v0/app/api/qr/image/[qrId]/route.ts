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

        const url = new URL(request.url);
        const format = url.searchParams.get("format") || "png";
        const sizeParam = url.searchParams.get("size");
        const size = sizeParam ? parseInt(sizeParam, 10) : 400;

        // Generate the visit URL
        const visitUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://qr.akmal.in'}/visit/${qrId}`;

        if (format === "svg") {
            const svgString = await QRCode.toString(visitUrl, {
                type: 'svg',
                width: size,
                margin: 2,
                color: {
                    dark: "#000000",
                    light: "#ffffff",
                },
            });

            return new NextResponse(svgString, {
                headers: {
                    "Content-Type": "image/svg+xml",
                    "Cache-Control": "public, max-age=31536000, immutable",
                },
            });
        }

        // Generate QR code image buffer
        const qrImageBuffer = await QRCode.toBuffer(visitUrl, {
            type: format === "jpeg" ? "jpeg" : "png",
            width: size,
            margin: 2,
            color: {
                dark: "#000000",
                light: "#ffffff",
            },
        } as any);

        // Return the image
        return new NextResponse(qrImageBuffer as any, {
            headers: {
                "Content-Type": format === "jpeg" ? "image/jpeg" : "image/png",
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch (error) {
        console.error("Error generating QR code image:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
