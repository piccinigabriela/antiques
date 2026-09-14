import React from 'react';
import { Search, RotateCcw, Award } from 'lucide-react';
import { CatalogFilterState, Dealer } from '../types';

interface CatalogFiltersProps {
  filters: CatalogFilterState;
  onFilterChange: (newFilters: CatalogFilterState) => void;
  dealers: Dealer[];
  categories: string[];
  periods: string[];
  styles: string[];
  totalResults: number;
}

export const CatalogFilters: React.FC<CatalogFiltersProps> = ({
  filters,
  onFilterChange,
  dealers,
  categories,
  periods,
  styles,
  totalResults,
}) => {
  const handleReset = () => {
    onFilterChange({
      searchTerm: '',
      category: '',
      period: '',
      style: '',
      dealerId: '',
      condition: '',
      onlyCertified: false,
      onlyAvailable: true,
      minPrice: null,
      maxPrice: null,
      sortBy: 'newest',
    });
  };

  const hasActiveFilters =
    filters.searchTerm !== '' ||
    filters.category !== '' ||
    filters.period !== '' ||
    filters.style !== '' ||
    filters.dealerId !== '' ||
    filters.onlyCertified ||
    !filters.onlyAvailable ||
    filters.minPrice !== null ||
    filters.maxPrice !== null;

  return (
    <div className="bg-white border border-[#e5ddd1] rounded-xl p-4 sm:p-5 shadow-2xs space-y-4">
      {/* Top row: Search and Sort */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            id="catalog-search-input"
            type="text"
            value={filters.searchTerm}
            onChange={(e) => onFilterChange({ ...filters, searchTerm: e.target.value })}
            placeholder="Buscar por título, SKU, autor, procedencia o material..."
            className="w-full pl-10 pr-4 py-2 bg-[#faf8f5] border border-[#dcd4c8] rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#b45309]/50 focus:bg-white transition-all"
          />
        </div>

        {/* Sort and Count */}
        <div className="flex items-center space-x-3 justify-between md:justify-end">
          <span className="text-xs text-stone-500 font-mono">
            <strong>{totalResults}</strong> {totalResults === 1 ? 'pieza hallada' : 'piezas halladas'}
          </span>

          <select
            id="catalog-sort-select"
            value={filters.sortBy}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                sortBy: e.target.value as CatalogFilterState['sortBy'],
              })
            }
            className="py-2 px-3 bg-[#faf8f5] border border-[#dcd4c8] rounded-lg text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#b45309]/50"
          >
            <option value="newest">Más recientes incorporaciones</option>
            <option value="price_asc">Precio: de menor a mayor</option>
            <option value="price_desc">Precio: de mayor a menor</option>
            <option value="period">Por Época histórica</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-thin">
        <button
          onClick={() => onFilterChange({ ...filters, category: '' })}
          className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-colors ${
            filters.category === ''
              ? 'bg-[#1c1917] text-white shadow-2xs'
              : 'bg-[#f4efe8] text-stone-700 hover:bg-[#eae3d7]'
          }`}
        >
          Todas las categorías
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onFilterChange({ ...filters, category: cat })}
            className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-colors ${
              filters.category === cat
                ? 'bg-[#b45309] text-white shadow-2xs'
                : 'bg-[#f4efe8] text-stone-700 hover:bg-[#eae3d7]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Secondary Row: Specific Antique Filters */}
      <div className="pt-3 border-t border-[#ede6db] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {/* Época / Período */}
        <div>
          <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-1">
            Época / Período
          </label>
          <select
            id="filter-period-select"
            value={filters.period}
            onChange={(e) => onFilterChange({ ...filters, period: e.target.value })}
            className="w-full py-1.5 px-2.5 bg-[#faf8f5] border border-[#dcd4c8] rounded-md text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#b45309]/50 truncate"
          >
            <option value="">Todas las épocas</option>
            {periods.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Estilo / Movimiento */}
        <div>
          <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-1">
            Estilo / Movimiento
          </label>
          <select
            id="filter-style-select"
            value={filters.style}
            onChange={(e) => onFilterChange({ ...filters, style: e.target.value })}
            className="w-full py-1.5 px-2.5 bg-[#faf8f5] border border-[#dcd4c8] rounded-md text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#b45309]/50 truncate"
          >
            <option value="">Todos los estilos</option>
            {styles.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Anticuario / Galería (Multi-Vendedor) */}
        <div>
          <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-1">
            Anticuario / Galería
          </label>
          <select
            id="filter-dealer-select"
            value={filters.dealerId}
            onChange={(e) => onFilterChange({ ...filters, dealerId: e.target.value })}
            className="w-full py-1.5 px-2.5 bg-[#faf8f5] border border-[#dcd4c8] rounded-md text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#b45309]/50 truncate"
          >
            <option value="">Todos los anticuarios</option>
            {dealers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Rango de Precios */}
        <div>
          <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-1">
            Precio Máximo (USD)
          </label>
          <div className="flex items-center space-x-1.5">
            <input
              type="number"
              placeholder="Sin límite"
              value={filters.maxPrice || ''}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  maxPrice: e.target.value ? Number(e.target.value) : null,
                })
              }
              className="w-full py-1.5 px-2.5 bg-[#faf8f5] border border-[#dcd4c8] rounded-md text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#b45309]/50"
            />
          </div>
        </div>
      </div>

      {/* Toggles & Reset */}
      <div className="pt-3 border-t border-[#ede6db] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Certificate Toggle */}
          <label className="flex items-center space-x-1.5 cursor-pointer bg-[#faf7f0] px-3 py-1.5 rounded-md border border-[#e5ded2]">
            <input
              type="checkbox"
              checked={filters.onlyCertified}
              onChange={(e) => onFilterChange({ ...filters, onlyCertified: e.target.checked })}
              className="rounded text-[#b45309] focus:ring-[#b45309] w-3.5 h-3.5"
            />
            <span className="flex items-center space-x-1 text-stone-800 font-medium">
              <Award className="w-3.5 h-3.5 text-[#b45309]" />
              <span>Solo con Certificado Oficial</span>
            </span>
          </label>

          {/* Availability Toggle */}
          <label className="flex items-center space-x-1.5 cursor-pointer bg-[#faf7f0] px-3 py-1.5 rounded-md border border-[#e5ded2]">
            <input
              type="checkbox"
              checked={filters.onlyAvailable}
              onChange={(e) => onFilterChange({ ...filters, onlyAvailable: e.target.checked })}
              className="rounded text-[#b45309] focus:ring-[#b45309] w-3.5 h-3.5"
            />
            <span className="text-stone-800 font-medium">Solo piezas disponibles</span>
          </label>
        </div>

        {/* Reset button */}
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center space-x-1 text-stone-500 hover:text-[#b45309] font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpiar todos los filtros</span>
          </button>
        )}
      </div>
    </div>
  );
};
