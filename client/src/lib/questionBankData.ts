// questionBankData.ts — DSA2102 Midterm Question Bank
// Consolidated from past year papers (2223s2, 2324s1, 2425s2, 2526s1) and MA2213_2324s2
// Organized by question type with attempt/guide/solution modes

export interface BankQuestion {
  id: string;
  source: string;       // e.g. "DSA2102 2526s1 Midterm"
  qnum: string;         // e.g. "Q3a"
  type: QuestionType;
  topic: string;        // Short descriptive topic
  question: string;     // Full question text
  solution: string | null;
  guide: string;        // Step-by-step solving guide
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];       // Additional tags for filtering
}

export type QuestionType =
  | 'floating_point'
  | 'error_analysis'
  | 'triangular_solve'
  | 'gaussian_elimination'
  | 'lu_factorization'
  | 'cholesky'
  | 'conditioning_linear'
  | 'least_squares'
  | 'qr_factorization'
  | 'householder_givens'
  | 'theory_mcq'
  | 'complexity';

export interface QuestionGroup {
  type: QuestionType;
  label: string;
  icon: string;
  color: string;
  chapterRef: string;
  description: string;
  questions: BankQuestion[];
}

// ─────────────────────────────────────────────────────────────────────────────
// FLOATING POINT QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────

const floatingPointQuestions: BankQuestion[] = [
  {
    id: 'fp-1',
    source: 'DSA2102 2223s2 Midterm',
    qnum: 'Q1a',
    type: 'floating_point',
    topic: 'T/F: Floating point arithmetic closure',
    question: 'True or False: If two real numbers are exactly representable as floating point numbers, then the result of a real arithmetic operation (+, −, ×, ÷) between them will also be exactly representable as a floating point number.',
    solution: 'FALSE. A simple counterexample: 0.1 and 0.2 are not exactly representable in binary floating point, but even for numbers that are, their product or sum may require more bits than available. For example, 1/3 + 1/3 = 2/3, but 2/3 is not exactly representable in binary.',
    guide: '**Key concept:** Floating point numbers form a finite set. Arithmetic operations on two elements of this set may produce a result that falls between two representable numbers and must be rounded.\n\n**Approach:** Think of a counterexample. Even if a and b are exactly representable, a × b may require more significant bits than the format allows. Example: 1.5 × 1.5 = 2.25 (fine), but 1.1 × 1.1 = 1.21 (not exactly representable in binary).',
    difficulty: 'medium',
    tags: ['true-false', 'arithmetic', 'rounding'],
  },
  {
    id: 'fp-2',
    source: 'DSA2102 2223s2 Midterm',
    qnum: 'Q1b',
    type: 'floating_point',
    topic: 'T/F: Floating point associativity',
    question: 'True or False: Floating point addition is associative but not commutative.',
    solution: 'FALSE. Floating point addition IS commutative (a ⊕ b = b ⊕ a) but is NOT associative. Example: (1e16 + 1) − 1e16 = 0 in floating point, but 1e16 + (1 − 1e16) = 1.',
    guide: '**Key concept:** Commutativity (a+b = b+a) holds for floating point because the rounding error depends only on the magnitudes, not order. Associativity fails because rounding at each step can accumulate differently depending on grouping.\n\n**Remember:** The statement has the properties backwards — it is commutative but NOT associative.',
    difficulty: 'medium',
    tags: ['true-false', 'properties', 'associativity'],
  },
  {
    id: 'fp-3',
    source: 'DSA2102 2425s2 Midterm Solutions',
    qnum: 'Q1a',
    type: 'floating_point',
    topic: 'T/F: Floating point distribution',
    question: 'True or False: Floating point numbers are distributed uniformly throughout their range.',
    solution: 'FALSE. Small floating point numbers are spaced closer together than large ones. The spacing between consecutive floating point numbers doubles each time the exponent increases by 1. Near zero, numbers are very densely packed; near the maximum, they are very sparse.',
    guide: '**Key concept:** Floating point numbers have uniform *relative* spacing (machine epsilon ε_mach is constant), not uniform absolute spacing. The gap between consecutive floats near x is approximately ε_mach × |x|.\n\n**Visualization:** Between 1 and 2 there are 2^52 doubles; between 2^52 and 2^53 there are also 2^52 doubles — but the absolute gaps are 2^52 times larger.',
    difficulty: 'easy',
    tags: ['true-false', 'distribution', 'spacing'],
  },
  {
    id: 'fp-4',
    source: 'DSA2102 2425s2 Midterm Solutions',
    qnum: 'Q1b',
    type: 'floating_point',
    topic: 'T/F: Subtraction of representable numbers',
    question: 'True or False: If a and b are exactly representable in a floating point system, then so is a − b.',
    solution: 'FALSE. If a is a large negative number and b is the largest positive number, the computation a − b = a + (−b) will overflow. Also, even without overflow, the result may not be exactly representable (e.g., the result may require more bits than available).',
    guide: '**Key concept:** Even if a and b are exactly representable, a − b may:\n1. Overflow (if the result exceeds the maximum representable number)\n2. Require rounding (if the result has more significant bits than the format allows)\n\n**Counterexample for overflow:** a = −(max float), b = max float. Then a − b = −2 × max float which overflows to −Inf.',
    difficulty: 'medium',
    tags: ['true-false', 'overflow', 'subtraction'],
  },
  {
    id: 'fp-5',
    source: 'DSA2102 2223s2 Midterm Solutions',
    qnum: 'Q2a–e',
    type: 'floating_point',
    topic: 'Half-precision: largest, smallest, subnormal numbers',
    question: 'Consider the half-precision floating-point format with 5 bits for the exponent and 10 bits for the significand (mantissa). The bias is 15.\n\n(a) What is the largest positive representable number? Give your answer in both binary and decimal.\n(b) What is the smallest positive normal number? Give your answer in both binary and decimal.\n(c) What is the smallest positive subnormal number? Give your answer in both binary and decimal.\n(d) What is the result of adding the largest positive representable number and the smallest positive normal number?\n(e) What is the result of multiplying the largest positive representable number and the smallest positive normal number?',
    solution: '(a) Largest: exponent bits = 11110 (= 30, so exp = 30 − 15 = 15), significand all 1s.\n    Binary: 0|11110|1111111111\n    Decimal: (1.1111111111)₂ × 2^15 = (2 − 2^−10) × 2^15 = 2^16 − 2^5 = 65504\n\n(b) Smallest normal: exponent bits = 00001 (= 1, so exp = 1 − 15 = −14), significand all 0s.\n    Binary: 0|00001|0000000000\n    Decimal: 1.0 × 2^−14 ≈ 6.104 × 10^−5\n\n(c) Smallest subnormal: exponent bits = 00000, significand = 0000000001.\n    Binary: 0|00000|0000000001\n    Decimal: 0.0000000001₂ × 2^−14 = 2^−10 × 2^−14 = 2^−24 ≈ 5.96 × 10^−8\n\n(d) The result is the same as the largest positive representable number (65504). The smallest normal number (≈6.1×10^−5) is so much smaller that when aligned to the same exponent, it rounds to 0.\n\n(e) (1.1111111111)₂ × 2^15 × 1.0 × 2^−14 = (1.1111111111)₂ × 2^1 ≈ 3.998 ≈ (1.1111111111)₂ × 2^1\n    Binary: 0|10000|1111111111, Decimal ≈ 3.998',
    guide: '**Step-by-step approach for half-precision problems:**\n\n**Format:** sign(1) | exponent(5) | significand(10). Bias = 2^(5−1) − 1 = 15.\n\n**Normal numbers:** exponent bits ≠ 00000 and ≠ 11111.\n- Value = (−1)^s × 1.significand × 2^(exponent_bits − 15)\n- Largest: exp bits = 11110 (=30), exp = 30−15 = 15, sig = all 1s → (2−2^−10) × 2^15 = 65504\n- Smallest: exp bits = 00001 (=1), exp = 1−15 = −14, sig = all 0s → 1.0 × 2^−14\n\n**Subnormal numbers:** exponent bits = 00000.\n- Value = (−1)^s × 0.significand × 2^(1−15) = 0.significand × 2^−14\n- Smallest: sig = 0000000001 → 2^−10 × 2^−14 = 2^−24\n\n**Special values:** exp bits = 11111: if sig = 0 → ±Inf; if sig ≠ 0 → NaN',
    difficulty: 'medium',
    tags: ['half-precision', 'normal', 'subnormal', 'numerical'],
  },
  {
    id: 'fp-6',
    source: 'DSA2102 2526s1 Midterm Solutions',
    qnum: 'Q3a–d',
    type: 'floating_point',
    topic: 'Half-precision: Inf, NaN, round-to-even',
    question: 'Consider the half-precision floating-point format (5 exponent bits, 10 significand bits, bias = 15).\n\n(a) Give an example of two bit strings and a computation between them whose result would be Inf.\n(b) Give an example of two bit strings and a computation between them whose result would be NaN.\n(c) Give an example of a number to be stored in this format where we would need to use round-to-even and would round UP.\n(d) Give an example of a number to be stored in this format where we would need to use round-to-even and would round DOWN.',
    solution: '(a) Inf: Take two copies of the largest representable number (0|11110|1111111111 = 65504) and add them. The result 131008 overflows to +Inf.\n    Alternatively: 0|11111|0000000000 + 0|11111|0000000000 (Inf + Inf = Inf).\n\n(b) NaN: Inf − Inf = NaN. Use 0|11111|0000000000 − 0|11111|0000000000.\n    Alternatively: 0/0 in floating point.\n\n(c) Round UP: We need a number whose (p+1)th bit is 1 and the remaining bits are all 0 (exact halfway), AND the p-th bit is 1 (odd → round up to even).\n    Example: 0|00001|1111111101|1 — the last stored bit is 1 (odd), so we round up to 0|00001|1111111110.\n\n(d) Round DOWN: Same halfway case but the p-th bit is 0 (even → keep, i.e., round down).\n    Example: 0|00001|1111111110|1 — the last stored bit is 0 (even), so we round down (keep as is).',
    guide: '**Special values in IEEE 754:**\n- Exponent all 1s (11111), significand = 0: ±Infinity\n- Exponent all 1s (11111), significand ≠ 0: NaN (Not a Number)\n- Operations producing Inf: overflow, x/0 for x≠0\n- Operations producing NaN: 0/0, Inf−Inf, Inf×0, √(negative)\n\n**Round-to-even (banker\'s rounding):**\n- Only applies when the result is exactly halfway between two representable numbers\n- The extra bit (guard bit) is exactly 1 with all remaining bits 0\n- Round UP if the last stored bit is 1 (odd) → makes it even\n- Round DOWN if the last stored bit is 0 (even) → already even, keep it\n\n**Key:** Round-to-even only activates at exact halfway points. For non-halfway cases, round normally (round half up).',
    difficulty: 'medium',
    tags: ['half-precision', 'Inf', 'NaN', 'round-to-even'],
  },
  {
    id: 'fp-7',
    source: 'DSA2102 2324s1 Midterm Solutions',
    qnum: 'Q2',
    type: 'floating_point',
    topic: 'IEEE double precision: significant figures, exponent range, subnormals',
    question: 'Consider the IEEE double precision format (11 exponent bits, 52 mantissa bits, bias = 1023).\n\n(a) What is the maximum number of binary significant figures a non-zero normal number can have?\n(b) What is the minimum number of binary significant figures a non-zero normal number can have?\n(c) What is the maximum number of binary significant figures a non-zero subnormal number can have?\n(d) What is the minimum number of binary significant figures a non-zero subnormal number can have?\n(e) What is the exponent offset (bias) in this system?\n(f) What is the largest exponent a number can have?\n(g) What is the largest positive subnormal number? Give your answer in base ten.',
    solution: '(a) 53 (the implicit leading 1 plus 52 stored bits)\n(b) 53 (all normal numbers have the same precision: 1 implicit + 52 stored)\n(c) 52 (subnormal with significand = 0.1111...1 has 52 significant bits)\n(d) 1 (subnormal with significand = 0.0000...01 has only 1 significant bit)\n(e) Bias = 2^(11−1) − 1 = 1023\n(f) Largest exponent = 2^11 − 2 − 1023 = 2046 − 1023 = 1023 (exponent bits = 11111111110)\n(g) Smallest positive normal = 2^−1022. Largest subnormal = smallest normal − 1 ULP = 2^−1022 − 2^−1074 ≈ 2.225 × 10^−308',
    guide: '**IEEE Double Precision structure:** 1 sign + 11 exponent + 52 significand = 64 bits. Bias = 1023.\n\n**Normal numbers:** exponent bits ∈ [1, 2046] (i.e., not all 0s or all 1s)\n- Precision: always 53 bits (1 implicit leading bit + 52 stored)\n- Exponent range: 1−1023 = −1022 to 2046−1023 = 1023\n\n**Subnormal numbers:** exponent bits = 00000000000\n- Form: 0.significand × 2^−1022\n- Precision: varies from 1 bit (0.0...01) to 52 bits (0.1111...1)\n- Largest subnormal ≈ 2^−1022 (just below smallest normal)\n\n**Key formula:** bias = 2^(e−1) − 1 where e = number of exponent bits',
    difficulty: 'hard',
    tags: ['double-precision', 'IEEE-754', 'subnormal', 'exponent'],
  },
  {
    id: 'fp-8',
    source: 'DSA2102 2425s2 Midterm Solutions',
    qnum: 'Q2a–d',
    type: 'floating_point',
    topic: 'Single precision: counting floats, spacing, overflow',
    question: 'Consider the single precision floating point format (8 exponent bits, 23 significand bits, bias = 127).\n\n(a) How many normal floating point numbers are there in this system?\n(b) What is the distance between the largest positive floating point number and the second largest positive floating point number?\n(c) What is the distance between the smallest positive floating point number and the second smallest positive floating point number?\n(d) What is the result of multiplying the largest positive normal number with the smallest positive subnormal number? Give your answer in both decimal and binary.',
    solution: '(a) Sign: 2 choices. Exponent: 2^8 − 2 = 254 valid values (excluding all-0s and all-1s). Significand: 2^23 choices.\n    Total = 2 × 254 × 2^23 = 2^32 − 2^25 ≈ 4.26 × 10^9\n\n(b) Both numbers have exponent bits = 11111110 (= 254, exp = 254−127 = 127). They differ only in the last significand bit = 2^−23.\n    Distance = 2^−23 × 2^127 = 2^104 ≈ 2.03 × 10^31\n\n(c) Both numbers have exponent bits = 00000001 (= 1, exp = 1−127 = −126). They differ only in the last significand bit = 2^−23.\n    Distance = 2^−23 × 2^−126 = 2^−149 ≈ 1.40 × 10^−45\n\n(d) Smallest positive subnormal = 2^−23 × 2^−126 = 2^−149.\n    Largest positive normal = (1 − 2^−24) × 2^128 = 2^128 − 2^104.\n    Product = (2^128 − 2^104) × 2^−149 = 2^−21 − 2^−45 ≈ 4.77 × 10^−7.\n    Binary: 0|01101010|11111111111111111111110 (approximately)',
    guide: '**Counting normal floats:**\n- Sign: 2 choices (+ or −)\n- Exponent: 2^e − 2 valid values (exclude all-0s = subnormal/zero, all-1s = Inf/NaN)\n- Significand: 2^p choices\n- Total = 2 × (2^e − 2) × 2^p\n\n**Spacing between adjacent floats:**\n- Two adjacent floats differ only in the last significand bit\n- If both have exponent e_stored, the gap = 2^−p × 2^(e_stored − bias)\n- For largest: gap = 2^−23 × 2^127 = 2^104\n- For smallest: gap = 2^−23 × 2^−126 = 2^−149\n\n**Multiplying floats:**\n- Multiply significands, add exponents\n- Check for overflow/underflow',
    difficulty: 'hard',
    tags: ['single-precision', 'counting', 'spacing', 'overflow'],
  },
  {
    id: 'fp-9',
    source: 'MA2213 2324s2 Midterm',
    qnum: 'Q1b–c',
    type: 'floating_point',
    topic: 'Operations producing Inf and NaN',
    question: '(a) Give an example of a floating point operation that would produce the result Inf.\n(b) Give an example of a floating point operation that would produce the result NaN.',
    solution: '(a) Inf: 1.0 / 0.0 (division by zero for a non-zero numerator)\n    Also: overflow, e.g., (largest float) × 2.0\n\n(b) NaN: 0.0 / 0.0 (zero divided by zero)\n    Also: Inf − Inf, Inf × 0, sqrt(−1)',
    guide: '**IEEE 754 special values:**\n\n**Infinity (±Inf):**\n- Exponent bits all 1s, significand = 0\n- Produced by: x/0 (x≠0), overflow, Inf+finite, Inf×finite (≠0)\n\n**NaN (Not a Number):**\n- Exponent bits all 1s, significand ≠ 0\n- Produced by: 0/0, Inf−Inf, Inf×0, sqrt(negative), Inf/Inf\n- NaN propagates: any operation involving NaN returns NaN\n- NaN ≠ NaN (this is the only IEEE value not equal to itself!)',
    difficulty: 'easy',
    tags: ['Inf', 'NaN', 'special-values'],
  },
  {
    id: 'fp-10',
    source: 'MA2213 2324s2 Midterm',
    qnum: 'Q2a–c',
    type: 'floating_point',
    topic: 'Half-precision: exponent range, subtraction, overflow threshold',
    question: 'Consider the half-precision floating-point format (5 exponent bits, 10 significand bits, bias = 15).\n\n(a) What is the exponent range of this system (in base 10)?\n(b) What is the result of subtracting the smallest positive normal number from the largest positive representable number? Give your answer in both binary and decimal.\n(c) What is the largest positive real number that can be added to the largest representable number without causing an overflow?',
    solution: '(a) Largest exponent: exponent bits = 11110 = 30, so exp = 30 − 15 = 15.\n    Smallest exponent: exponent bits = 00001 = 1, so exp = 1 − 15 = −14.\n    Range: −14 to 15.\n\n(b) Largest = 65504 = 1.1111111111 × 2^15. Smallest normal = 1.0 × 2^−14.\n    To subtract, align exponents: 2^−14 = 0.00000000000000000000000000001 × 2^15 (29 zeros after point).\n    This rounds to 0 before subtraction. Result = 65504 (unchanged).\n    Binary: 0|11110|1111111111\n\n(c) The largest number we can add without overflow is the largest number that rounds down (not up) when added.\n    The second-largest float is 65504 − 32 = 65472 = 1.1111111110 × 2^15.\n    The halfway point between 65472 and 65504 is 65488. Any number ≤ 65488 will round down to 65504 (no overflow).\n    But we need the largest real number: 65488 + (half the gap to next) = 65488 + 16 − ε ≈ 65504 − ε.\n    Actually: the largest addend that won\'t overflow is 65504 × ε_mach / 2 ≈ 15.99 (the ULP at 65504 level / 2).\n    More precisely: 0.0000000000011111111111 × 2^15 = 1.1111111111 × 2^4 = 31.984375. The largest real that rounds to this is 31.984375 + 0.015625 − ε ≈ 15.9921875.',
    guide: '**Exponent range:**\n- Smallest exponent: exp_bits = 00001 → exp = 1 − bias\n- Largest exponent: exp_bits = 11110 → exp = (2^e − 2) − bias\n\n**Subtraction with very different magnitudes:**\n1. Align the smaller number to the same exponent as the larger\n2. If the smaller number shifts so far right that all its bits fall off, it rounds to 0\n3. Rule of thumb: if the exponent difference > p (precision bits), the smaller number vanishes\n\n**Overflow threshold:**\n- The result overflows if it rounds to Inf\n- Find the largest addend that, when added to max_float, rounds down rather than up',
    difficulty: 'hard',
    tags: ['half-precision', 'exponent-range', 'subtraction', 'overflow'],
  },
  {
    id: 'fp-11',
    source: 'DSA2102 2324s1 Midterm Solutions',
    qnum: 'Q1a',
    type: 'floating_point',
    topic: 'Which numbers are exactly representable in IEEE single precision?',
    question: 'Which of the following real numbers can be represented exactly in the IEEE single precision (8 exponent bits, 23 mantissa bits) format?\n\n1/2,   1/3,   π,   5.2',
    solution: 'Only 1/2 is exactly representable.\n\n- 1/2 = 0.1 in binary = 1.0 × 2^−1. Exactly representable.\n- 1/3 = 0.010101...₂ (repeating). Not exactly representable.\n- π = 3.14159... has an infinite, non-repeating binary expansion. Not exactly representable.\n- 5.2 = 101.001100110011...₂ (repeating). Not exactly representable.',
    guide: '**A number is exactly representable in binary floating point if and only if it can be written as m × 2^e where m is an integer with |m| < 2^p (p = precision) and e is an integer.**\n\n**Equivalently:** the number\'s binary representation terminates (no infinite repeating pattern).\n\n**Rule:** A fraction p/q in lowest terms is exactly representable in binary iff q is a power of 2.\n- 1/2 = 1/2^1 ✓\n- 1/3: denominator 3 is not a power of 2 ✗\n- 5.2 = 26/5: denominator 5 is not a power of 2 ✗\n- π: irrational ✗',
    difficulty: 'medium',
    tags: ['exact-representation', 'binary', 'single-precision'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// THEORY / TRUE-FALSE / SHORT ANSWER
// ─────────────────────────────────────────────────────────────────────────────

const theoryQuestions: BankQuestion[] = [
  {
    id: 'th-1',
    source: 'DSA2102 2223s2 Midterm',
    qnum: 'Q1d',
    type: 'theory_mcq',
    topic: 'T/F: Zero diagonal implies singular',
    question: 'True or False: If a matrix has a zero entry on its main diagonal, then it is necessarily singular.',
    solution: 'FALSE. A matrix can have a zero diagonal entry and still be nonsingular. Example: A = [[0, 1], [1, 0]] has zeros on the diagonal but det(A) = −1 ≠ 0, so it is nonsingular.',
    guide: '**Key concept:** Singularity is determined by the determinant, not individual diagonal entries.\n\n**Counterexample strategy:** Think of a permutation matrix. The identity matrix with rows swapped has zeros on the diagonal but is still orthogonal (and nonsingular).\n\n**What IS true:** If a matrix is in upper/lower triangular form, then a zero diagonal entry does imply singularity (since det = product of diagonal entries).',
    difficulty: 'medium',
    tags: ['true-false', 'singular', 'diagonal'],
  },
  {
    id: 'th-2',
    source: 'DSA2102 2223s2 Midterm',
    qnum: 'Q1g',
    type: 'theory_mcq',
    topic: 'T/F: Product of orthogonal matrices',
    question: 'True or False: The product of two orthogonal matrices (assuming compatible dimensions) is orthogonal.',
    solution: 'TRUE. If Q₁ᵀQ₁ = I and Q₂ᵀQ₂ = I, then (Q₁Q₂)ᵀ(Q₁Q₂) = Q₂ᵀQ₁ᵀQ₁Q₂ = Q₂ᵀIQ₂ = Q₂ᵀQ₂ = I.',
    guide: '**Proof:** Let Q₁, Q₂ be orthogonal (Qᵀ = Q⁻¹). Then:\n(Q₁Q₂)ᵀ = Q₂ᵀQ₁ᵀ = Q₂⁻¹Q₁⁻¹ = (Q₁Q₂)⁻¹\n\nSo Q₁Q₂ is also orthogonal. ✓\n\n**Intuition:** Orthogonal matrices represent rotations/reflections. Composing two rotations gives another rotation.',
    difficulty: 'medium',
    tags: ['true-false', 'orthogonal', 'product'],
  },
  {
    id: 'th-3',
    source: 'DSA2102 2425s2 Midterm Solutions',
    qnum: 'Q1c',
    type: 'theory_mcq',
    topic: 'T/F: Solutions to nonsingular system depend on b',
    question: 'True or False: The number of solutions to a nonsingular square system Ax = b depends on b.',
    solution: 'FALSE. If A is square and nonsingular (invertible), then Ax = b has exactly one solution x = A⁻¹b for ANY right-hand side b. The number of solutions (exactly 1) does not depend on b.',
    guide: '**Key theorem:** For a square system Ax = b:\n- If A is nonsingular: unique solution x = A⁻¹b for all b\n- If A is singular: either 0 or infinitely many solutions (depends on b)\n\n**The question asks about nonsingular A**, so the answer is always exactly 1 solution regardless of b.',
    difficulty: 'easy',
    tags: ['true-false', 'nonsingular', 'solutions'],
  },
  {
    id: 'th-4',
    source: 'DSA2102 2425s2 Midterm Solutions',
    qnum: 'Q1e',
    type: 'theory_mcq',
    topic: 'T/F: Zero residual implies unique least squares solution',
    question: 'True or False: In solving a linear least squares problem, if the residual vector r = b − Ax is 0, then the solution must be unique.',
    solution: 'FALSE. If r = 0, then Ax = b exactly (the system is consistent). But if the columns of A are linearly dependent, there are infinitely many x satisfying Ax = b (and hence infinitely many least squares solutions with zero residual).',
    guide: '**Key insight:** Uniqueness of the least squares solution depends on the rank of A, not on the residual.\n\n**Uniqueness condition:** The least squares solution is unique ⟺ A has full column rank (columns are linearly independent).\n\n**Example of non-unique with r=0:** A = [[1, 1], [1, 1]], b = [[2], [2]]. Then x = (1,1)ᵀ, (2,0)ᵀ, (0,2)ᵀ all give r = 0.',
    difficulty: 'medium',
    tags: ['true-false', 'least-squares', 'uniqueness', 'residual'],
  },
  {
    id: 'th-5',
    source: 'MA2213 2324s2 Midterm',
    qnum: 'Q1a',
    type: 'theory_mcq',
    topic: 'Condition number of 1: good or bad?',
    question: 'If a computational problem has a condition number of 1, is this good or bad? Why?',
    solution: 'A condition number of 1 is very good (the best possible). It means the problem is perfectly conditioned: the relative error in the output is at most equal to the relative error in the input. The inherent error of the problem is not amplified at all by the solution process.',
    guide: '**Condition number interpretation:**\n- κ = 1: perfectly conditioned (best case)\n- κ = 10^k: you lose approximately k digits of accuracy\n- κ → ∞: ill-conditioned (small input errors → large output errors)\n\n**For linear systems Ax = b:**\n- κ(A) = 1 means ‖δx‖/‖x‖ ≤ 1 × ‖δb‖/‖b‖\n- Orthogonal matrices have κ = 1 (this is why Householder/Givens are stable!)',
    difficulty: 'easy',
    tags: ['condition-number', 'well-conditioned', 'short-answer'],
  },
  {
    id: 'th-6',
    source: 'MA2213 2324s2 Midterm',
    qnum: 'Q1d–f',
    type: 'theory_mcq',
    topic: 'Best way to compute A⁻¹b, A⁻¹B, A⁻¹Bc',
    question: '(a) What is the best way to compute the product A⁻¹b, where A ∈ ℝⁿˣⁿ is invertible and b ∈ ℝⁿ?\n(b) What is the best way to compute the product A⁻¹B, where A ∈ ℝⁿˣⁿ is invertible and B ∈ ℝⁿˣⁿ?\n(c) What is the best way to compute the product A⁻¹Bc, where A ∈ ℝⁿˣⁿ is invertible, B ∈ ℝⁿˣⁿ and c ∈ ℝⁿ?',
    solution: '(a) Solve the linear system Ax = b (using LU factorization with pivoting). Never explicitly compute A⁻¹.\n(b) Solve the linear system AX = B (solve n separate systems Axᵢ = bᵢ for each column bᵢ of B). Use LU once, then n back-substitutions.\n(c) First compute d = Bc (matrix-vector multiply, O(n²)), then solve Ax = d (O(n²) with precomputed LU). Total: O(n²) after LU factorization.',
    guide: '**Golden rule:** NEVER compute A⁻¹ explicitly. It is:\n1. More expensive: O(n³) to compute A⁻¹, same as LU but with larger constant\n2. Less numerically stable: computing A⁻¹ introduces more rounding error\n\n**Instead:** Use LU factorization once (O(n³)), then each solve is O(n²).\n\n**For A⁻¹Bc:** Use associativity smartly:\n- A⁻¹(Bc): first compute Bc (O(n²)), then solve Ax = Bc (O(n²) with LU)\n- (A⁻¹B)c: first solve AX = B (n × O(n²) = O(n³)), then multiply Xc (O(n²)) — much worse!',
    difficulty: 'medium',
    tags: ['matrix-inverse', 'LU', 'efficiency', 'short-answer'],
  },
  {
    id: 'th-7',
    source: 'DSA2102 2526s1 Midterm Solutions',
    qnum: 'Q1a–e',
    type: 'theory_mcq',
    topic: 'Short answers: precision vs accuracy, GE complexity, least squares setup',
    question: 'Give brief answers to each:\n(a) What is the difference between precision and accuracy?\n(b) Which step of Gaussian Elimination (forward elimination or backward substitution) is more computationally expensive?\n(c) Given x data (x₁,...,xₙ) and y data (y₁,...,yₙ), how do we find the least-squares line of best fit?\n(d) Why is it better to use Householder reflections instead of Gram-Schmidt to compute QR?\n(e) Under what circumstances would it be better to use Givens rotations instead of Householder reflections?',
    solution: '(a) Precision refers to the number of significant bits a stored number has (how many digits are stored). Accuracy refers to how close the stored value is to the true value (how small the error is). A number can be precise but inaccurate (many bits stored, but wrong value).\n\n(b) Forward elimination is more expensive: O(n³). Backward substitution is O(n²).\n\n(c) Form the matrix A with two columns: a column of all 1s and a column of x data. Set up the overdetermined system A[c₀; c₁] ≈ y. Solve the normal equations AᵀAx = Aᵀy. The solution gives the intercept c₀ and slope c₁.\n\n(d) Gram-Schmidt has worse numerical error accumulation at each step. In floating point, the computed vectors may lose orthogonality. Householder reflections are orthogonal transformations and are backward stable.\n\n(e) Givens rotations are preferred for sparse or banded matrices, where applying a Householder reflection would destroy the sparsity structure. Givens zeros out one entry at a time, allowing more control.',
    guide: '**Precision vs Accuracy:**\n- Precision = how many significant bits/digits (format-dependent)\n- Accuracy = how close to the true value (depends on the computation)\n- High precision, low accuracy: many bits stored but catastrophic cancellation occurred\n\n**GE complexity:**\n- Forward elimination: ~2n³/3 operations (dominant term)\n- Back substitution: ~n² operations\n\n**Least squares line setup:**\n- Model: y = c₀ + c₁x\n- Matrix form: [1, x₁; 1, x₂; ...; 1, xₙ] × [c₀; c₁] ≈ [y₁; y₂; ...; yₙ]\n\n**Householder vs GS:** Householder is backward stable; GS accumulates errors.',
    difficulty: 'medium',
    tags: ['short-answer', 'precision', 'accuracy', 'GE', 'least-squares', 'QR'],
  },
  {
    id: 'th-8',
    source: 'DSA2102 2324s1 Midterm Solutions',
    qnum: 'Q1',
    type: 'theory_mcq',
    topic: 'Short answers: exact representation, GE vs LU, Cholesky speed, LS uniqueness',
    question: 'Give brief answers:\n(a) Which of 1/2, 1/3, π, 5.2 can be represented exactly in IEEE single precision?\n(b) What is the relationship between Gaussian elimination and the LU factorization?\n(c) How does the speed of the Cholesky algorithm compare to Gaussian elimination?\n(d) Under what circumstance is the least squares solution to an over-determined system unique?',
    solution: '(a) Only 1/2 is exactly representable (it equals 2^−1 in binary).\n(b) They are essentially the same algorithm. LU factorization additionally stores the multipliers used in elimination as the lower triangular factor L.\n(c) Cholesky is approximately twice as fast as Gaussian elimination: ~n³/3 operations vs ~2n³/3.\n(d) The least squares solution is unique if and only if the coefficient matrix A has full column rank (its columns are linearly independent).',
    guide: '**GE vs LU:** GE reduces A to U. LU stores the multipliers mᵢₖ = aᵢₖ/aₖₖ in the lower triangle as L. They perform identical arithmetic; LU just records the work.\n\n**Cholesky speed:** For SPD matrices, symmetry means we only need to work on the upper (or lower) triangle, halving the work: ~n³/3 vs ~2n³/3 for LU.\n\n**LS uniqueness:** Full column rank ⟺ AᵀA is invertible ⟺ unique solution x̂ = (AᵀA)⁻¹Aᵀb.',
    difficulty: 'medium',
    tags: ['short-answer', 'LU', 'Cholesky', 'least-squares', 'uniqueness'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPLEXITY QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────

const complexityQuestions: BankQuestion[] = [
  {
    id: 'cx-1',
    source: 'DSA2102 2526s1 Midterm Solutions',
    qnum: 'Q2a–e',
    type: 'complexity',
    topic: 'Big-O operation counts for matrix/vector operations',
    question: 'Using Big-O notation, determine how many arithmetic operations are required for each:\n(a) Multiply each entry in a vector of length n by a scalar.\n(b) Take the dot product of two vectors of length n.\n(c) Multiply two n×n matrices.\n(d) Multiply two n×n matrices where both are tri-diagonal.\n(e) Multiply two n×n matrices where both are upper-triangular.',
    solution: '(a) O(n) — one multiplication per entry.\n(b) O(n) — n multiplications + (n−1) additions.\n(c) O(n³) — for each of n² entries, compute a dot product of length n.\n(d) O(n) — each row of a tri-diagonal matrix has at most 3 non-zero entries, so each result entry requires O(1) work; n entries total.\n(e) O(n³) — even though both are upper triangular, in the worst case (e.g., the (1,n) entry) we still need O(n) work per entry, and there are O(n²) entries.',
    guide: '**Key operation counts to memorize:**\n\n| Operation | Cost |\n|---|---|\n| Scalar × vector (length n) | O(n) |\n| Dot product (length n) | O(n) |\n| Matrix × vector (n×n) | O(n²) |\n| Matrix × matrix (n×n dense) | O(n³) |\n| Forward/back substitution | O(n²) |\n| Gaussian elimination | O(n³) ≈ 2n³/3 |\n| LU factorization | O(n³) ≈ 2n³/3 |\n| Cholesky factorization | O(n³) ≈ n³/3 |\n| QR via Householder | O(mn²) for m×n |\n\n**Sparse/structured matrices:** Exploit zeros! Tri-diagonal: only 3n−2 non-zeros → O(n) for mat-vec, O(n) for mat-mat.',
    difficulty: 'medium',
    tags: ['Big-O', 'complexity', 'matrix', 'vector'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// GAUSSIAN ELIMINATION QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────

const gaussianEliminationQuestions: BankQuestion[] = [
  {
    id: 'ge-1',
    source: 'DSA2102 2223s2 Midterm',
    qnum: 'Q1e',
    type: 'gaussian_elimination',
    topic: 'T/F: Multipliers bounded by 1 in partial pivoting',
    question: 'True or False: The multipliers in Gaussian elimination with partial pivoting are bounded by 1 in magnitude.',
    solution: 'TRUE. With partial pivoting, at each step we choose the largest element in the current column as the pivot. The multiplier mᵢₖ = aᵢₖ/aₖₖ where |aₖₖ| ≥ |aᵢₖ| (since we chose the largest), so |mᵢₖ| ≤ 1.',
    guide: '**Partial pivoting:** At step k, swap rows so that the largest element in column k (from row k downward) becomes the pivot.\n\n**Multiplier:** mᵢₖ = aᵢₖ/aₖₖ for i > k.\n\n**With partial pivoting:** |aₖₖ| ≥ |aᵢₖ| for all i > k (by choice of pivot).\nTherefore |mᵢₖ| = |aᵢₖ|/|aₖₖ| ≤ 1. ✓\n\n**Why this matters:** Bounded multipliers prevent exponential growth of matrix entries during elimination, improving numerical stability.',
    difficulty: 'medium',
    tags: ['true-false', 'partial-pivoting', 'multipliers', 'stability'],
  },
  {
    id: 'ge-2',
    source: 'MA2213 2324s2 Midterm',
    qnum: 'Q1d–f',
    type: 'gaussian_elimination',
    topic: 'Best method to compute A⁻¹b (conceptual)',
    question: 'What is the best way to compute A⁻¹b (where A is invertible and b is a vector)?',
    solution: 'Solve the linear system Ax = b using Gaussian elimination (or LU factorization). Never explicitly compute A⁻¹ — it is both more expensive and less numerically stable.',
    guide: '**Why not compute A⁻¹?**\n1. Computing A⁻¹ costs the same as solving n systems (O(n³)) but with a larger constant\n2. Explicitly forming A⁻¹ introduces more rounding errors\n3. Multiplying A⁻¹b then introduces yet more rounding errors\n\n**Correct approach:** Factor A = LU (once, O(n³)), then solve Ly = b and Ux = y (each O(n²)).\n\n**If solving multiple systems Axᵢ = bᵢ:** Factor A = LU once, then solve each system in O(n²).',
    difficulty: 'easy',
    tags: ['matrix-inverse', 'LU', 'efficiency'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LU FACTORIZATION QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────

const luFactorizationQuestions: BankQuestion[] = [
  {
    id: 'lu-1',
    source: 'DSA2102 2324s1 Midterm Solutions',
    qnum: 'Q3',
    type: 'lu_factorization',
    topic: 'LU factorization + triangular solve (3×3)',
    question: 'Consider the matrix M = [[2, 1, 1], [4, 5, 2], [2, −2, 0]].\n\n(a) Compute the LU factorization of M.\n(b) Let b = (1, 2, 2)ᵀ. Solve Ly = b (forward substitution), then solve Ux = y (back substitution).\n(c) What is the solution to Mx = b?',
    solution: '(a) LU factorization:\n    Step 1: m₂₁ = 4/2 = 2, m₃₁ = 2/2 = 1\n    After eliminating column 1:\n    [[2, 1, 1], [0, 3, 0], [0, −3, −1]]\n    Step 2: m₃₂ = −3/3 = −1\n    After eliminating column 2:\n    [[2, 1, 1], [0, 3, 0], [0, 0, −1]]\n\n    L = [[1, 0, 0], [2, 1, 0], [1, −1, 1]]\n    U = [[2, 1, 1], [0, 3, 0], [0, 0, −1]]\n\n(b) Forward substitution Ly = b:\n    y₁ = 1\n    y₂ = 2 − 2(1) = 0\n    y₃ = 2 − 1(1) − (−1)(0) = 1\n    y = (1, 0, 1)ᵀ\n\n    Back substitution Ux = y:\n    x₃ = 1/(−1) = −1\n    x₂ = 0/3 = 0\n    x₁ = (1 − 1(0) − 1(−1))/2 = 2/2 = 1\n    x = (1, 0, −1)ᵀ\n\n(c) Solution: x = (1, 0, −1)ᵀ',
    guide: '**LU Factorization Algorithm:**\n\nFor each column k = 1 to n−1:\n1. Compute multipliers: mᵢₖ = aᵢₖ/aₖₖ for i = k+1,...,n\n2. Update rows: aᵢⱼ ← aᵢⱼ − mᵢₖ × aₖⱼ for j = k,...,n\n3. Store multipliers in L: Lᵢₖ = mᵢₖ\n\nResult: L has 1s on diagonal and multipliers below; U is the resulting upper triangular matrix.\n\n**Forward substitution (Ly = b):**\nyᵢ = (bᵢ − Σⱼ<ᵢ Lᵢⱼyⱼ) / Lᵢᵢ\n(Since Lᵢᵢ = 1, just subtract)\n\n**Back substitution (Ux = y):**\nxᵢ = (yᵢ − Σⱼ>ᵢ Uᵢⱼxⱼ) / Uᵢᵢ\n(Work from bottom to top)',
    difficulty: 'medium',
    tags: ['LU', 'triangular-solve', 'forward-substitution', 'back-substitution', 'numerical'],
  },
  {
    id: 'lu-2',
    source: 'DSA2102 2223s2 Midterm Solutions',
    qnum: 'Q3a',
    type: 'lu_factorization',
    topic: 'LU factorization (4×4 SPD matrix)',
    question: 'Consider the matrix A = [[4, −4, 4, 4], [−4, 5, −5, −2], [4, −5, 9, −4], [4, −2, −4, 18]]. Compute the LU factorization of A.',
    solution: 'Multipliers:\n  m₂₁ = −4/4 = −1, m₃₁ = 4/4 = 1, m₄₁ = 4/4 = 1\n\nAfter step 1:\n  [[4, −4, 4, 4], [0, 1, −1, 2], [0, −1, 5, −8], [0, 2, −8, 14]]\n\n  m₃₂ = −1/1 = −1, m₄₂ = 2/1 = 2\n\nAfter step 2:\n  [[4, −4, 4, 4], [0, 1, −1, 2], [0, 0, 4, −6], [0, 0, −6, 10]]\n\n  m₄₃ = −6/4 = −3/2\n\nAfter step 3:\n  [[4, −4, 4, 4], [0, 1, −1, 2], [0, 0, 4, −6], [0, 0, 0, 1]]\n\nL = [[1,0,0,0], [−1,1,0,0], [1,−1,1,0], [1,2,−3/2,1]]\nU = [[4,−4,4,4], [0,1,−1,2], [0,0,4,−6], [0,0,0,1]]',
    guide: '**4×4 LU — systematic approach:**\n\nStep 1 (eliminate column 1, rows 2–4):\n- Compute mᵢ₁ = aᵢ₁/a₁₁ for i = 2,3,4\n- Row i ← Row i − mᵢ₁ × Row 1\n\nStep 2 (eliminate column 2, rows 3–4):\n- Compute mᵢ₂ = aᵢ₂/a₂₂ for i = 3,4\n- Row i ← Row i − mᵢ₂ × Row 2\n\nStep 3 (eliminate column 3, row 4):\n- Compute m₄₃ = a₄₃/a₃₃\n- Row 4 ← Row 4 − m₄₃ × Row 3\n\n**Collect L:** L has 1s on diagonal and multipliers below diagonal.\n**U:** The resulting upper triangular matrix.\n\n**Tip:** Keep track of each multiplier carefully — they go directly into L.',
    difficulty: 'medium',
    tags: ['LU', '4x4', 'numerical'],
  },
  {
    id: 'lu-3',
    source: 'DSA2102 2526s1 Midterm Solutions',
    qnum: 'Q4a–b',
    type: 'lu_factorization',
    topic: 'LU factorization + LDR factorization (4×4)',
    question: 'Consider the matrix A = [[2, 1, 1, 1], [4, 0, 0, 3], [6, 5, 8, 1], [8, 8, 14, 1]].\n\n(a) Compute the LU factorization of A.\n(b) Find a diagonal matrix D so that A = LDR, where L is lower-triangular with all diagonal entries equal to 1 and R is upper-triangular with all diagonal entries equal to 1.',
    solution: '(a) Multipliers:\n  m₂₁ = 4/2 = 2, m₃₁ = 6/2 = 3, m₄₁ = 8/2 = 4\n\nAfter step 1: [[2,1,1,1], [0,−2,−2,1], [0,2,5,−2], [0,4,10,−3]]\n\n  m₃₂ = 2/(−2) = −1, m₄₂ = 4/(−2) = −2\n\nAfter step 2: [[2,1,1,1], [0,−2,−2,1], [0,0,3,−1], [0,0,6,−1]]\n\n  m₄₃ = 6/3 = 2\n\nAfter step 3: [[2,1,1,1], [0,−2,−2,1], [0,0,3,−1], [0,0,0,1]]\n\nL = [[1,0,0,0], [2,1,0,0], [3,−1,1,0], [4,−2,2,1]]\nU = [[2,1,1,1], [0,−2,−2,1], [0,0,3,−1], [0,0,0,1]]\n\n(b) LDR: Extract diagonal of U into D, then normalize rows of U:\n  D = diag(2, −2, 3, 1)\n  R = D⁻¹U = [[1, 1/2, 1/2, 1/2], [0, 1, 1, −1/2], [0, 0, 1, −1/3], [0, 0, 0, 1]]',
    guide: '**LU factorization:** Standard algorithm (see lu-1 guide).\n\n**LDR factorization from LU:**\n- Given A = LU where L has 1s on diagonal\n- Extract diagonal: D = diag(U₁₁, U₂₂, ..., Uₙₙ)\n- Define R = D⁻¹U (divide each row i of U by Uᵢᵢ)\n- Then U = DR, so A = L(DR) = LDR\n- R has 1s on diagonal by construction\n\n**Check:** L has 1s on diagonal ✓, D is diagonal ✓, R has 1s on diagonal ✓\n\n**Relationship to Cholesky:** If A is SPD, then D has all positive diagonal entries, and we can write A = LDLᵀ (since R = Lᵀ for SPD matrices).',
    difficulty: 'hard',
    tags: ['LU', 'LDR', '4x4', 'numerical'],
  },
  {
    id: 'lu-4',
    source: 'MA2213 2324s2 Midterm',
    qnum: 'Q3a',
    type: 'lu_factorization',
    topic: 'LU factorization (3×3 SPD)',
    question: 'Consider the matrix A = [[4, −2, 4], [−2, 2, −4], [4, −4, 17]]. Compute the LU factorization of A.',
    solution: 'Step 1: m₂₁ = −2/4 = −1/2, m₃₁ = 4/4 = 1\n  Row 2 ← Row 2 − (−1/2) × Row 1: [0, 1, −2]\n  Row 3 ← Row 3 − 1 × Row 1: [0, −2, 13]\n\nStep 2: m₃₂ = −2/1 = −2\n  Row 3 ← Row 3 − (−2) × Row 2: [0, 0, 9]\n\nL = [[1, 0, 0], [−1/2, 1, 0], [1, −2, 1]]\nU = [[4, −2, 4], [0, 1, −2], [0, 0, 9]]',
    guide: '**3×3 LU — step by step:**\n\nStep 1: Use a₁₁ = 4 as pivot.\n- m₂₁ = a₂₁/a₁₁ = −2/4 = −1/2\n- m₃₁ = a₃₁/a₁₁ = 4/4 = 1\n- Update rows 2 and 3\n\nStep 2: Use updated a₂₂ as pivot.\n- m₃₂ = a₃₂/a₂₂\n- Update row 3\n\n**Verification:** Multiply L × U and check you get A back.',
    difficulty: 'medium',
    tags: ['LU', '3x3', 'numerical'],
  },
  {
    id: 'lu-5',
    source: 'DSA2102 2425s2 Midterm Solutions',
    qnum: 'Q3a',
    type: 'lu_factorization',
    topic: 'LU factorization (3×3)',
    question: 'Consider the matrix A = [[2, 2, 3], [2, 5, 3], [3, 3, 8]]. Compute the LU factorization of A.',
    solution: 'Step 1: m₂₁ = 2/2 = 1, m₃₁ = 3/2\n  Row 2 ← Row 2 − 1 × Row 1: [0, 3, 0]\n  Row 3 ← Row 3 − (3/2) × Row 1: [0, 0, 7/2]\n\nStep 2: m₃₂ = 0/3 = 0\n  Row 3 unchanged: [0, 0, 7/2]\n\nL = [[1, 0, 0], [1, 1, 0], [3/2, 0, 1]]\nU = [[2, 2, 3], [0, 3, 0], [0, 0, 7/2]]',
    guide: 'Same approach as lu-1 guide. Note that when m₃₂ = 0, row 3 is unchanged in step 2 — no work needed. This happens when the (3,2) entry is already 0 after step 1.',
    difficulty: 'medium',
    tags: ['LU', '3x3', 'numerical'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CHOLESKY FACTORIZATION QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────

const choleskyQuestions: BankQuestion[] = [
  {
    id: 'ch-1',
    source: 'DSA2102 2223s2 Midterm Solutions',
    qnum: 'Q3b',
    type: 'cholesky',
    topic: 'Cholesky factorization (4×4 SPD)',
    question: 'Consider the matrix A = [[4, −4, 4, 4], [−4, 5, −5, −2], [4, −5, 9, −4], [4, −2, −4, 18]]. Compute the Cholesky factorization A = LLᵀ (lower triangular L with positive diagonal).',
    solution: 'Column 1: L₁₁ = √4 = 2; L₂₁ = −4/2 = −2; L₃₁ = 4/2 = 2; L₄₁ = 4/2 = 2\n\nColumn 2: L₂₂ = √(5 − (−2)²) = √(5−4) = 1\n  L₃₂ = (−5 − 2×(−2))/1 = (−5+4)/1 = −1\n  L₄₂ = (−2 − 2×(−2))/1 = (−2+4)/1 = 2\n\nColumn 3: L₃₃ = √(9 − 2² − (−1)²) = √(9−4−1) = √4 = 2\n  L₄₃ = (−4 − 2×2 − 2×(−1))/2 = (−4−4+2)/2 = −6/2 = −3\n\nColumn 4: L₄₄ = √(18 − 2² − 2² − (−3)²) = √(18−4−4−9) = √1 = 1\n\nL = [[2,0,0,0], [−2,1,0,0], [2,−1,2,0], [2,2,−3,1]]',
    guide: '**Cholesky Algorithm (column by column):**\n\nFor j = 1 to n:\n1. Compute diagonal: Lⱼⱼ = √(Aⱼⱼ − Σₖ<ⱼ L²ⱼₖ)\n2. Compute column below diagonal: Lᵢⱼ = (Aᵢⱼ − Σₖ<ⱼ LᵢₖLⱼₖ) / Lⱼⱼ for i > j\n\n**Key checks:**\n- If Aⱼⱼ − Σₖ<ⱼ L²ⱼₖ < 0, the matrix is NOT positive definite\n- Lⱼⱼ must always be positive (take positive square root)\n\n**Relationship to LU:** For SPD matrices, Cholesky L = lower triangular factor of LU × √D (from LDLᵀ).\n\n**Verification:** Compute LLᵀ and check it equals A.',
    difficulty: 'medium',
    tags: ['Cholesky', '4x4', 'SPD', 'numerical'],
  },
  {
    id: 'ch-2',
    source: 'MA2213 2324s2 Midterm',
    qnum: 'Q3b',
    type: 'cholesky',
    topic: 'Cholesky factorization (3×3)',
    question: 'Consider the matrix A = [[4, −2, 4], [−2, 2, −4], [4, −4, 17]]. Compute the Cholesky factorization A = CCᵀ.',
    solution: 'Column 1: C₁₁ = √4 = 2; C₂₁ = −2/2 = −1; C₃₁ = 4/2 = 2\n\nColumn 2: C₂₂ = √(2 − (−1)²) = √(2−1) = 1\n  C₃₂ = (−4 − 2×(−1))/1 = (−4+2)/1 = −2\n\nColumn 3: C₃₃ = √(17 − 2² − (−2)²) = √(17−4−4) = √9 = 3\n\nC = [[2, 0, 0], [−1, 1, 0], [2, −2, 3]]',
    guide: 'Same algorithm as ch-1 guide. For 3×3:\n- Column 1: C₁₁ = √A₁₁; Cᵢ₁ = Aᵢ₁/C₁₁ for i > 1\n- Column 2: C₂₂ = √(A₂₂ − C²₂₁); Cᵢ₂ = (Aᵢ₂ − Cᵢ₁C₂₁)/C₂₂ for i > 2\n- Column 3: C₃₃ = √(A₃₃ − C²₃₁ − C²₃₂)',
    difficulty: 'medium',
    tags: ['Cholesky', '3x3', 'SPD', 'numerical'],
  },
  {
    id: 'ch-3',
    source: 'DSA2102 2425s2 Midterm Solutions',
    qnum: 'Q3b',
    type: 'cholesky',
    topic: 'Cholesky factorization (3×3)',
    question: 'Consider the matrix A = [[2, 2, 3], [2, 5, 3], [3, 3, 8]]. Compute the Cholesky factorization of A.',
    solution: 'Column 1: L₁₁ = √2; L₂₁ = 2/√2 = √2; L₃₁ = 3/√2\n\nColumn 2: L₂₂ = √(5 − (√2)²) = √(5−2) = √3\n  L₃₂ = (3 − (3/√2)(√2))/√3 = (3−3)/√3 = 0\n\nColumn 3: L₃₃ = √(8 − (3/√2)² − 0²) = √(8 − 9/2) = √(7/2)\n\nL = [[√2, 0, 0], [√2, √3, 0], [3/√2, 0, √(7/2)]]',
    guide: 'Same Cholesky algorithm. Note that when L₃₂ = 0, the matrix has a nice structure. This happens because the (3,2) entry of A minus the dot product of the first parts of rows 3 and 2 is zero.',
    difficulty: 'medium',
    tags: ['Cholesky', '3x3', 'SPD', 'numerical'],
  },
  {
    id: 'ch-4',
    source: 'DSA2102 2526s1 Midterm Solutions',
    qnum: 'Q5b–c',
    type: 'cholesky',
    topic: 'Cholesky of BᵀB and its relationship to QR of B',
    question: 'Consider the matrix B = [[1, 2, 1], [0, 1, 1], [1, 0, 2], [0, 0, √2]].\n\n(a) Compute M = BᵀB, then compute the Cholesky factorization of M.\n(b) What relationship, if any, holds between the QR factors of B and the Cholesky factors of M?',
    solution: '(a) M = BᵀB:\n  M₁₁ = 1+0+1+0 = 2, M₁₂ = 2+0+0+0 = 2, M₁₃ = 1+0+2+0 = 3\n  M₂₂ = 4+1+0+0 = 5, M₂₃ = 2+1+0+0 = 3, M₃₃ = 1+1+4+2 = 8\n  M = [[2,2,3], [2,5,3], [3,3,8]]\n\n  Cholesky of M: L = [[√2, 0, 0], [√2, √3, 0], [3/√2, 0, √(7/2)]]\n  (Same as ch-3 above)\n\n(b) The R factor of B = QR equals the upper-triangular Cholesky factor Rᶜ of M = BᵀB (where M = RᶜᵀRᶜ).\n  This is because: BᵀB = (QR)ᵀ(QR) = RᵀQᵀQR = RᵀR (since QᵀQ = I).',
    guide: '**Key relationship: QR and Cholesky**\n\nIf B = QR (thin QR), then:\nBᵀB = (QR)ᵀ(QR) = RᵀQᵀQR = RᵀIR = RᵀR\n\nThis is exactly the Cholesky factorization of BᵀB = RᵀR!\n\n**Conclusion:** The R factor from QR of B equals the upper-triangular Cholesky factor of BᵀB.\n\n**Why this matters:** Solving the normal equations AᵀAx = Aᵀb via Cholesky is equivalent to solving via QR — but QR is more numerically stable (avoids squaring the condition number).',
    difficulty: 'hard',
    tags: ['Cholesky', 'QR', 'relationship', 'BᵀB'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CONDITIONING OF LINEAR SYSTEMS
// ─────────────────────────────────────────────────────────────────────────────

const conditioningQuestions: BankQuestion[] = [
  {
    id: 'cond-1',
    source: 'DSA2102 2425s2 Midterm Solutions',
    qnum: 'Q1c–d',
    type: 'conditioning_linear',
    topic: 'T/F: Nonsingular system solutions; norm of singular matrix',
    question: '(a) True or False: The number of solutions to a nonsingular square system Ax = b depends on b.\n(b) True or False: The norm of a singular matrix is 0.',
    solution: '(a) FALSE. If A is nonsingular, there is exactly one solution x = A⁻¹b for any b. The number of solutions (always 1) does not depend on b.\n\n(b) FALSE. Only the zero matrix has norm 0. A singular matrix can have a large norm — it just has a zero smallest singular value (σ_min = 0), making its condition number infinite.',
    guide: '(a) **Nonsingular = invertible = unique solution for any b.**\n\n(b) **Matrix norm ≠ determinant.**\n- ‖A‖₂ = σ_max (largest singular value)\n- A singular matrix has σ_min = 0, but σ_max can be anything\n- Example: A = [[1000, 0], [0, 0]] is singular but ‖A‖₂ = 1000\n- Only the zero matrix has all singular values = 0, hence ‖0‖ = 0',
    difficulty: 'easy',
    tags: ['true-false', 'singular', 'norm', 'condition-number'],
  },
  {
    id: 'cond-2',
    source: 'MA2213 2324s2 Midterm',
    qnum: 'Q1g',
    type: 'conditioning_linear',
    topic: 'Can a positive definite matrix be singular?',
    question: 'Can an n×n positive definite matrix be singular? What about an n×n symmetric positive definite matrix?',
    solution: 'No, in both cases. A positive definite matrix has all positive eigenvalues (by definition), so its determinant (= product of eigenvalues) is positive and nonzero, making it nonsingular. The same holds for symmetric positive definite matrices.',
    guide: '**Positive definite:** xᵀAx > 0 for all x ≠ 0.\n\n**Key implication:** If A is positive definite, then all eigenvalues λᵢ > 0.\n- det(A) = Πλᵢ > 0 (product of positive numbers)\n- Therefore A is nonsingular (det ≠ 0)\n\n**Condition number of SPD:** κ(A) = λ_max/λ_min (ratio of largest to smallest eigenvalue).\nSince all eigenvalues > 0, κ(A) is finite (well-conditioned if eigenvalues are similar in magnitude).',
    difficulty: 'medium',
    tags: ['SPD', 'singular', 'eigenvalues', 'short-answer'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LEAST SQUARES QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────

const leastSquaresQuestions: BankQuestion[] = [
  {
    id: 'ls-1',
    source: 'DSA2102 2223s2 Midterm Solutions',
    qnum: 'Q4a',
    type: 'least_squares',
    topic: 'Least squares line of best fit via normal equations and QR',
    question: 'Consider the data: x = [−2, −1, 2, 3], y = [2, 1, 4, 7].\n\n(a) Find the least squares solution to Ax = b where A = [[1,−2],[1,−1],[1,2],[1,3]] and b = [2,1,4,7]ᵀ.\n(b) Solve via normal equations AᵀAx = Aᵀb.\n(c) What is the interpretation of the solution in the data science context?',
    solution: '(a) & (b) Normal equations:\n  AᵀA = [[4, 2], [2, 18]]\n  Aᵀb = [[14], [24]]\n\n  Solving: [[4,2],[2,18]] × [x₁,x₂]ᵀ = [14,24]ᵀ\n  From row 1: 4x₁ + 2x₂ = 14 → 2x₁ + x₂ = 7\n  From row 2: 2x₁ + 18x₂ = 24 → x₁ + 9x₂ = 12\n  Subtract: 8x₂ = 5 → x₂ = 5/8... \n  \n  Actually: det(AᵀA) = 4×18 − 2×2 = 68\n  x₁ = (18×14 − 2×24)/68 = (252−48)/68 = 204/68 = 3\n  x₂ = (4×24 − 2×14)/68 = (96−28)/68 = 68/68 = 1\n\n  Solution: x₁ = 3, x₂ = 1\n\n(c) The solution x₁ = 3 (intercept) and x₂ = 1 (slope) gives the line of best fit: y = 3 + x.',
    guide: '**Setting up the least squares problem:**\n\nFor a line y = c₀ + c₁x, form:\nA = [[1, x₁], [1, x₂], ..., [1, xₙ]], b = [y₁, y₂, ..., yₙ]ᵀ\n\n**Normal equations method:**\n1. Compute AᵀA (2×2 matrix) and Aᵀb (2×1 vector)\n2. Solve the 2×2 system (AᵀA)x̂ = Aᵀb\n3. Use Cramer\'s rule or Gaussian elimination\n\n**Key formulas for 2×2 system:**\nAᵀA = [[n, Σxᵢ], [Σxᵢ, Σxᵢ²]]\nAᵀb = [[Σyᵢ], [Σxᵢyᵢ]]\n\n**Interpretation:** x̂ = [c₀, c₁]ᵀ where c₀ = intercept, c₁ = slope of best-fit line.',
    difficulty: 'medium',
    tags: ['least-squares', 'normal-equations', 'line-of-best-fit', 'numerical'],
  },
  {
    id: 'ls-2',
    source: 'DSA2102 2223s2 Midterm Solutions',
    qnum: 'Q4b–c',
    type: 'least_squares',
    topic: 'Least squares quadratic fit (polynomial regression)',
    question: 'Consider the same data: x = [−2, −1, 2, 3], y = [2, 1, 4, 7].\n\nNow set up and solve the least squares problem for a quadratic fit y = c₀ + c₁x + c₂x².\n\nWhat is the interpretation in the data science context?',
    solution: 'Matrix A for quadratic fit:\nA = [[1, −2, 4], [1, −1, 1], [1, 2, 4], [1, 3, 9]]\n\nNormal equations: AᵀA × [x₁,x₂,x₃]ᵀ = Aᵀb\nAᵀA = [[4, 2, 18], [2, 18, 26], [18, 26, 114]]\nAᵀb = [[14], [24], [88]]\n\nSolution: x₁ = 1, x₂ = 1/2, x₃ = 1/2\n\nBest-fit quadratic: y = 1 + (1/2)x + (1/2)x²\n\nInterpretation: This is the parabola/quadratic of best fit to the data.',
    guide: '**Polynomial regression setup:**\n\nFor degree-d polynomial y = c₀ + c₁x + ... + cₐxᵈ, form the Vandermonde matrix:\nA = [[1, x₁, x₁², ..., x₁ᵈ], [1, x₂, x₂², ..., x₂ᵈ], ..., [1, xₙ, xₙ², ..., xₙᵈ]]\n\n**Key insight:** Adding more polynomial terms = adding more columns to A. The least squares framework handles this automatically.\n\n**Comparison with linear fit:**\n- Linear: A has 2 columns (1 and x)\n- Quadratic: A has 3 columns (1, x, x²)\n- Same normal equations approach, just larger AᵀA matrix',
    difficulty: 'medium',
    tags: ['least-squares', 'polynomial-regression', 'quadratic', 'numerical'],
  },
  {
    id: 'ls-3',
    source: 'MA2213 2324s2 Midterm',
    qnum: 'Q4a–c',
    type: 'least_squares',
    topic: 'Least squares line, quadratic, cubic fits',
    question: 'Consider the data points (−2, 4), (−1, 1), (1, 1), (2, 4).\n\n(a) Find the least-squares line of best fit.\n(b) Find the least-squares quadratic polynomial of best fit.\n(c) Find the least-squares cubic polynomial of best fit.',
    solution: '(a) Line y = c₀ + c₁x:\n  A = [[1,−2],[1,−1],[1,1],[1,2]], b = [4,1,1,4]ᵀ\n  AᵀA = [[4,0],[0,10]], Aᵀb = [[10],[0]]\n  Solution: c₀ = 10/4 = 2.5, c₁ = 0\n  Best-fit line: y = 2.5\n\n(b) Quadratic y = c₀ + c₁x + c₂x²:\n  A = [[1,−2,4],[1,−1,1],[1,1,1],[1,2,4]], b = [4,1,1,4]ᵀ\n  Note the data is symmetric: y = x² fits perfectly!\n  Solution: c₀ = 0, c₁ = 0, c₂ = 1\n  Best-fit quadratic: y = x²\n\n(c) Cubic y = c₀ + c₁x + c₂x² + c₃x³:\n  The data has only 4 points and we have 4 parameters, so the cubic passes through all points exactly.\n  Solution: y = x² (same as quadratic — the cubic term c₃ = 0 since data is symmetric)',
    guide: '**Symmetric data insight:**\n- Data (−2,4),(−1,1),(1,1),(2,4) is symmetric about x=0 (even function)\n- Odd powers of x (x, x³) will have coefficient 0 in the best fit\n- AᵀA becomes block diagonal when data is symmetric\n\n**Line fit:** When c₁ = 0, the best-fit line is horizontal (y = constant = mean of y values)\n\n**Quadratic fit:** y = x² passes through all 4 points exactly (residual = 0)\n\n**Cubic fit:** With 4 data points and 4 parameters, the system is exactly determined. The cubic term is 0 by symmetry.',
    difficulty: 'medium',
    tags: ['least-squares', 'polynomial', 'symmetric-data', 'numerical'],
  },
  {
    id: 'ls-4',
    source: 'DSA2102 2324s1 Midterm Solutions',
    qnum: 'Q4',
    type: 'least_squares',
    topic: 'Least squares via normal equations and QR (4×2 system)',
    question: 'Consider the overdetermined system:\n[[1,2],[1,1],[2,1],[2,2]] × [x,y]ᵀ = [3,3,3,2]ᵀ\n\n(a) Find the least squares solution by solving the normal equations.\n(b) Find the least squares solution by factoring A = QR.',
    solution: '(a) Normal equations:\n  AᵀA = [[1+1+4+4, 2+1+2+4], [2+1+2+4, 4+1+1+4]] = [[10, 9], [9, 10]]\n  Aᵀb = [[3+3+6+4], [6+3+3+4]] = [[16], [16]]\n\n  Solve [[10,9],[9,10]] × [x,y]ᵀ = [16,16]ᵀ:\n  det = 100−81 = 19\n  x = (10×16 − 9×16)/19 = 16(10−9)/19 = 16/19\n  y = (10×16 − 9×16)/19 = 16/19\n  Solution: x = y = 16/19 ≈ 0.8421\n\n(b) QR factorization:\n  q₁ = (1,1,2,2)ᵀ/‖(1,1,2,2)‖ = (1,1,2,2)ᵀ/√10\n  p₂ = (2,1,1,2)ᵀ − [(2,1,1,2)·q₁]q₁ = (2,1,1,2)ᵀ − (9/10)(1,1,2,2)ᵀ = (11/10, 1/10, −8/10, 2/10)ᵀ\n  q₂ = p₂/‖p₂‖ = (11,1,−8,2)ᵀ/√190\n\n  R = [[√10, 9/√10], [0, √190/10]]\n  Qᵀb = [16/√10, 16/√190]\n  Solve Rx̂ = Qᵀb: x = y = 16/19',
    guide: '**Normal equations approach:**\n1. Compute AᵀA (n×n) and Aᵀb (n×1)\n2. Solve (AᵀA)x̂ = Aᵀb using Gaussian elimination or Cholesky\n\n**QR approach:**\n1. Apply Gram-Schmidt to columns of A to get Q̂ and R̂ (thin QR)\n2. Compute c = Q̂ᵀb\n3. Solve R̂x̂ = c by back substitution\n\n**Why QR is better:** Normal equations square the condition number (κ(AᵀA) = κ(A)²). QR maintains κ(A).\n\n**Gram-Schmidt reminder:**\n- q₁ = a₁/‖a₁‖\n- p₂ = a₂ − (a₂·q₁)q₁, then q₂ = p₂/‖p₂‖\n- R₁₁ = ‖a₁‖, R₁₂ = a₂·q₁, R₂₂ = ‖p₂‖',
    difficulty: 'hard',
    tags: ['least-squares', 'normal-equations', 'QR', 'Gram-Schmidt', 'numerical'],
  },
  {
    id: 'ls-5',
    source: 'DSA2102 2223s2 Midterm',
    qnum: 'Q1f',
    type: 'least_squares',
    topic: 'T/F: Least squares always has a solution',
    question: 'True or False: A linear least squares problem always has a solution.',
    solution: 'TRUE. The least squares problem min‖Ax − b‖₂ always has at least one solution. The normal equations AᵀAx = Aᵀb always have a solution (AᵀA is always symmetric positive semi-definite, so the normal equations are consistent). The solution is unique if and only if A has full column rank.',
    guide: '**Existence:** The projection of b onto the column space of A always exists (by the projection theorem in Hilbert spaces). So there is always an x minimizing ‖Ax − b‖₂.\n\n**Uniqueness:** The solution is unique iff A has full column rank (rank n). If rank(A) < n, there are infinitely many solutions (any x + null(A) is also a solution).\n\n**Contrast with Ax = b:** A square system Ax = b may have no solution (if b ∉ col(A)). But the least squares problem always has a solution because we are minimizing, not requiring equality.',
    difficulty: 'medium',
    tags: ['true-false', 'existence', 'uniqueness', 'least-squares'],
  },
  {
    id: 'ls-6',
    source: 'MA2213 2324s2 Midterm',
    qnum: 'Q1h',
    type: 'least_squares',
    topic: 'Sufficient condition for unique least squares solution',
    question: 'Give a sufficient condition for there to be a unique solution to a least squares problem.',
    solution: 'The least squares solution is unique if A has full column rank (the columns of A are linearly independent). Equivalently, AᵀA is invertible (positive definite), giving x̂ = (AᵀA)⁻¹Aᵀb.',
    guide: '**Uniqueness conditions:**\n- A has full column rank (rank = n, where A is m×n)\n- AᵀA is invertible (positive definite)\n- The null space of A is trivial: Ax = 0 ⟹ x = 0\n- The columns of A are linearly independent\n\n**All four conditions are equivalent.**\n\n**When uniqueness fails:** If columns are dependent, there exist infinitely many x with the same Ax, hence the same residual. The minimum-norm solution can be found using the pseudoinverse A⁺.',
    difficulty: 'medium',
    tags: ['least-squares', 'uniqueness', 'full-rank', 'short-answer'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// QR FACTORIZATION QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────

const qrFactorizationQuestions: BankQuestion[] = [
  {
    id: 'qr-1',
    source: 'DSA2102 2223s2 Midterm',
    qnum: 'Q1h',
    type: 'qr_factorization',
    topic: 'T/F: Classical vs Modified Gram-Schmidt equivalence',
    question: 'True or False: In exact real arithmetic, the Classical Gram-Schmidt and Modified Gram-Schmidt algorithms produce the same result.',
    solution: 'TRUE. In exact arithmetic (no rounding errors), Classical GS and Modified GS are mathematically equivalent — they compute the same QR factorization. The difference only manifests in floating point arithmetic, where Modified GS is more numerically stable.',
    guide: '**Classical GS:** For each new vector aⱼ, subtract projections onto ALL previously computed q₁,...,qⱼ₋₁ simultaneously:\npⱼ = aⱼ − (aⱼ·q₁)q₁ − (aⱼ·q₂)q₂ − ... − (aⱼ·qⱼ₋₁)qⱼ₋₁\n\n**Modified GS:** Subtract projections one at a time, updating the vector after each:\npⱼ⁽¹⁾ = aⱼ − (aⱼ·q₁)q₁\npⱼ⁽²⁾ = pⱼ⁽¹⁾ − (pⱼ⁽¹⁾·q₂)q₂\n...\n\n**In exact arithmetic:** Both give the same result (subtraction is associative in exact arithmetic).\n**In floating point:** Modified GS maintains better orthogonality because each projection uses the most recently updated vector.',
    difficulty: 'medium',
    tags: ['true-false', 'Gram-Schmidt', 'classical', 'modified', 'stability'],
  },
  {
    id: 'qr-2',
    source: 'MA2213 2324s2 Midterm',
    qnum: 'Q3c',
    type: 'qr_factorization',
    topic: 'QR factorization via Gram-Schmidt (3×3)',
    question: 'Consider the matrix A = [[4, −2, 4], [−2, 2, −4], [4, −4, 17]]. Compute the QR factorization of A using Gram-Schmidt.',
    solution: 'Column 1: a₁ = (4, −2, 4)ᵀ\n  ‖a₁‖ = √(16+4+16) = √36 = 6\n  q₁ = (4,−2,4)ᵀ/6 = (2/3, −1/3, 2/3)ᵀ\n  R₁₁ = 6\n\nColumn 2: a₂ = (−2, 2, −4)ᵀ\n  R₁₂ = a₂·q₁ = (−2)(2/3) + (2)(−1/3) + (−4)(2/3) = −4/3 − 2/3 − 8/3 = −14/3\n  p₂ = a₂ − R₁₂q₁ = (−2,2,−4)ᵀ − (−14/3)(2/3,−1/3,2/3)ᵀ\n     = (−2,2,−4)ᵀ + (28/9, −14/9, 28/9)ᵀ = (10/9, 4/9, −8/9)ᵀ\n  ‖p₂‖ = √(100+16+64)/9 = √180/9 = 6√5/9 = 2√5/3\n  q₂ = (10/9, 4/9, −8/9)ᵀ / (2√5/3) = (5, 2, −4)ᵀ / (3√5)\n  R₂₂ = 2√5/3\n\nColumn 3: a₃ = (4, −4, 17)ᵀ\n  R₁₃ = a₃·q₁ = (4)(2/3)+(−4)(−1/3)+(17)(2/3) = 8/3+4/3+34/3 = 46/3\n  R₂₃ = a₃·q₂ = ... (compute similarly)\n  p₃ = a₃ − R₁₃q₁ − R₂₃q₂\n  R₃₃ = ‖p₃‖, q₃ = p₃/R₃₃\n\n[Full numerical values: Q ≈ [[−0.667, −0.745, 0], [0.333, −0.298, 0.894], [−0.667, 0.596, 0.447]], R ≈ [[−6, 4.667, −15.333], [0, −1.491, 8.348], [0, 0, 4.025]]]',
    guide: '**Gram-Schmidt QR Algorithm:**\n\nFor each column j = 1 to n:\n1. Compute R_{ij} = aⱼ · qᵢ for i = 1,...,j−1\n2. Compute pⱼ = aⱼ − Σᵢ<ⱼ R_{ij}qᵢ\n3. R_{jj} = ‖pⱼ‖\n4. qⱼ = pⱼ / R_{jj}\n\n**Result:** A = QR where Q = [q₁|q₂|...|qₙ] and R is upper triangular.\n\n**Key properties of Q:** Orthonormal columns (qᵢ·qⱼ = δᵢⱼ), so QᵀQ = I.\n\n**Verification:** Compute QR and check it equals A. Also verify Qᵀq = I.',
    difficulty: 'hard',
    tags: ['QR', 'Gram-Schmidt', '3x3', 'numerical'],
  },
  {
    id: 'qr-3',
    source: 'DSA2102 2425s2 Midterm Solutions',
    qnum: 'Q3c',
    type: 'qr_factorization',
    topic: 'QR factorization of 4×3 matrix',
    question: 'Consider the matrix B = [[1,2,1],[0,1,1],[1,0,√2],[0,0,2]]. Compute the QR factorization of B.',
    solution: 'Column 1: a₁ = (1,0,1,0)ᵀ, ‖a₁‖ = √2\n  q₁ = (1,0,1,0)ᵀ/√2\n  R₁₁ = √2\n\nColumn 2: a₂ = (2,1,0,0)ᵀ\n  R₁₂ = a₂·q₁ = (2+0)/√2 = 2/√2 = √2\n  p₂ = (2,1,0,0)ᵀ − √2·(1,0,1,0)ᵀ/√2 = (2,1,0,0)ᵀ − (1,0,1,0)ᵀ = (1,1,−1,0)ᵀ\n  ‖p₂‖ = √3, q₂ = (1,1,−1,0)ᵀ/√3\n  R₂₂ = √3\n\nColumn 3: a₃ = (1,1,√2,2)ᵀ\n  R₁₃ = a₃·q₁ = (1+√2)/√2\n  R₂₃ = a₃·q₂ = (1+1−√2)/√3 = (2−√2)/√3\n  p₃ = a₃ − R₁₃q₁ − R₂₃q₂ (compute numerically)\n  R₃₃ = ‖p₃‖, q₃ = p₃/R₃₃\n\nNumerical result:\nQ ≈ [[0.707, 0.577, −0.267], [0, 0.577, 0.535], [0.707, −0.577, 0.267], [0, 0, 0.756]]\nR ≈ [[1.414, 1.414, 2.121], [0, 1.732, 0], [0, 0, 1.871]]',
    guide: 'Same Gram-Schmidt algorithm as qr-2. For a 4×3 matrix (tall/thin), the result is a thin QR: Q is 4×3 with orthonormal columns, R is 3×3 upper triangular.',
    difficulty: 'hard',
    tags: ['QR', 'Gram-Schmidt', '4x3', 'numerical'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HOUSEHOLDER & GIVENS QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────

const householderGivensQuestions: BankQuestion[] = [
  {
    id: 'hg-1',
    source: 'DSA2102 2324s1 Midterm Solutions',
    qnum: 'Q5',
    type: 'householder_givens',
    topic: 'Householder: operation count, efficient computation, explicit matrix',
    question: 'Recall that a Householder reflection is H = I − 2vvᵀ/(vᵀv) for some v ∈ ℝⁿ. Let A ∈ ℝⁿˣⁿ.\n\n(a) How many arithmetic operations are required to determine the vector v (to eliminate sub-diagonal entries of the first column of A)?\n(b) What is the most efficient way to compute HA = (I − 2vvᵀ/(vᵀv))A? Justify your answer.\n(c) Compute a Householder reflection matrix H that will eliminate the last three entries of the vector (2, 3, 4, 14)ᵀ.',
    solution: '(a) We need to compute ‖a₁‖₂ (first column of A): n multiplications + (n−1) additions + 1 sqrt = 2n operations. Then v = a₁ − ‖a₁‖e₁ requires just 1 subtraction (only the first entry changes). Total: 2n + 1 operations.\n\n(b) Most efficient: compute α = 2/(vᵀv), then compute vᵀA (cost: n(2n−1)), then compute αv(vᵀA) (cost: n² + n), then subtract from A (cost: n²). Total: ~4n² + 2n operations.\n\nDO NOT compute vvᵀ first (that costs n² + n³ = O(n³)).\n\n(c) a = (2,3,4,14)ᵀ, ‖a‖ = √(4+9+16+196) = √225 = 15\n  v = a − 15e₁ = (2−15, 3, 4, 14)ᵀ = (−13, 3, 4, 14)ᵀ\n  vᵀv = 169 + 9 + 16 + 196 = 390\n  H = I − 2vvᵀ/390\n  vvᵀ = [[169,−39,−52,−182],[−39,9,12,42],[−52,12,16,56],[−182,42,56,196]]\n  H = I − (1/195)×vvᵀ\n  Check: Ha = (15, 0, 0, 0)ᵀ ✓',
    guide: '**Householder reflection to zero out entries below position k:**\n\n1. Extract the subvector a = (aₖ, aₖ₊₁, ..., aₙ)ᵀ\n2. Compute ‖a‖₂\n3. Set v = a − ‖a‖e₁ (or a + ‖a‖e₁ for numerical stability when a₁ > 0)\n4. H = I − 2vvᵀ/(vᵀv)\n5. Result: Ha = (‖a‖, 0, 0, ..., 0)ᵀ\n\n**Efficient computation of HA:**\n- NEVER form vvᵀ explicitly (O(n²) storage, O(n³) multiply)\n- Instead: HA = A − v(2vᵀA/vᵀv) = A − (2/vᵀv)v(vᵀA)\n- Cost: O(n²) instead of O(n³)\n\n**Sign choice:** Use v = a + sign(a₁)‖a‖e₁ to avoid cancellation.',
    difficulty: 'hard',
    tags: ['Householder', 'operation-count', 'efficient', 'numerical'],
  },
  {
    id: 'hg-2',
    source: 'DSA2102 2425s2 Midterm Solutions',
    qnum: 'Q4a–d',
    type: 'householder_givens',
    topic: 'Givens rotation: construction, QR column norms, operation count',
    question: 'Consider the matrix M = [[4,1],[4,1],[4,1],[11,1]].\n\n(a) Write down a Givens rotation G that will transform the first column of M to a vector of the form (4, x, 0, 11)ᵀ.\n(b) What is the first column of R in the QR factorization of M?\n(c) What is the norm ‖·‖₂ of the second column of R in the QR factorization of M?\n(d) Suppose v is already known. How many arithmetic operations are required to compute (I − 2vvᵀ/(vᵀv))A where A is n×n?',
    solution: '(a) We want to zero out the (3,1) entry using rows 2 and 3. The entries are a₂₁ = 4 and a₃₁ = 4.\n  r = √(4²+4²) = √32 = 4√2\n  c = 4/(4√2) = 1/√2, s = 4/(4√2) = 1/√2\n  G = [[1,0,0,0],[0,c,s,0],[0,−s,c,0],[0,0,0,1]] = [[1,0,0,0],[0,1/√2,1/√2,0],[0,−1/√2,1/√2,0],[0,0,0,1]]\n\n(b) First column of R = (‖first column of M‖, 0, 0, 0)ᵀ\n  ‖(4,4,4,11)ᵀ‖ = √(16+16+16+121) = √169 = 13\n  First column of R = (13, 0, 0, 0)ᵀ\n\n(c) QR preserves column norms (since Q is orthogonal, ‖Qx‖ = ‖x‖).\n  ‖second column of R‖ = ‖second column of M‖ = ‖(1,1,1,1)ᵀ‖ = 2\n\n(d) Most efficient: vᵀA costs n(2n−1), then 2/(vᵀv)×v costs 3n, then multiply by (vᵀA) costs n², then subtract costs n².\n  Total: 2n² − n + 3n + n² + n² = 4n² + 2n',
    guide: '**Givens rotation to zero out entry (i,j):**\n\nTo zero out aᵢ using aₖ (k < i):\n  r = √(aₖ² + aᵢ²)\n  c = aₖ/r,  s = aᵢ/r\n  G = I except: G[k,k] = c, G[k,i] = s, G[i,k] = −s, G[i,i] = c\n  After applying G: the i-th entry becomes 0, k-th entry becomes r.\n\n**Column norms preserved by Q:**\nSince Q is orthogonal (QᵀQ = I), ‖Qx‖₂ = ‖x‖₂ for any x.\nSo ‖Rⱼ‖₂ = ‖Aⱼ‖₂ (j-th column).\n\n**Operation count for Householder:** See hg-1 guide.',
    difficulty: 'hard',
    tags: ['Givens', 'rotation', 'QR', 'operation-count', 'numerical'],
  },
  {
    id: 'hg-3',
    source: 'MA2213 2324s2 Midterm',
    qnum: 'Q1i–j',
    type: 'householder_givens',
    topic: 'Householder condition number; Givens to zero out vector',
    question: '(a) If H ∈ ℝⁿˣⁿ is a Householder reflection, what is its condition number?\n(b) Suppose we want to transform x = (x₁,x₂,...,xₙ)ᵀ to y = (α,0,...,0)ᵀ using Givens rotations. How many arithmetic operations are required to determine y?',
    solution: '(a) κ(H) = 1. Since H is orthogonal (HᵀH = I), ‖H‖₂ = 1 and ‖H⁻¹‖₂ = ‖Hᵀ‖₂ = 1, so κ(H) = 1×1 = 1.\n\n(b) We only need to compute α = ‖x‖₂ = √(x₁²+x₂²+...+xₙ²). This requires n multiplications (squaring each entry) + (n−1) additions + 1 square root = 2n operations.\n  We do NOT need to compute the individual Givens rotations — just the norm.',
    guide: '**Condition number of orthogonal matrices:**\n- All orthogonal matrices have κ = 1 (perfectly conditioned)\n- This is why Householder and Givens are numerically stable\n- ‖Q‖₂ = σ_max = 1 for orthogonal Q (all singular values = 1)\n\n**Key insight for Givens to zero vector:**\n- We want y = (α,0,...,0)ᵀ where α = ±‖x‖₂\n- We only need α, not the individual Givens matrices\n- Cost = cost of computing ‖x‖₂ = 2n operations',
    difficulty: 'medium',
    tags: ['Householder', 'Givens', 'condition-number', 'operation-count'],
  },
  {
    id: 'hg-4',
    source: 'DSA2102 2425s2 Midterm Solutions',
    qnum: 'Q1f–g',
    type: 'householder_givens',
    topic: 'T/F: Householder invertibility; Givens determinant',
    question: '(a) True or False: For any vector v, the Householder reflection H = I − 2vvᵀ/(vᵀv) is necessarily invertible.\n(b) True or False: The determinant of a Givens rotation is always equal to 1.',
    solution: '(a) TRUE. Householder reflections are orthogonal matrices (HᵀH = I), hence invertible (H⁻¹ = Hᵀ = H, since H is also its own inverse).\n\n(b) TRUE. A Givens rotation in 2D has det = c² + s² = 1 (since c² + s² = 1 by definition). The full n×n Givens matrix has det = 1 (it differs from I only in a 2×2 block with det 1, and the rest of the diagonal is 1).',
    guide: '**Householder properties:**\n- H = Hᵀ (symmetric)\n- H² = I (H is its own inverse)\n- HᵀH = I (orthogonal)\n- det(H) = −1 (reflection, not rotation)\n- κ(H) = 1\n\n**Givens rotation properties:**\n- Orthogonal: GᵀG = I\n- det(G) = c² + s² = 1 (rotation, not reflection)\n- κ(G) = 1\n- Zeros out exactly one entry',
    difficulty: 'easy',
    tags: ['true-false', 'Householder', 'Givens', 'determinant', 'invertible'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// QUESTION GROUPS (organized by type)
// ─────────────────────────────────────────────────────────────────────────────

export const questionGroups: QuestionGroup[] = [
  {
    type: 'floating_point',
    label: 'Floating Point Representation',
    icon: '🔢',
    color: 'from-sky-500 to-cyan-400',
    chapterRef: 'Chapter 1',
    description: 'IEEE 754 formats, special values (Inf/NaN), round-to-even, exact representability, spacing between floats.',
    questions: floatingPointQuestions,
  },
  {
    type: 'theory_mcq',
    label: 'Theory & Short Answers',
    icon: '💡',
    color: 'from-amber-500 to-yellow-400',
    chapterRef: 'All Chapters',
    description: 'True/false statements, conceptual short-answer questions covering all topics.',
    questions: theoryQuestions,
  },
  {
    type: 'complexity',
    label: 'Computational Complexity',
    icon: '⏱',
    color: 'from-purple-500 to-violet-400',
    chapterRef: 'All Chapters',
    description: 'Big-O operation counts for matrix/vector operations, algorithm complexity.',
    questions: complexityQuestions,
  },
  {
    type: 'gaussian_elimination',
    label: 'Gaussian Elimination',
    icon: '🔽',
    color: 'from-green-600 to-emerald-400',
    chapterRef: 'Chapter 2',
    description: 'Forward elimination, partial pivoting, multipliers, triangular systems.',
    questions: gaussianEliminationQuestions,
  },
  {
    type: 'lu_factorization',
    label: 'LU Factorization',
    icon: '🔷',
    color: 'from-blue-600 to-indigo-400',
    chapterRef: 'Chapter 2',
    description: 'LU decomposition, LDR factorization, solving Ax=b via forward/back substitution.',
    questions: luFactorizationQuestions,
  },
  {
    type: 'cholesky',
    label: 'Cholesky Factorization',
    icon: '🔺',
    color: 'from-teal-600 to-cyan-400',
    chapterRef: 'Chapter 2',
    description: 'Cholesky decomposition for SPD matrices, relationship to LU and QR.',
    questions: choleskyQuestions,
  },
  {
    type: 'conditioning_linear',
    label: 'Conditioning & Norms',
    icon: '📐',
    color: 'from-rose-500 to-pink-400',
    chapterRef: 'Chapter 2',
    description: 'Condition numbers, matrix norms, sensitivity of linear systems.',
    questions: conditioningQuestions,
  },
  {
    type: 'least_squares',
    label: 'Least Squares',
    icon: '📈',
    color: 'from-orange-500 to-amber-400',
    chapterRef: 'Chapter 3',
    description: 'Normal equations, polynomial fitting, overdetermined systems, uniqueness conditions.',
    questions: leastSquaresQuestions,
  },
  {
    type: 'qr_factorization',
    label: 'QR Factorization',
    icon: '🔄',
    color: 'from-lime-600 to-green-400',
    chapterRef: 'Chapter 3',
    description: 'Gram-Schmidt orthogonalization, QR decomposition, solving least squares via QR.',
    questions: qrFactorizationQuestions,
  },
  {
    type: 'householder_givens',
    label: 'Householder & Givens',
    icon: '🪞',
    color: 'from-fuchsia-600 to-purple-400',
    chapterRef: 'Chapter 3',
    description: 'Householder reflections, Givens rotations, operation counts, stability comparison.',
    questions: householderGivensQuestions,
  },
];

// All questions flat list
export const allBankQuestions: BankQuestion[] = questionGroups.flatMap(g => g.questions);

// Get questions by type
export function getQuestionsByType(type: QuestionType): BankQuestion[] {
  return allBankQuestions.filter(q => q.type === type);
}

// Get questions by difficulty
export function getQuestionsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): BankQuestion[] {
  return allBankQuestions.filter(q => q.difficulty === difficulty);
}

// Get questions by tag
export function getQuestionsByTag(tag: string): BankQuestion[] {
  return allBankQuestions.filter(q => q.tags.includes(tag));
}

export const difficultyColors = {
  easy: 'text-green-600 bg-green-50 border-green-200',
  medium: 'text-amber-600 bg-amber-50 border-amber-200',
  hard: 'text-red-600 bg-red-50 border-red-200',
};

export const typeLabels: Record<QuestionType, string> = {
  floating_point: 'Floating Point',
  error_analysis: 'Error Analysis',
  triangular_solve: 'Triangular Solve',
  gaussian_elimination: 'Gaussian Elimination',
  lu_factorization: 'LU Factorization',
  cholesky: 'Cholesky',
  conditioning_linear: 'Conditioning',
  least_squares: 'Least Squares',
  qr_factorization: 'QR Factorization',
  householder_givens: 'Householder & Givens',
  theory_mcq: 'Theory / T-F',
  complexity: 'Complexity',
};
