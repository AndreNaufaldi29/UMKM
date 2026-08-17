import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import fs from 'fs';
import path from 'path';
import { requireAuth } from '@/lib/requireAuth.js';
import { validateUmkmInput } from '@/lib/validate.js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function saveBase64Image(dataUrl) {
  if (!dataUrl || !dataUrl.startsWith('data:image/')) return dataUrl || '';
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

function formatUmkm(u, catFallback = 'Lainnya') {
  return {
    id: u.id, name: u.name, owner: u.owner,
    cat: u.category ? u.category.name : catFallback,
    est: u.est, status: u.status, addr: u.addr, hours: u.hours,
    desc: u.desc, history: u.history || '',
    latitude: u.latitude ?? null, longitude: u.longitude ?? null,
    imageUrl: u.imageUrl || '',
    wa: u.wa, phone: u.phone, email: u.email,
    web: u.web, fb: u.fb, ig: u.ig, tiktok: u.tiktok,
    certs: u.certifications.map((c) => c.certName),
    products: formatProductList(u.products || []),
  };
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const umkmId = parseInt(id, 10);

    if (isNaN(umkmId) || umkmId <= 0) {
      return NextResponse.json({ error: 'ID UMKM tidak valid.' }, { status: 400 });
    }

    const u = await prisma.umkm.findUnique({
      where: { id: umkmId },
      include: { category: true, certifications: true, products: true },
    });

    if (!u) return NextResponse.json({ error: 'UMKM not found' }, { status: 404 });

    return NextResponse.json(formatUmkm(u));
  } catch (error) {
    console.error('API Error GET /api/umkm/[id]:', error);
    return NextResponse.json({ error: 'Failed to fetch UMKM detail' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  // ── Auth guard ────────────────────────────────────────────
  const auth = await requireAuth(request);
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    const umkmId = parseInt(id, 10);

    if (isNaN(umkmId) || umkmId <= 0) {
      return NextResponse.json({ error: 'ID UMKM tidak valid.' }, { status: 400 });
    }

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

    const dataToUpdate = {};
    if (name !== undefined)      dataToUpdate.name = name;
    if (owner !== undefined)     dataToUpdate.owner = owner;
    if (categoryObj)             dataToUpdate.categoryId = categoryObj.id;
    if (est !== undefined)       dataToUpdate.est = est;
    if (status !== undefined)    dataToUpdate.status = status;
    if (addr !== undefined)      dataToUpdate.addr = addr;
    if (hours !== undefined)     dataToUpdate.hours = hours;
    if (desc !== undefined)      dataToUpdate.desc = desc;
    if (history !== undefined)   dataToUpdate.history = history;
    if (latitude !== undefined)  dataToUpdate.latitude = latitude;
    if (longitude !== undefined) dataToUpdate.longitude = longitude;
    if (imageUrl !== undefined)  dataToUpdate.imageUrl = saveBase64Image(imageUrl);
    if (wa !== undefined)        dataToUpdate.wa = wa;
    if (phone !== undefined)     dataToUpdate.phone = phone;
    if (email !== undefined)     dataToUpdate.email = email;
    if (web !== undefined)       dataToUpdate.web = web;
    if (fb !== undefined)        dataToUpdate.fb = fb;
    if (ig !== undefined)        dataToUpdate.ig = ig;
    if (tiktok !== undefined)    dataToUpdate.tiktok = tiktok;

    if (certs !== undefined) {
      await prisma.certification.deleteMany({ where: { umkmId } });
      await prisma.certification.createMany({
        data: certs.map((c) => ({ umkmId, certName: c })),
      });
    }

    const updated = await prisma.umkm.update({
      where: { id: umkmId },
      data: dataToUpdate,
      include: { category: true, certifications: true, products: true },
    });

    return NextResponse.json(formatUmkm(updated));
  } catch (error) {
    console.error('API Error PUT /api/umkm/[id]:', error);
    return NextResponse.json({ error: error.message || 'Failed to update UMKM' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  // ── Auth guard ────────────────────────────────────────────
  const auth = await requireAuth(request);
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    const umkmId = parseInt(id, 10);

    if (isNaN(umkmId) || umkmId <= 0) {
      return NextResponse.json({ error: 'ID UMKM tidak valid.' }, { status: 400 });
    }

    await prisma.umkm.delete({ where: { id: umkmId } });
    return NextResponse.json({ message: 'UMKM deleted successfully', id: umkmId });
  } catch (error) {
    console.error('API Error DELETE /api/umkm/[id]:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete UMKM' }, { status: 500 });
  }
}
