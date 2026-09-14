import React, { useState, useEffect, useMemo } from 'react';
import { 
  AntiqueItem, 
  Dealer, 
  NegotiationOffer, 
  CatalogFilterState 
} from './types';
import { 
  INITIAL_DEALERS, 
  INITIAL_ITEMS, 
  INITIAL_OFFERS, 
  getStoredItems, 
  saveStoredItems, 
  getStoredDealers, 
  saveStoredDealers, 
  getStoredOffers, 
  saveStoredOffers 
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { NegotiationModal } from './components/NegotiationModal';
import { CatalogFilters } from './components/CatalogFilters';
import { DealersView } from './components/DealersView';
import { DealerDashboard } from './components/DealerDashboard';
import { NegotiationsListView } from './components/NegotiationsListView';
import { ItemFormModal } from './components/ItemFormModal';
import { DealerLoginModal } from './components/DealerLoginModal';
import { ShieldCheck, Phone, Award, Compass, MessageSquareQuote, ChevronRight, PlusCircle, Edit3 } from 'lucide-react';

export default function App() {
  // Master persistent state
  const [dealers, setDealers] = useState<Dealer[]>(() => getStoredDealers());
  const [activeDealer, setActiveDealer] = useState<Dealer>(() => dealers[0] || INITIAL_DEALERS[0]);
  const [items, setItems] = useState<AntiqueItem[]>(() => getStoredItems());
  const [offers, setOffers] = useState<NegotiationOffer[]>(() => getStoredOffers());

  // Dealer Authentication state
  const [authenticatedDealer, setAuthenticatedDealer] = useState<Dealer | null>(() => {
    try {
      const stored = localStorage.getItem('anticuarios_auth_dealer');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read auth dealer from storage', e);
    }
    return null;
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginTargetDealerId, setLoginTargetDealerId] = useState<string | undefined>(undefined);

  // Navigation and active views
  const [currentView, setCurrentView] = useState<'catalog' | 'dealers' | 'negotiations' | 'dealer-panel'>('catalog');

  // Modals state
  const [detailItem, setDetailItem] = useState<AntiqueItem | null>(null);
  const [negotiationTarget, setNegotiationTarget] = useState<{
    item: AntiqueItem;
    offer?: NegotiationOffer | null;
  } | null>(null);
  const [isItemFormOpen, setIsItemFormOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<AntiqueItem | null>(null);

  // Filters state
  const [filters, setFilters] = useState<CatalogFilterState>({
    searchTerm: '',
    category: '',
    period: '',
    style: '',
    dealerId: '',
    condition: '',
    onlyCertified: false,
    onlyAvailable: true,
    minPrice: null,
    maxPrice: null,
    sortBy: 'newest',
  });

  // Sync to local storage whenever data changes
  useEffect(() => {
    saveStoredItems(items);
  }, [items]);

  useEffect(() => {
    saveStoredDealers(dealers);
  }, [dealers]);

  useEffect(() => {
    saveStoredOffers(offers);
  }, [offers]);

  // Derived filter options from actual catalog
  const availableCategories = useMemo(() => {
    return Array.from(new Set(items.map((it) => it.category)));
  }, [items]);

  const availablePeriods = useMemo(() => {
    return Array.from(new Set(items.map((it) => it.period)));
  }, [items]);

  const availableStyles = useMemo(() => {
    return Array.from(new Set(items.map((it) => it.style)));
  }, [items]);

  // Filtered and sorted catalog items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Search
      if (filters.searchTerm) {
        const query = filters.searchTerm.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesSku = item.sku.toLowerCase().includes(query);
        const matchesOrigin = item.origin.toLowerCase().includes(query);
        const matchesPeriod = item.period.toLowerCase().includes(query);
        const matchesMaterials = item.materials.some((m) => m.toLowerCase().includes(query));
        if (!matchesTitle && !matchesSku && !matchesOrigin && !matchesPeriod && !matchesMaterials) {
          return false;
        }
      }

      // Category
      if (filters.category && item.category !== filters.category) {
        return false;
      }

      // Period
      if (filters.period && item.period !== filters.period) {
        return false;
      }

      // Style
      if (filters.style && item.style !== filters.style) {
        return false;
      }

      // Dealer
      if (filters.dealerId && item.dealerId !== filters.dealerId) {
        return false;
      }

      // Only certified
      if (filters.onlyCertified && !item.certificate.hasCertificate) {
        return false;
      }

      // Only available
      if (filters.onlyAvailable && item.status !== 'available' && item.status !== 'in_negotiation') {
        return false;
      }

      // Max price
      if (filters.maxPrice !== null && item.price > filters.maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_asc') {
        return a.price - b.price;
      }
      if (filters.sortBy === 'price_desc') {
        return b.price - a.price;
      }
      if (filters.sortBy === 'period') {
        return a.period.localeCompare(b.period);
      }
      // newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [items, filters]);

  // Handlers for Items
  const handleSaveItem = (savedItem: AntiqueItem) => {
    setItems((prev) => {
      const exists = prev.some((it) => it.id === savedItem.id);
      if (exists) {
        return prev.map((it) => (it.id === savedItem.id ? savedItem : it));
      }
      return [savedItem, ...prev];
    });
    setIsItemFormOpen(false);
    setItemToEdit(null);
  };

  const handleDeleteItem = (itemId: string) => {
    setItems((prev) => prev.filter((it) => it.id !== itemId));
  };

  const handleChangeItemStatus = (itemId: string, status: AntiqueItem['status']) => {
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, status } : it))
    );
  };

  // Handlers for Offers
  const handleSaveOffer = (offer: NegotiationOffer) => {
    setOffers((prev) => {
      const exists = prev.some((o) => o.id === offer.id);
      if (exists) {
        return prev.map((o) => (o.id === offer.id ? offer : o));
      }
      return [offer, ...prev];
    });

    // Update active negotiation in state so chat modal displays the latest messages immediately
    const relatedItem = items.find((it) => it.id === offer.itemId);
    if (relatedItem) {
      setNegotiationTarget({ item: relatedItem, offer });
    }
  };

  // Handler for Dealer profile
  const handleUpdateDealer = (updatedDealer: Dealer) => {
    setDealers((prev) =>
      prev.map((d) => (d.id === updatedDealer.id ? updatedDealer : d))
    );
    if (activeDealer.id === updatedDealer.id) {
      setActiveDealer(updatedDealer);
    }
  };

  // Quick navigation helper
  const handleFilterByDealer = (dealerId: string) => {
    setFilters((prev) => ({ ...prev, dealerId }));
    setCurrentView('catalog');
  };

  // Dealer login & logout
  const handleLoginSuccess = (dealer: Dealer) => {
    setAuthenticatedDealer(dealer);
    setActiveDealer(dealer);
    try {
      localStorage.setItem('anticuarios_auth_dealer', JSON.stringify(dealer));
    } catch (e) {
      console.warn('Failed to persist auth dealer', e);
    }
    setIsLoginModalOpen(false);
    setCurrentView('dealer-panel');
  };

  const handleLogout = () => {
    setAuthenticatedDealer(null);
    try {
      localStorage.removeItem('anticuarios_auth_dealer');
    } catch (e) {
      console.warn('Failed to clear auth dealer', e);
    }
  };

  // Helper to open negotiation modal
  const handleOpenNegotiation = (item: AntiqueItem) => {
    // Check if there is already an active offer for this item
    const existing = offers.find((o) => o.itemId === item.id);
    setNegotiationTarget({ item, offer: existing || null });
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#1c1917] flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(v) => setCurrentView(v)}
        activeNegotiationsCount={offers.filter((o) => o.status !== 'declined').length}
        activeDealer={activeDealer}
        onOpenNewItemModal={() => {
          setItemToEdit(null);
          setIsItemFormOpen(true);
        }}
        authenticatedDealer={authenticatedDealer}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1">
        {/* VIEW 1: CATALOGO GENERAL */}
        {currentView === 'catalog' && (() => {
          const selectedFilterDealer = filters.dealerId ? dealers.find((d) => d.id === filters.dealerId) : null;

          return (
            <div className="space-y-8 animate-fadeIn">
              {/* Dynamic Hero Banner: Dealer Showcase or General Banner */}
              {selectedFilterDealer ? (
                <div className="bg-white border border-[#e5ddd1] rounded-2xl overflow-hidden shadow-2xs">
                  <div className="h-52 sm:h-72 w-full relative bg-stone-900">
                    <img
                      src={selectedFilterDealer.banner}
                      alt={selectedFilterDealer.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                    
                    {/* Top badging */}
                    <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded text-xs font-semibold uppercase bg-amber-500 text-stone-950 shadow-xs">
                        {selectedFilterDealer.id === 'dealer-casa-intaglieta' ? 'Liquidación de Residencia' : 'Anticuario Colegiado'}
                      </span>
                      <span className="px-2.5 py-1 rounded text-xs font-medium bg-black/60 backdrop-blur-xs text-stone-200">
                        {selectedFilterDealer.city}
                      </span>
                    </div>

                    {/* Exit filter button */}
                    <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                      <button
                        onClick={() => handleFilterByDealer('')}
                        className="px-3 py-1.5 rounded text-xs font-semibold bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs border border-white/20 transition-colors"
                      >
                        ← Ver Catálogo General
                      </button>
                    </div>

                    {/* Bottom title & avatar inside banner */}
                    <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 right-4 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <img
                          src={selectedFilterDealer.avatar}
                          alt={selectedFilterDealer.name}
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-amber-400 shadow-md shrink-0 bg-white"
                        />
                        <div>
                          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight drop-shadow-sm">
                            {selectedFilterDealer.name}
                          </h1>
                          <p className="text-xs sm:text-sm text-stone-200 mt-0.5 line-clamp-1 max-w-xl">
                            {selectedFilterDealer.tagline}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={() => {
                            setActiveDealer(selectedFilterDealer);
                            setItemToEdit(null);
                            setIsItemFormOpen(true);
                          }}
                          className="px-3.5 py-2 bg-[#b45309] hover:bg-[#92400e] text-white rounded-md text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-colors"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>+ Cargar Pieza a esta Casa</span>
                        </button>
                        <button
                          onClick={() => {
                            setActiveDealer(selectedFilterDealer);
                            setCurrentView('dealer-panel');
                          }}
                          className="px-3 py-2 bg-white hover:bg-stone-100 text-stone-900 rounded-md text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#b45309]" />
                          <span>Cambiar Portada / Datos</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-3 bg-[#faf7f2] border-t border-[#eee7db] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-stone-600 gap-2">
                    <span>
                      Mostrando catálogo exclusivo de <strong>{selectedFilterDealer.name}</strong> • Ubicación: {selectedFilterDealer.address}, {selectedFilterDealer.city}.
                    </span>
                    <a
                      href={`https://wa.me/${selectedFilterDealer.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center space-x-1"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp Oficial: +{selectedFilterDealer.whatsapp}</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-[#e5ddd1] rounded-2xl p-6 sm:p-8 shadow-2xs relative overflow-hidden">
                  <div className="max-w-3xl">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-[#b45309] uppercase tracking-wider mb-2">
                      <ShieldCheck className="w-4 h-4 text-[#b45309]" />
                      <span>Catálogo de Anticuario • Peritaje Colegiado</span>
                    </div>
                    <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1c1917] tracking-tight leading-tight">
                      Colección de Mobiliario, Orfebrería y Arte de Época
                    </h1>
                    <p className="text-sm sm:text-base text-stone-600 mt-3 leading-relaxed">
                      Piezas singulares seleccionadas por reconocidos anticuarios. Cada ficha incluye procedencia, época precisa, medidas milimétricas, peritaje de estado de conservación y certificación pericial.
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-stone-500 pt-4 border-t border-[#eee7db]">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="font-medium text-stone-800">Sin intermediarios ni carrito</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Cierre de compra directo por WhatsApp</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <MessageSquareQuote className="w-3.5 h-3.5 text-[#b45309]" />
                        <span>Mesa de ofertas y contraofertas activa</span>
                      </div>
                    </div>
                  </div>

                  {/* Special Estate Sale Callout */}
                  <div className="mt-6 bg-[#f7f2ea] border border-[#e2d5c2] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-[#b45309]/10 border border-[#b45309]/30 flex items-center justify-center shrink-0">
                        <Award className="w-5 h-5 text-[#b45309]" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-serif font-bold text-stone-900 text-sm">
                            Colección Destacada: Casa Intaglieta
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-amber-200/70 text-amber-900 border border-amber-300">
                            Liquidación de Residencia
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 mt-0.5">
                          Venta integral de mobiliario renacentista, pinacoteca al óleo, cubertería Christofle y araña de Bohemia.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => handleFilterByDealer('dealer-casa-intaglieta')}
                        className={`px-3.5 py-1.5 rounded text-xs font-semibold transition-colors ${
                          filters.dealerId === 'dealer-casa-intaglieta'
                            ? 'bg-[#b45309] text-white shadow-xs'
                            : 'bg-white hover:bg-stone-50 text-stone-800 border border-stone-300'
                        }`}
                      >
                        {filters.dealerId === 'dealer-casa-intaglieta' ? '✓ Viendo Casa Intaglieta' : 'Ver Colección Casa Intaglieta'}
                      </button>
                      {filters.dealerId === 'dealer-casa-intaglieta' && (
                        <button
                          onClick={() => handleFilterByDealer('')}
                          className="px-2.5 py-1.5 text-xs text-stone-500 hover:text-stone-800 underline"
                        >
                          Ver todas
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

            {/* Filter bar */}
            <CatalogFilters
              filters={filters}
              onFilterChange={setFilters}
              dealers={dealers}
              categories={availableCategories}
              periods={availablePeriods}
              styles={availableStyles}
              totalResults={filteredItems.length}
            />

            {/* Catalog Grid */}
            {filteredItems.length === 0 ? (
              <div className="bg-white border border-[#e5ddd1] rounded-xl p-12 text-center text-stone-500 space-y-3">
                <Compass className="w-10 h-10 mx-auto text-stone-300" />
                <h3 className="font-serif text-lg font-bold text-stone-800">
                  No se encontraron piezas con los criterios seleccionados
                </h3>
                <p className="text-xs text-stone-600 max-w-sm mx-auto">
                  Pruebe relajando los filtros de época, categoría o precio para descubrir más obras del catálogo.
                </p>
                <button
                  onClick={() =>
                    setFilters({
                      searchTerm: '',
                      category: '',
                      period: '',
                      style: '',
                      dealerId: '',
                      condition: '',
                      onlyCertified: false,
                      onlyAvailable: false,
                      minPrice: null,
                      maxPrice: null,
                      sortBy: 'newest',
                    })
                  }
                  className="text-xs text-[#b45309] font-semibold hover:underline"
                >
                  Restablecer todos los filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => {
                  const itemDealer = dealers.find((d) => d.id === item.dealerId) || activeDealer;
                  return (
                    <ProductCard
                      key={item.id}
                      item={item}
                      dealer={itemDealer}
                      onViewDetails={(it) => setDetailItem(it)}
                      onOpenNegotiation={(it) => handleOpenNegotiation(it)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}

        {/* VIEW 2: MULTI-VENDEDOR DIRECTORY (GALERÍAS Y ANTICUARIOS) */}
        {currentView === 'dealers' && (
          <DealersView
            dealers={dealers}
            items={items}
            onSelectDealerCatalog={(dealerId) => handleFilterByDealer(dealerId)}
            onManageAsDealer={(dealer) => {
              setActiveDealer(dealer);
              setCurrentView('dealer-panel');
            }}
            authenticatedDealer={authenticatedDealer}
            onOpenLoginModal={(dealerId) => {
              setLoginTargetDealerId(dealerId);
              setIsLoginModalOpen(true);
            }}
          />
        )}

        {/* VIEW 3: NEGOCIACIONES ACTIVAS (COMPRADOR) */}
        {currentView === 'negotiations' && (
          <NegotiationsListView
            offers={offers}
            dealers={dealers}
            items={items}
            onOpenOffer={(offer) => {
              const relatedItem = items.find((it) => it.id === offer.itemId);
              if (relatedItem) {
                setNegotiationTarget({ item: relatedItem, offer });
              }
            }}
            onExploreCatalog={() => setCurrentView('catalog')}
          />
        )}

        {/* VIEW 4: PANEL DE GESTIÓN DEL ANTICUARIO (MULTI-VENDEDOR INVENTARIO) */}
        {currentView === 'dealer-panel' && (
          <DealerDashboard
            dealers={dealers}
            activeDealer={activeDealer}
            onSelectDealer={setActiveDealer}
            items={items}
            offers={offers}
            onOpenNewItemModal={() => {
              setItemToEdit(null);
              setIsItemFormOpen(true);
            }}
            onEditItem={(item) => {
              setItemToEdit(item);
              setIsItemFormOpen(true);
            }}
            onDeleteItem={handleDeleteItem}
            onChangeItemStatus={handleChangeItemStatus}
            onViewItemDetails={(item) => setDetailItem(item)}
            onUpdateOffer={handleSaveOffer}
            onUpdateDealer={handleUpdateDealer}
            authenticatedDealer={authenticatedDealer}
            onLogout={handleLogout}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
          />
        )}
      </main>

      {/* Global Modals */}
      {/* 0. Modal de Autenticación de Anticuario con PIN */}
      {isLoginModalOpen && (
        <DealerLoginModal
          dealers={dealers}
          initialDealerId={loginTargetDealerId || activeDealer.id}
          onSuccess={handleLoginSuccess}
          onClose={() => {
            setIsLoginModalOpen(false);
            setLoginTargetDealerId(undefined);
          }}
        />
      )}
      {/* 1. Ficha de Anticuario y peritaje */}
      {detailItem && (
        <ProductDetailModal
          item={detailItem}
          dealer={dealers.find((d) => d.id === detailItem.dealerId) || activeDealer}
          onClose={() => setDetailItem(null)}
          onOpenNegotiation={(it) => handleOpenNegotiation(it)}
          onFilterByDealer={(dealerId) => {
            setDetailItem(null);
            handleFilterByDealer(dealerId);
          }}
        />
      )}

      {/* 2. Chat de Negociación y Contraoferta */}
      {negotiationTarget && (
        <NegotiationModal
          item={negotiationTarget.item}
          dealer={dealers.find((d) => d.id === negotiationTarget.item.dealerId) || activeDealer}
          existingOffer={negotiationTarget.offer}
          onClose={() => setNegotiationTarget(null)}
          onSaveOffer={handleSaveOffer}
        />
      )}

      {/* 3. Modal de Incorporación / Edición de Pieza */}
      {isItemFormOpen && (
        <ItemFormModal
          initialItem={itemToEdit}
          activeDealer={activeDealer}
          dealers={dealers}
          onClose={() => {
            setIsItemFormOpen(false);
            setItemToEdit(null);
          }}
          onSave={handleSaveItem}
        />
      )}

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-[#e5ddd1] py-8 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-serif font-bold text-stone-900 tracking-wider uppercase text-sm block">
              Anticuarios & Co. • Plataforma de Alta Antigüedad
            </span>
            <p className="mt-1 text-stone-400">
              Estándar de catalogación pericial y verificación de autenticidad.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-stone-600">
            <span className="flex items-center space-x-1">
              <Award className="w-3.5 h-3.5 text-[#b45309]" />
              <span>Garantía de Origen</span>
            </span>
            <span className="flex items-center space-x-1">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cierre Directo por WhatsApp</span>
            </span>
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-800" />
              <span>Multi-Vendedor Asociado</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
