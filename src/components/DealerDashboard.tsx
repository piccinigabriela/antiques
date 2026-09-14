import React, { useState, useEffect } from 'react';
import { 
  Package, 
  MessageSquareQuote, 
  Settings, 
  PlusCircle, 
  Phone, 
  CheckCircle, 
  Edit3, 
  Trash2, 
  Eye, 
  DollarSign, 
  AlertCircle,
  Building2,
  Send,
  ExternalLink,
  Upload,
  Image as ImageIcon,
  Lock
} from 'lucide-react';
import { AntiqueItem, Dealer, NegotiationOffer, NegotiationMessage } from '../types';
import { formatCurrency, generateDealerToBuyerWhatsAppUrl } from '../utils/whatsapp';

const PRESET_BANNERS = [
  { label: 'Mansión Señorial / Fachada Neoclásica', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Salón de Té & Boiserie Francesa', url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Biblioteca Histórica & Mobiliario Inglés', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Galería de Cuadros y Estatuaria Clásica', url: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=1200&auto=format&fit=crop&q=80' },
];

interface DealerDashboardProps {
  dealers: Dealer[];
  activeDealer: Dealer;
  onSelectDealer: (dealer: Dealer) => void;
  items: AntiqueItem[];
  offers: NegotiationOffer[];
  onOpenNewItemModal: () => void;
  onEditItem: (item: AntiqueItem) => void;
  onDeleteItem: (itemId: string) => void;
  onChangeItemStatus: (itemId: string, status: AntiqueItem['status']) => void;
  onViewItemDetails: (item: AntiqueItem) => void;
  onUpdateOffer: (offer: NegotiationOffer) => void;
  onUpdateDealer: (dealer: Dealer) => void;
  authenticatedDealer?: Dealer | null;
  onLogout?: () => void;
  onOpenLoginModal?: () => void;
}

export const DealerDashboard: React.FC<DealerDashboardProps> = ({
  dealers,
  activeDealer,
  onSelectDealer,
  items,
  offers,
  onOpenNewItemModal,
  onEditItem,
  onDeleteItem,
  onChangeItemStatus,
  onViewItemDetails,
  onUpdateOffer,
  onUpdateDealer,
  authenticatedDealer,
  onLogout,
  onOpenLoginModal,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'offers' | 'profile'>('inventory');
  const [inventorySearch, setInventorySearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Negotiation reply state
  const [activeReplyOfferId, setActiveReplyOfferId] = useState<string | null>(null);
  const [counterPrice, setCounterPrice] = useState<number>(0);
  const [counterMessage, setCounterMessage] = useState<string>('');

  // Dealer Profile Edit state
  const [dealerName, setDealerName] = useState(activeDealer.name);
  const [dealerWhatsapp, setDealerWhatsapp] = useState(activeDealer.whatsapp);
  const [dealerAddress, setDealerAddress] = useState(activeDealer.address);
  const [dealerCity, setDealerCity] = useState(activeDealer.city);
  const [dealerTagline, setDealerTagline] = useState(activeDealer.tagline);
  const [dealerBanner, setDealerBanner] = useState(activeDealer.banner);
  const [dealerAvatar, setDealerAvatar] = useState(activeDealer.avatar);
  const [dealerPin, setDealerPin] = useState(activeDealer.accessPin || '1234');
  const [dealerEmail, setDealerEmail] = useState(activeDealer.email || '');
  const [profileSavedNotice, setProfileSavedNotice] = useState(false);

  useEffect(() => {
    setDealerName(activeDealer.name);
    setDealerWhatsapp(activeDealer.whatsapp);
    setDealerAddress(activeDealer.address);
    setDealerCity(activeDealer.city);
    setDealerTagline(activeDealer.tagline);
    setDealerBanner(activeDealer.banner);
    setDealerAvatar(activeDealer.avatar);
    setDealerPin(activeDealer.accessPin || '1234');
    setDealerEmail(activeDealer.email || '');
  }, [activeDealer]);

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setDealerBanner(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setDealerAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Filter items for this dealer
  const dealerItems = items.filter((it) => it.dealerId === activeDealer.id);
  const filteredItems = dealerItems.filter((it) => {
    const matchesSearch =
      it.title.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      it.sku.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      it.period.toLowerCase().includes(inventorySearch.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : it.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter offers for this dealer's items
  const dealerOffers = offers.filter((o) => o.dealerId === activeDealer.id);
  const pendingOffersCount = dealerOffers.filter((o) => o.status === 'pending' || o.status === 'countered').length;

  // Inventory value calculations
  const totalInventoryValue = dealerItems.reduce((acc, it) => acc + it.price, 0);
  const inNegotiationCount = dealerItems.filter((it) => it.status === 'in_negotiation').length;

  const handleAcceptOffer = (offer: NegotiationOffer) => {
    const acceptMsg: NegotiationMessage = {
      id: `msg-${Date.now()}`,
      sender: 'dealer',
      senderName: activeDealer.name,
      message: `Oferta aceptada por el valor de ${formatCurrency(offer.offeredPrice, offer.currency)}. Por favor presione el botón para coordinar por WhatsApp el pago y retiro.`,
      amount: offer.offeredPrice,
      timestamp: new Date().toISOString(),
    };

    const updated: NegotiationOffer = {
      ...offer,
      status: 'accepted',
      messages: [...offer.messages, acceptMsg],
      updatedAt: new Date().toISOString(),
    };

    onUpdateOffer(updated);
    onChangeItemStatus(offer.itemId, 'in_negotiation');
  };

  const handleDeclineOffer = (offer: NegotiationOffer) => {
    const declineMsg: NegotiationMessage = {
      id: `msg-${Date.now()}`,
      sender: 'dealer',
      senderName: activeDealer.name,
      message: `Lamentablemente no podemos aceptar la propuesta en este momento por encontrarse por debajo del valor pericial de la pieza. Muchas gracias por su interés.`,
      timestamp: new Date().toISOString(),
    };

    const updated: NegotiationOffer = {
      ...offer,
      status: 'declined',
      messages: [...offer.messages, declineMsg],
      updatedAt: new Date().toISOString(),
    };

    onUpdateOffer(updated);
  };

  const handleSendCounterOffer = (offer: NegotiationOffer) => {
    if (!counterPrice) return;

    const counterMsg: NegotiationMessage = {
      id: `msg-${Date.now()}`,
      sender: 'dealer',
      senderName: activeDealer.name,
      message: counterMessage || `Le proponemos una contraoferta formal de ${formatCurrency(counterPrice, offer.currency)} para concretar la operación.`,
      amount: counterPrice,
      timestamp: new Date().toISOString(),
    };

    const updated: NegotiationOffer = {
      ...offer,
      status: 'countered',
      counterOfferPrice: counterPrice,
      messages: [...offer.messages, counterMsg],
      updatedAt: new Date().toISOString(),
    };

    onUpdateOffer(updated);
    setActiveReplyOfferId(null);
    setCounterPrice(0);
    setCounterMessage('');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Dealer = {
      ...activeDealer,
      name: dealerName,
      whatsapp: dealerWhatsapp,
      address: dealerAddress,
      city: dealerCity,
      tagline: dealerTagline,
      banner: dealerBanner,
      avatar: dealerAvatar,
      accessPin: dealerPin.trim() || '1234',
      email: dealerEmail.trim(),
    };
    onUpdateDealer(updated);
    setProfileSavedNotice(true);
    setTimeout(() => setProfileSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Dealer Switcher & Header Bar */}
      <div className="bg-[#1c1917] text-[#fcfbf9] rounded-xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img
              src={activeDealer.avatar}
              alt={activeDealer.name}
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-full object-cover border-2 border-amber-500/60 shadow-xs"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
                  {activeDealer.name}
                </h1>
                <span className="text-[10px] font-semibold uppercase bg-amber-900/50 text-amber-200 border border-amber-700/50 px-2 py-0.5 rounded">
                  Panel de Gestión
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                {activeDealer.address}, {activeDealer.city} • WhatsApp: +{activeDealer.whatsapp}
              </p>
            </div>
          </div>

          {/* Switch dealer dropdown or Authenticated session info */}
          <div className="flex items-center space-x-3 self-start md:self-auto bg-stone-900/90 p-2.5 rounded-lg border border-stone-800">
            {authenticatedDealer ? (
              <div className="flex items-center space-x-3">
                <div className="flex flex-col text-right">
                  <span className="text-[10px] uppercase font-bold text-amber-400">
                    Autenticado con PIN
                  </span>
                  <span className="text-xs font-semibold text-white">
                    {authenticatedDealer.name}
                  </span>
                </div>
                {onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs rounded border border-stone-700 transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                )}
              </div>
            ) : (
              <>
                <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs text-stone-300 hidden sm:inline">Cambiar de Anticuario:</span>
                <select
                  id="dealer-switcher-select"
                  value={activeDealer.id}
                  onChange={(e) => {
                    const found = dealers.find((d) => d.id === e.target.value);
                    if (found) {
                      onSelectDealer(found);
                      setDealerName(found.name);
                      setDealerWhatsapp(found.whatsapp);
                      setDealerAddress(found.address);
                      setDealerCity(found.city);
                      setDealerTagline(found.tagline);
                    }
                  }}
                  className="bg-stone-800 text-stone-100 text-xs py-1.5 px-2.5 rounded border border-stone-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {dealers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.city.split(',')[0]})
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-stone-800 text-xs">
          <div className="bg-stone-900/60 p-3 rounded-lg border border-stone-800">
            <span className="text-stone-400 block mb-1">Piezas en Catálogo</span>
            <span className="font-serif text-2xl font-bold text-white">
              {dealerItems.length}
            </span>
          </div>

          <div className="bg-stone-900/60 p-3 rounded-lg border border-stone-800">
            <span className="text-stone-400 block mb-1">Valoración Total</span>
            <span className="font-serif text-2xl font-bold text-amber-300">
              {formatCurrency(totalInventoryValue, 'USD')}
            </span>
          </div>

          <div className="bg-stone-900/60 p-3 rounded-lg border border-stone-800">
            <span className="text-stone-400 block mb-1">En Negociación</span>
            <span className="font-serif text-2xl font-bold text-stone-200">
              {inNegotiationCount}
            </span>
          </div>

          <div className="bg-stone-900/60 p-3 rounded-lg border border-stone-800">
            <span className="text-stone-400 block mb-1">Ofertas de Clientes</span>
            <div className="flex items-center space-x-2">
              <span className="font-serif text-2xl font-bold text-emerald-400">
                {dealerOffers.length}
              </span>
              {pendingOffersCount > 0 && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded">
                  {pendingOffersCount} activas
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#e5ddd1] pb-px">
        <button
          id="tab-inventory-btn"
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors flex items-center space-x-2 ${
            activeTab === 'inventory'
              ? 'bg-white text-[#1c1917] border-t-2 border-t-[#b45309] border-x border-[#e5ddd1] shadow-2xs'
              : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100/60'
          }`}
        >
          <Package className="w-4 h-4 text-[#b45309]" />
          <span>Gestión de Inventario ({dealerItems.length})</span>
        </button>

        <button
          id="tab-offers-btn"
          onClick={() => setActiveTab('offers')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors flex items-center space-x-2 relative ${
            activeTab === 'offers'
              ? 'bg-white text-[#1c1917] border-t-2 border-t-[#b45309] border-x border-[#e5ddd1] shadow-2xs'
              : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100/60'
          }`}
        >
          <MessageSquareQuote className="w-4 h-4 text-[#b45309]" />
          <span>Bandeja de Negociaciones</span>
          {pendingOffersCount > 0 && (
            <span className="px-1.5 py-0.2 bg-[#b45309] text-white rounded-full text-[10px] font-bold">
              {pendingOffersCount}
            </span>
          )}
        </button>

        <button
          id="tab-profile-btn"
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors flex items-center space-x-2 ${
            activeTab === 'profile'
              ? 'bg-white text-[#1c1917] border-t-2 border-t-[#b45309] border-x border-[#e5ddd1] shadow-2xs'
              : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100/60'
          }`}
        >
          <Settings className="w-4 h-4 text-[#b45309]" />
          <span>Showroom, WhatsApp & Clave PIN</span>
        </button>
      </div>

      {/* TAB 1: INVENTARIO */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* Active Dealer Info Banner */}
          <div className="bg-[#fcfaf6] border border-[#e8dfd3] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <img
                src={activeDealer.avatar}
                alt={activeDealer.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border border-amber-600/30 shrink-0"
              />
              <div>
                <span className="font-serif font-bold text-stone-900 text-sm block">
                  Inventario activo: {activeDealer.name}
                </span>
                <span className="text-xs text-stone-500 block">
                  {activeDealer.city} • WhatsApp de venta: <span className="font-mono text-stone-700 font-semibold">{activeDealer.whatsapp}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className="px-3 py-1.5 bg-white hover:bg-stone-50 border border-stone-300 rounded text-xs font-semibold text-stone-700 flex items-center space-x-1.5 transition-colors"
              >
                <ImageIcon className="w-3.5 h-3.5 text-[#b45309]" />
                <span>Cambiar Portada / Datos</span>
              </button>
              <button
                type="button"
                onClick={onOpenNewItemModal}
                className="px-3.5 py-1.5 bg-[#b45309] hover:bg-[#92400e] text-white rounded text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Cargar Pieza a {activeDealer.name.split(' ')[0]}</span>
              </button>
            </div>
          </div>

          {/* Controls row */}
          <div className="bg-white border border-[#e5ddd1] rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center space-x-2 flex-1 max-w-md">
              <input
                type="text"
                placeholder="Filtrar por SKU o título..."
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-md text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#b45309]"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-2 px-2.5 bg-[#faf8f5] border border-stone-300 rounded-md text-xs text-stone-800"
              >
                <option value="all">Todos los estados</option>
                <option value="available">Disponible</option>
                <option value="in_negotiation">En Negociación</option>
                <option value="reserved">Reservado</option>
                <option value="sold">Vendido</option>
              </select>
            </div>

            <button
              id="dashboard-new-item-btn"
              onClick={onOpenNewItemModal}
              className="py-2 px-4 bg-[#b45309] hover:bg-[#92400e] text-white rounded-md text-xs font-semibold flex items-center justify-center space-x-2 shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Incorporar Nueva Pieza</span>
            </button>
          </div>

          {/* Items Table / Cards */}
          <div className="bg-white border border-[#e5ddd1] rounded-xl overflow-hidden shadow-2xs">
            {filteredItems.length === 0 ? (
              <div className="p-12 text-center text-stone-500 space-y-3">
                <Package className="w-8 h-8 mx-auto text-stone-300" />
                <p className="text-sm">No se encontraron piezas con los filtros seleccionados.</p>
                <button
                  onClick={onOpenNewItemModal}
                  className="text-xs text-[#b45309] hover:underline font-semibold"
                >
                  + Agregar una pieza ahora
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-700">
                  <thead className="bg-[#f6f2eb] text-stone-600 uppercase tracking-wider text-[11px] font-semibold border-b border-[#e5ddd1]">
                    <tr>
                      <th className="py-3 px-4">Pieza & SKU</th>
                      <th className="py-3 px-4">Categoría / Época</th>
                      <th className="py-3 px-4">Valoración</th>
                      <th className="py-3 px-4">Certificación</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0eae0]">
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-[#faf7f2] transition-colors">
                        {/* Title & thumb */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={item.images[0]}
                              alt={item.title}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 rounded object-cover border border-stone-200 shrink-0"
                            />
                            <div className="max-w-xs">
                              <span className="font-mono text-[10px] text-stone-400 block font-semibold">
                                {item.sku}
                              </span>
                              <h4 className="font-serif font-semibold text-stone-900 line-clamp-1 hover:text-[#b45309] cursor-pointer"
                                onClick={() => onViewItemDetails(item)}
                              >
                                {item.title}
                              </h4>
                              <span className="text-[11px] text-stone-500 block truncate">
                                {item.origin}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Category & Period */}
                        <td className="py-3.5 px-4">
                          <span className="font-medium text-stone-900 block">{item.category}</span>
                          <span className="text-stone-500 text-[11px]">{item.period}</span>
                        </td>

                        {/* Price */}
                        <td className="py-3.5 px-4 font-serif font-bold text-stone-900 text-sm">
                          {formatCurrency(item.price, item.currency)}
                        </td>

                        {/* Certificate */}
                        <td className="py-3.5 px-4">
                          {item.certificate.hasCertificate ? (
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-[#fbf6ec] text-[#92400e] border border-[#ecd5a8] rounded text-[10px] font-semibold">
                              <span>✓ Oficial</span>
                            </span>
                          ) : (
                            <span className="text-stone-300 text-xs font-mono">—</span>
                          )}
                        </td>

                        {/* Status Select */}
                        <td className="py-3.5 px-4">
                          <select
                            value={item.status}
                            onChange={(e) =>
                              onChangeItemStatus(item.id, e.target.value as AntiqueItem['status'])
                            }
                            className={`py-1 px-2 rounded text-xs font-semibold border ${
                              item.status === 'available'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : item.status === 'in_negotiation'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : item.status === 'reserved'
                                ? 'bg-stone-100 text-stone-700 border-stone-300'
                                : 'bg-red-50 text-red-800 border-red-300'
                            }`}
                          >
                            <option value="available">Disponible</option>
                            <option value="in_negotiation">En Negociación</option>
                            <option value="reserved">Reservado</option>
                            <option value="sold">Vendido</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              onClick={() => onViewItemDetails(item)}
                              className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded"
                              title="Ver Ficha Técnica"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onEditItem(item)}
                              className="p-1.5 text-stone-500 hover:text-[#b45309] hover:bg-stone-100 rounded"
                              title="Editar Ficha"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`¿Eliminar la pieza ${item.sku}?`)) {
                                  onDeleteItem(item.id);
                                }
                              }}
                              className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: OFERTAS & CHAT DE NEGOCIACIÓN */}
      {activeTab === 'offers' && (
        <div className="space-y-4">
          <div className="bg-[#fbf9f5] border border-[#e8dfd3] p-4 rounded-xl flex items-center justify-between text-xs text-stone-600">
            <span>
              Mostrando ofertas y propuestas de precio recibidas para piezas de <strong>{activeDealer.name}</strong>.
            </span>
            <span className="text-[11px] font-medium text-stone-500">
              Los acuerdos cerrados se formalizan directamente por WhatsApp con el cliente.
            </span>
          </div>

          {dealerOffers.length === 0 ? (
            <div className="bg-white border border-[#e5ddd1] rounded-xl p-12 text-center text-stone-500 space-y-2">
              <MessageSquareQuote className="w-8 h-8 mx-auto text-stone-300" />
              <p className="text-sm">No hay ofertas de negociación activas en este momento.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {dealerOffers.map((offer) => {
                const discount = Math.round(((offer.originalPrice - offer.offeredPrice) / offer.originalPrice) * 100);
                const isReplying = activeReplyOfferId === offer.id;
                const buyerWhatsAppLink = generateDealerToBuyerWhatsAppUrl(offer);

                return (
                  <div
                    key={offer.id}
                    className="bg-white border border-[#e5ddd1] rounded-xl p-5 shadow-2xs space-y-4"
                  >
                    {/* Header of offer */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f0eae0] pb-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={offer.itemImage}
                          alt={offer.itemTitle}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded object-cover border border-stone-200 shrink-0"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs text-stone-500">REF: {offer.itemSku}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                              offer.status === 'accepted'
                                ? 'bg-emerald-100 text-emerald-800'
                                : offer.status === 'countered'
                                ? 'bg-amber-100 text-amber-800'
                                : offer.status === 'declined'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {offer.status === 'accepted'
                                ? 'Aceptada'
                                : offer.status === 'countered'
                                ? 'Contraofertada'
                                : offer.status === 'declined'
                                ? 'Rechazada'
                                : 'Propuesta Pendiente'}
                            </span>
                          </div>
                          <h4 className="font-serif font-bold text-stone-900 text-sm">
                            {offer.itemTitle}
                          </h4>
                          <p className="text-xs text-stone-600">
                            Comprador: <strong>{offer.buyerName}</strong> ({offer.buyerPhone})
                          </p>
                        </div>
                      </div>

                      {/* Amounts */}
                      <div className="text-right sm:self-center">
                        <span className="text-[11px] text-stone-400 block line-through">
                          Lista: {formatCurrency(offer.originalPrice, offer.currency)}
                        </span>
                        <div className="flex items-center justify-end space-x-2">
                          <span className="font-serif font-bold text-lg text-[#b45309]">
                            {formatCurrency(offer.counterOfferPrice || offer.offeredPrice, offer.currency)}
                          </span>
                          <span className="text-xs font-semibold px-1.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded">
                            -{discount}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Messages Thread Preview */}
                    <div className="bg-[#faf7f2] border border-[#ede4d8] rounded-lg p-3 space-y-2 text-xs">
                      {offer.messages.map((m) => (
                        <div
                          key={m.id}
                          className={`p-2.5 rounded ${
                            m.sender === 'dealer'
                              ? 'bg-[#ede5d8] text-stone-900 ml-4 border border-[#e0d4c3]'
                              : 'bg-white text-stone-900 mr-4 border border-stone-200'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] text-stone-500 mb-1">
                            <span className="font-semibold">{m.senderName}</span>
                            <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p>{m.message}</p>
                          {m.amount && (
                            <span className="font-mono font-bold text-[#b45309] block mt-1">
                              Monto: {formatCurrency(m.amount, offer.currency)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Actions row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                      <div className="flex items-center space-x-2">
                        {offer.status !== 'accepted' && (
                          <button
                            onClick={() => handleAcceptOffer(offer)}
                            className="py-1.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold transition-colors flex items-center space-x-1"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Aceptar Oferta</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setActiveReplyOfferId(isReplying ? null : offer.id);
                            setCounterPrice(Math.round(offer.originalPrice * 0.92));
                          }}
                          className="py-1.5 px-3 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 rounded text-xs font-semibold transition-colors"
                        >
                          {isReplying ? 'Cancelar' : 'Hacer Contraoferta'}
                        </button>

                        {offer.status !== 'declined' && (
                          <button
                            onClick={() => handleDeclineOffer(offer)}
                            className="py-1.5 px-3 text-stone-500 hover:text-red-700 rounded text-xs font-medium transition-colors"
                          >
                            Declinar
                          </button>
                        )}
                      </div>

                      {/* WhatsApp direct to buyer */}
                      <a
                        href={buyerWhatsAppLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-1.5 px-3 bg-[#1f2937] hover:bg-emerald-700 text-white rounded text-xs font-semibold transition-colors flex items-center space-x-1.5"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Contactar Comprador por WhatsApp</span>
                      </a>
                    </div>

                    {/* Inline Counter-Offer box */}
                    {isReplying && (
                      <div className="p-4 bg-[#fcf8f2] border border-[#e5d8c5] rounded-lg space-y-3 animate-fadeIn">
                        <h5 className="font-serif font-bold text-xs text-stone-900 uppercase tracking-wider">
                          Formular Contrapropuesta al Comprador
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-medium text-stone-700 mb-1">
                              Nuevo Precio ({offer.currency})
                            </label>
                            <input
                              type="number"
                              value={counterPrice || ''}
                              onChange={(e) => setCounterPrice(Number(e.target.value))}
                              className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded text-xs font-serif font-bold text-stone-900"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-medium text-stone-700 mb-1">
                              Mensaje explicativo
                            </label>
                            <input
                              type="text"
                              value={counterMessage}
                              onChange={(e) => setCounterMessage(e.target.value)}
                              placeholder="Ej: Podemos conceder un descuento especial de cortesía..."
                              className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded text-xs text-stone-900"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => setActiveReplyOfferId(null)}
                            className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSendCounterOffer(offer)}
                            className="px-4 py-1.5 bg-[#b45309] hover:bg-[#92400e] text-white rounded text-xs font-semibold flex items-center space-x-1"
                          >
                            <Send className="w-3 h-3" />
                            <span>Enviar Contraoferta</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PERFIL Y SHOWROOM */}
      {activeTab === 'profile' && (
        <div className="bg-white border border-[#e5ddd1] rounded-xl p-6 shadow-2xs max-w-3xl">
          <h3 className="font-serif text-lg font-bold text-[#1c1917] border-b border-[#eee7db] pb-3 mb-4">
            Datos Comerciales del Anticuario & Línea WhatsApp
          </h3>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Razón Social / Nombre de la Galería *
                </label>
                <input
                  type="text"
                  required
                  value={dealerName}
                  onChange={(e) => setDealerName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-md text-xs text-stone-900 focus:ring-1 focus:ring-[#b45309]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Número de WhatsApp para Cierre de Ventas * (solo dígitos con código país)
                </label>
                <input
                  type="text"
                  required
                  value={dealerWhatsapp}
                  onChange={(e) => setDealerWhatsapp(e.target.value)}
                  placeholder="5491143618890"
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-md text-xs font-mono text-stone-900 focus:ring-1 focus:ring-[#b45309]"
                />
                <span className="text-[10px] text-stone-500 block mt-0.5">
                  Los botones de "Adquirir por WhatsApp" enlazarán directamente a este número.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Dirección del Showroom / Local Físico
                </label>
                <input
                  type="text"
                  value={dealerAddress}
                  onChange={(e) => setDealerAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-md text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Ciudad y País
                </label>
                <input
                  type="text"
                  value={dealerCity}
                  onChange={(e) => setDealerCity(e.target.value)}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-md text-xs text-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Lema o Resumen de Especialidad
              </label>
              <input
                type="text"
                value={dealerTagline}
                onChange={(e) => setDealerTagline(e.target.value)}
                className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-md text-xs text-stone-900"
              />
            </div>

            {/* Seguridad y Acceso Privado (PIN / Contraseña) */}
            <div className="pt-3 border-t border-[#eee7db] space-y-3">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-[#b45309]" />
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Seguridad y Credenciales de Acceso al Panel
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    PIN Secreto o Contraseña de Acceso *
                  </label>
                  <input
                    type="text"
                    required
                    value={dealerPin}
                    onChange={(e) => setDealerPin(e.target.value)}
                    placeholder="Ej. 1234"
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-amber-300 focus:border-[#b45309] rounded-md text-xs font-mono font-bold text-stone-900 focus:ring-1 focus:ring-[#b45309]"
                  />
                  <span className="text-[10px] text-stone-500 block mt-0.5">
                    Clave con la que este anticuario inicia sesión desde «Acceso Anticuarios».
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Correo Electrónico de Contacto Institucional
                  </label>
                  <input
                    type="email"
                    value={dealerEmail}
                    onChange={(e) => setDealerEmail(e.target.value)}
                    placeholder="contacto@galeria.com"
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-md text-xs text-stone-900"
                  />
                </div>
              </div>
            </div>

            {/* Imagen de Portada / Banner */}
            <div className="pt-2 border-t border-[#eee7db] space-y-3">
              <label className="block text-xs font-semibold text-stone-800">
                Imagen de Portada / Banner de la Residencia o Showroom
              </label>

              {/* Banner Preview */}
              <div className="h-36 w-full rounded-lg overflow-hidden border border-stone-300 relative bg-stone-100 shadow-2xs">
                <img
                  src={dealerBanner}
                  alt="Portada del anticuario"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                  <span className="text-white text-xs font-serif font-bold drop-shadow-xs">
                    Vista previa de Portada: {dealerName}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={dealerBanner}
                  onChange={(e) => setDealerBanner(e.target.value)}
                  placeholder="URL de la imagen de portada..."
                  className="flex-1 px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-md text-xs font-mono text-stone-900"
                />
                <label className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-md text-xs font-semibold flex items-center justify-center space-x-1.5 cursor-pointer border border-stone-300 transition-colors shrink-0">
                  <Upload className="w-3.5 h-3.5 text-[#b45309]" />
                  <span>Subir archivo de portada</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Preset Banners for Estate Sales / Antiques */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] text-stone-500 font-medium flex items-center">
                  <ImageIcon className="w-3 h-3 mr-1 text-stone-400" />
                  O seleccionar portada de residencias y salones clásicos:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRESET_BANNERS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setDealerBanner(preset.url)}
                      className={`group text-left p-1 rounded border transition-all ${
                        dealerBanner === preset.url
                          ? 'border-[#b45309] bg-amber-50/60 ring-1 ring-[#b45309]'
                          : 'border-stone-200 hover:border-stone-400 bg-white'
                      }`}
                    >
                      <div className="h-14 rounded overflow-hidden mb-1">
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <span className="text-[10px] text-stone-700 font-medium line-clamp-1 block">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Fotografía de Perfil / Emblema */}
            <div className="pt-2 border-t border-[#eee7db] space-y-3">
              <label className="block text-xs font-semibold text-stone-800">
                Fotografía de Perfil o Emblema Oficial
              </label>

              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-stone-300 shrink-0 bg-stone-100 shadow-2xs">
                  <img
                    src={dealerAvatar}
                    alt="Emblema"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={dealerAvatar}
                      onChange={(e) => setDealerAvatar(e.target.value)}
                      placeholder="URL del emblema o avatar..."
                      className="flex-1 px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-md text-xs font-mono text-stone-900"
                    />
                    <label className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-md text-xs font-semibold flex items-center justify-center space-x-1.5 cursor-pointer border border-stone-300 transition-colors shrink-0">
                      <Upload className="w-3.5 h-3.5 text-[#b45309]" />
                      <span>Subir foto de perfil</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {profileSavedNotice && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Datos del anticuario guardados correctamente.</span>
              </div>
            )}

            <div className="pt-3 border-t border-[#eee7db] flex justify-end">
              <button
                type="submit"
                className="py-2 px-5 bg-[#b45309] hover:bg-[#92400e] text-white rounded-md text-xs font-semibold transition-colors shadow-xs"
              >
                Guardar Configuración
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
