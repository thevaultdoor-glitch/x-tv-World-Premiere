import { PrismaClient } from '@prisma/client';

// This prevents Prisma Client from being initialized multiple times in development
// due to Next.js's hot reloading.
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

export default prisma;
