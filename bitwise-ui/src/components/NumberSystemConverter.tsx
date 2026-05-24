import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiService } from '@/services/api.service';

export function NumberSystemConverter() {
  const [sourceValue, setSourceValue] = useState('');
  const [sourceBase, setSourceBase] = useState('2');
  const [targetBase, setTargetBase] = useState('10');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const bases = [
    { value: '2', label: 'Binary (Base 2)' },
    { value: '8', label: 'Octal (Base 8)' },
    { value: '10', label: 'Decimal (Base 10)' },
    { value: '16', label: 'Hexadecimal (Base 16)' },
  ];

  const parseBase = (base: string) => parseInt(base, 10);

  const handleConvert = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiService.post<{ success: boolean, result: any, error?: string }>('/calculator/convert-multi-step', {
        value: sourceValue.trim(),
        fromBase: parseBase(sourceBase),
        toBase: parseBase(targetBase)
      });
      
      if (data.success && data.result) {
        setResult(data.result);
      } else {
        throw new Error(data.error || 'Conversion failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardContent className="space-y-6 pt-6">
          {/* Source Value Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Value to Convert</label>
            <Input
              type="text"
              placeholder="Enter number..."
              value={sourceValue}
              onChange={(e) => setSourceValue(e.target.value.toUpperCase())}
              className="font-mono"
            />
          </div>

          {/* Base Selection Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">From Base</label>
              <Select value={sourceBase} onValueChange={setSourceBase}>
                <SelectTrigger>
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

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">To Base</label>
              <Select value={targetBase} onValueChange={setTargetBase}>
                <SelectTrigger>
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
            <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm border border-destructive/20">
              {error}
            </div>
          )}

          <Button
            onClick={handleConvert}
            disabled={loading || !sourceValue}
            className="w-full"
          >
            {loading ? 'Converting...' : 'Convert'}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Conversion Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Result Display */}
            <div className="p-4 bg-muted rounded-lg border border-border space-y-2">
              <div className="text-sm text-muted-foreground">Input</div>
              <div className="text-2xl font-mono font-bold text-foreground">
                {result.sourceValue} <span className="text-muted-foreground text-lg">(base {result.sourceBase})</span>
              </div>

              <div className="text-center py-2 text-muted-foreground">↓</div>

              <div className="text-sm text-muted-foreground">Output</div>
              <div className="text-2xl font-mono font-bold text-emerald-500 dark:text-emerald-400">
                {result.targetValue} <span className="text-muted-foreground text-lg">(base {result.targetBase})</span>
              </div>
            </div>

            {/* Conversion Steps */}
            {result.steps && result.steps.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg text-foreground">Conversion Steps</h3>
                {result.steps.map((step: any, idx: number) => (
                  <div key={idx} className="p-3 border-l-4 border-primary bg-primary/5 rounded">
                    <div className="text-sm font-medium text-foreground">{step.description}</div>
                    <div className="text-sm mt-1 font-mono text-muted-foreground">{step.operation}</div>
                    <div className="text-lg font-mono font-bold text-primary mt-2">{step.result}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Explanation */}
            {result.explanation && (
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-semibold mb-2 text-foreground">Explanation</h4>
                <p className="text-sm whitespace-pre-wrap text-muted-foreground">{result.explanation}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <h4 className="font-semibold mb-1 text-foreground">Binary (Base 2)</h4>
              <p className="text-muted-foreground">Uses digits: 0, 1</p>
              <p className="text-muted-foreground/70 text-xs mt-1">Used in digital systems</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <h4 className="font-semibold mb-1 text-foreground">Octal (Base 8)</h4>
              <p className="text-muted-foreground">Uses digits: 0-7</p>
              <p className="text-muted-foreground/70 text-xs mt-1">Compact binary representation</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <h4 className="font-semibold mb-1 text-foreground">Decimal (Base 10)</h4>
              <p className="text-muted-foreground">Uses digits: 0-9</p>
              <p className="text-muted-foreground/70 text-xs mt-1">Our everyday number system</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <h4 className="font-semibold mb-1 text-foreground">Hexadecimal (Base 16)</h4>
              <p className="text-muted-foreground">Uses digits: 0-9, A-F</p>
              <p className="text-muted-foreground/70 text-xs mt-1">Used in computing and memory addressing</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default NumberSystemConverter;
