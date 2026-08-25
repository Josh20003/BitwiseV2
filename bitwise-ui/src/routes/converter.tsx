import { createFileRoute } from '@tanstack/react-router'
import { NumberSystemConverter } from '@/components/NumberSystemConverter'

export const Route = createFileRoute('/converter')({
  component: () => (
    <div className="mt-30 flex flex-col w-full min-h-[80vh] md:gap-0">
      <div className="text-center px-4 mb-4">
        <p className="font-semibold text-2xl sm:text-3xl md:text-3xl">
          Number Converter
        </p>
        <p className="text-sm md:text-md text-muted-foreground">
          Convert numbers between Binary, Octal, Decimal, and Hexadecimal
        </p>
      </div>
      <div className="w-full">
        <div className="p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <NumberSystemConverter />
          </div>
        </div>
      </div>
    </div>
  ),
})
