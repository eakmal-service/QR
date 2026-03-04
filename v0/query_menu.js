const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const data = await prisma.qRCode.findUnique({ where: { id: "qr-VU94MVcLYm" } });
  console.log(JSON.stringify(JSON.parse(data.menuItems), null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
