const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.qRCode.findUnique({where: {id: "qr-VU94MVcLYm"}}).then(res => { console.log(res.menuItems); prisma.$disconnect(); });
