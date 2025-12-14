import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Create sample QR codes
    const qr1 = await prisma.qRCode.create({
        data: {
            id: 'test-qr-1',
            businessId: 'business-1',
            businessName: 'The Coffee House',
            productSummary: 'Premium coffee and pastries',
            metadata: JSON.stringify({ location: 'Downtown' }),
        },
    });

    const qr2 = await prisma.qRCode.create({
        data: {
            id: 'test-qr-2',
            businessId: 'business-2',
            businessName: 'Tech Repair Shop',
            productSummary: 'Fast and reliable phone and laptop repair services',
            metadata: JSON.stringify({ location: 'Tech District' }),
        },
    });

    const qr3 = await prisma.qRCode.create({
        data: {
            id: 'test-qr-3',
            businessId: 'business-3',
            businessName: 'Yoga Studio',
            productSummary: 'Peaceful yoga classes for all levels',
            metadata: JSON.stringify({ location: 'Wellness Center' }),
        },
    });

    console.log('✅ Created sample QR codes:', { qr1, qr2, qr3 });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
