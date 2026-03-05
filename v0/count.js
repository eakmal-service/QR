const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const qrCodes = await prisma.qRCode.findMany();
  
  let totalItems = 0;
  const categories = new Set();
  const categoryCounts = {};

  for (const qr of qrCodes) {
      if (qr.menuItems && Array.isArray(qr.menuItems)) {
          for (const item of qr.menuItems) {
              totalItems++;
              let cat = 'Uncategorized';
              
              if (typeof item === 'object' && item.category && item.category.trim()) {
                  cat = item.category.trim();
              } else if (typeof item === 'object' && item.name) {
                  cat = 'Uncategorized (No Category Field)';
              } else if (typeof item === 'string') {
                  cat = 'Legacy String';
              }
              
              categories.add(cat);
              categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
          }
      }
  }

  console.log('=== LOCAL SERVER COUNT ===');
  console.log(`Total Products/Items: ${totalItems}`);
  console.log(`Total Unique Categories: ${categories.size}`);
  console.log('Category Breakdown:', categoryCounts);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
