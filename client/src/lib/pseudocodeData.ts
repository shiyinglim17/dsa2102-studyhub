// ============================================================
// DSA2102 Pseudocode Bank
// Design: Tropical Golden Hour Study Retreat
// All pseudocodes, operation count derivations, and time complexity
// sourced strictly from school lecture notes (L2.2, L2.6, L2.9, L2.12, L3.3, L3.6, L3.7, L3.8)
// ============================================================

export interface PseudocodeEntry {
  id: string;
  title: string;
  subtitle: string;
  chapter: string;
  chapterId: string;
  topic: string;
  topicId: string;
  tags: string[];
  pseudocode: string[];   // lines of pseudocode (indented with spaces)
  explanation: string;    // plain-English walkthrough
  operationDerivation: {
    title: string;
    latex: string;        // LaTeX for the derivation
    plain: string;        // plain-text fallback
  }[];
  summary: {
    divisions?: string;
    multiplications?: string;
    additions?: string;
    squareRoots?: string;
    comparisons?: string;
    dominant?: string;
    complexity: string;
    note?: string;
  };
  warnings?: string[];
}

export const pseudocodes: PseudocodeEntry[] = [
  // ─────────────────────────────────────────────────────────────
  // CHAPTER 1 — Scientific Computing
  // ─────────────────────────────────────────────────────────────
  {
    id: 'matrix-mul-general',
    title: 'General Matrix Multiplication',
    subtitle: 'C = A × B for A ∈ ℝᵐˣⁿ, B ∈ ℝⁿˣᵖ',
    chapter: 'Chapter 1 — Scientific Computing',
    chapterId: 'chapter1',
    topic: 'Approximation, Error & Problem Conditioning',
    topicId: 'c1t1',
    tags: ['matrix multiplication', 'operation count', 'complexity', 'O(n³)'],
    pseudocode: [
      'Algorithm: General Matrix Multiplication C = A × B',
      '  Input:  A ∈ ℝᵐˣⁿ,  B ∈ ℝⁿˣᵖ',
      '  Output: C ∈ ℝᵐˣᵖ',
      '',
      '  1: for i = 1, …, m do',
      '  2:   for j = 1, …, p do',
      '  3:     c_ij ← a_i1 · b_1j',
      '  4:     for k = 2, …, n do',
      '  5:       c_ij ← c_ij + a_ik · b_kj',
      '  6:     end for',
      '  7:   end for',
      '  8: end for',
      '  9: return C = (c_ij)_{m×p}',
    ],
    explanation:
      'For each output entry c_ij, we initialise it with the first product a_i1·b_1j (one multiplication), then accumulate the remaining n−1 products a_ik·b_kj (one multiplication + one addition each). The three nested loops give the total operation count.',
    operationDerivation: [
      {
        title: 'Number of multiplications',
        latex: '\\sum_{i=1}^{m}\\sum_{j=1}^{p}\\left(1 + \\sum_{k=2}^{n}1\\right) = \\sum_{i=1}^{m}\\sum_{j=1}^{p} n = mnp',
        plain: 'Σᵢ Σⱼ (1 + (n−1)) = Σᵢ Σⱼ n = mnp',
      },
      {
        title: 'Number of additions',
        latex: '\\sum_{i=1}^{m}\\sum_{j=1}^{p}\\sum_{k=2}^{n}1 = \\sum_{i=1}^{m}\\sum_{j=1}^{p}(n-1) = m(n-1)p',
        plain: 'Σᵢ Σⱼ (n−1) = m(n−1)p',
      },
    ],
    summary: {
      multiplications: 'mnp',
      additions: 'm(n−1)p',
      dominant: 'mnp  (for large n)',
      complexity: 'O(mnp) — for square n×n matrices: O(n³)',
    },
  },
  {
    id: 'matrix-mul-upper-tri',
    title: 'Matrix × Upper Triangular (P2)',
    subtitle: 'C = A × B for A ∈ ℝᵐˣⁿ, B ∈ ℝⁿˣⁿ upper triangular',
    chapter: 'Chapter 1 — Scientific Computing',
    chapterId: 'chapter1',
    topic: 'Approximation, Error & Problem Conditioning',
    topicId: 'c1t1',
    tags: ['matrix multiplication', 'upper triangular', 'operation count', 'P2'],
    pseudocode: [
      'Algorithm: Multiply A by upper triangular B (P2)',
      '  Input:  A ∈ ℝᵐˣⁿ,  B ∈ ℝⁿˣⁿ upper triangular',
      '  Output: C ∈ ℝᵐˣⁿ',
      '',
      '  1: for i = 1, …, m do',
      '  2:   for j = 1, …, n do',
      '  3:     c_ij ← a_i1 · b_1j',
      '  4:     for k = 2, …, j do      ← only up to j (upper triangular)',
      '  5:       c_ij ← c_ij + a_ik · b_kj',
      '  6:     end for',
      '  7:   end for',
      '  8: end for',
      '  9: return C = (c_ij)_{m×n}',
    ],
    explanation:
      'Because B is upper triangular, b_kj = 0 whenever k > j. So the inner loop only runs from k = 1 to k = j, saving roughly half the work compared to general matrix multiplication.',
    operationDerivation: [
      {
        title: 'Number of multiplications',
        latex: '\\sum_{i=1}^{m}\\sum_{j=1}^{n}j = m\\cdot\\frac{n(n+1)}{2}',
        plain: 'Σᵢ Σⱼ j = m · n(n+1)/2',
      },
      {
        title: 'Number of additions',
        latex: '\\sum_{i=1}^{m}\\sum_{j=1}^{n}(j-1) = m\\cdot\\frac{n(n-1)}{2}',
        plain: 'Σᵢ Σⱼ (j−1) = m · n(n−1)/2',
      },
    ],
    summary: {
      multiplications: 'mn(n+1)/2  ≈  mn²/2',
      additions: 'mn(n−1)/2  ≈  mn²/2',
      dominant: 'mn²/2',
      complexity: 'O(mn²) — roughly half the cost of general multiplication',
    },
  },
  {
    id: 'matrix-mul-lower-lower',
    title: 'Lower Triangular × Lower Triangular (P3)',
    subtitle: 'C = A × B for A, B ∈ ℝⁿˣⁿ both lower triangular',
    chapter: 'Chapter 1 — Scientific Computing',
    chapterId: 'chapter1',
    topic: 'Approximation, Error & Problem Conditioning',
    topicId: 'c1t1',
    tags: ['matrix multiplication', 'lower triangular', 'operation count', 'P3'],
    pseudocode: [
      'Algorithm: Multiply two lower triangular matrices (P3)',
      '  Input:  A, B ∈ ℝⁿˣⁿ, both lower triangular',
      '  Output: C ∈ ℝⁿˣⁿ (also lower triangular)',
      '',
      '  1: Set c_ij = 0 for all 1 ≤ i < j ≤ n   (upper part is zero)',
      '  2: for i = 1, …, n do',
      '  3:   for j = 1, …, i do',
      '  4:     c_ij ← a_ij · b_jj              ← initialise with k=j term',
      '  5:     for k = j+1, …, i do',
      '  6:       c_ij ← c_ij + a_ik · b_kj',
      '  7:     end for',
      '  8:   end for',
      '  9: end for',
      ' 10: return C = (c_ij)_{n×n}',
    ],
    explanation:
      'Both matrices are lower triangular, so c_ij = Σₖ a_ik·b_kj is nonzero only for k between j and i. The double restriction (j ≤ k ≤ i) makes this roughly 1/6 the cost of general multiplication.',
    operationDerivation: [
      {
        title: 'Number of multiplications',
        latex: '\\sum_{i=1}^{n}\\sum_{j=1}^{i}(i-j+1) = \\sum_{i=1}^{n}\\frac{i(i+1)}{2} = \\frac{n(n+1)(n+2)}{6}',
        plain: 'Σᵢ Σⱼ (i−j+1) = Σᵢ i(i+1)/2 = n(n+1)(n+2)/6',
      },
      {
        title: 'Number of additions',
        latex: '\\sum_{i=1}^{n}\\sum_{j=1}^{i}(i-j) = \\frac{(n-1)n(n+1)}{6}',
        plain: 'Σᵢ Σⱼ (i−j) = (n−1)n(n+1)/6',
      },
    ],
    summary: {
      multiplications: 'n(n+1)(n+2)/6  ≈  n³/6',
      additions: '(n−1)n(n+1)/6  ≈  n³/6',
      dominant: 'n³/6',
      complexity: 'O(n³) — approximately 1/6 the cost of general n×n multiplication',
    },
  },

  // ─────────────────────────────────────────────────────────────
  // CHAPTER 2 — Linear Systems
  // ─────────────────────────────────────────────────────────────
  {
    id: 'gaussian-elimination',
    title: 'Gaussian Elimination (Elimination Phase)',
    subtitle: 'Reduce augmented matrix Ã = (A|b) to upper triangular form',
    chapter: 'Chapter 2 — Linear Systems',
    chapterId: 'chapter2',
    topic: 'Gaussian Elimination',
    topicId: 'c2t2',
    tags: ['Gaussian elimination', 'elimination', 'LU', 'augmented matrix', 'O(n³)'],
    pseudocode: [
      'Algorithm: Gaussian Elimination (Elimination Phase)',
      '  Input:  Ã = (a_ij)_{n×(n+1)}  [augmented matrix]',
      '  Output: Upper triangular augmented matrix',
      '',
      '  1: for i = 1, …, n−1 do          ← pivot column',
      '  2:   for j = i+1, …, n do        ← row to eliminate',
      '  3:     m_ji ← a_ji / a_ii        ← compute multiplier',
      '  4:     for k = i+1, …, n+1 do    ← update row j',
      '  5:       a_jk ← a_jk − m_ji · a_ik',
      '  6:     end for',
      '  7:   end for',
      '  8: end for',
    ],
    explanation:
      'For each pivot column i, we compute the multiplier m_ji = a_ji/a_ii for every row j below the pivot, then subtract m_ji times row i from row j. The inner-most loop updates all entries to the right of the pivot (including the RHS column). After all n−1 steps, the matrix is upper triangular.',
    operationDerivation: [
      {
        title: 'Number of divisions (computing multipliers)',
        latex: '\\sum_{i=1}^{n-1}\\sum_{j=i+1}^{n}1 = \\sum_{i=1}^{n-1}(n-i) = \\frac{n(n-1)}{2}',
        plain: 'Σᵢ₌₁ⁿ⁻¹ (n−i) = n(n−1)/2',
      },
      {
        title: 'Number of multiplications (= number of subtractions)',
        latex: '\\sum_{i=1}^{n-1}\\sum_{j=i+1}^{n}\\sum_{k=i+1}^{n+1}1 = \\sum_{i=1}^{n-1}(n-i)(n-i+1)',
        plain: 'Σᵢ Σⱼ (n−i+1) = Σᵢ (n−i)(n−i+1)',
      },
      {
        title: 'Evaluating the double sum',
        latex: '\\sum_{i=1}^{n-1}(n-i)(n-i+1) = \\sum_{i=1}^{n-1}(n-i)^2 + \\sum_{i=1}^{n-1}(n-i) = \\frac{(n-1)n(2n-1)}{6} + \\frac{n(n-1)}{2} = \\frac{n(n-1)(n+1)}{3}',
        plain: 'Σ(n−i)² + Σ(n−i) = (n−1)n(2n−1)/6 + n(n−1)/2 = n(n−1)(n+1)/3',
      },
    ],
    summary: {
      divisions: 'n(n−1)/2',
      multiplications: 'n(n−1)(n+1)/3  ≈  n³/3',
      additions: 'n(n−1)(n+1)/3  ≈  n³/3',
      dominant: 'n³/3  (multiplications + subtractions)',
      complexity: 'O(n³)',
      note: 'Dominant cost is the elimination phase; backward substitution adds only O(n²).',
    },
  },
  {
    id: 'backward-substitution',
    title: 'Backward Substitution',
    subtitle: 'Solve upper triangular system Ux = b after elimination',
    chapter: 'Chapter 2 — Linear Systems',
    chapterId: 'chapter2',
    topic: 'Triangular Systems',
    topicId: 'c2t1',
    tags: ['backward substitution', 'triangular system', 'upper triangular', 'O(n²)'],
    pseudocode: [
      'Algorithm: Backward Substitution',
      '  Input:  Upper triangular augmented matrix Ã = (a_ij)_{n×(n+1)}',
      '  Output: Solution vector (x_1, …, x_n)ᵀ',
      '',
      '  1: x_n ← a_{n,n+1} / a_nn          ← solve last equation directly',
      '  2: for i = n−1, …, 1 do',
      '  3:   x_i ← a_{i,n+1}               ← start with RHS',
      '  4:   for j = i+1, …, n do',
      '  5:     x_i ← x_i − a_ij · x_j      ← subtract known terms',
      '  6:   end for',
      '  7:   x_i ← x_i / a_ii              ← divide by pivot',
      '  8: end for',
      '  9: return (x_1, …, x_n)ᵀ',
    ],
    explanation:
      'We solve from the bottom up. x_n is found directly. For each subsequent x_i, we start with the RHS value, subtract all already-known x_j terms (j > i), and divide by the diagonal entry a_ii.',
    operationDerivation: [
      {
        title: 'Number of divisions',
        latex: 'n  \\quad\\text{(one per equation)}',
        plain: 'n  (one per equation)',
      },
      {
        title: 'Number of multiplications (= number of subtractions)',
        latex: '\\sum_{i=1}^{n-1}\\sum_{j=i+1}^{n}1 = \\sum_{i=1}^{n-1}(n-i) = \\frac{n(n-1)}{2}',
        plain: 'Σᵢ₌₁ⁿ⁻¹ (n−i) = n(n−1)/2',
      },
    ],
    summary: {
      divisions: 'n',
      multiplications: 'n(n−1)/2',
      additions: 'n(n−1)/2',
      dominant: 'n(n−1)/2  ≈  n²/2',
      complexity: 'O(n²)',
    },
  },
  {
    id: 'forward-substitution',
    title: 'Forward Substitution (Elimination on RHS)',
    subtitle: 'Apply stored multipliers to solve Ly = b',
    chapter: 'Chapter 2 — Linear Systems',
    chapterId: 'chapter2',
    topic: 'LU Factorization',
    topicId: 'c2t3',
    tags: ['forward substitution', 'LU', 'lower triangular', 'O(n²)'],
    pseudocode: [
      'Algorithm: Forward Substitution (Elimination on RHS)',
      '  Input:  Stored multipliers m_ji (i < j) in lower triangle of A;',
      '          right-hand-side b = (b_1, …, b_n)ᵀ',
      '  Output: Modified b (= y in Ly = b)',
      '',
      '  1: for i = 2, …, n do',
      '  2:   for j = 1, …, i−1 do',
      '  3:     b_i ← b_i − a_ij · b_j    ← a_ij stores multiplier m_ij',
      '  4:   end for',
      '  5: end for',
      '',
      '  (Then apply Backward Substitution to solve Ux = b)',
    ],
    explanation:
      'After LU factorisation, the multipliers m_ji are stored in the lower triangle of A. To solve Ax = b, we first apply forward substitution: for each row i, subtract the contributions of all previously solved entries b_j (j < i) using the stored multipliers. This transforms b into y such that Ux = y.',
    operationDerivation: [
      {
        title: 'Number of multiplications (= number of subtractions)',
        latex: '\\sum_{i=2}^{n}\\sum_{j=1}^{i-1}1 = \\sum_{i=2}^{n}(i-1) = \\frac{n(n-1)}{2}',
        plain: 'Σᵢ₌₂ⁿ (i−1) = n(n−1)/2',
      },
    ],
    summary: {
      multiplications: 'n(n−1)/2',
      additions: 'n(n−1)/2',
      dominant: 'n(n−1)/2  ≈  n²/2',
      complexity: 'O(n²)',
      note: 'No divisions needed — the diagonal of L is all 1s.',
    },
  },
  {
    id: 'lu-factorization',
    title: 'LU Factorisation (Elimination on Coefficient Matrix)',
    subtitle: 'Factorise A = LU by Gaussian elimination, storing multipliers',
    chapter: 'Chapter 2 — Linear Systems',
    chapterId: 'chapter2',
    topic: 'LU Factorization',
    topicId: 'c2t3',
    tags: ['LU factorisation', 'Gaussian elimination', 'multipliers', 'O(n³)'],
    pseudocode: [
      'Algorithm: LU Factorisation (store multipliers in-place)',
      '  Input:  A = (a_ij)_{n×n}',
      '  Output: A overwritten: upper triangle = U, lower triangle = multipliers of L',
      '          (diagonal of L is all 1s, not stored)',
      '',
      '  1: for i = 1, …, n−1 do          ← pivot column',
      '  2:   for j = i+1, …, n do        ← row to eliminate',
      '  3:     a_ji ← a_ji / a_ii        ← store multiplier m_ji in lower triangle',
      '  4:     for k = i+1, …, n do      ← update row j (coefficient matrix only)',
      '  5:       a_jk ← a_jk − a_ji · a_ik',
      '  6:     end for',
      '  7:   end for',
      '  8: end for',
      '  9: return (a_ij)_{n×n}            ← U in upper, L multipliers in lower',
    ],
    explanation:
      'This is Gaussian elimination applied to the coefficient matrix A only (not the augmented matrix). The multipliers m_ji = a_ji/a_ii are computed and stored in the lower triangle of A, overwriting the zeros that would normally appear there. The upper triangle becomes U. The full solve then uses forward substitution (Ly = b) followed by backward substitution (Ux = y).',
    operationDerivation: [
      {
        title: 'Number of divisions (computing multipliers)',
        latex: '\\sum_{i=1}^{n-1}\\sum_{j=i+1}^{n}1 = \\frac{n(n-1)}{2}',
        plain: 'n(n−1)/2',
      },
      {
        title: 'Number of multiplications (= number of subtractions)',
        latex: '\\sum_{i=1}^{n-1}\\sum_{j=i+1}^{n}\\sum_{k=i+1}^{n}1 = \\sum_{i=1}^{n-1}(n-i)^2 = \\frac{(n-1)n(2n-1)}{6} \\approx \\frac{n^3}{3}',
        plain: 'Σᵢ (n−i)² = (n−1)n(2n−1)/6 ≈ n³/3',
      },
      {
        title: 'Total combined (divisions + muls + subs)',
        latex: '\\frac{n(n-1)}{2} + 2\\cdot\\frac{(n-1)n(2n-1)}{6} \\approx \\frac{2n^3}{3}',
        plain: 'n(n−1)/2 + 2·(n−1)n(2n−1)/6 ≈ 2n³/3',
      },
    ],
    summary: {
      divisions: 'n(n−1)/2',
      multiplications: '(n−1)n(2n−1)/6  ≈  n³/3',
      additions: '(n−1)n(2n−1)/6  ≈  n³/3',
      dominant: '2n³/3  (total for LU factorisation)',
      complexity: 'O(n³)',
      note: 'Once LU is computed, each new RHS costs only O(n²) via forward + backward substitution.',
    },
  },
  {
    id: 'partial-pivoting',
    title: 'Partial Pivoting (Row Swap Search)',
    subtitle: 'Find and swap the largest pivot element before each elimination step',
    chapter: 'Chapter 2 — Linear Systems',
    chapterId: 'chapter2',
    topic: 'Gaussian Elimination',
    topicId: 'c2t2',
    tags: ['partial pivoting', 'pivoting', 'PA=LU', 'numerical stability'],
    pseudocode: [
      'Algorithm: Partial Pivoting — find largest |a_ji| for j ≥ i and swap rows',
      '  (Called once per pivot column i, before the elimination inner loop)',
      '',
      '  1: m ← i                          ← assume current row has largest pivot',
      '  2: for k = i+1, …, n do',
      '  3:   if |a_ki| > |a_mi| then',
      '  4:     m ← k                      ← update index of largest pivot',
      '  5:   end if',
      '  6: end for',
      '  7: if a_mi = 0 then',
      '  8:   return "Error: Matrix is singular"',
      '  9: else if m ≠ i then',
      ' 10:   Swap row i and row m          ← record swap in permutation matrix P',
      ' 11: end if',
    ],
    explanation:
      'Before eliminating column i, we search rows i through n for the entry with the largest absolute value in column i. We swap that row to position i. This prevents division by a small (near-zero) pivot, which would amplify rounding errors. The sequence of row swaps is encoded in a permutation matrix P, giving PA = LU.',
    operationDerivation: [
      {
        title: 'Number of comparisons',
        latex: '\\sum_{i=1}^{n-1}\\sum_{k=i+1}^{n}1 = \\frac{n(n-1)}{2}',
        plain: 'n(n−1)/2 comparisons total',
      },
    ],
    summary: {
      comparisons: 'n(n−1)/2',
      complexity: 'O(n²) for the pivoting search — negligible compared to O(n³) elimination',
      note: 'Partial pivoting does NOT change the asymptotic complexity of Gaussian elimination.',
    },
  },
  {
    id: 'cholesky',
    title: 'Cholesky Factorisation',
    subtitle: 'Factorise symmetric positive definite A = LLᵀ',
    chapter: 'Chapter 2 — Linear Systems',
    chapterId: 'chapter2',
    topic: 'Cholesky Factorization',
    topicId: 'c2t4',
    tags: ['Cholesky', 'symmetric positive definite', 'SPD', 'LLᵀ', 'O(n³/3)'],
    pseudocode: [
      'Algorithm: Cholesky Factorisation  A = LLᵀ',
      '  Input:  A = (a_ij)_{n×n}, symmetric positive definite',
      '  Output: Lower triangular L stored in lower triangle of A',
      '',
      '  1: for i = 1, …, n−1 do',
      '  2:   a_ii ← √a_ii                 ← compute diagonal entry of L',
      '  3:   for j = i+1, …, n do',
      '  4:     a_ji ← a_ji / a_ii         ← compute subdiagonal entries of column i',
      '  5:   end for',
      '  6:   for j = i+1, …, n do',
      '  7:     for k = j, …, n do',
      '  8:       a_kj ← a_kj − a_ki · a_ji  ← rank-1 update of remaining submatrix',
      '  9:     end for',
      ' 10:   end for',
      ' 11: end for',
      ' 12: a_nn ← √a_nn                   ← handle last diagonal entry',
      ' 13: return a_ij for all i ≥ j      ← lower triangle = L',
    ],
    explanation:
      'We process column by column. For column i: (1) take the square root of the diagonal to get L_ii, (2) divide all entries below the diagonal by L_ii to get the subdiagonal entries of column i, (3) perform a rank-1 update on the remaining (n−i)×(n−i) submatrix. Because A is symmetric, we only work with the lower triangle. No pivoting is needed for SPD matrices.',
    operationDerivation: [
      {
        title: 'Number of square roots',
        latex: 'n',
        plain: 'n (one per diagonal entry)',
      },
      {
        title: 'Number of divisions',
        latex: '\\sum_{i=1}^{n-1}(n-i) = \\frac{n(n-1)}{2}',
        plain: 'n(n−1)/2',
      },
      {
        title: 'Number of multiplications = number of subtractions',
        latex: '\\sum_{i=1}^{n-1}\\sum_{j=i+1}^{n}\\sum_{k=j}^{n}1 = \\sum_{i=1}^{n-1}\\frac{(n-i)(n-i+1)}{2} \\approx \\frac{n^3}{6}',
        plain: 'Σᵢ (n−i)(n−i+1)/2 ≈ n³/6',
      },
      {
        title: 'Comparison with LU factorisation',
        latex: '\\text{Cholesky: } \\approx \\frac{n^3}{3} \\quad\\text{vs}\\quad \\text{LU: } \\approx \\frac{2n^3}{3}',
        plain: 'Cholesky ≈ n³/3 total vs LU ≈ 2n³/3 — Cholesky is about twice as fast',
      },
    ],
    summary: {
      squareRoots: 'n',
      divisions: 'n(n−1)/2',
      multiplications: '≈ n³/6',
      additions: '≈ n³/6',
      dominant: 'n³/3  (total for Cholesky)',
      complexity: 'O(n³) — but approximately half the cost of LU factorisation',
      note: 'Only applicable when A is symmetric positive definite. No pivoting required.',
    },
    warnings: [
      'Cholesky will fail (square root of a negative number) if A is not positive definite.',
      'The algorithm exploits symmetry — only the lower triangle of A is read and modified.',
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // CHAPTER 3 — Least Squares
  // ─────────────────────────────────────────────────────────────
  {
    id: 'classical-gram-schmidt',
    title: 'Classical Gram-Schmidt (CGS)',
    subtitle: 'Compute reduced QR factorisation A = Q₁R₁ column by column',
    chapter: 'Chapter 3 — Least Squares',
    chapterId: 'chapter3',
    topic: 'QR Factorization — Theory',
    topicId: 'c3t2',
    tags: ['Gram-Schmidt', 'QR', 'orthonormalisation', 'classical', 'O(mn²)'],
    pseudocode: [
      'Algorithm 1: Classical Gram-Schmidt (CGS)',
      '  Input:  A = (a_1, …, a_n) ∈ ℝᵐˣⁿ  (columns a_i ∈ ℝᵐ)',
      '  Output: Q₁ = (a_1, …, a_n) [overwritten with q_i],',
      '          R₁ = (r_ij) upper triangular',
      '',
      '  1: r_11 ← ‖a_1‖,  a_1 ← a_1 / r_11   ← normalise first column',
      '  2: for i = 2, …, n do',
      '  3:   for j = 1, …, i−1 do',
      '  4:     r_ji ← aᵢᵀ aⱼ               ← project a_i onto q_j (note: a_j is now q_j)',
      '  5:   end for',
      '  6:   for j = 1, …, i−1 do',
      '  7:     a_i ← a_i − r_ji · a_j       ← subtract all projections at once',
      '  8:   end for',
      '  9:   r_ii ← ‖a_i‖,  a_i ← a_i / r_ii  ← normalise',
      ' 10: end for',
      ' 11: return Q₁ = (a_1, …, a_n),  R₁ = (r_ij)',
    ],
    explanation:
      'CGS processes one column at a time. For column i, it computes all inner products r_ji = aᵢᵀqⱼ (j = 1,…,i−1) first, then subtracts all projections simultaneously, and finally normalises. The key weakness: because projections use the original a_i and the already-computed (potentially non-orthogonal) q_j vectors, rounding errors can accumulate and cause loss of orthogonality.',
    operationDerivation: [
      {
        title: 'Inner products r_ji (each costs 2m flops: m multiplications + m additions)',
        latex: '\\sum_{i=2}^{n}(i-1)\\cdot 2m = 2m\\cdot\\frac{n(n-1)}{2} = mn(n-1)',
        plain: 'Σᵢ₌₂ⁿ (i−1)·2m = mn(n−1)',
      },
      {
        title: 'Subtracting projections (each a_i − r_ji·a_j costs 2m flops)',
        latex: '\\sum_{i=2}^{n}(i-1)\\cdot 2m = mn(n-1)',
        plain: 'mn(n−1)',
      },
      {
        title: 'Normalisations (each costs ~2m flops: m multiplications + 1 sqrt)',
        latex: 'n \\cdot 2m \\approx 2mn',
        plain: '≈ 2mn',
      },
      {
        title: 'Total (dominant term)',
        latex: '2mn(n-1) + 2mn \\approx 2mn^2',
        plain: '≈ 2mn²',
      },
    ],
    summary: {
      dominant: '≈ 2mn²',
      complexity: 'O(mn²)',
      note: 'For m >> n (overdetermined), this is much cheaper than O(n³) LU. For square m=n, it is O(n³).',
    },
    warnings: [
      'CGS can lose orthogonality due to rounding errors — use Modified Gram-Schmidt (MGS) in practice.',
      'If ‖a_i‖ = 0 after projections (degenerate case), set q_i = 0 and r_ii = 0; the system has infinitely many solutions.',
    ],
  },
  {
    id: 'modified-gram-schmidt',
    title: 'Modified Gram-Schmidt (MGS)',
    subtitle: 'Numerically stable QR factorisation — fill R₁ row by row',
    chapter: 'Chapter 3 — Least Squares',
    chapterId: 'chapter3',
    topic: 'QR Factorization — Theory',
    topicId: 'c3t2',
    tags: ['Modified Gram-Schmidt', 'MGS', 'QR', 'numerical stability', 'O(mn²)'],
    pseudocode: [
      'Algorithm 2: Modified Gram-Schmidt (MGS)',
      '  Input:  A = (a_1, …, a_n) ∈ ℝᵐˣⁿ',
      '  Output: Q₁ = (a_1, …, a_n) [overwritten with q_i],',
      '          R₁ = (r_ij) upper triangular',
      '',
      '  1: for i = 1, …, n do',
      '  2:   r_ii ← ‖a_i‖              ← compute norm before normalising',
      '  3:   a_i ← a_i / r_ii          ← normalise: a_i is now q_i',
      '  4:   for j = i+1, …, n do',
      '  5:     r_ij ← aᵢᵀ aⱼ          ← project remaining columns onto q_i',
      '  6:     a_j ← a_j − r_ij · a_i  ← remove component in direction q_i',
      '  7:   end for',
      '  8: end for',
      '  9: return Q₁ = (a_1, …, a_n),  R₁ = (r_ij)',
    ],
    explanation:
      'MGS fills R₁ row by row instead of column by column. After normalising a_i to get q_i, we immediately project ALL remaining columns a_j (j > i) onto q_i and remove that component. This means each subsequent projection uses the already-updated (more orthogonal) vector, preventing error accumulation. MGS and CGS are mathematically equivalent but MGS is numerically far superior.',
    operationDerivation: [
      {
        title: 'Inner products r_ij (each costs 2m flops)',
        latex: '\\sum_{i=1}^{n}(n-i)\\cdot 2m = 2m\\cdot\\frac{n(n-1)}{2} = mn(n-1)',
        plain: 'Σᵢ (n−i)·2m = mn(n−1)',
      },
      {
        title: 'Subtracting projections (each a_j − r_ij·a_i costs 2m flops)',
        latex: '\\sum_{i=1}^{n}(n-i)\\cdot 2m = mn(n-1)',
        plain: 'mn(n−1)',
      },
      {
        title: 'Total (dominant term)',
        latex: '2mn(n-1) \\approx 2mn^2',
        plain: '≈ 2mn²',
      },
    ],
    summary: {
      dominant: '≈ 2mn²',
      complexity: 'O(mn²)',
      note: 'Same asymptotic complexity as CGS, but significantly more numerically stable in finite precision arithmetic.',
    },
    warnings: [
      'MGS is the preferred algorithm for QR factorisation in practice over CGS.',
      'After MGS, solve R₁x̂ = Q₁ᵀb (backward substitution) to get the least squares solution.',
    ],
  },
  {
    id: 'householder-qr',
    title: 'QR Factorisation via Householder Reflections',
    subtitle: 'Full QR: A = QR using orthogonal reflectors Hₖ',
    chapter: 'Chapter 3 — Least Squares',
    chapterId: 'chapter3',
    topic: 'Householder & Givens Transformations',
    topicId: 'c3t4',
    tags: ['Householder', 'QR', 'reflection', 'orthogonal', 'full QR'],
    pseudocode: [
      'Algorithm: QR Factorisation via Householder Reflections',
      '  Input:  A ∈ ℝᵐˣⁿ  (m ≥ n)',
      '  Output: Q = H₁H₂…Hₙ (orthogonal),  R (upper triangular)',
      '',
      '  For each column i = 1, …, n:',
      '    1. Let x = current column i of A (from row i downward)',
      '    2. Compute v = ‖x‖e₁ − x   (or v = −‖x‖e₁ − x for numerical stability)',
      '       where e₁ = (1, 0, …, 0)ᵀ',
      '    3. Form Householder reflector:',
      '         H_i = I − 2(vvᵀ)/(vᵀv)',
      '    4. Apply H_i to the remaining submatrix:',
      '         A ← H_i · A    (zeros out entries below diagonal in column i)',
      '',
      '  After n steps:  Hₙ…H₂H₁A = R  (upper triangular)',
      '  Set Q = H₁H₂…Hₙ  (product of reflectors)',
      '',
      '  To solve least squares Ax = b:',
      '    Compute Qᵀb = Hₙ…H₂H₁b',
      '    Solve Rx = (Qᵀb)_{1:n}  via backward substitution',
    ],
    explanation:
      'Each Householder reflector H_i zeros out all entries below the diagonal in column i of A. The reflector is defined by v = ‖x‖e₁ − x, where x is the subcolumn to be zeroed. H = I − 2vvᵀ/(vᵀv) is orthogonal (Hᵀ = H, H² = I) and symmetric. Applying H_i to A reflects the subcolumn onto the first standard basis vector, creating zeros. After n such steps, A becomes upper triangular R, and Q is the product of all reflectors.',
    operationDerivation: [
      {
        title: 'Cost of one Householder reflector application to an m×n submatrix',
        latex: '\\text{Apply } H_i \\text{ to remaining } (m-i+1)\\times(n-i+1) \\text{ submatrix: } \\approx 4(m-i+1)(n-i+1) \\text{ flops}',
        plain: '≈ 4(m−i+1)(n−i+1) flops per step',
      },
      {
        title: 'Total cost (dominant term for m >> n)',
        latex: '\\sum_{i=1}^{n}4(m-i)(n-i) \\approx 2mn^2 - \\frac{2n^3}{3}',
        plain: '≈ 2mn² − 2n³/3',
      },
    ],
    summary: {
      dominant: '2mn² − 2n³/3',
      complexity: 'O(mn²) — same as Gram-Schmidt, but more numerically stable',
      note: 'Householder is the standard algorithm used in most numerical libraries (e.g., R, MATLAB, NumPy). It is more stable than Gram-Schmidt because it uses reflections (norm-preserving) rather than projections.',
    },
    warnings: [
      'Choose v = ‖x‖e₁ − x (not −‖x‖e₁ − x) to avoid catastrophic cancellation when x₁ ≈ ‖x‖.',
      'The full Q matrix is rarely formed explicitly — instead, Qᵀb is computed by applying each H_i sequentially.',
    ],
  },
  {
    id: 'givens-qr',
    title: 'QR Factorisation via Givens Rotations',
    subtitle: 'Zero out entries one at a time using 2×2 rotation matrices',
    chapter: 'Chapter 3 — Least Squares',
    chapterId: 'chapter3',
    topic: 'Householder & Givens Transformations',
    topicId: 'c3t4',
    tags: ['Givens', 'rotation', 'QR', 'sparse', 'selective zeroing'],
    pseudocode: [
      'Algorithm: QR Factorisation via Givens Rotations',
      '  Input:  A ∈ ℝᵐˣⁿ  (m ≥ n)',
      '  Output: Q = G₁ᵀG₂ᵀ…Gₖᵀ (orthogonal),  R (upper triangular)',
      '',
      '  For each column i = 1, …, n:',
      '    For each row j = m, m−1, …, i+1:  (zero out entry (j,i))',
      '      1. Let x_i = a_{i,i},  x_j = a_{j,i}  (pivot and target entries)',
      '      2. Compute:',
      '           r = √(x_i² + x_j²)',
      '           c = x_i / r   (cosine)',
      '           s = x_j / r   (sine)',
      '      3. Form Givens rotation G (acts on rows i and j):',
      '           G = I  with  G[i,i]=c,  G[i,j]=s,  G[j,i]=−s,  G[j,j]=c',
      '      4. Apply G to A:  A ← G · A',
      '         (only rows i and j are affected)',
      '',
      '  After all rotations:  Gₖ…G₂G₁A = R',
      '  Set Q = G₁ᵀG₂ᵀ…Gₖᵀ',
    ],
    explanation:
      'Each Givens rotation targets a single entry a_{j,i} and zeros it out by rotating rows i and j. The rotation angle θ satisfies cos θ = x_i/r, sin θ = x_j/r where r = √(x_i²+x_j²). The rotation is orthogonal (Gᵀ = G⁻¹) and only modifies two rows at a time, making it ideal for sparse matrices where only specific entries need to be zeroed.',
    operationDerivation: [
      {
        title: 'Number of Givens rotations needed',
        latex: '\\sum_{i=1}^{n}(m-i) = mn - \\frac{n(n+1)}{2}',
        plain: 'mn − n(n+1)/2 rotations total',
      },
      {
        title: 'Cost per rotation (applied to full row)',
        latex: '\\approx 6n \\text{ flops per rotation (affects 2 rows of length n)}',
        plain: '≈ 6n flops per rotation',
      },
    ],
    summary: {
      dominant: '3mn² − n³  (approximately)',
      complexity: 'O(mn²) — same order as Householder, but roughly 1.5× more expensive for dense matrices',
      note: 'Givens rotations are preferred over Householder when only a few entries need to be zeroed (e.g., sparse matrices, updating an existing QR factorisation).',
    },
    warnings: [
      'For dense matrices, Householder is preferred as it is roughly 1.5× faster than Givens.',
      'Givens rotations are particularly useful for banded or sparse matrices where Householder would destroy sparsity.',
    ],
  },
];

// ─── Helper: group by chapter ───────────────────────────────────
export const pseudocodeByChapter: Record<string, PseudocodeEntry[]> = {};
for (const entry of pseudocodes) {
  if (!pseudocodeByChapter[entry.chapterId]) {
    pseudocodeByChapter[entry.chapterId] = [];
  }
  pseudocodeByChapter[entry.chapterId].push(entry);
}

// ─── All unique tags ─────────────────────────────────────────────
export const allPseudocodeTags = Array.from(
  new Set(pseudocodes.flatMap((p) => p.tags))
).sort();
