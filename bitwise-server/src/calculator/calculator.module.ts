import { Module } from '@nestjs/common';
import { CalculatorController } from './calculator.controller';
import { CalculatorService } from './calculator.service';
import { CalculatorConverterService } from './calculator-converter.service';
import { BinaryCodesService } from './binary-codes.service';
import { CalculatorArithmeticService } from './calculator-arithmetic.service';
import { CalculatorComplementService } from './calculator-complement.service';
import { CalculatorSignedService } from './calculator-signed.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CalculatorController],
  providers: [
    CalculatorService,
    CalculatorConverterService,
    BinaryCodesService,
    CalculatorArithmeticService,
    CalculatorComplementService,
    CalculatorSignedService,
  ],
  exports: [
    CalculatorService,
    CalculatorConverterService,
    BinaryCodesService,
    CalculatorArithmeticService,
    CalculatorComplementService,
    CalculatorSignedService,
  ],
})
export class CalculatorModule {}
