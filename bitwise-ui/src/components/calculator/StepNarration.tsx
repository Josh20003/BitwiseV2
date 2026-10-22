import React from 'react';
import { motion } from 'motion/react';
import { getLawExplanation } from '@/constants/lawExplanations';
import type { ScriptStep } from '../FactoringDemo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb } from 'lucide-react';
import { AskAiTutor } from '@/components/AskAiTutor';

interface StepNarrationProps {
  step: ScriptStep;
  stepNumber: number;
  totalSteps: number;
  nextStepPreview?: ScriptStep;
}

export const StepNarration: React.FC<StepNarrationProps> = ({
  step,
  stepNumber,
  totalSteps,
  nextStepPreview,
}) => {
  const law = getLawExplanation(step.law);

  if (!law) {
    return (
      <div className="bg-muted/30 dark:bg-muted/20 rounded-lg p-4 border border-border">
        <p className="text-sm text-muted-foreground">
          Step {stepNumber} of {totalSteps}: {step.description || 'Transformation applied'}
        </p>
      </div>
    );
  }

  // Generate what happened explanation
  const whatHappened = generateWhatHappened(step, law);
  const whatChanged = generateWhatChanged(step);
  const nextHint = nextStepPreview ? generateNextHint(nextStepPreview) : null;

  const aiPrompt = `Boolean Simplification - Step ${stepNumber} of ${totalSteps}. Applied ${law.title}. Before: ${step.before.raw} | After: ${step.after.raw}. Explanation: ${whatHappened}. Why it works: ${law.intuition || law.description}.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3"
    >
      <Card className="bg-[#0b1021] border border-blue-500/30 rounded-xl overflow-hidden shadow-lg">
        {/* Header */}
        <CardHeader className="pb-3 border-b border-border/40 bg-white/[0.02]">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-2xl p-2 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
                {law.icon}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <CardTitle className="text-sm sm:text-base font-bold text-foreground">
                    Step {stepNumber} of {totalSteps}
                  </CardTitle>
                  <Badge variant="outline" className="text-[10px] uppercase font-mono bg-blue-500/10 text-blue-400 border-blue-500/30">
                    {law.shortName}
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-primary mt-0.5 truncate">
                  Applied {law.title}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="outline" className="gap-1 bg-background/50 border-border/60 text-xs py-1">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                <span>Rule Step</span>
              </Badge>
              <AskAiTutor
                context="Boolean Algebra Expression Simplification"
                stepDescription={aiPrompt}
                subtitle={`Step ${stepNumber}: ${law.title}`}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
            {/* What Happened */}
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-primary/40">
                1
              </span>
              <div className="flex-1 space-y-1">
                <p className="text-xs font-semibold text-primary">What is happening:</p>
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">{whatHappened}</p>
              </div>
            </div>

            {/* Why this rule applies */}
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-purple-500/40">
                2
              </span>
              <div className="flex-1 space-y-1">
                <p className="text-xs font-semibold text-purple-400">Why this result occurs:</p>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {law.intuition || law.description}
                </p>
              </div>
            </div>

            {/* What Changed - Before & After Diff Box */}
            <div className="space-y-2 pt-1">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/40">
                  3
                </span>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-emerald-400">Expression Transformation:</p>
                    {whatChanged && (
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {whatChanged}
                      </span>
                    )}
                  </div>
                  <div className="bg-[#050813] rounded-lg p-3 border border-border/50 space-y-1.5 font-mono text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs font-sans shrink-0">Before:</span>
                      <code className="text-foreground/80 break-all">{step.before.raw}</code>
                    </div>
                    <div className="flex items-center gap-2 pt-1 border-t border-border/40">
                      <span className="text-emerald-400 text-xs font-sans font-semibold shrink-0">After:</span>
                      <code className="text-emerald-300 font-bold break-all">{step.after.raw}</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Takeaway */}
            {(law.realWorldAnalogy || law.intuition) && (
              <div className="flex items-start gap-2 bg-yellow-500/5 p-2.5 rounded-lg border border-yellow-500/20 text-xs text-yellow-200/90 leading-relaxed">
                <Lightbulb className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-yellow-300">Key takeaway: </span>
                  {law.realWorldAnalogy || law.intuition}
                </div>
              </div>
            )}

            {/* Next Step Connection */}
            {nextHint && (
              <div className="pt-2 border-t border-border/40 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="text-cyan-400 font-bold text-sm">→</span>
                <span className="font-semibold text-cyan-300">Connection to next step:</span>
                <span>{nextHint}</span>
              </div>
            )}
          </CardContent>
      </Card>
    </motion.div>
  );
};

// Helper functions to generate contextual narration

function generateWhatHappened(_step: ScriptStep, law: any): string {
  const templates: Record<string, string> = {
    identity: `Removed identity elements (T or F) that don't affect the result.`,
    negation: `Found a variable AND its negation, which creates a contradiction (F) or tautology (T).`,
    doubleNegation: `Cancelled out double negation - two NOTs make a positive.`,
    negationsOfTF: `Simplified the negation of a constant (T or F).`,
    universalBound: `Applied universal bound - the constant (T or F) dominates the entire expression.`,
    associative: `Flattened nested operations of the same type (removed unnecessary grouping).`,
    commutative: `Reordered terms alphabetically for standardization.`,
    idempotent: `Removed duplicate identical terms.`,
    absorption: `One term absorbed another redundant term.`,
    deMorgans: `Applied De Morgan's Law - pushed NOT inside parentheses and flipped the operator.`,
    distributive: `Distributed one operator over another (or factored out common terms).`,
  };

  return templates[law.id] || `Applied ${law.title} to simplify the expression.`;
}

function generateWhatChanged(step: ScriptStep): string | null {
  const beforeTokens = step.before.tokens.length;
  const afterTokens = step.after.tokens.length;
  
  if (beforeTokens === afterTokens) {
    return null; // Restructuring, not reduction
  }
  
  if (beforeTokens > afterTokens) {
    const diff = beforeTokens - afterTokens;
    return `Reduced from ${beforeTokens} to ${afterTokens} tokens (removed ${diff})`;
  }
  
  return null;
}

function generateNextHint(nextStep: ScriptStep): string | null {
  const nextLaw = getLawExplanation(nextStep.law);
  if (!nextLaw) return null;

  const hints: Record<string, string> = {
    identity: `we'll remove unnecessary T/F values`,
    negation: `we'll resolve contradictions to simpler forms`,
    doubleNegation: `we'll eliminate double negations`,
    negationsOfTF: `we'll simplify constant negations`,
    universalBound: `we'll apply constant domination`,
    associative: `we'll flatten the structure`,
    commutative: `we'll reorder for clarity`,
    idempotent: `we'll remove duplicates`,
    absorption: `we'll eliminate redundant terms`,
    deMorgans: `we'll distribute negations`,
    distributive: `we'll restructure using distribution`,
  };

  return hints[nextLaw.id] || `we'll apply ${nextLaw.title}`;
}

export default StepNarration;
