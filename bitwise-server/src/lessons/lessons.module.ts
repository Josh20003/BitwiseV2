import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { LessonsConverterService } from './lessons-converter.service';

@Module({
  controllers: [LessonsController],
  providers: [LessonsService, LessonsConverterService],
  exports: [LessonsService, LessonsConverterService],
})
export class LessonsModule {}
