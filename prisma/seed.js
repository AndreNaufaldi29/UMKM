import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: 'Kuliner', slug: 'kuliner', description: 'Usaha bidang makanan dan minuman khas desa' },
  { name: 'Kerajinan', slug: 'kerajinan', description: 'Kerajinan tangan, batik, dan karya seni tradisional' },
  { name: 'Fashion', slug: 'fashion', description: 'Pakaian, konveksi, dan aksesoris' },
  { name: 'Pertanian', slug: 'pertanian', description: 'Hasil tani, peternakan, madu, dan olahan perkebunan' },
  { name: 'Jasa', slug: 'jasa', description: 'Layanan jasa bengkel, perbaikan, dan keahlian lokal' }
];

const INITIAL_MSMES = [

];

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Seed Categories
  const categoryMap = {};
  for (const cat of CATEGORIES) {
    const created = await prisma.category.upsert({
      where: { name: cat.name },
      update: cat,
      create: cat
    });
    categoryMap[cat.name] = created.id;
  }
  console.log('✅ Categories seeded');

  // 2. Seed Default Admin User
  const passwordHash = await bcrypt.hash('kedungsumur2026#', 10);
  await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: {
      passwordHash,
      fullName: 'Super Administrator'
    },
    create: {
      username: 'admin',
      passwordHash,
      fullName: 'Super Administrator',
      role: 'admin'
    }
  });
  console.log('✅ Admin user seeded (admin / admin123)');

  // 3. Seed UMKMs & Products
  for (const m of INITIAL_MSMES) {
    const categoryId = categoryMap[m.categoryName];

    const umkmData = {
      name: m.name,
      owner: m.owner,
      categoryId,
      est: m.est,
      status: m.status,
      addr: m.addr,
      hours: m.hours,
      desc: m.desc,
      imageUrl: m.imageUrl || '',
      wa: m.wa,
      phone: m.phone,
      email: m.email,
      web: m.web,
      fb: m.fb,
      ig: m.ig,
      tiktok: m.tiktok
    };

    const createdUmkm = await prisma.umkm.upsert({
      where: { id: m.id },
      update: umkmData,
      create: { id: m.id, ...umkmData }
    });

    // Seed certifications
    await prisma.certification.deleteMany({ where: { umkmId: createdUmkm.id } });
    if (m.certs && m.certs.length > 0) {
      await prisma.certification.createMany({
        data: m.certs.map((c) => ({ umkmId: createdUmkm.id, certName: c }))
      });
    }

    // Seed products
    if (m.products && m.products.length > 0) {
      for (const p of m.products) {
        await prisma.product.upsert({
          where: { id: p.id },
          update: {
            name: p.name,
            desc: p.desc,
            price: p.price,
            unit: p.unit,
            rating: p.rating,
            sales: p.sales,
            views: p.views,
            isFeatured: p.isFeatured,
            imageUrl: p.imageUrl || '',
            umkmId: createdUmkm.id
          },
          create: {
            id: p.id,
            name: p.name,
            desc: p.desc,
            price: p.price,
            unit: p.unit,
            rating: p.rating,
            sales: p.sales,
            views: p.views,
            isFeatured: p.isFeatured,
            imageUrl: p.imageUrl || '',
            umkmId: createdUmkm.id
          }
        });
      }
    }
  }
  console.log('✅ UMKMs & Products seeded');

  // 4. Reset PostgreSQL auto-increment sequence counters
  try {
    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"Umkm"', 'id'), coalesce(max(id), 1)) FROM "Umkm";`);
    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"Category"', 'id'), coalesce(max(id), 1)) FROM "Category";`);
    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"Certification"', 'id'), coalesce(max(id), 1)) FROM "Certification";`);
    console.log('✅ PostgreSQL auto-increment sequences synced');
  } catch (seqError) {
    console.warn('⚠️ Sequence reset warning (non-fatal):', seqError.message);
  }

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });