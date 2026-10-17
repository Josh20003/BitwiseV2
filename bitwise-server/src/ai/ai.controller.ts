import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ai')
export class AiController {
  private readonly logger = new Logger(AiController.name);

  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  @UseGuards(JwtAuthGuard)
  async chat(@Body() body: { message: string }) {
    if (!body.message) {
      throw new HttpException('Message is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const response = await this.aiService.getResponse(body.message);
      return { response };
    } catch (error) {
      this.logger.error('AI chat error:', error);
      throw new HttpException(
        (error as Error).message || 'AI service error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('tutor')
  async tutor(
    @Body()
    body: {
      context: string;
      step: string;
      question: string;
    },
  ) {
    if (!body.context || !body.step) {
      throw new HttpException(
        'context and step are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const response = await this.aiService.getTutorResponse(
        body.context,
        body.step,
        body.question || '',
      );
      return { response };
    } catch (error) {
      this.logger.error('AI tutor error:', error);
      throw new HttpException(
        (error as Error).message || 'AI tutor service error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
