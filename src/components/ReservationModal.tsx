import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle2, AlertCircle, Copy, ExternalLink, QrCode } from 'lucide-react';
import { AntiqueItem, Dealer } from '../types';
import { formatCurrency } from '../utils/whatsapp';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: AntiqueItem;
  dealer: Dealer;
  onReservationSuccess: (itemId: string, method: string, amount: number) => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  item,
  dealer,
  onReservationSuccess,
}) => {
  if (!isOpen) return null;

  // 10% commitment deposit calculation
  const depositPercent = 10;
  const depositAmount = Math.round(item.price * (depositPercent / 100));
  const remainingAmount = item.price - depositAmount;

  const [selectedMethod, setSelectedMethod] = useState<'paypal' | 'payoneer' | 'usdt' | 'local'>('paypal');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleSimulatePayment = (method: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      onReservationSuccess(item.id, method, depositAmount);
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fadeIn">
      <div 
        id="reservation-modal-content"
        className="bg-[#fcfbf9] border border-[#dcd4c7] rounded-md shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#eae3d6] bg-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-950">
                Reserva de Pieza en Custodia
              </h2>
              <p className="text-xs text-stone-500">
                Garantía oficial de 72 horas para inspección y retiro
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 flex items-center justify-center text-lg"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-stone-800 text-sm">
          {/* Summary Box */}
          <div className="bg-[#f5f1eb] p-4 rounded-sm border border-[#e5ded2] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={item.images?.[0] || ''}
                alt={item.title}
                className="w-14 h-14 object-cover rounded-sm border border-[#d6cbbe]"
              />
              <div>
                <span className="text-[11px] font-mono text-stone-500 uppercase">
                  REF: {item.sku}
                </span>
                <h4 className="font-serif font-bold text-stone-950 text-sm line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-xs text-stone-600">
                  Galería: {dealer.name}
                </p>
              </div>
            </div>

            <div className="text-right pl-3 border-l border-[#ded5c7]">
              <span className="text-[10px] uppercase tracking-wider text-stone-500 block">
                Seña del 10%
              </span>
              <span className="font-serif text-xl font-bold text-stone-950">
                USD ${depositAmount}
              </span>
              <span className="text-[10px] text-stone-500 block">
                Saldo al retirar: USD ${remainingAmount}
              </span>
            </div>
          </div>

          {!isComplete ? (
            <>
              {/* Payment Methods Selection */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-2.5">
                  Selecciona la pasarela de reserva segura:
                </label>

                <div className="grid grid-cols-2 gap-2.5">
                  {/* PayPal Official */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('paypal')}
                    className={`p-3 rounded-sm border flex items-center space-x-3 transition-all text-left ${
                      selectedMethod === 'paypal'
                        ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-500'
                        : 'border-[#ded5c7] bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="w-9 h-9 rounded bg-[#003087] flex items-center justify-center shrink-0">
                      <span className="text-white font-black text-xs italic tracking-tighter">
                        Pay<span className="text-[#0079C1]">Pal</span>
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-stone-900 text-xs block">
                        PayPal Oficial
                      </span>
                      <span className="text-[10px] text-stone-500 block">
                        Saldo o Tarjeta USD
                      </span>
                    </div>
                  </button>

                  {/* Payoneer Official */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('payoneer')}
                    className={`p-3 rounded-sm border flex items-center space-x-3 transition-all text-left ${
                      selectedMethod === 'payoneer'
                        ? 'border-orange-500 bg-orange-50/50 ring-1 ring-orange-400'
                        : 'border-[#ded5c7] bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="w-9 h-9 rounded bg-[#FF4800] flex items-center justify-center shrink-0">
                      <span className="text-white font-bold text-xs tracking-tighter">
                        P
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-stone-900 text-xs block">
                        Payoneer
                      </span>
                      <span className="text-[10px] text-stone-500 block">
                        USD / Transferencia int.
                      </span>
                    </div>
                  </button>

                  {/* USDT / Dólar Digital */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('usdt')}
                    className={`p-3 rounded-sm border flex items-center space-x-3 transition-all text-left ${
                      selectedMethod === 'usdt'
                        ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-500'
                        : 'border-[#ded5c7] bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="w-9 h-9 rounded bg-[#26A17B] flex items-center justify-center shrink-0">
                      <span className="text-white font-bold text-xs">
                        ₮
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-stone-900 text-xs block">
                        Dólar Digital (USDT)
                      </span>
                      <span className="text-[10px] text-stone-500 block">
                        Privado • Red Tron / Polygon
                      </span>
                    </div>
                  </button>

                  {/* Mercado Pago / Transferencia */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('local')}
                    className={`p-3 rounded-sm border flex items-center space-x-3 transition-all text-left ${
                      selectedMethod === 'local'
                        ? 'border-sky-600 bg-sky-50/50 ring-1 ring-sky-500'
                        : 'border-[#ded5c7] bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="w-9 h-9 rounded bg-[#009EE3] flex items-center justify-center shrink-0">
                      <span className="text-white font-bold text-xs">
                        MP
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-stone-900 text-xs block">
                        Transferencia ARS
                      </span>
                      <span className="text-[10px] text-stone-500 block">
                        Mercado Pago / Alias
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Dynamic Payment Details Area */}
              <div className="p-4 bg-white border border-[#e2dacd] rounded-sm space-y-4">
                {selectedMethod === 'paypal' && (
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2 text-xs text-stone-600">
                      <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>
                        Se abrirá la pasarela segura y certificada de <strong>PayPal Inc.</strong> Podrás pagar con tu saldo internacional o tarjeta de crédito sin tributación local.
                      </span>
                    </div>

                    <div className="bg-stone-50 p-3 rounded-sm border border-stone-200 flex items-center justify-between text-xs">
                      <span className="text-stone-500 font-mono">Monto a debitar:</span>
                      <span className="font-bold text-blue-900 font-mono text-sm">USD ${depositAmount}.00</span>
                    </div>

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleSimulatePayment('PayPal')}
                      className="w-full py-3 px-4 bg-[#FFC439] hover:bg-[#F4BB30] text-[#003087] font-bold text-sm rounded shadow-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
                    >
                      {isProcessing ? (
                        <span>Conectando con PayPal...</span>
                      ) : (
                        <>
                          <span className="italic font-black text-base">Pay<span className="text-[#0079C1]">Pal</span></span>
                          <span className="font-medium text-stone-800">| Pagar Seña de USD ${depositAmount}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {selectedMethod === 'payoneer' && (
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2 text-xs text-stone-600">
                      <Lock className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                      <span>
                        Paga directo a la cuenta corporativa de Articuarios en <strong>Payoneer</strong> con 0% de recargo por transferencia entre cuentas o tarjeta bancaria internacional.
                      </span>
                    </div>

                    <div className="bg-stone-50 p-3 rounded-sm border border-stone-200 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-stone-500">Beneficiario Payoneer:</span>
                        <span className="font-mono font-medium text-stone-900">custodia@articuarios.store</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Monto exacto:</span>
                        <span className="font-mono font-bold text-orange-700">USD ${depositAmount}.00</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleSimulatePayment('Payoneer')}
                      className="w-full py-3 px-4 bg-[#FF4800] hover:bg-[#E04000] text-white font-bold text-sm rounded shadow-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
                    >
                      {isProcessing ? (
                        <span>Validando transferencia Payoneer...</span>
                      ) : (
                        <>
                          <span>Pagar con Payoneer (USD ${depositAmount})</span>
                          <ExternalLink className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </button>
                  </div>
                )}

                {selectedMethod === 'usdt' && (
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2 text-xs text-stone-600">
                      <QrCode className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        Transferencia descentralizada y confidencial en <strong>USDT (Tether)</strong>. Confirmación instantánea en blockchain.
                      </span>
                    </div>

                    <div className="bg-stone-50 p-3 rounded-sm border border-stone-200 text-xs space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-stone-500">Red permitida:</span>
                        <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-semibold text-[10px]">
                          Polygon / TRC-20
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-500 block mb-0.5">Billetera de Custodia:</span>
                        <div className="flex items-center space-x-2">
                          <code className="bg-white px-2 py-1 border border-stone-300 rounded font-mono text-[11px] text-stone-800 flex-1 truncate">
                            0x71C...8B3f4D99aE2
                          </code>
                          <button
                            type="button"
                            onClick={() => handleCopy('0x71C694b4E19859f81a7b82Bc7171e8B3f4D99aE2', 'wallet')}
                            className="px-2.5 py-1 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded text-xs flex items-center space-x-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{copiedField === 'wallet' ? 'Copiado!' : 'Copiar'}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleSimulatePayment('USDT Blockchain')}
                      className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded shadow-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
                    >
                      {isProcessing ? (
                        <span>Verificando transacción en red...</span>
                      ) : (
                        <span>Confirmar Envío de {depositAmount} USDT</span>
                      )}
                    </button>
                  </div>
                )}

                {selectedMethod === 'local' && (
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2 text-xs text-stone-600">
                      <Lock className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                      <span>
                        Transferencia en Pesos Argentinos (ARS) a cotización MEP/Blue del día. 
                      </span>
                    </div>

                    <div className="bg-stone-50 p-3 rounded-sm border border-stone-200 text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-stone-500">Alias CBU:</span>
                        <div className="flex items-center space-x-2">
                          <strong className="font-mono text-stone-900">ARTICUARIOS.RESERVA</strong>
                          <button
                            type="button"
                            onClick={() => handleCopy('ARTICUARIOS.RESERVA', 'alias')}
                            className="text-stone-500 hover:text-stone-900"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Equivalente aprox:</span>
                        <span className="font-bold text-stone-900 font-mono">
                          ARS ${(depositAmount * 1350).toLocaleString('es-AR')}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleSimulatePayment('Transferencia Local')}
                      className="w-full py-3 px-4 bg-[#009EE3] hover:bg-[#0082BD] text-white font-bold text-sm rounded shadow-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
                    >
                      {isProcessing ? (
                        <span>Registrando comprobante...</span>
                      ) : (
                        <span>Pagar con Mercado Pago / Transferencia</span>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Security terms */}
              <div className="flex items-center space-x-2 text-[11px] text-stone-500">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  La seña congela la pieza por 72 horas. Si el peritaje no coincide con la descripción al revisarla, te reintegramos el 100% de la seña.
                </span>
              </div>
            </>
          ) : (
            /* Success confirmation screen */
            <div className="text-center py-6 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-300">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest text-emerald-700 font-bold block">
                  ¡Reserva Exitosa!
                </span>
                <h3 className="font-serif text-2xl font-bold text-stone-950 mt-1">
                  Pieza Bloqueada en Custodia
                </h3>
                <p className="text-xs text-stone-600 max-w-md mx-auto mt-2">
                  Se ha registrado la seña de <strong>USD ${depositAmount}</strong> mediante {selectedMethod.toUpperCase()}. La pieza ahora figura como <strong>RESERVADA</strong> en el catálogo.
                </p>
              </div>

              <div className="bg-stone-50 border border-stone-200 p-4 rounded text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-stone-500">Código de Reserva:</span>
                  <span className="font-mono font-bold text-stone-900">RES-{item.sku}-{Date.now().toString().slice(-4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Saldo a abonar en galería:</span>
                  <span className="font-mono font-bold text-emerald-800">USD ${remainingAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Galería responsable:</span>
                  <span className="font-medium text-stone-900">{dealer.name} ({dealer.address}, {dealer.city})</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/${dealer.whatsapp}?text=${encodeURIComponent(
                    `Hola ${dealer.name}! Acabo de reservar la pieza "${item.title}" (SKU: ${item.sku}) mediante la plataforma Articuarios. Ya aboné la seña del 10% (USD $${depositAmount}). Me contacto para coordinar la inspección y el retiro de la pieza.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium text-xs flex items-center justify-center space-x-2"
                >
                  <span>Coordinar retiro por WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded font-medium text-xs"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
