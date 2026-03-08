// DSA2102 Course Data — Midterm Scope: Chapters 1-3
// Design: "Golden Hour Study Retreat" — Bali treehouse aesthetic
// Source: School-provided lecture notes (L1.1–L3.8) + Tutorial sheets 1–5

export interface Formula {
  id: string;
  title: string;
  latex: string;
  description: string;
  isKey?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topicId: string;
}

export interface Topic {
  id: string;
  title: string;
  lectureRef: string;
  content: ContentBlock[];
  formulas: Formula[];
  quiz: QuizQuestion[];
}

export interface ContentBlock {
  type: 'text' | 'formula' | 'example' | 'warning' | 'highlight' | 'video' | 'code';
  content: string;
  title?: string;
  latex?: string;
  videoId?: string;
  videoTitle?: string;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  bgImage: string;
  accentColor: string;
  icon: string;
  topics: Topic[];
}

// ============================================================
// CHAPTER 1: SCIENTIFIC COMPUTING (L1.1 – L1.3)
// ============================================================

const chapter1Topics: Topic[] = [
  {
    id: 'c1t1',
    title: 'Approximation, Error & Problem Conditioning',
    lectureRef: 'L1.1',
    formulas: [
      {
        id: 'abs-error',
        title: 'Absolute Error',
        latex: '\\text{Absolute Error} = |\\hat{x} - x|',
        description: 'Where x̂ is the approximate value and x is the true value.',
        isKey: true,
      },
      {
        id: 'rel-error',
        title: 'Relative Error',
        latex: '\\text{Relative Error} = \\frac{|\\hat{x} - x|}{|x|}',
        description: 'Measures error as a fraction of the true value. More meaningful when comparing errors across different scales.',
        isKey: true,
      },
      {
        id: 'cond-number',
        title: 'Condition Number (General)',
        latex: '\\kappa = \\frac{|\\Delta f / f|}{|\\Delta x / x|} \\approx \\frac{|x f\'(x)|}{|f(x)|}',
        description: 'Measures how sensitive the output of a function is to small changes in input. A large condition number means the problem is ill-conditioned.',
        isKey: true,
      },
    ],
    content: [
      {
        type: 'highlight',
        title: 'Core Concepts',
        content: 'Scientific computing involves solving mathematical problems numerically on a computer. Every numerical computation involves approximation, and understanding the sources and magnitudes of error is fundamental.',
      },
      {
        type: 'text',
        content: '**Well-posed vs Well-conditioned Problems**\n\nA problem is **well-posed** if a solution exists, is unique, and depends continuously on the data. A problem is **well-conditioned** if small changes in input produce small changes in output (small condition number). Note: conditioning is a property of the *problem*, not the algorithm.',
      },
      {
        type: 'text',
        content: '**Precision vs Accuracy**\n\n- **Precision**: How close repeated measurements are to each other (reproducibility)\n- **Accuracy**: How close a measurement is to the true value\n\nA computation can be precise but inaccurate (systematic bias), or accurate on average but imprecise (high variance).',
      },
      {
        type: 'text',
        content: '**Sources of Error**\n\n1. **Data Error**: Errors in the input data (measurement noise, rounding of given values)\n2. **Truncation Error**: Error from approximating an infinite process with a finite one (e.g., truncating a Taylor series)\n3. **Rounding Error**: Error from representing real numbers with finite precision in a computer\n4. **Computational Error** = Truncation Error + Rounding Error',
      },
      {
        type: 'text',
        content: '**Condition Number Interpretation**\n\n- κ ≈ 1: Well-conditioned (small relative error in output for small relative error in input)\n- κ >> 1: Ill-conditioned (output error is magnified relative to input error)\n- The condition number is a property of the **problem**, not the algorithm\n- A numerically stable algorithm does not amplify errors beyond what the condition number requires',
      },
      {
        type: 'example',
        title: 'Example: Condition Number of f(x) = √x',
        content: 'f(x) = √x, f\'(x) = 1/(2√x)\n\nκ = |x · f\'(x)| / |f(x)| = |x · 1/(2√x)| / |√x| = (√x/2) / √x = 1/2\n\nSince κ = 1/2 < 1, computing square roots is a well-conditioned problem — the relative error in the output is at most half the relative error in the input.',
      },
      {
        type: 'video',
        videoId: 'b1CFNSR3f40',
        videoTitle: 'Numerical Methods: Roundoff and Truncation Errors — Numerical Methods Guy',
        content: '',
      },
    ],
    quiz: [
      {
        id: 'q-c1t1-1',
        question: 'The true value of a quantity is 3.14159. A computation gives 3.14. What is the relative error?',
        options: ['0.00159', '0.000506', '0.00159/3.14159 ≈ 0.0506%', '0.00159/3.14 ≈ 0.0506%'],
        correctIndex: 2,
        explanation: 'Relative error = |3.14 - 3.14159| / |3.14159| = 0.00159 / 3.14159 ≈ 0.000506 ≈ 0.0506%. The denominator is the TRUE value.',
        topicId: 'c1t1',
      },
      {
        id: 'q-c1t1-2',
        question: 'A problem has condition number κ = 1000. If the input has a relative error of 10⁻⁶, approximately what relative error can we expect in the output?',
        options: ['10⁻⁶', '10⁻³', '10⁻⁹', '1000'],
        correctIndex: 1,
        explanation: 'The condition number amplifies relative errors: output relative error ≈ κ × input relative error = 1000 × 10⁻⁶ = 10⁻³.',
        topicId: 'c1t1',
      },
      {
        id: 'q-c1t1-3',
        question: 'Which of the following is TRUE about the condition number?',
        options: [
          'It depends on the algorithm used to solve the problem',
          'A condition number of 1 means the problem is impossible to solve',
          'It measures the sensitivity of the output to changes in the input',
          'It is always greater than 1',
        ],
        correctIndex: 2,
        explanation: 'The condition number measures how sensitive the output is to perturbations in the input. It is a property of the problem itself, not the algorithm. A condition number of 1 is actually ideal (well-conditioned).',
        topicId: 'c1t1',
      },
      {
        id: 'q-c1t1-4',
        question: 'What is the difference between truncation error and rounding error?',
        options: [
          'Truncation error comes from finite precision arithmetic; rounding error from approximating infinite processes',
          'Truncation error comes from approximating infinite processes with finite ones; rounding error from finite precision arithmetic',
          'They are the same thing',
          'Truncation error only occurs in integration; rounding error only in differentiation',
        ],
        correctIndex: 1,
        explanation: 'Truncation error arises when we approximate an infinite mathematical process (e.g., infinite series) with a finite one. Rounding error arises from representing real numbers with finite precision in a computer.',
        topicId: 'c1t1',
      },
    ],
  },
  {
    id: 'c1t2',
    title: 'Binary Numbers & Computer Representation',
    lectureRef: 'L1.2',
    formulas: [
      {
        id: 'binary-rep',
        title: 'Binary Number Representation',
        latex: '(a_m a_{m-1} \\cdots a_1 a_0 . b_1 b_2 \\cdots b_n)_2 = \\sum_{k=0}^{m} a_k \\cdot 2^k + \\sum_{j=1}^{n} b_j \\cdot 2^{-j}',
        description: 'Each binary digit (bit) represents a power of 2. Digits left of the point are non-negative powers; digits right are negative powers.',
        isKey: true,
      },
    ],
    content: [
      {
        type: 'highlight',
        title: 'The Big Picture',
        content: 'Computers store everything as sequences of 0s and 1s (bits). Each bit represents a power of 2. Understanding binary is the foundation for understanding how floating-point numbers work — and why they have precision limits.',
      },
      {
        type: 'text',
        content: '**PART 1: Reading Binary Numbers (Binary → Decimal)**\n\nA binary number like (1101.01)₂ is read position by position. Each position has a value that is a power of 2:\n\n  Position: ... 2³  2²  2¹  2⁰  .  2⁻¹  2⁻²  ...\n  Value:    ...  8   4   2   1  .  0.5  0.25  ...\n\n**Rule:** Multiply each bit by its positional value, then sum all the 1-bits.',
      },
      {
        type: 'example',
        title: 'Example 1: Binary → Decimal',
        content: 'Convert (10110.011)₂ to decimal.\n\nStep 1 — Label positions:\n  Bit:    1    0    1    1    0  .  0    1    1\n  Power: 2⁴   2³   2²   2¹   2⁰  .  2⁻¹  2⁻²  2⁻³\n  Value: 16    8    4    2    1  .  0.5  0.25  0.125\n\nStep 2 — Sum where bit = 1:\n  16 + 0 + 4 + 2 + 0 + 0 + 0.25 + 0.125 = 22.375\n\nAnswer: (10110.011)₂ = 22.375',
      },
      {
        type: 'text',
        content: '**PART 2: Decimal → Binary (Integer Part)**\n\nAlgorithm: Repeatedly divide by 2, collect remainders, then read them bottom to top.\n\nWhy it works: Each division strips off the lowest-order bit (the remainder IS that bit), and the quotient contains the remaining higher-order bits.',
      },
      {
        type: 'example',
        title: 'Example 2: Integer Decimal → Binary',
        content: 'Convert 45 to binary.\n\n  45 ÷ 2 = 22  remainder  1  ← least significant bit (rightmost)\n  22 ÷ 2 = 11  remainder  0\n  11 ÷ 2 =  5  remainder  1\n   5 ÷ 2 =  2  remainder  1\n   2 ÷ 2 =  1  remainder  0\n   1 ÷ 2 =  0  remainder  1  ← most significant bit (leftmost)\n\nRead remainders bottom to top: (101101)₂\n\nVerify: 32 + 0 + 8 + 4 + 0 + 1 = 45 ✓',
      },
      {
        type: 'text',
        content: '**PART 3: Decimal → Binary (Fractional Part)**\n\nAlgorithm: Repeatedly multiply by 2. Each time, the digit before the decimal point is the next binary bit. Read bits top to bottom.\n\nWhy it works: Multiplying by 2 shifts the binary point right by one position, exposing the next bit.',
      },
      {
        type: 'example',
        title: 'Example 3: Fractional Decimal → Binary',
        content: 'Convert 0.6875 to binary.\n\n  0.6875 × 2 = 1.375  → bit = 1  ← first bit after the binary point\n  0.375  × 2 = 0.75   → bit = 0\n  0.75   × 2 = 1.5    → bit = 1\n  0.5    × 2 = 1.0    → bit = 1  (remainder = 0.0, stop)\n\nRead top to bottom: (0.1011)₂\n\nVerify: 0.5 + 0 + 0.125 + 0.0625 = 0.6875 ✓\n\nFor a mixed number like 13.6875:\n  Integer part: 13 = (1101)₂\n  Fraction part: 0.6875 = (.1011)₂\n  Combined: (1101.1011)₂',
      },
      {
        type: 'warning',
        title: 'When the fraction never terminates — the 0.1 problem',
        content: 'Convert 0.1 to binary:\n  0.1 × 2 = 0.2 → bit = 0\n  0.2 × 2 = 0.4 → bit = 0\n  0.4 × 2 = 0.8 → bit = 0\n  0.8 × 2 = 1.6 → bit = 1\n  0.6 × 2 = 1.2 → bit = 1\n  0.2 × 2 = 0.4 → bit = 0  ← back to 0.4, pattern repeats forever!\n\n0.1 = (0.000110011001100...)₂ — an infinite repeating binary fraction.\n\nSince computers have finite bits, this must be truncated → rounding error.\nThis is why in R: 0.1 + 0.2 ≠ 0.3 (it equals 0.30000000000000004).\n\nKey insight: A decimal fraction terminates in binary ONLY if its denominator (in lowest terms) is a power of 2.',
      },
      {
        type: 'text',
        content: '**PART 4: Binary Arithmetic**\n\nBinary addition follows the same column-by-column logic as decimal, but with only two digits. The only new rule to learn is the carry:\n\n  0 + 0 = 0         (no carry)\n  0 + 1 = 1         (no carry)\n  1 + 0 = 1         (no carry)\n  1 + 1 = 10        (write 0, carry 1)\n  1 + 1 + 1 = 11    (write 1, carry 1)  ← when there is also a carry-in',
      },
      {
        type: 'example',
        title: 'Example 4: Binary Addition',
        content: 'Add (1011)₂ + (0110)₂\n\n     carry: 1 1 1 0\n            1 0 1 1\n          + 0 1 1 0\n          ---------\n\nColumn by column (right to left):\n  Col 0 (2⁰): 1 + 0 = 1          → write 1, carry 0\n  Col 1 (2¹): 1 + 1 = 10         → write 0, carry 1\n  Col 2 (2²): 0 + 1 + 1(carry) = 10 → write 0, carry 1\n  Col 3 (2³): 1 + 0 + 1(carry) = 10 → write 0, carry 1\n  Col 4 (2⁴): 0 + 0 + 1(carry) = 1  → write 1\n\nResult: (10001)₂\n\nVerify: 11 + 6 = 17 = 16 + 1 = (10001)₂ ✓',
      },
      {
        type: 'text',
        content: '**PART 5: Binary Multiplication**\n\nBinary multiplication works exactly like long multiplication in decimal, but is much simpler because the only digits are 0 and 1. The two rules are:\n\n  Any number × 0 = 0\n  Any number × 1 = that number unchanged\n\nSo each partial product is either all zeros (if the multiplier bit is 0) or a copy of the multiplicand (if the multiplier bit is 1), shifted left by the appropriate number of positions. Then all partial products are added together.',
      },
      {
        type: 'example',
        title: 'Example 5: Binary Multiplication (Integer)',
        content: 'Multiply (1011)\u2082 \u00d7 (101)\u2082\n\nStep 1 \u2014 Write out partial products (one per bit of the multiplier, from right to left):\n\n  Multiplier bit 0 (= 1): 1011 \u00d7 1 = 1011, shifted 0 places  →  0001011\n  Multiplier bit 1 (= 0): 1011 \u00d7 0 = 0000, shifted 1 place   →  0000000\n  Multiplier bit 2 (= 1): 1011 \u00d7 1 = 1011, shifted 2 places  →  0101100\n\nStep 2 \u2014 Add all partial products:\n\n       0 0 0 1 0 1 1\n       0 0 0 0 0 0 0\n     + 0 1 0 1 1 0 0\n     ---------------\n       0 1 1 0 1 1 1\n\nResult: (110111)\u2082\n\nVerify: 11 \u00d7 5 = 55 = 32 + 16 + 4 + 2 + 1 = (110111)\u2082 \u2713',
      },
      {
        type: 'example',
        title: 'Example 6: Binary Multiplication (with Fractions)',
        content: 'Multiply (1.1)\u2082 \u00d7 (10.1)\u2082\n\nFirst, note the total number of binary decimal places: 1 + 1 = 2 places total.\nIgnore the binary point and multiply as integers:\n  (11)\u2082 \u00d7 (101)\u2082\n\n  Partial products:\n    11 \u00d7 1 (bit 0) = 011, shift 0  →  00011\n    11 \u00d7 0 (bit 1) = 000, shift 1  →  00000\n    11 \u00d7 1 (bit 2) = 011, shift 2  →  01100\n\n  Sum: 00011 + 00000 + 01100 = 01111 = (1111)\u2082\n\nNow place the binary point 2 places from the right: (11.11)\u2082\n\nVerify: 1.5 \u00d7 2.5 = 3.75 = 2 + 1 + 0.5 + 0.25 = (11.11)\u2082 \u2713',
      },
      {
        type: 'warning',
        title: 'Key rule for binary point in multiplication',
        content: 'When multiplying two binary numbers with fractional parts:\n  Total binary decimal places in result = (decimal places in first number) + (decimal places in second number)\n\nThis is identical to the rule for decimal multiplication:\n  1.5 \u00d7 2.5: 1 decimal place + 1 decimal place = 2 decimal places in result (3.75)\n  (1.1)\u2082 \u00d7 (10.1)\u2082: 1 binary place + 1 binary place = 2 binary places in result (11.11)\u2082',
      },
      {
        type: 'highlight',
        title: 'Quick Reference Summary',
        content: 'Binary \u2192 Decimal: Multiply each bit by its power of 2, sum all the 1-bits.\nInteger \u2192 Binary: Divide by 2 repeatedly, collect remainders, read BOTTOM TO TOP.\nFraction \u2192 Binary: Multiply by 2 repeatedly, collect integer parts, read TOP TO BOTTOM.\nBinary addition: Column by column right to left; carry when sum \u2265 2.\nBinary multiplication: Partial products (shift-and-add); each partial product is 0 or a shifted copy of the multiplicand. Count binary decimal places: result places = sum of both operands\u2019 places.',
      },
    ],
    quiz: [
      {
        id: 'q-c1t2-1',
        question: 'What is (1011.01)₂ in decimal?',
        options: ['11.25', '11.5', '11.75', '10.25'],
        correctIndex: 0,
        explanation: '1×2³ + 0×2² + 1×2¹ + 1×2⁰ + 0×2⁻¹ + 1×2⁻² = 8 + 0 + 2 + 1 + 0 + 0.25 = 11.25',
        topicId: 'c1t2',
      },
      {
        id: 'q-c1t2-2',
        question: 'Why can\'t 0.1 be represented exactly in binary floating point?',
        options: [
          'Because 0.1 is irrational',
          'Because 0.1 in binary is an infinite repeating fraction',
          'Because binary can only represent integers',
          'Because 0.1 is too small',
        ],
        correctIndex: 1,
        explanation: '0.1 = 0.0001100110011... in binary — an infinite repeating pattern. Since computers have finite bits, they must truncate, introducing rounding error.',
        topicId: 'c1t2',
      },
      {
        id: 'q-c1t2-3',
        question: 'Convert (25)₁₀ to binary.',
        options: ['(11001)₂', '(10011)₂', '(11010)₂', '(10101)₂'],
        correctIndex: 0,
        explanation: '25 = 16 + 8 + 1 = 2⁴ + 2³ + 2⁰ = (11001)₂. Check: 1×16 + 1×8 + 0×4 + 0×2 + 1×1 = 25 ✓',
        topicId: 'c1t2',
      },
    ],
  },
  {
    id: 'c1t3',
    title: 'Floating Point Systems',
    lectureRef: 'L1.3',
    formulas: [
      {
        id: 'fp-normal',
        title: 'Normalized Floating Point Number',
        latex: '(-1)^s \\times 1.b_1 b_2 \\cdots b_{p-1} \\times 2^{e - \\text{bias}}',
        description: 'A normalized floating point number has an implicit leading 1. s = sign bit, p = precision (number of significand bits), e = exponent bits.',
        isKey: true,
      },
      {
        id: 'fp-subnormal',
        title: 'Subnormal (Denormalized) Floating Point Number',
        latex: '(-1)^s \\times 0.b_1 b_2 \\cdots b_{p-1} \\times 2^{1 - \\text{bias}}',
        description: 'Used when exponent bits are all zero. Allows gradual underflow to zero.',
      },
      {
        id: 'machine-epsilon',
        title: 'Machine Epsilon (Unit Roundoff)',
        latex: '\\epsilon_{\\text{mach}} = 2^{-(p-1)} \\quad \\text{(rounding to nearest)}',
        description: 'The smallest number such that fl(1 + ε) > 1. For IEEE double precision: p=53, so ε_mach ≈ 2.22 × 10⁻¹⁶.',
        isKey: true,
      },
      {
        id: 'fp-relative-error',
        title: 'Floating Point Relative Error Bound',
        latex: '\\frac{|fl(x) - x|}{|x|} \\leq \\epsilon_{\\text{mach}} = 2^{-(p-1)}',
        description: 'The relative error of representing any real number x in floating point is bounded by machine epsilon.',
        isKey: true,
      },
      {
        id: 'fp-overflow-threshold',
        title: 'Overflow Threshold (IEEE 754 Double)',
        latex: '\\Omega = (2 - 2^{-(p-1)}) \\times 2^{e_{\\max}} \\approx 1.8 \\times 10^{308}',
        description: 'Any computation producing a result larger than Ω overflows to ±Inf. For IEEE double: e_max = 1023, p = 53.',
        isKey: true,
      },
      {
        id: 'fp-underflow-threshold',
        title: 'Underflow Threshold — Smallest Normal Number (IEEE 754 Double)',
        latex: '\\lambda = 2^{e_{\\min}} = 2^{-1022} \\approx 2.2 \\times 10^{-308}',
        description: 'Any result smaller in magnitude than λ cannot be represented as a normalized number. It either underflows to a subnormal or flushes to zero.',
        isKey: true,
      },
      {
        id: 'fp-subnormal-threshold',
        title: 'Smallest Subnormal Number (IEEE 754 Double)',
        latex: '\\lambda_{\\text{sub}} = 2^{1-\\text{bias}-(p-1)} = 2^{-1074} \\approx 5.0 \\times 10^{-324}',
        description: 'The smallest positive number representable in IEEE 754 double precision (a subnormal). Below this, the result flushes to zero (hard underflow).',
      },
      {
        id: 'bin-add-rules',
        title: 'Binary Addition Rules (Cheatsheet)',
        latex: '0+0=0 \\quad 0+1=1 \\quad 1+0=1 \\quad 1+1=10_{\\,2} \\quad 1+1+1=11_{\\,2}',
        description: 'The five cases of single-bit addition (including carry-in). When the sum is 2 (= 10₂), write 0 and carry 1. When the sum is 3 (= 11₂), write 1 and carry 1.',
        isKey: true,
      },
      {
        id: 'bin-powers',
        title: 'Powers of 2 Reference (Cheatsheet)',
        latex: '2^0=1,\\; 2^1=2,\\; 2^2=4,\\; 2^3=8,\\; 2^4=16,\\; 2^5=32,\\; 2^6=64,\\; 2^7=128,\\; 2^8=256,\\; 2^9=512,\\; 2^{10}=1024',
        description: 'Memorise these to quickly convert between binary and decimal. For fractions: 2⁻¹=0.5, 2⁻²=0.25, 2⁻³=0.125, 2⁻⁴=0.0625, 2⁻⁵=0.03125.',
        isKey: true,
      },
      {
        id: 'bin-neg-powers',
        title: 'Negative Powers of 2 Reference (Cheatsheet)',
        latex: '2^{-1}=0.5,\\; 2^{-2}=0.25,\\; 2^{-3}=0.125,\\; 2^{-4}=0.0625,\\; 2^{-5}=0.03125,\\; 2^{-6}=0.015625',
        description: 'Essential for converting binary fractions to decimal. Each step right of the binary point halves the value.',
        isKey: true,
      },
      {
        id: 'bin-common-sums',
        title: 'Common Binary Sums (Cheatsheet)',
        latex: '(1111)_2 = 15,\\quad (10000)_2 = 16,\\quad (11111)_2 = 31,\\quad (100000)_2 = 32',
        description: 'A string of n ones in binary equals 2ⁿ − 1. Adding 1 to a string of all ones produces a 1 followed by n zeros (carry cascade). Useful for spotting patterns quickly.',
      },
      {
        id: 'bin-subtraction-complement',
        title: 'Binary Subtraction via Two\'s Complement',
        latex: 'A - B = A + (\\overline{B} + 1) \\pmod{2^n}',
        description: 'To subtract B from A: flip all bits of B (one\'s complement), add 1 to get two\'s complement, then add to A. Any carry out of the MSB is discarded. This is how computers perform subtraction.',
      },
    ],
    content: [
      {
        type: 'highlight',
        title: '📖 Notation Guide — Read This First',
        content: 'This topic introduces several important notations. Here is what each one means:\n\n• fl(x)  — "the floating point representation of x". When a real number x is stored in a computer, it gets rounded to the nearest representable floating point number. We write this rounded value as fl(x).\n  Example: fl(0.1) ≠ 0.1 exactly, because 0.1 cannot be represented exactly in binary floating point.\n\n• fl(1 + ε) > 1  — this is the defining TEST for machine epsilon. We ask: for what smallest positive ε does adding ε to 1 actually change the stored value? If ε is too tiny, fl(1 + ε) rounds back to fl(1) = 1 and the addition is completely lost.\n\n• ε_mach  (machine epsilon / unit roundoff)  — the smallest positive number such that fl(1 + ε_mach) > 1. It measures the "gap" between 1 and the next representable floating point number. For IEEE 754 double precision: ε_mach = 2⁻⁵² ≈ 2.22 × 10⁻¹⁶.\n\n• p  — the number of significand (mantissa) bits, including the implicit leading 1. For IEEE 754 double precision, p = 53 (52 stored fraction bits + 1 implicit leading bit).\n\n• bias  — a fixed offset added to the stored exponent so that it is always a non-negative integer. For IEEE 754 double, bias = 1023. Actual exponent = stored exponent − bias.\n\n• Ω  — the overflow threshold (largest finite floating point number ≈ 1.8 × 10³⁰⁸). Any result larger than Ω in magnitude becomes ±Inf.\n\n• λ  — the underflow threshold (smallest positive NORMAL number ≈ 2.2 × 10⁻³⁰⁸). Results smaller than λ become subnormal (fewer significant bits).\n\n• λ_sub  — the smallest positive SUBNORMAL number (≈ 5 × 10⁻³²⁴). Results smaller than λ_sub flush to exactly zero.',
      },
      {
        type: 'text',
        content: '**IEEE 754 Double Precision Standard**\n\nMost computers use IEEE 754 double precision floating point:\n- 1 sign bit (s)  — 0 means positive, 1 means negative\n- 11 exponent bits (e₁e₂...e₁₁)  — stored as unsigned integer; actual exponent = stored value − bias (1023)\n- 52 fraction bits (b₁b₂...b₅₂)  — the digits after the binary point in the significand; there is an implicit leading 1, so we get p = 53 bits of precision total\n- Total: 64 bits\n- Bias = 1023 (so stored exponent = actual exponent + 1023)\n\nThe value stored is: (−1)ˢ × 1.b₁b₂...b₅₂ × 2^(stored_exponent − 1023)',
      },
      {
        type: 'text',
        content: '**Special Values in IEEE 754**\n\n- **Exponent all zeros, fraction all zeros**: ±0\n- **Exponent all zeros, fraction nonzero**: Subnormal numbers (gradual underflow)\n- **Exponent all ones, fraction all zeros**: ±Inf (overflow)\n- **Exponent all ones, fraction nonzero**: NaN (Not a Number, e.g., 0/0, √(-1))',
      },
      {
        type: 'highlight',
        title: 'Overflow — What it is and when it happens',
        content: 'OVERFLOW occurs when a computation produces a result whose MAGNITUDE IS TOO LARGE to be stored as a finite floating point number.\n\nThe overflow threshold for IEEE 754 double precision is:\n  Ω ≈ 1.8 × 10³⁰⁸\n\nWhen a result exceeds Ω, the floating point system returns ±Inf (positive or negative infinity), depending on the sign.\n\nCommon triggers:\n• Multiplying two very large numbers (e.g., 10²⁰⁰ × 10²⁰⁰ = 10⁴⁰⁰ > Ω)\n• Dividing by a very small number (e.g., 1 / 10⁻³¹⁰ = 10³¹⁰ > Ω)\n• Repeated multiplication in iterative algorithms without scaling\n\nConsequences:\n• Any arithmetic with Inf propagates: Inf + x = Inf, Inf × x = Inf (for x ≠ 0)\n• Inf - Inf = NaN (undefined)\n• Overflow is usually a FATAL error in a computation — the result is completely wrong.',
      },
      {
        type: 'highlight',
        title: 'Underflow — What it is and when it happens',
        content: 'UNDERFLOW occurs when a computation produces a result whose MAGNITUDE IS TOO SMALL to be stored as a normalized floating point number.\n\nThere are two levels:\n\n1. GRADUAL UNDERFLOW (into subnormal range):\n   When the result is smaller than λ = 2⁻¹⁰²² ≈ 2.2 × 10⁻³⁰⁸ but larger than λ_sub = 2⁻¹⁰⁷⁴ ≈ 5 × 10⁻³²⁴,\n   the number is stored as a SUBNORMAL (denormalized) number.\n   Subnormals have the exponent bits all zero and no implicit leading 1.\n   They still represent the value, but with FEWER significant bits (reduced precision).\n\n2. HARD UNDERFLOW (flush to zero):\n   When the result is smaller than λ_sub = 2⁻¹⁰⁷⁴, it FLUSHES TO ZERO.\n   The result is stored as exactly 0, losing all information.\n\nCommon triggers:\n• Multiplying two very small numbers (e.g., 10⁻²⁰⁰ × 10⁻²⁰⁰ = 10⁻⁴⁰⁰ < λ)\n• Iterative algorithms that produce exponentially decaying sequences\n\nConsequences:\n• Gradual underflow: computation continues with reduced precision\n• Hard underflow to zero: subsequent division by this zero causes overflow to Inf\n• Often LESS catastrophic than overflow, but can silently introduce error',
      },
      {
        type: 'code',
        title: 'Example: Overflow and Underflow in Practice (R / IEEE 754)',
        content: '# ── OVERFLOW ──────────────────────────────────────────────────────────────\n> 1e308 * 10            # 10^309 exceeds Omega ~ 1.8e308\n[1] Inf                 # result overflows to +Inf\n\n> .Machine$double.xmax  # largest finite double\n[1] 1.797693e+308       # this is Omega\n\n\n# ── GRADUAL UNDERFLOW (into subnormal range) ───────────────────────────────\n> 1e-308 / 10           # 10^-309 < lambda = 2^-1022 ~ 2.2e-308\n[1] 1e-309              # still representable as a subnormal,\n                        # but with FEWER significant bits (reduced precision)\n\n\n# ── HARD UNDERFLOW (flush to zero) ────────────────────────────────────────\n> 1e-308 / 1e17         # 10^-325 < lambda_sub = 2^-1074 ~ 5e-324\n[1] 0                   # flushes to exactly zero — all information lost\n\n> .Machine$double.xmin  # smallest NORMAL double\n[1] 2.225074e-308       # this is lambda\n\n\n# ── PRACTICAL DANGER: underflow then overflow ──────────────────────────────\n> x <- 1e-200\n> (x * x) / x           # mathematically should equal x = 1e-200\n\n# Step 1: x * x = 1e-400 < lambda_sub  =>  underflows to 0\n# Step 2: 0 / x = 0                    =>  WRONG answer (should be 1e-200)\n[1] 0',
      },
      {
        type: 'warning',
        title: 'Key distinction: Overflow vs Underflow vs Catastrophic Cancellation',
        content: 'OVERFLOW: result too LARGE → becomes ±Inf\n  Cause: multiplying/exponentiating large numbers, dividing by tiny numbers\n  Effect: computation is completely wrong\n\nUNDERFLOW: result too SMALL → becomes subnormal or 0\n  Cause: multiplying tiny numbers, iterative decay\n  Effect: gradual loss of precision, or silent zero (dangerous if used as divisor)\n\nCATASTROPHIC CANCELLATION: result is in NORMAL range but PRECISION is lost\n  Cause: subtracting two nearly equal numbers\n  Effect: leading significant digits cancel, result has far fewer correct digits\n  Example: (1.000001 - 1.000000) = 0.000001 (only 1 sig. fig. instead of 7)',
      },
      {
        type: 'text',
        content: '**Distribution of Floating Point Numbers**\n\nFloating point numbers are NOT uniformly distributed on the real line. They are denser near zero and sparser for large magnitudes. Between any two consecutive powers of 2 (say 2^k and 2^(k+1)), there are exactly 2^(p-1) floating point numbers.',
      },
      {
        type: 'highlight',
        title: 'Dangerous Operations to Avoid',
        content: '1. **Adding numbers of vastly different magnitudes**: small number\'s significant digits may be lost\n2. **Subtracting nearly equal numbers (catastrophic cancellation)**: significant digits cancel, leaving only noise\n3. **Multiplying very small numbers**: may underflow to zero\n4. **Dividing by a very small number**: may overflow to Inf',
      },
      {
        type: 'example',
        title: 'Example: Catastrophic Cancellation',
        content: 'Compute f(x) = (1 - cos x) / x² for small x.\n\nNaive: For x = 10⁻⁸, cos(x) ≈ 1 - x²/2 + ...\n1 - cos(x) ≈ 5×10⁻¹⁷ (catastrophic cancellation!)\n\nBetter: Use the identity f(x) = (sin x)² / (x²(1 + cos x))\nThis avoids subtracting nearly equal numbers.',
      },
      {
        type: 'example',
        title: 'Example: Computing Variance Stably',
        content: 'Two-pass algorithm (numerically stable):\n1. First pass: compute mean μ = (1/n)Σxᵢ\n2. Second pass: compute s² = (1/(n-1))Σ(xᵢ - μ)²\n\nOne-pass formula Σxᵢ² - n·μ² can suffer catastrophic cancellation when variance is small relative to the mean.',
      },
      {
        type: 'video',
        videoId: 'PZRI1IfStY0',
        videoTitle: 'Floating Point Numbers - Computerphile',
        content: '',
      },
    ],
    quiz: [
      {
        id: 'q-c1t3-1',
        question: 'In IEEE 754 double precision, what is machine epsilon approximately?',
        options: ['2⁻⁵²', '2⁻⁵³', '2⁻⁵²  ≈ 2.22 × 10⁻¹⁶', '2⁻⁵³ ≈ 1.11 × 10⁻¹⁶'],
        correctIndex: 2,
        explanation: 'Machine epsilon = 2^(-(p-1)) where p = 53 (52 stored fraction bits + 1 implicit). So ε_mach = 2^(-52) ≈ 2.22 × 10⁻¹⁶.',
        topicId: 'c1t3',
      },
      {
        id: 'q-c1t3-2',
        question: 'Which operation is most likely to cause catastrophic cancellation?',
        options: [
          'Multiplying two large numbers',
          'Adding a very small number to a very large number',
          'Subtracting two nearly equal numbers',
          'Dividing by a large number',
        ],
        correctIndex: 2,
        explanation: 'Catastrophic cancellation occurs when subtracting nearly equal numbers. The significant digits cancel out, leaving only the less significant (and potentially erroneous) digits.',
        topicId: 'c1t3',
      },
      {
        id: 'q-c1t3-3',
        question: 'What does NaN represent in IEEE 754 floating point?',
        options: [
          'A very small number near zero',
          'An undefined or unrepresentable result (e.g., 0/0)',
          'Negative infinity',
          'A number too large to represent',
        ],
        correctIndex: 1,
        explanation: 'NaN (Not a Number) represents undefined or unrepresentable results such as 0/0, √(-1), or Inf - Inf.',
        topicId: 'c1t3',
      },
      {
        id: 'q-c1t3-4',
        question: 'Why are floating point numbers NOT uniformly distributed on the real line?',
        options: [
          'Because computers can only store integers',
          'Because the exponent allows more numbers near zero and fewer near large values',
          'Because of the sign bit',
          'Because IEEE 754 is poorly designed',
        ],
        correctIndex: 1,
        explanation: 'The floating point exponent means there are the same number of representable values in each interval [2^k, 2^(k+1)], so the density is higher near zero and lower for large magnitudes.',
        topicId: 'c1t3',
      },
    ],
  },
];

// ============================================================
// CHAPTER 2: SYSTEMS OF LINEAR EQUATIONS (L2.1 – L2.13)
// ============================================================

const chapter2Topics: Topic[] = [
  {
    id: 'c2t1',
    title: 'Introduction to Linear Systems & Triangular Systems',
    lectureRef: 'L2.1–L2.3',
    formulas: [
      {
        id: 'linear-system',
        title: 'Linear System Ax = b',
        latex: 'A\\mathbf{x} = \\mathbf{b}, \\quad A \\in \\mathbb{R}^{n \\times n}, \\; \\mathbf{x}, \\mathbf{b} \\in \\mathbb{R}^n',
        description: 'The fundamental problem: given matrix A and vector b, find vector x.',
        isKey: true,
      },
      {
        id: 'forward-sub',
        title: 'Forward Substitution (Lower Triangular)',
        latex: 'x_i = \\frac{b_i - \\sum_{j=1}^{i-1} l_{ij} x_j}{l_{ii}}, \\quad i = 1, 2, \\ldots, n',
        description: 'Solves Lx = b where L is lower triangular. Proceeds from i=1 to n.',
        isKey: true,
      },
      {
        id: 'back-sub',
        title: 'Back Substitution (Upper Triangular)',
        latex: 'x_i = \\frac{b_i - \\sum_{j=i+1}^{n} u_{ij} x_j}{u_{ii}}, \\quad i = n, n-1, \\ldots, 1',
        description: 'Solves Ux = b where U is upper triangular. Proceeds from i=n down to 1.',
        isKey: true,
      },
      {
        id: 'triangular-complexity',
        title: 'Complexity of Triangular Solve',
        latex: '\\text{Operations} = O(n^2)',
        description: 'Forward or back substitution requires O(n²) arithmetic operations.',
      },
    ],
    content: [
      {
        type: 'text',
        content: '**Why Linear Systems Matter**\n\nSolving Ax = b is one of the most fundamental problems in scientific computing. It arises in:\n- Fitting models to data (least squares)\n- Finite element methods\n- Network analysis\n- Optimization (KKT conditions)\n\nFor an n×n system, naive inversion (computing A⁻¹) requires O(n³) operations and is numerically unstable — we never compute A⁻¹ explicitly in practice.',
      },
      {
        type: 'text',
        content: '**Triangular Systems**\n\nA lower triangular matrix L has lᵢⱼ = 0 for j > i.\nAn upper triangular matrix U has uᵢⱼ = 0 for j < i.\n\nThese are the easiest systems to solve:\n- Lower triangular Lx = b: use **forward substitution** (solve for x₁, then x₂, ...)\n- Upper triangular Ux = b: use **back substitution** (solve for xₙ, then xₙ₋₁, ...)',
      },
      {
        type: 'example',
        title: 'Example: Back Substitution',
        content: 'Solve: [2 1 -1; 0 3 2; 0 0 4] x = [8; 11; 4]\n\nStep 1: 4x₃ = 4 → x₃ = 1\nStep 2: 3x₂ + 2(1) = 11 → 3x₂ = 9 → x₂ = 3\nStep 3: 2x₁ + 1(3) - 1(1) = 8 → 2x₁ = 6 → x₁ = 3\n\nSolution: x = (3, 3, 1)ᵀ',
      },
    ],
    quiz: [
      {
        id: 'q-c2t1-1',
        question: 'What is the computational complexity of solving a triangular system of size n×n?',
        options: ['O(n)', 'O(n²)', 'O(n³)', 'O(n log n)'],
        correctIndex: 1,
        explanation: 'Forward or back substitution requires about n² arithmetic operations (n steps, each requiring up to n multiplications/additions), so O(n²).',
        topicId: 'c2t1',
      },
      {
        id: 'q-c2t1-2',
        question: 'Why do we avoid computing A⁻¹ explicitly when solving Ax = b?',
        options: [
          'Because A⁻¹ does not always exist',
          'Because it requires O(n³) operations and is numerically unstable',
          'Because R cannot compute matrix inverses',
          'Because A⁻¹ is always singular',
        ],
        correctIndex: 1,
        explanation: 'Computing A⁻¹ is expensive (O(n³)) and numerically unstable. It is better to solve Ax = b directly using factorization methods like LU decomposition.',
        topicId: 'c2t1',
      },
    ],
  },
  {
    id: 'c2t2',
    title: 'Gaussian Elimination',
    lectureRef: 'L2.4–L2.7',
    formulas: [
      {
        id: 'elimination-multiplier',
        title: 'Elimination Multiplier',
        latex: 'm_{ik} = \\frac{a_{ik}}{a_{kk}}, \\quad i > k',
        description: 'The multiplier used to eliminate the (i,k) entry. The pivot is a_{kk}.',
        isKey: true,
      },
      {
        id: 'elimination-step',
        title: 'Row Elimination Step',
        latex: 'a_{ij}^{(k+1)} = a_{ij}^{(k)} - m_{ik} \\cdot a_{kj}^{(k)}, \\quad i,j > k',
        description: 'Update formula for each row during elimination. Superscript (k) denotes the k-th stage.',
        isKey: true,
      },
      {
        id: 'ge-complexity',
        title: 'Gaussian Elimination Complexity',
        latex: '\\text{Operations} \\approx \\frac{2n^3}{3} = O(n^3)',
        description: 'Gaussian elimination requires approximately 2n³/3 floating point operations.',
        isKey: true,
      },
    ],
    content: [
      {
        type: 'text',
        content: '**Gaussian Elimination Algorithm**\n\nGaussian elimination transforms the system Ax = b into an equivalent upper triangular system Ux = c by applying row operations. The key idea: subtract multiples of one row from another to create zeros below the diagonal.',
      },
      {
        type: 'text',
        content: '**Three Stages**\n\n1. **Forward Elimination**: Transform A to upper triangular U (O(n³) operations)\n2. **Back Substitution**: Solve Ux = c (O(n²) operations)\n\nThe total cost is dominated by the O(n³) elimination step.',
      },
      {
        type: 'example',
        title: 'Example: Gaussian Elimination (2×2)',
        content: 'Solve: [2 1; 4 3] x = [5; 11]\n\nMultiplier: m₂₁ = 4/2 = 2\nRow 2 ← Row 2 - 2×Row 1:\n[2 1 | 5]\n[0 1 | 1]  (4-2×2=0, 3-2×1=1, 11-2×5=1)\n\nBack substitution: x₂ = 1, x₁ = (5-1)/2 = 2\nSolution: x = (2, 1)ᵀ',
      },
      {
        type: 'warning',
        title: 'Pivoting is Essential!',
        content: 'If the pivot a_{kk} = 0 (or is very small), Gaussian elimination fails or produces large errors. The solution: swap rows to put the largest element in the pivot position (partial pivoting).',
      },
      {
        type: 'text',
        content: '**Partial Pivoting**\n\nBefore each elimination step k, find the row i ≥ k with the largest |a_{ik}| and swap rows i and k. This ensures |m_{ik}| ≤ 1 for all multipliers, preventing error amplification.\n\n**Complete Pivoting**: also swap columns (rarely used in practice due to overhead).',
      },
      {
        type: 'video',
        videoId: 'eDb6iugi6Uk',
        videoTitle: 'Gaussian Elimination with Partial Pivoting — 3Blue1Brown style explanation',
        content: '',
      },
    ],
    quiz: [
      {
        id: 'q-c2t2-1',
        question: 'In Gaussian elimination, what is the multiplier m₃₁ if a₃₁ = 6 and a₁₁ = 2?',
        options: ['3', '1/3', '12', '-3'],
        correctIndex: 0,
        explanation: 'm₃₁ = a₃₁ / a₁₁ = 6/2 = 3. This multiplier is used to eliminate the (3,1) entry: Row 3 ← Row 3 - 3×Row 1.',
        topicId: 'c2t2',
      },
      {
        id: 'q-c2t2-2',
        question: 'Why is partial pivoting used in Gaussian elimination?',
        options: [
          'To reduce the number of operations from O(n³) to O(n²)',
          'To avoid division by zero or very small pivots, preventing numerical instability',
          'To make the matrix symmetric',
          'To ensure the solution is unique',
        ],
        correctIndex: 1,
        explanation: 'Partial pivoting swaps rows to place the largest available element in the pivot position, ensuring multipliers |m_{ik}| ≤ 1 and preventing error amplification from small pivots.',
        topicId: 'c2t2',
      },
      {
        id: 'q-c2t2-3',
        question: 'What is the approximate number of floating point operations for Gaussian elimination on an n×n system?',
        options: ['n²', '2n³/3', 'n³', 'n²/2'],
        correctIndex: 1,
        explanation: 'Gaussian elimination requires approximately 2n³/3 floating point operations for the forward elimination phase, making it O(n³) overall.',
        topicId: 'c2t2',
      },
    ],
  },
  {
    id: 'c2t3',
    title: 'LU Factorization',
    lectureRef: 'L2.8–L2.10',
    formulas: [
      {
        id: 'lu-factorization',
        title: 'LU Factorization',
        latex: 'A = LU',
        description: 'A is factored into a lower triangular matrix L (with 1s on diagonal) and upper triangular matrix U. The multipliers from Gaussian elimination form L.',
        isKey: true,
      },
      {
        id: 'plu-factorization',
        title: 'LU Factorization with Pivoting',
        latex: 'PA = LU',
        description: 'P is a permutation matrix recording row swaps. This is the standard form used in practice (e.g., R\'s solve() function).',
        isKey: true,
      },
      {
        id: 'lu-solve',
        title: 'Solving Ax = b via LU',
        latex: 'A\\mathbf{x} = \\mathbf{b} \\Rightarrow LU\\mathbf{x} = \\mathbf{b} \\Rightarrow \\begin{cases} L\\mathbf{y} = \\mathbf{b} \\\\ U\\mathbf{x} = \\mathbf{y} \\end{cases}',
        description: 'Two-step solve: forward substitution for y, then back substitution for x. Each step is O(n²).',
        isKey: true,
      },
    ],
    content: [
      {
        type: 'text',
        content: '**Why LU Factorization?**\n\nIf we need to solve Ax = b for multiple right-hand sides b₁, b₂, ..., bₖ with the same matrix A, we can:\n1. Compute LU factorization once: O(n³)\n2. Solve each Lbᵢ = bᵢ and Uxᵢ = yᵢ: O(n²) each\n\nThis is much more efficient than running full Gaussian elimination k times.',
      },
      {
        type: 'text',
        content: '**Structure of L and U**\n\nL is unit lower triangular (1s on diagonal, zeros above):\n- The (i,j) entry of L for i > j is the multiplier m_{ij} from Gaussian elimination\n\nU is the upper triangular matrix obtained after elimination:\n- The (i,j) entry of U for i ≤ j is the final value after all eliminations',
      },
      {
        type: 'example',
        title: 'Example: LU Factorization',
        content: 'A = [2 1; 4 3]\n\nElimination: m₂₁ = 4/2 = 2\nRow 2 ← Row 2 - 2×Row 1: [0 1]\n\nL = [1 0; 2 1], U = [2 1; 0 1]\n\nVerify: LU = [1 0; 2 1][2 1; 0 1] = [2 1; 4 3] = A ✓',
      },
      {
        type: 'text',
        content: '**Multiple Right-Hand Sides**\n\nOnce PA = LU is computed, solving for any new b requires only O(n²) work:\n1. Solve Ly = Pb (forward substitution)\n2. Solve Ux = y (back substitution)\n\nThis is why LU factorization is preferred over Gaussian elimination when solving many systems with the same A.',
      },
    ],
    quiz: [
      {
        id: 'q-c2t3-1',
        question: 'Given A = LU, how do we solve Ax = b?',
        options: [
          'Compute A⁻¹ and multiply by b',
          'Solve Ly = b by forward substitution, then Ux = y by back substitution',
          'Solve Uy = b by back substitution, then Lx = y by forward substitution',
          'Use Gaussian elimination directly on b',
        ],
        correctIndex: 1,
        explanation: 'We split Ax = LUx = b into two triangular systems: first solve Ly = b (forward substitution), then solve Ux = y (back substitution).',
        topicId: 'c2t3',
      },
      {
        id: 'q-c2t3-2',
        question: 'What are the entries of L in the LU factorization?',
        options: [
          'The pivots from Gaussian elimination',
          'The multipliers m_{ij} from Gaussian elimination, with 1s on the diagonal',
          'Random lower triangular entries',
          'The same as the entries of A',
        ],
        correctIndex: 1,
        explanation: 'L is a unit lower triangular matrix. Its off-diagonal entries lᵢⱼ (i > j) are exactly the multipliers mᵢⱼ = aᵢⱼ/aⱼⱼ computed during Gaussian elimination. The diagonal entries are all 1.',
        topicId: 'c2t3',
      },
      {
        id: 'q-c2t3-3',
        question: 'If we need to solve Ax = b for 100 different right-hand sides b, what is the most efficient approach?',
        options: [
          'Run Gaussian elimination 100 times',
          'Compute A⁻¹ once and multiply each b by A⁻¹',
          'Compute LU factorization once, then do 100 pairs of triangular solves',
          'Use iterative methods for each b',
        ],
        correctIndex: 2,
        explanation: 'Computing LU once costs O(n³). Each subsequent solve costs only O(n²). This is far more efficient than 100 Gaussian eliminations (100×O(n³)) or computing A⁻¹ (unstable and O(n³)).',
        topicId: 'c2t3',
      },
    ],
  },
  {
    id: 'c2t4',
    title: 'Special Systems & Cholesky Factorization',
    lectureRef: 'L2.11–L2.12',
    formulas: [
      {
        id: 'spd-def',
        title: 'Symmetric Positive Definite (SPD) Matrix',
        latex: 'A = A^T \\text{ and } \\mathbf{x}^T A \\mathbf{x} > 0 \\text{ for all } \\mathbf{x} \\neq \\mathbf{0}',
        description: 'A matrix is SPD if it is symmetric and all eigenvalues are positive. Equivalently, all leading principal minors are positive.',
        isKey: true,
      },
      {
        id: 'cholesky',
        title: 'Cholesky Factorization',
        latex: 'A = R^T R',
        description: 'Every SPD matrix A has a unique Cholesky factorization where R is upper triangular with positive diagonal entries. Sometimes written as A = LLᵀ where L = Rᵀ.',
        isKey: true,
      },
      {
        id: 'cholesky-complexity',
        title: 'Cholesky Complexity',
        latex: '\\text{Operations} \\approx \\frac{n^3}{3} = \\frac{1}{2} \\times \\text{LU cost}',
        description: 'Cholesky is about twice as fast as LU factorization for SPD matrices, and is numerically stable without pivoting.',
        isKey: true,
      },
    ],
    content: [
      {
        type: 'text',
        content: '**Special Matrix Structures**\n\nExploiting structure in A can dramatically reduce computational cost:\n- **Banded matrices**: only O(nb²) operations where b is bandwidth\n- **Sparse matrices**: store only nonzero entries, use sparse algorithms\n- **Symmetric matrices**: only need to store/compute upper or lower triangle\n- **SPD matrices**: use Cholesky factorization (faster, no pivoting needed)',
      },
      {
        type: 'text',
        content: '**Symmetric Positive Definite Matrices**\n\nSPD matrices arise naturally in:\n- Normal equations for least squares: AᵀA is SPD (if A has full column rank)\n- Covariance matrices in statistics\n- Finite element stiffness matrices\n- Optimization (Hessian of strictly convex functions)\n\nKey property: all eigenvalues of an SPD matrix are strictly positive.',
      },
      {
        type: 'text',
        content: '**Cholesky Algorithm**\n\nFor an SPD matrix A, compute R such that A = RᵀR:\n\nFor k = 1 to n:\n  R_{kk} = √(A_{kk} - Σⱼ<ₖ R²_{jk})\n  For i = k+1 to n:\n    R_{ki} = (A_{ki} - Σⱼ<ₖ R_{jk}R_{ji}) / R_{kk}\n\nAdvantages over LU:\n- No pivoting required (numerically stable for SPD)\n- About half the operations (~n³/3 vs ~2n³/3)\n- Exploits symmetry',
      },
      {
        type: 'highlight',
        title: 'When to Use Cholesky vs LU',
        content: 'Use **Cholesky** when A is known to be symmetric positive definite (e.g., AᵀA in least squares, covariance matrices). Use **LU** for general square systems. If Cholesky fails (negative square root), the matrix is NOT positive definite.',
      },
    ],
    quiz: [
      {
        id: 'q-c2t4-1',
        question: 'Which of the following is always a symmetric positive definite matrix (assuming A has full column rank)?',
        options: ['A', 'AᵀA', 'A + Aᵀ', 'A - Aᵀ'],
        correctIndex: 1,
        explanation: 'AᵀA is always symmetric (since (AᵀA)ᵀ = AᵀA) and positive semi-definite. If A has full column rank, then AᵀA is strictly positive definite.',
        topicId: 'c2t4',
      },
      {
        id: 'q-c2t4-2',
        question: 'What is the main advantage of Cholesky factorization over LU for SPD matrices?',
        options: [
          'It works for any matrix, not just SPD',
          'It requires about half the operations and no pivoting is needed',
          'It produces a more accurate solution',
          'It can handle singular matrices',
        ],
        correctIndex: 1,
        explanation: 'Cholesky requires ~n³/3 operations (vs ~2n³/3 for LU) and is numerically stable without pivoting for SPD matrices, making it about twice as fast.',
        topicId: 'c2t4',
      },
      {
        id: 'q-c2t4-3',
        question: 'If Cholesky factorization fails (encounters a negative square root), what does this tell us about A?',
        options: [
          'A is singular',
          'A is not symmetric positive definite',
          'A is too large to factor',
          'The algorithm has a bug',
        ],
        correctIndex: 1,
        explanation: 'Cholesky factorization requires taking square roots of diagonal entries. If a diagonal entry is negative or zero, it means A is not positive definite (some eigenvalue ≤ 0).',
        topicId: 'c2t4',
      },
    ],
  },
  {
    id: 'c2t5',
    title: 'Conditioning of Linear Systems',
    lectureRef: 'L2.5–L2.6',
    formulas: [
      {
        id: 'matrix-norm',
        title: 'Matrix 2-Norm (Spectral Norm)',
        latex: '\\|A\\|_2 = \\sigma_{\\max}(A)',
        description: 'The 2-norm of a matrix equals its largest singular value.',
        isKey: true,
      },
      {
        id: 'cond-matrix',
        title: 'Condition Number of a Matrix',
        latex: '\\kappa(A) = \\|A\\| \\cdot \\|A^{-1}\\| = \\frac{\\sigma_{\\max}(A)}{\\sigma_{\\min}(A)}',
        description: 'For the 2-norm, the condition number equals the ratio of largest to smallest singular value. Measures sensitivity of Ax=b to perturbations.',
        isKey: true,
      },
      {
        id: 'perturbation-bound',
        title: 'Perturbation Bound for Linear Systems',
        latex: '\\frac{\\|\\delta \\mathbf{x}\\|}{\\|\\mathbf{x}\\|} \\leq \\kappa(A) \\cdot \\frac{\\|\\delta \\mathbf{b}\\|}{\\|\\mathbf{b}\\|}',
        description: 'The relative error in the solution is bounded by κ(A) times the relative error in b. If κ(A) is large, small errors in b lead to large errors in x.',
        isKey: true,
      },
    ],
    content: [
      {
        type: 'highlight',
        title: '📖 Notation Guide — Key Symbols in This Topic',
        content: 'This topic uses several mathematical notations. Here is what each one means:\n\n• κ(A)  (kappa of A)  — the condition number of matrix A. Measures how sensitive the solution x of Ax = b is to small changes in b or A. κ(A) ≥ 1 always; κ(A) = 1 is perfectly conditioned; κ(A) >> 1 is ill-conditioned.\n\n• ‖x‖  (norm of x)  — a measure of the "size" or "length" of a vector x. Think of it as a generalisation of absolute value to vectors. The subscript tells you which norm: ‖x‖₁ (sum of |entries|), ‖x‖₂ (Euclidean length), ‖x‖∞ (largest |entry|).\n\n• ‖A‖  (norm of matrix A)  — the induced matrix norm: the maximum factor by which A can stretch a unit vector. ‖A‖ = max over all unit vectors x of ‖Ax‖.\n\n• σ_max, σ_min  — the largest and smallest singular values of A. For the 2-norm: κ₂(A) = σ_max / σ_min.\n\n• O(n³)  (Big-O notation)  — describes how the number of arithmetic operations scales with problem size n. O(n³) means the operation count grows proportionally to n³. For n = 100: O(n²) ≈ 10,000 ops; O(n³) ≈ 1,000,000 ops — a factor of 100 more. This is why we prefer O(n²) algorithms over O(n³) when possible.\n\n• δx, δb  — small perturbations (errors) in x and b respectively. δ (delta) denotes a small change.',
      },
      {
        type: 'text',
        content: '**Conditioning of Linear Systems**\n\nThe condition number κ(A) measures how sensitive the solution x of Ax = b is to perturbations in b (or A). A large condition number means the system is ill-conditioned.',
      },
      {
        type: 'text',
        content: '**Vector Norms**\n\n- **1-norm**: ‖x‖₁ = Σ|xᵢ|\n- **2-norm (Euclidean)**: ‖x‖₂ = √(Σxᵢ²)\n- **∞-norm**: ‖x‖∞ = max|xᵢ|\n\nAll norms are equivalent (differ by at most a constant factor for finite-dimensional spaces).',
      },
      {
        type: 'text',
        content: '**Matrix Norms (Induced)**\n\nThe induced (operator) norm: ‖A‖ = max_{‖x‖=1} ‖Ax‖\n\n- **1-norm**: max column sum of |aᵢⱼ|\n- **∞-norm**: max row sum of |aᵢⱼ|\n- **2-norm (spectral)**: σ_max(A) = largest singular value\n- **Frobenius norm**: ‖A‖_F = √(Σᵢⱼ aᵢⱼ²) (not induced but useful)',
      },
      {
        type: 'highlight',
        title: 'Rule of Thumb for Condition Number',
        content: 'If κ(A) ≈ 10^k, then you lose approximately k digits of accuracy in the solution. For double precision (≈16 digits), if κ(A) ≈ 10^12, you only have about 4 reliable digits in the solution.',
      },
    ],
    quiz: [
      {
        id: 'q-c2t5-1',
        question: 'If κ(A) = 10⁸ and we solve Ax = b in double precision (≈16 significant digits), approximately how many reliable digits do we expect in x?',
        options: ['16', '8', '4', '0'],
        correctIndex: 1,
        explanation: 'The condition number κ(A) = 10⁸ means we lose about 8 digits of accuracy. With 16 digits of double precision, we expect about 16 - 8 = 8 reliable digits.',
        topicId: 'c2t5',
      },
      {
        id: 'q-c2t5-2',
        question: 'For the 2-norm, the condition number of A equals:',
        options: [
          'The ratio of the largest to smallest eigenvalue',
          'The ratio of the largest to smallest singular value',
          'The trace of A divided by n',
          'The determinant of A',
        ],
        correctIndex: 1,
        explanation: 'κ₂(A) = ‖A‖₂ · ‖A⁻¹‖₂ = σ_max / σ_min, the ratio of largest to smallest singular value.',
        topicId: 'c2t5',
      },
    ],
  },
];

// ============================================================
// CHAPTER 3: LEAST SQUARES PROBLEMS (L3.1 – L3.8)
// ============================================================

const chapter3Topics: Topic[] = [
  {
    id: 'c3t1',
    title: 'Introduction to Least Squares & Linear Models',
    lectureRef: 'L3.1, L2.13',
    formulas: [
      {
        id: 'ls-problem',
        title: 'Least Squares Problem',
        latex: '\\min_{\\mathbf{x} \\in \\mathbb{R}^n} \\|A\\mathbf{x} - \\mathbf{b}\\|_2^2',
        description: 'Given overdetermined system Ax ≈ b (m equations, n unknowns, m > n), find x that minimizes the sum of squared residuals.',
        isKey: true,
      },
      {
        id: 'normal-equations',
        title: 'Normal Equations',
        latex: 'A^T A \\mathbf{x} = A^T \\mathbf{b}',
        description: 'The necessary and sufficient conditions for x to minimize ‖Ax - b‖₂. If A has full column rank, AᵀA is SPD and the solution is unique.',
        isKey: true,
      },
      {
        id: 'ls-solution',
        title: 'Least Squares Solution (Full Rank)',
        latex: '\\hat{\\mathbf{x}} = (A^T A)^{-1} A^T \\mathbf{b} = A^+ \\mathbf{b}',
        description: 'A⁺ = (AᵀA)⁻¹Aᵀ is the Moore-Penrose pseudoinverse. Only valid when A has full column rank.',
        isKey: true,
      },
    ],
    content: [
      {
        type: 'highlight',
        title: '📖 Notation Guide — Key Symbols in This Chapter',
        content: 'Chapter 3 introduces several new notations. Here is what each one means:\n\n• ‖Ax − b‖₂  — the 2-norm (Euclidean length) of the residual vector (Ax − b). This is the square root of the sum of squared residuals. Minimising ‖Ax − b‖₂ is equivalent to minimising ‖Ax − b‖₂² (the sum of squares), which is the least squares criterion.\n\n• Aᵀ  (A-transpose)  — the matrix obtained by flipping A across its diagonal (rows become columns). If A is m×n, then Aᵀ is n×m. Entry (i,j) of Aᵀ equals entry (j,i) of A.\n\n• AᵀA  — the n×n matrix formed by multiplying A-transpose by A. It is always symmetric and positive semi-definite. When A has full column rank, AᵀA is symmetric positive definite (SPD) and invertible.\n\n• x̂  (x-hat)  — the least squares solution, i.e., the x that minimises ‖Ax − b‖₂. The hat (̂) conventionally denotes an estimated or optimal value.\n\n• r = b − Ax̂  — the residual vector. It measures how far the best fit Ax̂ is from the data b. In a well-fitted model, residuals are small.\n\n• ℝᵐ  — the set of all m-dimensional real vectors (m-dimensional Euclidean space). ℝⁿ means n-dimensional real space.\n\n• A⁺ = (AᵀA)⁻¹Aᵀ  — the Moore-Penrose pseudoinverse of A. When A has full column rank, x̂ = A⁺b gives the unique least squares solution.\n\n• Q, R  — the matrices from QR factorization: Q is orthogonal (QᵀQ = I, columns are orthonormal), R is upper triangular. QR gives a numerically stable way to solve least squares.',
      },
      {
        type: 'text',
        content: '**The Overdetermined System Problem**\n\nIn practice, we often have more equations than unknowns (m > n). For example:\n- Fitting a line to 100 data points: 100 equations, 2 unknowns\n- Multiple linear regression: more observations than predictors\n\nSuch systems are generally inconsistent (no exact solution), so we find the x that makes Ax as close to b as possible.',
      },
      {
        type: 'text',
        content: '**Geometric Interpretation**\n\nThe columns of A span a subspace of ℝᵐ. The vector b may not lie in this subspace. The least squares solution finds the point Ax̂ in the column space of A that is closest to b. The residual r = b - Ax̂ is perpendicular (orthogonal) to the column space of A.',
      },
      {
        type: 'text',
        content: '**Linear Models**\n\n- **Simple Linear Regression**: y = β₀ + β₁x + ε\n- **Multiple Linear Regression**: y = β₀ + β₁x₁ + ... + βₙxₙ + ε\n- **Polynomial Regression**: y = β₀ + β₁x + β₂x² + ... + βₙxⁿ + ε\n\nAll can be written as y = Aβ + ε where A is the design matrix.',
      },
      {
        type: 'example',
        title: 'Example: Simple Linear Regression via Normal Equations',
        content: 'Data: (1,2), (2,3), (3,5). Fit y = β₀ + β₁x.\n\nDesign matrix A = [1 1; 1 2; 1 3], b = [2; 3; 5]\n\nAᵀA = [3 6; 6 14], Aᵀb = [10; 23]\n\nNormal equations: [3 6; 6 14][β₀; β₁] = [10; 23]\n\nSolve: β₁ = (3×23 - 6×10)/(3×14 - 6²) = (69-60)/(42-36) = 9/6 = 1.5\nβ₀ = (10 - 6×1.5)/3 = 1/3 ≈ 0.333\n\nFitted line: ŷ = 0.333 + 1.5x',
      },
      {
        type: 'video',
        videoId: 'PjeOmOz9jSY',
        videoTitle: 'Least Squares Regression — StatQuest with Josh Starmer',
        content: '',
      },
    ],
    quiz: [
      {
        id: 'q-c3t1-1',
        question: 'What does the least squares solution minimize?',
        options: [
          'The maximum absolute residual',
          'The sum of squared residuals ‖Ax - b‖₂²',
          'The sum of absolute residuals ‖Ax - b‖₁',
          'The number of nonzero residuals',
        ],
        correctIndex: 1,
        explanation: 'The least squares solution minimizes the sum of squared residuals ‖Ax - b‖₂² = Σᵢ(aᵢᵀx - bᵢ)². This is the 2-norm squared.',
        topicId: 'c3t1',
      },
      {
        id: 'q-c3t1-2',
        question: 'What are the normal equations for the least squares problem min‖Ax - b‖₂?',
        options: [
          'Ax = b',
          'AᵀAx = Aᵀb',
          'AAᵀx = b',
          'A⁻¹b = x',
        ],
        correctIndex: 1,
        explanation: 'The normal equations AᵀAx = Aᵀb are derived by setting the gradient of ‖Ax - b‖₂² to zero. They are necessary and sufficient conditions for the least squares solution.',
        topicId: 'c3t1',
      },
      {
        id: 'q-c3t1-3',
        question: 'Geometrically, what is the residual r = b - Ax̂ in the least squares solution?',
        options: [
          'It lies in the column space of A',
          'It is orthogonal to the column space of A',
          'It is parallel to b',
          'It is zero',
        ],
        correctIndex: 1,
        explanation: 'The residual r = b - Ax̂ is orthogonal to the column space of A. This is why the normal equations are Aᵀr = 0, i.e., Aᵀ(b - Ax̂) = 0.',
        topicId: 'c3t1',
      },
    ],
  },
  {
    id: 'c3t2',
    title: 'Theory & Conditioning of Least Squares',
    lectureRef: 'L3.2',
    formulas: [
      {
        id: 'ls-cond',
        title: 'Condition Number for Least Squares',
        latex: '\\kappa_{LS} = \\kappa(A) + \\|\\mathbf{r}\\|_2 \\cdot \\kappa(A)^2 / (\\|A\\|_2 \\|\\mathbf{x}\\|_2)',
        description: 'The condition number for the least squares problem depends on κ(A) and the residual norm. When the residual is small, it simplifies to approximately κ(A).',
        isKey: false,
      },
      {
        id: 'ls-existence',
        title: 'Existence & Uniqueness',
        latex: '\\text{Unique solution} \\iff \\text{rank}(A) = n \\iff A^T A \\text{ is invertible}',
        description: 'The least squares solution is unique if and only if A has full column rank (rank = n). Otherwise there are infinitely many solutions.',
        isKey: true,
      },
    ],
    content: [
      {
        type: 'text',
        content: '**Existence and Uniqueness**\n\nThe least squares problem always has at least one solution. It has a unique solution if and only if A has full column rank (rank(A) = n), equivalently AᵀA is invertible.\n\nIf A does not have full column rank (columns are linearly dependent), there are infinitely many solutions — we typically pick the minimum-norm solution using the pseudoinverse.',
      },
      {
        type: 'text',
        content: '**Sensitivity and Conditioning**\n\nThe condition number of the least squares problem is more complex than for square systems:\n- If the residual ‖r‖ is small (good fit), the sensitivity is approximately κ(A)\n- If the residual is large, the sensitivity can be as large as κ(A)²\n\nThis is why solving via normal equations (which involve AᵀA with condition number κ(A)²) can be less accurate than QR-based methods.',
      },
      {
        type: 'warning',
        title: 'Normal Equations Can Be Ill-Conditioned',
        content: 'The condition number of AᵀA is κ(AᵀA) = κ(A)². If κ(A) = 10⁶, then κ(AᵀA) = 10¹². This means solving via normal equations can lose twice as many digits of accuracy as QR-based methods.',
      },
    ],
    quiz: [
      {
        id: 'q-c3t2-1',
        question: 'When does the least squares problem have a unique solution?',
        options: [
          'Always (least squares always has a unique solution)',
          'When A has full column rank (rank(A) = n)',
          'When A is square',
          'When b is in the column space of A',
        ],
        correctIndex: 1,
        explanation: 'The least squares solution is unique if and only if A has full column rank (rank = n), which is equivalent to AᵀA being invertible.',
        topicId: 'c3t2',
      },
      {
        id: 'q-c3t2-2',
        question: 'If κ(A) = 10³, what is the condition number of AᵀA?',
        options: ['10³', '10⁶', '10^1.5', '2×10³'],
        correctIndex: 1,
        explanation: 'κ(AᵀA) = κ(A)² = (10³)² = 10⁶. This is why solving via normal equations squares the condition number, potentially losing twice as many digits of accuracy.',
        topicId: 'c3t2',
      },
    ],
  },
  {
    id: 'c3t3',
    title: 'QR Factorization & Gram-Schmidt',
    lectureRef: 'L3.3, L3.5, L3.6',
    formulas: [
      {
        id: 'qr-factorization',
        title: 'QR Factorization (Thin)',
        latex: 'A = \\hat{Q}\\hat{R}, \\quad \\hat{Q} \\in \\mathbb{R}^{m \\times n}, \\; \\hat{R} \\in \\mathbb{R}^{n \\times n}',
        description: 'A is factored into Q with orthonormal columns and upper triangular R. The "thin" QR uses only n columns of Q.',
        isKey: true,
      },
      {
        id: 'qr-full',
        title: 'QR Factorization (Full)',
        latex: 'A = QR = Q\\begin{pmatrix}\\hat{R} \\\\ 0\\end{pmatrix}, \\quad Q \\in \\mathbb{R}^{m \\times m} \\text{ orthogonal}',
        description: 'Full QR uses a square orthogonal Q. The lower rows of R are zero.',
        isKey: false,
      },
      {
        id: 'ls-via-qr',
        title: 'Least Squares via QR',
        latex: '\\hat{\\mathbf{x}} = \\hat{R}^{-1} \\hat{Q}^T \\mathbf{b}',
        description: 'Solve the least squares problem using QR: compute Qᵀb, then solve the triangular system Rx = Qᵀb by back substitution.',
        isKey: true,
      },
      {
        id: 'gram-schmidt',
        title: 'Classical Gram-Schmidt',
        latex: '\\mathbf{q}_k = \\frac{\\mathbf{v}_k - \\sum_{j=1}^{k-1} (\\mathbf{q}_j^T \\mathbf{a}_k) \\mathbf{q}_j}{\\|\\mathbf{v}_k - \\sum_{j=1}^{k-1} (\\mathbf{q}_j^T \\mathbf{a}_k) \\mathbf{q}_j\\|}',
        description: 'Orthogonalize each new vector against all previous orthonormal vectors, then normalize. Numerically unstable for nearly dependent columns.',
        isKey: true,
      },
      {
        id: 'modified-gs',
        title: 'Modified Gram-Schmidt (Numerically Stable)',
        latex: '\\text{Project out each } \\mathbf{q}_j \\text{ sequentially from } \\mathbf{v}_k',
        description: 'Modified GS projects out each previous q_j one at a time (rather than all at once). Mathematically equivalent but numerically more stable.',
        isKey: true,
      },
    ],
    content: [
      {
        type: 'text',
        content: '**QR Factorization**\n\nEvery m×n matrix A (m ≥ n) with full column rank can be factored as A = QR where:\n- Q is m×n with orthonormal columns (Qᵀ Q = I)\n- R is n×n upper triangular with positive diagonal entries\n\nQR factorization is the preferred method for solving least squares problems because it avoids squaring the condition number.',
      },
      {
        type: 'text',
        content: '**Solving Least Squares via QR**\n\nGiven A = QR (thin QR):\n‖Ax - b‖₂² = ‖QRx - b‖₂² = ‖Rx - Qᵀb‖₂² + ‖(I - QQᵀ)b‖₂²\n\nThe second term is fixed (doesn\'t depend on x). Minimizing means solving:\nRx = Qᵀb (upper triangular, solve by back substitution)\n\nThis is numerically more stable than the normal equations.',
      },
      {
        type: 'text',
        content: '**Classical vs Modified Gram-Schmidt**\n\n**Classical GS**: For each column aₖ, subtract projections onto all previous q₁,...,qₖ₋₁ simultaneously.\n\n**Modified GS**: For each column aₖ, subtract projection onto q₁, then onto q₂, etc., one at a time.\n\nMathematically identical in exact arithmetic, but modified GS is more numerically stable because it uses the updated (partially orthogonalized) vector at each step.',
      },
      {
        type: 'example',
        title: 'Example: Gram-Schmidt (2 columns)',
        content: 'A = [1 1; 1 0; 0 1] (columns a₁, a₂)\n\nStep 1: q₁ = a₁/‖a₁‖ = [1;1;0]/√2 = [1/√2; 1/√2; 0]\n\nStep 2: v₂ = a₂ - (q₁ᵀa₂)q₁\nq₁ᵀa₂ = (1/√2)(1) + (1/√2)(0) + 0(1) = 1/√2\nv₂ = [1;0;1] - (1/√2)[1/√2;1/√2;0] = [1-1/2; -1/2; 1] = [1/2; -1/2; 1]\nq₂ = v₂/‖v₂‖, ‖v₂‖ = √(1/4+1/4+1) = √(3/2)\nq₂ = [1/√6; -1/√6; 2/√6]',
      },
      {
        type: 'video',
        videoId: 'TRktLuAktBQ',
        videoTitle: 'Gram-Schmidt Orthogonalization — MIT 18.06SC Linear Algebra',
        content: '',
      },
    ],
    quiz: [
      {
        id: 'q-c3t3-1',
        question: 'In the QR factorization A = QR, what property does Q have?',
        options: [
          'Q is upper triangular',
          'Q has orthonormal columns (Qᵀ Q = I)',
          'Q is symmetric',
          'Q is the same as A',
        ],
        correctIndex: 1,
        explanation: 'In QR factorization, Q has orthonormal columns, meaning Qᵀ Q = I. For the full QR, Q is also square and orthogonal (QQᵀ = I as well).',
        topicId: 'c3t3',
      },
      {
        id: 'q-c3t3-2',
        question: 'Why is solving least squares via QR preferred over the normal equations?',
        options: [
          'QR is faster (O(n²) vs O(n³))',
          'QR avoids squaring the condition number (κ(A) vs κ(A)²)',
          'QR always gives the exact solution',
          'Normal equations cannot be solved numerically',
        ],
        correctIndex: 1,
        explanation: 'Solving via normal equations involves AᵀA with condition number κ(A)². QR-based methods work with A directly, maintaining condition number κ(A), giving more accurate results.',
        topicId: 'c3t3',
      },
      {
        id: 'q-c3t3-3',
        question: 'What is the key difference between Classical and Modified Gram-Schmidt?',
        options: [
          'Modified GS uses a different inner product',
          'Classical GS subtracts all projections at once; Modified GS subtracts them sequentially',
          'Modified GS is slower but produces the same result',
          'Classical GS is more numerically stable',
        ],
        correctIndex: 1,
        explanation: 'Classical GS subtracts all projections simultaneously. Modified GS subtracts them one at a time using the updated vector. They are mathematically equivalent but Modified GS is numerically more stable.',
        topicId: 'c3t3',
      },
      {
        id: 'q-c3t3-4',
        question: 'Given A = Q̂R̂ (thin QR), how do we solve the least squares problem min‖Ax - b‖₂?',
        options: [
          'Solve AᵀAx = Aᵀb',
          'Compute x = Q̂ᵀb and then solve R̂x = Q̂ᵀb by back substitution',
          'Compute x = R̂⁻¹Q̂ᵀb by solving R̂x = Q̂ᵀb',
          'Compute x = (Q̂R̂)⁻¹b',
        ],
        correctIndex: 2,
        explanation: 'With A = Q̂R̂, the least squares solution satisfies R̂x = Q̂ᵀb. We compute c = Q̂ᵀb (matrix-vector multiply), then solve R̂x = c by back substitution.',
        topicId: 'c3t3',
      },
    ],
  },
  {
    id: 'c3t4',
    title: 'Householder Reflections & Givens Rotations',
    lectureRef: 'L3.7, L3.8',
    formulas: [
      {
        id: 'householder',
        title: 'Householder Reflection Matrix',
        latex: 'H = I - 2\\mathbf{v}\\mathbf{v}^T, \\quad \\|\\mathbf{v}\\|_2 = 1',
        description: 'H is orthogonal (HᵀH = I) and symmetric (H = Hᵀ), so H² = I. It reflects vectors across the hyperplane perpendicular to v.',
        isKey: true,
      },
      {
        id: 'householder-choice',
        title: 'Householder Vector for Zeroing Subdiagonal',
        latex: '\\mathbf{v} = \\mathbf{x} + \\text{sign}(x_1)\\|\\mathbf{x}\\|_2 \\mathbf{e}_1, \\quad \\text{then normalize}',
        description: 'Choose v so that Hx = -sign(x₁)‖x‖e₁. The sign choice avoids cancellation.',
        isKey: true,
      },
      {
        id: 'givens',
        title: 'Givens Rotation Matrix',
        latex: 'G(i,j,\\theta) = \\begin{pmatrix} \\cos\\theta & \\sin\\theta \\\\ -\\sin\\theta & \\cos\\theta \\end{pmatrix} \\text{ in rows/cols } i,j',
        description: 'A Givens rotation zeros out a single entry by rotating in the (i,j) plane. c = cos θ, s = sin θ chosen so that the target entry becomes zero.',
        isKey: true,
      },
      {
        id: 'givens-cs',
        title: 'Givens Rotation Parameters',
        latex: 'c = \\frac{a}{\\sqrt{a^2+b^2}}, \\quad s = \\frac{-b}{\\sqrt{a^2+b^2}} \\quad \\text{to zero out } b',
        description: 'To zero out entry b using entry a as the pivot, use these values of c and s.',
        isKey: true,
      },
    ],
    content: [
      {
        type: 'text',
        content: '**Householder Reflections**\n\nA Householder reflection H = I - 2vvᵀ (where ‖v‖ = 1) is an orthogonal matrix that reflects vectors across the hyperplane perpendicular to v.\n\nKey properties:\n- H is orthogonal: HᵀH = I\n- H is symmetric: H = Hᵀ\n- H² = I (reflection applied twice = identity)\n- H has eigenvalues +1 (n-1 times) and -1 (once)',
      },
      {
        type: 'text',
        content: '**Using Householder for QR**\n\nAt each step k, choose Hₖ to zero out all entries below the diagonal in column k:\n1. Extract the subvector x = A[k:m, k]\n2. Compute v = x + sign(x₁)‖x‖e₁, normalize\n3. Apply Hₖ = I - 2vvᵀ to A from the left\n\nAfter n steps: Hₙ...H₂H₁A = R (upper triangular)\nSo A = H₁H₂...HₙR = QR where Q = H₁H₂...Hₙ',
      },
      {
        type: 'text',
        content: '**Givens Rotations**\n\nA Givens rotation zeros out a single entry by rotating in a 2D plane. More targeted than Householder (zeros one entry vs. all entries in a column).\n\nUseful for:\n- Sparse matrices (don\'t want to destroy sparsity)\n- Banded matrices\n- Updating QR factorization when a row is added/removed\n\nCost: O(n) per rotation, O(n²) rotations needed → O(n³) total for QR',
      },
      {
        type: 'highlight',
        title: 'Comparison of QR Algorithms',
        content: '**Gram-Schmidt**: Computes Q explicitly, numerically less stable (classical) or stable (modified). O(mn²) operations.\n\n**Householder**: Most numerically stable, doesn\'t form Q explicitly (stores v vectors). O(2mn² - 2n³/3) operations. Preferred for dense matrices.\n\n**Givens**: More flexible, good for sparse/banded matrices. O(mn²) operations.',
      },
      {
        type: 'video',
        videoId: 'FAnNBw7d0vg',
        videoTitle: 'Householder Reflections for QR Factorization',
        content: '',
      },
    ],
    quiz: [
      {
        id: 'q-c3t4-1',
        question: 'What are the key properties of a Householder reflection matrix H = I - 2vvᵀ?',
        options: [
          'H is symmetric and positive definite',
          'H is orthogonal (HᵀH = I) and symmetric (H = Hᵀ)',
          'H is upper triangular',
          'H has all eigenvalues equal to -1',
        ],
        correctIndex: 1,
        explanation: 'H = I - 2vvᵀ is both orthogonal (HᵀH = HH = I since H² = I) and symmetric (Hᵀ = H). It has eigenvalue -1 (once, for v) and +1 (n-1 times, for vectors ⊥ to v).',
        topicId: 'c3t4',
      },
      {
        id: 'q-c3t4-2',
        question: 'Why is the sign choice in the Householder vector v = x + sign(x₁)‖x‖e₁ important?',
        options: [
          'To ensure H is positive definite',
          'To avoid catastrophic cancellation when x₁ is close to -‖x‖',
          'To make the computation faster',
          'To ensure R has positive diagonal entries',
        ],
        correctIndex: 1,
        explanation: 'If we always used +‖x‖, then when x₁ is negative, x₁ + ‖x‖ would be a subtraction of nearly equal numbers (catastrophic cancellation). Using sign(x₁) ensures we always add, avoiding cancellation.',
        topicId: 'c3t4',
      },
      {
        id: 'q-c3t4-3',
        question: 'When is Givens rotation preferred over Householder reflection?',
        options: [
          'Always — Givens is more numerically stable',
          'For dense matrices where we want to zero entire columns at once',
          'For sparse or banded matrices where we want to zero individual entries',
          'When the matrix is symmetric positive definite',
        ],
        correctIndex: 2,
        explanation: 'Givens rotations zero out one entry at a time, making them ideal for sparse or banded matrices where applying a Householder reflection would destroy the sparsity structure.',
        topicId: 'c3t4',
      },
    ],
  },
];

// ============================================================
// ASSEMBLED CHAPTERS
// ============================================================

export const chapters: Chapter[] = [
  {
    id: 'ch1',
    number: 1,
    title: 'Scientific Computing',
    subtitle: 'Approximation, Error & Floating Point Arithmetic',
    bgImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663399467971/gAzQjKP5PP6fvZg3ueXhxZ/chapter1-bg-RRjMLztEetNSgEiQXLJR9q.webp',
    accentColor: '#1A7A8A',
    icon: '🌊',
    topics: chapter1Topics,
  },
  {
    id: 'ch2',
    number: 2,
    title: 'Systems of Linear Equations',
    subtitle: 'Gaussian Elimination, LU & Cholesky Factorization',
    bgImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663399467971/gAzQjKP5PP6fvZg3ueXhxZ/chapter2-bg-5vMirLbfwLEZmzUXQgxiCg.webp',
    accentColor: '#2A5C3F',
    icon: '🌿',
    topics: chapter2Topics,
  },
  {
    id: 'ch3',
    number: 3,
    title: 'Least Squares Problems',
    subtitle: 'Normal Equations, QR Factorization & Gram-Schmidt',
    bgImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663399467971/gAzQjKP5PP6fvZg3ueXhxZ/chapter3-bg-i98WYGubeocE5dRwHbhbQP.webp',
    accentColor: '#C4622D',
    icon: '🏔️',
    topics: chapter3Topics,
  },
];

// All quiz questions flattened
export const allQuestions: QuizQuestion[] = chapters.flatMap(ch =>
  ch.topics.flatMap(t => t.quiz)
);

// All formulas flattened
export const allFormulas: Formula[] = chapters.flatMap(ch =>
  ch.topics.flatMap(t => t.formulas)
);
