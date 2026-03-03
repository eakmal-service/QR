import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function handleUpdate(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, qrId, businessName, productSummary, businessCategory, description, metadata, googleMapsLink, businessType, location, menuItems } = body;

        const targetId = id || qrId;

        if (!targetId) {
            return NextResponse.json(
                { error: "QR Code ID is required for update" },
                { status: 400 }
            );
        }

        // Check if QR code exists
        const existingQrCode = await prisma.qRCode.findUnique({
            where: { id: targetId },
        });

        if (!existingQrCode) {
            return NextResponse.json(
                { error: "QR code not found" },
                { status: 404 }
            );
        }

        // Update QR code in database
        const updatedQrCode = await prisma.qRCode.update({
            where: { id: targetId },
            data: {
                businessName: businessName !== undefined ? businessName : existingQrCode.businessName,
                productSummary: productSummary !== undefined ? productSummary : existingQrCode.productSummary,
                businessCategory: businessCategory !== undefined ? businessCategory : existingQrCode.businessCategory,
                description: description !== undefined ? description : existingQrCode.description,
                googleMapsLink: googleMapsLink !== undefined ? googleMapsLink : existingQrCode.googleMapsLink,
                businessType: businessType !== undefined ? businessType : existingQrCode.businessType,
                location: location !== undefined ? location : existingQrCode.location,
                menuItems: menuItems !== undefined ? JSON.stringify(menuItems) : existingQrCode.menuItems,
                metadata: metadata !== undefined ? JSON.stringify(metadata) : existingQrCode.metadata,
            },
        });

        return NextResponse.json({
            success: true,
            qrCode: {
                id: updatedQrCode.id,
                businessName: updatedQrCode.businessName,
                productSummary: updatedQrCode.productSummary,
            },
        });
    } catch (error) {
        console.error("Error updating QR code:", error);
        return NextResponse.json(
            { error: "Internal server error during update" },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    return handleUpdate(request);
}

export async function POST(request: NextRequest) {
    return handleUpdate(request);
}
