import React from 'react';
import { Compass, Store, MessageSquareQuote, ShieldCheck, Phone, PlusCircle, KeyRound, LogOut, Sparkles, Truck, BookOpen } from 'lucide-react';
import { Dealer } from '../types';

interface NavbarProps {
  currentView: 'catalog' | 'dealers' | 'services' | 'magazine' | 'negotiations' | 'dealer-panel';
  onNavigate: (view: 'catalog' | 'dealers' | 'services' | 'magazine' | 'negotiations' | 'dealer-panel') => void;
  activeNegotiationsCount: number;
  activeDealer: Dealer;
  onOpenNewItemModal?: () => void;
  authenticatedDealer?: Dealer | null;
  isAdmin?: boolean;
  onOpenLoginModal?: () => void;
  onLogout?: () => void;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  onOpenLogoModal?: () => void;
  onOpenPinterestModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  activeNegotiationsCount,
  activeDealer,
  onOpenNewItemModal,
  authenticatedDealer,
  isAdmin = false,
  onOpenLoginModal,
  onLogout,
  selectedCategory = '',
  onSelectCategory,
  onOpenLogoModal,
  onOpenPinterestModal,
}) => {
  const quickCategories = [
    { label: 'Novedades', value: 'NOVEDADES' },
    { label: 'Muebles', value: 'Muebles' },
    { label: 'Arte y Pintura', value: 'Arte y Pintura' },
    { label: 'Libros y Manuscritos', value: 'Libros y Manuscritos' },
    { label: 'Orfebrería y Plata', value: 'Platería y Orfebrería' },
    { label: 'Relojería', value: 'Relojería' },
    { label: 'Porcelana', value: 'Cerámica y Porcelana' },
    { label: 'Ver Todo', value: '' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#eae5dd]">
      {/* Top thin announcement banner (1stdibs style) */}
      <div className="bg-[#1c1917] text-[#d6cfc7] text-[11px] py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-light tracking-wide text-stone-200">
              Colección de Alta Antigüedad • Base Cloud Sincronizada en Vivo
            </span>
          </div>
          <div className="hidden sm:flex items-center space-x-4 text-[11px] text-stone-300">
            <span>Cierre directo por WhatsApp</span>
            <a
              href={`https://wa.me/${activeDealer.whatsapp}?text=${encodeURIComponent('Hola, me comunico desde el portal de anticuarios.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center space-x-1"
            >
              <Phone className="w-3 h-3" />
              <span>Soporte</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo (1stdibs style: classic, high-contrast serif with circular emblem) */}
          <div 
            id="brand-logo"
            onClick={() => {
              if (onSelectCategory) onSelectCategory('');
              onNavigate('catalog');
            }}
            className="cursor-pointer flex items-center space-x-2.5 sm:space-x-3 group"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-stone-800 shadow-sm flex items-center justify-center bg-[#1c1917] group-hover:scale-105 group-hover:border-amber-600 transition-all shrink-0">
              <img src="/articuarios-seal.svg" alt="Sello Articuarios" className="w-full h-full object-cover" />
            </div>
            <span className="font-serif text-2xl sm:text-3xl font-normal tracking-[0.2em] uppercase text-stone-950 group-hover:text-amber-800 transition-colors">
              Articuarios
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-medium tracking-wide">
            <button
              id="nav-catalog-btn"
              onClick={() => onNavigate('catalog')}
              className={`py-1 transition-colors border-b ${
                currentView === 'catalog'
                  ? 'text-stone-950 border-stone-900 font-semibold'
                  : 'text-stone-600 hover:text-stone-950 border-transparent'
              }`}
            >
              Catálogo
            </button>

            <button
              id="nav-magazine-btn"
              onClick={() => onNavigate('magazine')}
              className={`py-1 transition-colors border-b flex items-center space-x-1.5 whitespace-nowrap ${
                currentView === 'magazine'
                  ? 'text-stone-950 border-stone-900 font-semibold'
                  : 'text-stone-600 hover:text-stone-950 border-transparent'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-800" />
              <span>El Cuaderno del Articuario</span>
            </button>

            <button
              id="nav-negotiations-btn"
              onClick={() => onNavigate('negotiations')}
              className={`py-1 transition-colors border-b relative flex items-center space-x-1.5 ${
                currentView === 'negotiations'
                  ? 'text-stone-950 border-stone-900 font-semibold'
                  : 'text-stone-600 hover:text-stone-950 border-transparent'
              }`}
            >
              <span>Mesa de Negociación</span>
              {activeNegotiationsCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold text-white bg-amber-700 rounded-full">
                  {activeNegotiationsCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {authenticatedDealer && onOpenPinterestModal && (
              <button
                onClick={onOpenPinterestModal}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-red-900 hover:text-red-950 bg-red-50 hover:bg-red-100 border border-red-200 transition-all cursor-pointer"
                title="Configurar Catálogo Automático de Pinterest Shopping"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                <span>Pinterest Feed</span>
              </button>
            )}

            {authenticatedDealer && onOpenLogoModal && (
              <button
                onClick={onOpenLogoModal}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 border border-stone-200/80 transition-all cursor-pointer"
                title="Ver y descargar monograma oficial de Articuarios"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Monograma</span>
              </button>
            )}

            {authenticatedDealer ? (
              <div className="flex items-center space-x-2">
                <button
                  id="nav-dealer-panel-btn"
                  onClick={() => onNavigate('dealer-panel')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center space-x-1.5 cursor-pointer ${
                    currentView === 'dealer-panel'
                      ? 'bg-stone-950 text-white'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-900'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate max-w-[120px]">
                    {authenticatedDealer.name.split(' ')[0]}
                  </span>
                  {isAdmin && (
                    <span className="ml-1 px-1.5 py-0.5 text-[9px] font-bold bg-amber-500/20 text-amber-800 border border-amber-500/30 rounded">
                      Admin
                    </span>
                  )}
                </button>

                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="p-1.5 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                    title="Cerrar sesión"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  id="nav-dealer-login-btn"
                  onClick={() => {
                    if (onOpenLoginModal) {
                      onOpenLoginModal();
                    }
                  }}
                  className="px-3 py-1.5 rounded-full text-xs font-medium text-stone-700 hover:text-stone-950 border border-stone-300 hover:border-stone-500 transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <KeyRound className="w-3 h-3 text-stone-500" />
                  <span>Acceso Anticuarios</span>
                </button>
              </div>
            )}

            {currentView === 'dealer-panel' && onOpenNewItemModal && (
              <button
                id="header-add-item-btn"
                onClick={onOpenNewItemModal}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-white rounded-full text-xs font-medium transition-colors cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Nueva Pieza</span>
              </button>
            )}
          </div>
        </div>

        {/* 1stdibs Category Ribbon Bar (Under Header) */}
        {currentView === 'catalog' && onSelectCategory && (
          <div className="border-t border-[#f0ebe3] py-2 flex items-center justify-start sm:justify-center space-x-4 sm:space-x-7 overflow-x-auto scrollbar-none text-[11px] font-medium uppercase tracking-wider text-stone-600">
            {quickCategories.map((cat) => {
              const isActive =
                cat.value === '' || cat.value === 'NOVEDADES'
                  ? selectedCategory === '' && cat.label === 'Ver Todo'
                  : cat.value === selectedCategory;

              return (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => {
                    onSelectCategory(cat.value === 'NOVEDADES' ? '' : cat.value);
                    onNavigate('catalog');
                  }}
                  className={`shrink-0 py-1 transition-colors cursor-pointer ${
                    isActive
                      ? 'text-stone-950 border-b-2 border-stone-950 font-bold'
                      : 'hover:text-stone-950 border-b-2 border-transparent'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-[#eae5dd] text-xs">
          <button
            onClick={() => onNavigate('catalog')}
            className={`flex items-center space-x-1 py-1 px-3 rounded ${
              currentView === 'catalog' ? 'font-semibold text-stone-950 bg-stone-100' : 'text-stone-500'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Catálogo</span>
          </button>
          <button
            onClick={() => onNavigate('magazine')}
            className={`flex items-center space-x-1 py-1 px-3 rounded ${
              currentView === 'magazine' ? 'font-semibold text-stone-950 bg-stone-100' : 'text-stone-500'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-800" />
            <span>El Cuaderno</span>
          </button>
          <button
            onClick={() => onNavigate('negotiations')}
            className={`flex items-center space-x-1 py-1 px-3 rounded relative ${
              currentView === 'negotiations' ? 'font-semibold text-stone-950 bg-stone-100' : 'text-stone-500'
            }`}
          >
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Negociar</span>
            {activeNegotiationsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-700 ml-0.5"></span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
