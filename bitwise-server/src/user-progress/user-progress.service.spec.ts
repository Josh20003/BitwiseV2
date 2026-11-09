import { UserProgressService } from './user-progress.service';
import { Prisma } from '@prisma/client';

describe('Progress completion regression', () => {
  function setup() {
    const stored = {status:'completed',completedAt:new Date()};
    const db = {
      userTopic:{
        findUnique:jest.fn(async()=>({...stored})),
        upsert:jest.fn(async args=>Object.assign(stored,args.update)),
        findMany:jest.fn(async()=>[{status:stored.status}]),
      },
      topic:{findUnique:jest.fn(async()=>({lessonId:1})),findMany:jest.fn(async()=>[{id:1}])},
      userLesson:{upsert:jest.fn(async args=>args.update)},
    };
    const prisma={$transaction:jest.fn(async operation=>operation(db))};
    return {stored,db,prisma,service:new UserProgressService(prisma as any)};
  }
  it('viewing completed content does not downgrade completion or overwrite a passing score',async()=>{
    const {stored,db,prisma,service}=setup();
    await service.markTopicViewed('test-account',1);
    expect(stored.status).toBe('completed');
    expect(db.userLesson.upsert.mock.calls[0][0].update).toMatchObject({status:'completed',progress:1});
    expect(db.userLesson.upsert.mock.calls[0][0].update).not.toHaveProperty('masteryScore');
    expect(prisma.$transaction).toHaveBeenCalledWith(expect.any(Function),expect.objectContaining({isolationLevel:Prisma.TransactionIsolationLevel.Serializable}));
  });
  it('retries a serialization conflict, then persists topic and aggregate together',async()=>{
    const {stored,db,prisma,service}=setup();
    stored.status='viewed';
    prisma.$transaction.mockRejectedValueOnce({code:'P2034'});
    await service.markTopicCompleted('test-account',1);
    expect(prisma.$transaction).toHaveBeenCalledTimes(2);
    expect(stored.status).toBe('completed');
    expect(db.userLesson.upsert.mock.calls[0][0].update.progress).toBe(1);
  });
});
