// MathDisplay — renders LaTeX using KaTeX
// Design: "Golden Hour Study Retreat" — formula boxes styled as candlelight glow cards

import { useEffect, useRef } from 'react';
import katex from 'katex';

interface MathDisplayProps {
  latex: string;
  display?: boolean;
  className?: string;
}

export function MathDisplay({ latex, display = false, className = '' }: MathDisplayProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(latex, ref.current, {
          displayMode: display,
          throwOnError: false,
          errorColor: '#c4622d',
          trust: false,
        });
      } catch (e) {
        if (ref.current) {
          ref.current.textContent = latex;
        }
      }
    }
  }, [latex, display]);

  return <span ref={ref} className={className} />;
}

interface FormulaBoxProps {
  title: string;
  latex: string;
  description?: string;
  isKey?: boolean;
}

export function FormulaBox({ title, latex, description, isKey = false }: FormulaBoxProps) {
  return (
    <div className={isKey ? 'formula-box-key my-4' : 'formula-box my-4'}>
      <div className="mb-2">
        <span className="font-semibold text-sm" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'oklch(0.28 0.06 40)', fontSize: '1rem' }}>
          {title}
        </span>
      </div>
      <div className="overflow-x-auto py-2">
        <MathDisplay latex={latex} display={true} />
      </div>
      {description && (
        <p className="mt-2 text-sm" style={{ color: 'oklch(0.45 0.06 50)', fontFamily: 'Lora, serif' }}>
          {description}
        </p>
      )}
    </div>
  );
}
