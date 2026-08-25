import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

// PositionalWeightDisplay component
const PositionalWeightDisplay = ({ base, value }: { base: number, value: string }) => {
  if (!value) return null;
  
  // Split parts to handle decimals
  const [integerPart, fractionalPart] = value.split('.');
  
  return (
    <div className="mt-2 text-xs text-muted-foreground font-mono overflow-x-auto pb-2">
      <div className="flex gap-2">
        {/* Integer Part */}
        {integerPart.split('').map((digit, idx) => {
          const power = integerPart.length - 1 - idx;
          return (
            <div key={`int-${idx}`} className="flex flex-col items-center">
              <span className="font-bold text-foreground">{digit}</span>
              <span className="text-[10px] text-muted-foreground/70">×{base}^{power}</span>
            </div>
          );
        })}
        
        {/* Radix Point */}
        {fractionalPart && (
          <div className="flex flex-col items-center justify-center font-bold text-foreground mx-1">.</div>
        )}
        
        {/* Fractional Part */}
        {fractionalPart && fractionalPart.split('').map((digit, idx) => {
          const power = -(idx + 1);
          return (
            <div key={`frac-${idx}`} className="flex flex-col items-center">
              <span className="font-bold text-foreground">{digit}</span>
              <span className="text-[10px] text-muted-foreground/70">×{base}^{power}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export function RadixSliderWidget() {
  const [inputValue, setInputValue] = useState('10');
  const [sliderValue, setSliderValue] = useState([2]); // 0=Base 2, 1=Base 8, 2=Base 10, 3=Base 16
  const [sourceBase, setSourceBase] = useState(10);
  
  const [conversions, setConversions] = useState({
    bin: '',
    oct: '',
    dec: '',
    hex: ''
  });

  const baseMap = [2, 8, 10, 16];

  useEffect(() => {
    const activeBase = baseMap[sliderValue[0]];
    setSourceBase(activeBase);
  }, [sliderValue]);

  useEffect(() => {
    // Perform conversion across all bases whenever input or sourceBase changes
    if (!inputValue) {
      setConversions({ bin: '', oct: '', dec: '', hex: '' });
      return;
    }

    try {
      // Basic conversion logic (assuming integer for simplicity, we can extend later)
      // For accurate multi-base math with fractions, we might need a backend call as per SDD
      // But for real-time slider speed, a local conversion is much better.
      const decValue = parseInt(inputValue, sourceBase);
      
      if (isNaN(decValue)) {
        setConversions({ bin: 'Invalid', oct: 'Invalid', dec: 'Invalid', hex: 'Invalid' });
        return;
      }

      setConversions({
        bin: decValue.toString(2),
        oct: decValue.toString(8),
        dec: decValue.toString(10),
        hex: decValue.toString(16).toUpperCase()
      });
    } catch (e) {
      setConversions({ bin: 'Error', oct: 'Error', dec: 'Error', hex: 'Error' });
    }
  }, [inputValue, sourceBase]);

  return (
    <div className="w-full space-y-6">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Interactive Radix Slider</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Input & Slider */}
          <div className="space-y-4 max-w-md mx-auto">
            <div className="text-center">
              <label className="text-sm font-medium text-muted-foreground">Number Input</label>
              <Input 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value.toUpperCase())}
                className="text-center text-2xl font-mono mt-2"
                placeholder="Enter value..."
              />
            </div>
            
            <div className="space-y-4 pt-4">
              <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                <span className={sliderValue[0] === 0 ? "text-primary" : ""}>Base-2</span>
                <span className={sliderValue[0] === 1 ? "text-primary" : ""}>Base-8</span>
                <span className={sliderValue[0] === 2 ? "text-primary" : ""}>Base-10</span>
                <span className={sliderValue[0] === 3 ? "text-primary" : ""}>Base-16</span>
              </div>
              <Slider 
                value={sliderValue}
                min={0}
                max={3}
                step={1}
                onValueChange={setSliderValue}
              />
              <p className="text-center text-sm text-muted-foreground">
                Current Input Base: <strong>Base-{sourceBase}</strong>
              </p>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            {/* Binary */}
            <div className={`p-4 rounded-lg border ${sourceBase === 2 ? 'bg-primary/10 border-primary/50' : 'bg-muted/30 border-border'}`}>
              <h4 className="font-semibold text-sm mb-2 text-foreground">Binary (Base-2)</h4>
              <div className="text-xl font-mono font-bold text-emerald-500 break-all">{conversions.bin}</div>
              <PositionalWeightDisplay base={2} value={conversions.bin} />
            </div>

            {/* Octal */}
            <div className={`p-4 rounded-lg border ${sourceBase === 8 ? 'bg-primary/10 border-primary/50' : 'bg-muted/30 border-border'}`}>
              <h4 className="font-semibold text-sm mb-2 text-foreground">Octal (Base-8)</h4>
              <div className="text-xl font-mono font-bold text-blue-500 break-all">{conversions.oct}</div>
              <PositionalWeightDisplay base={8} value={conversions.oct} />
            </div>

            {/* Decimal */}
            <div className={`p-4 rounded-lg border ${sourceBase === 10 ? 'bg-primary/10 border-primary/50' : 'bg-muted/30 border-border'}`}>
              <h4 className="font-semibold text-sm mb-2 text-foreground">Decimal (Base-10)</h4>
              <div className="text-xl font-mono font-bold text-orange-500 break-all">{conversions.dec}</div>
              <PositionalWeightDisplay base={10} value={conversions.dec} />
            </div>

            {/* Hexadecimal */}
            <div className={`p-4 rounded-lg border ${sourceBase === 16 ? 'bg-primary/10 border-primary/50' : 'bg-muted/30 border-border'}`}>
              <h4 className="font-semibold text-sm mb-2 text-foreground">Hexadecimal (Base-16)</h4>
              <div className="text-xl font-mono font-bold text-purple-500 break-all">{conversions.hex}</div>
              <PositionalWeightDisplay base={16} value={conversions.hex} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default RadixSliderWidget;
