import React, { useState } from 'react';
import { X, Award, ShieldCheck, MapPin, Phone, MessageSquareQuote, CheckCircle2, AlertCircle, Share2, Truck, Sparkles, Trash2, Instagram, Landmark, Eye, EyeOff } from 'lucide-react';
import { AntiqueItem, Dealer } from '../types';
import { formatCurrency, generateItemWhatsAppUrl } from '../utils/whatsapp';
import { classifyItemEra } from '../utils/eraClassifier';

interface ProductDetailModalProps {
  item: AntiqueItem | null;
  dealer: Dealer | null;
  onClose: () => void;
  onOpenNegotiation: (item: AntiqueItem) => void;
  onFilterByDealer: (dealerId: string) => void;
  onOpenReservation?: (item: AntiqueItem) => void;
  onDeleteItem?: (itemId: string) => void;
  onToggleHideItem?: (itemId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  item,
  dealer,
  onClose,
  onOpenNegotiation,
  onFilterByDealer,
  onOpenReservation,
  onDeleteItem,
  onToggleHideItem,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!item || !dealer) return null;

  const eraInfo = classifyItemEra(item.period, item.style);
  const whatsappInquireUrl = generateItemWhatsAppUrl(item, dealer, 'inquire');
  const whatsappPurchaseUrl = generateItemWhatsAppUrl(item, dealer, 'purchase');

  const handleCopyShare = () => {
    try {
      const shareUrl = `${window.location.origin}${window.location.pathname}?item=${encodeURIComponent(item.id)}`;
      navigator.clipboard?.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div 
        id="product-detail-modal"
        className="relative bg-[#fcfbf9] w-full max-w-5xl rounded-xl shadow-2xl border border-[#e2dacf] overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#f6f2eb] border-b border-[#e5ddd1] shrink-0">
          <div className="flex items-center space-x-2 text-xs text-[#78716c]">
            <span className="uppercase font-semibold tracking-wider text-[#92400e]">Ficha de Anticuario</span>
            <span>•</span>
            <span className="font-mono text-stone-600 font-semibold">{item.sku}</span>
            <span>•</span>
            <span className="hidden sm:inline text-stone-500">Catalogación Especializada</span>
          </div>

          <div className="flex items-center space-x-2">
            {onToggleHideItem && (
              <button
                type="button"
                onClick={() => onToggleHideItem(item.id)}
                className={`p-1.5 rounded-md transition-colors text-xs flex items-center space-x-1 cursor-pointer ${
                  item.isHidden || item.status === 'hidden'
                    ? 'text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300'
                    : 'text-stone-500 hover:text-stone-800 hover:bg-stone-200/60'
                }`}
                title={item.isHidden || item.status === 'hidden' ? 'Hacer visible en catálogo público' : 'Ocultar esta pieza del catálogo'}
              >
                {item.isHidden || item.status === 'hidden' ? (
                  <>
                    <EyeOff className="w-4 h-4 text-amber-800" />
                    <span className="hidden sm:inline font-bold">Oculto</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">Ocultar</span>
                  </>
                )}
              </button>
            )}
            {onDeleteItem && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-md transition-colors text-xs flex items-center space-x-1 cursor-pointer"
                title="Eliminar esta pieza del catálogo"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Eliminar Pieza</span>
              </button>
            )}
            <button
              onClick={handleCopyShare}
              className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 rounded-md transition-colors text-xs flex items-center space-x-1"
              title="Compartir ficha"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copiedLink ? '¡Copiado!' : 'Compartir'}</span>
            </button>
            <button
              onClick={onClose}
              id="close-detail-modal-btn"
              className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Banner de Producto Oculto (Si está oculto) */}
        {(item.isHidden || item.status === 'hidden') && (
          <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-amber-950 font-medium shrink-0">
            <div className="flex items-center space-x-2">
              <EyeOff className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Esta pieza está actualmente <strong>OCULTA del catálogo público</strong> (No visible para compradores ni búsquedas).</span>
            </div>
            {onToggleHideItem && (
              <button
                type="button"
                onClick={() => onToggleHideItem(item.id)}
                className="px-2.5 py-1 bg-amber-800 hover:bg-amber-900 text-white rounded text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Hacer Visible en Catálogo</span>
              </button>
            )}
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-8 flex-1">
          {/* Main Hero: Image Gallery & Buy/Negotiate Box */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Gallery Section */}
            <div className="lg:col-span-7 flex flex-col space-y-3">
              {/* Active Image */}
              <div className="relative aspect-4/3 sm:aspect-16/10 rounded-lg overflow-hidden bg-[#ece6dc] border border-[#ded5c7]">
                <img
                  src={item.images[selectedImageIndex] || item.images[0]}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain object-center"
                />
                
                {/* Certificate overlay pill */}
                {item.certificate.hasCertificate && (
                  <div className="absolute top-3 left-3 bg-[#fdfcf9]/95 backdrop-blur-xs border border-[#d4af37] text-[#92400e] px-3 py-1 rounded-sm text-xs font-serif font-semibold shadow-sm flex items-center space-x-1.5">
                    <Award className="w-4 h-4 text-[#b45309]" />
                    <span>Certificado de Autenticidad Válido</span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {item.images.length > 1 && (
                <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                  {item.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-20 h-16 rounded-md overflow-hidden shrink-0 border-2 transition-all ${
                        selectedImageIndex === idx
                          ? 'border-[#b45309] ring-2 ring-[#b45309]/30'
                          : 'border-[#ded5c7] opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Vista ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              <p className="text-[11px] text-stone-500 italic text-center sm:text-left">
                * Las fotografías son tomas periciales bajo iluminación neutra para documentar la pátina real y estado del objeto.
              </p>
            </div>

            {/* Price & Purchase / WhatsApp Block */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-[#fbf9f5] border border-[#e8dfd3] rounded-lg p-6">
              <div>
                <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="uppercase tracking-wider font-semibold text-[#8c7853]">
                      {item.category}
                    </span>
                    <span>•</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold border ${eraInfo.badgeClass}`}>
                      {eraInfo.label}
                    </span>
                  </div>
                  <span className="font-mono">REF: {item.sku}</span>
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1c1917] leading-tight mb-2">
                  {item.title}
                </h1>

                {/* Provenance Banner if set */}
                {item.provenance && (
                  <div className="mb-3">
                    <span className="inline-flex items-center space-x-1.5 text-xs font-serif text-amber-950 bg-amber-50/90 border border-amber-200 px-2.5 py-1 rounded shadow-2xs">
                      <Landmark className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                      <span><strong>Procedencia:</strong> {item.provenance}</span>
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2 text-sm text-stone-600 mb-4 pb-4 border-b border-[#e8dfd3]">
                  <span className="font-medium text-stone-900">{item.period}</span>
                  <span>•</span>
                  <span>{item.origin}</span>
                  {(item.location || dealer?.city) && (
                    <>
                      <span>•</span>
                      <span className="inline-flex items-center space-x-1 font-medium text-stone-800 bg-[#f3ede3] px-2 py-0.5 rounded text-xs">
                        <MapPin className="w-3.5 h-3.5 text-[#b45309]" />
                        <span>Ubicación de la pieza: {item.location || dealer?.city}</span>
                      </span>
                    </>
                  )}
                </div>

                {/* Price Display or Sold Banner */}
                {item.status === 'sold' || item.hidePrice ? (
                  <div className="mb-6 bg-stone-100 border border-stone-200 p-4 rounded-md">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 bg-stone-800 text-stone-100 rounded text-xs font-serif uppercase tracking-widest font-semibold">
                        Pieza Vendida
                      </span>
                      <span className="text-xs text-stone-600 font-medium">
                        Archivo Histórico de Colección
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                      Esta pieza histórica de alta jerarquía fue adjudicada y forma parte de un acervo o colección privada. Se exhibe en el catálogo como testimonio de procedencia y autenticidad pericial.
                    </p>
                  </div>
                ) : (
                  <div className="mb-6">
                    <span className="text-xs text-stone-500 uppercase tracking-wider block mb-1">
                      Precio Estimado de Lista
                    </span>
                    <div className="flex items-baseline space-x-3">
                      <span className="font-serif text-3xl sm:text-4xl font-bold text-[#1c1917]">
                        {formatCurrency(item.price, item.currency)}
                      </span>
                      <span className="text-xs text-stone-500 font-medium">
                        ({item.currency})
                      </span>
                    </div>
                    <span className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded inline-block mt-2 font-medium">
                      {item.status === 'available' ? '✓ Pieza disponible para entrega o retiro' : 'En proceso de negociación'}
                    </span>
                  </div>
                )}

                {/* Action CTAs */}
                <div className="space-y-2.5">
                  {item.status === 'sold' ? (
                    /* CTAs for sold items: Request similar pieces */
                    <div className="space-y-2">
                      <a
                        id="modal-whatsapp-similar-btn"
                        href={`https://wa.me/${dealer.whatsapp}?text=${encodeURIComponent(
                          `Hola ${dealer.name}! Vi en Articuarios la pieza del archivo histórico "${item.title}" (REF: ${item.sku}) que ya figura como vendida. Me gustaría consultarles si tienen disponible o pueden conseguir piezas similares o de la misma época/estilo para mi colección.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 px-4 bg-stone-900 hover:bg-emerald-700 text-white rounded-md text-sm font-medium transition-all flex items-center justify-center space-x-2 shadow-xs group cursor-pointer"
                      >
                        <Phone className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                        <span>Consultar por Piezas Similares a esta Obra</span>
                      </a>
                    </div>
                  ) : (
                    /* CTAs for active items */
                    <>
                      {/* Primary: Reservation with official Payoneer / USD Custody */}
                      {item.status === 'available' && onOpenReservation && (
                        <button
                          id="modal-reserve-deposit-btn"
                          type="button"
                          onClick={() => onOpenReservation(item)}
                          className="w-full py-3 px-4 bg-[#b45309] hover:bg-[#92400e] text-white rounded-md text-sm font-semibold transition-all flex items-center justify-center space-x-2 shadow-sm group cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-200" />
                          <span>Reservar Pieza (Seña del 10% en Custodia)</span>
                        </button>
                      )}

                      {/* WhatsApp Purchase / Direct Contact */}
                      <a
                        id="modal-whatsapp-acquire-btn"
                        href={whatsappPurchaseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 bg-stone-900 hover:bg-emerald-700 text-white rounded-md text-sm font-medium transition-all flex items-center justify-center space-x-2 shadow-xs group"
                      >
                        <Phone className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                        <span>Contactar Galería por WhatsApp</span>
                      </a>

                      {/* Negotiation CTA */}
                      <button
                        id="modal-negotiate-btn"
                        onClick={() => {
                          onClose();
                          onOpenNegotiation(item);
                        }}
                        className="w-full py-2.5 px-4 bg-white border border-[#ded5c7] hover:bg-[#faf6f0] text-stone-800 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <MessageSquareQuote className="w-4 h-4 text-amber-800" />
                        <span>Hacer Oferta / Negociar Precio</span>
                      </button>
                    </>
                  )}
                </div>

                {/* Secure Custody Badge (if active item) */}
                {item.status !== 'sold' && (
                  <div className="mt-4 pt-3 border-t border-[#eee5d8] text-[11px] text-stone-500 space-y-1">
                    <div className="flex items-center space-x-1.5 font-medium text-stone-700">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Custodia Articuarios Protegida (Payoneer Oficial • USDT • Wire USD)</span>
                    </div>
                    <p className="text-[10px] text-stone-400">
                      La seña congela la exclusividad por 72 hs. El 90% restante se liquida de forma privada con la galería al momento del retiro o inspección física.
                    </p>
                  </div>
                )}
              </div>

              {/* Mini Dealer Card */}
              <div className="mt-6 pt-4 border-t border-[#e8dfd3] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={dealer.avatar}
                    alt={dealer.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-[#d6cfc7]"
                  />
                  <div>
                    <h4 className="text-xs font-semibold text-stone-900">{dealer.name}</h4>
                    <p className="text-[11px] text-stone-500 flex items-center">
                      <MapPin className="w-3 h-3 mr-0.5 text-stone-400" />
                      {dealer.city}
                    </p>
                  </div>
                </div>

                <a
                  href={whatsappInquireUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-[#b45309] hover:underline"
                >
                  Consultar →
                </a>
              </div>
            </div>
          </div>

          {/* FICHA TÉCNICA DE ANTICUARIO */}
          <div className="bg-white border border-[#e5ddd1] rounded-lg p-6 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#eee7db] pb-3 mb-6">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-[#b45309]" />
                <h2 className="font-serif text-xl font-bold text-[#1c1917]">
                  {item.certificate?.hasCertificate
                    ? 'Ficha Técnica & Certificación Pericial'
                    : 'Ficha Técnica Especializada'}
                </h2>
              </div>
              {item.certificate?.hasCertificate && (
                <span className="text-xs font-mono bg-[#f4eee4] text-stone-700 px-2.5 py-1 rounded border border-[#ded5c7]">
                  Peritaje: Aprobado
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Procedencia */}
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider font-semibold text-stone-400 block">
                  Procedencia / Taller
                </span>
                <p className="text-sm font-medium text-stone-900">{item.origin}</p>
              </div>

              {/* Ubicación de la Pieza */}
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider font-semibold text-stone-400 block">
                  Ubicación Actual / Retiro
                </span>
                <p className="text-sm font-medium text-stone-900 flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-[#b45309] shrink-0" />
                  <span>{item.location || dealer?.city || 'Consultar con anticuario'}</span>
                </p>
              </div>

              {/* Época / Período */}
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider font-semibold text-stone-400 block">
                  Época / Período Exacto
                </span>
                <p className="text-sm font-medium text-stone-900">{item.period}</p>
              </div>

              {/* Estilo / Movimiento */}
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider font-semibold text-stone-400 block">
                  Estilo / Movimiento
                </span>
                <p className="text-sm font-medium text-stone-900">{item.style}</p>
              </div>

              {/* Dimensiones */}
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider font-semibold text-stone-400 block">
                  Dimensiones Físicas
                </span>
                <p className="text-sm font-medium text-stone-900">
                  {item.dimensions.height} cm (Alto) × {item.dimensions.width} cm (Ancho) × {item.dimensions.depth} cm (Prof.)
                </p>
                {item.dimensions.weight && (
                  <p className="text-xs text-stone-500 font-mono">Peso: {item.dimensions.weight}</p>
                )}
              </div>

              {/* Materiales */}
              <div className="space-y-1 md:col-span-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-stone-400 block">
                  Materiales & Técnicas
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {item.materials.map((mat, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-[#f5efe6] text-stone-800 text-xs rounded border border-[#e2d9cd]"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Procedencia / Colección de Origen */}
              {item.provenance && (
                <div className="space-y-1 md:col-span-2 bg-[#fdfaf5] p-3.5 rounded border border-[#dfd6c7]">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-900 block flex items-center space-x-1.5">
                    <Landmark className="w-3.5 h-3.5 text-amber-700" />
                    <span>Colección de Pertenencia / Procedencia</span>
                  </span>
                  <p className="text-sm font-serif font-bold text-stone-900 mt-0.5">
                    {item.provenance}
                  </p>
                </div>
              )}
            </div>

            {/* Estado de Conservación */}
            <div className="mt-6 pt-6 border-t border-[#eee7db]">
              <span className="text-xs uppercase tracking-wider font-semibold text-stone-400 block mb-1">
                Estado de Conservación
              </span>
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-serif font-semibold text-stone-900 text-base">
                  {item.condition}
                </span>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed bg-[#faf8f4] p-3.5 rounded border border-[#eae2d5]">
                {item.conditionDetails}
              </p>
            </div>

            {/* Certificado de Autenticidad (Solo visible si la pieza cuenta con certificación emitida) */}
            {item.certificate?.hasCertificate && (
              <div className="mt-6 pt-6 border-t border-[#eee7db]">
                <span className="text-xs uppercase tracking-wider font-semibold text-stone-400 block mb-2">
                  Certificación & Garantía de Autenticidad
                </span>
                <div className="bg-[#fcfaf5] border border-[#d4af37]/60 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#f6edd9] border border-[#d4af37] flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5 text-[#b45309]" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-stone-900 text-sm">
                        Certificado Oficial Emitido
                      </h4>
                      <p className="text-xs text-stone-600 mt-0.5">
                        <strong>Emisor:</strong> {item.certificate.issuer}
                      </p>
                      {item.certificate.appraiserName && (
                        <p className="text-xs text-stone-600">
                          <strong>Perito Tasador:</strong> {item.certificate.appraiserName}
                        </p>
                      )}
                      {item.certificate.certificateNumber && (
                        <p className="text-xs font-mono text-stone-500 mt-0.5">
                          Nº de Registro: {item.certificate.certificateNumber} {item.certificate.yearCertified ? `(${item.certificate.yearCertified})` : ''}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-medium text-emerald-800 bg-emerald-100/70 border border-emerald-300 px-3 py-1 rounded text-center shrink-0">
                    Garantía Vitalicia de Autenticidad
                  </span>
                </div>
              </div>
            )}

            {/* Descripción Histórica */}
            <div className="mt-6 pt-6 border-t border-[#eee7db]">
              <span className="text-xs uppercase tracking-wider font-semibold text-stone-400 block mb-2">
                Reseña Histórica & Descripción de la Pieza
              </span>
              <p className="text-sm text-stone-700 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Servicios & Logística Mano a Mano */}
            <div className="mt-6 p-4 bg-[#faf8f5] border border-[#e8e2d8] rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Truck className="w-4 h-4 text-amber-800" />
                </div>
                <div>
                  <h5 className="font-semibold text-stone-900">Logística, Flete Especial y Puesta en Valor</h5>
                  <p className="text-stone-600 text-[11px] mt-0.5">
                    Coordinación personalizada mano a mano con embalaje a medida para resguardo de salientes, mármoles y maderas nobles.
                  </p>
                </div>
              </div>
              <a
                href={`https://wa.me/${dealer.whatsapp}?text=${encodeURIComponent(`Hola, quisiera consultar sobre la coordinación del flete y traslado especializado para la pieza ${item.title} (${item.sku}).`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-3 py-1.5 bg-white border border-[#ded6c9] hover:bg-stone-100 text-stone-800 font-semibold rounded text-[11px] flex items-center space-x-1"
              >
                <Phone className="w-3 h-3 text-emerald-700" />
                <span>Consultar Flete por WhatsApp</span>
              </a>
            </div>
          </div>

          {/* DEALER FULL PROFILE & MORE PIECES CTA */}
          <div className="bg-[#f6f2eb] border border-[#e0d6c7] rounded-lg p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <img
                  src={dealer.avatar}
                  alt={dealer.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xs"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-serif font-bold text-lg text-stone-900">{dealer.name}</h3>
                    <span className="px-2 py-0.5 bg-[#ede4d5] text-[#92400e] text-[10px] font-semibold uppercase rounded">
                      Anticuario Verificado
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5">{dealer.tagline}</p>
                  <p className="text-xs text-stone-500 flex items-center mt-1">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-[#b45309]" />
                    {dealer.address}, {dealer.city} • Fundado en {dealer.foundedYear}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    onClose();
                    onFilterByDealer(dealer.id);
                  }}
                  className="flex-1 sm:flex-initial py-2 px-3.5 bg-white border border-[#d4c9b9] hover:bg-stone-50 text-xs font-semibold text-stone-800 rounded transition-colors"
                >
                  Ver Catálogo de esta Galería
                </button>
                {dealer.instagram && (
                  <a
                    href={`https://instagram.com/${dealer.instagram.replace(/^@/, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial py-2 px-3.5 bg-white border border-[#ded6c9] hover:bg-pink-50 hover:border-pink-200 text-stone-800 text-xs font-semibold rounded transition-colors flex items-center justify-center space-x-1"
                    title={`Ver Instagram de ${dealer.name}`}
                  >
                    <Instagram className="w-3.5 h-3.5 text-pink-700" />
                    <span>@{dealer.instagram.replace(/^@/, '')}</span>
                  </a>
                )}
                <a
                  href={`https://wa.me/${dealer.whatsapp}?text=${encodeURIComponent(`Hola ${dealer.name}, quisiera coordinar una visita a su showroom.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial py-2 px-3.5 bg-[#1f2937] hover:bg-emerald-700 text-white text-xs font-semibold rounded transition-colors flex items-center justify-center space-x-1"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp Galería</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-[#f6f2eb] border-t border-[#e5ddd1] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-stone-500 text-center sm:text-left">
            <span>Ref: {item.sku} • Consulta directa con {dealer.name}</span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onOpenNegotiation(item);
              }}
              className="flex-1 sm:flex-initial py-2 px-4 border border-[#b45309] text-[#b45309] hover:bg-[#faefe2] text-xs font-semibold rounded transition-colors"
            >
              Hacer Oferta
            </button>
            <a
              href={whatsappPurchaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial py-2 px-5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
            >
              <Phone className="w-4 h-4" />
              <span>Consultar en WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Delete Item Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-fadeIn">
            <div className="flex items-start space-x-3">
              <div className="p-2.5 bg-rose-100 text-rose-700 rounded-full shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-stone-900 font-serif">
                  ¿Eliminar esta pieza del catálogo?
                </h3>
                <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                  Se eliminará definitivamente la pieza <strong>"{item.title}"</strong> (SKU: {item.sku}). Esta acción no se puede deshacer.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-stone-300 text-stone-700 rounded-md text-xs font-semibold hover:bg-stone-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  onClose();
                  if (onDeleteItem) {
                    onDeleteItem(item.id);
                  }
                }}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-md text-xs font-semibold transition-colors flex items-center space-x-1.5 shadow-xs"
              >
                <Trash2 className="w-4 h-4" />
                <span>Sí, Eliminar Pieza</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
