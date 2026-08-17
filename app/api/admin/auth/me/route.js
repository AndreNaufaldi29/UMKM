import { NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth.js';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const token = getTokenFromRequest(request);
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      username: payload.username,
      fullName: payload.fullName,
      role:     payload.role,
    },
  });
}
