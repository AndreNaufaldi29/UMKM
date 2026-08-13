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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const dusun = searchParams.get('dusun');
    const search = searchParams.get('search');

    const where = {};
    if (category && category !== 'Semua') {
      where.category = { name: category };
    }
    if (dusun && dusun !== 'Semua Dusun') {
      where.dusun = { name: dusun };
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { owner: { contains: search } },
        { desc: { contains: search } }
      ];
    }

    const umkms = await prisma.umkm.findMany({
      where,
      include: {
        category: true,
        dusun: true,
        certifications: true,
        products: true
      },
      orderBy: { id: 'asc' }
    });

    const formatted = umkms.map((u) => ({
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
      products: formatProductList(u.products || [])
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('API Error /api/umkm:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch UMKMs' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
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

    const certList = typeof certs === 'string' ? certs.split('\n').filter(Boolean) : (Array.isArray(certs) ? certs : []);
    const savedImagePath = saveBase64Image(imageUrl);

    const newUmkm = await prisma.umkm.create({
      data: {
        name: name || 'UMKM Baru',
        owner: owner || 'Pemilik UMKM',
        categoryId: categoryObj ? categoryObj.id : null,
        dusunId: dusunObj ? dusunObj.id : null,
        est: parseInt(est, 10) || new Date().getFullYear(),
        status: status || 'active',
        addr: addr || 'Desa Kedungsumur',
        hours: hours || '08:00 - 17:00',
        desc: desc || 'Deskripsi UMKM',
        history: history || '',
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        imageUrl: savedImagePath,
        wa: wa || '',
        phone: phone || '',
        email: email || '',
        web: web || '',
        fb: fb || '',
        ig: ig || '',
        tiktok: tiktok || '',
        certifications: {
          create: certList.map((c) => ({ certName: c }))
        }
      },
      include: {
        category: true,
        dusun: true,
        certifications: true,
        products: true
      }
    });

    const formatted = {
      id: newUmkm.id,
      name: newUmkm.name,
      owner: newUmkm.owner,
      cat: newUmkm.category ? newUmkm.category.name : (cat || 'Lainnya'),
      dusun: newUmkm.dusun ? newUmkm.dusun.name : (dusun || 'Desa'),
      est: newUmkm.est,
      status: newUmkm.status,
      addr: newUmkm.addr,
      hours: newUmkm.hours,
      desc: newUmkm.desc,
      history: newUmkm.history || '',
      latitude: newUmkm.latitude ?? null,
      longitude: newUmkm.longitude ?? null,
      imageUrl: newUmkm.imageUrl || '',
      wa: newUmkm.wa,
      phone: newUmkm.phone,
      email: newUmkm.email,
      web: newUmkm.web,
      fb: newUmkm.fb,
      ig: newUmkm.ig,
      tiktok: newUmkm.tiktok,
      certs: newUmkm.certifications.map((c) => c.certName),
      products: formatProductList(newUmkm.products || [])
    };

    return NextResponse.json(formatted, { status: 201 });
  } catch (error) {
    console.error('API Error POST /api/umkm:', error);
    return NextResponse.json({ error: error.message || 'Failed to create UMKM' }, { status: 500 });
  }
}