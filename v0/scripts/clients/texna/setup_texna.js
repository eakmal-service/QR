const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const exists = await prisma.qRCode.findUnique({ where: { id: 'qr-TEXNA1234' } });
  if (!exists) {
    await prisma.qRCode.create({
      data: {
        id: 'qr-TEXNA1234',
        businessId: 'texna-01',
        businessName: 'Texna',
        businessCategory: 'B2B Textile Machinery Manufacturing',
        businessType: 'B2B',
        productSummary: 'Jacquard Harness Systems & Parts, 35+ years experience',
        description: 'Main Hub Surat, Gujarat. Leading manufacturer of Jacquard Harness Systems and Parts.',
        location: 'Main Hub Surat, Gujarat',
        googleMapsLink: 'https://g.page/r/CYUrchqVT9iXEAE/review',
        menuItems: JSON.stringify([
          { name: 'Jacquard Harness Systems', category: 'Products' },
          { name: 'Jacquard Accessories', category: 'Products' },
          { name: 'Textile Machinery Parts', category: 'Products' },
          { name: 'Maintenance & Repair', category: 'Services' },
          { name: 'Consultation & Support', category: 'Services' }
        ]),
        isActive: true
      }
    });
    console.log('Successfully created Texna QR Code on remote DB!');
  } else {
    await prisma.qRCode.update({
      where: { id: 'qr-TEXNA1234' },
      data: {
        googleMapsLink: 'https://g.page/r/CYUrchqVT9iXEAE/review'
      }
    });
    console.log('Texna QR Code already exists. Updated googleMapsLink remotely.');
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
