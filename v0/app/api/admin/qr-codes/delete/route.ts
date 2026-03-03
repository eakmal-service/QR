import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // Ensure admin check
        if (!session || session.user?.email !== "hanzalaq63@gmail.com") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "QR Code ID is required" }, { status: 400 });
        }

        // Delete related TempReviews first
        await prisma.tempReview.deleteMany({
            where: { qrCodeId: id }
        });

        // Delete related Reviews
        await prisma.review.deleteMany({
            where: { qrCodeId: id }
        });

        // Delete related ScanLogs
        await prisma.scanLog.deleteMany({
            where: { qrCodeId: id }
        });

        // Delete the QR Code
        await prisma.qRCode.delete({
            where: { id }
        });

        return NextResponse.json({ success: true, message: "QR Code deleted successfully" });
    } catch (error) {
        console.error("Failed to delete QR Code:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
