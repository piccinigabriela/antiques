import React, { useState } from 'react';
import { X, MessageSquareQuote, Send, Phone, CheckCircle, ArrowRight } from 'lucide-react';
import { AntiqueItem, Dealer, NegotiationOffer, NegotiationMessage } from '../types';
import { formatCurrency, generateNegotiationWhatsAppUrl } from '../utils/whatsapp';

interface NegotiationModalProps {
  item: AntiqueItem | null;
  dealer: Dealer | null;
  onClose: () => void;
  existingOffer?: NegotiationOffer | null;
  onSaveOffer: (offer: NegotiationOffer) => void;
}

export const NegotiationModal: React.FC<NegotiationModalProps> = ({
  item,
  dealer,
  onClose,
  existingOffer,
  onSaveOffer,
}) => {
  const [buyerName, setBuyerName] = useState(existingOffer ? existingOffer.buyerName : '');
  const [buyerPhone, setBuyerPhone] = useState(existingOffer ? existingOffer.buyerPhone : '');
  const [offerPrice, setOfferPrice] = useState<number>(
    existingOffer ? existingOffer.offeredPrice : (item ? Math.round(item.price * 0.85) : 1000)
  );
  const [initialMessage, setInitialMessage] = useState(
    existingOffer ? '' : 'Estimado anticuario, me interesa mucho esta pieza. ¿Aceptaría esta propuesta para pago de contado?'
  );
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!item || !dealer) return null;

  const discountPercent = Math.round(((item.price - offerPrice) / item.price) * 100);
  const isExisting = !!existingOffer;

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerPhone || offerPrice <= 0) return;

    setIsSubmitting(true);

    const firstMsg: NegotiationMessage = {
      id: `msg-${Date.now()}-1`,
      sender: 'buyer',
      senderName: buyerName,
      message: initialMessage || `Propuesta inicial de ${formatCurrency(offerPrice, item.currency)}`,
      amount: offerPrice,
      timestamp: new Date().toISOString(),
    };

    // Realistic antique dealer response based on margin
    const diffRate = (item.price - offerPrice) / item.price;
    const initialDealerResponse: NegotiationMessage | null = diffRate <= 0.08
      ? {
          id: `msg-${Date.now()}-2`,
          sender: 'dealer',
          senderName: dealer.name,
          message: `Estimado/a ${buyerName}, hemos analizado su oferta y nos complace aceptarla. Podemos cerrar la operación en ${formatCurrency(offerPrice, item.currency)}. Por favor presione el botón de WhatsApp para coordinar el retiro.`,
          amount: offerPrice,
          timestamp: new Date(Date.now() + 1500).toISOString(),
        }
      : diffRate <= 0.22
      ? {
          id: `msg-${Date.now()}-2`,
          sender: 'dealer',
          senderName: dealer.name,
          message: `Estimado/a ${buyerName}, gracias por su interés en esta pieza única. Dado su excelente estado y procedencia, no podemos reducir tanto, pero le hacemos una contraoferta especial de ${formatCurrency(Math.round(item.price * 0.92), item.currency)} para concretar.`,
          amount: Math.round(item.price * 0.92),
          timestamp: new Date(Date.now() + 1500).toISOString(),
        }
      : {
          id: `msg-${Date.now()}-2`,
          sender: 'dealer',
          senderName: dealer.name,
          message: `Estimado/a ${buyerName}, la pieza cuenta con certificación pericial y un valor de mercado consolidado. La oferta está por debajo del margen posible. Podríamos conceder una atención del 5% (${formatCurrency(Math.round(item.price * 0.95), item.currency)}) para pago directo.`,
          amount: Math.round(item.price * 0.95),
          timestamp: new Date(Date.now() + 1500).toISOString(),
        };

    const newOffer: NegotiationOffer = {
      id: `offer-${Date.now()}`,
      itemId: item.id,
      itemTitle: item.title,
      itemSku: item.sku,
      itemImage: item.images[0],
      originalPrice: item.price,
      currency: item.currency,
      dealerId: dealer.id,
      buyerName,
      buyerPhone,
      offeredPrice: offerPrice,
      counterOfferPrice: initialDealerResponse?.amount,
      status: diffRate <= 0.08 ? 'accepted' : 'countered',
      messages: initialDealerResponse ? [firstMsg, initialDealerResponse] : [firstMsg],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTimeout(() => {
      onSaveOffer(newOffer);
      setIsSubmitting(false);
    }, 400);
  };

  const handleSendBuyerReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!existingOffer || !replyText.trim()) return;

    const newMsg: NegotiationMessage = {
      id: `msg-${Date.now()}`,
      sender: 'buyer',
      senderName: existingOffer.buyerName,
      message: replyText.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedOffer: NegotiationOffer = {
      ...existingOffer,
      messages: [...existingOffer.messages, newMsg],
      updatedAt: new Date().toISOString(),
    };

    onSaveOffer(updatedOffer);
    setReplyText('');
  };

  const currentOfferData = existingOffer;
  const whatsappFinalUrl = currentOfferData
    ? generateNegotiationWhatsAppUrl(currentOfferData, dealer)
    : '';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div 
        id="negotiation-modal"
        className="relative bg-[#fcfbf9] w-full max-w-2xl rounded-xl shadow-2xl border border-[#e2dacf] overflow-hidden my-auto flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#f6f2eb] border-b border-[#e5ddd1] shrink-0">
          <div className="flex items-center space-x-2">
            <MessageSquareQuote className="w-5 h-5 text-[#b45309]" />
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1c1917]">
              Mesa de Negociación & Contraoferta
            </h2>
          </div>
          <button
            onClick={onClose}
            id="close-negotiation-modal-btn"
            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item mini banner */}
        <div className="px-6 py-3 bg-[#fdfbf7] border-b border-[#ede5d8] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-3 truncate">
            <img
              src={item.images[0]}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded object-cover border border-stone-200 shrink-0"
            />
            <div className="truncate">
              <span className="text-[11px] font-mono text-stone-500 block">REF: {item.sku}</span>
              <h3 className="text-xs sm:text-sm font-semibold text-stone-900 truncate font-serif">
                {item.title}
              </h3>
              <p className="text-[11px] text-stone-500">
                Anticuario: <strong>{dealer.name}</strong>
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Precio de lista</span>
            <span className="font-serif font-bold text-sm sm:text-base text-stone-900">
              {formatCurrency(item.price, item.currency)}
            </span>
          </div>
        </div>

        {/* Body content */}
        <div className="overflow-y-auto p-6 flex-1 space-y-6">
          {!isExisting ? (
            /* Formulari de nueva propuesta */
            <form onSubmit={handleCreateOffer} className="space-y-5">
              <div className="bg-[#f7f3ec] border border-[#e7ded1] p-4 rounded-lg">
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-2">
                  Su Oferta Propuesta ({item.currency})
                </label>
                <div className="flex items-center space-x-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-stone-500 font-serif font-bold text-lg">$</span>
                    <input
                      type="number"
                      required
                      min={Math.round(item.price * 0.4)}
                      max={item.price}
                      value={offerPrice || ''}
                      onChange={(e) => setOfferPrice(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-2.5 bg-white border border-[#d6cfc7] rounded-md font-serif text-xl font-bold text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-[#b45309]/50"
                      placeholder="Ingrese su monto"
                    />
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-xs font-semibold px-2 py-1 rounded border ${
                      discountPercent > 25 ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    }`}>
                      {discountPercent > 0 ? `-${discountPercent}% de lista` : 'Precio de lista'}
                    </span>
                    <span className="block text-[10px] text-stone-500 mt-1">
                      Ahorro: {formatCurrency(item.price - offerPrice, item.currency)}
                    </span>
                  </div>
                </div>

                {/* Suggested offer chips */}
                <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-[#ded5c7]">
                  <span className="text-[11px] text-stone-500">Ofertas rápidas:</span>
                  {[0.9, 0.85, 0.8].map((factor) => {
                    const val = Math.round(item.price * factor);
                    return (
                      <button
                        key={factor}
                        type="button"
                        onClick={() => setOfferPrice(val)}
                        className="text-[11px] font-mono px-2 py-0.5 bg-white hover:bg-stone-100 border border-stone-300 rounded text-stone-700 transition-colors"
                      >
                        {formatCurrency(val, item.currency)} (-{Math.round((1 - factor) * 100)}%)
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Contact info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Su Nombre y Apellido *
                  </label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Ej. Arq. Rodrigo Gómez"
                    className="w-full px-3 py-2 bg-white border border-[#d6cfc7] rounded-md text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#b45309]/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="Ej. +54 9 11 5555 4321"
                    className="w-full px-3 py-2 bg-white border border-[#d6cfc7] rounded-md text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#b45309]/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Mensaje o Justificación de la Oferta (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={initialMessage}
                  onChange={(e) => setInitialMessage(e.target.value)}
                  placeholder="Explique su propuesta o consulte condiciones especiales..."
                  className="w-full px-3 py-2 bg-white border border-[#d6cfc7] rounded-md text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#b45309]/50"
                ></textarea>
              </div>

              <div className="bg-[#faf7f2] p-3 rounded text-[11px] text-stone-600 border border-[#eee7db]">
                ℹ️ La oferta es evaluada directamente por <strong>{dealer.name}</strong>. Una vez aceptada, podrán cerrar el retiro y pago por WhatsApp sin comisiones ni pasarelas.
              </div>

              <button
                id="submit-negotiation-offer-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-[#b45309] hover:bg-[#92400e] text-white font-semibold rounded-md text-sm transition-colors flex items-center justify-center space-x-2 shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Enviando oferta...' : 'Enviar Propuesta Formal al Anticuario'}</span>
              </button>
            </form>
          ) : (
            /* Chat de negociación en vivo y contraoferta */
            <div className="space-y-4">
              {/* Status Header */}
              <div className="p-3.5 bg-[#f5ede1] border border-[#e3d3bd] rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8c531b] block">
                    Estado de la Negociación
                  </span>
                  <div className="flex items-center space-x-2 mt-0.5">
                    {currentOfferData.status === 'accepted' ? (
                      <span className="flex items-center space-x-1 text-sm font-bold text-emerald-800">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>¡Oferta Aceptada por el Anticuario!</span>
                      </span>
                    ) : currentOfferData.status === 'countered' ? (
                      <span className="text-sm font-bold text-amber-900">
                        Contraoferta del Anticuario Disponible
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-stone-700">
                        Propuesta en revisión por el anticuario
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-stone-500 uppercase block">Precio Negociado</span>
                  <span className="font-serif font-bold text-lg text-[#1c1917]">
                    {formatCurrency(
                      currentOfferData.counterOfferPrice || currentOfferData.offeredPrice,
                      currentOfferData.currency
                    )}
                  </span>
                </div>
              </div>

              {/* Messages Thread */}
              <div className="bg-white border border-[#e5ddd1] rounded-lg p-4 space-y-3 max-h-64 overflow-y-auto">
                {currentOfferData.messages.map((msg) => {
                  const isBuyer = msg.sender === 'buyer';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isBuyer ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center space-x-1.5 text-[10px] text-stone-400 mb-0.5">
                        <span className="font-semibold text-stone-600">{msg.senderName}</span>
                        <span>•</span>
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div
                        className={`max-w-[85%] p-3 rounded-lg text-xs leading-relaxed ${
                          isBuyer
                            ? 'bg-[#b45309] text-white rounded-tr-none'
                            : 'bg-[#f4eee4] text-stone-900 border border-[#e2d8ca] rounded-tl-none'
                        }`}
                      >
                        <p>{msg.message}</p>
                        {msg.amount && (
                          <div className={`mt-1.5 pt-1 text-[11px] font-mono font-semibold border-t ${
                            isBuyer ? 'border-amber-400/50 text-amber-100' : 'border-stone-300 text-[#92400e]'
                          }`}>
                            Propuesta: {formatCurrency(msg.amount, currentOfferData.currency)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply box */}
              <form onSubmit={handleSendBuyerReply} className="flex space-x-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Escriba una respuesta o contrapropuesta..."
                  className="flex-1 px-3 py-2 bg-white border border-[#d6cfc7] rounded-md text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#b45309]/50"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-900 disabled:opacity-50 text-white rounded-md text-xs font-semibold flex items-center space-x-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Responder</span>
                </button>
              </form>

              {/* CLOSING BY WHATSAPP DIRECT CTA */}
              <div className="pt-2">
                <a
                  id="negotiation-whatsapp-close-btn"
                  href={whatsappFinalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-sm font-semibold transition-all flex items-center justify-center space-x-2 shadow-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>Formalizar y Cerrar Acuerdo por WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <p className="text-[11px] text-center text-stone-500 mt-1.5">
                  Abre una conversación con {dealer.name} con el monto acordado pre-cargado para coordinar pago y entrega.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
