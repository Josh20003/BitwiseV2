import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiService } from '@/services/api.service';

interface ArithmeticTraceStep {
  id: string;
  column: number;
  description: string;
  topBit: string;
  bottomBit: string;
  carryIn: string;
  carryOut: string;
  resultBit: string;
  partialProduct?: string;
  shift?: number;
  currentTotal?: string;
  dividend?: string;
  divisor?: string;
  quotientBit?: string;
  remainder?: string;
}

interface ArithmeticResult {
  operation: '+' | '-' | '*' | '/';
  operand1: string;
  operand2: string;
  result: string;
  traceSteps: ArithmeticTraceStep[];
}

export function BinaryArithmeticWorkspace() {
  const [operand1, setOperand1] = useState('1011');
  const [operand2, setOperand2] = useState('110');
  const [operation, setOperation] = useState<'+' | '-' | '*' | '/'>('+');
  const [error, setError] = useState<string | null>(null);
  
  const [resultData, setResultData] = useState<ArithmeticResult | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);

  const calculate = async () => {
    try {
      const data = await apiService.post<{ success: boolean, result: ArithmeticResult, error?: string }>('/calculator/arithmetic', { operand1, operand2, operation });
      if (data.success && data.result) {
        setResultData(data.result);
        setCurrentStepIndex(0);
      } else {
        setError(data.error || 'Calculation failed');
      }   } catch (e) {
      console.error("Arithmetic failed", e);
    }
  };

  const handleNextStep = () => {
    if (resultData && currentStepIndex < resultData.traceSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const renderMultiplicationWorkspace = () => {
    if (!resultData) return null;
    const { traceSteps } = resultData;
    const maxLength = Math.max(resultData.operand1.length, resultData.operand2.length, resultData.result.length);
    
    const currentStep = traceSteps[currentStepIndex];
    
    return (
      <div className="flex flex-col items-end space-y-2 mt-8 font-mono text-[clamp(0.75rem,4vw,1.5rem)] font-bold bg-muted/20 p-4 sm:p-8 rounded-lg border border-border w-full">
        <div className="flex space-x-[0.2em] tracking-widest">
          <span className="w-[1.2em] text-transparent">*</span>
          {resultData.operand1.padStart(maxLength, ' ').split('').map((char, i) => (
            <div key={`m-op1-${i}`} className="w-[1.2em] text-center">{char.trim() ? char : '\u00A0'}</div>
          ))}
        </div>
        <div className="flex space-x-[0.2em] tracking-widest border-b-[0.2em] border-foreground pb-2">
          <span className="w-[1.2em] text-muted-foreground">*</span>
          {resultData.operand2.padStart(maxLength, ' ').split('').map((char, i) => {
            const bitIndex = resultData.operand2.length - 1 - i;
            const isCurrentBit = currentStepIndex >= 0 && bitIndex === currentStepIndex;
            return (
              <div key={`m-op2-${i}`} className={`w-[1.2em] text-center transition-all duration-300 ${isCurrentBit ? 'text-primary scale-125' : ''}`}>
                {char.trim() ? char : '\u00A0'}
              </div>
            );
          })}
        </div>
        
        {/* Partial Products */}
        {traceSteps.map((step, idx) => {
          const isVisible = idx <= currentStepIndex;
          if (!isVisible) return null;
          const isCurrent = idx === currentStepIndex;
          
          const ppPadded = (step.partialProduct || '0').padStart(maxLength, ' ');
          return (
            <div key={`m-pp-${idx}`} className={`flex space-x-[0.2em] tracking-widest transition-colors duration-500 ${isCurrent ? 'text-emerald-500' : 'text-muted-foreground'}`}>
               <span className="w-[1.2em] text-transparent">+</span>
               {ppPadded.split('').map((char, i) => (
                  <div key={`pp-${idx}-${i}`} className="w-[1.2em] text-center">{char.trim() ? char : '\u00A0'}</div>
               ))}
            </div>
          );
        })}

        {/* Result */}
        <div className="flex space-x-[0.2em] tracking-widest border-t-[0.2em] border-foreground pt-2">
          <span className="w-[1.2em] text-transparent">=</span>
          {currentStepIndex >= traceSteps.length - 1 ? (
             resultData.result.padStart(maxLength, ' ').split('').map((char, i) => (
                <div key={`m-res-${i}`} className="w-[1.2em] text-center text-primary transition-colors duration-500">{char.trim() ? char : '\u00A0'}</div>
             ))
          ) : (
             (currentStep?.currentTotal || '0').padStart(maxLength, ' ').split('').map((char, i) => (
                <div key={`m-res-cur-${i}`} className="w-[1.2em] text-center text-foreground transition-colors duration-500">{char.trim() ? char : '\u00A0'}</div>
             ))
          )}
        </div>
      </div>
    );
  };

  const renderDivisionWorkspace = () => {
    if (!resultData) return null;
    const { traceSteps } = resultData;
    
    return (
      <div className="flex flex-col items-start mt-8 font-mono text-lg sm:text-xl font-bold bg-muted/20 p-4 sm:p-8 rounded-lg border border-border w-full">
        <div className="flex space-x-4 mb-4">
          <div className="text-muted-foreground">Divisor:</div>
          <div className="text-primary">{resultData.operand2}</div>
        </div>
        <div className="flex space-x-4 mb-4 border-b pb-4 w-full">
          <div className="text-muted-foreground">Dividend:</div>
          <div className="tracking-widest">{resultData.operand1}</div>
        </div>
        
        {/* Steps */}
        <div className="w-full space-y-4">
          {traceSteps.map((step, idx) => {
            const isVisible = idx <= currentStepIndex;
            if (!isVisible) return null;
            const isCurrent = idx === currentStepIndex;
            
            return (
              <div key={`d-step-${idx}`} className={`pl-4 border-l-2 ${isCurrent ? 'border-primary' : 'border-border'} py-2`}>
                <div className="flex space-x-4">
                  <span className="text-muted-foreground">Current Dividend:</span>
                  <span className="tracking-widest">{step.dividend}</span>
                </div>
                {step.quotientBit === '1' && (
                  <div className="flex space-x-4 text-emerald-500">
                    <span className="text-muted-foreground">-</span>
                    <span className="tracking-widest">{step.divisor}</span>
                  </div>
                )}
                <div className="flex space-x-4 border-t border-border/50 mt-1 pt-1">
                  <span className="text-muted-foreground">Remainder:</span>
                  <span className="tracking-widest">{step.remainder}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex space-x-4 mt-6 pt-4 border-t w-full">
          <div className="text-muted-foreground">Quotient so far:</div>
          <div className="text-primary tracking-widest">
            {traceSteps.slice(0, currentStepIndex + 1).map(s => s.quotientBit).join('')}
          </div>
        </div>
      </div>
    );
  };

  const renderVerticalWorkspace = () => {
    if (!resultData) return null;

    if (resultData.operation === '*') return renderMultiplicationWorkspace();
    if (resultData.operation === '/') return renderDivisionWorkspace();

    const { traceSteps } = resultData;
    const maxLength = Math.max(resultData.operand1.length, resultData.operand2.length, resultData.result.length); // account for multiplication expansion
    const op1Pad = resultData.operand1.padStart(maxLength, '0');
    const op2Pad = resultData.operand2.padStart(maxLength, '0');

    // Create column array from MSB to LSB
    const columns = Array.from({ length: maxLength }, (_, i) => maxLength - 1 - i);

    return (
      <div className="flex flex-col items-end space-y-2 mt-8 font-mono text-[clamp(0.75rem,4vw,1.5rem)] font-bold bg-muted/20 p-4 sm:p-8 rounded-lg border border-border w-full">
        {/* Carries / Borrows */}
        <div className="flex space-x-[0.2em] mb-2 h-[1.5em] text-[0.6em] text-primary/80 items-end">
          <span className="w-[1.2em]"></span> {/* Operator padding */}
          {columns.map(col => {
            const step = traceSteps.find(s => s.column === col);
            const isVisible = step && traceSteps.indexOf(step) <= currentStepIndex;
            const isCurrent = step && traceSteps.indexOf(step) === currentStepIndex;
            
            let bubbleVal = '';
            if (isVisible && step.carryOut !== '0') {
              bubbleVal = step.carryOut;
            }

            return (
              <div 
                key={`carry-${col}`} 
                className={`w-[1.2em] text-center transition-all duration-300 ${isCurrent ? 'scale-125 text-emerald-500 font-extrabold' : ''}`}
              >
                {bubbleVal ? (
                  <span className="bg-primary/20 rounded-full px-[0.4em] py-[0.2em] shadow-sm border border-primary/30">
                    {bubbleVal}
                  </span>
                ) : <span className="text-transparent">0</span>}
              </div>
            );
          })}
        </div>

        {/* Operand 1 */}
        <div className="flex space-x-[0.2em] tracking-widest">
          <span className="w-[1.2em] text-transparent">{operation}</span>
          {columns.map(col => (
            <div key={`op1-${col}`} className="w-[1.2em] text-center">
              {op1Pad[maxLength - 1 - col] || '0'}
            </div>
          ))}
        </div>

        {/* Operand 2 & Operator */}
        <div className="flex space-x-[0.2em] tracking-widest border-b-[0.2em] border-foreground pb-2">
          <span className="w-[1.2em] text-muted-foreground">{operation}</span>
          {columns.map(col => (
            <div key={`op2-${col}`} className="w-[1.2em] text-center">
              {op2Pad[maxLength - 1 - col] || '0'}
            </div>
          ))}
        </div>

        {/* Result */}
        <div className="flex space-x-[0.2em] tracking-widest pt-2">
          <span className="w-[1.2em] text-transparent">=</span>
          {columns.map(col => {
            const step = traceSteps.find(s => s.column === col);
            const isVisible = step && traceSteps.indexOf(step) <= currentStepIndex;
            const isCurrent = step && traceSteps.indexOf(step) === currentStepIndex;
            return (
              <div 
                key={`res-${col}`} 
                className={`w-[1.2em] text-center transition-colors duration-500 ${isCurrent ? 'text-primary' : isVisible ? 'text-foreground' : 'text-transparent'}`}
              >
                {step?.resultBit || '0'}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-6">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Binary Arithmetic Workspace</CardTitle>
          <p className="text-sm text-muted-foreground">
            Explore binary addition and subtraction with live vertical notation. Watch carry and borrow bubbles appear as you step through the calculation.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end w-full">
            <div className="w-full sm:flex-1">
              <label className="text-sm block mb-1">Operand 1 (Binary)</label>
              <Input value={operand1} onChange={e => setOperand1(e.target.value.replace(/[^01]/g, ''))} className="w-full font-mono" />
            </div>
            <div className="w-full sm:w-auto">
              <label className="text-sm block mb-1">Operation</label>
              <select 
                value={operation} 
                onChange={e => setOperation(e.target.value as '+' | '-' | '*' | '/')}
                className="flex h-10 w-full sm:w-28 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="+">Add (+)</option>
                <option value="-">Sub (-)</option>
                <option value="*">Mul (*)</option>
                <option value="/">Div (/)</option>
              </select>
            </div>
            <div className="w-full sm:flex-1">
              <label className="text-sm block mb-1">Operand 2 (Binary)</label>
              <Input value={operand2} onChange={e => setOperand2(e.target.value.replace(/[^01]/g, ''))} className="w-full font-mono" />
            </div>
            <Button onClick={calculate} className="w-full sm:w-auto mt-2 sm:mt-0 h-10">Calculate</Button>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-destructive/15 text-destructive rounded-md border border-destructive/30 text-sm">
              {error}
            </div>
          )}

          {resultData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="flex flex-col items-center w-full min-w-0">
                <div className="w-full pb-4">
                  {renderVerticalWorkspace()}
                </div>
                
                <div className="mt-6 flex gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStepIndex(-1)} 
                    disabled={currentStepIndex === -1}
                  >
                    Reset
                  </Button>
                  <Button 
                    onClick={handleNextStep} 
                    disabled={currentStepIndex >= resultData.traceSteps.length - 1}
                  >
                    Next Step
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg border h-full max-h-[400px] overflow-y-auto">
                <h4 className="font-bold mb-4">Calculation Trace</h4>
                <div className="space-y-3 text-sm">
                  {resultData.traceSteps.map((step, idx) => (
                    <div 
                      key={step.id} 
                      className={`p-3 rounded border transition-colors ${idx === currentStepIndex ? 'bg-primary/10 border-primary' : idx < currentStepIndex ? 'bg-background border-border opacity-70' : 'hidden'}`}
                    >
                      <span className="font-bold block mb-1">Step {idx + 1}</span>
                      <span className="font-mono">{step.description}</span>
                    </div>
                  ))}
                  {currentStepIndex >= resultData.traceSteps.length - 1 && (
                    <div className="p-3 bg-emerald-500/20 border border-emerald-500/50 rounded text-emerald-700 dark:text-emerald-300 font-bold mt-4">
                      Final Answer: {resultData.result}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default BinaryArithmeticWorkspace;
