import React, { useState } from 'react';
import { X, Search, Check, Link2, Sparkles, Filter, AlertCircle, Trash2 } from 'lucide-react';
import { AntiqueItem, BlogArticle } from '../types';

interface LinkProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: BlogArticle;
  catalogItems: AntiqueItem[];
  onSave: (updatedArticle: BlogArticle) => void;
}

export const LinkProductsModal: React.FC<LinkProductsModalProps> = ({
  isOpen,
  onClose,
  article,
  catalogItems,
  onSave,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    if (article.relatedItemIds && article.relatedItemIds.length > 0) {
      return [...article.relatedItemIds];
    }
    // If not explicitly set yet, find the default matched ones
    if (article.relatedCategories && article.relatedCategories.length > 0) {
      const autoMatched = catalogItems
        .filter((it) => article.relatedCategories?.includes(it.category))
        .slice(0, 3)
        .map((it) => it.id);
      return autoMatched.length > 0 ? autoMatched : catalogItems.slice(0, 3).map((it) => it.id);
    }
    return catalogItems.slice(0, 3).map((it) => it.id);
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');

  if (!isOpen) return null;

  const categories = [
    'Todas',
    'Muebles',
    'Pintura y Escultura',
    'Platería y Orfebrería',
    'Espejos y Marcos',
    'Porcelana y Cristal',
    'Libros y Manuscritos',
    'Textiles y Tapices',
    'Relojería',
  ];

  const filteredItems = catalogItems.filter((item) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.style.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.period.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.origin.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === 'Todas' ||
      item.category.toLowerCase().includes(categoryFilter.toLowerCase()) ||
      (categoryFilter === 'Espejos y Marcos' && (item.category === 'Muebles' || item.style.toLowerCase().includes('barroco') || item.title.toLowerCase().includes('espejo')));

    return matchesSearch && matchesCategory;
  });

  const toggleItemSelection = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleClearAll = () => {
    setSelectedIds([]);
  };

  const handleSave = () => {
    const updatedArticle: BlogArticle = {
      ...article,
      relatedItemIds: selectedIds,
    };
    onSave(updatedArticle);
    onClose();
  };

  const selectedItems = catalogItems.filter((it) => selectedIds.includes(it.id));

  return (
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 animate-fadeIn">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-stone-200 flex items-center justify-between bg-[#faf8f5] rounded-t-xl shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-stone-900 text-amber-300 flex items-center justify-center shrink-0">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-normal text-stone-950">
                Elegir piezas vinculadas a esta crónica
              </h3>
              <p className="text-xs text-stone-500 line-clamp-1 max-w-xl">
                Crónica: <span className="font-medium text-stone-800">«{article.title}»</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Items Summary Strip */}
        <div className="px-4 sm:px-6 py-3 bg-[#f6f2ea] border-b border-[#ebdccb] flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-semibold text-amber-950">
              {selectedIds.length} {selectedIds.length === 1 ? 'pieza seleccionada' : 'piezas seleccionadas'}:
            </span>
            <span className="text-stone-600 hidden sm:inline">
              (Aparecerán al pie de la crónica invitando a consultar con el anticuario)
            </span>
          </div>

          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs text-rose-700 hover:text-rose-900 flex items-center space-x-1 font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Desvincular todas</span>
            </button>
          )}
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 sm:px-6 bg-white border-b border-stone-200 space-y-3 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar pieza por nombre, época, estilo o procedencia..."
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-amber-800"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all shrink-0 cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-stone-950 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Items Grid for Selection */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 space-y-2 text-stone-500 text-xs">
              <AlertCircle className="w-8 h-8 mx-auto text-stone-400" />
              <p>No se encontraron piezas en el catálogo que coincidan con la búsqueda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {filteredItems.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleItemSelection(item.id)}
                    className={`relative p-3 rounded-lg border text-left cursor-pointer transition-all flex flex-col justify-between group ${
                      isSelected
                        ? 'border-amber-700 bg-amber-50/40 shadow-xs ring-1 ring-amber-700'
                        : 'border-stone-200 bg-white hover:border-stone-400'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-16 h-16 rounded-md bg-stone-100 overflow-hidden shrink-0 relative border border-stone-200">
                        <img
                          src={item.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-amber-900/40 flex items-center justify-center">
                            <Check className="w-6 h-6 text-white drop-shadow-md" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] uppercase font-semibold text-stone-500 tracking-wider">
                            {item.period}
                          </span>
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] transition-colors shrink-0 ${
                              isSelected
                                ? 'bg-amber-800 border-amber-800 text-white'
                                : 'border-stone-300 group-hover:border-stone-500'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                          </span>
                        </div>

                        <h4 className="font-serif text-xs font-medium text-stone-950 line-clamp-1 mt-0.5 group-hover:text-amber-900">
                          {item.title}
                        </h4>

                        <p className="text-[11px] text-stone-500 font-light truncate mt-0.5">
                          {item.style} • {item.origin}
                        </p>

                        <p className="text-xs font-semibold text-stone-900 font-mono mt-1">
                          USD ${item.price.toLocaleString('es-AR')}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-6 border-t border-stone-200 bg-[#faf8f5] flex items-center justify-between rounded-b-xl shrink-0">
          <div className="text-xs text-stone-500">
            {selectedIds.length === 0 ? (
              <span className="italic text-stone-400">
                Si no seleccionas ninguna, se mostrarán piezas automáticamente según el estilo y categoría.
              </span>
            ) : (
              <span>
                <strong className="text-stone-900">{selectedIds.length}</strong> {selectedIds.length === 1 ? 'pieza vinculada' : 'piezas vinculadas'} a la crónica.
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-stone-300 rounded-md text-stone-700 hover:bg-stone-100 text-xs font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-stone-950 hover:bg-stone-800 text-white rounded-md text-xs font-medium shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 text-amber-400" />
              <span>Guardar Selección</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
