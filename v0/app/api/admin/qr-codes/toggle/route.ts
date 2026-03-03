import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { qrId, isActive } = body;

        if (!qrId || typeof isActive !== 'boolean') {
            return NextResponse.json({ error: "Missing or invalid qrId or isActive" }, { status: 400 });
        }

        const updatedQrCode = await prisma.qRCode.update({
            where: { id: qrId },
            data: { isActive },
        });

        return NextResponse.json({
            success: true,
            qrCode: updatedQrCode,
        });

    } catch (error) {
        console.error("Error toggling QR code status:", error);
        return NextResponse.json(
            { error: "Failed to toggle status" },
            { status: 500 }
        );
    }
}
