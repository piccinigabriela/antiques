import React, { useState } from 'react';
import { Lock, ShieldCheck, X, Building2, KeyRound, AlertCircle } from 'lucide-react';
import { Dealer } from '../types';

interface DealerLoginModalProps {
  dealers: Dealer[];
  initialDealerId?: string;
  onSuccess: (dealer: Dealer) => void;
  onClose: () => void;
}

export const DealerLoginModal: React.FC<DealerLoginModalProps> = ({
  dealers,
  initialDealerId,
  onSuccess,
  onClose,
}) => {
  const [selectedDealerId, setSelectedDealerId] = useState<string>(
    initialDealerId && dealers.some((d) => d.id === initialDealerId)
      ? initialDealerId
      : dealers[0]?.id || ''
  );
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const selectedDealer = dealers.find((d) => d.id === selectedDealerId) || dealers[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedDealer) {
      setError('Seleccione un anticuario válido.');
      return;
    }

    const expectedPin = selectedDealer.accessPin || '1234';
    if (pin.trim() === expectedPin.trim()) {
      onSuccess(selectedDealer);
    } else {
      setError('PIN o clave incorrecta para este anticuario. Verifique e intente nuevamente.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-[#e2d5c2] animate-fadeIn">
        {/* Header */}
        <div className="bg-[#1c1917] text-[#fcfbf9] px-6 py-5 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-amber-500/20 rounded-lg border border-amber-500/30">
              <KeyRound className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold">Acceso a Tienda & Catálogo</h2>
              <p className="text-[11px] text-stone-400">Ingreso privado para anticuarios</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white rounded-md hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Seleccione su Galería o Anticuario
            </label>
            <div className="relative">
              <select
                id="login-dealer-select"
                value={selectedDealerId}
                onChange={(e) => {
                  setSelectedDealerId(e.target.value);
                  setError(null);
                }}
                className="w-full py-2.5 px-3 bg-[#faf8f5] border border-stone-300 rounded-lg text-xs sm:text-sm text-stone-900 font-medium focus:ring-2 focus:ring-[#b45309]/50 focus:border-[#b45309] outline-none"
              >
                {dealers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.city.split(',')[0]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedDealer && (
            <div className="flex items-center space-x-3 p-3 bg-[#f7f2ea] rounded-xl border border-[#e5ded4]">
              <img
                src={selectedDealer.avatar}
                alt={selectedDealer.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border border-amber-600/30 shrink-0 bg-stone-200"
              />
              <div className="min-w-0">
                <span className="text-xs font-bold text-stone-900 block truncate">
                  {selectedDealer.name}
                </span>
                <span className="text-[11px] text-stone-500 block truncate">
                  {selectedDealer.address}
                </span>
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                PIN o Clave de Seguridad
              </label>
              <span className="text-[11px] text-stone-400 font-mono">
                PIN de prueba: {selectedDealer?.accessPin || '1234'}
              </span>
            </div>
            <div className="relative">
              <input
                id="login-pin-input"
                type="password"
                required
                autoFocus
                placeholder="Ingrese su PIN (ej. 1234)"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(null);
                }}
                className="w-full py-2.5 px-3 bg-[#faf8f5] border border-stone-300 rounded-lg text-sm text-stone-900 font-mono tracking-widest focus:ring-2 focus:ring-[#b45309]/50 focus:border-[#b45309] outline-none"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              id="login-submit-btn"
              type="submit"
              className="w-full py-2.5 px-4 bg-[#1c1917] hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-all duration-150 flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Ingresar al Panel de Gestión</span>
            </button>
          </div>

          <div className="text-center pt-1 border-t border-[#f0eae0]">
            <p className="text-[11px] text-stone-500">
              ¿Desea modificar su PIN de acceso? Puede cambiarlo en cualquier momento dentro de la pestaña{' '}
              <strong className="text-stone-700">«Showroom, WhatsApp & Clave PIN»</strong> del panel.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
