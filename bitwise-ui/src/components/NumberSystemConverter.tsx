import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeftRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiService } from '@/services/api.service';
import { StepExplanationCard } from '@/components/common/StepExplanationCard';
import { buildConverterTraceSteps } from '@/utils/stepTraceHelpers';

export function NumberSystemConverter() {
  const [sourceValue, setSourceValue] = useState('123');
  const [sourceBase, setSourceBase] = useState('8');
  const [targetBase, setTargetBase] = useState('2');
  const [result, setResult] = useState<any>(null);
  const [currentTraceStep, setCurrentTraceStep] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const bases = [
    { value: '2', label: 'Binary (Base 2)' },
    { value: '8', label: 'Octal (Base 8)' },
    { value: '10', label: 'Decimal (Base 10)' },
    { value: '16', label: 'Hexadecimal (Base 16)' },
  ];

  const parseBase = (base: string) => parseInt(base, 10);

  const handleConvert = async (val = sourceValue, sBase = sourceBase, tBase = targetBase) => {
    if (!val.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await apiService.post<{
        success: boolean;
        result: any;
        error?: string;
      }>('/calculator/convert', {
        value: val.trim(),
        fromBase: parseBase(sBase),
        toBase: parseBase(tBase),
      });

      if (data.success && data.result) {
        setResult(data.result);
      } else {
        throw new Error(data.error || 'Conversion failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during conversion');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial calculation on mount to match the mockup
    handleConvert('123', '8', '2');
  }, []);

  const handleSwapBases = () => {
    const temp = sourceBase;
    setSourceBase(targetBase);
    setTargetBase(temp);
  };

  return (
    <div className="w-full space-y-6">
      {/* Input Card */}
      <Card className="bg-card border-border overflow-hidden">
        <CardContent className="space-y-5 pt-6">
          {/* Source Value Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-foreground">
              Value to Convert
            </label>
            <Input
              type="text"
              placeholder="e.g. 123"
              value={sourceValue}
              onChange={(e) => setSourceValue(e.target.value.toUpperCase())}
              className="font-mono text-sm h-10 bg-background"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
            />
          </div>

          {/* Base Selection Row with Swap button */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full space-y-1.5">
              <label className="block text-xs font-medium text-foreground">
                From Base
              </label>
              <Select value={sourceBase} onValueChange={setSourceBase}>
                <SelectTrigger className="h-10 bg-background text-xs font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bases.map((base) => (
                    <SelectItem key={base.value} value={base.value}>
                      {base.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <button
              type="button"
              onClick={handleSwapBases}
              className="sm:mt-5 p-2 rounded-lg border border-border/70 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors shrink-0"
              title="Swap from/to bases"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </button>

            <div className="flex-1 w-full space-y-1.5">
              <label className="block text-xs font-medium text-foreground">
                To Base
              </label>
              <Select value={targetBase} onValueChange={setTargetBase}>
                <SelectTrigger className="h-10 bg-background text-xs font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bases.map((base) => (
                    <SelectItem key={base.value} value={base.value}>
                      {base.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-xs border border-destructive/20">
              {error}
            </div>
          )}

          <Button
            onClick={() => handleConvert()}
            disabled={loading || !sourceValue.trim()}
            className="w-full h-10 text-xs font-medium cursor-pointer"
          >
            {loading ? 'Converting...' : 'Convert'}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card className="bg-card border-border overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold">Conversion Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Result Display: horizontal layout matching mockup */}
            <div className="p-5 rounded-xl border border-border/70 bg-[#090d18] flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground font-medium mb-1">
                  Input
                </div>
                <div className="text-xl sm:text-2xl font-mono font-bold text-foreground">
                  {result.sourceValue}{' '}
                  <span className="text-muted-foreground text-xs sm:text-sm font-normal">
                    (base {result.sourceBase})
                  </span>
                </div>
              </div>

              <div className="text-muted-foreground text-xl font-bold px-4">→</div>

              <div>
                <div className="text-xs text-muted-foreground font-medium mb-1">
                  Output
                </div>
                <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-400">
                  {result.targetValue}{' '}
                  <span className="text-muted-foreground text-xs sm:text-sm font-normal">
                    (base {result.targetBase})
                  </span>
                </div>
              </div>
            </div>

            {/* Calculation Trace */}
            {result.steps && result.steps.length > 0 && (
              <StepExplanationCard
                title="Conversion Step-by-Step Trace"
                badgeText="Radix Transformation"
                context={`Number conversion from base ${result.sourceBase} (${result.sourceValue}) to base ${result.targetBase}`}
                steps={buildConverterTraceSteps(result)}
                currentStepIndex={currentTraceStep}
                onStepChange={setCurrentTraceStep}
                resultSummary={{
                  label: 'Conversion Complete',
                  value: `${result.targetValue} (base ${result.targetBase})`,
                  sublabel: `From ${result.sourceValue} (base ${result.sourceBase})`,
                }}
              />
            )}

            {/* Explanation if available */}
            {result.explanation && (
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 space-y-1.5">
                <h4 className="font-semibold text-xs text-foreground">
                  Summary
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {result.explanation}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Reference matching mockup */}
      <Card className="bg-card border-border overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Quick Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
            <div className="p-3.5 rounded-xl bg-[#090d18] border border-border/70 space-y-1">
              <h4 className="font-semibold text-foreground">Binary (Base 2)</h4>
              <p className="text-muted-foreground">Uses digits: 0, 1</p>
              <p className="text-muted-foreground/70 text-[11px]">
                Used in digital systems
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#090d18] border border-border/70 space-y-1">
              <h4 className="font-semibold text-foreground">Octal (Base 8)</h4>
              <p className="text-muted-foreground">Uses digits: 0-7</p>
              <p className="text-muted-foreground/70 text-[11px]">
                Compact binary representation
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#090d18] border border-border/70 space-y-1">
              <h4 className="font-semibold text-foreground">Decimal (Base 10)</h4>
              <p className="text-muted-foreground">Uses digits: 0-9</p>
              <p className="text-muted-foreground/70 text-[11px]">
                Our everyday number system
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#090d18] border border-border/70 space-y-1">
              <h4 className="font-semibold text-foreground">Hexadecimal (Base 16)</h4>
              <p className="text-muted-foreground">Uses digits: 0-9, A-F</p>
              <p className="text-muted-foreground/70 text-[11px]">
                Used in computing and memory addressing
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default NumberSystemConverter;
