import React from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, CheckCircle2, Lightbulb, Layers } from 'lucide-react';
import { AskAiTutor } from '@/components/AskAiTutor';
import { Button } from '@/components/ui/button';

export interface StepInputItem {
  label: string;
  value: string | number;
  badge?: string;
  color?: 'purple' | 'blue' | 'emerald' | 'amber' | 'cyan' | 'default';
}

export interface UnifiedTraceStep {
  id: string;
  title: string;
  stepNumber?: number;
  inputs?: StepInputItem[];
  operation?: string;
  intermediate?: string | React.ReactNode;
  simpleExplanation: string;
  whyItWorks?: string;
  connectionToNext?: string;
  keyTakeaway?: string;
  result: string | React.ReactNode;
  substeps?: string[];
  rawContextForAi?: string;
}

export interface StepExplanationCardProps {
  title?: string;
  subtitle?: string;
  context: string;
  steps: UnifiedTraceStep[];
  currentStepIndex: number;
  onStepChange: (index: number) => void;
  resultSummary?: {
    label: string;
    value: string;
    sublabel?: string;
  };
  badgeText?: string;
  className?: string;
}

export function StepExplanationCard({
  title = 'Calculation Trace',
  subtitle,
  context,
  steps,
  currentStepIndex,
  onStepChange,
  resultSummary,
  badgeText = 'Step-by-Step',
  className = '',
}: StepExplanationCardProps) {
  if (!steps || steps.length === 0) return null;

  const currentStep = steps[currentStepIndex] || steps[0];
  const totalSteps = steps.length;
  const progressPercent = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentStepIndex > 0) {
      onStepChange(currentStepIndex - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentStepIndex < totalSteps - 1) {
      onStepChange(currentStepIndex + 1);
    }
  };

  // Color mapping helper for input pills
  const getPillColor = (color?: string) => {
    switch (color) {
      case 'purple':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'blue':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'emerald':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'amber':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'cyan':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      default:
        return 'bg-muted/40 text-foreground border-border/60';
    }
  };

  // Construct rich AI prompt string
  const aiStepPrompt = currentStep.rawContextForAi || [
    `Step ${currentStepIndex + 1} of ${totalSteps}: ${currentStep.title}`,
    currentStep.operation ? `Operation: ${currentStep.operation}` : null,
    currentStep.inputs ? `Inputs: ${currentStep.inputs.map(i => `${i.label} = ${i.value}`).join(', ')}` : null,
    `Result: ${typeof currentStep.result === 'string' ? currentStep.result : 'computed'}`,
    `Explanation: ${currentStep.simpleExplanation}`,
    currentStep.whyItWorks ? `Why it works: ${currentStep.whyItWorks}` : null,
    currentStep.connectionToNext ? `Next step connection: ${currentStep.connectionToNext}` : null,
    currentStep.substeps && currentStep.substeps.length > 0 ? `Substeps: ${currentStep.substeps.join('; ')}` : null,
  ].filter(Boolean).join(' | ');

  return (
    <div className={`space-y-3.5 ${className}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-[var(--color-bluez,#6e61ff)]" />
          <h4 className="font-semibold text-sm sm:text-base text-foreground tracking-tight">
            {title}
          </h4>
          {badgeText && (
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[var(--color-bluez,#6e61ff)]/15 text-[var(--color-bluez,#a594fd)] border border-[var(--color-bluez,#6e61ff)]/30 font-medium">
              {badgeText}
            </span>
          )}
        </div>
        <div className="text-xs font-mono text-muted-foreground flex items-center gap-2">
          <span>Step {currentStepIndex + 1} of {totalSteps}</span>
          <span className="text-[11px] text-[var(--color-bluez,#a594fd)] font-semibold">({progressPercent}%)</span>
        </div>
      </div>

      {subtitle && (
        <p className="text-xs text-muted-foreground -mt-1">{subtitle}</p>
      )}

      {/* Accordion / Step List */}
      <div className="space-y-2.5">
        {steps.map((step, idx) => {
          const isCurrent = idx === currentStepIndex;

          if (isCurrent) {
            return (
              <div
                key={step.id || idx}
                className="rounded-xl border border-[var(--color-bluez,#6e61ff)]/40 bg-gradient-to-b from-[#0c1122] to-[#070b18] p-4 sm:p-5 shadow-lg shadow-[var(--color-bluez,#6e61ff)]/5 transition-all"
              >
                <div className="space-y-4">
                  {/* Step Title, Nav & Ask AI */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-bluez,#6e61ff)] text-white font-bold text-xs shadow-sm shrink-0">
                        {idx + 1}
                      </span>
                      <h5 className="font-bold text-sm sm:text-base text-foreground">
                        {step.title}
                      </h5>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={handlePrev}
                          disabled={currentStepIndex === 0}
                          aria-label="Previous step"
                          className="p-1 rounded-md border border-border/60 bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                        >
                          <ChevronLeft className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-[11px] font-mono text-muted-foreground px-1">
                          {idx + 1}/{totalSteps}
                        </span>
                        <button
                          type="button"
                          onClick={handleNext}
                          disabled={currentStepIndex === totalSteps - 1}
                          aria-label="Next step"
                          className="p-1 rounded-md border border-border/60 bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <AskAiTutor
                        context={context}
                        stepDescription={aiStepPrompt}
                        subtitle="Detailed tutor explanation for this step"
                      />
                    </div>
                  </div>

                    {/* Inputs Breakdown (Pills) */}
                    {step.inputs && step.inputs.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[11px] font-medium text-muted-foreground mr-1">
                          Inputs:
                        </span>
                        {step.inputs.map((inp, i) => (
                          <div
                            key={i}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-mono ${getPillColor(inp.color)}`}
                          >
                            <span className="text-muted-foreground font-sans text-[11px]">{inp.label}:</span>
                            <span className="font-bold">{inp.value}</span>
                            {inp.badge && (
                              <span className="text-[9px] uppercase px-1 rounded bg-white/10 text-white font-sans">
                                {inp.badge}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Operation & Intermediate Box */}
                    {step.operation && (
                      <div className="bg-[#050813] border border-border/50 rounded-lg p-3 font-mono text-xs sm:text-sm text-foreground/90 space-y-1">
                        <div className="text-[10px] uppercase font-sans font-semibold tracking-wider text-muted-foreground">
                          Calculation Formula / Operation:
                        </div>
                        <div className="text-blue-300 font-semibold leading-relaxed whitespace-pre-wrap">
                          {step.operation}
                        </div>
                        {step.intermediate && (
                          <div className="text-xs text-muted-foreground pt-1 border-t border-border/40 mt-1">
                            {step.intermediate}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Beginner-Friendly Explanation Section */}
                    <div className="space-y-2 pt-1 text-xs sm:text-sm leading-relaxed">
                      <div className="p-3 bg-muted/20 border border-border/40 rounded-lg space-y-2">
                        <div>
                          <span className="font-semibold text-foreground block mb-1">
                            What is happening:
                          </span>
                          <p className="text-foreground/90 leading-relaxed">
                            {step.simpleExplanation}
                          </p>
                        </div>

                        {step.whyItWorks && (
                          <div className="pt-2 border-t border-border/30">
                            <span className="font-semibold text-purple-300 block mb-1">
                              Why this result occurs:
                            </span>
                            <p className="text-muted-foreground leading-relaxed">
                              {step.whyItWorks}
                            </p>
                          </div>
                        )}

                        {step.connectionToNext && (
                          <div className="pt-2 border-t border-border/30">
                            <span className="font-semibold text-cyan-300 block mb-1">
                              Connection to next step:
                            </span>
                            <p className="text-muted-foreground leading-relaxed">
                              {step.connectionToNext}
                            </p>
                          </div>
                        )}

                        {step.keyTakeaway && (
                          <div className="pt-2 border-t border-border/30 flex items-start gap-2 bg-yellow-500/5 p-2 rounded border border-yellow-500/20">
                            <Lightbulb className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                            <div className="text-xs text-yellow-200/90 leading-relaxed">
                              <span className="font-semibold text-yellow-300">Key takeaway: </span>
                              {step.keyTakeaway}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Substeps Breakdown (if present) */}
                    {step.substeps && step.substeps.length > 0 && (
                      <div className="pt-2 border-t border-border/50 space-y-1.5 bg-[#050813] p-3 rounded-lg border border-border/40">
                        <div className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">
                          Detailed Step Breakdown
                        </div>
                        <div className="font-mono text-xs text-foreground/90 space-y-1 pl-1">
                          {step.substeps.map((sub, sIdx) => (
                            <div key={sIdx} className="leading-relaxed whitespace-pre-wrap">
                              {sub}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step Result Banner */}
                    <div className="flex items-center justify-between p-2.5 px-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs font-semibold text-emerald-300">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Step {idx + 1} Result:
                      </span>
                      <span className="font-mono font-bold text-sm text-emerald-200">
                        {step.result}
                      </span>
                    </div>

                    {/* Navigation Buttons Row */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/40">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handlePrev}
                        disabled={currentStepIndex === 0}
                        className="gap-1.5 text-xs h-8 cursor-pointer"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                        Previous Step
                      </Button>

                      {currentStepIndex < totalSteps - 1 ? (
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleNext}
                          className="gap-1.5 text-xs h-8 bg-[var(--color-bluez,#6e61ff)] hover:bg-[var(--color-bluez,#6e61ff)]/90 text-white cursor-pointer"
                        >
                          Next Step
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      ) : (
                        <div className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> All steps completed!
                        </div>
                      )}
                    </div>
                  </div>
              </div>
            );
          }

          // Collapsed step summary
          return (
            <div
              key={step.id || idx}
              onClick={() => onStepChange(idx)}
              className="p-3 px-4 rounded-xl border border-border/70 bg-[#090d1a] flex items-center justify-between text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-border cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-muted text-muted-foreground text-[10px] font-bold">
                  {idx + 1}
                </span>
                <span className="font-bold text-foreground truncate">
                  Step {idx + 1}
                </span>
                <span className="text-muted-foreground/80 font-normal truncate">
                  • {step.title}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono text-[11px] text-muted-foreground/90 max-w-[120px] truncate">
                  {typeof step.result === 'string' ? `→ ${step.result}` : ''}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Final Calculation Summary Banner */}
      {resultSummary && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-emerald-400 font-bold text-xs mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{resultSummary.label}</span>
            {resultSummary.sublabel && (
              <span className="text-[11px] text-emerald-300/80 font-normal">
                ({resultSummary.sublabel})
              </span>
            )}
          </div>
          <span className="font-mono text-sm sm:text-base text-emerald-200">
            {resultSummary.value}
          </span>
        </div>
      )}
    </div>
  );
}

export default StepExplanationCard;
