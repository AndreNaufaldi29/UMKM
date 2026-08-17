/**
 * requireAuth — guard for mutating API routes.
 * Returns { authorized: true, payload } or a NextResponse 401.
 */
import { NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from './auth.js';

export async function requireAuth(request) {
  const token = getTokenFromRequest(request);

  if (!token) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Unauthorized: Anda harus login terlebih dahulu.' },
        { status: 401 }
      ),
    };
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Unauthorized: Sesi tidak valid atau telah kedaluwarsa.' },
        { status: 401 }
      ),
    };
  }

  return { authorized: true, payload };
}
