import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class EmaMasteryService {
  private readonly ALPHA = 0.3; // Weight of the new score
  private readonly BETA = 0.7;  // Weight of the historical EMA

  constructor(private prisma: PrismaService) {}

  /**
   * Processes a new quiz score and updates the user's EMA mastery level for a specific topic.
   * @param userId The user ID
   * @param topic The topic identifier (e.g., 'binary-arithmetic')
   * @param newScore The new quiz score (normalized 0.0 to 1.0)
   */
  async processScore(userId: string, topic: string, newScore: number) {
    // Ensure score is between 0 and 1
    const normalizedScore = Math.max(0, Math.min(1, newScore));

    // Find existing mastery
    const existingMastery = await this.prisma.ema_mastery.findUnique({
      where: {
        user_id_topic: {
          user_id: userId,
          topic: topic
        }
      }
    });

    let updatedEMA = 0.0;

    if (!existingMastery) {
      // For the first attempt, the EMA is just the score
      updatedEMA = normalizedScore;
      await this.prisma.ema_mastery.create({
        data: {
          user_id: userId,
          topic: topic,
          currentEMA: updatedEMA
        }
      });
    } else {
      // EMA formula: (Alpha * newScore) + ((1 - Alpha) * oldEMA)
      updatedEMA = (this.ALPHA * normalizedScore) + (this.BETA * existingMastery.currentEMA);
      
      await this.prisma.ema_mastery.update({
        where: { id: existingMastery.id },
        data: { currentEMA: updatedEMA }
      });
    }

    // Also update streaks
    await this.updateStreak(userId, normalizedScore === 1.0);

    return {
      topic,
      previousEMA: existingMastery ? existingMastery.currentEMA : 0.0,
      newEMA: updatedEMA,
      score: normalizedScore
    };
  }

  private async updateStreak(userId: string, isPerfect: boolean) {
    let streak = await this.prisma.user_streaks.findUnique({ where: { user_id: userId } });
    
    if (!streak) {
      streak = await this.prisma.user_streaks.create({
        data: {
          user_id: userId,
          currentStreak: isPerfect ? 1 : 0,
          bestStreak: isPerfect ? 1 : 0
        }
      });
      return;
    }

    const newCurrent = isPerfect ? streak.currentStreak + 1 : 0;
    const newBest = Math.max(streak.bestStreak, newCurrent);

    await this.prisma.user_streaks.update({
      where: { id: streak.id },
      data: {
        currentStreak: newCurrent,
        bestStreak: newBest
      }
    });
  }

  /**
   * Get all EMA scores for a user to render in the Radar Chart
   */
  async getUserMastery(userId: string) {
    return this.prisma.ema_mastery.findMany({
      where: { user_id: userId }
    });
  }
}
