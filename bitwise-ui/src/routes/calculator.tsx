import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import FactoringDemo from '@/components/FactoringDemo'
import { BinaryArithmeticWorkspace } from '@/components/lessons/BinaryArithmeticWorkspace'
import { ComplementBitRow } from '@/components/lessons/ComplementBitRow'
import { Calculator, Plus, Baseline } from 'lucide-react'

export const Route = createFileRoute('/calculator')({
  component: RouteComponent,
})

type CalculatorMode = 'boolean' | 'arithmetic' | 'complements'

const MODES: { key: CalculatorMode; label: string; icon: React.ElementType; description: string }[] = [
  {
    key: 'boolean',
    label: 'Boolean Algebra',
    icon: Calculator,
    description: 'Simplify expressions step-by-step with visual animations',
  },
  {
    key: 'arithmetic',
    label: 'Binary Arithmetic',
    icon: Plus,
    description: 'Trace step-by-step binary addition and subtraction',
  },
  {
    key: 'complements',
    label: "1's & 2's Complements",
    icon: Baseline,
    description: "Visualize bit inversions and cascade carries",
  },
]

function RouteComponent() {
  const [activeMode, setActiveMode] = useState<CalculatorMode>('boolean')

  const currentMode = MODES.find((m) => m.key === activeMode)!

  return (
    <div className="mt-30 flex flex-col w-full min-h-[80vh] md:gap-0">
      {/* Header */}
      <div className="text-center px-4">
        <p className="font-semibold text-2xl sm:text-3xl md:text-3xl">
          {currentMode.label}
        </p>
        <p className="text-sm md:text-md text-muted-foreground">
          {currentMode.description}
        </p>
      </div>

      {/* Mode Toggle Bar */}
      <div className="flex justify-center px-4 pt-4 pb-2">
        <div className="inline-flex items-center rounded-lg border border-border bg-muted/30 p-1 gap-1">
          {MODES.map((mode) => {
            const Icon = mode.icon
            const isActive = activeMode === mode.key
            return (
              <button
                key={mode.key}
                onClick={() => setActiveMode(mode.key)}
                className={`
                  inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium
                  transition-all duration-200 cursor-pointer
                  ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{mode.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Active Mode Content */}
      <div className="w-full">
        {activeMode === 'boolean' && <FactoringDemo />}
        {activeMode === 'arithmetic' && (
          <div className="p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
              <BinaryArithmeticWorkspace />
            </div>
          </div>
        )}
        {activeMode === 'complements' && (
          <div className="p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
              <ComplementBitRow />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
