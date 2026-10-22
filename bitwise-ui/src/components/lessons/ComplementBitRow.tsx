import { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { apiService } from '@/services/api.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { StepExplanationCard } from '@/components/common/StepExplanationCard';
import { buildComplementTraceSteps } from '@/utils/stepTraceHelpers';

interface ComplementResult {
  originalValue: string;
  onesComplement: string;
  twosComplement: string;
  cascadeSteps: any[];
}

type AnimationPhase = 'IDLE' | 'FLIP' | 'PAUSE_ONES' | 'CASCADE' | 'DONE' | 'PAUSED';

export function ComplementBitRow() {
  const [binaryInput, setBinaryInput] = useState('10110');
  const [resultData, setResultData] = useState<ComplementResult | null>(null);

  // Animation States
  const [phase, setPhase] = useState<AnimationPhase>('DONE');
  const [cascadeStepIdx, setCascadeStepIdx] = useState(-1);
  const [currentTraceStep, setCurrentTraceStep] = useState<number>(1);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [showRuleCard, setShowRuleCard] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const calculateComplements = async (val?: string) => {
    const input = val ?? binaryInput;
    if (!input) return;
    try {
      const data = await apiService.get<any>(`/calculator/complement/${input}`);
      if (data.success) {
        setResultData(data.result);
        setPhase('DONE');
        setCascadeStepIdx(-1);
      }
    } catch (e) {
      console.error('Complement error', e);
    }
  };

  useEffect(() => {
    // Initial fetch on mount
    calculateComplements('10110');
    return () => {
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
      if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current);
    };
  }, []);

  const resetAnimation = () => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current);
    setPhase('IDLE');
    setCascadeStepIdx(-1);
  };

  const startAnimation = () => {
    if (!resultData) return;
    resetAnimation();
    setPhase('FLIP');
    setCurrentTraceStep(0);

    animationTimeoutRef.current = setTimeout(() => {
      setPhase('PAUSE_ONES');
      animationTimeoutRef.current = setTimeout(() => {
        proceedToTwosComplement();
      }, 1200);
    }, 1200);
  };

  const proceedToTwosComplement = () => {
    if (!resultData) return;
    setPhase('CASCADE');
    setCurrentTraceStep(1);
    setCascadeStepIdx(0);

    autoPlayIntervalRef.current = setInterval(() => {
      setCascadeStepIdx((prev) => {
        if (resultData && prev >= resultData.cascadeSteps.length - 1) {
          clearInterval(autoPlayIntervalRef.current!);
          setPhase('DONE');
          return prev;
        }
        return prev + 1;
      });
    }, 600);
  };

  const pauseAnimation = () => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current);
    setPhase('PAUSED');
  };

  const renderBitRowBoxes = (bits: string, variant: 'default' | 'blue' | 'green') => {
    let boxClasses =
      'w-11 h-13 sm:w-12 sm:h-14 flex items-center justify-center rounded-lg font-mono font-bold text-lg sm:text-xl transition-all duration-300';
    if (variant === 'default') {
      boxClasses += ' border border-border/80 bg-muted/40 text-foreground';
    } else if (variant === 'blue') {
      boxClasses +=
        ' border-2 border-blue-500/80 bg-blue-950/20 text-blue-400 shadow-sm shadow-blue-500/20';
      if (phase === 'FLIP') boxClasses += ' scale-105 border-blue-400';
    } else if (variant === 'green') {
      boxClasses +=
        ' border-2 border-emerald-500/80 bg-emerald-950/20 text-emerald-400 shadow-sm shadow-emerald-500/20';
      if (phase === 'CASCADE') boxClasses += ' scale-105 border-emerald-400';
    }

    return (
      <div className="flex gap-2.5 sm:gap-3 justify-center">
        {bits.split('').map((bit, i) => (
          <div key={i} className={boxClasses}>
            {bit}
          </div>
        ))}
      </div>
    );
  };

  const getExplanationText = () => {
    return "1's complement is formed by flipping every bit: 0 becomes 1 and 1 becomes 0. 2's complement is then formed by adding 1 to the 1's complement. In modern digital systems, 2's complement is the standard way to represent signed negative binary numbers because addition and subtraction can use the exact same circuitry.";
  };

  const originalVal = resultData?.originalValue || binaryInput;
  const onesComp =
    resultData?.onesComplement ||
    originalVal
      .split('')
      .map((b) => (b === '0' ? '1' : '0'))
      .join('');
  const twosComp =
    resultData?.twosComplement ||
    (parseInt(onesComp, 2) + 1).toString(2).padStart(originalVal.length, '0');

  return (
    <div className="w-full space-y-6">
      <Card className="bg-card border-border overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl sm:text-2xl font-bold">
            1's & 2's Complements
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Visualize bit inversions and cascade carries
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls row: input + load + switches */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/60 pb-5">
            <div className="flex items-end gap-2.5">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">
                  Binary Input
                </label>
                <Input
                  value={binaryInput}
                  onChange={(e) =>
                    setBinaryInput(e.target.value.replace(/[^01]/g, ''))
                  }
                  className="w-36 sm:w-44 font-mono tracking-widest text-base h-9 bg-background"
                  placeholder="e.g. 10110"
                />
              </div>
              <Button
                onClick={() => calculateComplements()}
                variant="outline"
                size="sm"
                className="h-9 px-4 cursor-pointer"
              >
                Load
              </Button>
            </div>

            {/* Display switches */}
            <div className="flex items-center gap-5 text-xs">
              <div className="flex items-center gap-2">
                <Switch
                  id="rule-toggle"
                  checked={showRuleCard}
                  onCheckedChange={setShowRuleCard}
                  className="scale-85"
                />
                <Label
                  htmlFor="rule-toggle"
                  className="cursor-pointer text-xs text-muted-foreground"
                >
                  Rule Card
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="explanation-toggle"
                  checked={showExplanation}
                  onCheckedChange={setShowExplanation}
                  className="scale-85"
                />
                <Label
                  htmlFor="explanation-toggle"
                  className="cursor-pointer text-xs text-muted-foreground"
                >
                  Explanation
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="autoplay-toggle"
                  checked={isAutoPlay}
                  onCheckedChange={setIsAutoPlay}
                  className="scale-85"
                />
                <Label
                  htmlFor="autoplay-toggle"
                  className="cursor-pointer text-xs text-muted-foreground"
                >
                  Auto-play
                </Label>
              </div>
            </div>
          </div>

          {/* TWO-COLUMN LAYOUT matching mockup */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Visualization Panel */}
            <div className="lg:col-span-6 xl:col-span-6 rounded-2xl border border-border/70 bg-[#090d18]/80 p-6 flex flex-col items-center space-y-5">
              {/* Row 1: Original Number */}
              <div className="w-full text-center space-y-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Original Number ({originalVal.length} bits)
                </span>
                {renderBitRowBoxes(originalVal, 'default')}
              </div>

              {/* Down Arrow */}
              <div className="text-muted-foreground text-lg font-bold leading-none">
                ↓
              </div>

              {/* Row 2: 1's Complement */}
              <div className="w-full text-center space-y-2">
                <span className="text-xs font-medium text-blue-400">
                  1's Complement (Invert each bit)
                </span>
                {renderBitRowBoxes(onesComp, 'blue')}
              </div>

              {/* Down Arrow */}
              <div className="text-muted-foreground text-lg font-bold leading-none">
                ↓
              </div>

              {/* Row 3: 2's Complement */}
              <div className="w-full text-center space-y-2">
                <span className="text-xs font-medium text-emerald-400">
                  2's Complement (Add 1)
                </span>
                {renderBitRowBoxes(twosComp, 'green')}
              </div>

              {/* Status Section */}
              <div className="w-full pt-3 border-t border-border/40 text-center space-y-1.5">
                <div className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
                  {phase === 'FLIP' && "Inverting Bits for 1's Complement..."}
                  {phase === 'PAUSE_ONES' && "1's Complement Ready"}
                  {phase === 'CASCADE' && `Adding 1 for 2's Complement${cascadeStepIdx >= 0 ? ` (Carry Step ${cascadeStepIdx + 1})` : '...'}`}
                  {phase === 'PAUSED' && 'Animation Paused'}
                  {(phase === 'DONE' || phase === 'IDLE') && "2's Complement Complete"}
                </div>
                <div className="text-xs font-mono space-y-0.5">
                  <div className="text-muted-foreground">
                    Original:{' '}
                    <span className="text-foreground font-semibold">
                      {originalVal}
                    </span>
                  </div>
                  <div className="text-muted-foreground">
                    1's Complement:{' '}
                    <span className="text-foreground font-semibold">
                      {onesComp}
                    </span>
                  </div>
                  <div className="text-muted-foreground">
                    2's Complement:{' '}
                    <span className="text-emerald-400 font-bold">
                      {twosComp}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={startAnimation}
                  className="gap-1.5 text-xs h-8 px-3.5 bg-background hover:bg-muted cursor-pointer"
                >
                  <Play className="h-3 w-3 fill-current" />
                  Replay
                </Button>
                {phase !== 'DONE' && phase !== 'IDLE' && phase !== 'PAUSED' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={pauseAnimation}
                    className="gap-1.5 text-xs h-8 px-3.5 bg-background hover:bg-muted cursor-pointer"
                  >
                    <Pause className="h-3 w-3" />
                    Pause
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={resetAnimation}
                  className="gap-1.5 text-xs h-8 px-3.5 bg-background hover:bg-muted cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </Button>
              </div>
            </div>

            {/* Right Column: Calculation Trace with StepExplanationCard */}
            <div className="lg:col-span-6 xl:col-span-6">
              <StepExplanationCard
                title="Complement Calculation Trace"
                badgeText="Signed Arithmetic"
                context={`1's & 2's Complement calculation of binary ${originalVal}`}
                steps={buildComplementTraceSteps({
                  originalValue: originalVal,
                  onesComplement: onesComp,
                  twosComplement: twosComp,
                  cascadeSteps: resultData?.cascadeSteps,
                })}
                currentStepIndex={currentTraceStep}
                onStepChange={setCurrentTraceStep}
                resultSummary={{
                  label: '2\'s Complement Complete',
                  value: twosComp,
                  sublabel: `Original: ${originalVal} | 1's: ${onesComp}`,
                }}
              />
            </div>
          </div>

          {/* Explanation Panel if toggled */}
          {showExplanation && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-2 mt-4">
              <h4 className="font-semibold text-xs sm:text-sm text-foreground">
                Explanation
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {getExplanationText()}
              </p>
            </div>
          )}

          {/* Rule Card Panel if toggled */}
          {showRuleCard && (
            <div className="p-4 bg-muted/40 border border-border rounded-xl space-y-2 mt-4">
              <h4 className="font-semibold text-xs sm:text-sm text-foreground">
                How it Works
              </h4>
              <ol className="text-xs sm:text-sm text-muted-foreground space-y-1.5 list-decimal list-inside">
                <li>1's Complement: Invert every bit (0 becomes 1, 1 becomes 0).</li>
                <li>2's Complement: Add 1 to the 1's complement value.</li>
                <li>
                  Sign representation: In 2's complement, the most significant bit (MSB)
                  acts as the sign bit (1 = negative, 0 = positive).
                </li>
              </ol>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ComplementBitRow;
