import React, { useState, useCallback } from 'react'
import { CheckCircle, XCircle, RefreshCw, Zap, ChevronRight, RotateCcw, Info, Trophy, ArrowUp, BookOpen, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'

// ─────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────
const ResultBadge = ({ correct }: { correct: boolean }) =>
  correct ? (
    <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-400">
      <CheckCircle className="w-4 h-4" /> Correct!
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-sm font-semibold text-red-400">
      <XCircle className="w-4 h-4" /> Try again
    </span>
  )

const ActivityShell = ({
  title,
  emoji,
  children,
}: {
  title: string
  emoji: string
  children: React.ReactNode
}) => (
  <div className="mt-10 mb-10 rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a1f35] to-[#0f1220] shadow-xl overflow-hidden">
    {/* Header */}
    <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-white/5">
      <span className="text-2xl">{emoji}</span>
      <div>
        <p className="text-[10px] uppercase tracking-widest font-semibold text-indigo-400 mb-0.5">
          Interactive Activity
        </p>
        <h3 className="text-base font-bold text-white">{title}</h3>
      </div>
      <Zap className="w-4 h-4 text-yellow-400 ml-auto" />
    </div>
    <div className="p-5">{children}</div>
  </div>
)

// ─────────────────────────────────────────────
// 0. Number System Builders (Lesson 1)
//    Four uniform components: Binary, Decimal, Octal, Hexadecimal
//    Each features: stacked Position/Power/Value labels,
//    a live dynamic equation, and consistent dark-theme styling.
// ─────────────────────────────────────────────

const SUPERSCRIPTS: Record<number, string> = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' }
const sup = (n: number): string => String(n).split('').map(c => SUPERSCRIPTS[Number(c)] ?? c).join('')

// ── Binary Builder ──────────────────────────
const BinaryBuilder = () => {
  const NUM_BOXES = 8
  const [bits, setBits] = useState<number[]>(Array(NUM_BOXES).fill(0))

  const toggle = (i: number) => {
    const next = [...bits]
    next[i] = next[i] === 1 ? 0 : 1
    setBits(next)
  }

  const positions = Array.from({ length: NUM_BOXES }, (_, i) => NUM_BOXES - 1 - i)
  const powers = positions.map(p => Math.pow(2, p))
  const total = bits.reduce((acc, b, i) => acc + b * powers[i], 0)

  // Build equation: "1×128 + 0×64 + …"
  const eqParts = bits.map((b, i) => `${b}×${powers[i]}`)
  const eqStr = eqParts.join(' + ')

  return (
    <ActivityShell title="Binary Builder" emoji=" ">
      <p className="text-gray-300 text-sm mb-5">
        Toggle each bit to build a binary number. The equation below shows how each bit contributes to the <span className="font-semibold text-indigo-300">decimal</span> value.
      </p>

      {/* Bit toggle boxes */}
      <div className="flex justify-center gap-2 mb-1">
        {bits.map((b, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl text-xl sm:text-2xl font-bold font-mono transition-all duration-150 select-none border-2 ${
              b === 1
                ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-400'
            }`}
          >
            {b}
          </button>
        ))}
      </div>

      {/* Stacked labels: Position / Power / Value */}
      <div className="flex justify-center gap-2 mb-5">
        {positions.map((pos, i) => (
          <div key={i} className="w-12 sm:w-14 flex flex-col items-center text-[10px] leading-tight">
            <span className="text-gray-500">Pos {pos}</span>
            <span className="text-indigo-400 font-mono">2{sup(pos)}</span>
            <span className="text-gray-400 font-mono">{powers[i]}</span>
          </div>
        ))}
      </div>

      {/* Dynamic equation */}
      <div className="bg-white/5 rounded-xl border border-white/10 px-4 py-3 mb-4 overflow-x-auto">
        <p className="text-center text-xs sm:text-sm font-mono text-gray-300 whitespace-nowrap">
          {eqStr} = <span className="font-bold text-indigo-300">{total}</span>
          <span className="text-gray-500 ml-1">(decimal)</span>
        </p>
      </div>

      {/* Current value */}
      <p className="text-center text-gray-400 text-sm mb-4">
        Current value:{' '}
        <span className="font-mono font-bold text-lg text-white">{total}</span>
      </p>

      <div className="flex items-center justify-center">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setBits(Array(NUM_BOXES).fill(0))}
          className="gap-1 border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </Button>
      </div>
    </ActivityShell>
  )
}

// ── Decimal Builder ─────────────────────────
const DecimalBuilder = () => {
  const NUM_BOXES = 4
  const [digits, setDigits] = useState<number[]>(Array(NUM_BOXES).fill(0))

  const handleChange = (i: number, raw: string) => {
    const ch = raw.slice(-1)
    if (ch === '' || /^[0-9]$/.test(ch)) {
      const next = [...digits]
      next[i] = ch === '' ? 0 : Number(ch)
      setDigits(next)
    }
  }

  const positions = Array.from({ length: NUM_BOXES }, (_, i) => NUM_BOXES - 1 - i)
  const powers = positions.map(p => Math.pow(10, p))
  const total = digits.reduce((acc, d, i) => acc + d * powers[i], 0)

  // Equation: "4×1000 + 7×100 + 3×10 + 9×1 = 4739"
  const eqParts = digits.map((d, i) => `${d}×${powers[i]}`)
  const eqStr = eqParts.join(' + ')

  return (
    <ActivityShell title="Decimal Builder" emoji=" ">
      <p className="text-gray-300 text-sm mb-5">
        Enter digits (0–9) into each position and see how <span className="font-semibold text-amber-300">base-10 place values</span> combine to form the number.
      </p>

      {/* Digit input boxes */}
      <div className="flex justify-center gap-2 mb-1">
        {digits.map((d, i) => (
          <input
            key={i}
            type="text"
            inputMode="numeric"
            value={d}
            onChange={e => handleChange(i, e.target.value)}
            onFocus={e => e.target.select()}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl text-xl sm:text-2xl font-bold font-mono text-center transition-all duration-150 select-none border-2 outline-none ${
              d > 0
                ? 'bg-amber-600 border-amber-400 text-white shadow-lg shadow-amber-600/30'
                : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-400 focus:border-amber-400'
            }`}
          />
        ))}
      </div>

      {/* Stacked labels */}
      <div className="flex justify-center gap-2 mb-5">
        {positions.map((pos, i) => (
          <div key={i} className="w-12 sm:w-14 flex flex-col items-center text-[10px] leading-tight">
            <span className="text-gray-500">Pos {pos}</span>
            <span className="text-amber-400 font-mono">10{sup(pos)}</span>
            <span className="text-gray-400 font-mono">{powers[i]}</span>
          </div>
        ))}
      </div>

      {/* Dynamic equation */}
      <div className="bg-white/5 rounded-xl border border-white/10 px-4 py-3 mb-4 overflow-x-auto">
        <p className="text-center text-xs sm:text-sm font-mono text-gray-300 whitespace-nowrap">
          {eqStr} = <span className="font-bold text-amber-300">{total}</span>
        </p>
      </div>

      {/* Current value */}
      <p className="text-center text-gray-400 text-sm mb-4">
        Current value:{' '}
        <span className="font-mono font-bold text-lg text-white">{total}</span>
      </p>

      <div className="flex items-center justify-center">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setDigits(Array(NUM_BOXES).fill(0))}
          className="gap-1 border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </Button>
      </div>
    </ActivityShell>
  )
}

// ── Octal Builder ───────────────────────────
const OctalBuilder = () => {
  const NUM_BOXES = 3
  const [digits, setDigits] = useState<number[]>(Array(NUM_BOXES).fill(0))

  const handleChange = (i: number, raw: string) => {
    const ch = raw.slice(-1)
    if (ch === '' || /^[0-7]$/.test(ch)) {
      const next = [...digits]
      next[i] = ch === '' ? 0 : Number(ch)
      setDigits(next)
    }
  }

  const positions = Array.from({ length: NUM_BOXES }, (_, i) => NUM_BOXES - 1 - i)
  const powers = positions.map(p => Math.pow(8, p))
  const total = digits.reduce((acc, d, i) => acc + d * powers[i], 0)

  // Equation with intermediate subtotals: "3×64 + 5×8 + 7×1 = 192 + 40 + 7 = 239 (decimal)"
  const eqParts = digits.map((d, i) => `${d}×${powers[i]}`)
  const subtotals = digits.map((d, i) => d * powers[i])
  const eqStr = eqParts.join(' + ')
  const subStr = subtotals.join(' + ')

  return (
    <ActivityShell title="Octal Builder" emoji=" ">
      <p className="text-gray-300 text-sm mb-5">
        Enter digits (0–7) into each position and see how <span className="font-semibold text-sky-300">base-8 place values</span> convert to decimal.
      </p>

      {/* Digit input boxes */}
      <div className="flex justify-center gap-2 mb-1">
        {digits.map((d, i) => (
          <input
            key={i}
            type="text"
            inputMode="numeric"
            value={d}
            onChange={e => handleChange(i, e.target.value)}
            onFocus={e => e.target.select()}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl text-xl sm:text-2xl font-bold font-mono text-center transition-all duration-150 select-none border-2 outline-none ${
              d > 0
                ? 'bg-sky-600 border-sky-400 text-white shadow-lg shadow-sky-600/30'
                : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-400 focus:border-sky-400'
            }`}
          />
        ))}
      </div>

      {/* Stacked labels */}
      <div className="flex justify-center gap-2 mb-5">
        {positions.map((pos, i) => (
          <div key={i} className="w-12 sm:w-14 flex flex-col items-center text-[10px] leading-tight">
            <span className="text-gray-500">Pos {pos}</span>
            <span className="text-sky-400 font-mono">8{sup(pos)}</span>
            <span className="text-gray-400 font-mono">{powers[i]}</span>
          </div>
        ))}
      </div>

      {/* Dynamic equation with subtotals */}
      <div className="bg-white/5 rounded-xl border border-white/10 px-4 py-3 mb-4 overflow-x-auto">
        <p className="text-center text-xs sm:text-sm font-mono text-gray-300 whitespace-nowrap">
          {eqStr} = {subStr} = <span className="font-bold text-sky-300">{total}</span>
          <span className="text-gray-500 ml-1">(decimal)</span>
        </p>
      </div>

      {/* Current value */}
      <p className="text-center text-gray-400 text-sm mb-4">
        Current value:{' '}
        <span className="font-mono font-bold text-lg text-white">{total}</span>
        <span className="text-gray-600 text-xs ml-2">(octal: {total.toString(8)})</span>
      </p>

      <div className="flex items-center justify-center">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setDigits(Array(NUM_BOXES).fill(0))}
          className="gap-1 border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </Button>
      </div>
    </ActivityShell>
  )
}

// ── Hexadecimal Builder ─────────────────────
const HEX_CHARS = '0123456789ABCDEF'

const HexadecimalBuilder = () => {
  const NUM_BOXES = 3
  // Store raw numeric values 0-15 internally
  const [digits, setDigits] = useState<number[]>(Array(NUM_BOXES).fill(0))

  const handleChange = (i: number, raw: string) => {
    const ch = raw.slice(-1).toUpperCase()
    if (ch === '') {
      const next = [...digits]
      next[i] = 0
      setDigits(next)
      return
    }
    const idx = HEX_CHARS.indexOf(ch)
    if (idx !== -1) {
      const next = [...digits]
      next[i] = idx
      setDigits(next)
    }
  }

  const positions = Array.from({ length: NUM_BOXES }, (_, i) => NUM_BOXES - 1 - i)
  const powers = positions.map(p => Math.pow(16, p))
  const total = digits.reduce((acc, d, i) => acc + d * powers[i], 0)

  // Equation with letter→number conversion shown:
  // "2×256 + 15×16 + 4×1 = 512 + 240 + 4 = 756 (decimal)"
  // If digit ≥ 10 (A-F), the equation shows the decimal equivalent (e.g. 15 for F)
  const eqParts = digits.map((d, i) => `${d}×${powers[i]}`)
  const subtotals = digits.map((d, i) => d * powers[i])
  const eqStr = eqParts.join(' + ')
  const subStr = subtotals.join(' + ')

  return (
    <ActivityShell title="Hexadecimal Builder" emoji=" ">
      <p className="text-gray-300 text-sm mb-5">
        Enter hex digits (0–9, A–F) into each position and see how <span className="font-semibold text-purple-300">base-16 place values</span> convert to decimal.
      </p>

      {/* Hex input boxes */}
      <div className="flex justify-center gap-2 mb-1">
        {digits.map((d, i) => (
          <input
            key={i}
            type="text"
            value={HEX_CHARS[d]}
            onChange={e => handleChange(i, e.target.value)}
            onFocus={e => e.target.select()}
            maxLength={2}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl text-xl sm:text-2xl font-bold font-mono text-center transition-all duration-150 select-none border-2 outline-none uppercase ${
              d > 0
                ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-600/30'
                : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-400 focus:border-purple-400'
            }`}
          />
        ))}
      </div>

      {/* Stacked labels */}
      <div className="flex justify-center gap-2 mb-5">
        {positions.map((pos, i) => (
          <div key={i} className="w-12 sm:w-14 flex flex-col items-center text-[10px] leading-tight">
            <span className="text-gray-500">Pos {pos}</span>
            <span className="text-purple-400 font-mono">16{sup(pos)}</span>
            <span className="text-gray-400 font-mono">{powers[i]}</span>
          </div>
        ))}
      </div>

      {/* Dynamic equation with subtotals */}
      <div className="bg-white/5 rounded-xl border border-white/10 px-4 py-3 mb-4 overflow-x-auto">
        <p className="text-center text-xs sm:text-sm font-mono text-gray-300 whitespace-nowrap">
          {eqStr} = {subStr} = <span className="font-bold text-purple-300">{total}</span>
          <span className="text-gray-500 ml-1">(decimal)</span>
        </p>
      </div>

      {/* Current value */}
      <p className="text-center text-gray-400 text-sm mb-4">
        Current value:{' '}
        <span className="font-mono font-bold text-lg text-white">{total}</span>
        <span className="text-gray-600 text-xs ml-2">(hex: 0x{total.toString(16).toUpperCase()})</span>
      </p>

      <div className="flex items-center justify-center">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setDigits(Array(NUM_BOXES).fill(0))}
          className="gap-1 border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </Button>
      </div>
    </ActivityShell>
  )
}

// ─────────────────────────────────────────────
// 1. Number System Complement Explorer (Lesson 5)
//    Moved from Lesson 9, expanded with 1's & 2's complement tabs + walkthrough
// ─────────────────────────────────────────────
type ComplementTab = '1s' | '2s'

const NumberSystemComplementExplorer = () => {
  const [activeTab, setActiveTab] = useState<ComplementTab>('1s')
  const [bits, setBits] = useState<number[]>([0, 1, 0, 1, 1, 0, 1, 0])
  const [showWalkthrough, setShowWalkthrough] = useState(false)

  const toggle = (i: number) => {
    const next = [...bits]
    next[i] = next[i] === 1 ? 0 : 1
    setBits(next)
  }

  const value = bits.reduce((acc, b, i) => acc + b * Math.pow(2, 7 - i), 0)

  // 1's complement: flip all bits
  const onesComp: number[] = bits.map((b) => (b === 1 ? 0 : 1))
  const onesValue = onesComp.reduce((acc, b, i) => acc + b * Math.pow(2, 7 - i), 0)

  // 2's complement: flip all bits + add 1
  const computeTwosComp = (srcBits: number[]): number[] => {
    const flipped = srcBits.map((b) => (b === 1 ? 0 : 1))
    let carry = 1
    const temp = [...flipped].reverse()
    for (let i = 0; i < temp.length; i++) {
      const sum = temp[i] + carry
      temp[i] = (sum % 2) as 0 | 1
      carry = Math.floor(sum / 2)
    }
    return temp.reverse()
  }
  const twosComp = computeTwosComp(bits)
  const twosValue = twosComp.reduce((acc, b, i) => acc + b * Math.pow(2, 7 - i), 0)

  const resultBits = activeTab === '1s' ? onesComp : twosComp
  const resultValue = activeTab === '1s' ? onesValue : twosValue

  return (
    <ActivityShell title="Complement Explorer" emoji=" ">
      <p className="text-gray-300 text-sm mb-4">
        Toggle the original bits and explore how <span className="text-indigo-300 font-semibold">1's complement</span> and <span className="text-purple-300 font-semibold">2's complement</span> transform them.
      </p>

      {/* Tab selector */}
      <div className="flex gap-2 mb-5">
        {([['1s', "1's Complement"], ['2s', "2's Complement"]] as [ComplementTab, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border-2 ${activeTab === key
              ? key === '1s'
                ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-900/40'
                : 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-900/40'
              : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Original bits */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-widest">Original</p>
        <div className="flex gap-1 flex-wrap items-center">
          {bits.map((b, i) => (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={`w-10 h-10 rounded-lg font-mono font-bold text-lg border-2 transition-all ${b === 1
                ? 'bg-indigo-600 border-indigo-400 text-white'
                : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-400'
                }`}
            >
              {b}
            </button>
          ))}
          <span className="ml-3 text-gray-400 text-sm font-mono">= {value}</span>
        </div>
      </div>

      {/* Step indicator for 2's complement */}
      {activeTab === '2s' && (
        <div className="mb-3">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <span className="bg-indigo-900/40 border border-indigo-700 rounded-lg px-2 py-1 text-indigo-300 font-semibold">Step 1</span>
            <span>Flip all bits (1's complement)</span>
          </div>
          <div className="flex gap-1 flex-wrap items-center mb-2">
            {onesComp.map((b, i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded-lg font-mono font-bold text-lg border-2 flex items-center justify-center ${b === 1
                  ? 'bg-indigo-700/60 border-indigo-500/60 text-indigo-200'
                  : 'bg-gray-800 border-gray-700 text-gray-500'
                  }`}
              >
                {b}
              </div>
            ))}
            <span className="ml-3 text-indigo-300/60 text-sm font-mono">= {onesValue}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <span className="bg-purple-900/40 border border-purple-700 rounded-lg px-2 py-1 text-purple-300 font-semibold">Step 2</span>
            <span>Add 1 to get 2's complement</span>
          </div>
        </div>
      )}

      {/* Result bits */}
      <div className="mb-1">
        <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-widest">
          {activeTab === '1s' ? "1's Complement" : "2's Complement"}
        </p>
        <div className="flex gap-1 flex-wrap items-center">
          {resultBits.map((b, i) => (
            <div
              key={i}
              className={`w-10 h-10 rounded-lg font-mono font-bold text-lg border-2 flex items-center justify-center ${activeTab === '1s'
                ? b === 1 ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-gray-800 border-gray-700 text-gray-400'
                : b === 1 ? 'bg-purple-600 border-purple-400 text-white' : 'bg-gray-800 border-gray-700 text-gray-400'
                }`}
            >
              {b}
            </div>
          ))}
          <span className={`ml-3 text-sm font-mono ${activeTab === '1s' ? 'text-indigo-300' : 'text-purple-300'}`}>
            = {resultValue}
          </span>
        </div>
      </div>

      {/* Explanation panel */}
      <div className="mt-4 rounded-xl bg-gray-800/60 border border-gray-700 px-4 py-3 text-sm space-y-2">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
          <div className="text-gray-400">
            {activeTab === '1s' ? (
              <>
                <span className="text-white font-semibold">1's complement</span> inverts every bit: 0→1, 1→0.
                <span className="block mt-1 text-gray-500">Original + 1's complement = {value + onesValue} (always 255 for 8 bits)</span>
              </>
            ) : (
              <>
                <span className="text-white font-semibold">2's complement</span> = flip all bits + add 1.
                <span className="block mt-1 text-gray-500">This represents <span className="text-purple-300 font-mono">-{value}</span> in signed binary. Verify: {value} + {twosValue} = {value + twosValue} (= 256, which overflows to 0 in 8 bits)</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Walkthrough toggle */}
      <button
        onClick={() => setShowWalkthrough(!showWalkthrough)}
        className="mt-4 text-xs text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-2 block"
      >
        {showWalkthrough ? 'Hide' : 'Show'} step-by-step walkthrough
      </button>

      {showWalkthrough && (
        <div className="mt-3 rounded-xl bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-700/40 p-4 text-sm space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">1</div>
            <span className="text-gray-300">Original number: <span className="font-mono text-white">{bits.join('')}</span> = <span className="font-mono text-indigo-300">{value}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">2</div>
            <span className="text-gray-300">Flip every bit → <span className="font-mono text-white">{onesComp.join('')}</span> = <span className="font-mono text-indigo-300">{onesValue}</span> (1's complement)</span>
          </div>
          {activeTab === '2s' && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white">3</div>
                <span className="text-gray-300">Add 1 → <span className="font-mono text-white">{twosComp.join('')}</span> = <span className="font-mono text-purple-300">{twosValue}</span> (2's complement)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold text-white">✓</div>
                <span className="text-gray-300">This means <span className="font-mono text-purple-300">-{value}</span> in signed 8-bit representation</span>
              </div>
            </>
          )}
        </div>
      )}

      <Button
        size="sm"
        variant="outline"
        onClick={() => setBits([0, 1, 0, 1, 1, 0, 1, 0])}
        className="mt-4 border-gray-600 text-gray-300 hover:bg-gray-800 gap-1"
      >
        <RotateCcw className="w-3 h-3" /> Reset
      </Button>
    </ActivityShell>
  )
}

// ─────────────────────────────────────────────
// 2. Base Converter Quiz  (Lesson 5 – Decimal/Octal/Hex topics, Lesson 6)
// ─────────────────────────────────────────────
const BaseConverterQuiz = ({
  fromLabel,
  toLabel,
  questions,
}: {
  fromBase?: number
  toBase?: number
  fromLabel: string
  toLabel: string
  questions: { from: string; to: string }[]
}) => {
  const [qi, setQi] = useState(0)
  const [input, setInput] = useState('')
  const [checked, setChecked] = useState(false)
  const q = questions[qi % questions.length]
  const isCorrect = input.trim().toUpperCase() === q.to.toUpperCase()

  const check = () => {
    if (input.trim()) setChecked(true)
  }
  const advance = () => {
    setQi((p) => p + 1)
    setInput('')
    setChecked(false)
  }

  return (
    <ActivityShell title={`${fromLabel} → ${toLabel} Conversion Practice`} emoji=" ">
      <p className="text-gray-300 text-sm mb-4">
        Convert the following {fromLabel} number to {toLabel}.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-5">
        <div className="bg-gray-800 rounded-xl px-6 py-3 text-2xl font-mono font-bold text-yellow-300 border border-gray-700">
          {q.from}
          <span className="text-sm text-gray-500 ml-1">({fromLabel})</span>
        </div>
        <span className="text-gray-500 text-xl">→</span>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setChecked(false)
            }}
            onKeyDown={(e) => e.key === 'Enter' && !checked && check()}
            placeholder={`${toLabel} value`}
            className="w-36 rounded-xl px-4 py-2 font-mono text-lg bg-gray-800 border border-gray-600 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500"
          />
          {!checked ? (
            <Button
              size="sm"
              onClick={check}
              disabled={!input.trim()}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Check
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={advance}
              className="bg-emerald-600 hover:bg-emerald-700 gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      {checked && (
        <div className={`rounded-xl p-3 text-sm ${isCorrect ? 'bg-emerald-900/30 border border-emerald-700' : 'bg-red-900/30 border border-red-700'}`}>
          <ResultBadge correct={isCorrect} />
          {!isCorrect && (
            <p className="mt-1 text-gray-300">
              The correct answer is{' '}
              <span className="font-mono font-bold text-white">{q.to}</span>
            </p>
          )}
        </div>
      )}
    </ActivityShell>
  )
}

// ─────────────────────────────────────────────
// 3. Logic Gate Simulator  (Lesson 2 – Logic Gates)
// ─────────────────────────────────────────────
type GateType = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR'

const evalGate = (gate: GateType, a: number, b: number): number => {
  switch (gate) {
    case 'AND': return a & b
    case 'OR': return a | b
    case 'NOT': return a === 1 ? 0 : 1
    case 'NAND': return (a & b) === 1 ? 0 : 1
    case 'NOR': return (a | b) === 1 ? 0 : 1
    case 'XOR': return a ^ b
    case 'XNOR': return (a ^ b) === 1 ? 0 : 1
  }
}

const LogicGateSimulator = () => {
  const gates: GateType[] = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR']
  const [gate, setGate] = useState<GateType>('AND')
  const [a, setA] = useState(0)
  const [b, setB] = useState(0)
  const output = evalGate(gate, a, b)
  const isTwoInput = gate !== 'NOT'

  const BitToggle = ({ val, onChange, label }: { val: number; onChange: () => void; label: string }) => (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs text-gray-500 font-mono">{label}</span>
      <button
        onClick={onChange}
        className={`w-12 h-12 rounded-xl text-xl font-bold font-mono border-2 transition-all ${val === 1
          ? 'bg-indigo-600 border-indigo-400 text-white'
          : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-400'
          }`}
      >
        {val}
      </button>
    </div>
  )

  return (
    <ActivityShell title="Logic Gate Simulator" emoji=" ">
      {/* Gate selector */}
      <div className="flex flex-wrap gap-2 mb-5">
        {gates.map((g) => (
          <button
            key={g}
            onClick={() => setGate(g)}
            className={`px-3 py-1 rounded-lg text-sm font-semibold font-mono transition-all ${gate === g
              ? 'bg-indigo-600 text-white border border-indigo-400'
              : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-500'
              }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Simulator */}
      <div className="flex items-center justify-center gap-4 my-4">
        <div className="flex flex-col gap-3">
          <BitToggle val={a} onChange={() => setA(a === 1 ? 0 : 1)} label="A" />
          {isTwoInput && (
            <BitToggle val={b} onChange={() => setB(b === 1 ? 0 : 1)} label="B" />
          )}
        </div>
        {/* Gate box */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-16 rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo-700 to-purple-800 border-2 border-indigo-400 shadow-lg shadow-indigo-900">
            <span className="text-white font-bold font-mono text-sm">{gate}</span>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {gate === 'NOT'
              ? `NOT(A) = A'`
              : gate === 'AND' ? 'A·B' : gate === 'OR' ? 'A+B'
                : gate === 'NAND' ? "(A·B)'" : gate === 'NOR' ? "(A+B)'"
                  : gate === 'XOR' ? 'A⊕B' : '(A⊕B)\''}
          </div>
        </div>
        {/* Output */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-gray-500 font-mono">Output</span>
          <div
            className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold font-mono border-2 shadow-lg transition-all ${output === 1
              ? 'bg-emerald-600 border-emerald-400 text-white shadow-emerald-900'
              : 'bg-gray-800 border-gray-600 text-gray-400'
              }`}
          >
            {output}
          </div>
          <span className="text-xs text-gray-500">{output === 1 ? 'HIGH' : 'LOW'}</span>
        </div>
      </div>

      {/* Mini truth table */}
      <div className="mt-4 rounded-xl overflow-hidden border border-gray-700">
        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-3 py-2 text-gray-400 text-center">A</th>
              {isTwoInput && <th className="px-3 py-2 text-gray-400 text-center">B</th>}
              <th className="px-3 py-2 text-indigo-400 text-center">Output</th>
            </tr>
          </thead>
          <tbody>
            {(isTwoInput
              ? ([[0, 0], [0, 1], [1, 0], [1, 1]] as [number, number][])
              : ([[0, 0], [1, 0]] as [number, number][])
            ).map((row, idx) => {
              const [ra, rb] = row
              const out = isTwoInput ? evalGate(gate, ra, rb ?? 0) : evalGate(gate, ra, 0)
              const isActive = isTwoInput ? (ra === a && rb === b) : ra === a
              return (
                <tr
                  key={idx}
                  className={`border-t border-gray-700 transition-colors ${isActive ? 'bg-indigo-900/40 font-bold' : 'bg-gray-900'
                    }`}
                >
                  <td className="px-3 py-2 text-center text-white">{ra}</td>
                  {isTwoInput && <td className="px-3 py-2 text-center text-white">{rb}</td>}
                  <td className={`px-3 py-2 text-center font-bold ${out === 1 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {out}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </ActivityShell>
  )
}

// ─────────────────────────────────────────────
// 4. Truth Table Builder  (Lesson 3 – Truth Tables)
// ─────────────────────────────────────────────
const TruthTableBuilder = () => {
  type Expr = { label: string; expr: string; fn: (a: number, b: number) => number }
  const expressions: Expr[] = [
    { label: 'A AND B', expr: 'A · B', fn: (a, b) => a & b },
    { label: 'A OR B', expr: 'A + B', fn: (a, b) => a | b },
    { label: 'A NAND B', expr: "(A · B)'", fn: (a, b) => (a & b) === 1 ? 0 : 1 },
    { label: 'A XOR B', expr: 'A ⊕ B', fn: (a, b) => a ^ b },
    { label: 'A NOR B', expr: "(A + B)'", fn: (a, b) => (a | b) === 1 ? 0 : 1 },
  ]
  const [exprIdx, setExprIdx] = useState(0)
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([null, null, null, null])
  const [submitted, setSubmitted] = useState(false)
  const expr = expressions[exprIdx]

  const rows: [number, number][] = [[0, 0], [0, 1], [1, 0], [1, 1]]
  const correct = rows.map(([a, b]) => expr.fn(a, b))

  const toggle = (rowIdx: number) => {
    if (submitted) return
    const next = [...userAnswers]
    const cur = next[rowIdx]
    next[rowIdx] = cur === null ? 1 : cur === 1 ? 0 : null
    setUserAnswers(next)
  }

  const allFilled = userAnswers.every((v) => v !== null)
  const score = submitted ? userAnswers.filter((v, i) => v === correct[i]).length : 0

  const reset = () => {
    setUserAnswers([null, null, null, null])
    setSubmitted(false)
  }
  const nextExpr = () => {
    setExprIdx((p) => (p + 1) % expressions.length)
    reset()
  }

  return (
    <ActivityShell title="Truth Table Challenge" emoji=" ">
      <p className="text-gray-300 text-sm mb-1">
        Complete the truth table by clicking the output cells to cycle between <b>0</b>, <b>1</b>, and <em>blank</em>.
      </p>
      <div className="mb-4 inline-block bg-gray-800 rounded-lg px-4 py-2 font-mono text-lg font-bold text-yellow-300 border border-gray-700">
        F = {expr.expr}
      </div>

      <div className="rounded-xl overflow-hidden border border-gray-700 mb-4">
        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-4 py-2 text-gray-400 text-center">A</th>
              <th className="px-4 py-2 text-gray-400 text-center">B</th>
              <th className="px-4 py-2 text-indigo-400 text-center">F</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([a, b], idx) => {
              const user = userAnswers[idx]
              const isRight = submitted ? user === correct[idx] : null
              return (
                <tr key={idx} className="border-t border-gray-700 bg-gray-900">
                  <td className="px-4 py-2 text-center text-white">{a}</td>
                  <td className="px-4 py-2 text-center text-white">{b}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => toggle(idx)}
                      className={`w-10 h-10 rounded-lg font-bold text-lg border-2 transition-all ${isRight === true
                        ? 'bg-emerald-700 border-emerald-400 text-white'
                        : isRight === false
                          ? 'bg-red-700 border-red-400 text-white'
                          : user !== null
                            ? 'bg-indigo-700 border-indigo-400 text-white hover:bg-indigo-600'
                            : 'bg-gray-800 border-dashed border-gray-600 text-gray-600 hover:border-gray-400'
                        }`}
                    >
                      {user !== null ? user : '?'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {submitted && (
        <div className={`rounded-xl p-3 mb-3 text-sm ${score === 4 ? 'bg-emerald-900/30 border border-emerald-700' : 'bg-yellow-900/30 border border-yellow-700'}`}>
          {score === 4 ? (
            <p className="text-emerald-400 font-semibold">✅ Perfect! All 4 outputs correct!</p>
          ) : (
            <p className="text-yellow-300 font-semibold">
              {score}/4 correct — The answers are: {correct.join(', ')}
            </p>
          )}
        </div>
      )}

      <div className="flex gap-2">
        {!submitted ? (
          <Button
            size="sm"
            onClick={() => setSubmitted(true)}
            disabled={!allFilled}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Submit
          </Button>
        ) : (
          <Button size="sm" onClick={nextExpr} className="bg-emerald-600 hover:bg-emerald-700 gap-1">
            Next Expression <ChevronRight className="w-4 h-4" />
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          onClick={reset}
          className="border-gray-600 text-gray-300 hover:bg-gray-800 gap-1"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </Button>
      </div>
    </ActivityShell>
  )
}

// ─────────────────────────────────────────────
// 5. Boolean Law Matcher  (Lesson 4 – Boolean Laws)
// ─────────────────────────────────────────────
const BooleanLawMatcher = () => {
  const pairs = [
    { expr: "A · 1", result: "A", law: "Identity" },
    { expr: "A + 0", result: "A", law: "Identity" },
    { expr: "A · 0", result: "0", law: "Null" },
    { expr: "A + 1", result: "1", law: "Null" },
    { expr: "A · A", result: "A", law: "Idempotent" },
    { expr: "A + A", result: "A", law: "Idempotent" },
    { expr: "A · A'", result: "0", law: "Complement" },
    { expr: "A + A'", result: "1", law: "Complement" },
  ]
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  const q = pairs[idx]
  const options = ["A", "0", "1", "A'"]
  const isCorrect = selected === q.result

  const next = () => {
    setIdx((p) => (p + 1) % pairs.length)
    setSelected(null)
    setChecked(false)
  }

  return (
    <ActivityShell title="Boolean Law Simplifier" emoji=" ">
      <p className="text-gray-300 text-sm mb-4">
        Apply Boolean laws to simplify each expression.
      </p>
      <div className="text-center mb-5">
        <div className="inline-block bg-gray-800 rounded-xl px-6 py-3 text-2xl font-mono font-bold text-yellow-300 border border-gray-700 mb-1">
          {q.expr} = ?
        </div>
        <p className="text-xs text-gray-500">Hint: {q.law} Law</p>
      </div>
      <div className="flex justify-center gap-3 mb-4">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => { setSelected(opt); setChecked(false) }}
            className={`w-16 h-14 rounded-xl font-mono font-bold text-xl border-2 transition-all ${selected === opt
              ? checked
                ? opt === q.result
                  ? 'bg-emerald-700 border-emerald-400 text-white'
                  : 'bg-red-700 border-red-400 text-white'
                : 'bg-indigo-700 border-indigo-400 text-white'
              : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
          >
            {opt}
          </button>
        ))}
      </div>
      <div className="flex justify-center gap-2">
        {!checked ? (
          <Button
            size="sm"
            disabled={!selected}
            onClick={() => setChecked(true)}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Check
          </Button>
        ) : (
          <>
            <ResultBadge correct={isCorrect} />
            {!isCorrect && (
              <span className="text-sm text-gray-400 ml-2">
                Answer: <b className="text-white font-mono">{q.result}</b>
              </span>
            )}
            <Button
              size="sm"
              onClick={next}
              className="ml-3 bg-emerald-600 hover:bg-emerald-700 gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
      <div className="mt-4 text-center text-xs text-gray-600">
        {idx + 1} / {pairs.length}
      </div>
    </ActivityShell>
  )
}

// ─────────────────────────────────────────────
// 6. Binary Arithmetic Trainer  (Lesson 8)
// ─────────────────────────────────────────────
type ArithOp = 'add' | 'subtract'
const BinaryArithmeticTrainer = ({ op }: { op: ArithOp }) => {
  const genQ = useCallback(() => {
    const a = Math.floor(Math.random() * 8) + 4 // 4-11
    const b = op === 'subtract' ? Math.floor(Math.random() * a) : Math.floor(Math.random() * 8) + 1
    return { a, b, ans: op === 'add' ? a + b : a - b }
  }, [op])

  const [q, setQ] = useState(() => genQ())
  const [input, setInput] = useState('')
  const [checked, setChecked] = useState(false)
  const isCorrect = checked && parseInt(input, 2) === q.ans

  const toBin = (n: number) => n.toString(2).padStart(5, '0')

  const next = () => {
    setQ(genQ())
    setInput('')
    setChecked(false)
  }

  return (
    <ActivityShell
      title={op === 'add' ? 'Binary Addition Practice' : 'Binary Subtraction Practice'}
      emoji={op === 'add' ? '' : ''}
    >
      <p className="text-gray-300 text-sm mb-4">
        Solve the binary {op === 'add' ? 'addition' : 'subtraction'} and enter the result in binary.
      </p>
      <div className="font-mono text-xl text-white mb-5 bg-gray-800 rounded-xl p-4 border border-gray-700 inline-block min-w-[200px]">
        <div className="text-right space-y-1">
          <div>{toBin(q.a)}<span className="text-gray-500 text-sm ml-2">(= {q.a})</span></div>
          <div className="border-t border-gray-600 pt-1">
            <span className="text-gray-400 mr-1">{op === 'add' ? '+' : '−'}</span>
            {toBin(q.b)}<span className="text-gray-500 text-sm ml-2">(= {q.b})</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-gray-400 font-mono text-lg">=</span>
        <input
          value={input}
          onChange={(e) => { setInput(e.target.value.replace(/[^01]/g, '')); setChecked(false) }}
          onKeyDown={(e) => e.key === 'Enter' && input && !checked && setChecked(true)}
          placeholder="Binary result"
          className="w-44 rounded-xl px-4 py-2 font-mono text-lg bg-gray-800 border border-gray-600 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500"
        />
      </div>
      {checked && (
        <div className={`rounded-xl p-3 text-sm mb-3 ${isCorrect ? 'bg-emerald-900/30 border border-emerald-700' : 'bg-red-900/30 border border-red-700'}`}>
          <ResultBadge correct={isCorrect} />
          {!isCorrect && (
            <p className="mt-1 text-gray-300">
              Correct answer:{' '}
              <span className="font-mono font-bold text-white">{toBin(q.ans)}</span>
              {' '}(= {q.ans})
            </p>
          )}
        </div>
      )}
      <div className="flex gap-2">
        {!checked ? (
          <Button
            size="sm"
            disabled={!input}
            onClick={() => setChecked(true)}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Check
          </Button>
        ) : (
          <Button size="sm" onClick={next} className="bg-emerald-600 hover:bg-emerald-700 gap-1">
            New Problem <RefreshCw className="w-4 h-4" />
          </Button>
        )}
      </div>
    </ActivityShell>
  )
}

// ─────────────────────────────────────────────
// 6b. Binary Multiplication Practice (Lesson 4)
// ─────────────────────────────────────────────
const BinaryMultiplicationPractice = () => {
  const genQ = useCallback(() => {
    const a = Math.floor(Math.random() * 6) + 2 // 2-7
    const b = Math.floor(Math.random() * 6) + 2 // 2-7
    return { a, b, ans: a * b }
  }, [])

  const [q, setQ] = useState(genQ)
  const [input, setInput] = useState('')
  const [checked, setChecked] = useState(false)
  const isCorrect = checked && parseInt(input, 2) === q.ans

  const toBin = (n: number) => n.toString(2).padStart(5, '0')

  const next = () => {
    setQ(genQ())
    setInput('')
    setChecked(false)
  }

  return (
    <ActivityShell
      title="Binary Multiplication Practice"
      emoji=""
    >
      <p className="text-gray-300 text-sm mb-4">
        Solve the binary multiplication and enter the result in binary.
      </p>
      <div className="font-mono text-xl text-white mb-5 bg-gray-800 rounded-xl p-4 border border-gray-700 inline-block min-w-[200px]">
        <div className="text-right space-y-1">
          <div>{toBin(q.a)}<span className="text-gray-500 text-sm ml-2">(= {q.a})</span></div>
          <div className="border-t border-gray-600 pt-1">
            <span className="text-gray-400 mr-1">×</span>
            {toBin(q.b)}<span className="text-gray-500 text-sm ml-2">(= {q.b})</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-gray-400 font-mono text-lg">=</span>
        <input
          value={input}
          onChange={(e) => { setInput(e.target.value.replace(/[^01]/g, '')); setChecked(false) }}
          onKeyDown={(e) => e.key === 'Enter' && input && !checked && setChecked(true)}
          placeholder="Binary result"
          className="w-44 rounded-xl px-4 py-2 font-mono text-lg bg-gray-800 border border-gray-600 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500"
        />
      </div>
      {checked && (
        <div className={`rounded-xl p-3 text-sm mb-3 ${isCorrect ? 'bg-emerald-900/30 border border-emerald-700' : 'bg-red-900/30 border border-red-700'}`}>
          <ResultBadge correct={isCorrect} />
          {!isCorrect && (
            <p className="mt-1 text-gray-300">
              Correct answer:{' '}
              <span className="font-mono font-bold text-white">{q.ans.toString(2)}</span>
              {' '}(= {q.ans})
            </p>
          )}
        </div>
      )}
      <div className="flex gap-2">
        {!checked ? (
          <Button
            size="sm"
            disabled={!input}
            onClick={() => setChecked(true)}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Check
          </Button>
        ) : (
          <Button size="sm" onClick={next} className="bg-emerald-600 hover:bg-emerald-700 gap-1">
            New Problem <RefreshCw className="w-4 h-4" />
          </Button>
        )}
      </div>
    </ActivityShell>
  )
}

// ─────────────────────────────────────────────
// 6c. Binary Division Practice (Lesson 4)
//     Guarantees clean whole-number quotients (no remainders)
// ─────────────────────────────────────────────
const BinaryDivisionPractice = () => {
  const genQ = useCallback(() => {
    // Generate quotient and divisor first, then compute dividend = quotient × divisor
    // This guarantees a clean division with no remainder
    const quotient = Math.floor(Math.random() * 6) + 2 // 2-7
    const divisor = Math.floor(Math.random() * 5) + 2  // 2-6
    const dividend = quotient * divisor
    return { a: dividend, b: divisor, ans: quotient }
  }, [])

  const [q, setQ] = useState(genQ)
  const [input, setInput] = useState('')
  const [checked, setChecked] = useState(false)
  const isCorrect = checked && parseInt(input, 2) === q.ans

  const toBin = (n: number) => n.toString(2).padStart(5, '0')

  const next = () => {
    setQ(genQ())
    setInput('')
    setChecked(false)
  }

  return (
    <ActivityShell
      title="Binary Division Practice"
      emoji=""
    >
      <p className="text-gray-300 text-sm mb-4">
        Solve the binary division and enter the result in binary.
      </p>
      <div className="font-mono text-xl text-white mb-5 bg-gray-800 rounded-xl p-4 border border-gray-700 inline-block min-w-[200px]">
        <div className="text-right space-y-1">
          <div>{toBin(q.a)}<span className="text-gray-500 text-sm ml-2">(= {q.a})</span></div>
          <div className="border-t border-gray-600 pt-1">
            <span className="text-gray-400 mr-1">÷</span>
            {toBin(q.b)}<span className="text-gray-500 text-sm ml-2">(= {q.b})</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-gray-400 font-mono text-lg">=</span>
        <input
          value={input}
          onChange={(e) => { setInput(e.target.value.replace(/[^01]/g, '')); setChecked(false) }}
          onKeyDown={(e) => e.key === 'Enter' && input && !checked && setChecked(true)}
          placeholder="Binary result"
          className="w-44 rounded-xl px-4 py-2 font-mono text-lg bg-gray-800 border border-gray-600 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500"
        />
      </div>
      {checked && (
        <div className={`rounded-xl p-3 text-sm mb-3 ${isCorrect ? 'bg-emerald-900/30 border border-emerald-700' : 'bg-red-900/30 border border-red-700'}`}>
          <ResultBadge correct={isCorrect} />
          {!isCorrect && (
            <p className="mt-1 text-gray-300">
              Correct answer:{' '}
              <span className="font-mono font-bold text-white">{q.ans.toString(2)}</span>
              {' '}(= {q.ans})
            </p>
          )}
        </div>
      )}
      <div className="flex gap-2">
        {!checked ? (
          <Button
            size="sm"
            disabled={!input}
            onClick={() => setChecked(true)}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Check
          </Button>
        ) : (
          <Button size="sm" onClick={next} className="bg-emerald-600 hover:bg-emerald-700 gap-1">
            New Problem <RefreshCw className="w-4 h-4" />
          </Button>
        )}
      </div>
    </ActivityShell>
  )
}

// ─────────────────────────────────────────────
// NEW: Boolean Algebra Explorer (Lesson 8 – Intro to Boolean Algebra)
//      Interactive expression evaluator + law identifier
// ─────────────────────────────────────────────
interface BoolAlgProblem {
  expression: string
  description: string
  evaluate: (a: boolean, b: boolean) => boolean
  law: string
}

const BOOL_ALG_PROBLEMS: BoolAlgProblem[] = [
  {
    expression: 'A AND B',
    description: 'Both inputs must be TRUE for the result to be TRUE.',
    evaluate: (a, b) => a && b,
    law: 'AND Operation',
  },
  {
    expression: 'A OR B',
    description: 'At least one input must be TRUE for the result to be TRUE.',
    evaluate: (a, b) => a || b,
    law: 'OR Operation',
  },
  {
    expression: 'NOT A',
    description: 'The result is the opposite of A.',
    evaluate: (a) => !a,
    law: 'NOT Operation',
  },
  {
    expression: 'A AND (A OR B)',
    description: 'By Absorption Law, this simplifies to just A.',
    evaluate: (a, b) => a && (a || b),
    law: 'Absorption Law',
  },
  {
    expression: "A OR (NOT A)",
    description: 'A variable ORed with its complement is always TRUE.',
    evaluate: () => true,
    law: 'Complement Law',
  },
  {
    expression: "A AND (NOT A)",
    description: 'A variable ANDed with its complement is always FALSE.',
    evaluate: () => false,
    law: 'Complement Law',
  },
]

const BooleanAlgebraExplorer = () => {
  const [problemIdx, setProblemIdx] = useState(0)
  const [a, setA] = useState(false)
  const [b, setB] = useState(false)
  const [showLaw, setShowLaw] = useState(false)

  const problem = BOOL_ALG_PROBLEMS[problemIdx % BOOL_ALG_PROBLEMS.length]
  const result = problem.evaluate(a, b)

  const nextProblem = () => {
    setProblemIdx((p) => p + 1)
    setA(false)
    setB(false)
    setShowLaw(false)
  }

  const isUnary = problem.expression.startsWith('NOT') && !problem.expression.includes('AND') && !problem.expression.includes('OR')

  return (
    <ActivityShell title="Boolean Algebra Explorer" emoji=" ">
      <p className="text-gray-300 text-sm mb-5">
        Toggle the inputs to see how Boolean expressions evaluate. Explore the fundamental laws of Boolean Algebra.
      </p>

      {/* Expression display */}
      <div className="text-center mb-5">
        <div className="inline-block bg-gray-800 rounded-xl px-6 py-3 text-xl font-mono font-bold text-yellow-300 border border-gray-700">
          {problem.expression}
        </div>
        <p className="text-xs text-gray-500 mt-2">{problem.description}</p>
      </div>

      {/* Input toggles */}
      <div className="flex justify-center gap-6 mb-6">
        <button
          onClick={() => setA((v) => !v)}
          className={`w-24 h-24 rounded-2xl text-3xl font-mono font-bold border-2 transition-all flex flex-col items-center justify-center gap-1 ${a
            ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-900/50'
            : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-400'
            }`}
        >
          <span>A</span>
          <span className={`text-xs font-semibold ${a ? 'text-indigo-200' : 'text-gray-600'}`}>
            {a ? 'TRUE' : 'FALSE'}
          </span>
        </button>
        {!isUnary && (
          <button
            onClick={() => setB((v) => !v)}
            className={`w-24 h-24 rounded-2xl text-3xl font-mono font-bold border-2 transition-all flex flex-col items-center justify-center gap-1 ${b
              ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-900/50'
              : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-400'
              }`}
          >
            <span>B</span>
            <span className={`text-xs font-semibold ${b ? 'text-indigo-200' : 'text-gray-600'}`}>
              {b ? 'TRUE' : 'FALSE'}
            </span>
          </button>
        )}
      </div>

      {/* Result */}
      <div className="text-center mb-5">
        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2">Result</p>
        <div className={`inline-block w-20 h-20 rounded-2xl text-3xl font-mono font-bold border-2 flex items-center justify-center transition-all ${result
          ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-900/50'
          : 'bg-gray-800 border-gray-600 text-gray-400'
          }`}
        >
          {result ? '1' : '0'}
        </div>
        <p className={`text-sm font-semibold mt-2 ${result ? 'text-emerald-400' : 'text-gray-500'}`}>
          {result ? 'TRUE' : 'FALSE'}
        </p>
      </div>

      {/* Truth table */}
      <div className="rounded-xl overflow-hidden border border-gray-700 mb-4">
        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-4 py-2 text-gray-400 text-center">A</th>
              {!isUnary && <th className="px-4 py-2 text-gray-400 text-center">B</th>}
              <th className="px-4 py-2 text-indigo-400 text-center">Result</th>
            </tr>
          </thead>
          <tbody>
            {(isUnary
              ? ([[false, false], [true, false]] as [boolean, boolean][])
              : ([[false, false], [false, true], [true, false], [true, true]] as [boolean, boolean][])
            ).map(([ra, rb], idx) => {
              const out = problem.evaluate(ra, rb)
              const isActive = isUnary ? ra === a : (ra === a && rb === b)
              return (
                <tr
                  key={idx}
                  className={`border-t border-gray-700 transition-colors ${isActive ? 'bg-indigo-900/40 font-bold' : 'bg-gray-900'}`}
                >
                  <td className="px-4 py-2 text-center text-white">{ra ? '1' : '0'}</td>
                  {!isUnary && <td className="px-4 py-2 text-center text-white">{rb ? '1' : '0'}</td>}
                  <td className={`px-4 py-2 text-center font-bold ${out ? 'text-emerald-400' : 'text-red-400'}`}>
                    {out ? '1' : '0'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Law reveal */}
      <button
        onClick={() => setShowLaw(!showLaw)}
        className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-2 block mb-3"
      >
        {showLaw ? 'Hide' : 'Reveal'} Boolean Law
      </button>
      {showLaw && (
        <div className="rounded-lg bg-indigo-900/20 border border-indigo-700/40 px-4 py-3 text-sm text-indigo-300 mb-4">
          <Info className="w-4 h-4 inline-block mr-1" />
          <span className="font-semibold text-white">{problem.law}</span>: {problem.description}
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-2">
        <Button size="sm" onClick={nextProblem} className="bg-indigo-600 hover:bg-indigo-700 gap-1">
          Next Expression <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      <p className="text-center text-xs text-gray-600 mt-3">
        {(problemIdx % BOOL_ALG_PROBLEMS.length) + 1} / {BOOL_ALG_PROBLEMS.length}
      </p>
    </ActivityShell>
  )
}

// ─────────────────────────────────────────────
// 7. Logic Gate Circuit Builder  (Lesson 9 – Logic Gates)
//    Users select and place the correct logic gate to complete a circuit
// ─────────────────────────────────────────────
type CircuitGateType = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR'

interface CircuitPuzzle {
  description: string
  inputs: { a: number; b: number; expected: number }[]
  answer: CircuitGateType
  hint: string
}

const CIRCUIT_PUZZLES: CircuitPuzzle[] = [
  {
    description: 'Place a gate so the output is 1 only when BOTH inputs are 1.',
    inputs: [
      { a: 0, b: 0, expected: 0 },
      { a: 0, b: 1, expected: 0 },
      { a: 1, b: 0, expected: 0 },
      { a: 1, b: 1, expected: 1 },
    ],
    answer: 'AND',
    hint: 'This gate outputs 1 only when A=1 AND B=1.',
  },
  {
    description: 'Place a gate so the output is 1 when AT LEAST ONE input is 1.',
    inputs: [
      { a: 0, b: 0, expected: 0 },
      { a: 0, b: 1, expected: 1 },
      { a: 1, b: 0, expected: 1 },
      { a: 1, b: 1, expected: 1 },
    ],
    answer: 'OR',
    hint: 'This gate outputs 1 when A=1 OR B=1 (or both).',
  },
  {
    description: 'Place a gate so the output is 1 when EXACTLY ONE input is 1.',
    inputs: [
      { a: 0, b: 0, expected: 0 },
      { a: 0, b: 1, expected: 1 },
      { a: 1, b: 0, expected: 1 },
      { a: 1, b: 1, expected: 0 },
    ],
    answer: 'XOR',
    hint: 'This gate outputs 1 only when the inputs are different.',
  },
  {
    description: 'Place a gate so the output is the OPPOSITE of AND.',
    inputs: [
      { a: 0, b: 0, expected: 1 },
      { a: 0, b: 1, expected: 1 },
      { a: 1, b: 0, expected: 1 },
      { a: 1, b: 1, expected: 0 },
    ],
    answer: 'NAND',
    hint: 'NAND = NOT(AND). It outputs 0 only when both inputs are 1.',
  },
  {
    description: 'Place a gate so the output is 0 when ANY input is 1.',
    inputs: [
      { a: 0, b: 0, expected: 1 },
      { a: 0, b: 1, expected: 0 },
      { a: 1, b: 0, expected: 0 },
      { a: 1, b: 1, expected: 0 },
    ],
    answer: 'NOR',
    hint: 'NOR = NOT(OR). It outputs 1 only when both inputs are 0.',
  },
]

const AVAILABLE_GATES: CircuitGateType[] = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR']

const gateColorMap: Record<CircuitGateType, { bg: string; border: string; shadow: string }> = {
  AND: { bg: 'bg-indigo-600', border: 'border-indigo-400', shadow: 'shadow-indigo-900/40' },
  OR: { bg: 'bg-blue-600', border: 'border-blue-400', shadow: 'shadow-blue-900/40' },
  NOT: { bg: 'bg-orange-600', border: 'border-orange-400', shadow: 'shadow-orange-900/40' },
  NAND: { bg: 'bg-pink-600', border: 'border-pink-400', shadow: 'shadow-pink-900/40' },
  NOR: { bg: 'bg-rose-600', border: 'border-rose-400', shadow: 'shadow-rose-900/40' },
  XOR: { bg: 'bg-emerald-600', border: 'border-emerald-400', shadow: 'shadow-emerald-900/40' },
}

const gateSymbolMap: Record<CircuitGateType, string> = {
  AND: 'A · B',
  OR: 'A + B',
  NOT: "A'",
  NAND: "(A · B)'",
  NOR: "(A + B)'",
  XOR: 'A ⊕ B',
}

const evalCircuitGate = (gate: CircuitGateType, a: number, b: number): number => {
  switch (gate) {
    case 'AND': return a & b
    case 'OR': return a | b
    case 'NOT': return a === 1 ? 0 : 1
    case 'NAND': return (a & b) === 1 ? 0 : 1
    case 'NOR': return (a | b) === 1 ? 0 : 1
    case 'XOR': return a ^ b
  }
}

const LogicGateCircuitBuilder = () => {
  const [puzzleIdx, setPuzzleIdx] = useState(0)
  const [selectedGate, setSelectedGate] = useState<CircuitGateType | null>(null)
  const [placedGate, setPlacedGate] = useState<CircuitGateType | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [previewInputIdx, setPreviewInputIdx] = useState(0)

  const puzzle = CIRCUIT_PUZZLES[puzzleIdx % CIRCUIT_PUZZLES.length]
  const isCorrect = placedGate === puzzle.answer

  const previewRow = puzzle.inputs[previewInputIdx]
  const liveOutput = placedGate ? evalCircuitGate(placedGate, previewRow.a, previewRow.b) : null

  const handlePlaceGate = () => {
    if (selectedGate && !submitted) {
      setPlacedGate(selectedGate)
      setSelectedGate(null)
    }
  }

  const handleSubmit = () => {
    if (!placedGate) return
    setSubmitted(true)
    if (isCorrect) setScore((s) => s + 1)
  }

  const handleNext = () => {
    setPuzzleIdx((p) => p + 1)
    setPlacedGate(null)
    setSelectedGate(null)
    setSubmitted(false)
    setShowHint(false)
    setPreviewInputIdx(0)
  }

  const handleReset = () => {
    setPlacedGate(null)
    setSelectedGate(null)
    setSubmitted(false)
    setShowHint(false)
  }

  return (
    <ActivityShell title="Logic Gate Circuit Builder" emoji=" ">
      <p className="text-gray-300 text-sm mb-2">
        {puzzle.description}
      </p>
      <p className="text-xs text-gray-500 mb-5">
        Select a gate from the palette below, then click the empty slot to place it.
      </p>

      {/* ── Circuit Diagram ── */}
      <div className="rounded-xl bg-gray-900/80 border border-gray-700 p-4 mb-5">
        <div className="flex items-center justify-center gap-3 sm:gap-5">
          {/* Input wires */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-mono w-4">A</span>
              <div className={`w-10 h-10 rounded-lg font-mono font-bold text-lg border-2 flex items-center justify-center transition-all ${previewRow.a === 1
                ? 'bg-indigo-600 border-indigo-400 text-white'
                : 'bg-gray-800 border-gray-600 text-gray-400'
                }`}
              >
                {previewRow.a}
              </div>
              <div className="w-6 h-0.5 bg-gray-600" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-mono w-4">B</span>
              <div className={`w-10 h-10 rounded-lg font-mono font-bold text-lg border-2 flex items-center justify-center transition-all ${previewRow.b === 1
                ? 'bg-indigo-600 border-indigo-400 text-white'
                : 'bg-gray-800 border-gray-600 text-gray-400'
                }`}
              >
                {previewRow.b}
              </div>
              <div className="w-6 h-0.5 bg-gray-600" />
            </div>
          </div>

          {/* Gate slot */}
          <button
            onClick={handlePlaceGate}
            disabled={submitted || !selectedGate}
            className={`w-24 h-20 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${placedGate
              ? `${gateColorMap[placedGate].bg} ${gateColorMap[placedGate].border} shadow-lg ${gateColorMap[placedGate].shadow}`
              : selectedGate
                ? 'border-dashed border-yellow-500 bg-yellow-900/20 cursor-pointer hover:bg-yellow-900/30'
                : 'border-dashed border-gray-600 bg-gray-800/50'
              }`}
          >
            {placedGate ? (
              <>
                <span className="text-white font-bold font-mono text-sm">{placedGate}</span>
                <span className="text-white/60 text-[10px] font-mono">{gateSymbolMap[placedGate]}</span>
              </>
            ) : selectedGate ? (
              <span className="text-yellow-400 text-xs font-semibold">Click to place</span>
            ) : (
              <>
                <span className="text-gray-600 text-2xl">?</span>
                <span className="text-gray-600 text-[10px]">Empty slot</span>
              </>
            )}
          </button>

          {/* Output wire & result */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-gray-600" />
            <div className={`w-12 h-12 rounded-xl font-mono font-bold text-xl border-2 flex items-center justify-center transition-all ${liveOutput !== null
              ? liveOutput === 1
                ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-900/40'
                : 'bg-gray-800 border-gray-600 text-gray-400'
              : 'bg-gray-800/50 border-dashed border-gray-600 text-gray-600'
              }`}
            >
              {liveOutput !== null ? liveOutput : '?'}
            </div>
            <span className="text-xs text-gray-500 font-mono">Out</span>
          </div>
        </div>

        {/* Input row selector */}
        <div className="flex justify-center gap-2 mt-4">
          {puzzle.inputs.map((row, idx) => (
            <button
              key={idx}
              onClick={() => setPreviewInputIdx(idx)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all border ${previewInputIdx === idx
                ? 'bg-indigo-700 border-indigo-500 text-white'
                : 'bg-gray-800 border-gray-700 text-gray-500 hover:border-gray-500'
                }`}
            >
              {row.a},{row.b}→{row.expected}
            </button>
          ))}
        </div>
      </div>

      {/* ── Gate Palette ── */}
      <div className="mb-5">
        <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-widest">Gate Palette</p>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_GATES.map((gate) => {
            const colors = gateColorMap[gate]
            const isSelected = selectedGate === gate
            const isPlaced = placedGate === gate
            return (
              <button
                key={gate}
                onClick={() => !submitted && setSelectedGate(gate)}
                disabled={submitted}
                className={`px-3 py-2 rounded-xl font-mono font-bold text-sm border-2 transition-all flex flex-col items-center gap-0.5 min-w-[60px] ${isSelected
                  ? `${colors.bg} ${colors.border} text-white shadow-lg ${colors.shadow} scale-105`
                  : isPlaced && submitted
                    ? isCorrect
                      ? 'bg-emerald-800 border-emerald-500 text-emerald-200'
                      : 'bg-red-800 border-red-500 text-red-200'
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300'
                  } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <span>{gate}</span>
                <span className="text-[10px] font-normal opacity-60">{gateSymbolMap[gate]}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Truth Table Verification ── */}
      {placedGate && (
        <div className="rounded-xl overflow-hidden border border-gray-700 mb-4">
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="bg-gray-800">
                <th className="px-3 py-2 text-gray-400 text-center">A</th>
                <th className="px-3 py-2 text-gray-400 text-center">B</th>
                <th className="px-3 py-2 text-gray-400 text-center">Expected</th>
                <th className="px-3 py-2 text-indigo-400 text-center">Your Gate</th>
                {submitted && <th className="px-3 py-2 text-gray-400 text-center">Match</th>}
              </tr>
            </thead>
            <tbody>
              {puzzle.inputs.map((row, idx) => {
                const gateOut = evalCircuitGate(placedGate, row.a, row.b)
                const matches = gateOut === row.expected
                return (
                  <tr key={idx} className={`border-t border-gray-700 ${previewInputIdx === idx ? 'bg-indigo-900/20' : 'bg-gray-900'}`}>
                    <td className="px-3 py-2 text-center text-white">{row.a}</td>
                    <td className="px-3 py-2 text-center text-white">{row.b}</td>
                    <td className="px-3 py-2 text-center text-yellow-300 font-bold">{row.expected}</td>
                    <td className={`px-3 py-2 text-center font-bold ${submitted
                      ? matches ? 'text-emerald-400' : 'text-red-400'
                      : 'text-white'
                      }`}
                    >
                      {gateOut}
                    </td>
                    {submitted && (
                      <td className="px-3 py-2 text-center">
                        {matches
                          ? <CheckCircle className="w-4 h-4 text-emerald-400 inline" />
                          : <XCircle className="w-4 h-4 text-red-400 inline" />
                        }
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Feedback ── */}
      {submitted && (
        <div className={`rounded-xl p-3 text-sm mb-4 ${isCorrect
          ? 'bg-emerald-900/30 border border-emerald-700'
          : 'bg-red-900/30 border border-red-700'
          }`}
        >
          <ResultBadge correct={isCorrect} />
          {isCorrect ? (
            <p className="mt-1 text-emerald-300/80 text-xs">
              The <span className="font-mono font-bold text-white">{puzzle.answer}</span> gate ({gateSymbolMap[puzzle.answer]}) produces the correct truth table!
            </p>
          ) : (
            <p className="mt-1 text-red-300/80 text-xs">
              The correct gate was <span className="font-mono font-bold text-white">{puzzle.answer}</span> ({gateSymbolMap[puzzle.answer]}). {puzzle.hint}
            </p>
          )}
        </div>
      )}

      {/* ── Hint ── */}
      {!submitted && (
        <button
          onClick={() => setShowHint(!showHint)}
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-2 mb-3 block"
        >
          {showHint ? 'Hide hint' : 'Need a hint?'}
        </button>
      )}
      {showHint && !submitted && (
        <div className="rounded-lg bg-indigo-900/20 border border-indigo-700/40 px-3 py-2 text-xs text-indigo-300 mb-4">
          <Info className="w-3.5 h-3.5 inline-block mr-1" />
          {puzzle.hint}
        </div>
      )}

      {/* ── Action Buttons ── */}
      <div className="flex items-center gap-2">
        {!submitted ? (
          <>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!placedGate}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Check Circuit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              className="border-gray-600 text-gray-300 hover:bg-gray-800 gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </Button>
          </>
        ) : (
          <Button size="sm" onClick={handleNext} className="bg-emerald-600 hover:bg-emerald-700 gap-1">
            Next Puzzle <ChevronRight className="w-4 h-4" />
          </Button>
        )}
        <div className="ml-auto flex items-center gap-1.5 text-sm">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span className="font-mono font-bold text-yellow-300">{score}</span>
          <span className="text-gray-600">/ {puzzleIdx + (submitted ? 1 : 0)}</span>
        </div>
      </div>
    </ActivityShell>
  )
}

// ─────────────────────────────────────────────
// 8. Signed / Unsigned Interpreter  (Lesson 10)
// ─────────────────────────────────────────────
const SignedUnsignedInterpreter = () => {
  const [bits, setBits] = useState<number[]>([1, 0, 1, 1, 0, 1, 1, 0])

  const toggle = (i: number) => {
    const next = [...bits]
    next[i] = next[i] === 1 ? 0 : 1
    setBits(next)
  }

  const unsigned = bits.reduce((acc, b, i) => acc + b * Math.pow(2, 7 - i), 0)
  // 2's complement signed interpretation
  const signed = bits[0] === 0
    ? unsigned
    : -(256 - unsigned)

  return (
    <ActivityShell title="Signed vs Unsigned Interpreter" emoji=" ">
      <p className="text-gray-300 text-sm mb-4">
        Toggle bits and observe how the same bit pattern represents different values depending on interpretation.
        The <span className="text-yellow-400 font-semibold">MSB (leftmost bit)</span> is the sign bit in signed mode.
      </p>
      <div className="flex gap-1 flex-wrap mb-4 justify-center">
        {bits.map((b, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            {i === 0 && (
              <span className="text-[10px] text-yellow-400 font-semibold">MSB</span>
            )}
            {i !== 0 && <span className="text-[10px] text-gray-600"> </span>}
            <button
              onClick={() => toggle(i)}
              className={`w-11 h-11 rounded-lg font-mono font-bold text-lg border-2 transition-all ${i === 0
                ? b === 1
                  ? 'bg-yellow-600 border-yellow-400 text-white'
                  : 'bg-gray-800 border-yellow-600/40 text-gray-400 hover:border-yellow-500'
                : b === 1
                  ? 'bg-indigo-600 border-indigo-400 text-white'
                  : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-400'
                }`}
            >
              {b}
            </button>
            <span className="text-[10px] text-gray-600 font-mono">{Math.pow(2, 7 - i)}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-blue-900/30 border border-blue-700 p-3 text-center">
          <p className="text-xs text-blue-400 font-semibold uppercase tracking-widest mb-1">Unsigned</p>
          <p className="text-3xl font-mono font-bold text-blue-300">{unsigned}</p>
          <p className="text-xs text-gray-500 mt-1">Range: 0 – 255</p>
        </div>
        <div className="rounded-xl bg-purple-900/30 border border-purple-700 p-3 text-center">
          <p className="text-xs text-purple-400 font-semibold uppercase tracking-widest mb-1">Signed (2's comp)</p>
          <p className="text-3xl font-mono font-bold text-purple-300">{signed}</p>
          <p className="text-xs text-gray-500 mt-1">Range: −128 – +127</p>
        </div>
      </div>

      {bits[0] === 1 && (
        <p className="mt-3 text-xs text-yellow-400 bg-yellow-900/20 rounded-lg px-3 py-2 border border-yellow-700/40">
          MSB = 1 → Negative in signed mode! Same bits = {unsigned} unsigned vs {signed} signed.
        </p>
      )}
    </ActivityShell>
  )
}

// ─────────────────────────────────────────────
// 9. BCD Encoder / ASCII Encoder  (Lesson 11)
// ─────────────────────────────────────────────
const BcdAsciiEncoder = ({ mode }: { mode: 'bcd' | 'ascii' }) => {
  const [input, setInput] = useState('')
  const isBcd = mode === 'bcd'

  const encode = (s: string): string => {
    if (isBcd) {
      return s
        .split('')
        .filter((c) => c >= '0' && c <= '9')
        .map((c) => parseInt(c).toString(2).padStart(4, '0'))
        .join(' ')
    } else {
      return s
        .split('')
        .map((c) => c.charCodeAt(0).toString(2).padStart(8, '0'))
        .join(' ')
    }
  }

  const result = encode(input)

  return (
    <ActivityShell
      title={isBcd ? 'BCD Encoder' : 'ASCII to Binary Encoder'}
      emoji={isBcd ? ' ' : ' '}
    >
      <p className="text-gray-300 text-sm mb-4">
        {isBcd
          ? 'Type digits (0–9) and see each digit encoded as 4 binary bits (BCD).'
          : 'Type any text and see each character encoded as 8-bit ASCII binary.'}
      </p>
      <input
        value={input}
        onChange={(e) =>
          setInput(
            isBcd
              ? e.target.value.replace(/[^0-9]/g, '').slice(0, 8)
              : e.target.value.slice(0, 12)
          )
        }
        placeholder={isBcd ? 'e.g. 2024' : 'e.g. Hi!'}
        className="w-full rounded-xl px-4 py-3 font-mono text-xl bg-gray-800 border border-gray-600 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500 mb-4"
      />
      {result && (
        <div className="rounded-xl bg-gray-800 border border-gray-700 p-4">
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-widest font-semibold">
            {isBcd ? 'BCD Output (4 bits per digit)' : 'ASCII Binary Output (8 bits per char)'}
          </p>
          <div className="flex flex-wrap gap-2">
            {input.split('').map((ch, i) => {
              const enc = isBcd
                ? parseInt(ch).toString(2).padStart(4, '0')
                : ch.charCodeAt(0).toString(2).padStart(8, '0')
              const code = isBcd ? parseInt(ch) : ch.charCodeAt(0)
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span className="text-sm font-bold text-yellow-300 font-mono">
                    {ch === ' ' ? '⎵' : ch}
                  </span>
                  <span className="text-xs font-mono text-gray-500">{code}</span>
                  <span className="text-xs font-mono text-indigo-300 bg-gray-900 rounded px-1 py-0.5 border border-gray-700">
                    {enc}
                  </span>
                </div>
              )
            })}
          </div>
          {!isBcd && (
            <p className="mt-3 text-xs text-gray-600">
              Hex: {input.split('').map((c) => c.charCodeAt(0).toString(16).padStart(2, '0').toUpperCase()).join(' ')}
            </p>
          )}
        </div>
      )}
    </ActivityShell>
  )
}

// ─────────────────────────────────────────────
// 10. Boolean Values Playground  (Lesson 1)
// Simple A / B toggles → live AND, OR, NOT results
// ─────────────────────────────────────────────
const BooleanScenarioBuilder = () => {
  const [a, setA] = useState(false)
  const [b, setB] = useState(false)

  const ops = [
    { label: 'A AND B', symbol: 'A · B', value: a && b, color: 'indigo' },
    { label: 'A OR B', symbol: 'A + B', value: a || b, color: 'green' },
    { label: 'NOT A', symbol: "A'", value: !a, color: 'orange' },
    { label: 'NOT B', symbol: "B'", value: !b, color: 'pink' },
  ]

  const colorMap: Record<string, { pill: string; true: string; false: string }> = {
    indigo: { pill: 'bg-indigo-600 border-indigo-400', true: 'text-indigo-300', false: 'text-gray-600' },
    green: { pill: 'bg-green-600  border-green-400', true: 'text-green-300', false: 'text-gray-600' },
    orange: { pill: 'bg-orange-600 border-orange-400', true: 'text-orange-300', false: 'text-gray-600' },
    pink: { pill: 'bg-pink-600   border-pink-400', true: 'text-pink-300', false: 'text-gray-600' },
  }

  const ToggleBtn = ({
    label, value, onClick,
  }: { label: string; value: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`w-28 h-28 rounded-2xl text-4xl font-mono font-bold border-3 transition-all duration-150 select-none flex flex-col items-center justify-center gap-1 border-2 ${value
        ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-900/50'
        : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-400'
        }`}
    >
      <span>{label}</span>
      <span className={`text-sm font-semibold ${value ? 'text-indigo-200' : 'text-gray-600'}`}>
        {value ? 'TRUE' : 'FALSE'}
      </span>
    </button>
  )

  return (
    <ActivityShell title="Boolean Values Playground" emoji=" ">
      <p className="text-gray-400 text-sm mb-6">
        Toggle <span className="font-mono font-bold text-white">A</span> and{' '}
        <span className="font-mono font-bold text-white">B</span> to see how Boolean
        operations work in real time.
      </p>

      {/* A / B toggles */}
      <div className="flex justify-center gap-6 mb-8">
        <ToggleBtn label="A" value={a} onClick={() => setA(v => !v)} />
        <ToggleBtn label="B" value={b} onClick={() => setB(v => !v)} />
      </div>

      {/* Results grid */}
      <div className="grid grid-cols-2 gap-3">
        {ops.map(op => {
          const c = colorMap[op.color]
          return (
            <div
              key={op.label}
              className={`rounded-xl border-2 p-3 text-center transition-all duration-200 ${op.value
                ? `border-${op.color}-600 bg-${op.color}-900/20`
                : 'border-gray-700 bg-gray-800/40'
                }`}
            >
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-widest mb-1">
                {op.label}
              </div>
              <div className="font-mono text-sm text-gray-400 mb-2">{op.symbol}</div>
              <div className={`text-2xl font-bold font-mono ${op.value ? c.true : c.false}`}>
                {op.value ? '1' : '0'}
              </div>
              <div className={`text-xs font-semibold mt-1 ${op.value ? c.true : 'text-gray-600'}`}>
                {op.value ? 'TRUE' : 'FALSE'}
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-center text-xs text-gray-600 mt-4">
        Click the buttons above to toggle values
      </p>
    </ActivityShell>
  )
}


// ─────────────────────────────────────────────
// 11. K-Map Simplification visual  (Lesson 4)
// ─────────────────────────────────────────────
const KMapActivity = () => {
  // 2-variable K-Map practice: show random truth table, user identifies the simplified expression
  const problems = [
    { values: [0, 0, 0, 1], answer: "A · B", hint: "Only bottom-right cell = 1. Both A and B must be 1." },
    { values: [0, 1, 0, 1], answer: "B", hint: "Right column (B=1) is all 1s. Simplify to just B." },
    { values: [0, 0, 1, 1], answer: "A", hint: "Bottom row (A=1) is all 1s. Simplify to just A." },
    { values: [0, 1, 1, 1], answer: "A + B", hint: "Three 1s — everything except (A=0,B=0). That's A OR B." },
    { values: [1, 0, 0, 0], answer: "A' · B'", hint: "Only top-left (A=0,B=0) = 1. Both must be 0." },
  ]
  const [pi, setPi] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  const p = problems[pi]
  const choices = ["A · B", "B", "A", "A + B", "A' · B'"]

  const next = () => {
    setPi((prev) => (prev + 1) % problems.length)
    setSelected(null)
    setChecked(false)
  }

  // 2-variable K-map layout: rows = A (0,1), cols = B (0,1)
  // values index: [00, 01, 10, 11] → positions [0,1,2,3]
  const cellLabels = [
    { row: 0, col: 0, idx: 0 }, // A=0,B=0
    { row: 0, col: 1, idx: 1 }, // A=0,B=1
    { row: 1, col: 0, idx: 2 }, // A=1,B=0
    { row: 1, col: 1, idx: 3 }, // A=1,B=1
  ]

  return (
    <ActivityShell title="K-Map Simplification Challenge" emoji=" ">
      <p className="text-gray-300 text-sm mb-4">
        Analyze the Karnaugh Map and select the simplified Boolean expression.
      </p>

      <div className="flex justify-center mb-5">
        <div>
          {/* Column headers */}
          <div className="flex">
            <div className="w-12" />
            <div className="flex">
              <div className="w-12 text-center text-xs text-gray-400 font-mono pb-1">B=0</div>
              <div className="w-12 text-center text-xs text-gray-400 font-mono pb-1">B=1</div>
            </div>
          </div>
          {/* Rows */}
          {[0, 1].map((row) => (
            <div key={row} className="flex items-center">
              <div className="w-12 text-xs text-gray-400 font-mono text-right pr-2">A={row}</div>
              <div className="flex">
                {[0, 1].map((col) => {
                  const cell = cellLabels.find((c) => c.row === row && c.col === col)!
                  const v = p.values[cell.idx]
                  return (
                    <div
                      key={col}
                      className={`w-12 h-12 border border-gray-600 flex items-center justify-center text-xl font-mono font-bold ${v === 1
                        ? 'bg-indigo-700 text-white'
                        : 'bg-gray-800 text-gray-600'
                        }`}
                    >
                      {v}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Choices */}
      <div className="flex flex-wrap gap-2 mb-4">
        {choices.map((c) => (
          <button
            key={c}
            onClick={() => { setSelected(c); setChecked(false) }}
            className={`px-4 py-2 rounded-xl font-mono text-sm font-semibold border-2 transition-all ${selected === c
              ? checked
                ? c === p.answer
                  ? 'bg-emerald-800 border-emerald-500 text-emerald-200'
                  : 'bg-red-800 border-red-500 text-red-200'
                : 'bg-indigo-800 border-indigo-500 text-white'
              : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
          >
            {c}
          </button>
        ))}
      </div>

      {checked && (
        <div className={`rounded-xl p-3 text-sm mb-3 ${selected === p.answer ? 'bg-emerald-900/30 border border-emerald-700' : 'bg-yellow-900/30 border border-yellow-700'}`}>
          <ResultBadge correct={selected === p.answer} />
          <p className="text-gray-400 mt-1 text-xs">{p.hint}</p>
        </div>
      )}

      <div className="flex gap-2">
        {!checked ? (
          <Button
            size="sm"
            disabled={!selected}
            onClick={() => setChecked(true)}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Check
          </Button>
        ) : (
          <Button size="sm" onClick={next} className="bg-emerald-600 hover:bg-emerald-700 gap-1">
            Next Map <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </ActivityShell>
  )
}

// ─────────────────────────────────────────────
// 12b. Binary ↔ Decimal Relationship Explorer  (Lesson 2 – Binary ↔ Decimal)
// ─────────────────────────────────────────────
const RELATIONSHIP_CHALLENGES = [
  { target: 42, hint: '32 + 8 + 2' },
  { target: 100, hint: '64 + 32 + 4' },
  { target: 7, hint: '4 + 2 + 1' },
  { target: 200, hint: '128 + 64 + 8' },
  { target: 55, hint: '32 + 16 + 4 + 2 + 1' },
  { target: 170, hint: '128 + 32 + 8 + 2' },
  { target: 15, hint: '8 + 4 + 2 + 1' },
  { target: 255, hint: 'All bits ON' },
]

const BinaryDecimalRelationship = () => {
  const [bits, setBits] = useState<number[]>([0, 0, 1, 0, 1, 0, 1, 0]) // 42
  const [challengeMode, setChallengeMode] = useState(false)
  const [ci, setCi] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [completed, setCompleted] = useState(0)

  const toggle = (i: number) => {
    const next = [...bits]
    next[i] = next[i] === 1 ? 0 : 1
    setBits(next)
  }

  const decimalValue = bits.reduce((acc, b, i) => acc + b * Math.pow(2, 7 - i), 0)
  const powers = bits.map((_, i) => Math.pow(2, 7 - i)) // [128,64,32,16,8,4,2,1]
  const activePowers = bits.map((b, i) => b === 1 ? powers[i] : 0).filter(v => v > 0)

  const challenge = RELATIONSHIP_CHALLENGES[ci % RELATIONSHIP_CHALLENGES.length]
  const isSolved = decimalValue === challenge.target

  const nextChallenge = () => {
    setCi(p => p + 1)
    setBits([0, 0, 0, 0, 0, 0, 0, 0])
    setShowHint(false)
    setCompleted(p => p + 1)
  }

  return (
    <ActivityShell title="Binary ↔ Decimal Relationship" emoji=" ">
      <p className="text-gray-300 text-sm mb-4">
        Toggle each bit to see how <span className="text-indigo-300 font-semibold">powers of 2</span> build up a decimal number.
        Each position has a weight — only <span className="text-emerald-300 font-semibold">active (1)</span> bits contribute to the total.
      </p>

      {/* Bit toggles with power labels */}
      <div className="flex flex-col items-center gap-1 mb-4">
        {/* Power of 2 labels */}
        <div className="flex gap-1.5">
          {powers.map((_, i) => (
            <div key={`pow-${i}`} className="w-12 text-center">
              <span className="text-[10px] text-gray-500 font-mono">2{`\u2077\u2076\u2075\u2074\u00B3\u00B2\u00B9\u2070`[i]}</span>
            </div>
          ))}
        </div>
        {/* Weight labels */}
        <div className="flex gap-1.5">
          {powers.map((p, i) => (
            <div key={`wt-${i}`} className="w-12 text-center">
              <span className={`text-[10px] font-mono font-bold ${bits[i] === 1 ? 'text-emerald-400' : 'text-gray-600'}`}>{p}</span>
            </div>
          ))}
        </div>
        {/* Bit buttons */}
        <div className="flex gap-1.5">
          {bits.map((bit, i) => (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={`w-12 h-14 rounded-xl text-xl font-bold font-mono border-2 transition-all ${bit === 1
                ? 'bg-emerald-600 border-emerald-400 text-white shadow-md shadow-emerald-900/50'
                : 'bg-gray-800 border-gray-600 text-gray-500 hover:border-gray-400'
                }`}
            >
              {bit}
            </button>
          ))}
        </div>
        {/* Position indices */}
        <div className="flex gap-1.5">
          {powers.map((_, i) => (
            <div key={`pos-${i}`} className="w-12 text-center">
              <span className="text-[9px] text-gray-600 font-mono">pos {7 - i}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Expansion and result */}
      <div className="rounded-xl border border-gray-700 bg-gray-900/60 p-4 mb-4">
        <div className="text-sm text-gray-400 mb-2 font-mono">
          {activePowers.length > 0 ? (
            <>
              <span className="text-gray-500">Expansion: </span>
              {activePowers.map((p, i) => (
                <span key={i}>
                  {i > 0 && <span className="text-gray-600"> + </span>}
                  <span className="text-emerald-400 font-bold">{p}</span>
                </span>
              ))}
            </>
          ) : (
            <span className="text-gray-600 italic">Toggle a bit to see the expansion</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Binary:</span>
          <span className="text-lg font-mono font-bold text-indigo-300 tracking-widest">{bits.join('')}<sub className="text-xs text-gray-500">₂</sub></span>
          <span className="text-gray-600">=</span>
          <span className="text-sm text-gray-500">Decimal:</span>
          <span className="text-2xl font-mono font-bold text-yellow-300">{decimalValue}<sub className="text-xs text-gray-500">₁₀</sub></span>
        </div>
        {/* Odd/Even indicator */}
        <div className="mt-2 text-xs text-gray-500">
          LSB is <span className={`font-bold ${bits[7] === 1 ? 'text-amber-400' : 'text-cyan-400'}`}>{bits[7]}</span> → number is <span className={`font-semibold ${bits[7] === 1 ? 'text-amber-400' : 'text-cyan-400'}`}>{bits[7] === 1 ? 'ODD' : 'EVEN'}</span>
        </div>
      </div>

      {/* Challenge mode */}
      <button
        onClick={() => { setChallengeMode(!challengeMode); setBits([0, 0, 0, 0, 0, 0, 0, 0]); setShowHint(false) }}
        className="text-sm text-indigo-400 hover:text-indigo-300 underline underline-offset-2 mb-3 transition-colors"
      >
        {challengeMode ? 'Back to Free Explore' : 'Challenge: Build a Decimal Number'}
      </button>

      {challengeMode && (
        <div className="mt-2 p-4 rounded-xl border border-gray-700 bg-gray-900/50">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-300 text-sm">
              Toggle the bits to make: <span className="text-2xl font-mono font-bold text-yellow-300 ml-2">{challenge.target}<sub className="text-xs text-gray-500">₁₀</sub></span>
            </p>
            <span className="text-xs text-gray-600">{completed} solved</span>
          </div>

          {isSolved ? (
            <div className="rounded-xl p-3 text-sm bg-emerald-900/30 border border-emerald-700 flex items-center justify-between">
              <ResultBadge correct={true} />
              <Button size="sm" onClick={nextChallenge} className="bg-emerald-600 hover:bg-emerald-700 gap-1">
                Next Challenge <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className={`rounded-lg px-3 py-1.5 text-sm font-mono ${decimalValue < challenge.target ? 'text-blue-400' : 'text-red-400'}`}>
                Current: {decimalValue} ({decimalValue < challenge.target ? `need ${challenge.target - decimalValue} more` : `${decimalValue - challenge.target} too much`})
              </div>
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
              >
                {showHint ? 'Hide hint' : '💡 Hint'}
              </button>
            </div>
          )}
          {showHint && !isSolved && (
            <p className="mt-2 text-xs text-gray-500 italic">Hint: {challenge.hint}</p>
          )}
        </div>
      )}
    </ActivityShell>
  )
}

// ─────────────────────────────────────────────
// 12. Digit Groupings Explorer  (Lesson 2 – Digit Groupings)
// ─────────────────────────────────────────────
const DIGIT_GROUPING_QUIZ = [
  { binary: '10110101', answer: 'B5', hint: 'Split into nibbles: 1011 = B, 0101 = 5' },
  { binary: '11001010', answer: 'CA', hint: 'Split into nibbles: 1100 = C, 1010 = A' },
  { binary: '11111111', answer: 'FF', hint: 'Split into nibbles: 1111 = F, 1111 = F' },
  { binary: '01000001', answer: '41', hint: 'Split into nibbles: 0100 = 4, 0001 = 1 (ASCII "A")' },
  { binary: '00000000', answer: '00', hint: 'Split into nibbles: 0000 = 0, 0000 = 0' },
  { binary: '10101010', answer: 'AA', hint: 'Split into nibbles: 1010 = A, 1010 = A' },
]

const DigitGroupingsExplorer = () => {
  const [bits, setBits] = useState<number[]>([1, 0, 1, 1, 0, 1, 0, 1])
  const [showQuiz, setShowQuiz] = useState(false)
  const [qi, setQi] = useState(0)
  const [quizInput, setQuizInput] = useState('')
  const [checked, setChecked] = useState(false)

  const toggle = (i: number) => {
    const next = [...bits]
    next[i] = next[i] === 1 ? 0 : 1
    setBits(next)
  }

  // Compute groupings
  const nibbleHigh = bits.slice(0, 4)
  const nibbleLow = bits.slice(4, 8)
  const toNibbleHex = (nibble: number[]) => parseInt(nibble.join(''), 2).toString(16).toUpperCase()
  const byteValue = parseInt(bits.join(''), 2)

  const q = DIGIT_GROUPING_QUIZ[qi % DIGIT_GROUPING_QUIZ.length]
  const isCorrect = quizInput.trim().toUpperCase() === q.answer.toUpperCase()

  const checkQuiz = () => { if (quizInput.trim()) setChecked(true) }
  const advanceQuiz = () => { setQi(p => p + 1); setQuizInput(''); setChecked(false) }

  return (
    <ActivityShell title="Digit Groupings Explorer" emoji=" ">
      <p className="text-gray-300 text-sm mb-4">
        Toggle bits to explore how binary digits group into{' '}
        <span className="text-amber-300 font-semibold">nibbles</span> (4 bits) and{' '}
        <span className="text-cyan-300 font-semibold">bytes</span> (8 bits).
      </p>

      {/* Interactive bit toggles with grouping highlights */}
      <div className="flex flex-col items-center gap-4 mb-6">
        <div className="flex gap-1">
          {/* High nibble */}
          <div className="flex gap-1 p-2 rounded-lg border-2 border-amber-500/40 bg-amber-900/10 relative">
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-amber-400 bg-[#1a1f35] px-1.5 rounded">
              NIBBLE (HIGH)
            </span>
            {nibbleHigh.map((bit, i) => (
              <button
                key={`h-${i}`}
                onClick={() => toggle(i)}
                className={`w-10 h-12 rounded-lg text-lg font-bold font-mono border-2 transition-all ${bit === 1
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-900/50'
                  : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-400'
                  }`}
              >
                {bit}
              </button>
            ))}
          </div>
          {/* Low nibble */}
          <div className="flex gap-1 p-2 rounded-lg border-2 border-amber-500/40 bg-amber-900/10 relative">
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-amber-400 bg-[#1a1f35] px-1.5 rounded">
              NIBBLE (LOW)
            </span>
            {nibbleLow.map((bit, i) => (
              <button
                key={`l-${i}`}
                onClick={() => toggle(i + 4)}
                className={`w-10 h-12 rounded-lg text-lg font-bold font-mono border-2 transition-all ${bit === 1
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-900/50'
                  : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-400'
                  }`}
              >
                {bit}
              </button>
            ))}
          </div>
        </div>

        {/* Byte border */}
        <div className="w-full max-w-sm border-2 border-cyan-500/30 rounded-xl p-3 bg-cyan-900/10">
          <div className="text-[9px] font-bold text-cyan-400 mb-2 text-center">1 BYTE = 2 NIBBLES = 8 BITS</div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <span className="text-xs text-gray-500 block">High Nibble</span>
              <span className="text-lg font-mono font-bold text-amber-300">0x{toNibbleHex(nibbleHigh)}</span>
            </div>
            <div>
              <span className="text-xs text-gray-500 block">Low Nibble</span>
              <span className="text-lg font-mono font-bold text-amber-300">0x{toNibbleHex(nibbleLow)}</span>
            </div>
            <div>
              <span className="text-xs text-gray-500 block">Full Byte</span>
              <span className="text-lg font-mono font-bold text-cyan-300">0x{toNibbleHex(nibbleHigh)}{toNibbleHex(nibbleLow)}</span>
            </div>
          </div>
          <div className="mt-2 text-center">
            <span className="text-xs text-gray-500">Decimal: </span>
            <span className="font-mono font-bold text-white">{byteValue}</span>
          </div>
        </div>
      </div>

      {/* Reference table */}
      <div className="rounded-xl overflow-hidden border border-gray-700 mb-4">
        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-3 py-2 text-gray-400 text-center">Name</th>
              <th className="px-3 py-2 text-gray-400 text-center">Size</th>
              <th className="px-3 py-2 text-gray-400 text-center">Hex Digits</th>
              <th className="px-3 py-2 text-gray-400 text-center">Range</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Bit', '1 bit', '¼', '0–1'],
              ['Nibble', '4 bits', '1', '0–F'],
              ['Byte', '8 bits', '2', '00–FF'],
              ['Word', '16 bits', '4', '0000–FFFF'],
            ].map(([name, size, hex, range], idx) => (
              <tr key={idx} className="border-t border-gray-700 bg-gray-900">
                <td className="px-3 py-2 text-center text-white font-semibold">{name}</td>
                <td className="px-3 py-2 text-center text-gray-300">{size}</td>
                <td className="px-3 py-2 text-center text-amber-300">{hex}</td>
                <td className="px-3 py-2 text-center text-gray-300">{range}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mini quiz */}
      <button
        onClick={() => setShowQuiz(!showQuiz)}
        className="text-sm text-indigo-400 hover:text-indigo-300 underline underline-offset-2 mb-3 transition-colors"
      >
        {showQuiz ? 'Hide Practice' : 'Practice: Convert Binary to Hex'}
      </button>

      {showQuiz && (
        <div className="mt-2 p-4 rounded-xl border border-gray-700 bg-gray-900/50">
          <p className="text-gray-300 text-sm mb-3">
            Group into nibbles and write the hex value for this byte:
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
            <div className="bg-gray-800 rounded-xl px-6 py-3 text-2xl font-mono font-bold text-yellow-300 border border-gray-700 tracking-widest">
              {q.binary.slice(0, 4)} <span className="text-gray-600">|</span> {q.binary.slice(4)}
            </div>
            <span className="text-gray-500 text-xl">→</span>
            <div className="flex gap-2">
              <input
                value={quizInput}
                onChange={(e) => { setQuizInput(e.target.value); setChecked(false) }}
                onKeyDown={(e) => e.key === 'Enter' && !checked && checkQuiz()}
                placeholder="Hex (e.g. B5)"
                className="w-28 rounded-xl px-4 py-2 font-mono text-lg bg-gray-800 border border-gray-600 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500"
              />
              {!checked ? (
                <Button size="sm" onClick={checkQuiz} disabled={!quizInput.trim()} className="bg-indigo-600 hover:bg-indigo-700">Check</Button>
              ) : (
                <Button size="sm" onClick={advanceQuiz} className="bg-emerald-600 hover:bg-emerald-700 gap-1">Next <ChevronRight className="w-4 h-4" /></Button>
              )}
            </div>
          </div>
          {checked && (
            <div className={`rounded-xl p-3 text-sm ${isCorrect ? 'bg-emerald-900/30 border border-emerald-700' : 'bg-red-900/30 border border-red-700'}`}>
              <ResultBadge correct={isCorrect} />
              {!isCorrect && (
                <p className="mt-1 text-gray-300">
                  The correct answer is <span className="font-mono font-bold text-white">{q.answer}</span>
                  <br /><span className="text-gray-400 text-xs">{q.hint}</span>
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </ActivityShell>
  )
}

// ─────────────────────────────────────────────
// 13. Decimal to Binary Practice & Visualizer (Lesson 3 – Page 1: Decimal to Binary)
// ─────────────────────────────────────────────
const DEC_TO_BIN_PROBLEMS = [
  { dec: 45, bin: '101101', hint: '45 ÷ 2 = 22 R 1, 22 ÷ 2 = 11 R 0, 11 ÷ 2 = 5 R 1, 5 ÷ 2 = 2 R 1, 2 ÷ 2 = 1 R 0, 1 ÷ 2 = 0 R 1 → 101101' },
  { dec: 100, bin: '1100100', hint: '100 = 64 + 32 + 4 → bit 6, bit 5, bit 2 are 1' },
  { dec: 25, bin: '11001', hint: '25 ÷ 2 = 12 R 1, 12 ÷ 2 = 6 R 0, 6 ÷ 2 = 3 R 0, 3 ÷ 2 = 1 R 1, 1 ÷ 2 = 0 R 1 → 11001' },
  { dec: 200, bin: '11001000', hint: '200 = 128 (2⁷) + 64 (2⁶) + 8 (2³) → 11001000' },
  { dec: 13, bin: '1101', hint: '13 = 8 + 4 + 1 → 1101' },
  { dec: 255, bin: '11111111', hint: 'All 8 bits are 1s: 128+64+32+16+8+4+2+1 = 255' },
]

function computeDivSteps(num: number) {
  if (num === 0) return [{ dividend: 0, quotient: 0, remainder: 0 }]
  const steps = []
  let curr = num
  while (curr > 0) {
    const q = Math.floor(curr / 2)
    const r = curr % 2
    steps.push({ dividend: curr, quotient: q, remainder: r })
    curr = q
  }
  return steps
}

const DecimalToBinaryPractice = () => {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'quiz'>('visualizer')
  const [selectedNum, setSelectedNum] = useState<number>(45)
  const [customInput, setCustomInput] = useState<string>('')

  // Quiz state
  const [qi, setQi] = useState(0)
  const [quizInput, setQuizInput] = useState('')
  const [checked, setChecked] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)

  const steps = computeDivSteps(selectedNum)
  const binaryResult = selectedNum === 0 ? '0' : steps.map(s => s.remainder).reverse().join('')
  const powersCheck = steps.map((s, i) => s.remainder === 1 ? Math.pow(2, i) : 0).filter(v => v > 0).reverse()

  const currentProblem = DEC_TO_BIN_PROBLEMS[qi % DEC_TO_BIN_PROBLEMS.length]
  const isCorrect = quizInput.trim() === currentProblem.bin

  const handleCheck = () => {
    if (!quizInput.trim()) return
    setChecked(true)
    if (quizInput.trim() === currentProblem.bin) {
      setScore(s => s + 1)
      setStreak(st => st + 1)
    } else {
      setStreak(0)
    }
  }

  const handleNext = () => {
    setQi(q => q + 1)
    setQuizInput('')
    setChecked(false)
    setShowHint(false)
  }

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = parseInt(customInput, 10)
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 255) {
      setSelectedNum(parsed)
      setCustomInput('')
    }
  }

  return (
    <ActivityShell title="Decimal to Binary Conversion" emoji="⚡">
      {/* Mode navigation */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('visualizer')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all border ${
            activeTab === 'visualizer'
              ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-900/40'
              : 'bg-gray-800/80 border-gray-700 text-gray-400 hover:text-gray-200 hover:border-gray-600'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Layers className="w-4 h-4" />
            <span>Division-Remainder Visualizer</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all border ${
            activeTab === 'quiz'
              ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-900/40'
              : 'bg-gray-800/80 border-gray-700 text-gray-400 hover:text-gray-200 hover:border-gray-600'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Practice Challenge</span>
            {score > 0 && <span className="bg-amber-400/20 text-amber-300 text-xs px-2 py-0.5 rounded-full">{score}</span>}
          </div>
        </button>
      </div>

      {activeTab === 'visualizer' ? (
        <div className="space-y-6">
          {/* Preset selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Choose a Decimal Number:</span>
              <span className="text-xs text-gray-500">Repeated division by 2</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {[45, 25, 100, 200, 13, 255].map(num => (
                <button
                  key={num}
                  onClick={() => setSelectedNum(num)}
                  className={`px-3.5 py-1.5 rounded-xl font-mono text-sm font-bold transition-all border ${
                    selectedNum === num
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-900/50 scale-105'
                      : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {num}₁₀
                </button>
              ))}
              <form onSubmit={handleCustomSubmit} className="flex items-center gap-1.5 ml-auto">
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={customInput}
                  onChange={e => setCustomInput(e.target.value)}
                  placeholder="0–255"
                  className="w-20 px-2.5 py-1 text-sm font-mono bg-gray-900 border border-gray-700 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500"
                />
                <Button type="submit" size="sm" variant="outline" className="h-8 px-2 text-xs border-gray-700">
                  Set
                </Button>
              </form>
            </div>
          </div>

          {/* Division table & reading upward indicator */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 rounded-2xl border border-white/10 bg-gray-900/60 p-4">
              <div className="flex items-center justify-between mb-3 border-b border-gray-800 pb-2">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                  Division by 2 Steps for <span className="font-mono text-yellow-300 text-base">{selectedNum}₁₀</span>
                </div>
                <span className="text-xs text-gray-400 font-mono">{steps.length} steps</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-sm">
                  <thead>
                    <tr className="text-gray-500 text-xs border-b border-gray-800">
                      <th className="pb-2">Step</th>
                      <th className="pb-2">Operation</th>
                      <th className="pb-2">Quotient</th>
                      <th className="pb-2 text-right">Remainder</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60">
                    {steps.map((st, i) => {
                      const isLast = i === steps.length - 1
                      return (
                        <tr key={i} className="hover:bg-white/[0.02]">
                          <td className="py-2 text-xs text-gray-500">#{i + 1}</td>
                          <td className="py-2 text-gray-300">
                            <span className="text-white font-bold">{st.dividend}</span> ÷ 2
                          </td>
                          <td className="py-2 text-indigo-300 font-semibold">{st.quotient}</td>
                          <td className="py-2 text-right">
                            <span className={`inline-block px-2.5 py-0.5 rounded-md font-bold text-sm ${
                              st.remainder === 1
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-gray-800 text-gray-400 border border-gray-700'
                            }`}>
                              {st.remainder}
                            </span>
                            {isLast && <span className="ml-1.5 text-[10px] text-amber-400 font-sans font-bold">MSB</span>}
                            {i === 0 && <span className="ml-1.5 text-[10px] text-cyan-400 font-sans font-bold">LSB</span>}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Read upward summary card */}
            <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-indigo-950/30 to-purple-950/20 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">
                  <ArrowUp className="w-4 h-4 text-indigo-400 animate-pulse" />
                  <span>Read Bottom to Top</span>
                </div>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                  Record each remainder as you divide. The <span className="text-amber-300 font-semibold">last remainder</span> is the Most Significant Bit (MSB), and the <span className="text-cyan-300 font-semibold">first</span> is the Least Significant Bit (LSB).
                </p>

                <div className="bg-black/40 rounded-xl p-3 border border-white/5 mb-4 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 block mb-1">Binary Result</span>
                  <div className="text-2xl font-mono font-bold tracking-widest text-emerald-300">
                    {binaryResult}
                    <sub className="text-xs text-gray-500 ml-1">₂</sub>
                  </div>
                </div>
              </div>

              {/* Verification sum */}
              <div className="border-t border-white/10 pt-3">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Verification (Powers of 2):</span>
                <div className="text-xs font-mono text-gray-300 leading-relaxed">
                  {powersCheck.join(' + ') || '0'} = <span className="text-yellow-300 font-bold">{selectedNum}₁₀</span> ✓
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Quiz Challenge Mode */
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
              Question {((qi) % DEC_TO_BIN_PROBLEMS.length) + 1} of {DEC_TO_BIN_PROBLEMS.length}
            </span>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-gray-400">Score: <strong className="text-white">{score}</strong></span>
              {streak > 1 && (
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  🔥 {streak} streak!
                </span>
              )}
            </div>
          </div>

          {/* Question Card */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-gray-900/90 to-indigo-950/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider block mb-1">Convert Decimal to Binary</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-mono font-extrabold text-yellow-300">{currentProblem.dec}</span>
                <span className="text-sm font-mono text-gray-500 font-bold">₁₀</span>
                <span className="text-xl text-gray-600 mx-2">→</span>
                <span className="text-xl font-mono text-indigo-300">?₂</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
              <input
                value={quizInput}
                onChange={e => {
                  setQuizInput(e.target.value.replace(/[^01]/g, ''))
                  setChecked(false)
                }}
                onKeyDown={e => e.key === 'Enter' && !checked && handleCheck()}
                placeholder="Binary (0s and 1s)"
                className="w-full sm:w-48 px-4 py-3 rounded-xl font-mono text-lg text-center tracking-widest bg-gray-950 border border-gray-700 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500"
              />
              {!checked ? (
                <Button onClick={handleCheck} disabled={!quizInput.trim()} className="bg-indigo-600 hover:bg-indigo-700 px-5">
                  Check
                </Button>
              ) : (
                <Button onClick={handleNext} className="bg-emerald-600 hover:bg-emerald-700 px-5 gap-1">
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Result Feedback */}
          {checked && (
            <div className={`rounded-xl p-4 text-sm border transition-all ${
              isCorrect ? 'bg-emerald-950/30 border-emerald-500/40' : 'bg-red-950/30 border-red-500/40'
            }`}>
              <ResultBadge correct={isCorrect} />
              {!isCorrect && (
                <p className="mt-2 text-gray-300">
                  The correct binary for {currentProblem.dec}₁₀ is{' '}
                  <span className="font-mono font-bold text-white bg-black/40 px-2 py-0.5 rounded border border-white/10">
                    {currentProblem.bin}₂
                  </span>
                </p>
              )}
            </div>
          )}

          {/* Hint Drawer */}
          <div className="border border-white/5 rounded-xl bg-white/[0.02] p-3">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-indigo-300 transition-colors"
            >
              <Info className="w-4 h-4 text-indigo-400" />
              <span>{showHint ? 'Hide division steps hint' : 'Need help? Show division steps'}</span>
            </button>
            {showHint && (
              <div className="mt-3 pt-3 border-t border-white/5 text-xs text-gray-300 font-mono leading-relaxed">
                <p className="text-indigo-300 mb-1 font-sans font-semibold">Division breakdown for {currentProblem.dec}:</p>
                <div className="bg-black/40 p-2.5 rounded-lg border border-white/5 text-gray-400">
                  {currentProblem.hint}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </ActivityShell>
  )
}

// ─────────────────────────────────────────────
// 14. Binary to Decimal Practice & Visualizer (Lesson 3 – Page 2: Binary to Decimal)
// ─────────────────────────────────────────────
const BIN_TO_DEC_PROBLEMS = [
  { bin: '101101', dec: 45, breakdown: '32 + 8 + 4 + 1 = 45' },
  { bin: '11010110', dec: 214, breakdown: '128 + 64 + 16 + 4 + 2 = 214' },
  { bin: '10110', dec: 22, breakdown: '16 + 4 + 2 = 22' },
  { bin: '1111', dec: 15, breakdown: '8 + 4 + 2 + 1 = 15' },
  { bin: '1000000', dec: 64, breakdown: '2⁶ = 64' },
  { bin: '11111111', dec: 255, breakdown: '128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = 255' },
]

const BinaryToDecimalPractice = () => {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'quiz'>('visualizer')
  const [bits, setBits] = useState<number[]>([1, 1, 0, 1, 0, 1, 1, 0]) // 214
  const [showDoubling, setShowDoubling] = useState(false)

  // Quiz state
  const [qi, setQi] = useState(0)
  const [quizInput, setQuizInput] = useState('')
  const [checked, setChecked] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)

  const toggleBit = (i: number) => {
    const next = [...bits]
    next[i] = next[i] === 1 ? 0 : 1
    setBits(next)
  }

  const powers = [128, 64, 32, 16, 8, 4, 2, 1]
  const decimalValue = bits.reduce((acc, b, i) => acc + b * powers[i], 0)
  const activeTerms = bits.map((b, i) => (b === 1 ? powers[i] : 0)).filter(v => v > 0)

  // Doubling method steps trace
  const doublingSteps: { bit: number; prev: number; doubled: number; total: number }[] = []
  let running = 0
  bits.forEach((b) => {
    const doubled = running * 2
    const total = doubled + b
    doublingSteps.push({ bit: b, prev: running, doubled, total })
    running = total
  })

  const currentProblem = BIN_TO_DEC_PROBLEMS[qi % BIN_TO_DEC_PROBLEMS.length]
  const isCorrect = quizInput.trim() === currentProblem.dec.toString()

  const handleCheck = () => {
    if (!quizInput.trim()) return
    setChecked(true)
    if (quizInput.trim() === currentProblem.dec.toString()) {
      setScore(s => s + 1)
      setStreak(st => st + 1)
    } else {
      setStreak(0)
    }
  }

  const handleNext = () => {
    setQi(q => q + 1)
    setQuizInput('')
    setChecked(false)
    setShowHint(false)
  }

  return (
    <ActivityShell title="Binary to Decimal Conversion" emoji="🔢">
      {/* Tab Switcher */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('visualizer')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all border ${
            activeTab === 'visualizer'
              ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-900/40'
              : 'bg-gray-800/80 border-gray-700 text-gray-400 hover:text-gray-200 hover:border-gray-600'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Layers className="w-4 h-4" />
            <span>Positional Expansion Explorer</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all border ${
            activeTab === 'quiz'
              ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-900/40'
              : 'bg-gray-800/80 border-gray-700 text-gray-400 hover:text-gray-200 hover:border-gray-600'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Practice Challenge</span>
            {score > 0 && <span className="bg-amber-400/20 text-amber-300 text-xs px-2 py-0.5 rounded-full">{score}</span>}
          </div>
        </button>
      </div>

      {activeTab === 'visualizer' ? (
        <div className="space-y-6">
          {/* Quick presets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Quick Presets:</span>
              <span className="text-xs text-gray-500">Click any bit to toggle 0 ↔ 1</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: '11010110 (214)', bits: [1,1,0,1,0,1,1,0] },
                { label: '101101 (45)', bits: [0,0,1,0,1,1,0,1] },
                { label: '10110 (22)', bits: [0,0,0,1,0,1,1,0] },
                { label: '1111 (15)', bits: [0,0,0,0,1,1,1,1] },
                { label: '1000000 (64)', bits: [0,1,0,0,0,0,0,0] },
                { label: '11111111 (255)', bits: [1,1,1,1,1,1,1,1] },
              ].map(p => (
                <button
                  key={p.label}
                  onClick={() => setBits(p.bits)}
                  className="px-3 py-1 rounded-xl text-xs font-mono font-semibold bg-gray-800 text-gray-300 border border-gray-700 hover:border-indigo-500 hover:text-white transition-all"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Positional Table & Bit Buttons */}
          <div className="rounded-2xl border border-white/10 bg-gray-900/60 p-5">
            <div className="flex flex-col items-center gap-2">
              {/* Powers of 2 row */}
              <div className="flex gap-2">
                {powers.map((_, i) => (
                  <div key={`p-${i}`} className="w-12 text-center">
                    <span className="text-[10px] text-gray-500 font-mono">2{`\u2077\u2076\u2075\u2074\u00B3\u00B2\u00B9\u2070`[i]}</span>
                  </div>
                ))}
              </div>

              {/* Weight row */}
              <div className="flex gap-2">
                {powers.map((p, i) => (
                  <div key={`w-${i}`} className="w-12 text-center">
                    <span className={`text-xs font-mono font-bold ${bits[i] === 1 ? 'text-emerald-400' : 'text-gray-600'}`}>
                      {p}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bit toggle buttons */}
              <div className="flex gap-2">
                {bits.map((b, i) => (
                  <button
                    key={`b-${i}`}
                    onClick={() => toggleBit(i)}
                    className={`w-12 h-14 rounded-xl text-2xl font-bold font-mono border-2 transition-all cursor-pointer ${
                      b === 1
                        ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-900/40 scale-105'
                        : 'bg-gray-800/90 border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>

              {/* Position row */}
              <div className="flex gap-2">
                {powers.map((_, i) => (
                  <div key={`pos-${i}`} className="w-12 text-center">
                    <span className="text-[9px] text-gray-600 font-mono">pos {7 - i}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Expansion Equation */}
            <div className="mt-6 pt-5 border-t border-gray-800">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                Positional Expansion Formula:
              </span>
              <div className="bg-black/40 rounded-xl p-3 border border-white/5 font-mono text-sm overflow-x-auto">
                <div className="text-gray-400 mb-1">
                  Sum of active weights (bit = 1):
                </div>
                <div className="text-emerald-400 font-bold text-base flex flex-wrap items-center gap-1.5">
                  {activeTerms.length > 0 ? (
                    <>
                      {activeTerms.map((t, idx) => (
                        <span key={idx}>
                          {idx > 0 && <span className="text-gray-600 mx-1">+</span>}
                          <span>{t}</span>
                        </span>
                      ))}
                      <span className="text-gray-500 mx-2">=</span>
                      <span className="text-2xl font-extrabold text-yellow-300">{decimalValue}₁₀</span>
                    </>
                  ) : (
                    <span className="text-gray-500 italic text-sm">All bits 0 = 0₁₀</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Alternative: Doubling Method Toggle */}
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <button
              onClick={() => setShowDoubling(!showDoubling)}
              className="flex items-center justify-between w-full text-xs font-semibold text-gray-300 hover:text-indigo-300 transition-colors"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>Alternative: The Doubling Method (Shift & Add)</span>
              </div>
              <span className="text-gray-500">{showDoubling ? 'Hide' : 'Show trace'}</span>
            </button>
            {showDoubling && (
              <div className="mt-3 pt-3 border-t border-white/5 text-xs text-gray-300 font-mono space-y-1">
                <p className="text-gray-400 font-sans mb-2">
                  Start with 0. For each bit from left to right: double the running total and add the bit:
                </p>
                <div className="bg-black/30 p-3 rounded-lg border border-white/5 space-y-1">
                  {doublingSteps.map((st, i) => (
                    <div key={i} className="text-gray-400 flex items-center gap-2">
                      <span className="text-gray-600 w-12">Step {i + 1}:</span>
                      <span>({st.prev} × 2) + {st.bit} =</span>
                      <strong className="text-indigo-300">{st.total}</strong>
                    </div>
                  ))}
                  <div className="pt-2 text-yellow-300 font-bold border-t border-gray-800">
                    Final Result = {decimalValue}₁₀
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Challenge Mode */
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
              Question {((qi) % BIN_TO_DEC_PROBLEMS.length) + 1} of {BIN_TO_DEC_PROBLEMS.length}
            </span>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-gray-400">Score: <strong className="text-white">{score}</strong></span>
              {streak > 1 && (
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  🔥 {streak} streak!
                </span>
              )}
            </div>
          </div>

          {/* Question Card */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-gray-900/90 to-indigo-950/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider block mb-1">Convert Binary to Decimal</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-mono font-extrabold text-indigo-300 tracking-wider">{currentProblem.bin}</span>
                <span className="text-sm font-mono text-gray-500 font-bold">₂</span>
                <span className="text-xl text-gray-600 mx-2">→</span>
                <span className="text-xl font-mono text-yellow-300">?₁₀</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
              <input
                type="number"
                value={quizInput}
                onChange={e => {
                  setQuizInput(e.target.value)
                  setChecked(false)
                }}
                onKeyDown={e => e.key === 'Enter' && !checked && handleCheck()}
                placeholder="Decimal value"
                className="w-full sm:w-44 px-4 py-3 rounded-xl font-mono text-lg text-center bg-gray-950 border border-gray-700 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500"
              />
              {!checked ? (
                <Button onClick={handleCheck} disabled={!quizInput.trim()} className="bg-indigo-600 hover:bg-indigo-700 px-5">
                  Check
                </Button>
              ) : (
                <Button onClick={handleNext} className="bg-emerald-600 hover:bg-emerald-700 px-5 gap-1">
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Result Feedback */}
          {checked && (
            <div className={`rounded-xl p-4 text-sm border transition-all ${
              isCorrect ? 'bg-emerald-950/30 border-emerald-500/40' : 'bg-red-950/30 border-red-500/40'
            }`}>
              <ResultBadge correct={isCorrect} />
              {!isCorrect && (
                <p className="mt-2 text-gray-300">
                  The correct decimal value for {currentProblem.bin}₂ is{' '}
                  <span className="font-mono font-bold text-white bg-black/40 px-2 py-0.5 rounded border border-white/10">
                    {currentProblem.dec}₁₀
                  </span>
                </p>
              )}
            </div>
          )}

          {/* Hint Drawer */}
          <div className="border border-white/5 rounded-xl bg-white/[0.02] p-3">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-indigo-300 transition-colors"
            >
              <Info className="w-4 h-4 text-indigo-400" />
              <span>{showHint ? 'Hide positional expansion hint' : 'Need help? Show expansion hint'}</span>
            </button>
            {showHint && (
              <div className="mt-3 pt-3 border-t border-white/5 text-xs text-gray-300 font-mono leading-relaxed">
                <p className="text-indigo-300 mb-1 font-sans font-semibold">Positional expansion for {currentProblem.bin}₂:</p>
                <div className="bg-black/40 p-2.5 rounded-lg border border-white/5 text-gray-300">
                  {currentProblem.breakdown}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </ActivityShell>
  )
}

// ─────────────────────────────────────────────
// 15. Hex Conversion Multi-Mode Practice  (Lesson 3 – Page 3: Hex Conversion)
// ─────────────────────────────────────────────
type HexMode = 'hex-binary' | 'dec-hex' | 'hex-octal'

const HEX_MODE_CONFIG: Record<HexMode, {
  label: string
  subtitle: string
  fromLabel: string
  toLabel: string
  fromBase: number
  toBase: number
  questions: { from: string; to: string; explanation: string }[]
}> = {
  'hex-binary': {
    label: 'Hex ↔ Binary',
    subtitle: 'Direct, 4-bit groups',
    fromLabel: 'Hexadecimal',
    toLabel: 'Binary',
    fromBase: 16,
    toBase: 2,
    questions: [
      { from: 'A5', to: '10100101', explanation: 'A = 1010, 5 = 0101 → 10100101' },
      { from: 'FF', to: '11111111', explanation: 'F = 1111, F = 1111 → 11111111' },
      { from: '3C', to: '00111100', explanation: '3 = 0011, C = 1100 → 00111100' },
      { from: 'D6', to: '11010110', explanation: 'D = 1101, 6 = 0110 → 11010110' },
      { from: '1B', to: '00011011', explanation: '1 = 0001, B = 1011 → 00011011' },
      { from: '7E', to: '01111110', explanation: '7 = 0111, E = 1110 → 01111110' },
    ],
  },
  'dec-hex': {
    label: 'Decimal → Hex',
    subtitle: 'Division by 16',
    fromLabel: 'Decimal',
    toLabel: 'Hexadecimal',
    fromBase: 10,
    toBase: 16,
    questions: [
      { from: '255', to: 'FF', explanation: '255 ÷ 16 = 15 R 15 (F), 15 ÷ 16 = 0 R 15 (F) → FF' },
      { from: '500', to: '1F4', explanation: '500 ÷ 16 = 31 R 4, 31 ÷ 16 = 1 R 15 (F), 1 ÷ 16 = 0 R 1 → 1F4' },
      { from: '100', to: '64', explanation: '100 ÷ 16 = 6 R 4, 6 ÷ 16 = 0 R 6 → 64' },
      { from: '47', to: '2F', explanation: '47 ÷ 16 = 2 R 15 (F), 2 ÷ 16 = 0 R 2 → 2F' },
      { from: '4096', to: '1000', explanation: '4096 ÷ 16 = 256 R 0, 256 ÷ 16 = 16 R 0, 16 ÷ 16 = 1 R 0, 1 ÷ 16 = 0 R 1 → 1000' },
      { from: '170', to: 'AA', explanation: '170 ÷ 16 = 10 R 10 (A), 10 ÷ 16 = 0 R 10 (A) → AA' },
    ],
  },
  'hex-octal': {
    label: 'Hex ↔ Octal',
    subtitle: 'via Binary',
    fromLabel: 'Hexadecimal',
    toLabel: 'Octal',
    fromBase: 16,
    toBase: 8,
    questions: [
      { from: '1F', to: '37', explanation: '1F₁₆ → 0001 1111₂ → 000 011 111₂ → 37₈' },
      { from: 'FF', to: '377', explanation: 'FF₁₆ → 1111 1111₂ → 011 111 111₂ → 377₈' },
      { from: 'A5', to: '245', explanation: 'A5₁₆ → 1010 0101₂ → 010 100 101₂ → 245₈' },
      { from: '3C', to: '74', explanation: '3C₁₆ → 0011 1100₂ → 000 111 100₂ → 74₈' },
      { from: '7E', to: '176', explanation: '7E₁₆ → 0111 1110₂ → 001 111 110₂ → 176₈' },
      { from: 'D0', to: '320', explanation: 'D0₁₆ → 1101 0000₂ → 011 010 000₂ → 320₈' },
    ],
  },
}

const HEX_NIBBLE_MAP: Record<string, string> = {
  '0': '0000', '1': '0001', '2': '0010', '3': '0011',
  '4': '0100', '5': '0101', '6': '0110', '7': '0111',
  '8': '1000', '9': '1001', 'A': '1010', 'B': '1011',
  'C': '1100', 'D': '1101', 'E': '1110', 'F': '1111',
}

const HexConversionPractice = () => {
  const [mode, setMode] = useState<HexMode>('hex-binary')
  const [qi, setQi] = useState(0)
  const [input, setInput] = useState('')
  const [checked, setChecked] = useState(false)
  const [showHelper, setShowHelper] = useState(false)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)

  const config = HEX_MODE_CONFIG[mode]
  const q = config.questions[qi % config.questions.length]
  const isCorrect = input.trim().toUpperCase() === q.to.toUpperCase()

  const check = () => {
    if (!input.trim()) return
    setChecked(true)
    if (input.trim().toUpperCase() === q.to.toUpperCase()) {
      setScore(s => s + 1)
      setStreak(st => st + 1)
    } else {
      setStreak(0)
    }
  }

  const advance = () => {
    setQi(p => p + 1)
    setInput('')
    setChecked(false)
    setShowHelper(false)
  }

  const switchMode = (m: HexMode) => {
    setMode(m)
    setQi(0)
    setInput('')
    setChecked(false)
    setShowHelper(false)
  }

  return (
    <ActivityShell title="Hexadecimal Conversions Practice" emoji="🔄">
      <p className="text-gray-300 text-sm mb-5">
        Master conversions between hexadecimal, binary, decimal, and octal. Choose a conversion mode:
      </p>

      {/* 3 Mode buttons with icons and subtitles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6">
        {(Object.keys(HEX_MODE_CONFIG) as HexMode[]).map((key) => {
          const cfg = HEX_MODE_CONFIG[key]
          const isActive = mode === key
          return (
            <button
              key={key}
              onClick={() => switchMode(key)}
              className={`p-3 rounded-xl text-left transition-all border ${
                isActive
                  ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 border-indigo-400 text-white shadow-lg shadow-indigo-950/60 scale-[1.02]'
                  : 'bg-gray-900/80 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-gray-200'
              }`}
            >
              <div className="text-sm font-bold">{cfg.label}</div>
              <div className={`text-[11px] mt-0.5 ${isActive ? 'text-indigo-200' : 'text-gray-500'}`}>
                {cfg.subtitle}
              </div>
            </button>
          )
        })}
      </div>

      {/* Question Progress & Stats */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
          Question {((qi) % config.questions.length) + 1} of {config.questions.length}
        </span>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-gray-400">Score: <strong className="text-white">{score}</strong></span>
          {streak > 1 && (
            <span className="text-amber-400 font-bold flex items-center gap-1">
              🔥 {streak} streak!
            </span>
          )}
        </div>
      </div>

      {/* Interactive Question Card */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-gray-900/90 to-indigo-950/40 p-6 mb-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider block mb-1">
              Convert from {config.fromLabel}
            </span>
            <div className="flex items-baseline justify-center sm:justify-start gap-2">
              <span className="text-4xl font-mono font-extrabold text-yellow-300 tracking-wider">
                {q.from}
              </span>
              <sub className="text-sm font-mono text-gray-500 font-bold">
                {config.fromBase === 16 ? '₁₆' : config.fromBase === 10 ? '₁₀' : '₂'}
              </sub>
              <span className="text-xl text-gray-600 mx-3">→</span>
              <span className="text-xl font-mono text-indigo-300">
                ?{config.toBase === 2 ? '₂' : config.toBase === 16 ? '₁₆' : '₈'}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
            <input
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                setChecked(false)
              }}
              onKeyDown={(e) => e.key === 'Enter' && !checked && check()}
              placeholder={`${config.toLabel} value`}
              className="w-full sm:w-48 px-4 py-3 rounded-xl font-mono text-lg text-center uppercase tracking-widest bg-gray-950 border border-gray-700 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500"
            />
            {!checked ? (
              <Button onClick={check} disabled={!input.trim()} className="bg-indigo-600 hover:bg-indigo-700 px-5">
                Check
              </Button>
            ) : (
              <Button onClick={advance} className="bg-emerald-600 hover:bg-emerald-700 px-5 gap-1">
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Result feedback */}
      {checked && (
        <div className={`rounded-xl p-4 text-sm mb-4 border transition-all ${
          isCorrect ? 'bg-emerald-950/30 border-emerald-500/40' : 'bg-red-950/30 border-red-500/40'
        }`}>
          <ResultBadge correct={isCorrect} />
          <p className="mt-2 text-gray-300 font-mono text-xs leading-relaxed">
            {q.explanation}
          </p>
        </div>
      )}

      {/* Mode-specific Helper Card */}
      <div className="border border-white/5 rounded-xl bg-white/[0.02] p-4">
        <button
          onClick={() => setShowHelper(!showHelper)}
          className="flex items-center justify-between w-full text-xs font-semibold text-gray-400 hover:text-indigo-300 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-400" />
            <span>
              {mode === 'hex-binary' && 'Show 4-bit nibble mapping guide'}
              {mode === 'dec-hex' && 'Show division by 16 guide'}
              {mode === 'hex-octal' && 'Show Hex ↔ Octal 2-step bridge visual'}
            </span>
          </div>
          <span className="text-gray-500">{showHelper ? 'Hide' : 'Show guide'}</span>
        </button>

        {showHelper && (
          <div className="mt-3 pt-3 border-t border-white/5 text-xs text-gray-300">
            {mode === 'hex-binary' && (
              <div>
                <p className="text-gray-400 mb-2">Each hexadecimal digit maps directly to exactly 4 binary bits:</p>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 font-mono text-center">
                  {Object.entries(HEX_NIBBLE_MAP).map(([hexChar, nibble]) => (
                    <div key={hexChar} className="bg-black/40 p-1.5 rounded border border-white/5">
                      <span className="text-yellow-300 font-bold block">{hexChar}</span>
                      <span className="text-gray-400 text-[10px]">{nibble}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mode === 'dec-hex' && (
              <div className="space-y-1 font-mono">
                <p className="text-gray-400 font-sans mb-1">Division by 16 Method:</p>
                <div className="bg-black/40 p-3 rounded border border-white/5 space-y-1 text-gray-300">
                  <p>1. Repeatedly divide by 16, record remainders (0–15).</p>
                  <p>2. Convert remainders 10–15 to hex letters: 10=A, 11=B, 12=C, 13=D, 14=E, 15=F.</p>
                  <p>3. Read remainders from bottom to top (last remainder is MSB).</p>
                </div>
              </div>
            )}

            {mode === 'hex-octal' && (
              <div className="space-y-2 font-mono">
                <p className="text-gray-400 font-sans">Convert through Binary as the bridge:</p>
                <div className="bg-black/40 p-3 rounded border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
                  <div className="bg-indigo-950/40 border border-indigo-500/20 px-3 py-1.5 rounded-lg">
                    <span className="text-[10px] text-gray-400 block">Step 1: Hex</span>
                    <span className="text-yellow-300 font-bold">4-bit Groups</span>
                  </div>
                  <span className="text-gray-500">→</span>
                  <div className="bg-purple-950/40 border border-purple-500/20 px-3 py-1.5 rounded-lg">
                    <span className="text-[10px] text-gray-400 block">Bridge: Binary</span>
                    <span className="text-emerald-300 font-bold">Regroup to 3 bits</span>
                  </div>
                  <span className="text-gray-500">→</span>
                  <div className="bg-indigo-950/40 border border-indigo-500/20 px-3 py-1.5 rounded-lg">
                    <span className="text-[10px] text-gray-400 block">Step 2: Octal</span>
                    <span className="text-cyan-300 font-bold">Base 8 Digits</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ActivityShell>
  )
}

// ─────────────────────────────────────────────
// MAIN EXPORT — picks the right activity based on lessonId + topic title
// ─────────────────────────────────────────────
interface LessonInteractiveActivityProps {
  lessonId: number
  topicTitle: string
  topicTags?: string[]
}

export const LessonInteractiveActivity: React.FC<LessonInteractiveActivityProps> = ({
  lessonId,
  topicTitle,
  topicTags = [],
}) => {
  const title = topicTitle.toLowerCase()
  const tags = topicTags.map((t) => t.toLowerCase())

  // ── Lesson 1: Intro to Number Systems ──
  // NOTE: hex must be checked BEFORE decimal because "hexadecimal" contains "decimal"
  if (lessonId === 1) {
    if (title.includes('hex') || tags.includes('hexadecimal') || tags.includes('hex')) {
      return <HexadecimalBuilder />
    }
    if (title.includes('decimal') || tags.includes('decimal')) {
      return <DecimalBuilder />
    }
    if (title.includes('octal') || tags.includes('octal')) {
      return <OctalBuilder />
    }
    if (title.includes('boolean') || tags.includes('boolean')) {
      return <BooleanScenarioBuilder />
    }
    return <BinaryBuilder />
  }

  // ── Lesson 2: Types of Number Systems ──
  if (lessonId === 2) {
    if (title.includes('hex') || tags.includes('hexadecimal')) {
      return (
        <BaseConverterQuiz
          fromBase={2}
          toBase={16}
          fromLabel="Binary"
          toLabel="Hex"
          questions={[
            { from: '1010', to: 'A' },
            { from: '1111', to: 'F' },
            { from: '11001100', to: 'CC' },
            { from: '10110111', to: 'B7' },
            { from: '01000001', to: '41' },
            { from: '11111111', to: 'FF' },
          ]}
        />
      )
    }
    if (title.includes('digit') || title.includes('grouping') || tags.includes('nibble') || tags.includes('byte') || tags.includes('grouping')) {
      return <DigitGroupingsExplorer />
    }
    // Default: Binary ↔ Decimal relationship
    return <BinaryDecimalRelationship />
  }

  // ── Lesson 3: Conversion of Number Systems ──
  if (lessonId === 3) {
    if (title.includes('decimal to binary')) {
      return <DecimalToBinaryPractice />
    }
    if (title.includes('binary to decimal')) {
      return <BinaryToDecimalPractice />
    }
    if (title.includes('hex') || tags.includes('hexadecimal')) {
      return <HexConversionPractice />
    }
    // Default: Binary to Decimal (page 2)
    return <BinaryToDecimalPractice />
  }

  // ── Lesson 4: Binary Arithmetic (moved from original Lesson 8) ──
  if (lessonId === 4) {
    if (title.includes('addition') || tags.includes('addition')) {
      return <BinaryArithmeticTrainer op="add" />
    }
    if (title.includes('subtraction') || tags.includes('subtraction')) {
      return <BinaryArithmeticTrainer op="subtract" />
    }
    if (title.includes('multiplication') || tags.includes('multiplication')) {
      return <BinaryMultiplicationPractice />
    }
    if (title.includes('division') || tags.includes('division')) {
      return <BinaryDivisionPractice />
    }
    return <BinaryArithmeticTrainer op="add" />
  }

  // ── Lesson 5: Intro to Number Systems (Complement Explorer) ──
  if (lessonId === 5) {
    return <NumberSystemComplementExplorer />
  }

  // ── Lesson 6: Signed and Unsigned (moved from original Lesson 10) ──
  if (lessonId === 6) {
    return <SignedUnsignedInterpreter />
  }

  // ── Lesson 7: Binary Codes (moved from original Lesson 11) ──
  if (lessonId === 7) {
    if (title.includes('ascii') || tags.includes('ascii')) {
      return <BcdAsciiEncoder mode="ascii" />
    }
    return <BcdAsciiEncoder mode="bcd" />
  }

  // ── Lesson 8: Intro to Boolean Algebra (NEW) ──
  if (lessonId === 8) {
    return <BooleanAlgebraExplorer />
  }

  // ── Lesson 9: Logic Gates (Circuit Builder) ──
  if (lessonId === 9) {
    return <LogicGateCircuitBuilder />
  }

  // ── Lesson 10: Truth Tables (moved from original Lesson 3) ──
  if (lessonId === 10) {
    return <TruthTableBuilder />
  }

  // ── Lesson 11: Simplification (moved from original Lesson 4) ──
  if (lessonId === 11) {
    if (title.includes('karnaugh') || title.includes('k-map') || tags.includes('kmap')) {
      return <KMapActivity />
    }
    return <BooleanLawMatcher />
  }

  return null
}

export { LogicGateSimulator, TruthTableBuilder, DecimalToBinaryPractice, BinaryToDecimalPractice, HexConversionPractice }
export default LessonInteractiveActivity
