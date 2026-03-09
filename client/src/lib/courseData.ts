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
// CHAPTER 0: LINEAR ALGEBRA PRIMER (Pre-requisite Review)
// ============================================================

const chapter0Topics: Topic[] = [
  // ── Topic 0.1: Matrices & Vectors ──────────────────────────
  {
    id: 'c0t1',
    title: 'Matrices & Vectors — Core Definitions',
    lectureRef: 'Pre-requisite',
    formulas: [
      {
        id: 'matrix-transpose',
        title: 'Transpose',
        latex: '(A^T)_{ij} = A_{ji} \\quad \\Rightarrow \\quad (AB)^T = B^T A^T',
        description: 'Flips rows and columns. The transpose of a product reverses the order.',
        isKey: true,
      },
      {
        id: 'matrix-trace',
        title: 'Trace',
        latex: '\\text{tr}(A) = \\sum_{i=1}^n A_{ii} = \\lambda_1 + \\lambda_2 + \\cdots + \\lambda_n',
        description: 'Sum of diagonal entries = sum of all eigenvalues.',
        isKey: false,
      },
      {
        id: 'matrix-det',
        title: 'Determinant (2×2)',
        latex: '\\det\\begin{pmatrix}a & b \\\\ c & d\\end{pmatrix} = ad - bc',
        description: 'For larger matrices, expand by cofactors or use row operations. det(AB) = det(A)det(B).',
        isKey: true,
      },
      {
        id: 'matrix-rank',
        title: 'Rank',
        latex: '\\text{rank}(A) = \\text{number of linearly independent rows (or columns)}',
        description: 'For an m×n matrix: rank(A) ≤ min(m,n). Full rank means rank = min(m,n).',
        isKey: true,
      },
    ],
    content: [
      {
        type: 'highlight',
        title: '📚 What This Primer Covers',
        content: 'This section reviews the linear algebra concepts assumed as pre-requisite knowledge for DSA2102. You will encounter these ideas constantly in Chapters 1–3. Work through this before starting Chapter 1 if any notation or concept feels unfamiliar.',
      },
      {
        type: 'text',
        content: '**Matrix Dimensions and Notation**\n\nA matrix $A \\in \\mathbb{R}^{m \\times n}$ has $m$ rows and $n$ columns. Entry in row $i$, column $j$ is written $A_{ij}$ or $a_{ij}$.\n\n- **Square matrix**: $m = n$\n- **Column vector**: $n = 1$, written $\\mathbf{x} \\in \\mathbb{R}^m$\n- **Row vector**: $m = 1$\n- **Identity matrix** $I_n$: square, $I_{ii} = 1$, $I_{ij} = 0$ for $i \\neq j$; satisfies $AI = IA = A$\n- **Zero matrix** $O$: all entries zero',
      },
      {
        type: 'text',
        content: '**Transpose Properties**\n\nThe transpose $A^T$ swaps rows and columns: $(A^T)_{ij} = A_{ji}$.\n\nKey identities:\n- $(A^T)^T = A$\n- $(A + B)^T = A^T + B^T$\n- $(AB)^T = B^T A^T$ ← **order reverses!**\n- $(A^{-1})^T = (A^T)^{-1}$\n\nA matrix is **symmetric** if $A = A^T$ (all real eigenvalues). A matrix is **skew-symmetric** if $A = -A^T$.',
      },
      {
        type: 'text',
        content: '**Rank and Linear Independence**\n\nThe **rank** of a matrix is the number of linearly independent rows (equivalently, columns). For $A \\in \\mathbb{R}^{m \\times n}$:\n\n- $\\text{rank}(A) \\leq \\min(m, n)$\n- **Full column rank**: $\\text{rank}(A) = n$ — columns are linearly independent; $Ax = 0$ has only the trivial solution\n- **Full row rank**: $\\text{rank}(A) = m$ — rows are linearly independent\n- **Rank-deficient**: $\\text{rank}(A) < \\min(m, n)$ — some columns/rows are redundant\n\nIn DSA2102: the least squares problem $Ax \\approx b$ requires $A$ to have **full column rank** for a unique solution.',
      },
      {
        type: 'text',
        content: '**Trace and Determinant**\n\nThe **trace** $\\text{tr}(A) = \\sum_i A_{ii}$ equals the sum of eigenvalues. Key property: $\\text{tr}(AB) = \\text{tr}(BA)$.\n\nThe **determinant** $\\det(A)$ (or $|A|$) is a scalar that encodes whether $A$ is invertible:\n- $\\det(A) \\neq 0 \\Leftrightarrow A$ is invertible (non-singular)\n- $\\det(A) = 0 \\Leftrightarrow A$ is singular\n- $\\det(AB) = \\det(A) \\det(B)$\n- $\\det(A^T) = \\det(A)$\n- $\\det(A^{-1}) = 1/\\det(A)$\n\nFor triangular matrices: $\\det(A) = \\prod_i A_{ii}$ (product of diagonal entries).',
      },
      {
        type: 'example',
        title: 'Example: Rank and Determinant',
        content: 'A = [[2, 4], [1, 2]]\n\nRow 2 = (1/2) × Row 1 → rows are linearly dependent → rank(A) = 1 (rank-deficient)\n\ndet(A) = (2)(2) − (4)(1) = 4 − 4 = 0 ✓ (singular, as expected from rank < 2)\n\nB = [[3, 1], [2, 4]]\n\ndet(B) = (3)(4) − (1)(2) = 12 − 2 = 10 ≠ 0 → rank(B) = 2 (full rank, invertible)',
      },
    ],
    quiz: [
      {
        id: 'q-c0t1-1',
        question: 'Matrix A is 4×3. What is the maximum possible rank of A?',
        options: ['4', '3', '12', '7'],
        correctIndex: 1,
        explanation: 'For an m×n matrix, rank ≤ min(m,n) = min(4,3) = 3. The rank cannot exceed the number of columns.',
        topicId: 'c0t1',
      },
      {
        id: 'q-c0t1-2',
        question: 'If det(A) = 0, which of the following must be true?',
        options: [
          'A has all zero entries',
          'A is singular and not invertible',
          'A is the identity matrix',
          'All eigenvalues of A are zero',
        ],
        correctIndex: 1,
        explanation: 'det(A) = 0 means A is singular (rank-deficient) and therefore not invertible. The matrix need not have all zero entries — e.g., [[1,2],[2,4]] has det = 0 but non-zero entries.',
        topicId: 'c0t1',
      },
      {
        id: 'q-c0t1-3',
        question: 'Which identity correctly expresses the transpose of a product?',
        options: ['(AB)ᵀ = AᵀBᵀ', '(AB)ᵀ = BᵀAᵀ', '(AB)ᵀ = AB', '(AB)ᵀ = (Aᵀ)⁻¹Bᵀ'],
        correctIndex: 1,
        explanation: '(AB)ᵀ = BᵀAᵀ — the order reverses. This is one of the most important matrix identities used throughout DSA2102, especially in the normal equations AᵀAx̂ = Aᵀb.',
        topicId: 'c0t1',
      },
      {
        id: 'q-c0t1-4',
        question: 'For a triangular matrix T, how is det(T) computed?',
        options: [
          'Sum of all diagonal entries',
          'Product of all entries',
          'Product of all diagonal entries',
          'Sum of all entries',
        ],
        correctIndex: 2,
        explanation: 'For any triangular matrix (upper or lower), det(T) = product of diagonal entries. This is why checking if any diagonal entry of U in LU factorization is zero tells us if A is singular.',
        topicId: 'c0t1',
      },
    ],
  },

  // ── Topic 0.2: Invertibility & Special Matrices ─────────────
  {
    id: 'c0t2',
    title: 'Invertibility, Singularity & Special Matrices',
    lectureRef: 'Pre-requisite',
    formulas: [
      {
        id: 'matrix-inverse',
        title: 'Matrix Inverse',
        latex: 'A A^{-1} = A^{-1} A = I \\quad \\Leftrightarrow \\quad \\det(A) \\neq 0',
        description: 'A is invertible iff det(A) ≠ 0. For 2×2: A⁻¹ = (1/det(A))[[d,−b],[−c,a]].',
        isKey: true,
      },
      {
        id: 'spd-def',
        title: 'Symmetric Positive Definite (SPD)',
        latex: 'A \\text{ is SPD} \\Leftrightarrow A = A^T \\text{ and } \\mathbf{x}^T A \\mathbf{x} > 0 \\; \\forall \\mathbf{x} \\neq \\mathbf{0}',
        description: 'Equivalently: A is symmetric and all eigenvalues are strictly positive. SPD matrices arise in normal equations AᵀA and Cholesky factorization.',
        isKey: true,
      },
      {
        id: 'inverse-product',
        title: 'Inverse of a Product',
        latex: '(AB)^{-1} = B^{-1} A^{-1}',
        description: 'Order reverses, just like the transpose. Both A and B must be invertible.',
        isKey: true,
      },
    ],
    content: [
      {
        type: 'highlight',
        title: 'Notation Guide: Symbols in This Topic',
        content: '**A⁻¹** — matrix inverse (only exists when det(A) ≠ 0)\n**SPD** — Symmetric Positive Definite\n**xᵀAx** — quadratic form (scalar): multiply row vector xᵀ by matrix A by column vector x\n**λᵢ** — eigenvalue i of A\n**Aᵀ = A** — symmetry condition',
      },
      {
        type: 'text',
        content: '**Invertibility and Singularity**\n\nA square matrix $A \\in \\mathbb{R}^{n \\times n}$ is **invertible** (non-singular) if there exists $A^{-1}$ such that $AA^{-1} = A^{-1}A = I$.\n\nThe following are all **equivalent** statements:\n1. $A$ is invertible\n2. $\\det(A) \\neq 0$\n3. $\\text{rank}(A) = n$ (full rank)\n4. $Ax = 0$ has only the trivial solution $x = 0$\n5. $Ax = b$ has a unique solution for every $b$\n6. All eigenvalues of $A$ are non-zero\n7. The columns (and rows) of $A$ are linearly independent\n\nIn DSA2102, you need $A$ to be invertible (or $A^TA$ to be invertible) to guarantee unique solutions to linear systems and least squares problems.',
      },
      {
        type: 'text',
        content: '**Special Matrix Types**\n\n| Type | Definition | Key Property |\n|---|---|---|\n| **Symmetric** | $A = A^T$ | Real eigenvalues |\n| **Skew-symmetric** | $A = -A^T$ | Pure imaginary eigenvalues |\n| **Diagonal** | $A_{ij} = 0$ for $i \\neq j$ | $A^{-1}$ has entries $1/A_{ii}$ |\n| **Upper triangular** | $A_{ij} = 0$ for $i > j$ | Solved by back-substitution |\n| **Lower triangular** | $A_{ij} = 0$ for $i < j$ | Solved by forward-substitution |\n| **Orthogonal** | $A^T A = A A^T = I$ | $A^{-1} = A^T$, preserves norms |\n| **SPD** | $A = A^T$, $\\mathbf{x}^T A \\mathbf{x} > 0$ | Cholesky factorization exists |',
      },
      {
        type: 'text',
        content: '**Symmetric Positive Definite (SPD) Matrices**\n\nSPD matrices are the most important class in DSA2102 because:\n- The **normal equations** $A^T A \\hat{x} = A^T b$ involve $A^T A$, which is always symmetric and positive semi-definite (SPD if $A$ has full column rank)\n- **Cholesky factorization** $A = LL^T$ only works for SPD matrices and is twice as fast as LU\n\nEquivalent conditions for SPD:\n1. $A = A^T$ and all eigenvalues $\\lambda_i > 0$\n2. $A = A^T$ and all leading principal minors are positive\n3. $A = A^T$ and $A = R^T R$ for some non-singular upper triangular $R$ (Cholesky)\n4. $\\mathbf{x}^T A \\mathbf{x} > 0$ for all $\\mathbf{x} \\neq \\mathbf{0}$',
      },
      {
        type: 'example',
        title: 'Example: Checking SPD',
        content: 'Is A = [[4, 2], [2, 3]] SPD?\n\nStep 1 — Symmetry: A₁₂ = 2 = A₂₁ ✓\n\nStep 2 — Leading principal minors:\n  • 1×1 minor: det([4]) = 4 > 0 ✓\n  • 2×2 minor: det(A) = (4)(3) − (2)(2) = 12 − 4 = 8 > 0 ✓\n\nConclusion: A is SPD ✓\n\nCholesky factorization A = LLᵀ exists:\n  L₁₁ = √4 = 2\n  L₂₁ = 2/2 = 1\n  L₂₂ = √(3 − 1²) = √2\n\n  L = [[2, 0], [1, √2]]',
      },
      {
        type: 'text',
        content: '**Triangular Matrices and Solving Linear Systems**\n\nTriangular systems are the workhorse of numerical linear algebra. After factorizing $A = LU$, you solve two triangular systems:\n\n**Forward substitution** (lower triangular $Ly = b$):\n$$y_i = \\frac{b_i - \\sum_{j=1}^{i-1} L_{ij} y_j}{L_{ii}}$$\n\n**Back substitution** (upper triangular $Ux = y$):\n$$x_i = \\frac{y_i - \\sum_{j=i+1}^{n} U_{ij} x_j}{U_{ii}}$$\n\nBoth cost $O(n^2)$ operations. The diagonal entries $L_{ii}$ and $U_{ii}$ must be non-zero for the system to be solvable.',
      },
      {
        type: 'warning',
        title: 'Common Mistake: Inverse vs Transpose for Orthogonal Matrices',
        content: 'For orthogonal matrices Q (where QᵀQ = I), the inverse is simply Qᵀ. So Q⁻¹ = Qᵀ. This does NOT mean every matrix with Qᵀ = Q⁻¹ is orthogonal — you must verify QᵀQ = I first.',
      },
    ],
    quiz: [
      {
        id: 'q-c0t2-1',
        question: 'Which of the following is NOT equivalent to "A is invertible"?',
        options: [
          'det(A) ≠ 0',
          'rank(A) = n (full rank)',
          'All eigenvalues of A are non-zero',
          'A is symmetric',
        ],
        correctIndex: 3,
        explanation: 'Symmetry (A = Aᵀ) has nothing to do with invertibility. A symmetric matrix can be singular (e.g., [[1,1],[1,1]] is symmetric but singular). All the other options are equivalent to invertibility.',
        topicId: 'c0t2',
      },
      {
        id: 'q-c0t2-2',
        question: 'Matrix A is SPD. Which factorization is most efficient for solving Ax = b?',
        options: ['LU with partial pivoting', 'Cholesky (A = LLᵀ)', 'QR factorization', 'Gaussian elimination without pivoting'],
        correctIndex: 1,
        explanation: 'Cholesky factorization exploits the SPD structure: it only computes L (not both L and U), requires ~n³/3 operations (half of LU), and is always numerically stable for SPD matrices without needing pivoting.',
        topicId: 'c0t2',
      },
      {
        id: 'q-c0t2-3',
        question: 'For A = [[5, 2], [2, 1]], is A SPD?',
        options: [
          'No — A is not symmetric',
          'No — det(A) < 0',
          'Yes — A is symmetric and all leading principal minors are positive',
          'Cannot determine without computing eigenvalues',
        ],
        correctIndex: 2,
        explanation: 'A is symmetric (A₁₂ = A₂₁ = 2). Leading principal minors: det([5]) = 5 > 0 ✓; det(A) = 5·1 − 2·2 = 1 > 0 ✓. Both positive → A is SPD.',
        topicId: 'c0t2',
      },
      {
        id: 'q-c0t2-4',
        question: 'If A is lower triangular with diagonal entries [2, 3, 5], what is det(A)?',
        options: ['10', '30', '15', '0'],
        correctIndex: 1,
        explanation: 'For any triangular matrix, det = product of diagonal entries = 2 × 3 × 5 = 30.',
        topicId: 'c0t2',
      },
    ],
  },

  // ── Topic 0.3: Orthogonality & Orthonormality ───────────────
  {
    id: 'c0t3',
    title: 'Orthogonality & Orthonormality',
    lectureRef: 'Pre-requisite',
    formulas: [
      {
        id: 'dot-product',
        title: 'Dot Product (Inner Product)',
        latex: '\\langle \\mathbf{u}, \\mathbf{v} \\rangle = \\mathbf{u}^T \\mathbf{v} = \\sum_{i=1}^n u_i v_i',
        description: 'Two vectors are orthogonal iff their dot product is zero.',
        isKey: true,
      },
      {
        id: 'orthogonal-matrix',
        title: 'Orthogonal Matrix',
        latex: 'Q^T Q = Q Q^T = I \\quad \\Rightarrow \\quad Q^{-1} = Q^T',
        description: 'Columns (and rows) are orthonormal. Q preserves vector lengths: ‖Qx‖₂ = ‖x‖₂.',
        isKey: true,
      },
      {
        id: 'projection',
        title: 'Orthogonal Projection onto a Vector',
        latex: '\\text{proj}_{\\mathbf{u}} \\mathbf{v} = \\frac{\\mathbf{u}^T \\mathbf{v}}{\\mathbf{u}^T \\mathbf{u}} \\mathbf{u}',
        description: 'Projects v onto the direction of u. Used in Gram-Schmidt orthogonalization.',
        isKey: true,
      },
      {
        id: 'orthonormal-basis',
        title: 'Orthonormal Basis',
        latex: '\\{\\mathbf{q}_1, \\ldots, \\mathbf{q}_k\\} \\text{ orthonormal} \\Leftrightarrow \\mathbf{q}_i^T \\mathbf{q}_j = \\delta_{ij} = \\begin{cases} 1 & i = j \\\\ 0 & i \\neq j \\end{cases}',
        description: 'Each vector has unit length AND every pair is perpendicular. The columns of a Q matrix from QR factorization form an orthonormal basis.',
        isKey: true,
      },
    ],
    content: [
      {
        type: 'text',
        content: '**Orthogonality**\n\nTwo vectors $\\mathbf{u}, \\mathbf{v} \\in \\mathbb{R}^n$ are **orthogonal** if their dot product is zero:\n$$\\mathbf{u} \\perp \\mathbf{v} \\Leftrightarrow \\mathbf{u}^T \\mathbf{v} = 0$$\n\nGeometrically, orthogonal vectors are perpendicular. In $\\mathbb{R}^2$: $[1, 0]^T$ and $[0, 1]^T$ are orthogonal.\n\nA set of vectors $\\{\\mathbf{v}_1, \\ldots, \\mathbf{v}_k\\}$ is **orthogonal** if every pair is orthogonal: $\\mathbf{v}_i^T \\mathbf{v}_j = 0$ for all $i \\neq j$.\n\nAn orthogonal set of non-zero vectors is **automatically linearly independent** — this is a key reason orthogonal bases are so useful.',
      },
      {
        type: 'text',
        content: '**Orthonormality**\n\nA set of vectors is **orthonormal** if it is orthogonal AND every vector has unit length ($\\|\\mathbf{v}_i\\|_2 = 1$):\n$$\\mathbf{q}_i^T \\mathbf{q}_j = \\delta_{ij} = \\begin{cases} 1 & i = j \\\\ 0 & i \\neq j \\end{cases}$$\n\nTo convert an orthogonal set to orthonormal: normalize each vector by dividing by its length:\n$$\\mathbf{q}_i = \\frac{\\mathbf{v}_i}{\\|\\mathbf{v}_i\\|_2}$$\n\n**Why orthonormal bases are powerful:**\n- Coordinates in an orthonormal basis are just dot products: $c_i = \\mathbf{q}_i^T \\mathbf{b}$\n- No need to solve a system — just project!\n- This is why QR factorization is so numerically stable',
      },
      {
        type: 'text',
        content: '**Orthogonal Matrices**\n\nA square matrix $Q \\in \\mathbb{R}^{n \\times n}$ is **orthogonal** if its columns form an orthonormal set:\n$$Q^T Q = Q Q^T = I \\quad \\Rightarrow \\quad Q^{-1} = Q^T$$\n\nKey properties:\n1. **Norm-preserving**: $\\|Q\\mathbf{x}\\|_2 = \\|\\mathbf{x}\\|_2$ for all $\\mathbf{x}$\n2. **Angle-preserving**: $(Q\\mathbf{x})^T(Q\\mathbf{y}) = \\mathbf{x}^T\\mathbf{y}$\n3. $|\\det(Q)| = 1$ (either $+1$ or $-1$)\n4. **Condition number**: $\\kappa_2(Q) = 1$ — perfectly conditioned!\n5. Eigenvalues have magnitude 1\n\nExamples: rotation matrices, reflection matrices, Householder matrices, Givens rotation matrices.',
      },
      {
        type: 'example',
        title: 'Example: Verifying Orthonormality',
        content: 'Check if the columns of Q = [[1/√2, 1/√2], [1/√2, −1/√2]] are orthonormal.\n\nColumn 1: q₁ = [1/√2, 1/√2]ᵀ\nColumn 2: q₂ = [1/√2, −1/√2]ᵀ\n\nStep 1 — Unit lengths:\n  ‖q₁‖₂ = √((1/√2)² + (1/√2)²) = √(1/2 + 1/2) = √1 = 1 ✓\n  ‖q₂‖₂ = √((1/√2)² + (−1/√2)²) = √(1/2 + 1/2) = 1 ✓\n\nStep 2 — Orthogonality:\n  q₁ᵀq₂ = (1/√2)(1/√2) + (1/√2)(−1/√2) = 1/2 − 1/2 = 0 ✓\n\nConclusion: Q is orthogonal (QᵀQ = I). This is a 45° rotation matrix.',
      },
      {
        type: 'text',
        content: '**Orthogonal Projection**\n\nThe projection of vector $\\mathbf{b}$ onto the column space of $A$ (denoted $\\text{col}(A)$) is:\n$$\\hat{\\mathbf{b}} = A(A^T A)^{-1} A^T \\mathbf{b} = P\\mathbf{b}$$\n\nwhere $P = A(A^T A)^{-1} A^T$ is the **projection matrix** (also called orthogonal projector).\n\nProperties of projection matrices:\n- $P^2 = P$ (idempotent)\n- $P^T = P$ (symmetric)\n- $I - P$ is also a projection (onto the orthogonal complement)\n\nThe **residual** $\\mathbf{r} = \\mathbf{b} - \\hat{\\mathbf{b}}$ is orthogonal to $\\text{col}(A)$: $A^T \\mathbf{r} = \\mathbf{0}$.\n\nThis is the geometric foundation of least squares: $\\hat{x}$ minimizes $\\|A\\mathbf{x} - \\mathbf{b}\\|_2$ because $A\\hat{x}$ is the closest point in $\\text{col}(A)$ to $\\mathbf{b}$.',
      },
      {
        type: 'highlight',
        title: 'Key Insight: Why Orthogonality Matters in DSA2102',
        content: '1. **QR Factorization**: Decomposes A = QR where Q has orthonormal columns → solves least squares stably\n2. **Gram-Schmidt**: Converts any basis into an orthonormal one by iterative projection and normalization\n3. **Householder/Givens**: Orthogonal transformations that zero out entries without amplifying errors (κ₂(Q) = 1)\n4. **SVD**: A = UΣVᵀ where U and V are orthogonal matrices\n5. **Least Squares Geometry**: The solution x̂ is found by projecting b onto col(A)',
      },
    ],
    quiz: [
      {
        id: 'q-c0t3-1',
        question: 'Vectors u = [3, 4]ᵀ and v = [−4, 3]ᵀ. Are they orthogonal?',
        options: [
          'No — they have different lengths',
          'Yes — uᵀv = 0',
          'No — uᵀv = 25',
          'Cannot determine without normalizing',
        ],
        correctIndex: 1,
        explanation: 'uᵀv = (3)(−4) + (4)(3) = −12 + 12 = 0. Since the dot product is zero, u and v are orthogonal. Note: they have the same length (‖u‖₂ = ‖v‖₂ = 5) but that is not required for orthogonality.',
        topicId: 'c0t3',
      },
      {
        id: 'q-c0t3-2',
        question: 'Q is an orthogonal matrix. What is Q⁻¹?',
        options: ['Q itself', 'Qᵀ', '−Q', '1/det(Q) × Qᵀ'],
        correctIndex: 1,
        explanation: 'For orthogonal Q, QᵀQ = I, so Q⁻¹ = Qᵀ. This is the defining property of orthogonal matrices and makes them computationally cheap to invert.',
        topicId: 'c0t3',
      },
      {
        id: 'q-c0t3-3',
        question: 'What is the condition number κ₂(Q) of an orthogonal matrix Q?',
        options: ['0', '∞', '1', 'det(Q)'],
        correctIndex: 2,
        explanation: 'κ₂(Q) = ‖Q‖₂ · ‖Q⁻¹‖₂ = 1 · 1 = 1. Orthogonal matrices are perfectly conditioned — they do not amplify errors at all. This is why QR factorization is numerically stable.',
        topicId: 'c0t3',
      },
      {
        id: 'q-c0t3-4',
        question: 'The projection of b onto col(A) gives the vector Pb. What is true about the residual r = b − Pb?',
        options: [
          'r is parallel to b',
          'r is orthogonal to every column of A (Aᵀr = 0)',
          'r = 0 always',
          'r has the same length as b',
        ],
        correctIndex: 1,
        explanation: 'The residual r = b − Pb is orthogonal to the column space of A, meaning Aᵀr = 0. This is the geometric condition that defines the least squares solution: the normal equations Aᵀ(Ax̂ − b) = 0.',
        topicId: 'c0t3',
      },
    ],
  },

  // ── Topic 0.4: Eigenvalues, SVD & Key Identities ────────────
  {
    id: 'c0t4',
    title: 'Eigenvalues, SVD & Key Matrix Identities',
    lectureRef: 'Pre-requisite',
    formulas: [
      {
        id: 'eigenvalue-def',
        title: 'Eigenvalue / Eigenvector',
        latex: 'A\\mathbf{v} = \\lambda \\mathbf{v} \\quad \\Leftrightarrow \\quad \\det(A - \\lambda I) = 0',
        description: 'λ is an eigenvalue and v is the corresponding eigenvector. The characteristic polynomial det(A − λI) = 0 gives all eigenvalues.',
        isKey: true,
      },
      {
        id: 'svd-def',
        title: 'Singular Value Decomposition (SVD)',
        latex: 'A = U \\Sigma V^T, \\quad \\sigma_i = \\sqrt{\\lambda_i(A^T A)}',
        description: 'Any m×n matrix A can be written as A = UΣVᵀ where U (m×m) and V (n×n) are orthogonal, and Σ is diagonal with σ₁ ≥ σ₂ ≥ ⋯ ≥ 0.',
        isKey: true,
      },
      {
        id: 'spectral-radius',
        title: 'Spectral Radius',
        latex: '\\rho(A) = \\max_i |\\lambda_i(A)|',
        description: 'The largest absolute eigenvalue. For symmetric A: ‖A‖₂ = ρ(A) = σ_max.',
        isKey: false,
      },
      {
        id: 'ata-properties',
        title: 'Properties of AᵀA',
        latex: 'A^T A \\text{ is always symmetric PSD}; \\text{ SPD iff } \\text{rank}(A) = n',
        description: 'The eigenvalues of AᵀA are the squared singular values of A: λᵢ(AᵀA) = σᵢ². This connects SVD to eigenvalue theory.',
        isKey: true,
      },
    ],
    content: [
      {
        type: 'text',
        content: '**Eigenvalues and Eigenvectors**\n\nFor a square matrix $A \\in \\mathbb{R}^{n \\times n}$, a scalar $\\lambda$ and non-zero vector $\\mathbf{v}$ satisfying $A\\mathbf{v} = \\lambda \\mathbf{v}$ are called an **eigenvalue** and **eigenvector** pair.\n\nGeometrically: $A$ stretches (or flips) $\\mathbf{v}$ by factor $\\lambda$ without changing its direction.\n\n**Finding eigenvalues**: solve the characteristic equation $\\det(A - \\lambda I) = 0$.\n\nKey facts:\n- An $n \\times n$ matrix has exactly $n$ eigenvalues (counting multiplicity, possibly complex)\n- $\\text{tr}(A) = \\sum_i \\lambda_i$ and $\\det(A) = \\prod_i \\lambda_i$\n- Symmetric matrices have **real** eigenvalues\n- SPD matrices have **positive** eigenvalues',
      },
      {
        type: 'example',
        title: 'Example: Finding Eigenvalues of a 2×2 Matrix',
        content: 'A = [[3, 1], [1, 3]]\n\nCharacteristic equation: det(A − λI) = 0\n  det([[3−λ, 1], [1, 3−λ]]) = (3−λ)² − 1 = 0\n  (3−λ)² = 1\n  3−λ = ±1\n  λ₁ = 4,  λ₂ = 2\n\nCheck: tr(A) = 3 + 3 = 6 = λ₁ + λ₂ = 4 + 2 ✓\n       det(A) = 9 − 1 = 8 = λ₁ · λ₂ = 4 · 2 ✓\n\nSince A is symmetric and both eigenvalues are positive → A is SPD.',
      },
      {
        type: 'text',
        content: '**Singular Value Decomposition (SVD)**\n\nThe SVD generalizes eigendecomposition to **rectangular** matrices. For $A \\in \\mathbb{R}^{m \\times n}$:\n$$A = U \\Sigma V^T$$\n\nwhere:\n- $U \\in \\mathbb{R}^{m \\times m}$: orthogonal matrix, columns are **left singular vectors**\n- $\\Sigma \\in \\mathbb{R}^{m \\times n}$: diagonal, entries $\\sigma_1 \\geq \\sigma_2 \\geq \\cdots \\geq 0$ are **singular values**\n- $V \\in \\mathbb{R}^{n \\times n}$: orthogonal matrix, columns are **right singular vectors**\n\n**Connection to eigenvalues:**\n- $\\sigma_i = \\sqrt{\\lambda_i(A^T A)}$ — singular values are square roots of eigenvalues of $A^T A$\n- $A^T A = V \\Sigma^T \\Sigma V^T$ — eigendecomposition of $A^T A$\n- $A A^T = U \\Sigma \\Sigma^T U^T$ — eigendecomposition of $A A^T$\n\n**Why SVD matters in DSA2102:**\n- $\\|A\\|_2 = \\sigma_{\\max}$ (spectral norm = largest singular value)\n- $\\kappa_2(A) = \\sigma_{\\max} / \\sigma_{\\min}$ (condition number)\n- Rank of $A$ = number of non-zero singular values',
      },
      {
        type: 'highlight',
        title: 'Key Matrix Identities Cheat Sheet',
        content: '**Transpose identities:**\n  (AB)ᵀ = BᵀAᵀ\n  (Aᵀ)ᵀ = A\n  (A⁻¹)ᵀ = (Aᵀ)⁻¹\n\n**Inverse identities:**\n  (AB)⁻¹ = B⁻¹A⁻¹\n  (Aᵀ)⁻¹ = (A⁻¹)ᵀ\n  (A⁻¹)⁻¹ = A\n\n**Determinant identities:**\n  det(AB) = det(A)det(B)\n  det(Aᵀ) = det(A)\n  det(A⁻¹) = 1/det(A)\n  det(cA) = cⁿ det(A) for n×n matrix\n\n**Orthogonal matrix Q:**\n  QᵀQ = QQᵀ = I\n  Q⁻¹ = Qᵀ\n  ‖Qx‖₂ = ‖x‖₂\n  κ₂(Q) = 1\n\n**AᵀA properties:**\n  (AᵀA)ᵀ = AᵀA (symmetric)\n  xᵀ(AᵀA)x = ‖Ax‖₂² ≥ 0 (PSD)\n  SPD iff rank(A) = n',
      },
      {
        type: 'text',
        content: '**Matrix-Vector Product as Linear Combination**\n\nA crucial way to think about $A\\mathbf{x}$: it is a **linear combination of the columns of $A$** with coefficients from $\\mathbf{x}$:\n$$A\\mathbf{x} = x_1 \\mathbf{a}_1 + x_2 \\mathbf{a}_2 + \\cdots + x_n \\mathbf{a}_n$$\n\nwhere $\\mathbf{a}_j$ is the $j$-th column of $A$.\n\nThis means: $A\\mathbf{x} = \\mathbf{b}$ is asking "can $\\mathbf{b}$ be written as a linear combination of the columns of $A$?"\n\n- If yes (and $A$ has full column rank): unique solution $\\mathbf{x}$\n- If yes (but $A$ is rank-deficient): infinitely many solutions\n- If no ($\\mathbf{b} \\notin \\text{col}(A)$): no exact solution → use least squares to find the best approximate solution',
      },
      {
        type: 'text',
        content: '**The Normal Equations — Connecting Everything**\n\nThe least squares problem $\\min_{\\mathbf{x}} \\|A\\mathbf{x} - \\mathbf{b}\\|_2$ leads to the **normal equations**:\n$$A^T A \\hat{\\mathbf{x}} = A^T \\mathbf{b}$$\n\nWhy "normal"? Because the residual $\\mathbf{r} = \\mathbf{b} - A\\hat{\\mathbf{x}}$ is **normal** (perpendicular) to $\\text{col}(A)$.\n\nThis uses almost everything in this primer:\n- $(A^T A)$ is symmetric (transpose identity)\n- $(A^T A)$ is SPD when $A$ has full column rank (eigenvalue fact)\n- We can apply Cholesky to $A^T A$ (SPD → Cholesky)\n- Or use QR: $A = QR$ → $\\hat{\\mathbf{x}} = R^{-1} Q^T \\mathbf{b}$ (orthogonality)\n- The condition number $\\kappa_2(A^T A) = \\kappa_2(A)^2$ — squaring worsens conditioning!',
      },
    ],
    quiz: [
      {
        id: 'q-c0t4-1',
        question: 'For A = [[2, 0], [0, 5]], what are the singular values of A?',
        options: ['2 and 5', '4 and 25', '√2 and √5', '√29'],
        correctIndex: 0,
        explanation: 'For a diagonal matrix with positive entries, the singular values equal the diagonal entries: σ₁ = 5, σ₂ = 2 (ordered σ₁ ≥ σ₂). So the singular values are 5 and 2. (AᵀA = [[4,0],[0,25]], eigenvalues 4 and 25, square roots give 2 and 5.)',
        topicId: 'c0t4',
      },
      {
        id: 'q-c0t4-2',
        question: 'The condition number κ₂(A) = σ_max / σ_min. If σ_max = 100 and σ_min = 0.01, what is κ₂(A)?',
        options: ['100.01', '10000', '1', '99.99'],
        correctIndex: 1,
        explanation: 'κ₂(A) = σ_max / σ_min = 100 / 0.01 = 10000. This is a very ill-conditioned matrix — solving Ax = b could lose up to 4 decimal digits of accuracy.',
        topicId: 'c0t4',
      },
      {
        id: 'q-c0t4-3',
        question: 'A has full column rank. Which statement about AᵀA is correct?',
        options: [
          'AᵀA is symmetric but may be singular',
          'AᵀA is symmetric positive definite (SPD)',
          'AᵀA = AᵀA only if A is square',
          'AᵀA has the same eigenvalues as A',
        ],
        correctIndex: 1,
        explanation: 'When A has full column rank, AᵀA is SPD: it is symmetric by (AᵀA)ᵀ = AᵀA, and positive definite because xᵀ(AᵀA)x = ‖Ax‖₂² > 0 for all x ≠ 0 (since Ax = 0 only if x = 0 when A has full column rank).',
        topicId: 'c0t4',
      },
      {
        id: 'q-c0t4-4',
        question: 'Why is solving the normal equations AᵀAx̂ = Aᵀb potentially less stable than using QR factorization?',
        options: [
          'AᵀA is not always invertible',
          'κ₂(AᵀA) = κ₂(A)² — squaring the condition number doubles the potential error',
          'QR is faster than solving the normal equations',
          'The normal equations do not give the least squares solution',
        ],
        correctIndex: 1,
        explanation: 'κ₂(AᵀA) = (σ_max/σ_min)² = κ₂(A)². Squaring the condition number means if A is moderately ill-conditioned (κ₂ = 10⁶), then AᵀA has κ₂ = 10¹², potentially causing catastrophic loss of precision. QR avoids forming AᵀA entirely.',
        topicId: 'c0t4',
      },
    ],
  },
];

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
        id: 'fp-single-epsilon',
        title: 'Machine Epsilon — Single Precision (float32)',
        latex: '\\epsilon_{\\text{mach}}^{\\text{single}} = 2^{-(24-1)} = 2^{-23} \\approx 1.19 \\times 10^{-7}',
        description: 'For IEEE 754 single precision: p = 24 (23 stored fraction bits + 1 implicit leading 1). Machine epsilon is 2^{-23} ≈ 1.19 × 10⁻⁷, about 10⁸ times larger than double precision.',
        isKey: true,
      },
      {
        id: 'fp-single-overflow',
        title: 'Overflow Threshold — Single Precision (float32)',
        latex: '\\Omega_{\\text{single}} = (2 - 2^{-23}) \\times 2^{127} \\approx 3.4 \\times 10^{38}',
        description: 'The largest finite single-precision number. Any result exceeding this overflows to ±Inf. Compare to double: Ω_double ≈ 1.8 × 10³⁰⁸.',
        isKey: true,
      },
      {
        id: 'fp-single-underflow',
        title: 'Underflow Threshold — Smallest Normal Single Precision',
        latex: '\\lambda_{\\text{single}} = 2^{-126} \\approx 1.18 \\times 10^{-38}',
        description: 'The smallest positive normalised single-precision number. Below this the number becomes subnormal. Compare to double: λ_double = 2^{-1022} ≈ 2.2 × 10⁻³⁰⁸.',
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
        content: '**IEEE 754 Single Precision Standard (float32)**\n\nSingle precision uses 32 bits total:\n- 1 sign bit (s)\n- 8 exponent bits — stored as unsigned integer; actual exponent = stored value − bias (127)\n- 23 fraction bits (b₁b₂...b₂₃) — implicit leading 1, so p = 24 bits of precision total\n- Total: 32 bits\n- Bias = 127 (so stored exponent = actual exponent + 127)\n\nThe value stored is: (−1)ˢ × 1.b₁b₂...b₂₃ × 2^(stored_exponent − 127)\n\nKey parameters:\n  ε_mach = 2⁻²³ ≈ 1.19 × 10⁻⁷ (about 7 significant decimal digits)\n  Ω ≈ 3.4 × 10³⁸ (overflow threshold)\n  λ = 2⁻¹²⁶ ≈ 1.18 × 10⁻³⁸ (smallest normal number)',
      },
      {
        type: 'text',
        content: '**Single vs Double Precision: Side-by-Side Comparison**\n\n| Property | Single (float32) | Double (float64) |\n|---|---|---|\n| Total bits | 32 | 64 |\n| Sign bits | 1 | 1 |\n| Exponent bits | 8 | 11 |\n| Fraction bits | 23 | 52 |\n| Precision p | 24 bits | 53 bits |\n| Bias | 127 | 1023 |\n| ε_mach | 2⁻²³ ≈ 1.19×10⁻⁷ | 2⁻⁵² ≈ 2.22×10⁻¹⁶ |\n| Decimal digits | ~7 | ~16 |\n| Max normal (Ω) | ≈3.4×10³⁸ | ≈1.8×10³⁰⁸ |\n| Min normal (λ) | ≈1.18×10⁻³⁸ | ≈2.2×10⁻³⁰⁸ |\n| Min subnormal | ≈1.4×10⁻⁴⁵ | ≈5×10⁻³²⁴ |\n| e_max | 127 | 1023 |\n| e_min | −126 | −1022 |\n\n**When to use each:**\n- **Double** (default in R, MATLAB, Python numpy float64): use whenever accuracy matters — scientific computing, numerical methods, DSA2102 assignments\n- **Single** (numpy float32, GPU deep learning): use when memory/speed is critical and ~7 significant digits is sufficient (e.g., neural network weights)',
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
        type: 'code',
        title: 'Example: Single vs Double Precision in Python (NumPy)',
        content: 'import numpy as np\n\n# ── MACHINE EPSILON ────────────────────────────────────────────────────────\nprint(np.finfo(np.float32).eps)   # single: 1.1920929e-07  (2^-23)\nprint(np.finfo(np.float64).eps)   # double: 2.220446e-16   (2^-52)\n\n# ── OVERFLOW THRESHOLD ─────────────────────────────────────────────────────\nprint(np.finfo(np.float32).max)   # single: 3.4028235e+38\nprint(np.finfo(np.float64).max)   # double: 1.7976931e+308\n\n# ── UNDERFLOW THRESHOLD (smallest normal) ──────────────────────────────────\nprint(np.finfo(np.float32).tiny)  # single: 1.1754944e-38  (2^-126)\nprint(np.finfo(np.float64).tiny)  # double: 2.2250739e-308 (2^-1022)\n\n# ── PRECISION LOSS IN SINGLE ───────────────────────────────────────────────\nx32 = np.float32(1.0) + np.float32(1e-7)\nx64 = np.float64(1.0) + np.float64(1e-7)\nprint(x32 == 1.0)   # True  — 1e-7 is near ε_mach, addition is lost!\nprint(x64 == 1.0)   # False — double has enough precision to detect the change\n\n# ── MEMORY COMPARISON ──────────────────────────────────────────────────────\na32 = np.zeros((1000, 1000), dtype=np.float32)\na64 = np.zeros((1000, 1000), dtype=np.float64)\nprint(a32.nbytes)   # 4,000,000 bytes  (4 MB)\nprint(a64.nbytes)   # 8,000,000 bytes  (8 MB) — double uses 2× memory',
      },
      {
        type: 'highlight',
        title: '⚡ Exam Technique: Floating-Point Bit Decoding (5 Steps in 30 Seconds)',
        content: 'This method works for almost every floating-point decoding question. Memorise this checklist and you can decode any IEEE 754 number — half, single, or double — in under 30 seconds.',
      },
      {
        type: 'text',
        content: '**Half-precision format recap:** 1 sign bit | 5 exponent bits | 10 fraction bits | bias = 2^(5−1) − 1 = 15\n\n**Step 1 — Split the bits**\nWrite out the number and divide into three groups: sign | exponent | fraction.\nExample (a): 0100110001110000 → 0 | 10011 | 0001110000\n\n**Step 2 — Determine the case (most important step)**\nCheck the exponent bits FIRST — this tells you which formula to use:\n\n| Exponent bits | Meaning |\n|---|---|\n| all 0s (00000) | Subnormal number |\n| all 1s (11111) | Special: ∞ or NaN |\n| anything else | Normal number |\n\n**Step 3 — Determine the sign**\nSign bit 0 → positive (+1). Sign bit 1 → negative (−1).\n\n**Step 4 — Compute the stored exponent**\nConvert exponent bits to decimal, then subtract the bias.\nE = exponent_decimal − bias\nExample: 10011₂ = 19, so E = 19 − 15 = 4\n\n**Step 5 — Compute the significand**\n- Normal: significand = 1.f (leading 1 is implicit, not stored)\n- Subnormal: significand = 0.f (no leading 1); exponent fixed at 1 − bias = −14\n\n**Step 6 — Combine**\n- Normal: (−1)^s × (1.f) × 2^E\n- Subnormal: (−1)^s × (0.f) × 2^(1−bias)',
      },
      {
        type: 'example',
        title: 'Worked Examples: Applying the 5-Step Method',
        content: 'Example (a): 0 | 10011 | 0001110000\nExponent = 10011₂ = 19, not all-0 or all-1 → NORMAL\nSign: (−1)^0 = +\nE = 19 − 15 = 4\nSignificand: 1.0001110000 = 1 + 1/16 + 1/32 + 1/64 = 1.109375\nFinal: 1.109375 × 2^4 = 17.75\n\nExample (b): 1 | 00000 | 1111111111\nExponent = 00000 → SUBNORMAL\nSign: (−1)^1 = −\nSignificand: 0.1111111111 = 1 − 2^(−10)\nExponent fixed: 2^(1−15) = 2^(−14)\nFinal: −(1 − 2^(−10)) × 2^(−14)\n\nExample (c): 0 | 11111 | 0000000000\nExponent = 11111 → SPECIAL\nFraction = all zeros → +∞',
      },
      {
        type: 'highlight',
        title: '🧠 Decision Tree (Memorise This)',
        content: 'Check exponent bits first:\n\n1. Exponent = 11111 (all ones)\n   → fraction = 0: ±∞\n   → fraction ≠ 0: NaN\n\n2. Exponent = 00000 (all zeros)\n   → SUBNORMAL: significand = 0.f, exponent = 1 − bias\n\n3. Otherwise\n   → NORMAL: significand = 1.f, exponent = stored − bias\n\nThen apply: (−1)^s × significand × 2^exponent\n\n**10-Second Mental Checklist:**\n1. Split bits into sign | exponent | fraction\n2. Check exponent pattern (all-0, all-1, or normal)\n3. Compute E = exponent_decimal − bias\n4. Write 1.f (normal) or 0.f (subnormal)\n5. Multiply by 2^E and apply sign',
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
      {
        id: 'q-c1t3-5',
        question: 'In IEEE 754 single precision (float32), how many bits are allocated to the exponent and fraction respectively?',
        options: [
          '8 exponent bits, 23 fraction bits',
          '11 exponent bits, 20 fraction bits',
          '7 exponent bits, 24 fraction bits',
          '10 exponent bits, 21 fraction bits',
        ],
        correctIndex: 0,
        explanation: 'IEEE 754 single precision: 1 sign + 8 exponent + 23 fraction = 32 bits total. The bias is 127, giving e_max = 127 and e_min = -126. This gives p = 24 bits of precision (23 stored + 1 implicit leading 1).',
        topicId: 'c1t3',
      },
      {
        id: 'q-c1t3-6',
        question: 'Machine epsilon for single precision is approximately 1.19 × 10⁻⁷. If you compute (float32(1.0) + float32(5e-8)), what is the most likely result?',
        options: [
          '1.00000005 (the addition is captured exactly)',
          '1.0 (the addition is completely lost — 5e-8 < ε_mach/2)',
          'NaN (addition of different magnitudes is undefined)',
          '1.0000001 (rounded up to nearest representable value)',
        ],
        correctIndex: 1,
        explanation: 'ε_mach for float32 ≈ 1.19 × 10⁻⁷. Since 5 × 10⁻⁸ < ε_mach/2, when 1.0 + 5e-8 is rounded to the nearest float32, it rounds back to 1.0. The addition is completely lost. This illustrates why single precision is dangerous for iterative numerical algorithms where small increments accumulate.',
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
        content: '**Part 1 — Vector Norms**\n\nA norm is a function that assigns a non-negative "size" or "length" to a vector. For a vector x = [x₁, x₂, …, xₙ]ᵀ, the three most important norms are:\n\n**1-norm (Manhattan / taxicab norm):**\n  ‖x‖₁ = |x₁| + |x₂| + … + |xₙ|   (sum of absolute values)\n\n**2-norm (Euclidean norm):**\n  ‖x‖₂ = √(x₁² + x₂² + … + xₙ²)   (ordinary geometric length)\n\n**∞-norm (Chebyshev / max norm):**\n  ‖x‖∞ = max(|x₁|, |x₂|, …, |xₙ|)  (largest absolute entry)\n\n**Worked Example** — let x = [3, −4, 1]ᵀ:\n  ‖x‖₁ = |3| + |−4| + |1| = 3 + 4 + 1 = 8\n  ‖x‖₂ = √(3² + (−4)² + 1²) = √(9 + 16 + 1) = √26 ≈ 5.099\n  ‖x‖∞ = max(3, 4, 1) = 4\n\n**Key inequality:** ‖x‖∞ ≤ ‖x‖₂ ≤ ‖x‖₁ ≤ √n · ‖x‖₂ ≤ n · ‖x‖∞\nAll norms are equivalent for finite-dimensional spaces — they differ by at most a constant factor.',
      },
      {
        type: 'text',
        content: '**Part 2 — Matrix Norms (Induced / Operator Norms)**\n\nThe induced (operator) norm of a matrix A is defined as the maximum factor by which A can stretch a unit vector:\n\n  ‖A‖ = max_{x ≠ 0} ‖Ax‖ / ‖x‖  =  max_{‖x‖ = 1} ‖Ax‖\n\nThis measures the "worst-case amplification" of A.\n\n**The three main induced matrix norms:**\n\n**1-norm (max column sum):**\n  ‖A‖₁ = max over all columns j of (sum of |aᵢⱼ| for all rows i)\n  → Find the column whose entries have the largest sum of absolute values.\n\n**∞-norm (max row sum):**\n  ‖A‖∞ = max over all rows i of (sum of |aᵢⱼ| for all columns j)\n  → Find the row whose entries have the largest sum of absolute values.\n\n**2-norm (spectral norm):**\n  ‖A‖₂ = σ_max(A)  (the largest singular value of A)\n  → This requires SVD to compute; hardest to do by hand.\n\n**Frobenius norm (not induced, but very useful):**\n  ‖A‖_F = √(Σᵢ Σⱼ aᵢⱼ²)  (square root of sum of all squared entries)\n  → Easy to compute; think of it as the 2-norm of A "flattened" into a vector.\n\n**Worked Example** — let A = [[3, 1], [−2, 4]]:\n\n  ‖A‖₁: Column 1 sum = |3| + |−2| = 5; Column 2 sum = |1| + |4| = 5  →  ‖A‖₁ = 5\n  ‖A‖∞: Row 1 sum = |3| + |1| = 4; Row 2 sum = |−2| + |4| = 6  →  ‖A‖∞ = 6\n  ‖A‖_F: √(3² + 1² + (−2)² + 4²) = √(9 + 1 + 4 + 16) = √30 ≈ 5.477\n\n**Important property:** For any induced norm, ‖AB‖ ≤ ‖A‖ · ‖B‖ (submultiplicativity).\nAlso: ‖Ax‖ ≤ ‖A‖ · ‖x‖ — this is used directly in the perturbation bound derivation.',
      },
      {
        type: 'example',
        title: 'Worked Example: Computing κ₂(A) = ‖A‖₂ · ‖A⁻¹‖₂ = σ_max / σ_min',
        content: 'The 2-norm condition number κ₂(A) is defined as:\n\n  κ₂(A) = ‖A‖₂ · ‖A⁻¹‖₂\n\nSince ‖A‖₂ = σ_max(A) and ‖A⁻¹‖₂ = 1/σ_min(A), this simplifies to:\n\n  κ₂(A) = σ_max / σ_min\n\nWhy? The singular values of A⁻¹ are the reciprocals of the singular values of A (in reverse order). So the largest singular value of A⁻¹ is 1/σ_min(A).\n\n────────────────────────────────────────────\nEXAMPLE 1 — Diagonal matrix (easy case)\n────────────────────────────────────────────\nLet A = diag(5, 2, 0.1)  (a 3×3 diagonal matrix with entries 5, 2, 0.1).\n\nFor a diagonal matrix, the singular values ARE the absolute values of the diagonal entries:\n  σ₁ = 5,  σ₂ = 2,  σ₃ = 0.1\n  → σ_max = 5,  σ_min = 0.1\n\nκ₂(A) = σ_max / σ_min = 5 / 0.1 = 50\n\nInterpretation: A relative perturbation of size ε in b can cause a relative error of up to 50ε in x. This is well-conditioned.\n\n────────────────────────────────────────────\nEXAMPLE 2 — Ill-conditioned matrix\n────────────────────────────────────────────\nLet A = [[1, 1], [1, 1.0001]]\n\nThis matrix looks almost singular (rows nearly identical). Its singular values are approximately:\n  σ_max ≈ √2 ≈ 1.4142,  σ_min ≈ 0.0001 / √2 ≈ 0.0000707\n\nκ₂(A) ≈ 1.4142 / 0.0000707 ≈ 20,000\n\nInterpretation: A relative error of 10⁻⁶ in b could produce a relative error of up to 20,000 × 10⁻⁶ = 0.02 (2%) in x. Ill-conditioned!\n\n────────────────────────────────────────────\nEXAMPLE 3 — Orthogonal matrix (best case)\n────────────────────────────────────────────\nLet Q be any orthogonal matrix (QᵀQ = I), e.g. a rotation matrix.\n\nFor orthogonal matrices, all singular values equal 1:\n  σ_max = σ_min = 1\n\nκ₂(Q) = 1 / 1 = 1\n\nInterpretation: Orthogonal matrices are perfectly conditioned — they never amplify errors. This is why QR factorisation is numerically preferred over normal equations (AᵀA can have condition number κ₂(A)²).',
      },
      {
        type: 'highlight',
        title: '⚠️ Key Insight: Why κ₂(A) = σ_max / σ_min',
        content: 'The SVD of A is A = UΣVᵀ, where Σ = diag(σ₁, σ₂, …, σₙ) with σ₁ ≥ σ₂ ≥ … ≥ σₙ ≥ 0.\n\nThen A⁻¹ = VΣ⁻¹Uᵀ, where Σ⁻¹ = diag(1/σ₁, 1/σ₂, …, 1/σₙ).\n\nSo:\n  ‖A‖₂ = σ_max = σ₁   (largest singular value)\n  ‖A⁻¹‖₂ = 1/σ_min = 1/σₙ   (largest singular value of A⁻¹)\n\nTherefore:\n  κ₂(A) = ‖A‖₂ · ‖A⁻¹‖₂ = σ₁ · (1/σₙ) = σ_max / σ_min\n\nPractical note in R: use kappa(A, exact=TRUE) to compute κ₂(A), or compute it directly as max(svd(A)$d) / min(svd(A)$d).',
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
    id: 'ch0',
    number: 0,
    title: 'Linear Algebra Primer',
    subtitle: 'Matrices, Invertibility, Orthogonality & SVD',
    bgImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&q=80',
    accentColor: '#6B4C9A',
    icon: '📐',
    topics: chapter0Topics,
  },
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
