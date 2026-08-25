import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { CalculatorService } from './calculator.service';
import { CalculatorConverterService } from './calculator-converter.service';
import { BinaryCodesService } from './binary-codes.service';
import { CalculatorArithmeticService } from './calculator-arithmetic.service';
import { CalculatorComplementService } from './calculator-complement.service';
import { CalculatorSignedService } from './calculator-signed.service';
import { SimplifyExpressionDto } from './dto/simplify-expression.dto';
import { CalculationResponse } from './interfaces/calculator.interface';

@Controller('calculator')
export class CalculatorController {
  private readonly logger = new Logger(CalculatorController.name);

  constructor(
    private readonly calculatorService: CalculatorService,
    private readonly converterService: CalculatorConverterService,
    private readonly binaryCodesService: BinaryCodesService,
    private readonly arithmeticService: CalculatorArithmeticService,
    private readonly complementService: CalculatorComplementService,
    private readonly signedService: CalculatorSignedService,
  ) {}

  @Post('simplify')
  async simplify(@Body() simplifyDto: SimplifyExpressionDto): Promise<CalculationResponse> {
    try {
      if (!simplifyDto.expression) {
        throw new HttpException(
          'Expression is required',
          HttpStatus.BAD_REQUEST,
        );
      }
      
      const result = await this.calculatorService.simplifyExpression(simplifyDto.expression);

      if (!result.success) {
        throw new HttpException(
          result.error || 'Simplification failed',
          HttpStatus.BAD_REQUEST,
        );
      }

      return result;
    } catch (error) {
      
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Internal server error during simplification',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('evaluate')
  async evaluate(
    @Body() body: { expression: string; variables: Record<string, boolean> }
  ): Promise<CalculationResponse> {
    try {
      if (!body.expression) {
        throw new HttpException(
          'Expression is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!body.variables) {
        throw new HttpException(
          'Variables are required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.calculatorService.evaluateExpression(
        body.expression,
        body.variables
      );

      if (!result.success) {
        throw new HttpException(
          result.error || 'Evaluation failed',
          HttpStatus.BAD_REQUEST,
        );
      }

      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error('Error evaluating expression:', error);
      throw new HttpException(
        'Internal server error during evaluation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('truth-table')
  async generateTruthTable(
    @Body() body: { expression: string }
  ): Promise<CalculationResponse> {
    try {
      if (!body.expression) {
        throw new HttpException(
          'Expression is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.calculatorService.generateTruthTable(body.expression);

      if (!result.success) {
        throw new HttpException(
          result.error || 'Truth table generation failed',
          HttpStatus.BAD_REQUEST,
        );
      }

      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error('Error generating truth table:', error);
      throw new HttpException(
        'Internal server error during truth table generation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ============= Binary Arithmetic Endpoints =============
  
  @Post('arithmetic')
  async calculateArithmetic(
    @Body() body: { operand1: string; operand2: string; operation: '+' | '-' | '*' | '/' }
  ) {
    try {
      if (!body.operand1 || !body.operand2 || !body.operation) {
        throw new HttpException(
          'operand1, operand2, and operation are required',
          HttpStatus.BAD_REQUEST,
        );
      }
      const result = this.arithmeticService.calculate(body.operand1, body.operand2, body.operation);
      return { success: true, result };
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Arithmetic calculation failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ============= Complement Service Endpoints =============
  
  @Get('complement/:value')
  async getComplements(@Param('value') value: string) {
    try {
      if (!value || !/^[01]+$/.test(value)) {
        throw new HttpException(
          'A valid binary value is required',
          HttpStatus.BAD_REQUEST,
        );
      }
      const result = this.complementService.getComplements(value);
      return { success: true, result };
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Complement calculation failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ============= Signed/Unsigned Endpoints =============
  
  @Get('signed/:value')
  async interpretSignedValue(@Param('value') value: string) {
    try {
      if (!value || !/^[01]+$/.test(value)) {
        throw new HttpException(
          'A valid binary value is required',
          HttpStatus.BAD_REQUEST,
        );
      }
      const result = this.signedService.interpret(value);
      return { success: true, result };
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Signed interpretation failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ============= Number System Converter Endpoints =============

  @Post('convert')
  async convertNumber(
    @Body() body: { value: string; fromBase: number; toBase: number },
  ) {
    try {
      if (!body.value || !body.fromBase || !body.toBase) {
        throw new HttpException(
          'Value, fromBase, and toBase are required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.converterService.convertNumber(
        body.value,
        body.fromBase,
        body.toBase,
      );

      return { success: true, result };
    } catch (error: any) {
      this.logger.error('Error converting number:', error);
      throw new HttpException(
        error.message || 'Conversion failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('conversion-examples')
  async getConversionExamples(
    @Query('sourceBase') sourceBase?: string,
    @Query('targetBase') targetBase?: string,
    @Query('difficulty') difficulty?: string,
  ) {
    try {
      const examples = await this.converterService.getConversionExamples(
        sourceBase ? parseInt(sourceBase) : undefined,
        targetBase ? parseInt(targetBase) : undefined,
        difficulty,
      );
      return { success: true, data: examples };
    } catch (error: any) {
      throw new HttpException(
        'Failed to fetch examples',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('number-systems')
  async getNumberSystems() {
    try {
      const systems = await this.converterService.getNumberSystems();
      return { success: true, data: systems };
    } catch (error: any) {
      throw new HttpException(
        'Failed to fetch number systems',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('convert-multi-step')
  async convertMultiStep(
    @Body() body: { value: string; fromBase: number; basePath: number[] },
  ) {
    try {
      if (!body.value || !body.fromBase || !body.basePath) {
        throw new HttpException(
          'Value, fromBase, and basePath are required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.converterService.convertMultiStep(
        body.value,
        body.fromBase,
        body.basePath,
      );

      return { success: true, result };
    } catch (error: any) {
      this.logger.error('Error in multi-step conversion:', error);
      throw new HttpException(
        error.message || 'Multi-step conversion failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ============= Binary Codes Endpoints =============

  @Post('encode-bcd')
  async encodeBCD(@Body() body: { value: string }) {
    try {
      if (!body.value) {
        throw new HttpException(
          'Value is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = this.binaryCodesService.encodeBCD(body.value);
      return { success: true, result };
    } catch (error: any) {
      this.logger.error('Error encoding BCD:', error);
      throw new HttpException(
        error.message || 'BCD encoding failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('decode-bcd')
  async decodeBCD(@Body() body: { value: string }) {
    try {
      if (!body.value) {
        throw new HttpException(
          'Value is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = this.binaryCodesService.decodeBCD(body.value);
      return { success: true, result };
    } catch (error: any) {
      this.logger.error('Error decoding BCD:', error);
      throw new HttpException(
        error.message || 'BCD decoding failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('encode-gray')
  async encodeGrayCode(@Body() body: { value: string }) {
    try {
      if (!body.value) {
        throw new HttpException(
          'Value is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = this.binaryCodesService.encodeGrayCode(body.value);
      return { success: true, result };
    } catch (error: any) {
      this.logger.error('Error encoding Gray Code:', error);
      throw new HttpException(
        error.message || 'Gray Code encoding failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('decode-gray')
  async decodeGrayCode(@Body() body: { value: string }) {
    try {
      if (!body.value) {
        throw new HttpException(
          'Value is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = this.binaryCodesService.decodeGrayCode(body.value);
      return { success: true, result };
    } catch (error: any) {
      this.logger.error('Error decoding Gray Code:', error);
      throw new HttpException(
        error.message || 'Gray Code decoding failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('hamming-code')
  async calculateHammingCode(@Body() body: { value: string }) {
    try {
      if (!body.value) {
        throw new HttpException(
          'Value is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = this.binaryCodesService.calculateHammingCode(body.value);
      return { success: true, result };
    } catch (error: any) {
      this.logger.error('Error calculating Hamming Code:', error);
      throw new HttpException(
        error.message || 'Hamming Code calculation failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('binary-codes')
  async getBinaryCodes(@Query('complexity') complexity?: string) {
    try {
      const codes = await this.binaryCodesService.getBinaryCodes(complexity);
      return { success: true, data: codes };
    } catch (error: any) {
      throw new HttpException(
        'Failed to fetch binary codes',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
