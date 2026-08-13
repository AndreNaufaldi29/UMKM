import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const reviewId = parseInt(id, 10);
    const body = await request.json();
    const { status, name, role, quote, rating } = body;

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: {
        ...(status && { status }),
        ...(name && { name }),
        ...(role && { role }),
        ...(quote && { quote }),
        ...(rating !== undefined && { rating: parseInt(rating, 10) })
      }
    });

    const formatted = {
      id: updated.id,
      name: updated.name,
      role: updated.role,
      avatar: updated.avatar,
      quote: updated.quote,
      msmeId: updated.umkmId,
      productId: updated.productId,
      productName: updated.productName,
      rating: updated.rating,
      status: updated.status,
      date: updated.createdAt.toISOString().split('T')[0]
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('API Error PATCH /api/admin/reviews/[id]:', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const reviewId = parseInt(id, 10);
    await prisma.review.delete({ where: { id: reviewId } });
    return NextResponse.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    console.error('API Error DELETE /api/admin/reviews/[id]:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
