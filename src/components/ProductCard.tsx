import React, { useState } from 'react';
import { Award, MessageSquareQuote, Phone, Heart, ArrowUpRight, MapPin, Layers } from 'lucide-react';
import { AntiqueItem, Dealer } from '../types';
import { formatCurrency, generateItemWhatsAppUrl } from '../utils/whatsapp';

interface ProductCardProps {
  item: AntiqueItem;
  dealer: Dealer;
  onViewDetails: (item: AntiqueItem) => void;
  onOpenNegotiation: (item: AntiqueItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  item,
  dealer,
  onViewDetails,
  onOpenNegotiation,
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const whatsappInquireUrl = generateItemWhatsAppUrl(item, dealer, 'inquire');

  const statusLabels: Record<string, { label: string; class: string }> = {
    available: { label: '', class: '' },
    in_negotiation: { label: 'En Negociación', class: 'bg-amber-100/90 text-amber-900 border-amber-200' },
    reserved: { label: 'Reservado', class: 'bg-stone-100/90 text-stone-700 border-stone-300' },
    sold: { label: 'Vendido', class: 'bg-stone-200/90 text-stone-600 border-stone-300' },
  };

  const statusConfig = statusLabels[item.status] || statusLabels.available;

  return (
    <div 
      id={`product-card-${item.id}`}
      className="group bg-white border border-[#eae5dd] hover:border-stone-400 rounded-sm overflow-hidden flex flex-col transition-all duration-200 hover:shadow-lg"
    >
      {/* Image container: clean, photography-forward (1stdibs style) */}
      <div 
        className="relative aspect-4/3 w-full bg-[#f8f6f2] overflow-hidden cursor-pointer"
        onClick={() => onViewDetails(item)}
      >
        <img
          src={item.images[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'}
          alt={item.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Top-right: Wishlist Heart (1stdibs signature icon) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsSaved(!isSaved);
          }}
          aria-label="Guardar pieza en favoritos"
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-700 flex items-center justify-center shadow-xs transition-all hover:scale-110 z-10"
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${
              isSaved ? 'fill-rose-500 text-rose-500' : 'text-stone-600'
            }`} 
          />
        </button>
        
        {/* Status Badge (only if not available) */}
        {statusConfig.label && (
          <div className="absolute top-2.5 left-2.5">
            <span className={`px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded border backdrop-blur-xs ${statusConfig.class}`}>
              {statusConfig.label}
            </span>
          </div>
        )}

        {/* Certificate Badge: minimal, discreet */}
        {item.certificate.hasCertificate && !statusConfig.label && (
          <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs border border-amber-300 text-amber-900 px-2 py-0.5 rounded text-[10px] font-medium flex items-center space-x-1 shadow-2xs">
            <Award className="w-3 h-3 text-amber-600" />
            <span className="font-serif">Certificado</span>
          </div>
        )}

        {/* Photo count indicator if multiple photos exist */}
        {item.images && item.images.length > 1 && (
          <div className="absolute bottom-2.5 right-2.5 bg-black/65 backdrop-blur-xs text-stone-100 px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center space-x-1 group-hover:opacity-0 transition-opacity pointer-events-none shadow-xs">
            <Layers className="w-3 h-3 text-amber-400" />
            <span>{item.images.length} fotos</span>
          </div>
        )}

        {/* Quick action bar on hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between gap-2">
          <span className="text-white text-xs font-medium flex items-center space-x-1 drop-shadow-xs">
            <span>Ficha Técnica</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
          <span className="text-[11px] text-stone-200 uppercase tracking-widest font-mono">
            {dealer.name}
          </span>
        </div>
      </div>

      {/* Content: Clean, uncluttered typography */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Subtle Period & Origin label */}
          <div className="text-[11px] uppercase tracking-wider text-stone-400 font-medium truncate">
            {item.period} • {item.origin}
          </div>

          {/* Title in elegant serif */}
          <h3 
            onClick={() => onViewDetails(item)}
            className="font-serif text-base sm:text-lg font-medium text-stone-900 leading-snug mt-1 line-clamp-2 hover:text-amber-800 transition-colors cursor-pointer"
            title={item.title}
          >
            {item.title}
          </h3>

          {/* Dealer and location info */}
          <div className="flex items-center justify-between text-xs text-stone-500 mt-1.5 gap-2">
            <span className="truncate">{dealer.name}</span>
            {(item.location || dealer.city) && (
              <span className="inline-flex items-center space-x-1 text-[11px] text-stone-600 bg-stone-100/90 px-1.5 py-0.5 rounded shrink-0 font-medium">
                <MapPin className="w-3 h-3 text-[#b45309]" />
                <span className="truncate max-w-[120px]">{item.location || dealer.city.split(',')[0]}</span>
              </span>
            )}
          </div>
        </div>

        {/* Price & Primary Action */}
        <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="font-serif text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
              {formatCurrency(item.price, item.currency)}
            </span>
          </div>

          {/* Clean minimal action buttons */}
          <div className="flex items-center space-x-1.5">
            <button
              id={`card-negotiate-btn-${item.id}`}
              onClick={() => onOpenNegotiation(item)}
              title="Mesa de oferta"
              className="p-2 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded transition-colors"
            >
              <MessageSquareQuote className="w-4 h-4" />
            </button>

            <a
              id={`card-whatsapp-btn-${item.id}`}
              href={whatsappInquireUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Consultar por WhatsApp"
              className="px-2.5 py-1.5 bg-[#1f2937] hover:bg-emerald-700 text-white rounded text-xs font-medium transition-colors flex items-center space-x-1 shadow-2xs"
            >
              <Phone className="w-3 h-3 text-emerald-300" />
              <span>Consultar</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
