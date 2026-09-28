import React, { useState } from 'react';
import { Search, RotateCcw, Award, SlidersHorizontal, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { CatalogFilterState, Dealer } from '../types';

interface CatalogFiltersProps {
  filters: CatalogFilterState;
  onFilterChange: (newFilters: CatalogFilterState) => void;
  dealers: Dealer[];
  categories: string[];
  periods: string[];
  styles: string[];
  locations?: string[];
  totalResults: number;
}

export const CatalogFilters: React.FC<CatalogFiltersProps> = ({
  filters,
  onFilterChange,
  dealers,
  categories,
  periods,
  styles,
  locations,
  totalResults,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleReset = () => {
    onFilterChange({
      searchTerm: '',
      category: '',
      period: '',
      style: '',
      dealerId: '',
      location: '',
      condition: '',
      onlyCertified: false,
      onlyAvailable: true,
      minPrice: null,
      maxPrice: null,
      sortBy: 'newest',
    });
  };

  const activeFiltersCount = [
    Boolean(filters.searchTerm),
    Boolean(filters.category),
    Boolean(filters.period),
    Boolean(filters.style),
    Boolean(filters.dealerId),
    Boolean(filters.location),
    Boolean(filters.onlyCertified),
    Boolean(filters.maxPrice),
  ].filter(Boolean).length;

  return (
    <div className="bg-white border border-[#e8e2d8] rounded-sm shadow-2xs">
      {/* Sleek Bar: Quick Search, Filter Toggle, Sort & Total */}
      <div className="p-3 sm:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search input (1stdibs pill style) */}
        <div className="relative flex-1 max-w-lg">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-2.5" />
          <input
            id="catalog-search-input"
            type="text"
            value={filters.searchTerm}
            onChange={(e) => onFilterChange({ ...filters, searchTerm: e.target.value })}
            placeholder="Buscar por mueble, pintor, estilo, orfebre o material..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#fbf9f6] border border-[#ded6c9] rounded-full text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-800 focus:bg-white transition-all"
          />
        </div>

        {/* Controls: Filter Button, Sort Dropdown & Count */}
        <div className="flex items-center justify-between md:justify-end gap-2.5">
          {/* Toggle Advanced Filters */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center space-x-1.5 transition-colors ${
              isExpanded || activeFiltersCount > 0
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-[#fbf9f6] text-stone-700 border-[#ded6c9] hover:bg-stone-100'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtros {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
            {isExpanded ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
          </button>

          {/* Reset button if active */}
          {activeFiltersCount > 0 && (
            <button
              onClick={handleReset}
              className="text-xs text-stone-500 hover:text-stone-900 flex items-center space-x-1 px-1.5 py-1 transition-colors"
              title="Restablecer filtros"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Limpiar</span>
            </button>
          )}

          {/* Sort Select */}
          <div className="flex items-center space-x-1.5">
            <select
              id="catalog-sort-select"
              value={filters.sortBy}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  sortBy: e.target.value as CatalogFilterState['sortBy'],
                })
              }
              className="py-1.5 px-2.5 bg-[#fbf9f6] border border-[#ded6c9] rounded-full text-xs font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-800 cursor-pointer"
            >
              <option value="newest">Novedades</option>
              <option value="price_asc">Precio: menor a mayor</option>
              <option value="price_desc">Precio: mayor a menor</option>
              <option value="period">Por Época</option>
            </select>
          </div>

          <span className="text-[11px] text-stone-400 font-mono hidden lg:inline">
            {totalResults} {totalResults === 1 ? 'pieza' : 'piezas'}
          </span>
        </div>
      </div>

      {/* Expandable detailed drawer */}
      {isExpanded && (
        <div className="p-4 sm:p-5 border-t border-[#ede7dc] bg-[#faf8f5] space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 text-xs">
            {/* Categoría / Disciplina */}
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-500 mb-1">
                Categoría
              </label>
              <select
                id="filter-category-select"
                value={filters.category}
                onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
                className="w-full py-1.5 px-2.5 bg-white border border-[#ded6c9] rounded text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-800"
              >
                <option value="">Todas las categorías</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Época / Período */}
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-500 mb-1">
                Época / Siglo
              </label>
              <select
                id="filter-period-select"
                value={filters.period}
                onChange={(e) => onFilterChange({ ...filters, period: e.target.value })}
                className="w-full py-1.5 px-2.5 bg-white border border-[#ded6c9] rounded text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-800"
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
              <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-500 mb-1">
                Estilo / Diseño
              </label>
              <select
                id="filter-style-select"
                value={filters.style}
                onChange={(e) => onFilterChange({ ...filters, style: e.target.value })}
                className="w-full py-1.5 px-2.5 bg-white border border-[#ded6c9] rounded text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-800"
              >
                <option value="">Todos los estilos</option>
                {styles.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Ubicación / Zona de la Pieza */}
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-500 mb-1 flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-[#b45309]" />
                <span>Ubicación</span>
              </label>
              <select
                id="filter-location-select"
                value={filters.location || ''}
                onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
                className="w-full py-1.5 px-2.5 bg-white border border-[#ded6c9] rounded text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-800 font-medium"
              >
                <option value="">Todas las zonas</option>
                {locations && locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Rango de Precios */}
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-500 mb-1">
                Presupuesto Máximo (USD)
              </label>
              <input
                type="number"
                placeholder="Sin tope máximo"
                value={filters.maxPrice || ''}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    maxPrice: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className="w-full py-1.5 px-2.5 bg-white border border-[#ded6c9] rounded text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-800"
              />
            </div>
          </div>

          {/* Checkbox filters */}
          <div className="pt-3 border-t border-[#ede7dc] flex flex-wrap items-center gap-4 text-xs">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.onlyCertified}
                onChange={(e) => onFilterChange({ ...filters, onlyCertified: e.target.checked })}
                className="rounded text-stone-900 focus:ring-stone-900 w-3.5 h-3.5"
              />
              <span className="flex items-center space-x-1 text-stone-800">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>Solo piezas con peritaje o certificado oficial</span>
              </span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.onlyAvailable}
                onChange={(e) => onFilterChange({ ...filters, onlyAvailable: e.target.checked })}
                className="rounded text-stone-900 focus:ring-stone-900 w-3.5 h-3.5"
              />
              <span className="text-stone-800 font-medium">Solo piezas disponibles para adquisición</span>
            </label>

            {!filters.onlyAvailable && (
              <span className="text-[11px] text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                ✓ Mostrando piezas disponibles y archivo de piezas vendidas a colecciones privadas
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
