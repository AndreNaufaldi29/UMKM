import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// Always retain singleton on globalThis to prevent connection leaks across Next.js invocations
globalForPrisma.prisma = prisma;

export default prisma;
