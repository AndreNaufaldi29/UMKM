import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const MIME_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

export async function GET(request, { params }) {
  try {
    const { filename } = await params;
    if (!filename) {
      return new NextResponse('Filename missing', { status: 400 });
    }

    const safeFileName = path.basename(filename);
    const filePath = path.join(process.cwd(), 'public', 'uploads', safeFileName);

    if (!fs.existsSync(filePath)) {
      return new NextResponse('Image Not Found', { status: 404 });
    }

    const ext = path.extname(safeFileName).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, must-revalidate'
      }
    });
  } catch (error) {
    console.error('Error serving upload image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
