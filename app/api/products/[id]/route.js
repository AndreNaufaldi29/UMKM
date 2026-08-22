import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import fs from 'fs';
import path from 'path';
import { requireAuth } from '@/lib/requireAuth.js';
import { validateProductInput } from '@/lib/validate.js';

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

function parseProductVariants(variantsData) {
  if (!variantsData) return [];
  if (Array.isArray(variantsData)) return variantsData.filter(Boolean);
  if (typeof variantsData === 'string') {
    const trimmed = variantsData.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const arr = JSON.parse(trimmed);
        if (Array.isArray(arr)) return arr.filter(Boolean);
      } catch (e) {}
    }
    return trimmed.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const p = await prisma.product.findUnique({
      where: { id },
      include: { umkm: { include: { category: true } } },
    });

    if (!p) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

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

    return NextResponse.json({
      id: p.id, name: p.name, desc: p.desc, price: p.price,
      unit: p.unit, rating: p.rating, sales: p.sales, views: p.views,
      isFeatured: p.isFeatured, imageUrl: p.imageUrl || '', images: imageList,
      variants: parseProductVariants(p.variants),
      msmeId: p.umkmId,
      msmeName: p.umkm ? p.umkm.name : '',
      cat:    p.umkm && p.umkm.category ? p.umkm.category.name : 'Lainnya',
      status: p.umkm ? p.umkm.status : 'active',
      wa:     p.umkm ? p.umkm.wa : '',
    });
  } catch (error) {
    console.error('API Error GET /api/products/[id]:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  // ── Auth guard ────────────────────────────────────────────
  const auth = await requireAuth(request);
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'ID produk tidak valid.' }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const { valid, errors, sanitized } = validateProductInput(body);

    if (!valid) {
      return NextResponse.json({ error: errors.join(' '), details: errors }, { status: 422 });
    }

    const { name, desc, price, unit, rating, sales, views, isFeatured, images, imageUrl, variants } = sanitized;

    let updateData = {
      ...(name !== undefined       && { name }),
      ...(desc !== undefined       && { desc }),
      ...(price !== undefined      && { price }),
      ...(unit                     && { unit }),
      ...(rating !== undefined     && { rating }),
      ...(sales !== undefined      && { sales }),
      ...(views !== undefined      && { views }),
      ...(isFeatured !== undefined && { isFeatured }),
      ...(variants !== undefined   && { variants: variants && variants.length > 0 ? JSON.stringify(variants) : null }),
    };

    if (images !== undefined || imageUrl !== undefined) {
      updateData.imageUrl = processProductImages(images, imageUrl);
    }

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { umkm: { include: { category: true } } },
    });

    let imageList = [];
    if (updated.imageUrl) {
      const trimmed = updated.imageUrl.trim();
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        try { imageList = JSON.parse(trimmed); } catch (e) {}
      }
      if (imageList.length === 0) {
        imageList = trimmed.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }

    return NextResponse.json({
      id: updated.id, name: updated.name, desc: updated.desc,
      price: updated.price, unit: updated.unit, rating: updated.rating,
      sales: updated.sales, views: updated.views, isFeatured: updated.isFeatured,
      imageUrl: updated.imageUrl || '', images: imageList,
      variants: parseProductVariants(updated.variants),
      msmeId: updated.umkmId,
      msmeName: updated.umkm ? updated.umkm.name : '',
      cat:    updated.umkm && updated.umkm.category ? updated.umkm.category.name : 'Lainnya',
      status: updated.umkm ? updated.umkm.status : 'active',
      wa:     updated.umkm ? updated.umkm.wa : '',
    });
  } catch (error) {
    console.error('API Error PUT /api/products/[id]:', error);
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  // ── Auth guard ────────────────────────────────────────────
  const auth = await requireAuth(request);
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'ID produk tidak valid.' }, { status: 400 });
    }

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('API Error DELETE /api/products/[id]:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete product' }, { status: 500 });
  }
}