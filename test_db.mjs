import prisma from ./src/lib/db.js;

async function main() {
  const umkms = await prisma.umkm.findMany({ include: { category: true, products: true } });
  console.log(SUCCESS!
