import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';
import { requireAuth } from '@/lib/requireAuth.js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Seed data kategori default
const DEFAULT_CATEGORIES = [
  { name: 'Kuliner',   slug: 'kuliner',   description: 'Usaha bidang makanan dan minuman khas desa' },
  { name: 'Kerajinan', slug: 'kerajinan', description: 'Kerajinan tangan, batik, dan karya seni tradisional' },
  { name: 'Fashion',   slug: 'fashion',   description: 'Pakaian, konveksi, dan aksesoris' },
  { name: 'Pertanian', slug: 'pertanian', description: 'Hasil tani, peternakan, madu, dan olahan perkebunan' },
  { name: 'Jasa',      slug: 'jasa',      description: 'Layanan jasa bengkel, perbaikan, dan keahlian lokal' },
];

export async function POST(request) {
  // ── Auth guard ────────────────────────────────────────────
  const auth = await requireAuth(request);
  if (!auth.authorized) return auth.response;

  try {
    const deletedProducts = await prisma.product.deleteMany({});
    const deletedCerts    = await prisma.certification.deleteMany({});
    const deletedUmkm     = await prisma.umkm.deleteMany({});

    try {
      await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"Umkm"', 'id'), 1, false);`);
      await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"Category"', 'id'), 1, false);`);
      await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"Certification"', 'id'), 1, false);`);
    } catch (seqErr) {
      console.warn('Sequence reset non-fatal warning:', seqErr.message);
    }

    for (const cat of DEFAULT_CATEGORIES) {
      await prisma.category.upsert({
        where:  { name: cat.name },
        update: { slug: cat.slug, description: cat.description },
        create: cat,
      });
    }

    const passwordHash = await bcrypt.hash('admin123', 10);
    await prisma.adminUser.upsert({
      where:  { username: 'admin' },
      update: { passwordHash, fullName: 'Super Administrator' },
      create: { username: 'admin', passwordHash, fullName: 'Super Administrator', role: 'admin' },
    });

    console.log(`[RESET] ✅ Done — deleted: ${deletedUmkm.count} UMKM, ${deletedProducts.count} produk, ${deletedCerts.count} sertifikasi`);

    return NextResponse.json({
      success: true,
      message: 'Database berhasil direset ke data awal. Semua data UMKM dan produk telah dihapus.',
      deleted: {
        umkm:          deletedUmkm.count,
        products:      deletedProducts.count,
        certifications: deletedCerts.count,
      },
    });
  } catch (error) {
    console.error('[RESET] ❌ Error:', error);
    return NextResponse.json(
      { error: 'Gagal mereset database. ' + (error.message || 'Terjadi kesalahan internal.') },
      { status: 500 }
    );
  }
}
