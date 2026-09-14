import React from 'react';
import { MapPin, Phone, Award, ShieldCheck, ArrowRight, Store, Lock, KeyRound } from 'lucide-react';
import { Dealer, AntiqueItem } from '../types';

interface DealersViewProps {
  dealers: Dealer[];
  items: AntiqueItem[];
  onSelectDealerCatalog: (dealerId: string) => void;
  onManageAsDealer: (dealer: Dealer) => void;
  authenticatedDealer?: Dealer | null;
  onOpenLoginModal?: (dealerId?: string) => void;
}

export const DealersView: React.FC<DealersViewProps> = ({
  dealers,
  items,
  onSelectDealerCatalog,
  onManageAsDealer,
  authenticatedDealer,
  onOpenLoginModal,
}) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Intro Hero */}
      <div className="bg-white border border-[#e5ddd1] rounded-2xl p-6 sm:p-8 shadow-2xs relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#b45309] uppercase tracking-wider mb-2">
            <Store className="w-4 h-4" />
            <span>Marketplace de Galerías Asociadas</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1c1917] tracking-tight">
            Anticuarios & Casas de Alta Época
          </h1>
          <p className="text-sm sm:text-base text-stone-600 mt-3 leading-relaxed">
            Cada anticuario cuenta con su propio inventario y peritaje. Puede explorar el catálogo exclusivo de cada firma, visitar sus showrooms o contactarlos directamente por WhatsApp para coordinar citas o cierres de venta.
          </p>
        </div>
      </div>

      {/* Dealers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dealers.map((dealer) => {
          const dealerItems = items.filter((it) => it.dealerId === dealer.id);
          const availableCount = dealerItems.filter((it) => it.status === 'available').length;

          return (
            <div
              key={dealer.id}
              className="bg-white border border-[#e5ddd1] rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Banner & Avatar */}
                <div className="relative h-32 bg-[#ece4d6] overflow-hidden">
                  <img
                    src={dealer.banner}
                    alt={dealer.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  
                  {/* Verified badge */}
                  {dealer.verified && (
                    <div className="absolute top-3 right-3 bg-white/95 text-stone-900 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center space-x-1 shadow-xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verificado</span>
                    </div>
                  )}

                  {/* Avatar */}
                  <div className="absolute -bottom-6 left-5">
                    <img
                      src={dealer.avatar}
                      alt={dealer.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-md bg-stone-200"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="pt-8 px-5 pb-4">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-serif text-xl font-bold text-[#1c1917] leading-snug">
                      {dealer.name}
                    </h3>
                  </div>

                  <p className="text-xs text-stone-500 mt-1 flex items-center">
                    <MapPin className="w-3 h-3 text-[#b45309] mr-1 shrink-0" />
                    <span>{dealer.address}, {dealer.city}</span>
                  </p>

                  <p className="text-xs text-stone-600 mt-3 line-clamp-2">
                    {dealer.tagline}
                  </p>

                  {/* Stats pill */}
                  <div className="mt-4 pt-3 border-t border-[#f0eae0] flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1 text-stone-500">
                      <Award className="w-3.5 h-3.5 text-amber-700" />
                      <span>Trayectoria: <strong>Desde {dealer.foundedYear}</strong></span>
                    </div>
                    <span className="font-mono font-medium text-[#b45309] bg-[#fbf5eb] px-2 py-0.5 rounded border border-[#eeddc7]">
                      {availableCount} {availableCount === 1 ? 'pieza activa' : 'piezas activas'}
                    </span>
                  </div>

                  {/* Specialties */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {dealer.specialties.map((spec, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-[#f5efe6] text-stone-700 px-2 py-0.5 rounded border border-[#e5ddcf]"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 bg-[#fcfbf9] border-t border-[#f0eae0] space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectDealerCatalog(dealer.id)}
                    className="w-full py-2 px-3 bg-[#1c1917] hover:bg-stone-800 text-white rounded text-xs font-semibold transition-colors flex items-center justify-center space-x-1 shadow-2xs"
                  >
                    <span>Ver Catálogo</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <a
                    href={`https://wa.me/${dealer.whatsapp}?text=${encodeURIComponent(`Hola ${dealer.name}, les consulto desde la plataforma de anticuarios.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 rounded text-xs font-semibold transition-colors flex items-center justify-center space-x-1"
                  >
                    <Phone className="w-3 h-3 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                {/* Switch to Manage panel button or login button */}
                {authenticatedDealer?.id === dealer.id ? (
                  <button
                    onClick={() => onManageAsDealer(dealer)}
                    className="w-full py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-[#92400e] border border-amber-200 rounded text-[11px] font-semibold transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                    <span>Autenticado • Ir a mi Panel de Control</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (onOpenLoginModal) {
                        onOpenLoginModal(dealer.id);
                      } else {
                        onManageAsDealer(dealer);
                      }
                    }}
                    className="w-full text-center text-[11px] text-[#92400e] hover:text-[#b45309] font-medium py-1 transition-colors flex items-center justify-center space-x-1"
                  >
                    <KeyRound className="w-3 h-3 text-[#b45309]" />
                    <span>Ingresar con PIN a esta Tienda</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
