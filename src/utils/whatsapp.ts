import { AntiqueItem, Dealer, NegotiationOffer } from '../types';

/**
 * Clean phone number for WhatsApp link (digits only, strip +, spaces, hyphens)
 */
export function sanitizeWhatsAppNumber(phone: string): string {
  return phone.replace(/[^\d]/g, '');
}

/**
 * Format currency with elegant styling
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Generates direct WhatsApp chat URL for item inquiry or purchase
 */
export function generateItemWhatsAppUrl(item: AntiqueItem, dealer: Dealer, actionType: 'inquire' | 'purchase' = 'inquire'): string {
  const cleanPhone = sanitizeWhatsAppNumber(dealer.whatsapp || dealer.phone);
  
  let text = '';
  if (item.status === 'sold') {
    text = `Hola ${dealer.name}, le consulto sobre la pieza del archivo histórico en Articuarios:\n\n` +
      `🏛️ *${item.title}*\n` +
      `🔖 *Ref/SKU:* ${item.sku}\n` +
      `📅 *Época:* ${item.period}\n` +
      (item.provenance ? `🏛️ *Procedencia:* ${item.provenance}\n` : '') +
      `\nVeo que la pieza ya fue transferida a colección privada. ¿Disponen o podrían conseguir piezas similares de esta época o estilo para mi colección?`;
  } else if (actionType === 'purchase') {
    text = `Hola ${dealer.name}, deseo adquirir la siguiente pieza de su catálogo:\n\n` +
      `🏛️ *${item.title}*\n` +
      `🔖 *Ref/SKU:* ${item.sku}\n` +
      `📅 *Época:* ${item.period}\n` +
      `💰 *Valor de lista:* ${formatCurrency(item.price, item.currency)}\n\n` +
      `¿Sigue disponible para coordinar la forma de entrega y formalizar el cierre? Gracias.`;
  } else {
    text = `Hola ${dealer.name}, le consulto sobre la pieza de su catálogo:\n\n` +
      `🏛️ *${item.title}*\n` +
      `🔖 *Ref/SKU:* ${item.sku}\n` +
      `📅 *Época:* ${item.period}\n` +
      `📍 *Procedencia:* ${item.origin}\n` +
      (item.provenance ? `🏛️ *Colección:* ${item.provenance}\n` : '') +
      `💰 *Precio:* ${formatCurrency(item.price, item.currency)}\n\n` +
      `¿Podría brindarme más detalles sobre el estado de conservación o coordinar una visita al showroom?`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Generates WhatsApp URL for closing a price negotiation
 */
export function generateNegotiationWhatsAppUrl(offer: NegotiationOffer, dealer: Dealer): string {
  const cleanPhone = sanitizeWhatsAppNumber(dealer.whatsapp || dealer.phone);
  const finalPrice = offer.status === 'accepted' 
    ? (offer.counterOfferPrice || offer.offeredPrice) 
    : offer.offeredPrice;

  const text = `Hola ${dealer.name}, escribo desde la plataforma de anticuarios por la negociación de la pieza:\n\n` +
    `🏛️ *${offer.itemTitle}*\n` +
    `🔖 *Ref:* ${offer.itemSku}\n` +
    `🤝 *Precio pactado / acordado:* ${formatCurrency(finalPrice, offer.currency)}\n` +
    `👤 *Comprador:* ${offer.buyerName} (Tel: ${offer.buyerPhone})\n\n` +
    `Deseo proceder con el cierre de la compra por el valor pactado. ¿Cómo coordinamos el retiro o envío?`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Generates WhatsApp URL from Dealer to Buyer when replying
 */
export function generateDealerToBuyerWhatsAppUrl(offer: NegotiationOffer): string {
  const cleanPhone = sanitizeWhatsAppNumber(offer.buyerPhone);
  const text = `Hola ${offer.buyerName}, le contacto desde el anticuario sobre su oferta para la pieza *${offer.itemTitle}* (Ref: ${offer.itemSku}).`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
