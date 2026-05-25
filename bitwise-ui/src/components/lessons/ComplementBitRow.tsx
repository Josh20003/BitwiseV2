import { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react';
import { apiService } from '@/services/api.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface ComplementResult {
  originalValue: string;
  onesComplement: string;
  twosComplement: string;
  cascadeSteps: any[]; // Used for carry animation
}

type AnimationPhase = 'IDLE' | 'FLIP' | 'PAUSE_ONES' | 'CASCADE' | 'DONE' | 'PAUSED';

export function ComplementBitRow() {
  const [binaryInput, setBinaryInput] = useState('10110');
  const [resultData, setResultData] = useState<ComplementResult | null>(null);
  
  // Animation States
  const [phase, setPhase] = useState<AnimationPhase>('IDLE');
  const [cascadeStepIdx, setCascadeStepIdx] = useState(-1);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [showRuleCard, setShowRuleCard] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const calculateComplements = async () => {
    if (!binaryInput) return;
    try {
      const data = await apiService.get<any>(`/calculator/complement/${binaryInput}`);
      if (data.success) {
        setResultData(data.result);
        resetAnimation();
      }
    } catch (e) {
      console.error("Complement error", e);
    }
  };

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
    
    // Wait for flip animation, then pause at 1's complement
    animationTimeoutRef.current = setTimeout(() => {
      setPhase('PAUSE_ONES');
      
      // Auto-play transition if enabled
      if (isAutoPlay) {
        animationTimeoutRef.current = setTimeout(() => {
          proceedToTwosComplement();
        }, 2000); // 2 second pause before auto-proceeding
      }
    }, 1500); // 1.5s for flip
  };

  const proceedToTwosComplement = () => {
    if (!resultData) return;
    setPhase('CASCADE');
    setCascadeStepIdx(0);
    
    const cascadeAnimation = () => {
      autoPlayIntervalRef.current = setInterval(() => {
        setCascadeStepIdx((prev) => {
          if (prev >= resultData.cascadeSteps.length - 1) {
            clearInterval(autoPlayIntervalRef.current!);
            setPhase('DONE');
            return prev;
          }
          return prev + 1;
        });
      }, 800); // 800ms per carry step
    };

    // Start cascade after a brief pause
    animationTimeoutRef.current = setTimeout(cascadeAnimation, 300);
  };

  const pauseAnimation = () => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current);
    setPhase('PAUSED');
  };

  const resumeAnimation = () => {
    if (phase === 'PAUSED') {
      if (phase === 'PAUSED') {
        // Figure out which phase we were in before pausing
        if (cascadeStepIdx >= 0) {
          setPhase('CASCADE');
          autoPlayIntervalRef.current = setInterval(() => {
            setCascadeStepIdx((prev) => {
              if (resultData && prev >= resultData.cascadeSteps.length - 1) {
                clearInterval(autoPlayIntervalRef.current!);
                setPhase('DONE');
                return prev;
              }
              return prev + 1;
            });
          }, 800);
        } else if (phase === 'PAUSE_ONES' || phase === 'FLIP') {
          startAnimation();
        }
      }
    }
  };

  const renderBitRow = () => {
    if (!resultData) return null;
    
    const { originalValue, onesComplement, cascadeSteps, twosComplement } = resultData;
    const length = originalValue.length;
    const columns = Array.from({ length }, (_, i) => length - 1 - i);

    return (
      <div className="flex flex-col items-center space-y-8 font-mono text-3xl font-bold">
        {/* Cascade Carry Bubbles */}
        {(phase === 'CASCADE' || phase === 'DONE') && (
          <div className="flex space-x-4 h-10 text-sm text-emerald-500">
            {columns.map(col => {
              const step = cascadeSteps.find(s => s.column === col);
              const isVisible = step && cascadeSteps.indexOf(step) <= cascadeStepIdx;
              const isCurrent = step && cascadeSteps.indexOf(step) === cascadeStepIdx;
              
              return (
                <div key={`carry-${col}`} className="w-12 flex justify-center items-center">
                  {isVisible && step?.carryOut !== '0' && (
                    <span className={`bg-emerald-500/20 px-2 py-1 rounded-full border border-emerald-500/50 font-bold transition-all ${isCurrent ? 'scale-125 animate-bounce' : 'scale-100'}`}>
                      {step?.carryOut}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Bit Row */}
        <div className="flex space-x-4">
          {columns.map((col, idx) => {
            const originalBit = originalValue[idx];
            const flippedBit = onesComplement[idx];
            
            let displayBit = originalBit;
            let cssClass = "w-12 h-16 flex items-center justify-center border-2 rounded-md transition-all duration-700 font-bold text-lg";

            if (phase === 'IDLE') {
              cssClass += " border-border bg-muted/30 text-muted-foreground";
            } else if (phase === 'FLIP') {
              displayBit = flippedBit;
              // Highlight inverted bits
              const wasFlipped = originalBit !== flippedBit;
              cssClass += wasFlipped 
                ? " border-primary text-primary bg-primary/15 scale-105" 
                : " border-border bg-muted/30 text-muted-foreground";
            } else if (phase === 'PAUSE_ONES') {
              displayBit = flippedBit;
              cssClass += " border-primary text-primary bg-primary/10";
            } else if (phase === 'CASCADE' || phase === 'DONE' || phase === 'PAUSED') {
              const step = cascadeSteps.find(s => s.column === col);
              if (step && cascadeSteps.indexOf(step) <= cascadeStepIdx) {
                displayBit = step.resultBit;
                const isCurrent = cascadeSteps.indexOf(step) === cascadeStepIdx;
                cssClass += isCurrent
                  ? " border-emerald-500 text-emerald-500 bg-emerald-500/15 scale-110 shadow-lg shadow-emerald-500/30"
                  : " border-emerald-500 text-emerald-500 bg-emerald-500/10";
              } else {
                displayBit = flippedBit;
                cssClass += " border-primary text-primary bg-primary/10";
              }
            }

            return (
              <div key={`bit-${col}`} className={cssClass}>
                {displayBit}
              </div>
            );
          })}
        </div>

        {/* Phase Label & Status */}
        <div className="text-center space-y-2">
          <div className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">
            {phase === 'IDLE' && ' Original Binary'}
            {phase === 'FLIP' && " Step 1: 1's Complement (Bits Inverted)"}
            {phase === 'PAUSE_ONES' && " Pause at 1's Complement"}
            {phase === 'CASCADE' && " Step 2: Adding +1 for 2's Complement"}
            {phase === 'DONE' && " 2's Complement Complete"}
            {phase === 'PAUSED' && '⏸ Animation Paused'}
          </div>
          
          {/* Show Current Values */}
          {resultData && (phase !== 'IDLE') && (
            <div className="text-xs text-muted-foreground font-mono space-y-1">
              <div>Original: {originalValue}</div>
              {(phase !== 'IDLE') && <div className="text-primary">1's Complement: {onesComplement}</div>}
              {(phase === 'CASCADE' || phase === 'DONE' || phase === 'PAUSED') && (
                <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                  2's Complement: {twosComplement}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const getExplanationText = () => {
    switch (phase) {
      case 'IDLE':
        return "1's complement is found by inverting (flipping) every bit. 2's complement is found by inverting all bits, then adding 1. This is the standard way to represent negative numbers in modern computers.";
      case 'FLIP':
      case 'PAUSE_ONES':
        return "Step 1: Invert all bits. Notice how every 0 becomes 1, and every 1 becomes 0. This is the 1's complement representation.";
      case 'CASCADE':
      case 'PAUSED':
        return "Step 2: Add 1 to the 1's complement. The carry cascades from right to left through any consecutive 1-bits. Each bit that participates in the cascade lights up.";
      case 'DONE':
        return "Complete! The final result is the 2's complement, which is how negative numbers are represented in nearly all modern computers. 2's complement is preferred because it has a single zero and avoids the double-zero problem of 1's complement.";
      default:
        return "";
    }
  };

  const getRuleCardText = () => {
    return {
      title: "2's Complement Representation",
      steps: [
        "1's Complement: Invert all bits (0→1, 1→0)",
        "2's Complement: Take 1's complement, then add 1",
        "Result: Standard way to represent signed integers in binary",
      ]
    };
  };

  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
      if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current);
    };
  }, []);

  return (
    <div className="w-full space-y-6">
      <Card className="bg-card overflow-hidden">
        <CardHeader>
          <CardTitle>1's & 2's Complements</CardTitle>
          <p className="text-sm text-muted-foreground">
            Visualize bit inversions and cascade carries
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Section */}
          <div className="flex gap-3 items-end flex-wrap">
            <div>
              <label className="text-sm">Binary Input</label>
              <Input 
                value={binaryInput} 
                onChange={e => setBinaryInput(e.target.value.replace(/[^01]/g, ''))} 
                className="w-48 font-mono tracking-widest text-lg" 
                placeholder="e.g., 10110"
              />
            </div>
            <Button onClick={calculateComplements} variant="outline">
              Load
            </Button>
          </div>

          {/* Display Options */}
          {resultData && (
            <div className="flex items-center gap-6 text-sm display-options bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Switch
                  id="rule-toggle"
                  checked={showRuleCard}
                  onCheckedChange={setShowRuleCard}
                  className="scale-90"
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
                  className="scale-90"
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
                  className="scale-90"
                />
                <Label
                  htmlFor="autoplay-toggle"
                  className="cursor-pointer text-xs text-muted-foreground"
                >
                  Auto-play
                </Label>
              </div>
            </div>
          )}

          {/* Animation Area */}
          <div className="py-12 bg-muted/10 border border-border rounded-lg relative">
            <style>{`
              .rotate-x-360 {
                transform: rotateX(360deg);
              }
              @keyframes flipIn {
                0% { transform: rotateX(-90deg); opacity: 0; }
                50% { opacity: 1; }
                100% { transform: rotateX(0deg); opacity: 1; }
              }
              .bit-flip {
                animation: flipIn 0.7s ease-out;
              }
            `}</style>
            {renderBitRow()}
          </div>

          {/* Playback Controls */}
          {resultData && (
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={startAnimation}
                disabled={phase !== 'IDLE' && phase !== 'DONE'}
                className="gap-2"
              >
                <Play className="h-4 w-4" />
                {phase === 'DONE' ? 'Replay' : 'Start Animation'}
              </Button>

              {phase !== 'IDLE' && phase !== 'DONE' && (
                <>
                  <Button
                    variant="outline"
                    onClick={pauseAnimation}
                    disabled={phase === 'PAUSED'}
                    className="gap-2"
                  >
                    <Pause className="h-4 w-4" />
                    Pause
                  </Button>

                  {phase === 'PAUSED' && (
                    <Button
                      variant="outline"
                      onClick={resumeAnimation}
                      className="gap-2"
                    >
                      <Play className="h-4 w-4" />
                      Resume
                    </Button>
                  )}
                </>
              )}

              <Button
                variant="outline"
                onClick={resetAnimation}
                disabled={phase === 'IDLE'}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>

              {/* Continue Button for 1's Complement Pause */}
              {phase === 'PAUSE_ONES' && (
                <Button
                  onClick={proceedToTwosComplement}
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  <ChevronRight className="h-4 w-4" />
                  Continue to 2's Complement
                </Button>
              )}
            </div>
          )}

          {/* Explanation Panel */}
          {showExplanation && resultData && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-3">
              <h4 className="font-semibold text-sm text-foreground">Explanation</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {getExplanationText()}
              </p>
            </div>
          )}

          {/* Rule Card Panel */}
          {showRuleCard && resultData && (
            <div className="p-4 bg-muted/50 border border-border rounded-lg space-y-3">
              <h4 className="font-semibold text-sm text-foreground">How it Works</h4>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                {getRuleCardText().steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ComplementBitRow;
