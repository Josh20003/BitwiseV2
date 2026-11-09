import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor() {
    const url = process.env.DATABASE_URL;
    if (process.env.VERCEL && url) {
      const pooled = new URL(url);
      if (!pooled.searchParams.has('connection_limit')) pooled.searchParams.set('connection_limit', '1');
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
