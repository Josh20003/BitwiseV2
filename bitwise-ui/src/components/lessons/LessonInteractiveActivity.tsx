import React, { useState, useCallback } from 'react'
import { CheckCircle, XCircle, RefreshCw, Zap, ChevronRight, RotateCcw, Info } from 'lucide-react'
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
  <div className="mt-10 rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a1f35] to-[#0f1220] shadow-xl overflow-hidden">
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
// 1. Binary Number Builder  (Lesson 5 – Binary topic)
// ─────────────────────────────────────────────
const BinaryBuilderActivity = () => {
  const targets = [5, 10, 22, 13, 29, 7]
  const [targetIdx, setTargetIdx] = useState(0)
  const target = targets[targetIdx]
  const [bits, setBits] = useState<number[]>([0, 0, 0, 0, 0])
  const value = bits.reduce((acc, b, i) => acc + b * Math.pow(2, 4 - i), 0)
  const isCorrect = value === target

  const toggle = (i: number) => {
    const next = [...bits]
    next[i] = next[i] === 1 ? 0 : 1
    setBits(next)
  }
  const next = () => {
    setTargetIdx((prev) => (prev + 1) % targets.length)
    setBits([0, 0, 0, 0, 0])
  }

  return (
    <ActivityShell title="Binary Bit Builder" emoji="🔲">
      <p className="text-gray-300 text-sm mb-4">
        Toggle the bits below to represent the decimal number in binary.
      </p>
      <div className="flex items-center justify-center gap-2 mb-1">
        <span className="text-4xl font-mono font-bold text-indigo-300 tabular-nums mr-3">
          {target}
        </span>
        <span className="text-gray-500 text-sm">=</span>
      </div>
      {/* Bit buttons */}
      <div className="flex justify-center gap-2 mt-4 mb-2">
        {bits.map((b, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className={`w-14 h-14 rounded-xl text-2xl font-bold font-mono transition-all duration-150 select-none border-2 ${
              b === 1
                ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-900'
                : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-400'
            }`}
          >
            {b}
          </button>
        ))}
      </div>
      {/* Position labels */}
      <div className="flex justify-center gap-2 mb-4">
        {[16, 8, 4, 2, 1].map((p) => (
          <div key={p} className="w-14 text-center text-xs text-gray-500">
            2<sup>{Math.log2(p)}</sup>={p}
          </div>
        ))}
      </div>
      {/* Running total */}
      <p className="text-center text-gray-400 text-sm mb-4">
        Current value:{' '}
        <span className={`font-mono font-bold text-lg ${isCorrect ? 'text-emerald-400' : 'text-white'}`}>
          {value}
        </span>
      </p>
      <div className="flex items-center justify-center gap-4">
        {isCorrect ? (
          <>
            <ResultBadge correct />
            <Button size="sm" onClick={next} className="gap-1 bg-indigo-600 hover:bg-indigo-700">
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setBits([0, 0, 0, 0, 0])}
            className="gap-1 border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </Button>
        )}
      </div>
    </ActivityShell>
  )
}

// ─────────────────────────────────────────────
// 2. Base Converter Quiz  (Lesson 5 – Decimal/Octal/Hex topics, Lesson 6)
// ─────────────────────────────────────────────
const BaseConverterQuiz = ({
  fromBase,
  toBase,
  fromLabel,
  toLabel,
  questions,
}: {
  fromBase: number
  toBase: number
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
    <ActivityShell title={`${fromLabel} → ${toLabel} Conversion Practice`} emoji="🔄">
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
        className={`w-12 h-12 rounded-xl text-xl font-bold font-mono border-2 transition-all ${
          val === 1
            ? 'bg-indigo-600 border-indigo-400 text-white'
            : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-400'
        }`}
      >
        {val}
      </button>
    </div>
  )

  return (
    <ActivityShell title="Logic Gate Simulator" emoji="⚡">
      {/* Gate selector */}
      <div className="flex flex-wrap gap-2 mb-5">
        {gates.map((g) => (
          <button
            key={g}
            onClick={() => setGate(g)}
            className={`px-3 py-1 rounded-lg text-sm font-semibold font-mono transition-all ${
              gate === g
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
            className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold font-mono border-2 shadow-lg transition-all ${
              output === 1
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
              ? [[0,0],[0,1],[1,0],[1,1]] as [number,number][]
              : [[0],[1]] as [number,number][]
            ).map((row, idx) => {
              const [ra, rb] = row
              const out = isTwoInput ? evalGate(gate, ra, rb ?? 0) : evalGate(gate, ra, 0)
              const isActive = isTwoInput ? (ra === a && rb === b) : ra === a
              return (
                <tr
                  key={idx}
                  className={`border-t border-gray-700 transition-colors ${
                    isActive ? 'bg-indigo-900/40 font-bold' : 'bg-gray-900'
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

  const rows: [number, number][] = [[0,0],[0,1],[1,0],[1,1]]
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
    <ActivityShell title="Truth Table Challenge" emoji="📋">
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
                      className={`w-10 h-10 rounded-lg font-bold text-lg border-2 transition-all ${
                        isRight === true
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
  const options = ["A", "0", "1", "A'"].filter((o) => true)
  const isCorrect = selected === q.result

  const next = () => {
    setIdx((p) => (p + 1) % pairs.length)
    setSelected(null)
    setChecked(false)
  }

  return (
    <ActivityShell title="Boolean Law Simplifier" emoji="🧮">
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
            className={`w-16 h-14 rounded-xl font-mono font-bold text-xl border-2 transition-all ${
              selected === opt
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
      title={op === 'add' ? 'Binary Addition Practice' : 'Binary Subtraction Practice'}
      emoji={op === 'add' ? '➕' : '➖'}
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
// 7. Bit Flipper — 1's & 2's Complement  (Lesson 9)
// ─────────────────────────────────────────────
const ComplementExplorer = ({ mode }: { mode: "1s" | "2s" | "inversion" }) => {
  const [bits, setBits] = useState<number[]>([0,1,0,1,1,0,1,0])

  const toggle = (i: number) => {
    const next = [...bits]
    next[i] = next[i] === 1 ? 0 : 1
    setBits(next)
  }

  const value = bits.reduce((acc, b, i) => acc + b * Math.pow(2, 7 - i), 0)

  const onesComp = bits.map((b) => (b === 1 ? 0 : 1))
  const onesValue = onesComp.reduce((acc, b, i) => acc + b * Math.pow(2, 7 - i), 0)

  let twosComp: number[] = []
  if (mode === '2s') {
    let carry = 1
    const temp = [...onesComp].reverse()
    for (let i = 0; i < temp.length; i++) {
      const sum = temp[i] + carry
      temp[i] = sum % 2
      carry = Math.floor(sum / 2)
    }
    twosComp = temp.reverse()
  }
  const twosValue = twosComp.reduce((acc, b, i) => acc + b * Math.pow(2, 7 - i), 0)

  const title = mode === 'inversion' ? 'Bit Inversion (NOT)' : mode === '1s' ? "1's Complement Explorer" : "2's Complement Explorer"
  const emoji = mode === 'inversion' ? '🔃' : mode === '1s' ? '🔀' : '💡'

  return (
    <ActivityShell title={title} emoji={emoji}>
      <p className="text-gray-300 text-sm mb-4">
        Toggle the bits below and see the {mode === 'inversion' ? 'inverted result' : mode === '1s' ? "1's complement" : "2's complement"} update in real time.
      </p>
      {/* Input bits */}
      <div className="mb-3">
        <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-widest">Original</p>
        <div className="flex gap-1 flex-wrap">
          {bits.map((b, i) => (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={`w-10 h-10 rounded-lg font-mono font-bold text-lg border-2 transition-all ${
                b === 1
                  ? 'bg-indigo-600 border-indigo-400 text-white'
                  : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-400'
              }`}
            >
              {b}
            </button>
          ))}
          <span className="ml-3 self-center text-gray-400 text-sm font-mono">= {value}</span>
        </div>
      </div>

      {/* Result */}
      <div className="mb-1">
        <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-widest">
          {mode === 'inversion' ? 'Inverted (NOT)' : mode === '1s' ? "1's Complement" : "2's Complement"}
        </p>
        <div className="flex gap-1 flex-wrap">
          {(mode === '2s' ? twosComp : onesComp).map((b, i) => (
            <div
              key={i}
              className={`w-10 h-10 rounded-lg font-mono font-bold text-lg border-2 flex items-center justify-center ${
                b === 1
                  ? 'bg-purple-600 border-purple-400 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-400'
              }`}
            >
              {b}
            </div>
          ))}
          <span className="ml-3 self-center text-purple-300 text-sm font-mono">
            = {mode === '2s' ? twosValue : onesValue}
          </span>
        </div>
      </div>

      {mode !== 'inversion' && (
        <div className="mt-4 rounded-xl bg-gray-800/60 border border-gray-700 px-4 py-3 text-sm">
          <span className="text-gray-400">Original: </span>
          <span className="font-mono text-white">{value}</span>
          <span className="text-gray-400 mx-2">→</span>
          <span className="text-gray-400">{mode === '1s' ? "1's complement" : "2's complement"}: </span>
          <span className="font-mono text-purple-300">
            {mode === '2s' ? `-${value}` : `-(${value} = ~${value})`}
          </span>
        </div>
      )}

      {mode === 'inversion' && (
        <div className="mt-3 text-sm text-gray-400 bg-gray-800/60 rounded-xl px-4 py-2 border border-gray-700">
          <Info className="w-4 h-4 inline-block mr-1 text-indigo-400" />
          Original + Inverted ={' '}
          <span className="font-mono text-white">{value + onesValue}</span> (always 255 for 8 bits)
        </div>
      )}

      <Button
        size="sm"
        variant="outline"
        onClick={() => setBits([0,1,0,1,1,0,1,0])}
        className="mt-4 border-gray-600 text-gray-300 hover:bg-gray-800 gap-1"
      >
        <RotateCcw className="w-3 h-3" /> Reset
      </Button>
    </ActivityShell>
  )
}

// ─────────────────────────────────────────────
// 8. Signed / Unsigned Interpreter  (Lesson 10)
// ─────────────────────────────────────────────
const SignedUnsignedInterpreter = () => {
  const [bits, setBits] = useState<number[]>([1,0,1,1,0,1,1,0])

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
    <ActivityShell title="Signed vs Unsigned Interpreter" emoji="±">
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
              className={`w-11 h-11 rounded-lg font-mono font-bold text-lg border-2 transition-all ${
                i === 0
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
            <span className="text-[10px] text-gray-600 font-mono">{Math.pow(2, 7-i)}</span>
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
      emoji={isBcd ? '🔢' : '🔡'}
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
// 10. Boolean Scenario Builder  (Lesson 1)
// Real-world condition toggles → live Boolean expression evaluation
// ─────────────────────────────────────────────
const BooleanScenarioBuilder = () => {
  type Scenario = {
    title: string
    emoji: string
    description: string
    conditions: { id: string; label: string; emoji: string }[]
    expression: {
      label: string
      fn: (vals: Record<string, boolean>) => boolean
      formula: string
    }
    trueMsg: string
    falseMsg: string
  }

  const scenarios: Scenario[] = [
    {
      title: 'Access Control System',
      emoji: '🔐',
      description: 'A security door grants access only when all conditions are met.',
      conditions: [
        { id: 'hasCard', label: 'Has Access Card', emoji: '💳' },
        { id: 'isEmployee', label: 'Is an Employee', emoji: '🪪' },
        { id: 'withinHours', label: 'Within Work Hours', emoji: '⏰' },
      ],
      expression: {
        label: 'ACCESS GRANTED',
        fn: (v) => v.hasCard && v.isEmployee && v.withinHours,
        formula: 'hasCard AND isEmployee AND withinHours',
      },
      trueMsg: '✅ Door unlocked! All conditions satisfied.',
      falseMsg: '🚫 Access denied. All three conditions must be TRUE.',
    },
    {
      title: 'Smart Umbrella Alert',
      emoji: '☂️',
      description: 'Your smart home alerts you to grab an umbrella when needed.',
      conditions: [
        { id: 'isRaining', label: 'Rain Forecast', emoji: '🌧️' },
        { id: 'goingOutside', label: 'Going Outside', emoji: '🚶' },
      ],
      expression: {
        label: 'TAKE UMBRELLA',
        fn: (v) => v.isRaining && v.goingOutside,
        formula: 'isRaining AND goingOutside',
      },
      trueMsg: '☂️ Grab your umbrella! Both conditions are true.',
      falseMsg: '😎 No umbrella needed right now.',
    },
    {
      title: 'Movie Night Decider',
      emoji: '🎬',
      description: 'Watch a movie if it\'s the weekend OR you\'ve finished your work.',
      conditions: [
        { id: 'isWeekend', label: 'It\'s the Weekend', emoji: '🗓️' },
        { id: 'workDone', label: 'Work is Finished', emoji: '✅' },
      ],
      expression: {
        label: 'MOVIE NIGHT!',
        fn: (v) => v.isWeekend || v.workDone,
        formula: 'isWeekend OR workDone',
      },
      trueMsg: '🍿 Enjoy your movie night!',
      falseMsg: '📚 Finish your work first (unless it\'s the weekend).',
    },
    {
      title: 'Alarm System',
      emoji: '🚨',
      description: 'Alarm triggers if motion is detected AND the system is armed, but NOT during daytime.',
      conditions: [
        { id: 'motionDetected', label: 'Motion Detected', emoji: '👁️' },
        { id: 'systemArmed', label: 'System Armed', emoji: '🔒' },
        { id: 'isDaytime', label: 'It\'s Daytime', emoji: '☀️' },
      ],
      expression: {
        label: 'ALARM TRIGGERS',
        fn: (v) => v.motionDetected && v.systemArmed && !v.isDaytime,
        formula: 'motionDetected AND systemArmed AND NOT isDaytime',
      },
      trueMsg: '🚨 ALERT! Alarm is going off!',
      falseMsg: '🔕 No alarm. Check the conditions.',
    },
    {
      title: 'Free Delivery Qualifier',
      emoji: '📦',
      description: 'Get free delivery if you\'re a member OR your order is over ₱500.',
      conditions: [
        { id: 'isMember', label: 'Premium Member', emoji: '⭐' },
        { id: 'bigOrder', label: 'Order > ₱500', emoji: '💰' },
      ],
      expression: {
        label: 'FREE DELIVERY',
        fn: (v) => v.isMember || v.bigOrder,
        formula: 'isMember OR bigOrder',
      },
      trueMsg: '🎁 Free delivery applied!',
      falseMsg: '🚚 Delivery fee applies. Be a member or order more.',
    },
  ]

  const [scenarioIdx, setScenarioIdx] = useState(0)
  const [vals, setVals] = useState<Record<string, boolean>>({})
  const [revealed, setRevealed] = useState(false)

  const scenario = scenarios[scenarioIdx]
  const allVals = { ...Object.fromEntries(scenario.conditions.map(c => [c.id, false])), ...vals }
  const result = scenario.expression.fn(allVals)

  const toggle = (id: string) => {
    setVals(prev => ({ ...prev, [id]: !prev[id] }))
    setRevealed(true)
  }

  const nextScenario = () => {
    setScenarioIdx(p => (p + 1) % scenarios.length)
    setVals({})
    setRevealed(false)
  }

  // Parse formula parts for visual display
  const operatorColor = (op: string) => {
    if (op === 'AND') return 'text-blue-400'
    if (op === 'OR') return 'text-green-400'
    if (op === 'NOT') return 'text-orange-400'
    return 'text-gray-400'
  }

  return (
    <ActivityShell title="Boolean Logic in the Real World" emoji="🌍">
      <p className="text-gray-300 text-sm mb-5">
        Toggle the real-world conditions below and watch the Boolean logic evaluate live.
        This is exactly how computers make decisions using <span className="text-indigo-300 font-semibold">AND</span>,{' '}
        <span className="text-green-300 font-semibold">OR</span>, and{' '}
        <span className="text-orange-300 font-semibold">NOT</span>.
      </p>

      {/* Scenario selector */}
      <div className="flex gap-2 flex-wrap mb-5">
        {scenarios.map((s, i) => (
          <button
            key={i}
            onClick={() => { setScenarioIdx(i); setVals({}); setRevealed(false) }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
              scenarioIdx === i
                ? 'bg-indigo-600 border-indigo-400 text-white'
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
            }`}
          >
            {s.emoji} {s.title}
          </button>
        ))}
      </div>

      {/* Scenario card */}
      <div className="rounded-xl border border-gray-700 bg-gray-900/60 p-4 mb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">{scenario.emoji}</span>
          <h4 className="font-bold text-white text-base">{scenario.title}</h4>
        </div>
        <p className="text-gray-400 text-sm mb-4">{scenario.description}</p>

        {/* Condition toggles */}
        <div className="flex flex-col gap-2 mb-5">
          {scenario.conditions.map((cond) => {
            const isOn = allVals[cond.id]
            return (
              <button
                key={cond.id}
                onClick={() => toggle(cond.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left group ${
                  isOn
                    ? 'bg-indigo-900/50 border-indigo-500 text-white'
                    : 'bg-gray-800/60 border-gray-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                <span className="text-xl">{cond.emoji}</span>
                <span className="flex-1 text-sm font-medium">{cond.label}</span>
                {/* Toggle pill */}
                <div className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${isOn ? 'bg-indigo-500' : 'bg-gray-600'}`}>
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${isOn ? 'left-5' : 'left-0.5'}`} />
                </div>
                <span className={`text-xs font-mono font-bold w-12 text-right ${isOn ? 'text-indigo-300' : 'text-gray-600'}`}>
                  {isOn ? 'TRUE' : 'FALSE'}
                </span>
              </button>
            )
          })}
        </div>

        {/* Expression formula */}
        <div className="bg-gray-800/80 rounded-xl px-4 py-3 mb-4 border border-gray-700">
          <p className="text-xs text-gray-500 mb-1 uppercase tracking-widest font-semibold">Boolean Expression</p>
          <p className="font-mono text-sm">
            {scenario.expression.formula.split(' ').map((word, i) => (
              <span key={i} className={['AND','OR','NOT'].includes(word) ? `${operatorColor(word)} font-bold` : 'text-white'}>
                {word}{' '}
              </span>
            ))}
          </p>
        </div>

        {/* Result */}
        <div
          className={`rounded-xl px-4 py-4 border-2 transition-all duration-300 text-center ${
            !revealed
              ? 'border-gray-700 bg-gray-800/40'
              : result
              ? 'border-emerald-500 bg-emerald-900/30'
              : 'border-red-600 bg-red-900/30'
          }`}
        >
          <div className={`text-2xl font-bold font-mono mb-1 transition-colors ${
            !revealed ? 'text-gray-600' : result ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {!revealed ? '?' : result ? 'TRUE' : 'FALSE'}
          </div>
          <div className={`text-xs font-semibold uppercase tracking-widest mb-2 ${
            !revealed ? 'text-gray-600' : result ? 'text-emerald-500' : 'text-red-500'
          }`}>
            {scenario.expression.label}
          </div>
          {revealed && (
            <p className="text-sm text-gray-300">{result ? scenario.trueMsg : scenario.falseMsg}</p>
          )}
          {!revealed && (
            <p className="text-sm text-gray-600">Toggle conditions above to see the result</p>
          )}
        </div>
      </div>

      {/* Visual logic table — show current state of all combos */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2 uppercase tracking-widest font-semibold">Condition States</p>
        <div className="flex flex-wrap gap-2">
          {scenario.conditions.map(cond => (
            <div key={cond.id} className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border ${
              allVals[cond.id]
                ? 'bg-indigo-900/50 border-indigo-600 text-indigo-300'
                : 'bg-gray-800 border-gray-700 text-gray-500'
            }`}>
              <span>{cond.emoji}</span>
              <span>{cond.id}</span>
              <span className="font-bold">= {allVals[cond.id] ? '1' : '0'}</span>
            </div>
          ))}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border font-bold ${
            !revealed
              ? 'bg-gray-800 border-gray-700 text-gray-500'
              : result
              ? 'bg-emerald-900/50 border-emerald-600 text-emerald-300'
              : 'bg-red-900/50 border-red-700 text-red-300'
          }`}>
            <span>→</span>
            <span>Output = {!revealed ? '?' : result ? '1 (TRUE)' : '0 (FALSE)'}</span>
          </div>
        </div>
      </div>

      <Button
        size="sm"
        onClick={nextScenario}
        className="bg-indigo-600 hover:bg-indigo-700 gap-1"
      >
        Next Scenario <ChevronRight className="w-4 h-4" />
      </Button>
    </ActivityShell>
  )
}



// ─────────────────────────────────────────────
// 11. K-Map Simplification visual  (Lesson 4)
// ─────────────────────────────────────────────
const KMapActivity = () => {
  // 2-variable K-Map practice: show random truth table, user identifies the simplified expression
  const problems = [
    { values: [0,0,0,1], answer: "A · B", hint: "Only bottom-right cell = 1. Both A and B must be 1." },
    { values: [0,1,0,1], answer: "B", hint: "Right column (B=1) is all 1s. Simplify to just B." },
    { values: [0,0,1,1], answer: "A", hint: "Bottom row (A=1) is all 1s. Simplify to just A." },
    { values: [0,1,1,1], answer: "A + B", hint: "Three 1s — everything except (A=0,B=0). That's A OR B." },
    { values: [1,0,0,0], answer: "A' · B'", hint: "Only top-left (A=0,B=0) = 1. Both must be 0." },
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
    <ActivityShell title="K-Map Simplification Challenge" emoji="🗺️">
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
                      className={`w-12 h-12 border border-gray-600 flex items-center justify-center text-xl font-mono font-bold ${
                        v === 1
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
            className={`px-4 py-2 rounded-xl font-mono text-sm font-semibold border-2 transition-all ${
              selected === c
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

  // ── Lesson 1: Intro to Boolean Algebra ──
  if (lessonId === 1) {
    return <BooleanScenarioBuilder />
  }

  // ── Lesson 2: Logic Gates ──
  if (lessonId === 2) {
    return <LogicGateSimulator />
  }

  // ── Lesson 3: Truth Tables ──
  if (lessonId === 3) {
    return <TruthTableBuilder />
  }

  // ── Lesson 4: Simplification ──
  if (lessonId === 4) {
    if (title.includes('karnaugh') || title.includes('k-map') || tags.includes('kmap')) {
      return <KMapActivity />
    }
    return <BooleanLawMatcher />
  }

  // ── Lesson 5: Intro to Number Systems ──
  if (lessonId === 5) {
    if (title.includes('binary') || tags.includes('binary')) {
      return <BinaryBuilderActivity />
    }
    if (title.includes('hexadecimal') || tags.includes('hexadecimal')) {
      return (
        <BaseConverterQuiz
          fromBase={16}
          toBase={2}
          fromLabel="Hexadecimal"
          toLabel="Binary"
          questions={[
            { from: 'A', to: '1010' },
            { from: 'F', to: '1111' },
            { from: '3', to: '0011' },
            { from: 'C', to: '1100' },
            { from: 'B', to: '1011' },
            { from: '7', to: '0111' },
            { from: 'E', to: '1110' },
          ]}
        />
      )
    }
    if (title.includes('octal') || tags.includes('octal')) {
      return (
        <BaseConverterQuiz
          fromBase={8}
          toBase={2}
          fromLabel="Octal"
          toLabel="Binary"
          questions={[
            { from: '7', to: '111' },
            { from: '5', to: '101' },
            { from: '357', to: '011101111' },
            { from: '4', to: '100' },
            { from: '12', to: '001010' },
            { from: '3', to: '011' },
          ]}
        />
      )
    }
    if (title.includes('decimal') || tags.includes('decimal')) {
      return (
        <BaseConverterQuiz
          fromBase={10}
          toBase={2}
          fromLabel="Decimal"
          toLabel="Binary"
          questions={[
            { from: '5', to: '101' },
            { from: '10', to: '1010' },
            { from: '15', to: '1111' },
            { from: '8', to: '1000' },
            { from: '22', to: '10110' },
          ]}
        />
      )
    }
    return <BinaryBuilderActivity />
  }

  // ── Lesson 6: Types of Number Systems ──
  if (lessonId === 6) {
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
    return (
      <BaseConverterQuiz
        fromBase={2}
        toBase={10}
        fromLabel="Binary"
        toLabel="Decimal"
        questions={[
          { from: '1001', to: '9' },
          { from: '10110', to: '22' },
          { from: '1111111', to: '127' },
          { from: '10000000', to: '128' },
          { from: '101010', to: '42' },
        ]}
      />
    )
  }

  // ── Lesson 7: Conversion of Number Systems ──
  if (lessonId === 7) {
    if (title.includes('decimal to binary') || (tags.includes('conversion') && tags.includes('decimal') && tags.includes('binary'))) {
      return (
        <BaseConverterQuiz
          fromBase={10}
          toBase={2}
          fromLabel="Decimal"
          toLabel="Binary"
          questions={[
            { from: '45', to: '101101' },
            { from: '100', to: '1100100' },
            { from: '25', to: '11001' },
            { from: '200', to: '11001000' },
            { from: '13', to: '1101' },
            { from: '255', to: '11111111' },
          ]}
        />
      )
    }
    if (title.includes('binary to decimal') || tags.includes('binary')) {
      return (
        <BaseConverterQuiz
          fromBase={2}
          toBase={10}
          fromLabel="Binary"
          toLabel="Decimal"
          questions={[
            { from: '101101', to: '45' },
            { from: '11010110', to: '214' },
            { from: '10110', to: '22' },
            { from: '1111', to: '15' },
            { from: '1000000', to: '64' },
          ]}
        />
      )
    }
    return (
      <BaseConverterQuiz
        fromBase={16}
        toBase={10}
        fromLabel="Hexadecimal"
        toLabel="Decimal"
        questions={[
          { from: '1F4', to: '500' },
          { from: 'FF', to: '255' },
          { from: 'A3', to: '163' },
          { from: '2F', to: '47' },
          { from: '64', to: '100' },
        ]}
      />
    )
  }

  // ── Lesson 8: Binary Arithmetic ──
  if (lessonId === 8) {
    if (title.includes('addition') || tags.includes('addition')) {
      return <BinaryArithmeticTrainer op="add" />
    }
    if (title.includes('subtraction') || tags.includes('subtraction')) {
      return <BinaryArithmeticTrainer op="subtract" />
    }
    // Multiplication / Division: use addition trainer with a note
    return <BinaryArithmeticTrainer op="add" />
  }

  // ── Lesson 9: Complements ──
  if (lessonId === 9) {
    if (title.includes("2's") || title.includes('twos') || tags.includes('twos')) {
      return <ComplementExplorer mode="2s" />
    }
    if (title.includes('inversion') || tags.includes('not') || tags.includes('flip')) {
      return <ComplementExplorer mode="inversion" />
    }
    return <ComplementExplorer mode="1s" />
  }

  // ── Lesson 10: Signed and Unsigned ──
  if (lessonId === 10) {
    return <SignedUnsignedInterpreter />
  }

  // ── Lesson 11: Binary Codes ──
  if (lessonId === 11) {
    if (title.includes('ascii') || tags.includes('ascii')) {
      return <BcdAsciiEncoder mode="ascii" />
    }
    return <BcdAsciiEncoder mode="bcd" />
  }

  return null
}

export default LessonInteractiveActivity
