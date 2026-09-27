import React from 'react';

interface ArticuariosMonogramProps {
  className?: string;
  variant?: 'minimal' | 'cartouche' | 'seal-dark' | 'seal-light';
  size?: number;
}

export const ArticuariosMonogram: React.FC<ArticuariosMonogramProps> = ({
  className = 'w-8 h-8',
  variant = 'minimal',
  size,
}) => {
  if (variant === 'seal-dark') {
    return (
      <img
        src="/articuarios-seal.svg"
        alt="Articuarios Monograma Sello"
        className={className}
        style={size ? { width: size, height: size } : undefined}
      />
    );
  }

  if (variant === 'seal-light') {
    return (
      <img
        src="/articuarios-seal-light.svg"
        alt="Articuarios Monograma Sello Claro"
        className={className}
        style={size ? { width: size, height: size } : undefined}
      />
    );
  }

  if (variant === 'cartouche') {
    return (
      <img
        src="/articuarios-monogram.svg"
        alt="Articuarios Monograma Cartela"
        className={className}
        style={size ? { width: size, height: size } : undefined}
      />
    );
  }

  // Minimal inline SVG: pure restrained serif "A" with crisp, non-voluptuous terminals
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Refined transitional serif A */}
      <path
        d="
          M 50,16 
          L 48,16 
          C 46.5,16 45,16.5 44,19 
          L 23,73 
          C 22,75.5 21,76.5 18,77 
          L 15.5,77.5 
          L 15.5,79.5 
          L 34.5,79.5 
          L 34.5,77.5 
          L 32,77 
          C 29,76.5 28.5,75 29.5,72 
          L 35.5,57 
          L 64.5,57 
          L 70.5,72 
          C 71.5,75 70.5,76.5 68,77 
          L 65.5,77.5 
          L 65.5,79.5 
          L 84.5,79.5 
          L 84.5,77.5 
          L 82,77 
          C 79,76.5 78,75 77,72.5 
          L 56,19 
          C 55,16.5 53.5,16 52,16 
          Z
          M 49.8,28 
          L 62,54 
          L 38,54 
          Z
        "
        fillRule="evenodd"
      />
      {/* Subtle antique diamond accent on crossbar */}
      <polygon points="50,52.5 51.5,54 50,55.5 48.5,54" fill="#b45309" />
    </svg>
  );
};
