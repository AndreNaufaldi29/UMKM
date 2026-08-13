import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where = {};
    if (status) {
      where.status = status;
    }

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    const formatted = reviews.map((r) => ({
      id: r.id,
      name: r.name,
      role: r.role,
      avatar: r.avatar || r.name.substring(0, 2).toUpperCase(),
      quote: r.quote,
      msmeId: r.umkmId,
      productId: r.productId,
      productName: r.productName || 'Produk UMKM',
      rating: r.rating,
      status: r.status,
      date: r.createdAt.toISOString().split('T')[0]
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('API Error GET /api/reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, role, quote, msmeId, productId, productName, rating } = body;

    const nameStr = name || 'Pengunjung';
    const initials = nameStr.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() || 'UM';

    const created = await prisma.review.create({
      data: {
        name: nameStr,
        role: role || 'Pembeli Terverifikasi',
        avatar: initials,
        quote,
        rating: parseInt(rating, 10) || 5,
        status: 'pending',
        umkmId: msmeId ? parseInt(msmeId, 10) : null,
        productId: productId || null,
        productName: productName || 'Produk UMKM'
      }
    });

    const formatted = {
      id: created.id,
      name: created.name,
      role: created.role,
      avatar: created.avatar,
      quote: created.quote,
      msmeId: created.umkmId,
      productId: created.productId,
      productName: created.productName,
      rating: created.rating,
      status: created.status,
      date: created.createdAt.toISOString().split('T')[0]
    };

    return NextResponse.json(formatted, { status: 201 });
  } catch (error) {
    console.error('API Error POST /api/reviews:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
