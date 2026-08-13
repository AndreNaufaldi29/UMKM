import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const updated = await prisma.product.update({
      where: { id },
      data: {
        views: { increment: 1 }
      }
    });

    return NextResponse.json({ success: true, views: updated.views });
  } catch (error) {
    console.error('API Error POST /api/products/[id]/view:', error);
    return NextResponse.json({ error: 'Failed to increment view counter' }, { status: 500 });
  }
}
