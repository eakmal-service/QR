const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.qRCode.update({
    where: { id: 'ruby-online-store' },
    data: { businessName: 'Ruby Store' }
  });
  console.log('Successfully updated businessName to Ruby Store!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
