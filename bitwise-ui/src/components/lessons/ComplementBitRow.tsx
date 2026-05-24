import { useState } from 'react';
import { Check, X, RefreshCw } from 'lucide-react';
import { apiService } from '@/services/api.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ComplementResult {
  originalValue: string;
  onesComplement: string;
  twosComplement: string;
  cascadeSteps: any[]; // Used for carry animation
}

export function ComplementBitRow() {
  const [binaryInput, setBinaryInput] = useState('10110');
  const [resultData, setResultData] = useState<ComplementResult | null>(null);
  
  // Animation States
  const [phase, setPhase] = useState<'IDLE' | 'FLIP' | 'CASCADE' | 'DONE'>('IDLE');
  const [cascadeStepIdx, setCascadeStepIdx] = useState(-1);

  const calculateComplements = async () => {
    if (!binaryInput) return;
    try {
      const data = await apiService.get<any>(`/calculator/complement/${binaryInput}`);
      if (data.success) {
        setResultData(data.result);
        setPhase('IDLE');
        setCascadeStepIdx(-1);
      }
    } catch (e) {
      console.error("Complement error", e);
    }
  };

  const startAnimation = () => {
    if (!resultData) return;
    setPhase('FLIP');
    
    // Wait for flip animation, then start cascade
    setTimeout(() => {
      setPhase('CASCADE');
      setCascadeStepIdx(0);
      
      const interval = setInterval(() => {
        setCascadeStepIdx((prev) => {
          if (prev >= resultData.cascadeSteps.length - 1) {
            clearInterval(interval);
            setPhase('DONE');
            return prev;
          }
          return prev + 1;
        });
      }, 800); // 800ms per carry step
    }, 1500); // 1.5s for flip
  };

  const renderBitRow = () => {
    if (!resultData) return null;
    
    const { originalValue, onesComplement, cascadeSteps } = resultData;
    const length = originalValue.length;
    const columns = Array.from({ length }, (_, i) => length - 1 - i);

    return (
      <div className="flex flex-col items-center mt-8 space-y-8 font-mono text-3xl font-bold">
        {/* Cascade Carry Bubbles */}
        <div className="flex space-x-4 h-8 text-sm text-emerald-500">
          {columns.map(col => {
            if (phase !== 'CASCADE' && phase !== 'DONE') {
              return <div key={`carry-${col}`} className="w-12 text-center text-transparent">0</div>;
            }
            
            const step = cascadeSteps.find(s => s.column === col);
            const isVisible = step && cascadeSteps.indexOf(step) <= cascadeStepIdx;
            
            return (
              <div key={`carry-${col}`} className="w-12 flex justify-center">
                {isVisible && step.carryOut !== '0' && (
                  <span className="bg-emerald-500/20 px-2 py-1 rounded-full animate-bounce">
                    +{step.carryOut}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Bit Row */}
        <div className="flex space-x-4">
          {columns.map((col, idx) => {
            const originalBit = originalValue[idx];
            const flippedBit = onesComplement[idx];
            
            let displayBit = originalBit;
            let cssClass = "w-12 h-16 flex items-center justify-center border-2 rounded-md transition-all duration-700";

            if (phase === 'FLIP') {
              displayBit = flippedBit;
              cssClass += " border-primary text-primary bg-primary/10 rotate-x-360"; // custom flip
            } else if (phase === 'CASCADE' || phase === 'DONE') {
              const step = cascadeSteps.find(s => s.column === col);
              if (step && cascadeSteps.indexOf(step) <= cascadeStepIdx) {
                displayBit = step.resultBit;
                cssClass += " border-emerald-500 text-emerald-500 bg-emerald-500/10 scale-110";
              } else {
                displayBit = flippedBit;
                cssClass += " border-primary text-primary bg-primary/10";
              }
            } else {
              cssClass += " border-border bg-muted/30 text-muted-foreground";
            }

            return (
              <div key={`bit-${col}`} className={cssClass} style={{ transformStyle: 'preserve-3d' }}>
                {displayBit}
              </div>
            );
          })}
        </div>

        {/* Phase Label */}
        <div className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">
          {phase === 'IDLE' && 'Original Binary'}
          {phase === 'FLIP' && "1's Complement (Bits Inverted)"}
          {phase === 'CASCADE' && "Adding +1 for 2's Complement..."}
          {phase === 'DONE' && "2's Complement Complete"}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-6">
      <Card className="bg-card overflow-hidden">
        <CardHeader>
          <CardTitle>Complements (1's and 2's)</CardTitle>
          <p className="text-sm text-muted-foreground">
            Explore how negative numbers are represented in binary. Watch the bits invert for 1's complement, followed by the +1 cascade for 2's complement.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4 items-end">
            <div>
              <label className="text-sm">Binary Input</label>
              <Input 
                value={binaryInput} 
                onChange={e => setBinaryInput(e.target.value.replace(/[^01]/g, ''))} 
                className="w-48 font-mono tracking-widest text-lg" 
              />
            </div>
            <Button onClick={calculateComplements}>Load</Button>
            <Button 
              variant="secondary" 
              onClick={startAnimation}
              disabled={!resultData || phase !== 'IDLE'}
            >
              Start Animation
            </Button>
          </div>

          <div className="py-12 bg-muted/10 border-y border-border relative">
            {/* Added custom CSS for flip animation specifically for this component */}
            <style>
              {`
                .rotate-x-360 {
                  transform: rotateX(360deg);
                }
              `}
            </style>
            {renderBitRow()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ComplementBitRow;
