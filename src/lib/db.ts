import type { PrismaClient } from "@prisma/client";

/**
 * Lazy Prisma client.
 *
 * We only construct the client on first use (and only outside the
 * browser) so that:
 *   1. The build server can bundle this module without needing
 *      `DATABASE_URL` or a generated Prisma client at import time.
 *   2. The client-side bundle never accidentally instantiates a
 *      PrismaClient (which would crash in the browser).
 *
 * If you need the database, call `await getDb()`. The first call
 * lazily imports and constructs the client.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let cachedClient: PrismaClient | null = null;

export async function getDb(): Promise<PrismaClient> {
  if (cachedClient) return cachedClient;
  if (globalForPrisma.prisma) {
    cachedClient = globalForPrisma.prisma;
    return cachedClient;
  }
  // Prisma should only be instantiated on the server. In the browser
  // this code path is unreachable because getDb is only called from
  // server components / route handlers.
  const { PrismaClient } = await import("@prisma/client");
  cachedClient = new PrismaClient();
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = cachedClient;
  return cachedClient;
}

/** Synchronous accessor — only use when you know you're on the server
 *  and the client has already been initialised. */
export function db(): PrismaClient {
  if (!cachedClient && !globalForPrisma.prisma) {
    throw new Error("db() called before getDb(). Use await getDb() first.");
  }
  cachedClient = cachedClient ?? globalForPrisma.prisma!;
  return cachedClient;
}
