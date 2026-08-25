import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NUMBER_SYSTEM_TABLE = Array.from({ length: 16 }, (_, i) => ({
  decimal: i.toString(10),
  binary: i.toString(2).padStart(4, '0'),
  octal: i.toString(8).padStart(2, '0'),
  hex: i.toString(16).toUpperCase(),
}));

export function NumberSystemComparisonGrid() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <div className="w-full space-y-6">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Types of Number Systems</CardTitle>
          <p className="text-sm text-muted-foreground">
            Hover over any row to highlight the equivalencies across different bases.
            Notice how the 4-bit binary group maps directly to a single Hexadecimal character.
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 font-semibold text-center">Decimal (Base 10)</th>
                  <th className="px-6 py-3 font-semibold text-center">Binary (Base 2)</th>
                  <th className="px-6 py-3 font-semibold text-center">Octal (Base 8)</th>
                  <th className="px-6 py-3 font-semibold text-center">Hexadecimal (Base 16)</th>
                </tr>
              </thead>
              <tbody>
                {NUMBER_SYSTEM_TABLE.map((row, index) => {
                  const isHovered = hoveredRow === index;
                  return (
                    <tr
                      key={index}
                      onMouseEnter={() => setHoveredRow(index)}
                      onMouseLeave={() => setHoveredRow(null)}
                      className={`
                        border-b border-border transition-colors duration-150 cursor-default
                        ${isHovered ? 'bg-primary/10' : 'hover:bg-muted/30'}
                      `}
                    >
                      <td className="px-6 py-3 text-center font-mono">
                        <span className={`inline-block px-2 py-1 rounded ${isHovered ? 'bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold' : ''}`}>
                          {row.decimal}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-center font-mono">
                        <span className={`inline-block px-2 py-1 rounded tracking-widest ${isHovered ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold' : ''}`}>
                          {row.binary}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-center font-mono">
                        <span className={`inline-block px-2 py-1 rounded ${isHovered ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold' : ''}`}>
                          {row.octal}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-center font-mono">
                        <span className={`inline-block px-3 py-1 rounded ${isHovered ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold ring-2 ring-purple-500/50' : 'bg-muted'}`}>
                          {row.hex}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default NumberSystemComparisonGrid;
