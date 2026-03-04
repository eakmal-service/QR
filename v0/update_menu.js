const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const rawText = `VANILLA
90
DRY COCONUT KAJU
90
NUTTY BISCOFE
90
SHAHI GULAB
90
KAJU OREO
90
GULABI MASTI
90
KESAR ELAICHI
90
CHOCO BROWNI
90
SP. DRY FRUIT
90
BLACK CURRANT
90
CHOCO NUTS
90
PINEAPPLE KAJU
90
REAL MANGO
90
CHIKI KAJU
90
KIT KAT
90
ANJEER
90
NUTTY NUTELLA
90
BADAM PISTA
90
PINEAPPLE FRESH
90
AKHROT ANJEER
90
SP. KAJU DRAKSH
90
STRAWBERRY
90
KAJU STRAWBERRY
90
SP. KAJU ANJEER
90
CHIKOO
90
CARAMEL WALNUTS
90
SP. KAJU GULKAND
90
CHOCOLATE
90
KAJU AKHROT
90
SP. KAJU
90
OREO
90
RAJBHOJ
90
KAJU BADAM
90
STRAWBERRY OREO
90
BADAM CHOCOLATE
90
CHIKOO KAJU
90
CRUNCHY DELIGHT
90
KAJU CHOCOLATE
90
MIX DRY FRUIT
90
CHIKOO CHOCOLATE
90
FRESH SITAFAL (SEASONAL)
90
KESAR KAJU BADAM PISTA
90
BUTTER SCOTCH
90
ROASTED ALMOND
90
KAJU MANGO
90
CHOCO CHIPS
90
ROASTED ALMOND CHOCOLATE
90
CHOLLATE OREO
90
BROWNI
90
ROASTED ALMOND ANJEER
90
BISCOFF
90
NUTTLLA
90
RICH ALMOND
90
JAMBU
90`;

const lines = rawText.split('\n').map(l => l.trim()).filter(l => l);
const items = [];
for (let i = 0; i < lines.length; i += 2) {
    items.push({
        category: "THICKSHAKE",
        name: lines[i],
        price: parseInt(lines[i+1], 10)
    });
}

prisma.qRCode.update({
    where: { id: "qr-VU94MVcLYm" },
    data: { menuItems: JSON.stringify(items) }
}).then(() => {
    console.log("Updated DB successfully");
    prisma.$disconnect();
}).catch(err => {
    console.error(err);
    prisma.$disconnect();
});
