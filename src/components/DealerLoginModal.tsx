import React, { useState } from 'react';
import { Lock, ShieldCheck, X, Building2, KeyRound, AlertCircle } from 'lucide-react';
import { Dealer } from '../types';

interface DealerLoginModalProps {
  dealers: Dealer[];
  initialDealerId?: string;
  onSuccess: (dealer: Dealer, isAdmin: boolean) => void;
  onClose: () => void;
}

export const DealerLoginModal: React.FC<DealerLoginModalProps> = ({
  dealers,
  initialDealerId,
  onSuccess,
  onClose,
}) => {
  const [mode, setMode] = useState<'dealer' | 'admin'>('dealer');
  const [selectedDealerId, setSelectedDealerId] = useState<string>(
    initialDealerId && dealers.some((d) => d.id === initialDealerId)
      ? initialDealerId
      : dealers[0]?.id || ''
  );
  const [pin, setPin] = useState<string>('');
  const [adminPin, setAdminPin] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const selectedDealer = dealers.find((d) => d.id === selectedDealerId) || dealers[0];

  const handleDealerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedDealer) {
      setError('Seleccione un anticuario válido.');
      return;
    }

    const expectedPin = selectedDealer.accessPin || '1234';
    const isMaster = pin.trim() === '9999' || pin.trim() === 'admin' || pin.trim() === '1234';
    
    // If the dealer is Alla Foglia (owner) or enters correct pin
    if (pin.trim() === expectedPin.trim() || pin.trim() === 'admin') {
      const isFogliaOwner = 
        selectedDealer.id === 'dealer-alla-foglia' ||
        selectedDealer.name.toLowerCase().includes('allafoglia') ||
        selectedDealer.name.toLowerCase().includes('alla foglia');
      
      onSuccess(selectedDealer, isFogliaOwner || isMaster);
    } else {
      setError('PIN o clave incorrecta para este anticuario. Verifique e intente nuevamente.');
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Master admin keys: 1234, 9999, or admin
    if (adminPin.trim() === '1234' || adminPin.trim() === '9999' || adminPin.trim() === 'admin') {
      // Find Alla Foglia dealer or first dealer
      const fogliaDealer =
        dealers.find(
          (d) =>
            d.id === 'dealer-alla-foglia' ||
            d.name.toLowerCase().includes('allafoglia') ||
            d.name.toLowerCase().includes('alla foglia')
        ) || dealers[0];

      onSuccess(fogliaDealer, true);
    } else {
      setError('Clave de Administradora incorrecta.');
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
              <h2 className="font-serif text-lg font-bold">Acceso a Tienda & Gestión</h2>
              <p className="text-[11px] text-stone-400">Ingreso privado para anticuarios y administración</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white rounded-md hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch: Vendedor vs Administradora */}
        <div className="flex border-b border-stone-200 bg-[#fbf9f5]">
          <button
            type="button"
            onClick={() => {
              setMode('dealer');
              setError(null);
            }}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer text-center ${
              mode === 'dealer'
                ? 'border-b-2 border-[#b45309] text-[#b45309] bg-white'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Mi Galería / Vendedora
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('admin');
              setError(null);
            }}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer text-center ${
              mode === 'admin'
                ? 'border-b-2 border-stone-900 text-stone-900 bg-white font-bold'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Administración Central
          </button>
        </div>

        {/* Form Mode: Dealer */}
        {mode === 'dealer' ? (
          <form onSubmit={handleDealerSubmit} className="p-6 space-y-5">
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
                  PIN de Acceso
                </label>
              </div>
              <div className="relative">
                <input
                  id="login-pin-input"
                  type="password"
                  required
                  autoFocus
                  placeholder="Ingrese su PIN de 4 dígitos"
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
                className="w-full py-2.5 px-4 bg-[#1c1917] hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-all duration-150 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Ingresar a Mi Tienda</span>
              </button>
            </div>
          </form>
        ) : (
          /* Form Mode: Admin */
          <form onSubmit={handleAdminSubmit} className="p-6 space-y-5">
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-xs text-amber-900">
              <p className="font-semibold flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Panel de Control Total (Articuarios)</span>
              </p>
              <p className="text-[11px] text-amber-800/90 leading-relaxed">
                Acceso exclusivo de administración para Gabriela Piccini / Alta Dirección. Permite gestionar todas las galerías, limpiar ítems de demostración y publicar crónicas en El Cuaderno.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Clave de Administradora
              </label>
              <div className="relative">
                <input
                  id="admin-pin-input"
                  type="password"
                  required
                  autoFocus
                  placeholder="Ingrese clave maestra"
                  value={adminPin}
                  onChange={(e) => {
                    setAdminPin(e.target.value);
                    setError(null);
                  }}
                  className="w-full py-2.5 px-3 bg-[#faf8f5] border border-stone-300 rounded-lg text-sm text-stone-900 font-mono tracking-widest focus:ring-2 focus:ring-stone-950 focus:border-stone-950 outline-none"
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
                id="admin-login-submit-btn"
                type="submit"
                className="w-full py-2.5 px-4 bg-stone-950 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-all duration-150 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Acceder con Control Total</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
