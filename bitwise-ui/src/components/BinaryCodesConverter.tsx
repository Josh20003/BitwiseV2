import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export function BinaryCodesConverter() {
  const [inputValue, setInputValue] = useState('');

  // ASCII Conversion
  const renderASCII = () => {
    return (
      <div className="flex flex-col space-y-4">
        <h4 className="font-semibold text-primary">ASCII Translator</h4>
        <div className="flex flex-wrap gap-4">
          {inputValue.split('').map((char, idx) => {
            const code = char.charCodeAt(0);
            const binary = code.toString(2).padStart(8, '0');
            return (
              <div key={`ascii-${idx}`} className="flex flex-col items-center">
                <span className="text-xl font-bold border-b-2 border-primary mb-2 w-full text-center pb-1">{char}</span>
                <span className="text-xs text-muted-foreground mb-1">Decimal: {code}</span>
                <div className="flex space-x-1">
                  {binary.split('').map((bit, bIdx) => (
                    <div 
                      key={`bit-${bIdx}`} 
                      className="w-6 h-8 flex items-center justify-center bg-primary/10 border border-primary/30 rounded text-sm font-mono"
                    >
                      {bit}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {inputValue.length === 0 && (
            <div className="text-muted-foreground italic text-sm">Type characters to see ASCII conversion...</div>
          )}
        </div>
      </div>
    );
  };

  // BCD Conversion
  const renderBCD = () => {
    // Extract only digits for BCD
    const digitsOnly = inputValue.replace(/\D/g, '');

    return (
      <div className="flex flex-col space-y-4 h-full border-l border-border pl-6">
        <h4 className="font-semibold text-emerald-500">BCD (Binary Coded Decimal)</h4>
        <div className="flex flex-wrap gap-4">
          {digitsOnly.split('').map((digit, idx) => {
            const num = parseInt(digit, 10);
            const binary = num.toString(2).padStart(4, '0');
            return (
              <div key={`bcd-${idx}`} className="flex flex-col items-center">
                <span className="text-xl font-bold border-b-2 border-emerald-500 mb-2 w-full text-center pb-1">{digit}</span>
                <div className="flex space-x-1 mt-6">
                  {binary.split('').map((bit, bIdx) => (
                    <div 
                      key={`bcdbit-${bIdx}`} 
                      className="w-8 h-8 flex items-center justify-center bg-emerald-500/10 border border-emerald-500/30 rounded text-sm font-mono text-emerald-600 dark:text-emerald-400 font-bold"
                    >
                      {bit}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {digitsOnly.length === 0 && (
            <div className="text-muted-foreground italic text-sm">Type numbers to see BCD conversion...</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-6">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Binary Codes Translator</CardTitle>
          <p className="text-sm text-muted-foreground">
            Live split-screen translator: Left panel animates 8-bit ASCII equivalent while the right panel isolates numeric digits into 4-bit BCD clusters.
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="max-w-md mx-auto">
            <label className="text-sm font-medium">Input String</label>
            <Input 
              value={inputValue} 
              onChange={e => setInputValue(e.target.value)} 
              placeholder="Enter text or numbers..."
              className="text-lg mt-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
            {renderASCII()}
            {renderBCD()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default BinaryCodesConverter;
