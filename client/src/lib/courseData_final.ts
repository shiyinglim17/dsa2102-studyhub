// ============================================================
// DSA2102 Final Exam Study Hub — Extended courseData.ts
// Design: "Tropical Golden Hour Study Retreat"
// Source: School-provided lecture notes (L1.1–L3.8 + Weeks 5-13) + Tutorial sheets 1–10
// ============================================================

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
// CHAPTER 4: EIGENVALUE PROBLEMS & SINGULAR VALUE DECOMPOSITION
// ============================================================

const chapter4Topics: Topic[] = [
  {
    id: 'c4t1',
    title: 'Eigenvalues, Eigenvectors & Characteristic Polynomial',
    lectureRef: 'Week 10',
    formulas: [
      {
        id: 'eigenvalue-def',
        title: 'Eigenvalue & Eigenvector',
        latex: 'A\\mathbf{v} = \\lambda \\mathbf{v}, \\quad \\mathbf{v} \\neq \\mathbf{0}',
        description: 'λ is an eigenvalue of A, v is the corresponding eigenvector.',
        isKey: true,
      },
      {
        id: 'char-poly',
        title: 'Characteristic Polynomial',
        latex: 'p(\\lambda) = \\det(A - \\lambda I)',
        description: 'The eigenvalues of A are the roots of the characteristic polynomial.',
        isKey: true,
      },
      {
        id: 'trace-sum-eigs',
        title: 'Trace & Sum of Eigenvalues',
        latex: '\\text{tr}(A) = \\sum_{i=1}^{n} \\lambda_i',
        description: 'The trace of A equals the sum of all eigenvalues.',
        isKey: true,
      },
      {
        id: 'det-prod-eigs',
        title: 'Determinant & Product of Eigenvalues',
        latex: '\\det(A) = \\prod_{i=1}^{n} \\lambda_i',
        description: 'The determinant of A equals the product of all eigenvalues.',
        isKey: true,
      },
    ],
    content: [
      {
        type: 'highlight',
        title: 'Core Concepts',
        content: 'Eigenvalues and eigenvectors are fundamental in numerical linear algebra. They describe the directions and magnitudes of stretching/shrinking that a matrix applies to vectors.',
      },
      {
        type: 'text',
        content: '**Definition**\n\nFor an n×n matrix A, a scalar λ is an **eigenvalue** if there exists a nonzero vector **v** such that:\n\nA**v** = λ**v**\n\nThe vector **v** is called an **eigenvector** corresponding to λ.\n\nGeometrically: A**v** = λ**v** means that multiplying A by **v** simply scales **v** by the factor λ (no rotation or change in direction).',
      },
      {
        type: 'text',
        content: '**Finding Eigenvalues**\n\nRearrange A**v** = λ**v** as (A − λI)**v** = **0**.\n\nFor a nonzero solution to exist, the matrix (A − λI) must be singular:\n\ndet(A − λI) = 0\n\nThis is the **characteristic equation**. The polynomial p(λ) = det(A − λI) is the **characteristic polynomial** of degree n, so there are at most n eigenvalues (counting multiplicities).',
      },
      {
        type: 'example',
        title: 'Example: 2×2 Matrix',
        content: 'A = [[3, 1], [0, 2]]\n\nCharacteristic polynomial: det(A − λI) = det([[3−λ, 1], [0, 2−λ]]) = (3−λ)(2−λ) = 0\n\nEigenvalues: λ₁ = 3, λ₂ = 2\n\nFor λ₁ = 3: (A − 3I)**v** = [[0, 1], [0, −1]]**v** = **0** ⟹ **v** = [1, 0]ᵀ\nFor λ₂ = 2: (A − 2I)**v** = [[1, 1], [0, 0]]**v** = **0** ⟹ **v** = [−1, 1]ᵀ',
      },
    ],
    quiz: [
      {
        id: 'q-c4t1-1',
        question: 'If A**v** = λ**v** with **v** ≠ **0**, what is the relationship between A, λ, and **v**?',
        options: [
          'λ is a scalar multiple of A',
          'λ is an eigenvalue and **v** is an eigenvector of A',
          '**v** is a scalar multiple of λ',
          'A and λ are orthogonal',
        ],
        correctIndex: 1,
        explanation: 'By definition, if A**v** = λ**v** for a nonzero vector **v**, then λ is an eigenvalue of A and **v** is the corresponding eigenvector.',
        topicId: 'c4t1',
      },
      {
        id: 'q-c4t1-2',
        question: 'The eigenvalues of a matrix A are the roots of which polynomial?',
        options: [
          'The minimal polynomial',
          'The characteristic polynomial det(A − λI)',
          'The trace polynomial',
          'The determinant polynomial',
        ],
        correctIndex: 1,
        explanation: 'The eigenvalues are exactly the values of λ that satisfy det(A − λI) = 0, i.e., the roots of the characteristic polynomial.',
        topicId: 'c4t1',
      },
    ],
  },
  {
    id: 'c4t2',
    title: 'Power Iteration & Inverse Iteration',
    lectureRef: 'Week 10',
    formulas: [
      {
        id: 'power-iter',
        title: 'Power Iteration',
        latex: '\\mathbf{v}^{(k+1)} = \\frac{A\\mathbf{v}^{(k)}}{\\|A\\mathbf{v}^{(k)}\\|}, \\quad \\lambda \\approx \\mathbf{v}^{(k)T} A \\mathbf{v}^{(k)}',
        description: 'Iteratively computes the dominant (largest magnitude) eigenvalue and eigenvector.',
        isKey: true,
      },
      {
        id: 'inverse-iter',
        title: 'Inverse Iteration',
        latex: '\\text{Solve } (A - \\sigma I)\\mathbf{w} = \\mathbf{v}^{(k)}, \\quad \\mathbf{v}^{(k+1)} = \\frac{\\mathbf{w}}{\\|\\mathbf{w}\\|}',
        description: 'Finds eigenvalues closest to a shift σ by iterating on (A − σI)⁻¹.',
        isKey: true,
      },
      {
        id: 'rayleigh-quotient',
        title: 'Rayleigh Quotient',
        latex: '\\rho(\\mathbf{v}) = \\frac{\\mathbf{v}^T A \\mathbf{v}}{\\mathbf{v}^T \\mathbf{v}}',
        description: 'An estimate of the eigenvalue corresponding to approximate eigenvector **v**. Converges quadratically in Rayleigh quotient iteration.',
        isKey: true,
      },
    ],
    content: [
      {
        type: 'text',
        content: '**Power Iteration**\n\nThe power iteration method finds the eigenvalue with the largest absolute value (the dominant eigenvalue) and its corresponding eigenvector.\n\nAlgorithm:\n1. Start with an initial guess **v**⁽⁰⁾\n2. Repeat: **v**⁽ᵏ⁺¹⁾ = A**v**⁽ᵏ⁾ / ‖A**v**⁽ᵏ⁾‖\n3. The Rayleigh quotient ρ(**v**⁽ᵏ⁾) = **v**⁽ᵏ⁾ᵀ A **v**⁽ᵏ⁾ / **v**⁽ᵏ⁾ᵀ **v**⁽ᵏ⁾ converges to the dominant eigenvalue.',
      },
      {
        type: 'text',
        content: '**Inverse Iteration**\n\nInverse iteration finds eigenvalues near a given shift σ by applying power iteration to (A − σI)⁻¹.\n\nAlgorithm:\n1. Factor A − σI = LU (once)\n2. For each iteration:\n   - Solve (A − σI)**w** = **v**⁽ᵏ⁾ using the LU factorization\n   - Normalize: **v**⁽ᵏ⁺¹⁾ = **w** / ‖**w**‖\n3. The eigenvalue of A closest to σ is found.\n\nUseful for finding specific eigenvalues when σ is chosen near the desired eigenvalue.',
      },
    ],
    quiz: [
      {
        id: 'q-c4t2-1',
        question: 'What eigenvalue does power iteration find?',
        options: [
          'The smallest eigenvalue',
          'The eigenvalue closest to zero',
          'The eigenvalue with the largest absolute value (dominant eigenvalue)',
          'All eigenvalues simultaneously',
        ],
        correctIndex: 2,
        explanation: 'Power iteration converges to the dominant eigenvalue (largest in absolute value) because repeated multiplication by A amplifies the component in the direction of the dominant eigenvector.',
        topicId: 'c4t2',
      },
    ],
  },
  {
    id: 'c4t3',
    title: 'QR Iteration & Eigenvalue Algorithms',
    lectureRef: 'Week 10',
    formulas: [
      {
        id: 'qr-iter',
        title: 'QR Iteration',
        latex: 'U^{(k)} = Q^{(k)} R^{(k)}, \\quad U^{(k+1)} = R^{(k)} Q^{(k)}',
        description: 'Repeatedly factors U as QR and updates U ← RQ. Converges to upper triangular form with eigenvalues on the diagonal.',
        isKey: true,
      },
      {
        id: 'hessenberg',
        title: 'Upper Hessenberg Form',
        latex: 'H = \\begin{pmatrix} * & * & * & \\cdots & * \\\\ * & * & * & \\cdots & * \\\\ 0 & * & * & \\cdots & * \\\\ 0 & 0 & * & \\cdots & * \\\\ \\vdots & \\vdots & \\vdots & \\ddots & \\vdots \\end{pmatrix}',
        description: 'A matrix with zeros below the first subdiagonal. Reduces computational cost of QR iteration.',
        isKey: true,
      },
    ],
    content: [
      {
        type: 'text',
        content: '**QR Iteration**\n\nThe QR iteration is one of the most important algorithms for computing all eigenvalues of a matrix.\n\nAlgorithm:\n1. Set U⁽⁰⁾ = A\n2. For k = 0, 1, 2, …:\n   - Factor U⁽ᵏ⁾ = Q⁽ᵏ⁾ R⁽ᵏ⁾\n   - Set U⁽ᵏ⁺¹⁾ = R⁽ᵏ⁾ Q⁽ᵏ⁾\n3. Continue until the subdiagonal entries are negligible. The diagonal entries converge to the eigenvalues.',
      },
      {
        type: 'text',
        content: '**Hessenberg Reduction**\n\nBefore QR iteration, reduce A to upper Hessenberg form (zeros below the first subdiagonal) using Householder reflections. This reduces the cost of each QR factorization from O(n³) to O(n²).\n\nAfter Hessenberg reduction, the QR iteration preserves the Hessenberg structure, making each iteration much cheaper.',
      },
    ],
    quiz: [],
  },
  {
    id: 'c4t4',
    title: 'Singular Value Decomposition (SVD)',
    lectureRef: 'Week 10',
    formulas: [
      {
        id: 'svd',
        title: 'Singular Value Decomposition',
        latex: 'A = U \\Sigma V^T, \\quad U \\in \\mathbb{R}^{m \\times m}, \\Sigma \\in \\mathbb{R}^{m \\times n}, V \\in \\mathbb{R}^{n \\times n}',
        description: 'Every real matrix A can be factored as the product of an orthogonal matrix U, a diagonal matrix Σ, and the transpose of an orthogonal matrix V.',
        isKey: true,
      },
      {
        id: 'singular-values',
        title: 'Singular Values',
        latex: '\\sigma_i = \\sqrt{\\lambda_i(A^T A)} = \\sqrt{\\lambda_i(A A^T)}',
        description: 'The singular values are the square roots of the eigenvalues of AᵀA (or AAᵀ).',
        isKey: true,
      },
      {
        id: 'svd-rank',
        title: 'Rank via SVD',
        latex: '\\text{rank}(A) = \\text{number of nonzero singular values}',
        description: 'The rank of A equals the number of nonzero singular values.',
        isKey: true,
      },
      {
        id: 'svd-norm',
        title: 'Spectral Norm',
        latex: '\\|A\\|_2 = \\sigma_1 = \\text{largest singular value}',
        description: 'The 2-norm (spectral norm) of A is its largest singular value.',
        isKey: true,
      },
    ],
    content: [
      {
        type: 'highlight',
        title: 'Core Concept',
        content: 'The SVD is one of the most powerful tools in numerical linear algebra and data science. It provides a complete decomposition of any matrix into orthogonal and diagonal components.',
      },
      {
        type: 'text',
        content: '**Definition**\n\nEvery real m×n matrix A can be factored as:\n\nA = UΣVᵀ\n\nwhere:\n- U is m×m orthogonal (UᵀU = I)\n- Σ is m×n diagonal with non-negative entries σ₁ ≥ σ₂ ≥ ... ≥ σₘᵢₙ₍ₘ,ₙ₎ ≥ 0 (singular values)\n- V is n×n orthogonal (VᵀV = I)\n\nThe columns of U are called left singular vectors, and the columns of V are called right singular vectors.',
      },
      {
        type: 'text',
        content: '**Computing Singular Values**\n\nThe singular values of A are the square roots of the eigenvalues of AᵀA:\n\nσᵢ = √λᵢ(AᵀA)\n\nAlternatively, they are the square roots of the eigenvalues of AAᵀ (which has the same nonzero eigenvalues as AᵀA).\n\nTo find the SVD:\n1. Compute AᵀA\n2. Find its eigenvalues λᵢ and eigenvectors (columns of V)\n3. Compute σᵢ = √λᵢ\n4. Compute U from A and V using AV = UΣ',
      },
      {
        type: 'example',
        title: 'Example: 2×2 Matrix',
        content: 'A = [[1, 0], [0, 2], [0, 0]]\n\nAᵀA = [[1, 0], [0, 4]]\n\nEigenvalues of AᵀA: λ₁ = 4, λ₂ = 1\nSingular values: σ₁ = 2, σ₂ = 1\n\nEigenvectors of AᵀA: v₁ = [0, 1]ᵀ, v₂ = [1, 0]ᵀ\nSo V = [[0, 1], [1, 0]]\n\nFrom AV = UΣ:\nU = [[0, 1, 0], [1, 0, 0], [0, 0, 1]]\nΣ = [[2, 0], [0, 1], [0, 0]]',
      },
    ],
    quiz: [
      {
        id: 'q-c4t4-1',
        question: 'What is the relationship between singular values and eigenvalues?',
        options: [
          'They are the same',
          'Singular values are the square roots of eigenvalues of AᵀA',
          'Singular values are always larger than eigenvalues',
          'There is no relationship',
        ],
        correctIndex: 1,
        explanation: 'The singular values σᵢ of A are related to the eigenvalues λᵢ of AᵀA by σᵢ = √λᵢ.',
        topicId: 'c4t4',
      },
      {
        id: 'q-c4t4-2',
        question: 'What does the rank of a matrix equal in terms of its SVD?',
        options: [
          'The number of rows',
          'The number of columns',
          'The number of nonzero singular values',
          'The largest singular value',
        ],
        correctIndex: 2,
        explanation: 'The rank of A equals the number of nonzero singular values in its SVD. This is a fundamental property of the SVD.',
        topicId: 'c4t4',
      },
    ],
  },
];

// ============================================================
// CHAPTER 5: INTERPOLATION
// ============================================================

const chapter5Topics: Topic[] = [
  {
    id: 'c5t1',
    title: 'Polynomial Interpolation: Monomial & Lagrange Bases',
    lectureRef: 'Week 11',
    formulas: [
      {
        id: 'interp-problem',
        title: 'Polynomial Interpolation Problem',
        latex: '\\text{Given } (x_0, y_0), \\ldots, (x_n, y_n), \\text{ find } p(x) \\text{ such that } p(x_i) = y_i \\text{ for all } i',
        description: 'Find a polynomial that passes through all given data points.',
        isKey: true,
      },
      {
        id: 'vandermonde',
        title: 'Vandermonde Matrix (Monomial Basis)',
        latex: 'V = \\begin{pmatrix} 1 & x_0 & x_0^2 & \\cdots & x_0^n \\\\ 1 & x_1 & x_1^2 & \\cdots & x_1^n \\\\ \\vdots & \\vdots & \\vdots & \\ddots & \\vdots \\\\ 1 & x_n & x_n^2 & \\cdots & x_n^n \\end{pmatrix}',
        description: 'The system Va = y gives the coefficients of the interpolating polynomial in the monomial basis 1, x, x², ..., xⁿ.',
        isKey: true,
      },
      {
        id: 'lagrange-basis',
        title: 'Lagrange Basis Functions',
        latex: 'L_k(x) = \\prod_{j=0, j \\neq k}^{n} \\frac{x - x_j}{x_k - x_j}',
        description: 'The Lagrange basis function Lₖ(x) equals 1 at xₖ and 0 at all other nodes.',
        isKey: true,
      },
      {
        id: 'lagrange-interp',
        title: 'Lagrange Interpolation Formula',
        latex: 'p(x) = \\sum_{k=0}^{n} y_k L_k(x)',
        description: 'The interpolating polynomial expressed as a sum of Lagrange basis functions.',
        isKey: true,
      },
    ],
    content: [
      {
        type: 'highlight',
        title: 'Core Concept',
        content: 'Polynomial interpolation is the process of finding a polynomial that passes through a set of given data points. It is useful for approximating functions and for numerical integration and differentiation.',
      },
      {
        type: 'text',
        content: '**The Interpolation Problem**\n\nGiven n+1 distinct points (x₀, y₀), (x₁, y₁), ..., (xₙ, yₙ), find a polynomial p(x) of degree at most n such that:\n\np(xᵢ) = yᵢ for i = 0, 1, ..., n\n\nThe points xᵢ are called **nodes** or **interpolation points**. The unique polynomial of degree at most n satisfying these conditions is called the **interpolating polynomial**.',
      },
      {
        type: 'text',
        content: '**Monomial Basis Approach**\n\nExpress p(x) = a₀ + a₁x + a₂x² + ... + aₙxⁿ\n\nThe interpolation conditions p(xᵢ) = yᵢ give a system of linear equations:\n\nVa = y\n\nwhere V is the Vandermonde matrix and a = [a₀, a₁, ..., aₙ]ᵀ.\n\nThe Vandermonde matrix is invertible when all xᵢ are distinct, but it can be ill-conditioned for large n.',
      },
      {
        type: 'text',
        content: '**Lagrange Basis Approach**\n\nExpress p(x) as a linear combination of Lagrange basis functions:\n\np(x) = Σₖ yₖ Lₖ(x)\n\nwhere Lₖ(x) = ∏ⱼ≠ₖ (x − xⱼ)/(xₖ − xⱼ)\n\nEach Lₖ(x) satisfies Lₖ(xᵢ) = δₖᵢ (Kronecker delta), so p(xᵢ) = yᵢ automatically.\n\nAdvantage: No need to solve a linear system; the formula is explicit.',
      },
    ],
    quiz: [
      {
        id: 'q-c5t1-1',
        question: 'What is the degree of the unique interpolating polynomial through n+1 distinct points?',
        options: [
          'At most n',
          'Exactly n',
          'At most n+1',
          'At least n+1',
        ],
        correctIndex: 0,
        explanation: 'The unique polynomial of degree at most n passing through n+1 points is the interpolating polynomial. It may have degree less than n if the data is consistent with a lower-degree polynomial.',
        topicId: 'c5t1',
      },
    ],
  },
  {
    id: 'c5t2',
    title: 'Newton Basis & Divided Differences',
    lectureRef: 'Week 11',
    formulas: [
      {
        id: 'newton-basis',
        title: 'Newton Basis Functions',
        latex: 'N_k(x) = \\prod_{j=0}^{k-1} (x - x_j)',
        description: 'The Newton basis consists of products of linear factors. N₀(x) = 1, N₁(x) = (x−x₀), N₂(x) = (x−x₀)(x−x₁), etc.',
        isKey: true,
      },
      {
        id: 'divided-diff',
        title: 'Divided Differences',
        latex: 'f[x_0, \\ldots, x_k] = \\frac{f[x_1, \\ldots, x_k] - f[x_0, \\ldots, x_{k-1}]}{x_k - x_0}',
        description: 'Divided differences are defined recursively and form the coefficients of the Newton interpolating polynomial.',
        isKey: true,
      },
      {
        id: 'newton-interp',
        title: 'Newton Interpolation Formula',
        latex: 'p(x) = f[x_0] + f[x_0, x_1](x - x_0) + f[x_0, x_1, x_2](x - x_0)(x - x_1) + \\cdots',
        description: 'The interpolating polynomial in Newton form using divided differences.',
        isKey: true,
      },
    ],
    content: [
      {
        type: 'text',
        content: '**Newton Basis**\n\nThe Newton basis functions are:\n\nN₀(x) = 1\nN₁(x) = (x − x₀)\nN₂(x) = (x − x₀)(x − x₁)\n...\nNₖ(x) = (x − x₀)(x − x₁)...(x − xₖ₋₁)\n\nThe interpolating polynomial is:\n\np(x) = c₀ + c₁(x − x₀) + c₂(x − x₀)(x − x₁) + ... + cₙ(x − x₀)...(x − xₙ₋₁)\n\nwhere the coefficients cₖ are divided differences.',
      },
      {
        type: 'text',
        content: '**Divided Differences**\n\nDivided differences are defined recursively:\n\nf[xᵢ] = f(xᵢ)  (zeroth-order)\n\nf[xᵢ, xⱼ] = (f[xⱼ] − f[xᵢ])/(xⱼ − xᵢ)  (first-order)\n\nf[xᵢ, xⱼ, xₖ] = (f[xⱼ, xₖ] − f[xᵢ, xⱼ])/(xₖ − xᵢ)  (second-order)\n\nand so on.\n\nThe Newton interpolating polynomial coefficients are:\n\ncₖ = f[x₀, x₁, ..., xₖ]',
      },
    ],
    quiz: [],
  },
  {
    id: 'c5t3',
    title: 'Chebyshev Nodes & Runge Phenomenon',
    lectureRef: 'Week 11-12',
    formulas: [
      {
        id: 'chebyshev-nodes',
        title: 'Chebyshev Nodes',
        latex: 'x_k = \\cos\\left(\\frac{(2k-1)\\pi}{2n}\\right), \\quad k = 1, 2, \\ldots, n',
        description: 'Optimal nodes for polynomial interpolation on [−1, 1]. Minimize the maximum interpolation error.',
        isKey: true,
      },
      {
        id: 'runge-phenomenon',
        title: 'Runge Phenomenon',
        latex: '\\text{For equally-spaced nodes and } f(x) = \\frac{1}{1 + 25x^2}, \\text{ error } \\to \\infty \\text{ as } n \\to \\infty',
        description: 'High-degree polynomial interpolation with equally-spaced nodes can diverge, especially near the endpoints.',
        isKey: true,
      },
    ],
    content: [
      {
        type: 'text',
        content: '**Runge Phenomenon**\n\nWhen using equally-spaced nodes for polynomial interpolation, the error can grow exponentially with the degree n, especially near the endpoints of the interval. This is called the **Runge phenomenon**.\n\nExample: f(x) = 1/(1 + 25x²) on [−1, 1]\n\nWith equally-spaced nodes, the interpolating polynomial oscillates wildly near the endpoints and diverges as n increases.',
      },
      {
        type: 'text',
        content: '**Chebyshev Nodes**\n\nThe **Chebyshev nodes** are the roots of the Chebyshev polynomial Tₙ(x) = cos(n arccos(x)):\n\nxₖ = cos((2k−1)π/(2n)), k = 1, 2, ..., n\n\nThese nodes are clustered more densely near the endpoints and sparser in the middle, which is the opposite of equally-spaced nodes.\n\nUsing Chebyshev nodes:\n- Minimizes the maximum interpolation error\n- Avoids the Runge phenomenon\n- Is the optimal choice for polynomial interpolation on [−1, 1]',
      },
    ],
    quiz: [],
  },
  {
    id: 'c5t4',
    title: 'Cubic Splines',
    lectureRef: 'Week 12',
    formulas: [
      {
        id: 'cubic-spline',
        title: 'Cubic Spline',
        latex: 's(x) = s_i(x) \\text{ on } [x_i, x_{i+1}], \\text{ where } s_i(x) = a_i + b_i(x-x_i) + c_i(x-x_i)^2 + d_i(x-x_i)^3',
        description: 'A piecewise cubic polynomial that is smooth (continuous derivatives) at the nodes.',
        isKey: true,
      },
    ],
    content: [
      {
        type: 'text',
        content: '**Cubic Splines**\n\nFor many data points, fitting a single high-degree polynomial is problematic (Runge phenomenon, ill-conditioning). Instead, we use **splines**: piecewise polynomials that are smooth at the junctions.\n\nA **cubic spline** s(x) is defined by:\n- On each interval [xᵢ, xᵢ₊₁], s(x) is a cubic polynomial sᵢ(x)\n- s(x) is continuous and has continuous first and second derivatives everywhere\n- s(xᵢ) = yᵢ (passes through the data points)\n\nThis gives a smooth, well-behaved interpolant even for many points.',
      },
    ],
    quiz: [],
  },
];

// ============================================================
// CHAPTER 6: NUMERICAL INTEGRATION & DIFFERENTIATION
// ============================================================

const chapter6Topics: Topic[] = [
  {
    id: 'c6t1',
    title: 'Newton-Cotes Quadrature Rules',
    lectureRef: 'Week 13',
    formulas: [
      {
        id: 'midpoint-rule',
        title: 'Midpoint Rule',
        latex: 'M(f) = (b - a) f\\left(\\frac{a+b}{2}\\right)',
        description: 'Approximates the integral using the function value at the midpoint.',
        isKey: true,
      },
      {
        id: 'trapezoid-rule',
        title: 'Trapezoid Rule',
        latex: 'T(f) = \\frac{b-a}{2}(f(a) + f(b))',
        description: 'Approximates the integral using the average of function values at the endpoints.',
        isKey: true,
      },
      {
        id: 'simpson-rule',
        title: 'Simpson\'s Rule',
        latex: 'S(f) = \\frac{b-a}{6}\\left(f(a) + 4f\\left(\\frac{a+b}{2}\\right) + f(b)\\right)',
        description: 'Approximates the integral using a quadratic polynomial through three points.',
        isKey: true,
      },
      {
        id: 'simpson-relation',
        title: 'Simpson-Midpoint-Trapezoid Relation',
        latex: 'S(f) = \\frac{2M(f) + T(f)}{3}',
        description: 'Simpson\'s rule is a weighted average of the midpoint and trapezoid rules.',
        isKey: false,
      },
    ],
    content: [
      {
        type: 'highlight',
        title: 'Core Concept',
        content: 'Newton-Cotes quadrature rules approximate definite integrals by evaluating the function at specific points and taking a weighted sum.',
      },
      {
        type: 'text',
        content: '**Numerical Integration Problem**\n\nGiven a function f(x) and an interval [a, b], we want to approximate:\n\n∫ₐᵇ f(x) dx\n\nWe cannot always evaluate this integral analytically, so we use numerical approximations based on function evaluations at selected points.',
      },
      {
        type: 'text',
        content: '**Newton-Cotes Rules**\n\nNewton-Cotes quadrature rules are based on polynomial interpolation:\n\n1. **Midpoint Rule**: Uses the function value at the midpoint (constant approximation)\n   M(f) = (b − a) f((a+b)/2)\n\n2. **Trapezoid Rule**: Uses function values at the endpoints (linear approximation)\n   T(f) = (b−a)/2 · (f(a) + f(b))\n\n3. **Simpson\'s Rule**: Uses function values at endpoints and midpoint (quadratic approximation)\n   S(f) = (b−a)/6 · (f(a) + 4f((a+b)/2) + f(b))\n\nSimpson\'s rule is generally more accurate than the trapezoid rule for smooth functions.',
      },
    ],
    quiz: [
      {
        id: 'q-c6t1-1',
        question: 'Which Newton-Cotes rule uses a quadratic polynomial approximation?',
        options: [
          'Midpoint rule',
          'Trapezoid rule',
          'Simpson\'s rule',
          'All of the above',
        ],
        correctIndex: 2,
        explanation: 'Simpson\'s rule approximates the function with a quadratic polynomial passing through three points (the two endpoints and the midpoint), making it more accurate than linear approximations.',
        topicId: 'c6t1',
      },
    ],
  },
  {
    id: 'c6t2',
    title: 'Composite Quadrature & Adaptive Integration',
    lectureRef: 'Week 13',
    formulas: [
      {
        id: 'composite-midpoint',
        title: 'Composite Midpoint Rule',
        latex: '\\int_a^b f(x) dx \\approx h \\sum_{i=0}^{n-1} f(x_{i+1/2}), \\quad h = \\frac{b-a}{n}',
        description: 'Divides [a,b] into n subintervals and applies the midpoint rule to each.',
        isKey: true,
      },
      {
        id: 'composite-simpson',
        title: 'Composite Simpson\'s Rule',
        latex: '\\int_a^b f(x) dx \\approx \\frac{h}{3}\\left(f(x_0) + 4\\sum_{i=0}^{n-1} f(x_{i+1/2}) + 2\\sum_{i=1}^{n-1} f(x_i) + f(x_n)\\right)',
        description: 'Divides [a,b] into n subintervals and applies Simpson\'s rule to each.',
        isKey: true,
      },
    ],
    content: [
      {
        type: 'text',
        content: '**Composite Quadrature Rules**\n\nFor better accuracy, divide the interval [a, b] into n subintervals and apply a simple quadrature rule to each subinterval.\n\n**Composite Midpoint Rule**:\nDivide [a, b] into n equal subintervals of width h = (b−a)/n.\nApply the midpoint rule to each subinterval and sum the results.\n\n**Composite Simpson\'s Rule**:\nDivide [a, b] into n equal subintervals (n must be even).\nApply Simpson\'s rule to each pair of subintervals and sum.\n\nComposite rules converge faster than simple rules as h → 0.',
      },
      {
        type: 'text',
        content: '**Adaptive Quadrature**\n\nAdaptive quadrature automatically refines the mesh where the function is more complicated:\n\n1. Divide [a, b] into subintervals\n2. Compute the integral using a simple rule (e.g., Simpson\'s rule)\n3. Subdivide each interval and recompute\n4. If the difference exceeds a tolerance, subdivide further\n5. Otherwise, accept the approximation\n\nThis approach uses fewer function evaluations than uniform refinement for functions with varying smoothness.',
      },
    ],
    quiz: [],
  },
  {
    id: 'c6t3',
    title: 'Numerical Differentiation',
    lectureRef: 'Week 13',
    formulas: [
      {
        id: 'forward-diff',
        title: 'Forward Difference',
        latex: 'f\'(x) \\approx \\frac{f(x+h) - f(x)}{h}',
        description: 'Approximates the derivative using the forward difference quotient.',
        isKey: true,
      },
      {
        id: 'backward-diff',
        title: 'Backward Difference',
        latex: 'f\'(x) \\approx \\frac{f(x) - f(x-h)}{h}',
        description: 'Approximates the derivative using the backward difference quotient.',
        isKey: true,
      },
      {
        id: 'central-diff',
        title: 'Central Difference',
        latex: 'f\'(x) \\approx \\frac{f(x+h) - f(x-h)}{2h}',
        description: 'Approximates the derivative using the central difference quotient. More accurate than forward or backward differences.',
        isKey: true,
      },
      {
        id: 'second-deriv',
        title: 'Second Derivative (Central Difference)',
        latex: 'f\'\'(x) \\approx \\frac{f(x+h) - 2f(x) + f(x-h)}{h^2}',
        description: 'Approximates the second derivative using the central difference formula.',
        isKey: true,
      },
    ],
    content: [
      {
        type: 'highlight',
        title: 'Core Concept',
        content: 'Numerical differentiation approximates derivatives using finite differences. Unlike integration, differentiation is ill-conditioned and sensitive to rounding errors.',
      },
      {
        type: 'text',
        content: '**Finite Difference Approximations**\n\nUsing Taylor series:\n\nf(x+h) = f(x) + hf\'(x) + (h²/2)f\'\'(x) + O(h³)\n\nRearranging:\n\nf\'(x) = (f(x+h) − f(x))/h − (h/2)f\'\'(x) + O(h²)\n\nThis gives the **forward difference** with error O(h).\n\nSimilarly:\n- **Backward difference**: f\'(x) ≈ (f(x) − f(x−h))/h, error O(h)\n- **Central difference**: f\'(x) ≈ (f(x+h) − f(x−h))/(2h), error O(h²)\n\nThe central difference is more accurate because the O(h) error terms cancel.',
      },
      {
        type: 'warning',
        title: 'Ill-Conditioning of Differentiation',
        content: 'Numerical differentiation is inherently ill-conditioned. As h → 0, the numerator becomes small (loss of significant digits due to subtraction), and the denominator also becomes small. This leads to large relative errors. In practice, there is an optimal h that balances truncation error and rounding error.',
      },
    ],
    quiz: [
      {
        id: 'q-c6t3-1',
        question: 'Which finite difference formula has the smallest truncation error?',
        options: [
          'Forward difference',
          'Backward difference',
          'Central difference',
          'All have the same error',
        ],
        correctIndex: 2,
        explanation: 'The central difference formula has truncation error O(h²), while forward and backward differences have error O(h). This is because the O(h) error terms cancel in the central difference.',
        topicId: 'c6t3',
      },
    ],
  },
];

// ============================================================
// ASSEMBLED CHAPTERS (INCLUDING NEW CHAPTERS 4-6)
// ============================================================

// Import existing chapters 0-3 from the original courseData
// For now, we'll use placeholder references — in the actual implementation,
// these will be imported from the existing courseData

export const chapters: Chapter[] = [
  // Chapters 0-3 from existing courseData (imported/referenced)
  // ... (existing chapters)
  
  // NEW CHAPTERS 4-6
  {
    id: 'ch4',
    number: 4,
    title: 'Eigenvalue Problems & Singular Value Decomposition',
    subtitle: 'Power Iteration, QR Iteration, SVD & Applications',
    bgImage: 'https://images.unsplash.com/photo-1518611505868-48510c2e2e3f?w=1200&q=80',
    accentColor: '#8B5A8F',
    icon: '🔢',
    topics: chapter4Topics,
  },
  {
    id: 'ch5',
    number: 5,
    title: 'Interpolation',
    subtitle: 'Polynomial Interpolation, Chebyshev Nodes & Splines',
    bgImage: 'https://images.unsplash.com/photo-1516321318423-f06f70504c11?w=1200&q=80',
    accentColor: '#D4A574',
    icon: '📊',
    topics: chapter5Topics,
  },
  {
    id: 'ch6',
    number: 6,
    title: 'Numerical Integration & Differentiation',
    subtitle: 'Newton-Cotes Quadrature, Composite Rules & Finite Differences',
    bgImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80',
    accentColor: '#6B8E23',
    icon: '∫',
    topics: chapter6Topics,
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
