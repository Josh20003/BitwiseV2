import { CalculatorArithmeticService } from '../calculator/calculator-arithmetic.service';
import { CalculatorComplementService } from '../calculator/calculator-complement.service';
import { CalculatorConverterService } from '../calculator/calculator-converter.service';
import { buildLocalLessonQuestions } from './lesson-quiz-fallback';
import { RecordOwnerGuard } from '../auth/guards/record-owner.guard';

describe('Recorded defect regression', () => {
  const complements = new CalculatorComplementService(new CalculatorArithmeticService());
  it.each([1,4,8,16])('keeps zero within its %i-bit width', width => {
    expect(complements.getComplements('0'.repeat(width)).twosComplement).toBe('0'.repeat(width));
  });
  it('matches modular negation for every eight-bit input', () => {
    for (let n=0;n<256;n++) {
      const result = complements.getComplements(n.toString(2).padStart(8,'0'));
      expect(result.twosComplement).toBe(((256-n)%256).toString(2).padStart(8,'0'));
    }
  });
  it('rejects invalid same-base digits and unsafe integers', async () => {
    const converter = new CalculatorConverterService({} as any);
    await expect(converter.convertNumber('9',2,2)).rejects.toThrow();
    await expect(converter.convertNumber('9007199254740993',10,16)).rejects.toThrow('safe integer');
    await expect(converter.convertNumber('FF',16,16)).resolves.toMatchObject({targetValue:'FF'});
  });
  function question(lessonTitle: string, topicTitle: string, index=0) {
    return buildLocalLessonQuestions({lessonId:1,lessonTitle,totalQuestions:10,topics:[{topicId:1,topicTitle,mastery:0.5,difficulty:'medium',questionCount:10,tags:[],contentText:''}]})[index];
  }
  it('asks decimal-to-binary in the requested direction', () => {
    const q = question('Conversion of Number Systems','Decimal to Binary');
    expect(q.stem).toBe('Convert decimal 5 to binary.');
    expect(q.options.find(o=>o.isCorrect)?.text).toBe('101');
  });
  it('asks character-to-binary using ASCII rather than BCD', () => {
    const q=question('Binary Codes (BCD & ASCII)','Character-to-Binary');
    expect(q.stem).toContain('ASCII binary byte');
    expect(q.options.find(o=>o.isCorrect)?.text).toBe('01000001');
  });
  it.each(['NAND NOR','XOR XNOR'])('computes the labelled %s gates', title => {
    for (let i=0;i<10;i++) {
      const q=question('Logic Gates',title,i);
      const a=i%2,b=Math.floor(i/2)%2;
      const expected=title==='NAND NOR' ? (i%2===0 ? 1-(a&b):1-(a|b)) : (i%2===0 ? a^b:1-(a^b));
      expect(q.options.find(o=>o.isCorrect)?.text).toBe(String(expected));
      expect(q.stem).toMatch(title==='NAND NOR' ? /NAND|NOR/:/XOR|XNOR/);
    }
  });
  it('asks actual map grouping questions for Karnaugh-map topics', () => {
    const q=question('Simplification','Karnaugh Maps');
    expect(q.stem).toMatch(/minterms 0, 1/);
    expect(q.options.find(o=>o.isCorrect)?.text).toBe('NOT A');
  });
  it('rejects cross-account user IDs and attempt access before controller execution', async () => {
    const prisma={attempt:{findUnique:jest.fn().mockResolvedValue({userId:'account-A'})}};
    const guard=new RecordOwnerGuard(prisma as any);
    const context=(req: any)=>({switchToHttp:()=>({getRequest:()=>req})}) as any;
    await expect(guard.canActivate(context({user:{id:'account-B'},params:{userId:'account-A'}}))).rejects.toThrow('another account');
    await expect(guard.canActivate(context({user:{id:'account-B'},body:{attemptId:5}}))).rejects.toThrow('unavailable');
    await expect(guard.canActivate(context({user:{id:'account-A'},body:{attemptId:5}}))).resolves.toBe(true);
    expect(prisma.attempt.findUnique).toHaveBeenCalledWith({where:{id:5},select:{userId:true}});
  });
});
