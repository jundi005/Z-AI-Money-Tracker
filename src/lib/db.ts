import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Check if DATABASE_URL is available
const hasDatabase = !!process.env.DATABASE_URL

export const db = hasDatabase 
  ? (globalForPrisma.prisma ?? new PrismaClient({
      log: ['query'],
    }))
  : null

if (process.env.NODE_ENV !== 'production' && hasDatabase && db) {
  globalForPrisma.prisma = db
}

// Helper function to handle database operations safely
export function withDatabase<T>(fallback: T) {
  return (operation: () => Promise<T>): Promise<T> => {
    if (!db) {
      return Promise.resolve(fallback)
    }
    return operation()
  }
}