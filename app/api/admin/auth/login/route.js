import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Username and password are required' }, { status: 400 });
    }

    const admin = await prisma.adminUser.findUnique({
      where: { username: username.trim().toLowerCase() }
    });

    if (!admin) {
      return NextResponse.json({ success: false, error: 'Username atau password yang Anda masukkan salah.' }, { status: 401 });
    }

    const isValidPassword = await bcrypt.compare(password, admin.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json({ success: false, error: 'Username atau password yang Anda masukkan salah.' }, { status: 401 });
    }

    // Update last login
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() }
    });

    const userData = {
      username: admin.username,
      fullName: admin.fullName,
      role: admin.role === 'admin' ? 'Super Administrator' : admin.role,
      loginTime: new Date().toISOString()
    };

    return NextResponse.json({ success: true, user: userData });
  } catch (error) {
    console.error('API Error /api/admin/auth/login:', error);
    return NextResponse.json({ success: false, error: 'Authentication failed' }, { status: 500 });
  }
}
