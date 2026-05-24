import { Controller, Post, Get, Body, Param, ParseIntPipe } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { AdaptiveService } from '../adaptive/adaptive.service';
import { AiQuizService } from './ai-quiz.service';
import { EmaMasteryService } from './ema-mastery.service';

@Controller('assessment')
export class AssessmentController {
  constructor(
    private assessmentService: AssessmentService,
    private adaptiveService: AdaptiveService,
    private aiQuizService: AiQuizService,
    private emaMasteryService: EmaMasteryService
  ) {}

  /**
   * Start an adaptive practice assessment
   * POST /api/assessment/start-adaptive-practice
   */
  @Post('start-adaptive-practice')
  async startAdaptivePractice(@Body() body: { uid: string }) {
    try {
      const result = await this.assessmentService.startAdaptivePracticeAttempt(body.uid);
      
      // Double-check that questions is an array before returning
      if (!result.questions || !Array.isArray(result.questions)) {
        console.error('Result questions is not an array:', result.questions);
        return {
          success: false,
          error: 'Failed to generate valid assessment questions. Please try again.'
        };
      }
      
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Error in startAdaptivePractice controller:', error);
      return {
        success: false,
        error: error.message || 'Failed to start adaptive assessment. Please try again.'
      };
    }
  }

  /**
   * Start a lesson-specific practice assessment
   * POST /api/assessment/start-lesson-practice
   * 
   * This generates a focused 10-question quiz for a single lesson.
   * Questions have topic-specific difficulty based on user's mastery.
   */
  @Post('start-lesson-practice')
  async startLessonPractice(@Body() body: { uid: string; lessonId: number }) {
    try {
      if (!body.lessonId || body.lessonId < 1 || body.lessonId > 4) {
        return {
          success: false,
          error: 'Invalid lessonId. Must be 1, 2, 3, or 4.'
        };
      }

      const result = await this.assessmentService.startLessonPracticeAttempt(body.uid, body.lessonId);
      
      if (!result.questions || !Array.isArray(result.questions)) {
        console.error('Result questions is not an array:', result.questions);
        return {
          success: false,
          error: 'Failed to generate valid assessment questions. Please try again.'
        };
      }
      
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Error in startLessonPractice controller:', error);
      return {
        success: false,
        error: error.message || 'Failed to start lesson practice. Please try again.'
      };
    }
  }

  /**
   * Submit an adaptive practice assessment
   * POST /api/assessment/submit-adaptive-practice
   */
  @Post('submit-adaptive-practice')
  async submitAdaptivePractice(@Body() body: { attemptId: number; responses: any }) {
    try {
      const result = await this.assessmentService.saveAdaptivePracticeAttempt(
        body.attemptId, 
        body.responses
      );
      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get a specific attempt by ID
   * GET /api/assessment/attempt/:attemptId
   */
  @Get('attempt/:attemptId')
  async getAttempt(@Param('attemptId', ParseIntPipe) attemptId: number) {
    try {
      const attempt = await this.assessmentService.getAttemptById(attemptId);
      if (!attempt) {
        return {
          success: false,
          error: 'Attempt not found'
        };
      }
      return {
        success: true,
        data: attempt
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get user's assessment history
   * GET /api/assessment/history/:userId
   */
  @Get('history/:userId')
  async getUserHistory(@Param('userId') userId: string) {
    try {
      const attempts = await this.assessmentService.getUserAttempts(userId);
      return {
        success: true,
        data: attempts
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get user statistics and analytics
   * GET /api/assessment/statistics/:userId
   */
  @Get('statistics/:userId')
  async getUserStatistics(@Param('userId') userId: string) {
    try {
      const statistics = await this.assessmentService.getUserStatistics(userId);
      return {
        success: true,
        data: statistics
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ============= SDD Module 4 Endpoints =============

  @Get('ai-quiz/:userId/:topic')
  async generateAiQuiz(@Param('userId') userId: string, @Param('topic') topic: string) {
    try {
      const questions = await this.aiQuizService.generateQuiz(userId, topic);
      return { success: true, data: questions };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  @Post('ai-quiz/submit')
  async submitAiQuiz(@Body() body: { userId: string, topic: string, score: number, answersJson: any }) {
    try {
      await this.aiQuizService.submitQuiz(body.userId, body.topic, body.score, body.answersJson);
      
      // Update EMA Mastery
      const emaResult = await this.emaMasteryService.processScore(body.userId, body.topic, body.score);
      
      return { success: true, data: emaResult };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  @Get('mastery/:userId')
  async getUserMastery(@Param('userId') userId: string) {
    try {
      const mastery = await this.emaMasteryService.getUserMastery(userId);
      return { success: true, data: mastery };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}