import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST() {
  try {
    await execAsync('npx prisma db seed');
    return NextResponse.json({ success: true, message: 'Database reset to default seed data' });
  } catch (error) {
    console.error('API Error /api/reset:', error);
    return NextResponse.json({ error: 'Failed to reset database' }, { status: 500 });
  }
}
