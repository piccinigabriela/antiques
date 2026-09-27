import React, { useState } from 'react';
import { MapPin, Phone, Award, ShieldCheck, ArrowRight, Store, Lock, KeyRound, Trash2, AlertTriangle, X, Sparkles, Instagram } from 'lucide-react';
import { Dealer, AntiqueItem } from '../types';
import { SAMPLE_DEALER_IDS } from '../data/mockData';

interface DealersViewProps {
  dealers: Dealer[];
  items: AntiqueItem[];
  onSelectDealerCatalog: (dealerId: string) => void;
  onManageAsDealer: (dealer: Dealer) => void;
  authenticatedDealer?: Dealer | null;
  isAdmin?: boolean;
  onOpenLoginModal?: (dealerId?: string) => void;
  onOpenAddDealer?: () => void;
  onDeleteDealer?: (dealerId: string) => void;
  onDeleteSampleDealers?: () => void;
}

export const DealersView: React.FC<DealersViewProps> = ({
  dealers,
  items,
  onSelectDealerCatalog,
  onManageAsDealer,
  authenticatedDealer,
  isAdmin = false,
  onOpenLoginModal,
  onOpenAddDealer,
  onDeleteDealer,
  onDeleteSampleDealers,
}) => {
  const [dealerToDelete, setDealerToDelete] = useState<Dealer | null>(null);
  const [showCleanSampleModal, setShowCleanSampleModal] = useState(false);

  const hasSampleDealers = dealers.some((d) => SAMPLE_DEALER_IDS.includes(d.id));

  const handleConfirmDeleteSingle = () => {
    if (dealerToDelete && onDeleteDealer) {
      onDeleteDealer(dealerToDelete.id);
      setDealerToDelete(null);
    }
  };

  const handleConfirmCleanSamples = () => {
    if (onDeleteSampleDealers) {
      onDeleteSampleDealers();
      setShowCleanSampleModal(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Intro Hero */}
      <div className="bg-white border border-[#e5ddd1] rounded-2xl p-6 sm:p-8 shadow-2xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl">
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

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {isAdmin && hasSampleDealers && onDeleteSampleDealers && (
            <button
              onClick={() => setShowCleanSampleModal(true)}
              className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-md text-xs font-semibold shadow-2xs flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Eliminar Anticuarios de Ejemplo</span>
            </button>
          )}

          {isAdmin && onOpenAddDealer && (
            <button
              onClick={onOpenAddDealer}
              className="px-5 py-2.5 bg-[#b45309] hover:bg-[#92400e] text-white rounded-md text-xs font-semibold shadow-xs flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Store className="w-4 h-4" />
              <span>+ Sumar Nuevo Anticuario</span>
            </button>
          )}
        </div>
      </div>

      {/* Dealers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dealers.map((dealer) => {
          const dealerItems = items.filter((it) => it.dealerId === dealer.id);
          const availableCount = dealerItems.filter((it) => it.status === 'available').length;
          const isSample = SAMPLE_DEALER_IDS.includes(dealer.id);

          return (
            <div
              key={dealer.id}
              className="bg-white border border-[#e5ddd1] rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between relative group"
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
                  
                  {/* Top badges */}
                  <div className="absolute top-3 right-3 flex items-center space-x-1.5">
                    {isSample && (
                      <span className="bg-stone-900/80 backdrop-blur-xs text-stone-200 text-[10px] font-medium px-2 py-0.5 rounded border border-stone-700">
                        Ejemplo Demo
                      </span>
                    )}

                    {dealer.verified && (
                      <div className="bg-white/95 text-stone-900 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center space-x-1 shadow-xs">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verificado</span>
                      </div>
                    )}

                    {isAdmin && onDeleteDealer && (
                      <button
                        onClick={() => setDealerToDelete(dealer)}
                        title={`Eliminar ${dealer.name}`}
                        className="bg-white/90 hover:bg-rose-50 text-stone-500 hover:text-rose-700 p-1 rounded shadow-xs transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

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

                {dealer.instagram && (
                  <a
                    href={`https://instagram.com/${dealer.instagram.replace(/^@/, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-1.5 px-3 bg-[#fdfbf7] hover:bg-[#f7efe3] border border-[#e8ded0] text-stone-700 rounded text-xs font-medium transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <Instagram className="w-3.5 h-3.5 text-pink-700" />
                    <span>Instagram @{dealer.instagram.replace(/^@/, '')}</span>
                  </a>
                )}

                {/* Switch to Manage panel button or login button */}
                {authenticatedDealer?.id === dealer.id ? (
                  <button
                    onClick={() => onManageAsDealer(dealer)}
                    className="w-full py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-[#92400e] border border-amber-200 rounded text-[11px] font-semibold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                    <span>Autenticado • Ir a mi Panel de Control</span>
                  </button>
                ) : isAdmin ? (
                  <button
                    onClick={() => onManageAsDealer(dealer)}
                    className="w-full py-1 px-2 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 rounded text-[11px] font-medium transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <ShieldCheck className="w-3 h-3 text-stone-600" />
                    <span>Supervisar como Admin</span>
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL 1: Confirmación de eliminación individual de anticuario */}
      {dealerToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-fadeIn">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-rose-100 text-rose-700 rounded-full shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-stone-900 font-serif">
                  ¿Eliminar Anticuario?
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  ¿Estás segura de eliminar a <strong className="text-stone-900">{dealerToDelete.name}</strong>?
                </p>
                <p className="text-xs text-stone-500 mt-2 bg-stone-50 p-2.5 rounded border border-stone-200">
                  Esta acción eliminará el perfil del anticuario y todas las piezas vinculadas a su inventario tanto en tu navegador como en la base de datos Firestore.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setDealerToDelete(null)}
                className="px-4 py-2 border border-stone-300 text-stone-700 rounded-md text-xs font-semibold hover:bg-stone-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteSingle}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-md text-xs font-semibold transition-colors flex items-center space-x-1.5 shadow-xs"
              >
                <Trash2 className="w-4 h-4" />
                <span>Sí, Eliminar Anticuario</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Confirmación de limpieza de todos los anticuarios de muestra */}
      {showCleanSampleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-fadeIn">
            <div className="flex items-start space-x-3">
              <div className="p-2.5 bg-amber-100 text-amber-800 rounded-full shrink-0">
                <Trash2 className="w-6 h-6 text-[#b45309]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-stone-900 font-serif">
                  Limpiar Anticuarios de Ejemplo
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Esta opción eliminará de una sola vez los <strong>anticuarios de muestra predeterminados</strong>:
                </p>
                
                <ul className="text-xs text-stone-600 list-disc list-inside mt-2 space-y-1 bg-[#faf7f2] p-3 rounded border border-[#ebdcc8]">
                  <li>Casa Intaglieta y sus piezas de residencia</li>
                  <li>Antigüedades Casa San Telmo</li>
                  <li>Galería Art Déco & Siglo XX</li>
                  <li>El Desván Imperial & Relojería</li>
                </ul>

                <p className="text-xs text-emerald-800 mt-2 font-medium bg-emerald-50 p-2.5 rounded border border-emerald-200">
                  ✓ Si ya creaste tu propio anticuario, se conservará intacto. Si aún no creaste uno, se habilitará tu propio anticuario limpio listo para tu catálogo.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setShowCleanSampleModal(false)}
                className="px-4 py-2 border border-stone-300 text-stone-700 rounded-md text-xs font-semibold hover:bg-stone-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmCleanSamples}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-md text-xs font-semibold transition-colors flex items-center space-x-1.5 shadow-xs"
              >
                <Trash2 className="w-4 h-4" />
                <span>Confirmar y Limpiar Ejemplos</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
