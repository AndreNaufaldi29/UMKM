import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import fs from 'fs';
import path from 'path';
import { requireAuth } from '@/lib/requireAuth.js';
import { validateProductInput, sanitizeQueryParam } from '@/lib/validate.js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function saveBase64Image(dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
    return dataUrl || '';
  }
  try {
    const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/s);
    if (!matches) return dataUrl;
    const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    const base64Data = matches[2];
    const fileName = `product_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    fs.writeFileSync(path.join(uploadDir, fileName), Buffer.from(base64Data, 'base64'));
    return `/uploads/${fileName}`;
  } catch (error) {
    console.error('Error saving uploaded product image:', error);
    return dataUrl;
  }
}

function processProductImages(imagesData, singleImageUrl) {
  let imagesArray = [];
  if (Array.isArray(imagesData) && imagesData.length > 0) {
    imagesArray = imagesData;
  } else if (singleImageUrl) {
    if (typeof singleImageUrl === 'string') {
      const trimmed = singleImageUrl.trim();
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        try { imagesArray = JSON.parse(trimmed); } catch (e) {}
      }
      if (imagesArray.length === 0) {
        imagesArray = trimmed.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }
  }
  const savedPaths = imagesArray.map((img) => saveBase64Image(img)).filter(Boolean);
  if (savedPaths.length === 0) return '';
  if (savedPaths.length === 1) return savedPaths[0];
  return JSON.stringify(savedPaths);
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = sanitizeQueryParam(searchParams.get('category') || '');
    const featured  = searchParams.get('featured');
    const search    = sanitizeQueryParam(searchParams.get('search') || '');

    const where = {};
    if (featured === 'true') where.isFeatured = true;
    if (category && category !== 'Semua') {
      where.umkm = { ...where.umkm, category: { name: category } };
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { desc: { contains: search } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: { umkm: { include: { category: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = products.map((p) => {
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
        msmeId: p.umkmId,
        msmeName: p.umkm ? p.umkm.name : '',
        cat:    p.umkm && p.umkm.category ? p.umkm.category.name : 'Lainnya',
        status: p.umkm ? p.umkm.status : 'active',
        wa:     p.umkm ? p.umkm.wa : '',
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('API Error GET /api/products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request) {
  // ── Auth guard ────────────────────────────────────────────
  const auth = await requireAuth(request);
  if (!auth.authorized) return auth.response;

  try {
    const body = await request.json().catch(() => ({}));
    const { valid, errors, sanitized } = validateProductInput(body);

    if (!valid) {
      return NextResponse.json({ error: errors.join(' '), details: errors }, { status: 422 });
    }

    const { name, desc, price, unit, rating, sales, views, isFeatured, images, imageUrl, msmeId } = sanitized;

    if (!msmeId) {
      return NextResponse.json({ error: 'msmeId wajib diisi.' }, { status: 422 });
    }

    const targetUmkm = await prisma.umkm.findUnique({ where: { id: msmeId } });
    if (!targetUmkm) {
      return NextResponse.json({ error: 'Target UMKM not found' }, { status: 404 });
    }

    const newProdId     = `p${msmeId}_${Date.now()}`;
    const finalImageUrl = processProductImages(images, imageUrl);

    const created = await prisma.product.create({
      data: {
        id: newProdId,
        umkmId: msmeId,
        name, desc: desc || '', price, unit, rating, sales, views,
        isFeatured, imageUrl: finalImageUrl,
      },
      include: { umkm: { include: { category: true } } },
    });

    let imageList = [];
    if (created.imageUrl) {
      const trimmed = created.imageUrl.trim();
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        try { imageList = JSON.parse(trimmed); } catch (e) {}
      }
      if (imageList.length === 0) {
        imageList = trimmed.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }

    return NextResponse.json({
      id: created.id, name: created.name, desc: created.desc,
      price: created.price, unit: created.unit, rating: created.rating,
      sales: created.sales, views: created.views, isFeatured: created.isFeatured,
      imageUrl: created.imageUrl || '', images: imageList,
      msmeId: created.umkmId,
      msmeName: created.umkm ? created.umkm.name : '',
      cat:    created.umkm && created.umkm.category ? created.umkm.category.name : 'Lainnya',
      status: created.umkm ? created.umkm.status : 'active',
      wa:     created.umkm ? created.umkm.wa : '',
    }, { status: 201 });
  } catch (error) {
    console.error('API Error POST /api/products:', error);
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}
