export type CategoryType =
  | 'Muebles'
  | 'Relojería'
  | 'Platería y Orfebrería'
  | 'Arte y Pintura'
  | 'Iluminación'
  | 'Cerámica y Porcelana'
  | 'Esculturas y Bronces'
  | 'Objetos de Colección';

export type ItemStatus = 'available' | 'in_negotiation' | 'reserved' | 'sold';

export type ConservationState =
  | 'Excelente (sin restauraciones)'
  | 'Muy bueno (pátina original de época)'
  | 'Bueno (con leves marcas de uso histórico)'
  | 'Restauración histórica documentada';

export interface AntiqueDimensions {
  height: number;
  width: number;
  depth: number;
  unit: string;
  weight?: string;
}

export interface CertificateInfo {
  hasCertificate: boolean;
  issuer?: string;
  certificateNumber?: string;
  yearCertified?: string;
  appraiserName?: string;
}

export interface AntiqueItem {
  id: string;
  sku: string;
  title: string;
  category: CategoryType;
  price: number;
  currency: 'USD' | 'EUR';
  period: string;
  origin: string;
  style: string;
  materials: string[];
  dimensions: AntiqueDimensions;
  condition: ConservationState;
  conditionDetails: string;
  certificate: CertificateInfo;
  description: string;
  images: string[];
  status: ItemStatus;
  dealerId: string;
  featured?: boolean;
  createdAt: string;
}

export interface Dealer {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  city: string;
  address: string;
  phone: string;
  whatsapp: string; // digits only e.g. "5491155551234"
  avatar: string;
  banner: string;
  foundedYear: number;
  specialties: string[];
  verified: boolean;
  accessPin?: string; // Secret PIN or password for private access
  email?: string;
}

export interface NegotiationMessage {
  id: string;
  sender: 'buyer' | 'dealer';
  senderName: string;
  message: string;
  amount?: number;
  timestamp: string;
}

export interface NegotiationOffer {
  id: string;
  itemId: string;
  itemTitle: string;
  itemSku: string;
  itemImage: string;
  originalPrice: number;
  currency: 'USD' | 'EUR';
  dealerId: string;
  buyerName: string;
  buyerPhone: string;
  offeredPrice: number;
  counterOfferPrice?: number;
  status: 'pending' | 'countered' | 'accepted' | 'declined';
  messages: NegotiationMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface CatalogFilterState {
  searchTerm: string;
  category: string;
  period: string;
  style: string;
  dealerId: string;
  condition: string;
  onlyCertified: boolean;
  onlyAvailable: boolean;
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: 'price_asc' | 'price_desc' | 'newest' | 'period';
}
