import React from 'react';
import { Award, MessageSquareQuote, Phone, MapPin, Eye } from 'lucide-react';
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
  const whatsappInquireUrl = generateItemWhatsAppUrl(item, dealer, 'inquire');

  const statusLabels: Record<string, { label: string; class: string }> = {
    available: { label: 'Disponible', class: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    in_negotiation: { label: 'En Negociación', class: 'bg-amber-50 text-amber-800 border-amber-200' },
    reserved: { label: 'Reservado', class: 'bg-stone-100 text-stone-700 border-stone-300' },
    sold: { label: 'Vendido', class: 'bg-red-50 text-red-800 border-red-200' },
  };

  const statusConfig = statusLabels[item.status] || statusLabels.available;

  return (
    <div 
      id={`product-card-${item.id}`}
      className="group bg-white border border-[#e7e2d9] rounded-lg overflow-hidden flex flex-col transition-all duration-200 hover:shadow-md hover:border-[#cbbfad]"
    >
      {/* Image container */}
      <div 
        className="relative aspect-4/3 w-full bg-[#f4efe8] overflow-hidden cursor-pointer"
        onClick={() => onViewDetails(item)}
      >
        <img
          src={item.images[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'}
          alt={item.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3 flex flex-col space-y-1">
          <span className={`px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase rounded-sm border backdrop-blur-xs ${statusConfig.class}`}>
            {statusConfig.label}
          </span>
        </div>

        {/* Certificate Badge */}
        {item.certificate.hasCertificate && (
          <div className="absolute top-3 right-3 bg-[#fbf8f2]/95 backdrop-blur-xs border border-[#d4af37]/60 text-[#92400e] px-2 py-1 rounded-sm text-[11px] font-medium flex items-center space-x-1 shadow-2xs">
            <Award className="w-3.5 h-3.5 text-[#b45309]" />
            <span className="hidden sm:inline font-serif tracking-tight">Certificado</span>
          </div>
        )}

        {/* Quick View Hover overlay */}
        <div className="absolute inset-0 bg-[#1c1917]/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 text-[#1c1917] text-xs font-medium px-3.5 py-1.5 rounded-full shadow-sm flex items-center space-x-1.5 backdrop-blur-xs">
            <Eye className="w-3.5 h-3.5 text-[#b45309]" />
            <span>Ver Ficha Técnica</span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Row: Category & Period */}
          <div className="flex items-center justify-between text-xs text-[#78716c] mb-1.5">
            <span className="uppercase tracking-wider font-semibold text-[#8c7853] text-[11px]">
              {item.category}
            </span>
            <span className="text-[11px] font-mono text-stone-500">
              Ref: {item.sku}
            </span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onViewDetails(item)}
            className="font-serif text-lg sm:text-xl font-semibold text-[#1c1917] leading-snug line-clamp-2 hover:text-[#b45309] transition-colors cursor-pointer"
          >
            {item.title}
          </h3>

          {/* Period & Origin */}
          <p className="text-xs text-[#57534e] mt-2 flex items-center space-x-2">
            <span className="font-medium text-[#292524]">{item.period}</span>
            <span className="text-stone-300">•</span>
            <span>{item.origin}</span>
          </p>

          {/* Dimensions preview */}
          <p className="text-[11px] text-[#78716c] mt-1 font-mono">
            {item.dimensions.height} × {item.dimensions.width} × {item.dimensions.depth} {item.dimensions.unit}
          </p>

          {/* Dealer information */}
          <div className="mt-3 pt-2.5 border-t border-[#f0eae0] flex items-center justify-between text-xs text-[#57534e]">
            <div className="flex items-center space-x-1.5 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-[#b45309]"></span>
              <span className="font-medium text-[#292524] truncate">{dealer.name}</span>
            </div>
            <div className="flex items-center text-stone-400 text-[11px] shrink-0 ml-1">
              <MapPin className="w-3 h-3 mr-0.5" />
              <span>{dealer.city.split(',')[0]}</span>
            </div>
          </div>
        </div>

        {/* Price & Actions */}
        <div className="mt-4 pt-3 border-t border-[#f0eae0]">
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-xs text-[#78716c] uppercase tracking-wider font-medium">
              Valoración
            </span>
            <span className="font-serif text-xl sm:text-2xl font-bold text-[#1c1917] tracking-tight">
              {formatCurrency(item.price, item.currency)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              id={`card-negotiate-btn-${item.id}`}
              onClick={() => onOpenNegotiation(item)}
              className="w-full py-2 px-2 border border-[#d6cfc7] hover:border-[#b45309] hover:bg-[#faf6f0] text-[#44403c] hover:text-[#b45309] rounded text-xs font-medium transition-colors flex items-center justify-center space-x-1"
            >
              <MessageSquareQuote className="w-3.5 h-3.5" />
              <span>Negociar</span>
            </button>

            <a
              id={`card-whatsapp-btn-${item.id}`}
              href={whatsappInquireUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-2 bg-[#1f2937] hover:bg-emerald-700 text-white rounded text-xs font-medium transition-colors flex items-center justify-center space-x-1 shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Consultar</span>
            </a>
          </div>

          <button
            onClick={() => onViewDetails(item)}
            className="w-full mt-2 text-center text-xs text-[#78716c] hover:text-[#1c1917] font-medium py-1 transition-colors"
          >
            Ver Ficha Completa & Medidas →
          </button>
        </div>
      </div>
    </div>
  );
};
