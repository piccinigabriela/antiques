import React from 'react';
import { Compass, Store, MessageSquareQuote, ShieldCheck, Phone, PlusCircle, KeyRound, LogOut } from 'lucide-react';
import { Dealer } from '../types';

interface NavbarProps {
  currentView: 'catalog' | 'dealers' | 'negotiations' | 'dealer-panel';
  onNavigate: (view: 'catalog' | 'dealers' | 'negotiations' | 'dealer-panel') => void;
  activeNegotiationsCount: number;
  activeDealer: Dealer;
  onOpenNewItemModal?: () => void;
  authenticatedDealer?: Dealer | null;
  onOpenLoginModal?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  activeNegotiationsCount,
  activeDealer,
  onOpenNewItemModal,
  authenticatedDealer,
  onOpenLoginModal,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#fcfbf9]/95 backdrop-blur-md border-b border-[#e7e2d9] shadow-xs">
      {/* Top notice banner */}
      <div className="bg-[#292524] text-[#d6cfc7] text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-medium text-[#fafaf9]">Mercado de Alta Antigüedad</span>
            <span className="text-stone-400 hidden sm:inline">• Catálogo categorizado con peritaje de anticuario</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] text-stone-300">
            <span className="hidden md:inline">Cierre directo y acuerdos vía WhatsApp</span>
            <a
              href={`https://wa.me/${activeDealer.whatsapp}?text=${encodeURIComponent('Hola, me comunico desde la plataforma de anticuarios.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <Phone className="w-3 h-3" />
              <span>Soporte Galería</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand */}
          <div 
            id="brand-logo"
            onClick={() => onNavigate('catalog')}
            className="cursor-pointer flex flex-col group"
          >
            <div className="flex items-center space-x-2">
              <span className="text-xl sm:text-2xl font-serif tracking-widest text-[#1c1917] font-semibold uppercase group-hover:text-[#b45309] transition-colors">
                Anticuarios & Co.
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-semibold tracking-wider bg-[#f2ede4] text-[#78716c] border border-[#e5ded4]">
                Marketplace
              </span>
            </div>
            <span className="text-[11px] uppercase tracking-widest text-[#857d77] font-medium mt-0.5">
              Catálogo de Época • Tasación • Multi-Vendedor
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              id="nav-catalog-btn"
              onClick={() => onNavigate('catalog')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                currentView === 'catalog'
                  ? 'text-[#1c1917] bg-[#f4eee4] border border-[#ded5c7]'
                  : 'text-[#57534e] hover:text-[#1c1917] hover:bg-[#f7f4ee]'
              }`}
            >
              <Compass className="w-4 h-4 text-[#b45309]" />
              <span>Catálogo General</span>
            </button>

            <button
              id="nav-dealers-btn"
              onClick={() => onNavigate('dealers')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                currentView === 'dealers'
                  ? 'text-[#1c1917] bg-[#f4eee4] border border-[#ded5c7]'
                  : 'text-[#57534e] hover:text-[#1c1917] hover:bg-[#f7f4ee]'
              }`}
            >
              <Store className="w-4 h-4 text-[#b45309]" />
              <span>Galerías y Anticuarios</span>
            </button>

            <button
              id="nav-negotiations-btn"
              onClick={() => onNavigate('negotiations')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 relative ${
                currentView === 'negotiations'
                  ? 'text-[#1c1917] bg-[#f4eee4] border border-[#ded5c7]'
                  : 'text-[#57534e] hover:text-[#1c1917] hover:bg-[#f7f4ee]'
              }`}
            >
              <MessageSquareQuote className="w-4 h-4 text-[#b45309]" />
              <span>Negociaciones de Precio</span>
              {activeNegotiationsCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-bold leading-none text-white bg-[#b45309] rounded-full">
                  {activeNegotiationsCount}
                </span>
              )}
            </button>
          </nav>

          {/* Action buttons (Dealer Panel & Auth) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {authenticatedDealer ? (
              <div className="flex items-center space-x-2">
                <button
                  id="nav-dealer-panel-btn"
                  onClick={() => onNavigate('dealer-panel')}
                  className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-150 flex items-center space-x-2 shadow-xs ${
                    currentView === 'dealer-panel'
                      ? 'bg-[#1c1917] text-[#fcfbf9] ring-2 ring-[#b45309]/50'
                      : 'bg-[#292524] hover:bg-[#1c1917] text-[#fafaf9]'
                  }`}
                  title="Gestionar mi tienda"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate max-w-[120px] sm:max-w-none">
                    {authenticatedDealer.name.split(' ')[0]} (Panel)
                  </span>
                </button>

                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-md text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-200/70 transition-colors flex items-center space-x-1"
                    title="Cerrar sesión de anticuario"
                  >
                    <LogOut className="w-3.5 h-3.5 text-stone-500" />
                    <span className="hidden sm:inline">Salir</span>
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
                    } else {
                      onNavigate('dealer-panel');
                    }
                  }}
                  className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-md text-xs sm:text-sm font-semibold bg-[#f4eee4] hover:bg-[#ece4d6] text-[#b45309] border border-[#ded5c7] transition-all flex items-center space-x-1.5 shadow-2xs"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#b45309]" />
                  <span>Acceso Anticuarios</span>
                </button>

                <button
                  id="nav-dealer-panel-btn"
                  onClick={() => onNavigate('dealer-panel')}
                  className={`px-3 py-1.5 sm:px-3 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-150 flex items-center space-x-1.5 shadow-xs ${
                    currentView === 'dealer-panel'
                      ? 'bg-[#1c1917] text-[#fcfbf9] ring-2 ring-[#b45309]/50'
                      : 'bg-[#292524] hover:bg-[#1c1917] text-[#fafaf9]'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Panel</span>
                </button>
              </div>
            )}

            {currentView === 'dealer-panel' && onOpenNewItemModal && (
              <button
                id="header-add-item-btn"
                onClick={onOpenNewItemModal}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-2 bg-[#b45309] hover:bg-[#92400e] text-white rounded-md text-xs sm:text-sm font-medium transition-colors shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Nueva Pieza</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-[#e7e2d9] text-xs">
          <button
            onClick={() => onNavigate('catalog')}
            className={`flex items-center space-x-1 py-1 px-2.5 rounded ${
              currentView === 'catalog' ? 'font-semibold text-[#1c1917] bg-[#f0eae0]' : 'text-[#78716c]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Catálogo</span>
          </button>
          <button
            onClick={() => onNavigate('dealers')}
            className={`flex items-center space-x-1 py-1 px-2.5 rounded ${
              currentView === 'dealers' ? 'font-semibold text-[#1c1917] bg-[#f0eae0]' : 'text-[#78716c]'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Anticuarios</span>
          </button>
          <button
            onClick={() => onNavigate('negotiations')}
            className={`flex items-center space-x-1 py-1 px-2.5 rounded relative ${
              currentView === 'negotiations' ? 'font-semibold text-[#1c1917] bg-[#f0eae0]' : 'text-[#78716c]'
            }`}
          >
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Negociar</span>
            {activeNegotiationsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#b45309] ml-0.5"></span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
