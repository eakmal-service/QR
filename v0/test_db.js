const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();
prisma.qRCode.findUnique({where: {id: "qr-VU94MVcLYm"}}).then(qr => {
    console.log(typeof qr.menuItems, JSON.stringify(qr.menuItems).substring(0, 500));
    prisma.$disconnect();
});
