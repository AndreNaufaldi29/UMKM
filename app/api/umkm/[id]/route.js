import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function saveBase64Image(dataUrl) {
  if (!dataUrl || !dataUrl.startsWith('data:image/')) {
    return dataUrl || '';
  }

  try {
    const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
    if (!matches) return dataUrl;

    const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    const base64Data = matches[2];
    const fileName = `banner_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

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
        try {
          imageList = JSON.parse(trimmed);
        } catch (e) {}
      }
      if (imageList.length === 0) {
        imageList = trimmed.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }
    return {
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
      images: imageList
    };
  });
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const umkmId = parseInt(id, 10);

    const u = await prisma.umkm.findUnique({
      where: { id: umkmId },
      include: {
        category: true,
        dusun: true,
        certifications: true,
        products: true,
        reviews: true
      }
    });

    if (!u) {
      return NextResponse.json({ error: 'UMKM not found' }, { status: 404 });
    }

    const formatted = {
      id: u.id,
      name: u.name,
      owner: u.owner,
      cat: u.category ? u.category.name : 'Lainnya',
      dusun: u.dusun ? u.dusun.name : 'Desa',
      est: u.est,
      status: u.status,
      addr: u.addr,
      hours: u.hours,
      desc: u.desc,
      history: u.history || '',
      latitude: u.latitude ?? null,
      longitude: u.longitude ?? null,
      imageUrl: u.imageUrl || '',
      wa: u.wa,
      phone: u.phone,
      email: u.email,
      web: u.web,
      fb: u.fb,
      ig: u.ig,
      tiktok: u.tiktok,
      certs: u.certifications.map((c) => c.certName),
      products: formatProductList(u.products || []),
      reviews: u.reviews
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('API Error GET /api/umkm/[id]:', error);
    return NextResponse.json({ error: 'Failed to fetch UMKM detail' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const umkmId = parseInt(id, 10);
    const body = await request.json();

    const { name, owner, cat, dusun, est, status, addr, hours, desc, history, latitude, longitude, imageUrl, wa, phone, email, web, fb, ig, tiktok, certs } = body;

    let categoryObj = cat
      ? await prisma.category.upsert({
          where: { name: cat },
          update: {},
          create: { name: cat, slug: cat.toLowerCase().replace(/[^a-z0-9]+/g, '-') }
        })
      : null;

    let dusunObj = dusun
      ? await prisma.dusun.upsert({
          where: { name: dusun },
          update: {},
          create: { name: dusun }
        })
      : null;

    const dataToUpdate = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (owner !== undefined) dataToUpdate.owner = owner;
    if (categoryObj) dataToUpdate.categoryId = categoryObj.id;
    if (dusunObj) dataToUpdate.dusunId = dusunObj.id;
    if (est !== undefined) dataToUpdate.est = parseInt(est, 10) || new Date().getFullYear();
    if (status !== undefined) dataToUpdate.status = status;
    if (addr !== undefined) dataToUpdate.addr = addr;
    if (hours !== undefined) dataToUpdate.hours = hours;
    if (desc !== undefined) dataToUpdate.desc = desc;
    if (history !== undefined) dataToUpdate.history = history;
    if (latitude !== undefined) dataToUpdate.latitude = latitude ? parseFloat(latitude) : null;
    if (longitude !== undefined) dataToUpdate.longitude = longitude ? parseFloat(longitude) : null;
    if (imageUrl !== undefined) dataToUpdate.imageUrl = saveBase64Image(imageUrl);
    if (wa !== undefined) dataToUpdate.wa = wa;
    if (phone !== undefined) dataToUpdate.phone = phone;
    if (email !== undefined) dataToUpdate.email = email;
    if (web !== undefined) dataToUpdate.web = web;
    if (fb !== undefined) dataToUpdate.fb = fb;
    if (ig !== undefined) dataToUpdate.ig = ig;
    if (tiktok !== undefined) dataToUpdate.tiktok = tiktok;

    if (certs !== undefined) {
      const certList = typeof certs === 'string' ? certs.split('\n').filter(Boolean) : (Array.isArray(certs) ? certs : []);
      await prisma.certification.deleteMany({ where: { umkmId } });
      await prisma.certification.createMany({
        data: certList.map((c) => ({ umkmId, certName: c }))
      });
    }

    const updated = await prisma.umkm.update({
      where: { id: umkmId },
      data: dataToUpdate,
      include: {
        category: true,
        dusun: true,
        certifications: true,
        products: true
      }
    });

    const formatted = {
      id: updated.id,
      name: updated.name,
      owner: updated.owner,
      cat: updated.category ? updated.category.name : 'Lainnya',
      dusun: updated.dusun ? updated.dusun.name : 'Desa',
      est: updated.est,
      status: updated.status,
      addr: updated.addr,
      hours: updated.hours,
      desc: updated.desc,
      history: updated.history || '',
      latitude: updated.latitude ?? null,
      longitude: updated.longitude ?? null,
      imageUrl: updated.imageUrl || '',
      wa: updated.wa,
      phone: updated.phone,
      email: updated.email,
      web: updated.web,
      fb: updated.fb,
      ig: updated.ig,
      tiktok: updated.tiktok,
      certs: updated.certifications.map((c) => c.certName),
      products: formatProductList(updated.products || [])
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('API Error PUT /api/umkm/[id]:', error);
    return NextResponse.json({ error: error.message || 'Failed to update UMKM' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const umkmId = parseInt(id, 10);

    await prisma.umkm.delete({
      where: { id: umkmId }
    });

    return NextResponse.json({ message: 'UMKM deleted successfully', id: umkmId });
  } catch (error) {
    console.error('API Error DELETE /api/umkm/[id]:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete UMKM' }, { status: 500 });
  }
}