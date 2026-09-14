import React from 'react';
import { MessageSquareQuote, Phone, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { NegotiationOffer, Dealer, AntiqueItem } from '../types';
import { formatCurrency, generateNegotiationWhatsAppUrl } from '../utils/whatsapp';

interface NegotiationsListViewProps {
  offers: NegotiationOffer[];
  dealers: Dealer[];
  items: AntiqueItem[];
  onOpenOffer: (offer: NegotiationOffer) => void;
  onExploreCatalog: () => void;
}

export const NegotiationsListView: React.FC<NegotiationsListViewProps> = ({
  offers,
  dealers,
  items,
  onOpenOffer,
  onExploreCatalog,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner */}
      <div className="bg-white border border-[#e5ddd1] rounded-2xl p-6 sm:p-8 shadow-2xs">
        <div className="max-w-3xl">
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#b45309] uppercase tracking-wider mb-2">
            <MessageSquareQuote className="w-4 h-4" />
            <span>Mesa de Ofertas y Acuerdos</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1c1917]">
            Negociaciones de Precio en Curso
          </h1>
          <p className="text-sm text-stone-600 mt-2 leading-relaxed">
            Consulte el estado de sus propuestas enviadas a los anticuarios. Una vez aceptada una oferta o consensuado un valor, formalice el cierre y la entrega directamente a través de WhatsApp.
          </p>
        </div>
      </div>

      {offers.length === 0 ? (
        <div className="bg-white border border-[#e5ddd1] rounded-xl p-12 text-center text-stone-500 space-y-4">
          <MessageSquareQuote className="w-10 h-10 mx-auto text-stone-300" />
          <h3 className="font-serif text-lg font-bold text-stone-800">
            No tiene negociaciones activas en este momento
          </h3>
          <p className="text-xs text-stone-600 max-w-md mx-auto">
            Explore el catálogo de alta antigüedad y utilice el botón "Negociar Precio" en cualquier pieza de su interés para formular una oferta directa al anticuario.
          </p>
          <button
            onClick={onExploreCatalog}
            className="py-2.5 px-5 bg-[#b45309] hover:bg-[#92400e] text-white rounded-md text-xs font-semibold transition-colors inline-flex items-center space-x-1.5 shadow-xs"
          >
            <span>Explorar Catálogo de Antigüedades</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offers.map((offer) => {
            const dealer = dealers.find((d) => d.id === offer.dealerId) || dealers[0];
            const whatsappCloseUrl = generateNegotiationWhatsAppUrl(offer, dealer);

            return (
              <div
                key={offer.id}
                className="bg-white border border-[#e5ddd1] rounded-xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={offer.itemImage}
                        alt={offer.itemTitle}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded object-cover border border-stone-200 shrink-0"
                      />
                      <div>
                        <span className="font-mono text-[10px] text-stone-400 block">
                          REF: {offer.itemSku}
                        </span>
                        <h3 className="font-serif font-bold text-stone-900 text-sm line-clamp-1">
                          {offer.itemTitle}
                        </h3>
                        <p className="text-xs text-stone-500">
                          Anticuario: <strong>{dealer.name}</strong>
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase shrink-0 ${
                        offer.status === 'accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : offer.status === 'countered'
                          ? 'bg-amber-100 text-amber-800'
                          : offer.status === 'declined'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {offer.status === 'accepted'
                        ? 'Oferta Aceptada'
                        : offer.status === 'countered'
                        ? 'Contraoferta Recibida'
                        : offer.status === 'declined'
                        ? 'Declinada'
                        : 'En Revisión'}
                    </span>
                  </div>

                  {/* Pricing Comparison */}
                  <div className="p-3 bg-[#faf7f2] rounded-lg border border-[#ede5d8] grid grid-cols-2 gap-2 text-xs mb-3">
                    <div>
                      <span className="text-stone-400 text-[10px] uppercase block">Precio de Lista</span>
                      <span className="font-serif text-stone-600 line-through">
                        {formatCurrency(offer.originalPrice, offer.currency)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[#92400e] text-[10px] uppercase font-semibold block">
                        {offer.status === 'countered' ? 'Contraoferta Anticuario' : 'Su Propuesta'}
                      </span>
                      <span className="font-serif font-bold text-base text-[#b45309]">
                        {formatCurrency(
                          offer.counterOfferPrice || offer.offeredPrice,
                          offer.currency
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Latest Message Preview */}
                  {offer.messages.length > 0 && (
                    <div className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded border border-stone-200 line-clamp-2 italic">
                      "{offer.messages[offer.messages.length - 1].message}"
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-[#f0eae0] flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenOffer(offer)}
                    className="py-2 px-3 text-xs font-semibold text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200/80 rounded transition-colors flex items-center space-x-1"
                  >
                    <MessageSquareQuote className="w-3.5 h-3.5" />
                    <span>Ver Chat Completo</span>
                  </button>

                  <a
                    href={whatsappCloseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold transition-colors flex items-center space-x-1.5 shadow-2xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Cerrar por WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
