import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  private readonly logger = new Logger(AiController.name);

  constructor(private readonly aiService: AiService) {}

  @Post('chat')
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
}
