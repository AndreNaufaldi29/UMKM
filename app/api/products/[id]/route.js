import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function saveBase64Image(dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
    return dataUrl || '';
  }

  try {
    const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
    if (!matches) return dataUrl;

    const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    const base64Data = matches[2];
    const fileName = `product_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

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
        try {
          imagesArray = JSON.parse(trimmed);
        } catch (e) {}
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

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, desc, price, unit, rating, sales, views, isFeatured, imageUrl, images } = body;

    let updateData = {
      ...(name && { name }),
      ...(desc !== undefined && { desc }),
      ...(price !== undefined && { price: parseFloat(price) }),
      ...(unit && { unit }),
      ...(rating !== undefined && { rating: parseFloat(rating) }),
      ...(sales !== undefined && { sales: parseInt(sales, 10) }),
      ...(views !== undefined && { views: parseInt(views, 10) }),
      ...(isFeatured !== undefined && { isFeatured: !!isFeatured })
    };

    if (images !== undefined || imageUrl !== undefined) {
      updateData.imageUrl = processProductImages(images, imageUrl);
    }

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        umkm: {
          include: {
            category: true,
            dusun: true
          }
        }
      }
    });

    let imageList = [];
    if (updated.imageUrl) {
      const trimmed = updated.imageUrl.trim();
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        try {
          imageList = JSON.parse(trimmed);
        } catch (e) {}
      }
      if (imageList.length === 0) {
        imageList = trimmed.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }

    const formatted = {
      id: updated.id,
      name: updated.name,
      desc: updated.desc,
      price: updated.price,
      unit: updated.unit,
      rating: updated.rating,
      sales: updated.sales,
      views: updated.views,
      isFeatured: updated.isFeatured,
      imageUrl: updated.imageUrl || '',
      images: imageList,
      msmeId: updated.umkmId,
      msmeName: updated.umkm ? updated.umkm.name : '',
      cat: updated.umkm && updated.umkm.category ? updated.umkm.category.name : 'Lainnya',
      dusun: updated.umkm && updated.umkm.dusun ? updated.umkm.dusun.name : 'Desa',
      status: updated.umkm ? updated.umkm.status : 'active',
      wa: updated.umkm ? updated.umkm.wa : ''
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('API Error PUT /api/products/[id]:', error);
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('API Error DELETE /api/products/[id]:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete product' }, { status: 500 });
  }
}