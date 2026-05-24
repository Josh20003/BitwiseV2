import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MathTreeStep {
  id: string;
  operation: string;
  quotient?: string;
  remainder?: string;
  result?: string;
}

export function MathTreeLayout() {
  const [value, setValue] = useState('25');
  const [fromBase, setFromBase] = useState('10');
  const [toBase, setToBase] = useState('2');
  
  const [steps, setSteps] = useState<MathTreeStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  
  // For user self-checking
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, 'correct' | 'incorrect'>>({});

  const generateTree = async () => {
    try {
      const response = await fetch('/api/lessons/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          value,
          fromBase: parseInt(fromBase, 10),
          toBase: parseInt(toBase, 10)
        })
      });
      const data = await response.json();
      if (data.steps) {
        setSteps(data.steps);
        setCurrentStepIndex(0);
        setUserInputs({});
        setFeedback({});
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const checkUserInput = (stepId: string, expectedValue: string) => {
    const userInput = userInputs[stepId] || '';
    if (userInput.trim().toUpperCase() === expectedValue.toUpperCase()) {
      setFeedback({ ...feedback, [stepId]: 'correct' });
    } else {
      setFeedback({ ...feedback, [stepId]: 'incorrect' });
    }
  };

  return (
    <div className="w-full space-y-6">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Conversion of Number Systems (Math Tree)</CardTitle>
          <p className="text-sm text-muted-foreground">
            Visualize base conversions step-by-step. Use the 'Next Step' trigger to reveal the tree.
            You can also manually guess the remainder or result before revealing it.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4 items-end">
            <div>
              <label className="text-sm">Value</label>
              <Input value={value} onChange={e => setValue(e.target.value)} className="w-32" />
            </div>
            <div>
              <label className="text-sm">From Base</label>
              <select 
                value={fromBase} 
                onChange={e => setFromBase(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="2">Base 2</option>
                <option value="8">Base 8</option>
                <option value="10">Base 10</option>
                <option value="16">Base 16</option>
              </select>
            </div>
            <div>
              <label className="text-sm">To Base</label>
              <select 
                value={toBase} 
                onChange={e => setToBase(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="2">Base 2</option>
                <option value="8">Base 8</option>
                <option value="10">Base 10</option>
                <option value="16">Base 16</option>
              </select>
            </div>
            <Button onClick={generateTree}>Generate Tree</Button>
          </div>

          {/* Tree Rendering */}
          {steps.length > 0 && (
            <div className="p-6 bg-muted/30 rounded-lg border border-border flex flex-col items-center space-y-4">
              <div className="text-lg font-bold">
                Converting {value} (Base {fromBase}) to Base {toBase}
              </div>

              {steps.map((step, idx) => {
                if (idx > currentStepIndex) return null;
                
                const isCurrent = idx === currentStepIndex;
                const expectedValue = step.remainder || step.result || '';

                return (
                  <div 
                    key={step.id} 
                    className={`
                      w-full max-w-md p-4 rounded-lg border transition-all duration-300
                      ${isCurrent ? 'bg-primary/10 border-primary shadow-sm scale-105 z-10' : 'bg-background border-border opacity-60 scale-100'}
                    `}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-mono font-semibold">{step.operation}</span>
                      {step.quotient && <span className="text-sm text-muted-foreground">Quotient: {step.quotient}</span>}
                    </div>

                    <div className="flex gap-2 items-center">
                      <span className="text-sm font-medium">{step.remainder !== undefined ? 'Remainder:' : 'Result:'}</span>
                      
                      {/* Self Check Input */}
                      {isCurrent ? (
                        <div className="flex gap-2">
                          <Input 
                            value={userInputs[step.id] || ''}
                            onChange={(e) => setUserInputs({...userInputs, [step.id]: e.target.value})}
                            placeholder="Guess..."
                            className="w-24 h-8"
                          />
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={() => checkUserInput(step.id, expectedValue)}
                          >
                            Check
                          </Button>
                        </div>
                      ) : (
                        <span className="font-mono font-bold text-lg text-primary">{expectedValue}</span>
                      )}
                      
                      {/* Feedback Indicator */}
                      {feedback[step.id] === 'correct' && <span className="text-emerald-500 font-bold ml-2">✓ Correct! ({expectedValue})</span>}
                      {feedback[step.id] === 'incorrect' && <span className="text-destructive font-bold ml-2">✗ Try again</span>}
                    </div>
                  </div>
                );
              })}

              {currentStepIndex < steps.length - 1 ? (
                <Button onClick={handleNextStep} className="mt-4">
                  Next Step ↓
                </Button>
              ) : (
                <div className="mt-6 p-4 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-lg border border-emerald-500/50 font-bold text-center">
                  Conversion Complete! 
                  <br/>
                  <span className="text-2xl font-mono mt-2 block">
                    {steps.map(s => s.remainder).reverse().join('') || steps.map(s => s.result).join(' + ')}
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default MathTreeLayout;
