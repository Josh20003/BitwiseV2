import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface SignedInterpretationResult {
  binary: string;
  bitLength: number;
  unsignedValue: number;
  signedMagnitudeValue: number;
  onesComplementValue: number;
  twosComplementValue: number;
  isNegative: boolean;
}

export function SignBitVisualizerPanel() {
  const [binaryInput, setBinaryInput] = useState('10101100');
  const [result, setResult] = useState<SignedInterpretationResult | null>(null);

  useEffect(() => {
    if (binaryInput) {
      fetch(`/api/calculator/signed/${binaryInput}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setResult(data.result);
          }
        })
        .catch(err => console.error(err));
    } else {
      setResult(null);
    }
  }, [binaryInput]);

  const toggleMSB = () => {
    if (!binaryInput) return;
    const newMsb = binaryInput[0] === '1' ? '0' : '1';
    setBinaryInput(newMsb + binaryInput.substring(1));
  };

  const setBit = (index: number) => {
    const bitArr = binaryInput.split('');
    bitArr[index] = bitArr[index] === '1' ? '0' : '1';
    setBinaryInput(bitArr.join(''));
  };

  return (
    <div className="w-full space-y-6">
      <Card className="bg-card overflow-hidden">
        <CardHeader>
          <CardTitle>Sign Bit Visualizer</CardTitle>
          <p className="text-sm text-muted-foreground">
            Click on the Most Significant Bit (MSB) to toggle the sign. Observe how it radically changes the interpretation of the number depending on the system used.
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex flex-col items-center gap-4">
            <label className="text-sm">Enter Binary</label>
            <Input 
              value={binaryInput} 
              onChange={e => setBinaryInput(e.target.value.replace(/[^01]/g, ''))} 
              className="w-64 font-mono tracking-widest text-center" 
            />
          </div>

          <div className="flex justify-center space-x-2">
            {binaryInput.split('').map((bit, idx) => {
              const isMSB = idx === 0;
              return (
                <div 
                  key={idx} 
                  className={`
                    flex flex-col items-center cursor-pointer transition-transform hover:scale-110
                  `}
                  onClick={() => isMSB ? toggleMSB() : setBit(idx)}
                >
                  <span className={`text-xs mb-1 font-semibold ${isMSB ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                    {isMSB ? 'MSB (Sign)' : `Bit ${binaryInput.length - 1 - idx}`}
                  </span>
                  <div className={`
                    w-12 h-16 flex items-center justify-center border-2 rounded-md font-mono text-2xl font-bold
                    ${isMSB 
                      ? 'border-destructive text-destructive bg-destructive/10 ring-2 ring-destructive/30' 
                      : 'border-border bg-muted/30 hover:bg-muted text-foreground'}
                  `}>
                    {bit}
                  </div>
                </div>
              );
            })}
          </div>

          {result && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-border mt-8">
              <div className="p-4 rounded-lg border bg-muted/20 text-center">
                <h4 className="text-xs text-muted-foreground uppercase font-semibold mb-2">Unsigned</h4>
                <div className="text-3xl font-bold font-mono">{result.unsignedValue}</div>
                <p className="text-[10px] text-muted-foreground mt-2">Always Positive</p>
              </div>
              <div className="p-4 rounded-lg border bg-muted/20 text-center">
                <h4 className="text-xs text-muted-foreground uppercase font-semibold mb-2">Signed Magnitude</h4>
                <div className="text-3xl font-bold font-mono">{result.signedMagnitudeValue}</div>
                <p className="text-[10px] text-muted-foreground mt-2">MSB=Sign, Rest=Value</p>
              </div>
              <div className="p-4 rounded-lg border bg-muted/20 text-center">
                <h4 className="text-xs text-muted-foreground uppercase font-semibold mb-2">1's Complement</h4>
                <div className="text-3xl font-bold font-mono">{result.onesComplementValue}</div>
                <p className="text-[10px] text-muted-foreground mt-2">Invert all bits if MSB=1</p>
              </div>
              <div className="p-4 rounded-lg border bg-emerald-500/10 border-emerald-500/30 text-center ring-1 ring-emerald-500/50 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] px-2 py-0.5 rounded-bl-lg font-bold">STANDARD</div>
                <h4 className="text-xs text-emerald-600 dark:text-emerald-400 uppercase font-semibold mb-2">2's Complement</h4>
                <div className="text-4xl font-bold font-mono text-emerald-600 dark:text-emerald-400">{result.twosComplementValue}</div>
                <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 mt-2">Invert & Add 1</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default SignBitVisualizerPanel;
