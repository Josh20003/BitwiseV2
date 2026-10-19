import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { apiService } from '@/services/api.service';
import { StepExplanationCard } from '@/components/common/StepExplanationCard';
import { buildArithmeticTraceSteps } from '@/utils/stepTraceHelpers';

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
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const calculate = async (op1 = operand1, op2 = operand2, op = operation) => {
    try {
      setError(null);
      const data = await apiService.post<{
        success: boolean;
        result: ArithmeticResult;
        error?: string;
      }>('/calculator/arithmetic', {
        operand1: op1,
        operand2: op2,
        operation: op,
      });
      if (data.success && data.result) {
        setResultData(data.result);
        setCurrentStepIndex(0);
      } else {
        setError(data.error || 'Calculation failed');
      }
    } catch (e) {
      console.error('Arithmetic failed', e);
    }
  };

  useEffect(() => {
    // Initial calculation on mount to match mockup state
    calculate('1011', '110', '+');
  }, []);

  const handleNextStep = () => {
    if (resultData && currentStepIndex < resultData.traceSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const renderMultiplicationWorkspace = () => {
    if (!resultData) return null;
    const { traceSteps } = resultData;
    const maxLength = Math.max(
      resultData.operand1.length,
      resultData.operand2.length,
      resultData.result.length,
    );

    const currentStep = traceSteps[currentStepIndex];

    return (
      <div className="flex flex-col items-end space-y-2 mt-4 font-mono text-[clamp(0.75rem,4vw,1.5rem)] font-bold bg-muted/20 p-4 sm:p-8 rounded-xl border border-border w-full">
        <div className="flex space-x-[0.2em] tracking-widest">
          <span className="w-[1.2em] text-transparent">*</span>
          {resultData.operand1
            .padStart(maxLength, ' ')
            .split('')
            .map((char, i) => (
              <div key={`m-op1-${i}`} className="w-[1.2em] text-center">
                {char.trim() ? char : '\u00A0'}
              </div>
            ))}
        </div>
        <div className="flex space-x-[0.2em] tracking-widest border-b-[0.2em] border-foreground pb-2">
          <span className="w-[1.2em] text-muted-foreground">*</span>
          {resultData.operand2
            .padStart(maxLength, ' ')
            .split('')
            .map((char, i) => {
              const bitIndex = resultData.operand2.length - 1 - i;
              const isCurrentBit =
                currentStepIndex >= 0 && bitIndex === currentStepIndex;
              return (
                <div
                  key={`m-op2-${i}`}
                  className={`w-[1.2em] text-center transition-all duration-300 ${isCurrentBit ? 'text-primary scale-125' : ''}`}
                >
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

          const ppPadded = (step.partialProduct || '0').padStart(
            maxLength,
            ' ',
          );
          return (
            <div
              key={`m-pp-${idx}`}
              className={`flex space-x-[0.2em] tracking-widest transition-colors duration-500 ${isCurrent ? 'text-emerald-500' : 'text-muted-foreground'}`}
            >
              <span className="w-[1.2em] text-transparent">+</span>
              {ppPadded.split('').map((char, i) => (
                <div key={`pp-${idx}-${i}`} className="w-[1.2em] text-center">
                  {char.trim() ? char : '\u00A0'}
                </div>
              ))}
            </div>
          );
        })}

        {/* Result */}
        <div className="flex space-x-[0.2em] tracking-widest border-t-[0.2em] border-foreground pt-2">
          <span className="w-[1.2em] text-transparent">=</span>
          {currentStepIndex >= traceSteps.length - 1 ? (
            resultData.result
              .padStart(maxLength, ' ')
              .split('')
              .map((char, i) => (
                <div
                  key={`m-res-${i}`}
                  className="w-[1.2em] text-center text-primary transition-colors duration-500"
                >
                  {char.trim() ? char : '\u00A0'}
                </div>
              ))
          ) : (
            (currentStep?.currentTotal || '0')
              .padStart(maxLength, ' ')
              .split('')
              .map((char, i) => (
                <div
                  key={`m-res-cur-${i}`}
                  className="w-[1.2em] text-center text-foreground transition-colors duration-500"
                >
                  {char.trim() ? char : '\u00A0'}
                </div>
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
      <div className="flex flex-col items-start mt-4 font-mono text-base sm:text-lg font-bold bg-muted/20 p-4 sm:p-8 rounded-xl border border-border w-full">
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
              <div
                key={`d-step-${idx}`}
                className={`pl-4 border-l-2 ${isCurrent ? 'border-primary' : 'border-border'} py-2`}
              >
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
            {traceSteps
              .slice(0, currentStepIndex + 1)
              .map((s) => s.quotientBit)
              .join('')}
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
    const maxLength = Math.max(
      resultData.operand1.length,
      resultData.operand2.length,
      resultData.result.length,
    );
    const op1Pad = resultData.operand1.padStart(maxLength, '0');
    const op2Pad = resultData.operand2.padStart(maxLength, '0');

    // Create column array from MSB to LSB
    const columns = Array.from(
      { length: maxLength },
      (_, i) => maxLength - 1 - i,
    );

    return (
      <div className="flex flex-col items-center space-y-3 font-mono font-bold bg-[#090d18] p-6 sm:p-10 rounded-2xl border border-border/70 w-full text-2xl sm:text-3xl">
        {/* Carries / Borrows row */}
        <div className="flex space-x-4 sm:space-x-6 mb-1 h-8 text-xs sm:text-sm text-muted-foreground items-center justify-end w-full max-w-[280px]">
          <span className="w-6"></span> {/* Operator padding */}
          {columns.map((col) => {
            const step = traceSteps.find((s) => s.column === col);
            const isVisible =
              step && traceSteps.indexOf(step) <= currentStepIndex;
            const isCurrent =
              step && traceSteps.indexOf(step) === currentStepIndex;

            let bubbleVal = '0';
            if (isVisible && step.carryOut !== '0') {
              bubbleVal = step.carryOut;
            }

            return (
              <div
                key={`carry-${col}`}
                className={`w-8 h-8 rounded-full border border-border/60 bg-muted/30 flex items-center justify-center text-xs transition-all duration-300 ${
                  isCurrent
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400 font-extrabold scale-110 shadow-sm shadow-emerald-500/30'
                    : isVisible && bubbleVal !== '0'
                      ? 'border-blue-500/50 bg-blue-500/10 text-blue-400'
                      : 'text-muted-foreground/40'
                }`}
              >
                {bubbleVal}
              </div>
            );
          })}
        </div>

        {/* Operand 1 */}
        <div className="flex space-x-4 sm:space-x-6 tracking-widest text-foreground justify-end w-full max-w-[280px]">
          <span className="w-6 text-transparent">{operation}</span>
          {columns.map((col) => (
            <div key={`op1-${col}`} className="w-8 text-center">
              {op1Pad[maxLength - 1 - col] || '0'}
            </div>
          ))}
        </div>

        {/* Operand 2 & Operator */}
        <div className="flex space-x-4 sm:space-x-6 tracking-widest text-foreground border-b-2 border-foreground/80 pb-3 justify-end w-full max-w-[280px]">
          <span className="w-6 text-muted-foreground">{operation}</span>
          {columns.map((col) => (
            <div key={`op2-${col}`} className="w-8 text-center">
              {op2Pad[maxLength - 1 - col] || '0'}
            </div>
          ))}
        </div>

        {/* Result */}
        <div className="flex space-x-4 sm:space-x-6 tracking-widest pt-2 justify-end w-full max-w-[280px]">
          <span className="w-6 text-transparent">=</span>
          {columns.map((col) => {
            const step = traceSteps.find((s) => s.column === col);
            const isVisible =
              step && traceSteps.indexOf(step) <= currentStepIndex;
            const isCurrent =
              step && traceSteps.indexOf(step) === currentStepIndex;
            return (
              <div
                key={`res-${col}`}
                className={`w-8 text-center transition-colors duration-300 ${
                  isCurrent
                    ? 'text-emerald-400 font-extrabold scale-105'
                    : isVisible
                      ? 'text-foreground'
                      : 'text-muted-foreground/20'
                }`}
              >
                {isVisible ? step?.resultBit || '0' : '·'}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-6">
      <Card className="bg-card border-border overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl sm:text-2xl font-bold">
            Binary Arithmetic Workspace
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Explore binary addition and subtraction with live vertical notation.
            Watch carry and borrow bubbles appear as you step through the calculation.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls Input Row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-4">
              <label className="text-xs font-medium text-foreground block mb-1.5">
                Operand 1 (Binary)
              </label>
              <Input
                value={operand1}
                onChange={(e) =>
                  setOperand1(e.target.value.replace(/[^01]/g, ''))
                }
                className="w-full font-mono text-sm h-9 bg-background"
                placeholder="1011"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="text-xs font-medium text-foreground block mb-1.5">
                Operation
              </label>
              <select
                value={operation}
                onChange={(e) =>
                  setOperation(e.target.value as '+' | '-' | '*' | '/')
                }
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="+">Add (+)</option>
                <option value="-">Sub (-)</option>
                <option value="*">Mul (*)</option>
                <option value="/">Div (/)</option>
              </select>
            </div>
            <div className="sm:col-span-3">
              <label className="text-xs font-medium text-foreground block mb-1.5">
                Operand 2 (Binary)
              </label>
              <Input
                value={operand2}
                onChange={(e) =>
                  setOperand2(e.target.value.replace(/[^01]/g, ''))
                }
                className="w-full font-mono text-sm h-9 bg-background"
                placeholder="110"
              />
            </div>
            <div className="sm:col-span-2">
              <Button
                onClick={() => calculate()}
                className="w-full h-9 text-xs font-medium cursor-pointer"
              >
                Calculate
              </Button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-destructive/15 text-destructive rounded-md border border-destructive/30 text-xs">
              {error}
            </div>
          )}

          {resultData && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
              {/* Left Column: Vertical Notation Workspace */}
              <div className="lg:col-span-6 flex flex-col items-center w-full min-w-0">
                <div className="w-full">{renderVerticalWorkspace()}</div>

                <div className="mt-5 flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentStepIndex(0)}
                    disabled={currentStepIndex === 0}
                    className="text-xs h-8 px-4 cursor-pointer"
                  >
                    Reset
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleNextStep}
                    disabled={
                      currentStepIndex >= resultData.traceSteps.length - 1
                    }
                    className="gap-1.5 text-xs h-8 px-4 cursor-pointer"
                  >
                    Next Step
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Right Column: Calculation Trace with StepExplanationCard */}
              <div className="lg:col-span-6">
                <StepExplanationCard
                  title={`Binary ${operation === '+' ? 'Addition' : operation === '-' ? 'Subtraction' : operation === '*' ? 'Multiplication' : 'Division'} Trace`}
                  badgeText="Bit-Level Trace"
                  context={`Binary Arithmetic: ${operand1} ${operation} ${operand2} = ${resultData.result}`}
                  steps={buildArithmeticTraceSteps(resultData)}
                  currentStepIndex={currentStepIndex}
                  onStepChange={setCurrentStepIndex}
                  resultSummary={{
                    label: 'Calculation Complete',
                    value: resultData.result,
                    sublabel: `${operand1} ${operation} ${operand2}`,
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default BinaryArithmeticWorkspace;
