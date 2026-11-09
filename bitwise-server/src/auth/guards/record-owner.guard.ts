import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

/** A validated JWT authenticates a user; requested IDs must still belong to them. */
@Injectable()
export class RecordOwnerGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userId = req.user?.id;
    if (!userId) throw new ForbiddenException('Authenticated identity is required');
    for (const selected of [req.params?.userId, req.body?.uid, req.body?.userId]) {
      if (selected !== undefined && selected !== userId) throw new ForbiddenException('This record belongs to another account');
    }
    const attemptId = req.params?.attemptId ?? req.body?.attemptId;
    if (attemptId !== undefined) {
      const id = Number(attemptId);
      if (!Number.isSafeInteger(id) || id < 1) throw new ForbiddenException('Attempt is unavailable');
      const attempt = await this.prisma.attempt.findUnique({where: {id}, select: {userId: true}});
      if (!attempt || attempt.userId !== userId) throw new ForbiddenException('Attempt is unavailable');
    }
    // Start routes use the token identity even when an older client omits uid.
    if (req.body && String(req.url).includes('start-')) req.body.uid = userId;
    return true;
  }
}
