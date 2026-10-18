/**
 * Strips raw LaTeX math notation and converts subscripts/superscripts to clean Unicode.
 */
export function cleanLatexNotation(text: string): string {
  if (!text || typeof text !== 'string') return text || '';

  let cleaned = text;

  // Replace common LaTeX math commands
  cleaned = cleaned
    .replace(/\\cdot/g, ' · ')
    .replace(/\\times/g, ' × ')
    .replace(/\\oplus/g, ' ⊕ ')
    .replace(/\\land/g, ' ∧ ')
    .replace(/\\lor/g, ' ∨ ')
    .replace(/\\neg/g, ' ¬ ')
    .replace(/\\leq?/g, ' ≤ ')
    .replace(/\\geq?/g, ' ≥ ')
    .replace(/\\neq?/g, ' ≠ ')
    .replace(/\\approx/g, ' ≈ ')
    .replace(/\\overline{([A-Za-z0-9]+)}/g, "$1'");

  // Replace LaTeX subscripts: e.g. (101100)_2 or 101100_{2} or $(101100)_2$
  const subMap: Record<string, string> = {
    '0': '₀',
    '1': '₁',
    '2': '₂',
    '3': '₃',
    '4': '₄',
    '5': '₅',
    '6': '₆',
    '7': '₇',
    '8': '₈',
    '9': '₉',
    'i': 'ᵢ',
    'n': 'ₙ',
  };
  cleaned = cleaned.replace(/_\{?([0-9]+|[in])\}?/g, (_match, p1) => {
    if (p1 === '10') return '₁₀';
    if (p1 === '16') return '₁₆';
    return p1
      .split('')
      .map((c: string) => subMap[c] || c)
      .join('');
  });

  // Replace LaTeX superscripts: e.g. 2^i, 2^n, 2^3, 2^{10}
  const supMap: Record<string, string> = {
    '0': '⁰',
    '1': '¹',
    '2': '²',
    '3': '³',
    '4': '⁴',
    '5': '⁵',
    '6': '⁶',
    '7': '⁷',
    '8': '⁸',
    '9': '⁹',
    '+': '⁺',
    '-': '⁻',
    '=': '⁼',
    '(': '⁽',
    ')': '⁾',
    'i': 'ⁱ',
    'n': 'ⁿ',
    'x': 'ˣ',
    'y': 'ʸ',
  };
  cleaned = cleaned.replace(/\^\{?([0-9]+|[inxy=+-]+)\}?/g, (_match, p1) => {
    return p1
      .split('')
      .map((c: string) => supMap[c] || c)
      .join('');
  });

  // Strip math delimiters: $...$
  cleaned = cleaned.replace(/\$([^$]+)\$/g, '$1');

  // Strip any remaining lone $
  cleaned = cleaned.replace(/\$/g, '');

  return cleaned.trim();
}
