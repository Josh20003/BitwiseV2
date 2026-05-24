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

  const renderVerticalWorkspace = () => {
    if (!resultData) return null;

    const { traceSteps } = resultData;
    const maxLength = Math.max(resultData.operand1.length, resultData.operand2.length, resultData.result.length); // account for multiplication expansion
    const op1Pad = resultData.operand1.padStart(maxLength, '0');
    const op2Pad = resultData.operand2.padStart(maxLength, '0');

    // Create column array from MSB to LSB
    const columns = Array.from({ length: maxLength }, (_, i) => maxLength - 1 - i);

    return (
      <div className="flex flex-col items-end space-y-2 mt-8 font-mono text-2xl font-bold bg-muted/20 p-8 rounded-lg border border-border">
        {/* Carries / Borrows */}
        <div className="flex space-x-4 mb-2 h-8 text-sm text-primary/80">
          <span className="w-8"></span> {/* Operator padding */}
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
                className={`w-8 text-center transition-all duration-300 ${isCurrent ? 'scale-125 text-emerald-500 font-extrabold' : ''}`}
              >
                {bubbleVal ? (
                  <span className="bg-primary/20 rounded-full px-2 py-1 shadow-sm border border-primary/30">
                    {bubbleVal}
                  </span>
                ) : <span className="text-transparent">0</span>}
              </div>
            );
          })}
        </div>

        {/* Operand 1 */}
        <div className="flex space-x-4 tracking-widest">
          <span className="w-8 text-transparent">{operation}</span>
          {columns.map(col => (
            <div key={`op1-${col}`} className="w-8 text-center">
              {op1Pad[maxLength - 1 - col] || '0'}
            </div>
          ))}
        </div>

        {/* Operand 2 & Operator */}
        <div className="flex space-x-4 tracking-widest border-b-4 border-foreground pb-2">
          <span className="w-8 text-muted-foreground">{operation}</span>
          {columns.map(col => (
            <div key={`op2-${col}`} className="w-8 text-center">
              {op2Pad[maxLength - 1 - col] || '0'}
            </div>
          ))}
        </div>

        {/* Result */}
        <div className="flex space-x-4 tracking-widest pt-2">
          <span className="w-8 text-transparent">=</span>
          {columns.map(col => {
            const step = traceSteps.find(s => s.column === col);
            const isVisible = step && traceSteps.indexOf(step) <= currentStepIndex;
            const isCurrent = step && traceSteps.indexOf(step) === currentStepIndex;
            return (
              <div 
                key={`res-${col}`} 
                className={`w-8 text-center transition-colors duration-500 ${isCurrent ? 'text-primary' : isVisible ? 'text-foreground' : 'text-transparent'}`}
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
          <div className="flex gap-4 items-end">
            <div>
              <label className="text-sm">Operand 1 (Binary)</label>
              <Input value={operand1} onChange={e => setOperand1(e.target.value.replace(/[^01]/g, ''))} className="w-32 font-mono" />
            </div>
            <div>
              <label className="text-sm">Operation</label>
              <select 
                value={operation} 
                onChange={e => setOperation(e.target.value as '+' | '-' | '*' | '/')}
                className="flex h-10 w-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="+">Add (+)</option>
                <option value="-">Sub (-)</option>
                <option value="*">Mul (*)</option>
                <option value="/">Div (/)</option>
              </select>
            </div>
            <div>
              <label className="text-sm">Operand 2 (Binary)</label>
              <Input value={operand2} onChange={e => setOperand2(e.target.value.replace(/[^01]/g, ''))} className="w-32 font-mono" />
            </div>
            <Button onClick={calculate}>Calculate</Button>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-destructive/15 text-destructive rounded-md border border-destructive/30 text-sm">
              {error}
            </div>
          )}

          {resultData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="flex flex-col items-center">
                {renderVerticalWorkspace()}
                
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
