import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';
import { signToken, setAuthCookie } from '@/lib/auth.js';
import { checkRateLimit, resetRateLimit, getClientIp } from '@/lib/rateLimit.js';

export async function POST(request) {
  // ── Rate limiting ──────────────────────────────────────────
  const ip = getClientIp(request);
  const rl = checkRateLimit(`login:${ip}`);
  if (rl.limited) {
    const retryAfterSec = Math.ceil(rl.retryAfterMs / 1000);
    return NextResponse.json(
      { success: false, error: `Terlalu banyak percobaan login. Coba lagi dalam ${retryAfterSec} detik.` },
      { status: 429, headers: { 'Retry-After': String(retryAfterSec) } }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { username, password } = body;

    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ success: false, error: 'Username dan password wajib diisi.' }, { status: 400 });
    }

    // Sanitize: max 100 chars each
    const cleanUsername = username.trim().toLowerCase().substring(0, 100);
    const cleanPassword = password.substring(0, 200);

    const admin = await prisma.adminUser.findUnique({
      where: { username: cleanUsername },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Username atau password yang Anda masukkan salah.' },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(cleanPassword, admin.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Username atau password yang Anda masukkan salah.' },
        { status: 401 }
      );
    }

    // ── Successful login ──────────────────────────────────────
    resetRateLimit(`login:${ip}`);

    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    const userData = {
      username: admin.username,
      fullName: admin.fullName,
      role:     admin.role === 'admin' ? 'Super Administrator' : admin.role,
    };

    const token = await signToken(userData);
    const response = NextResponse.json({ success: true, token, user: userData });
    setAuthCookie(response, token, request);
    return response;
  } catch (error) {
    console.error('API Error /api/admin/auth/login:', error);
    return NextResponse.json({ success: false, error: 'Authentication failed' }, { status: 500 });
  }
}
