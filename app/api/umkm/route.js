import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import fs from 'fs';
import path from 'path';
import { requireAuth } from '@/lib/requireAuth.js';
import { validateUmkmInput, sanitizeQueryParam } from '@/lib/validate.js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function saveBase64Image(dataUrl) {
  if (!dataUrl || !dataUrl.startsWith('data:image/')) {
    return dataUrl || '';
  }
  try {
    const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/s);
    if (!matches) return dataUrl;
    const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    const base64Data = matches[2];
    const fileName = `banner_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    fs.writeFileSync(path.join(uploadDir, fileName), Buffer.from(base64Data, 'base64'));
    return `/uploads/${fileName}`;
  } catch (error) {
    console.error('Error saving uploaded image:', error);
    return dataUrl;
  }
}

function formatProductList(products = []) {
  return products.map((p) => {
    let imageList = [];
    if (p.imageUrl) {
      const trimmed = p.imageUrl.trim();
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        try { imageList = JSON.parse(trimmed); } catch (e) {}
      }
      if (imageList.length === 0) {
        imageList = trimmed.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }
    return {
      id: p.id, name: p.name, desc: p.desc, price: p.price,
      unit: p.unit, rating: p.rating, sales: p.sales, views: p.views,
      isFeatured: p.isFeatured, imageUrl: p.imageUrl || '', images: imageList,
    };
  });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    // Sanitize query parameters
    const category = sanitizeQueryParam(searchParams.get('category') || '');
    const search   = sanitizeQueryParam(searchParams.get('search') || '');

    const where = {};
    if (category && category !== 'Semua') where.category = { name: category };
    if (search) {
      where.OR = [
        { name:  { contains: search } },
        { owner: { contains: search } },
        { desc:  { contains: search } },
      ];
    }

    const umkms = await prisma.umkm.findMany({
      where,
      include: { category: true, certifications: true, products: true },
      orderBy: { id: 'asc' },
    });

    const formatted = umkms.map((u) => ({
      id: u.id, name: u.name, owner: u.owner,
      cat: u.category ? u.category.name : 'Lainnya',
      est: u.est, status: u.status, addr: u.addr, hours: u.hours,
      desc: u.desc, history: u.history || '',
      latitude: u.latitude ?? null, longitude: u.longitude ?? null,
      imageUrl: u.imageUrl || '',
      wa: u.wa, phone: u.phone, email: u.email, web: u.web,
      fb: u.fb, ig: u.ig, tiktok: u.tiktok,
      certs: u.certifications.map((c) => c.certName),
      products: formatProductList(u.products || []),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('API Error /api/umkm:', error);
    return NextResponse.json({ error: 'Failed to fetch UMKMs' }, { status: 500 });
  }
}

export async function POST(request) {
  // ── Auth guard ────────────────────────────────────────────
  const auth = await requireAuth(request);
  if (!auth.authorized) return auth.response;

  try {
    const body = await request.json().catch(() => ({}));
    const { valid, errors, sanitized } = validateUmkmInput(body);

    if (!valid) {
      return NextResponse.json({ error: errors.join(' '), details: errors }, { status: 422 });
    }

    const { name, owner, cat, est, status, addr, hours, desc, history,
            latitude, longitude, imageUrl, wa, phone, email, web, fb, ig, tiktok, certs } = sanitized;

    let categoryObj = cat
      ? await prisma.category.upsert({
          where:  { name: cat },
          update: {},
          create: { name: cat, slug: cat.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
        })
      : null;

    const savedImagePath = saveBase64Image(imageUrl);

    const newUmkm = await prisma.umkm.create({
      data: {
        name:       name || 'UMKM Baru',
        owner:      owner || 'Pemilik UMKM',
        categoryId: categoryObj ? categoryObj.id : null,
        est,
        status,
        addr:       addr || 'Desa Kedungsumur',
        hours:      hours || '08:00 - 17:00',
        desc:       desc || 'Deskripsi UMKM',
        history:    history || '',
        latitude, longitude,
        imageUrl:   savedImagePath,
        wa, phone, email, web, fb, ig, tiktok,
        certifications: { create: certs.map((c) => ({ certName: c })) },
      },
      include: { category: true, certifications: true, products: true },
    });

    const formatted = {
      id: newUmkm.id, name: newUmkm.name, owner: newUmkm.owner,
      cat: newUmkm.category ? newUmkm.category.name : (cat || 'Lainnya'),
      est: newUmkm.est, status: newUmkm.status, addr: newUmkm.addr,
      hours: newUmkm.hours, desc: newUmkm.desc, history: newUmkm.history || '',
      latitude: newUmkm.latitude ?? null, longitude: newUmkm.longitude ?? null,
      imageUrl: newUmkm.imageUrl || '',
      wa: newUmkm.wa, phone: newUmkm.phone, email: newUmkm.email,
      web: newUmkm.web, fb: newUmkm.fb, ig: newUmkm.ig, tiktok: newUmkm.tiktok,
      certs: newUmkm.certifications.map((c) => c.certName),
      products: formatProductList(newUmkm.products || []),
    };

    return NextResponse.json(formatted, { status: 201 });
  } catch (error) {
    console.error('API Error POST /api/umkm:', error);
    return NextResponse.json({ error: error.message || 'Failed to create UMKM' }, { status: 500 });
  }
}
