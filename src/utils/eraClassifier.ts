/**
 * Utility to classify items into classic Antiques (>100 years) vs Vintage / 20th Century Design (1920 - 1980s)
 */

export interface EraClassification {
  type: 'antique' | 'vintage' | 'contemporary';
  label: string;
  badgeClass: string;
  shortLabel: string;
  description: string;
}

export function classifyItemEra(period: string = '', style: string = ''): EraClassification {
  const text = `${period} ${style}`.toLowerCase();

  // Vintage & 20th Century design keywords
  const vintageKeywords = [
    'vintage',
    'mid-century',
    'mid century',
    'años 50',
    'años 60',
    'años 70',
    'años 80',
    '1930',
    '1940',
    '1950',
    '1960',
    '1970',
    '1980',
    'art déco',
    'art deco',
    'racionalismo',
    'bauhaus',
    'space age',
    'modernista',
    'siglo xx (ca. 19',
    'década de 19',
    'amersa',
    'omersa',
    'eames',
    'ruhlmann',
    'lalique',
  ];

  const isVintage = vintageKeywords.some((k) => text.includes(k));

  if (isVintage) {
    return {
      type: 'vintage',
      label: 'Vintage & Siglo XX',
      shortLabel: 'Vintage',
      badgeClass: 'bg-stone-900/90 text-amber-200 border-amber-500/30',
      description: 'Diseño de autor, Art Déco y piezas emblemáticas del siglo XX (1920–1980)',
    };
  }

  // Classic Antiques (>100 years)
  return {
    type: 'antique',
    label: 'Alta Antigüedad (+100 años)',
    shortLabel: 'Antigüedad',
    badgeClass: 'bg-amber-950/90 text-amber-100 border-amber-700/40',
    description: 'Piezas históricas de más de un siglo con valor patrimonial',
  };
}
