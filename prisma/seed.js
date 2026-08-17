import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const DEFAULT_CATEGORIES = [
  { name: 'Kuliner', slug: 'kuliner', description: 'Usaha bidang makanan dan minuman khas desa' },
  { name: 'Kerajinan', slug: 'kerajinan', description: 'Kerajinan tangan, batik, dan karya seni tradisional' },
  { name: 'Fashion', slug: 'fashion', description: 'Pakaian, konveksi, dan aksesoris' },
  { name: 'Pertanian', slug: 'pertanian', description: 'Hasil tani, peternakan, madu, dan olahan perkebunan' },
  { name: 'Jasa', slug: 'jasa', description: 'Layanan jasa bengkel, perbaikan, dan keahlian lokal' },
];

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Seed Categories
  for (const cat of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: cat,
      create: cat,
    });
  }
  console.log('✅ Categories seeded');

  // 2. Seed Default Admin User
  const passwordHash = await bcrypt.hash('kedungsumur2026#', 10);
  await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: {
      passwordHash,
      fullName: 'Super Administrator',
    },
    create: {
      username: 'admin',
      passwordHash,
      fullName: 'Super Administrator',
      role: 'admin',
    },
  });
  console.log('✅ Admin user seeded (admin / kedungsumur2026#)');

  // 3. Reset PostgreSQL auto-increment sequence counters
  try {
    await prisma.$executeRawUnsafe(
      `SELECT setval(pg_get_serial_sequence('"Umkm"', 'id'), 1, false);`
    );
    await prisma.$executeRawUnsafe(
      `SELECT setval(pg_get_serial_sequence('"Category"', 'id'), coalesce((SELECT max(id) FROM "Category"), 1));`
    );
    await prisma.$executeRawUnsafe(
      `SELECT setval(pg_get_serial_sequence('"Certification"', 'id'), 1, false);`
    );
    console.log('✅ PostgreSQL auto-increment sequences synced');
  } catch (seqError) {
    console.warn('⚠️ Sequence reset warning (non-fatal):', seqError.message);
  }

  console.log('🎉 Seeding completed successfully (clean database)!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
