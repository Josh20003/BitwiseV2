import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor() {
    const url = process.env.DATABASE_URL;
    if (process.env.VERCEL && url) {
      const pooled = new URL(url);
      // Keep a small pool, with room for a read while a progress transaction runs.
      if (!pooled.searchParams.has('connection_limit')) pooled.searchParams.set('connection_limit', '2');
      super({datasources: {db: {url: pooled.toString()}}});
    } else {
      super();
    }
  }
  // Prisma connects lazily on the first query. Stateless calculator requests
  // must not open database connections just to bootstrap the application.

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
