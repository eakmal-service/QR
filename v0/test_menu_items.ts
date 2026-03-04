import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const qr = await prisma.qRCode.findUnique({ where: { id: "qr-VU94MVcLYm" } })
  console.log(qr?.menuItems)
}
main()
