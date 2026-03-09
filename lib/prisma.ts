import { PrismaClient } from '@prisma/client'

// To fix the "SELECT name FROM pg_timezone_names" latency issue,
// append "?timezone=UTC" or "&timezone=UTC" to your POSTGRES_PRISMA_URL in .env
// Example: postgres://user:pass@host:5432/db?timezone=UTC

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
