import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  saveStoredOffers,
  SAMPLE_DEALER_IDS,
  SAMPLE_ITEM_IDS
} from './data/mockData';
import { 
  db, 
  ITEMS_COLLECTION, 
  DEALERS_COLLECTION, 
  OFFERS_COLLECTION, 
  seedInitialDataIfEmpty, 
  saveItemToFirestore, 
  deleteItemFromFirestore, 
  deleteMultipleItemsFromFirestore,
  saveOfferToFirestore, 
  saveDealerToFirestore,
  deleteDealerFromFirestore
} from './services/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
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
import { ReservationModal } from './components/ReservationModal';
import { DealerFormModal } from './components/DealerFormModal';
import { ServicesView } from './components/ServicesView';
import { MagazineView } from './components/MagazineView';
import { ArticleFormModal } from './components/ArticleFormModal';
import { LogoModal } from './components/LogoModal';
import { PinterestCatalogModal } from './components/PinterestCatalogModal';
import { BlogArticle } from './types';
import { INITIAL_ARTICLES, getStoredArticles, saveStoredArticles } from './data/blogArticles';
import { ShieldCheck, Phone, Award, Compass, MessageSquareQuote, ChevronRight, ChevronLeft, PlusCircle, Edit3, Heart, ArrowRight, Trash2, Info, AlertCircle, BookOpen, Sparkles, Instagram } from 'lucide-react';

export default function App() {
  // Master persistent state
  const [dealers, setDealers] = useState<Dealer[]>(() => getStoredDealers());
  const [activeDealer, setActiveDealer] = useState<Dealer>(() => dealers[0] || INITIAL_DEALERS[0]);
  const [items, setItems] = useState<AntiqueItem[]>(() => getStoredItems());
  const [offers, setOffers] = useState<NegotiationOffer[]>(() => getStoredOffers());
  const [articles, setArticles] = useState<BlogArticle[]>(() => getStoredArticles());
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [isArticleFormOpen, setIsArticleFormOpen] = useState(false);
  const [articleToEdit, setArticleToEdit] = useState<BlogArticle | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

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
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem('anticuarios_is_admin') === 'true';
    } catch {
      return false;
    }
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginTargetDealerId, setLoginTargetDealerId] = useState<string | undefined>(undefined);

  // Navigation and active views
  const [currentView, setCurrentView] = useState<'catalog' | 'dealers' | 'services' | 'magazine' | 'negotiations' | 'dealer-panel'>('catalog');

  // Modals state
  const [detailItem, setDetailItem] = useState<AntiqueItem | null>(null);
  const [reservationItem, setReservationItem] = useState<AntiqueItem | null>(null);
  const [negotiationTarget, setNegotiationTarget] = useState<{
    item: AntiqueItem;
    offer?: NegotiationOffer | null;
  } | null>(null);
  const [isItemFormOpen, setIsItemFormOpen] = useState(false);
  const [isDealerFormOpen, setIsDealerFormOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<AntiqueItem | null>(null);
  const [showDeleteSampleItemsModal, setShowDeleteSampleItemsModal] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [isPinterestModalOpen, setIsPinterestModalOpen] = useState(false);

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

  // Sync to local storage and listen to Firestore in real-time
  useEffect(() => {
    // 1. Seed initial data to Firestore if not present yet
    seedInitialDataIfEmpty();

    // 2. Real-time Firestore subscriber for antique items
    const unsubItems = onSnapshot(
      collection(db, ITEMS_COLLECTION),
      (snapshot) => {
        const cloudItems = snapshot.docs.map((doc) => doc.data() as AntiqueItem);
        setItems(cloudItems);
        saveStoredItems(cloudItems);
      },
      (err) => console.warn('Firestore items listener notice:', err)
    );

    // 3. Real-time Firestore subscriber for dealers
    const unsubDealers = onSnapshot(
      collection(db, DEALERS_COLLECTION),
      async (snapshot) => {
        if (!snapshot.empty) {
          const cloudDealers = snapshot.docs.map((doc) => doc.data() as Dealer);

          // Deduplicate Alla Foglia: remove redundant workshop profile and retain main profile
          const fogliaProfiles = cloudDealers.filter(
            (d) =>
              d.id === 'dealer-alla-foglia' ||
              d.name.toLowerCase().includes('allafoglia') ||
              d.name.toLowerCase().includes('alla foglia') ||
              d.name.toLowerCase().includes('taller de dorado')
          );

          if (fogliaProfiles.length > 1) {
            // Find the one that has products, or doesn't have "taller" in its name
            const currentStoredItems = getStoredItems();
            const withProducts = fogliaProfiles.find((d) =>
              currentStoredItems.some((it) => it.dealerId === d.id)
            );
            const keeper =
              withProducts ||
              fogliaProfiles.find((d) => !d.name.toLowerCase().includes('taller')) ||
              fogliaProfiles[0];

            const workshopsToRemove = fogliaProfiles.filter((d) => d.id !== keeper.id);

            // Clean keeper name from any workshop suffix
            const cleanKeeper: Dealer = {
              ...keeper,
              name: keeper.name.includes('•') ? keeper.name.split('•')[0].trim() : keeper.name,
            };

            const sanitized = cloudDealers
              .filter((d) => !workshopsToRemove.some((w) => w.id === d.id))
              .map((d) => (d.id === cleanKeeper.id ? cleanKeeper : d));

            setDealers(sanitized);
            saveStoredDealers(sanitized);

            // Delete redundant workshop profiles from Firestore so they never re-appear
            for (const workshop of workshopsToRemove) {
              try {
                await deleteDealerFromFirestore(workshop.id);
                console.log('Removed duplicate workshop profile from firestore:', workshop.id);
              } catch (e) {
                console.warn('Error purging workshop profile:', e);
              }
            }
          } else {
            setDealers(cloudDealers);
            saveStoredDealers(cloudDealers);
          }
        }
      },
      (err) => console.warn('Firestore dealers listener notice:', err)
    );

    // 4. Real-time Firestore subscriber for negotiation offers
    const unsubOffers = onSnapshot(
      collection(db, OFFERS_COLLECTION),
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudOffers = snapshot.docs.map((doc) => doc.data() as NegotiationOffer);
          setOffers(cloudOffers);
          saveStoredOffers(cloudOffers);
        }
      },
      (err) => console.warn('Firestore offers listener notice:', err)
    );

    return () => {
      unsubItems();
      unsubDealers();
      unsubOffers();
    };
  }, []);

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

  const availableLocations = useMemo(() => {
    const locs = items
      .map((it) => it.location || dealers.find((d) => d.id === it.dealerId)?.city?.split(',')[0])
      .filter((loc): loc is string => Boolean(loc && loc.trim()));
    return Array.from(new Set(locs));
  }, [items, dealers]);

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
        const matchesLocation = (item.location || '').toLowerCase().includes(query);
        const matchesMaterials = item.materials.some((m) => m.toLowerCase().includes(query));
        if (!matchesTitle && !matchesSku && !matchesOrigin && !matchesPeriod && !matchesLocation && !matchesMaterials) {
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

      // Location
      if (filters.location) {
        const itemLoc = item.location || dealers.find((d) => d.id === item.dealerId)?.city?.split(',')[0];
        if (itemLoc !== filters.location) {
          return false;
        }
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
  const handleSaveItem = async (savedItem: AntiqueItem) => {
    setItems((prev) => {
      const exists = prev.some((it) => it.id === savedItem.id);
      const nextItems = exists
        ? prev.map((it) => (it.id === savedItem.id ? savedItem : it))
        : [savedItem, ...prev];
      saveStoredItems(nextItems);
      return nextItems;
    });
    setIsItemFormOpen(false);
    setItemToEdit(null);
    try {
      await saveItemToFirestore(savedItem);
    } catch (e) {
      console.warn('Error saving to cloud firestore:', e);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    setItems((prev) => {
      const nextItems = prev.filter((it) => it.id !== itemId);
      saveStoredItems(nextItems);
      return nextItems;
    });
    try {
      await deleteItemFromFirestore(itemId);
    } catch (e) {
      console.warn('Error deleting from cloud firestore:', e);
    }
  };

  const handleChangeItemStatus = async (itemId: string, status: AntiqueItem['status']) => {
    const updated = items.find((it) => it.id === itemId);
    if (updated) {
      const modified = { ...updated, status };
      setItems((prev) => {
        const nextItems = prev.map((it) => (it.id === itemId ? modified : it));
        saveStoredItems(nextItems);
        return nextItems;
      });
      try {
        await saveItemToFirestore(modified);
      } catch (e) {
        console.warn('Error updating status in cloud firestore:', e);
      }
    }
  };

  // Handlers for Offers
  const handleSaveOffer = async (offer: NegotiationOffer) => {
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

    try {
      await saveOfferToFirestore(offer);
    } catch (e) {
      console.warn('Error saving offer to cloud firestore:', e);
    }
  };

  // Handler for Dealer profile
  const handleUpdateDealer = async (updatedDealer: Dealer) => {
    setDealers((prev) =>
      prev.map((d) => (d.id === updatedDealer.id ? updatedDealer : d))
    );
    if (activeDealer.id === updatedDealer.id) {
      setActiveDealer(updatedDealer);
    }
    try {
      await saveDealerToFirestore(updatedDealer);
    } catch (e) {
      console.warn('Error saving dealer to cloud firestore:', e);
    }
  };

  // Handler to delete an individual dealer
  const handleDeleteDealer = async (dealerId: string) => {
    let nextDealers = dealers.filter((d) => d.id !== dealerId);
    
    // Ensure there is always at least one dealer in the system
    if (nextDealers.length === 0) {
      const fallbackDealer: Dealer = {
        id: `dealer-${Date.now()}`,
        name: 'Mi Anticuario & Galería',
        slug: 'mi-anticuario',
        tagline: 'Alta Época, Coleccionismo y Piezas Singulares',
        description: 'Galería especializada en piezas de época, artes decorativas y coleccionismo selecto.',
        city: 'Buenos Aires, Argentina',
        address: 'Showroom Principal',
        phone: '+54 9 11 4822 0000',
        whatsapp: '5491148220000',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
        foundedYear: new Date().getFullYear(),
        specialties: ['Libros y Manuscritos', 'Mobiliario Clásico', 'Platería'],
        verified: true,
        accessPin: '1234',
        email: 'contacto@mianticuario.com',
      };
      nextDealers = [fallbackDealer];
      try {
        await saveDealerToFirestore(fallbackDealer);
      } catch (e) {
        console.warn('Error saving fallback dealer to firestore:', e);
      }
    }

    setDealers(nextDealers);
    saveStoredDealers(nextDealers);

    if (activeDealer.id === dealerId) {
      setActiveDealer(nextDealers[0]);
    }
    if (authenticatedDealer?.id === dealerId) {
      handleLogout();
    }

    // Delete all items associated with this dealer
    const itemsToDelete = items.filter((it) => it.dealerId === dealerId);
    const remainingItems = items.filter((it) => it.dealerId !== dealerId);
    setItems(remainingItems);
    saveStoredItems(remainingItems);

    // Sync deletion to Firestore
    try {
      await deleteDealerFromFirestore(dealerId);
      for (const it of itemsToDelete) {
        await deleteItemFromFirestore(it.id);
      }
    } catch (e) {
      console.warn('Error syncing dealer/items deletion to firestore:', e);
    }
  };

  // Handler to clean up all demo sample dealers and their items
  const handleDeleteSampleDealers = async () => {
    const sampleIds = new Set(SAMPLE_DEALER_IDS);
    let nextDealers = dealers.filter((d) => !sampleIds.has(d.id));

    // If all current dealers were sample dealers, create a fresh custom dealer for the user
    if (nextDealers.length === 0) {
      const freshDealer: Dealer = {
        id: `dealer-${Date.now()}`,
        name: 'Mi Anticuario & Galería',
        slug: 'mi-anticuario',
        tagline: 'Alta Época, Coleccionismo y Piezas Singulares',
        description: 'Galería especializada en piezas de época, artes decorativas y coleccionismo selecto.',
        city: 'Buenos Aires, Argentina',
        address: 'Showroom Principal',
        phone: '+54 9 11 4822 0000',
        whatsapp: '5491148220000',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
        foundedYear: new Date().getFullYear(),
        specialties: ['Libros y Manuscritos', 'Mobiliario Clásico', 'Platería'],
        verified: true,
        accessPin: '1234',
        email: 'contacto@mianticuario.com',
      };
      nextDealers = [freshDealer];
      try {
        await saveDealerToFirestore(freshDealer);
      } catch (e) {
        console.warn('Error creating fresh dealer in firestore:', e);
      }
    }

    setDealers(nextDealers);
    saveStoredDealers(nextDealers);
    setActiveDealer(nextDealers[0]);

    if (authenticatedDealer && sampleIds.has(authenticatedDealer.id)) {
      handleLogout();
    }

    // Delete associated sample items by dealer ID or by sample item ID
    const sampleItemIds = new Set(SAMPLE_ITEM_IDS);
    const sampleItems = items.filter((it) => sampleIds.has(it.dealerId) || sampleItemIds.has(it.id));
    const remainingItems = items.filter((it) => !sampleIds.has(it.dealerId) && !sampleItemIds.has(it.id));
    setItems(remainingItems);
    saveStoredItems(remainingItems);

    // Sync deletions to Firestore
    try {
      for (const sId of SAMPLE_DEALER_IDS) {
        await deleteDealerFromFirestore(sId);
      }
      for (const sItem of sampleItems) {
        await deleteItemFromFirestore(sItem.id);
      }
      for (const sItemId of SAMPLE_ITEM_IDS) {
        await deleteItemFromFirestore(sItemId);
      }
    } catch (e) {
      console.warn('Error cleaning sample dealers in firestore:', e);
    }
  };

  // Delete all sample / demo items from the catalog permanently
  const handleDeleteSampleItems = async () => {
    const sampleItemIds = new Set(SAMPLE_ITEM_IDS);
    const sampleDealerIds = new Set(SAMPLE_DEALER_IDS);
    const remainingItems = items.filter((it) => !sampleItemIds.has(it.id) && !sampleDealerIds.has(it.dealerId));
    setItems(remainingItems);
    saveStoredItems(remainingItems);

    try {
      await deleteMultipleItemsFromFirestore(SAMPLE_ITEM_IDS);
      const itemsToPurge = items.filter((it) => sampleDealerIds.has(it.dealerId) || sampleItemIds.has(it.id));
      for (const it of itemsToPurge) {
        await deleteItemFromFirestore(it.id);
      }
    } catch (e) {
      console.warn('Error purging sample items from firestore:', e);
    }
  };

  // Quick navigation helper
  const handleFilterByDealer = (dealerId: string) => {
    setFilters((prev) => ({ ...prev, dealerId }));
    setCurrentView('catalog');
  };

  // Dealer login & logout
  const handleLoginSuccess = (dealer: Dealer, asAdmin: boolean = false) => {
    setAuthenticatedDealer(dealer);
    setActiveDealer(dealer);

    // Alla Foglia is the founding owner / master admin, or when logged in with master admin PIN
    const isMasterAdmin =
      asAdmin ||
      dealer.id === 'dealer-alla-foglia' ||
      dealer.slug === 'alla-foglia' ||
      dealer.name.toLowerCase().includes('allafoglia') ||
      dealer.name.toLowerCase().includes('alla foglia');

    setIsAdmin(isMasterAdmin);

    try {
      localStorage.setItem('anticuarios_auth_dealer', JSON.stringify(dealer));
      localStorage.setItem('anticuarios_is_admin', isMasterAdmin ? 'true' : 'false');
    } catch (e) {
      console.warn('Failed to persist auth dealer', e);
    }
    setIsLoginModalOpen(false);
    setCurrentView('dealer-panel');
  };

  const handleLogout = () => {
    setAuthenticatedDealer(null);
    setIsAdmin(false);
    try {
      localStorage.removeItem('anticuarios_auth_dealer');
      localStorage.removeItem('anticuarios_is_admin');
    } catch (e) {
      console.warn('Failed to clear auth dealer', e);
    }
    setCurrentView('catalog');
  };

  // Helper to open negotiation modal
  const handleOpenNegotiation = (item: AntiqueItem) => {
    // Check if there is already an active offer for this item
    const existing = offers.find((o) => o.itemId === item.id);
    setNegotiationTarget({ item, offer: existing || null });
  };

  // Helper to save or edit blog article
  const handleSaveArticle = (savedArticle: BlogArticle) => {
    if (articleToEdit) {
      const updated = articles.map((a) => (a.id === savedArticle.id ? savedArticle : a));
      setArticles(updated);
      saveStoredArticles(updated);
      setSelectedArticleId(savedArticle.id);
    } else {
      const updated = [savedArticle, ...articles];
      setArticles(updated);
      saveStoredArticles(updated);
      setSelectedArticleId(savedArticle.id);
    }
    setIsArticleFormOpen(false);
    setArticleToEdit(null);
    setCurrentView('magazine');
  };

  const handleUpdateArticle = (updatedArticle: BlogArticle) => {
    const updated = articles.map((a) => (a.id === updatedArticle.id ? updatedArticle : a));
    setArticles(updated);
    saveStoredArticles(updated);
  };

  const handleDeleteArticle = (articleId: string) => {
    const updated = articles.filter((a) => a.id !== articleId);
    setArticles(updated);
    saveStoredArticles(updated);
    if (selectedArticleId === articleId) {
      setSelectedArticleId(null);
    }
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
        isAdmin={isAdmin}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        selectedCategory={filters.category}
        onSelectCategory={(cat) => setFilters((prev) => ({ ...prev, category: cat }))}
        onOpenLogoModal={() => setIsLogoModalOpen(true)}
        onOpenPinterestModal={() => setIsPinterestModalOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1">
        {/* VIEW 1: CATALOGO GENERAL */}
        {currentView === 'catalog' && (() => {
          const selectedFilterDealer = filters.dealerId ? dealers.find((d) => d.id === filters.dealerId) : null;
          const noveltyItems = items.slice(0, 8);

          const scrollCarousel = (direction: 'left' | 'right') => {
            if (carouselRef.current) {
              const offset = direction === 'left' ? -340 : 340;
              carouselRef.current.scrollBy({ left: offset, behavior: 'smooth' });
            }
          };

          return (
            <div className="space-y-6 sm:space-y-8 animate-fadeIn">
              {/* Dynamic Dealer Showcase Header (Only when a dealer is selected) */}
              {selectedFilterDealer ? (
                <div className="bg-white border border-[#e8e2d8] rounded-sm overflow-hidden shadow-2xs">
                  <div className="h-44 sm:h-56 w-full relative bg-stone-900">
                    <img
                      src={selectedFilterDealer.banner}
                      alt={selectedFilterDealer.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    
                    {/* Exit filter button */}
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => handleFilterByDealer('')}
                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs border border-white/20 transition-colors"
                      >
                        ← Volver a todo el catálogo
                      </button>
                    </div>

                    {/* Bottom title inside banner */}
                    <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <img
                          src={selectedFilterDealer.avatar}
                          alt={selectedFilterDealer.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border border-white shadow-sm shrink-0 bg-white"
                        />
                        <div>
                          <h1 className="font-serif text-xl sm:text-2xl font-normal text-white">
                            {selectedFilterDealer.name}
                          </h1>
                          <p className="text-xs text-stone-300 mt-0.5 line-clamp-1 max-w-xl font-light">
                            {selectedFilterDealer.tagline} • {selectedFilterDealer.city}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        {selectedFilterDealer.instagram && (
                          <a
                            href={`https://instagram.com/${selectedFilterDealer.instagram.replace(/^@/, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-full text-xs font-medium flex items-center space-x-1.5 backdrop-blur-xs border border-white/30 transition-colors"
                          >
                            <Instagram className="w-3.5 h-3.5" />
                            <span>@{selectedFilterDealer.instagram.replace(/^@/, '')}</span>
                          </a>
                        )}
                        <a
                          href={`https://wa.me/${selectedFilterDealer.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-medium flex items-center space-x-1.5 transition-colors"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Contactar Anticuario</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ) : !filters.searchTerm && !filters.category && (
                /* 1stdibs Novelty Section: "Consulta las novedades" */
                <div className="pt-1 pb-4">
                  <div className="flex flex-col md:flex-row items-stretch gap-4">
                    {/* Left teaser block */}
                    <div className="w-full md:w-56 shrink-0 p-5 sm:p-6 bg-white border border-[#e8e2d8] rounded-sm flex flex-col justify-between shadow-2xs">
                      <div>
                        <h2 className="font-serif text-2xl sm:text-3xl text-stone-950 font-normal leading-snug">
                          Ingresos &<br className="hidden md:inline" /> Curaduría
                        </h2>
                        <button
                          onClick={() => {
                            setFilters((prev) => ({ ...prev, category: '', searchTerm: '', dealerId: '', sortBy: 'newest' }));
                            const gridEl = document.getElementById('catalog-grid-anchor');
                            if (gridEl) {
                              gridEl.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className="text-xs text-stone-600 hover:text-stone-950 underline underline-offset-4 mt-3 sm:mt-4 block font-medium tracking-wide transition-colors cursor-pointer"
                        >
                          Ver catálogo completo →
                        </button>
                      </div>

                      <div className="flex items-center space-x-2 mt-6">
                        <button
                          type="button"
                          onClick={() => scrollCarousel('left')}
                          className="w-8 h-8 rounded-full border border-stone-300 hover:border-stone-800 flex items-center justify-center text-stone-700 hover:text-stone-950 transition-colors cursor-pointer"
                          aria-label="Anterior"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => scrollCarousel('right')}
                          className="w-8 h-8 rounded-full border border-stone-300 hover:border-stone-800 flex items-center justify-center text-stone-700 hover:text-stone-950 transition-colors cursor-pointer"
                          aria-label="Siguiente"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Right horizontal scrollable list of new arrivals */}
                    <div 
                      ref={carouselRef}
                      className="flex-1 flex space-x-4 overflow-x-auto scrollbar-none pb-2 pt-0.5 scroll-smooth"
                    >
                      {noveltyItems.map((item) => {
                        const dealer = dealers.find((d) => d.id === item.dealerId);
                        return (
                          <div
                            key={`novelty-${item.id}`}
                            onClick={() => setDetailItem(item)}
                            className="w-56 sm:w-64 shrink-0 bg-white border border-[#e8e2d8] rounded-sm overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col group"
                          >
                            <div className="relative aspect-square bg-[#fbfaf8] overflow-hidden flex items-center justify-center">
                              <img
                                src={item.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'}
                                alt={item.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              {item.status === 'sold' && (
                                <div className="absolute top-2.5 left-2.5">
                                  <span className="px-2 py-0.5 bg-stone-900/90 text-white text-[9px] uppercase tracking-wider font-semibold rounded-xs backdrop-blur-xs font-serif">
                                    Vendido
                                  </span>
                                </div>
                              )}
                              {item.provenance && item.status !== 'sold' && (
                                <div className="absolute top-2.5 left-2.5">
                                  <span className="px-2 py-0.5 bg-amber-950/85 text-amber-100 text-[9px] uppercase tracking-wider font-serif rounded-xs backdrop-blur-xs">
                                    Colección Privada
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="p-3.5 flex-1 flex flex-col justify-between">
                              <div>
                                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium block truncate">
                                  {dealer?.name || 'Anticuario Colegiado'}
                                </span>
                                <h3 className="font-serif text-xs sm:text-sm text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-1 mt-0.5">
                                  {item.title}
                                </h3>
                                <p className="text-[11px] text-stone-500 font-light mt-0.5 truncate">
                                  {item.period} • {item.style}
                                </p>
                              </div>
                              <div className="mt-2 pt-2 border-t border-[#f0eae1] flex items-center justify-between">
                                {item.status === 'sold' || item.hidePrice ? (
                                  <span className="text-[11px] font-serif font-bold text-stone-600 uppercase tracking-wider">
                                    Vendido • Archivo
                                  </span>
                                ) : (
                                  <span className="text-xs sm:text-sm font-semibold text-stone-950 font-mono">
                                    USD ${item.price.toLocaleString('es-AR')}
                                  </span>
                                )}
                                <span className="text-[10px] text-stone-400 group-hover:text-stone-900 transition-colors">
                                  Ver ficha →
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Editorial Magazine Highlight Banner (El Cuaderno) */}
              {!filters.category && !filters.searchTerm && !filters.dealerId && articles.length > 0 && (
                <div 
                  onClick={() => {
                    setSelectedArticleId(articles[0].id);
                    setCurrentView('magazine');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-linear-to-r from-[#faf6ee] to-[#f4ede0] border border-[#e5d9c5] rounded-xl p-5 sm:p-6 hover:border-amber-700/60 hover:shadow-md transition-all duration-300 cursor-pointer group flex flex-col md:flex-row items-start md:items-center justify-between gap-5 my-2"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-stone-200 shrink-0 border border-[#ddcfb8] shadow-xs">
                      <img
                        src={articles[0].coverImage}
                        alt={articles[0].title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center space-x-2 text-[10px] sm:text-[11px] font-semibold tracking-wider text-amber-900 uppercase">
                        <span className="flex items-center space-x-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>El Cuaderno del Articuario</span>
                        </span>
                        <span>•</span>
                        <span>Crónica Destacada</span>
                      </div>
                      <h3 className="font-serif text-base sm:text-lg text-stone-950 font-normal leading-snug group-hover:text-amber-900 transition-colors">
                        {articles[0].title}
                      </h3>
                      <p className="text-xs text-stone-600 font-light line-clamp-1 leading-relaxed">
                        {articles[0].subtitle || articles[0].excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 self-end md:self-center">
                    <span className="px-3.5 py-1.5 bg-stone-900 group-hover:bg-amber-900 text-white rounded-md text-xs font-medium transition-colors shadow-2xs flex items-center space-x-1.5">
                      <span>Leer en El Cuaderno del Articuario</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              )}

              {/* Spotlight Section Heading */}
              <div id="catalog-grid-anchor" className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-[#e8e2d8] pb-3 gap-2 scroll-mt-24">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-950 tracking-tight">
                    {filters.category ? filters.category : 'Piezas Singulares'}
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {filters.category
                      ? `Colección seleccionada en ${filters.category.toLowerCase()}`
                      : 'Obras de época seleccionadas con peritaje colegiado y procedencia documentada'}
                  </p>
                </div>
                {filters.category && (
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, category: '' }))}
                    className="text-xs text-amber-800 hover:text-amber-950 underline underline-offset-2 self-start sm:self-auto"
                  >
                    Ver todas las categorías
                  </button>
                )}
              </div>

              {/* Compact Filter bar */}
              <CatalogFilters
                filters={filters}
                onFilterChange={setFilters}
                dealers={dealers}
                categories={availableCategories}
                periods={availablePeriods}
                styles={availableStyles}
                locations={availableLocations}
                totalResults={filteredItems.length}
              />

            {/* Aviso de piezas de ejemplo si existen - Solo visible para el administrador */}
            {isAdmin && items.some((it) => SAMPLE_ITEM_IDS.includes(it.id) || SAMPLE_DEALER_IDS.includes(it.dealerId)) && (
              <div className="bg-[#fcf8f2] border border-[#e8dccb] rounded-lg p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#854d0e] shadow-2xs">
                <div className="flex items-center space-x-2.5">
                  <Info className="w-4 h-4 text-[#b45309] shrink-0" />
                  <span>
                    El catálogo aún incluye <strong>piezas de ejemplo / demostración</strong>. Puedes eliminarlas definitivamente de una vez para dejar únicamente tus obras catalogadas.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDeleteSampleItemsModal(true)}
                  className="px-3.5 py-1.5 bg-[#b45309] hover:bg-[#92400e] text-white rounded font-medium shrink-0 transition-colors shadow-2xs flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Limpiar Piezas de Ejemplo</span>
                </button>
              </div>
            )}

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
            isAdmin={isAdmin}
            onOpenLoginModal={(dealerId) => {
              setLoginTargetDealerId(dealerId);
              setIsLoginModalOpen(true);
            }}
            onOpenAddDealer={isAdmin ? () => setIsDealerFormOpen(true) : undefined}
            onDeleteDealer={isAdmin ? handleDeleteDealer : undefined}
            onDeleteSampleDealers={isAdmin ? handleDeleteSampleDealers : undefined}
          />
        )}

        {/* VIEW: EL CUADERNO DEL ARTICUARIO (BLOG, OFICIOS Y MEMORIA) */}
        {currentView === 'magazine' && (
          <MagazineView
            articles={articles}
            catalogItems={items}
            dealers={dealers}
            onOpenItemDetail={(item) => setDetailItem(item)}
            onOpenArticleCreateModal={isAdmin ? () => {
              setArticleToEdit(null);
              setIsArticleFormOpen(true);
            } : undefined}
            onOpenArticleEditModal={isAdmin ? (art) => {
              setArticleToEdit(art);
              setIsArticleFormOpen(true);
            } : undefined}
            onDeleteArticle={isAdmin ? handleDeleteArticle : undefined}
            selectedArticleId={selectedArticleId}
            onSelectArticle={(art) => setSelectedArticleId(art ? art.id : null)}
            onUpdateArticle={handleUpdateArticle}
          />
        )}

        {/* VIEW 3: SERVICIOS Y FLETES ESPECIALIZADOS */}
        {currentView === 'services' && (
          <ServicesView
            dealers={dealers}
            onSelectDealer={(dealer) => {
              handleFilterByDealer(dealer.id);
            }}
          />
        )}

        {/* VIEW 4: NEGOCIACIONES ACTIVAS (COMPRADOR) */}
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
            onDeleteDealer={isAdmin ? handleDeleteDealer : undefined}
            authenticatedDealer={authenticatedDealer}
            isAdmin={isAdmin}
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
          onOpenReservation={(it) => {
            setReservationItem(it);
          }}
          onFilterByDealer={(dealerId) => {
            setDetailItem(null);
            handleFilterByDealer(dealerId);
          }}
          onDeleteItem={
            authenticatedDealer && (isAdmin || authenticatedDealer.id === detailItem.dealerId)
              ? (itemId) => {
                  setDetailItem(null);
                  handleDeleteItem(itemId);
                }
              : undefined
          }
        />
      )}

      {/* 1.1 Modal de Reserva y Seña en Custodia (Payoneer, USDT, Wire USD) */}
      {reservationItem && (
        <ReservationModal
          isOpen={!!reservationItem}
          item={reservationItem}
          dealer={dealers.find((d) => d.id === reservationItem.dealerId) || activeDealer}
          onClose={() => setReservationItem(null)}
          onReservationSuccess={(itemId, method, amount) => {
            handleChangeItemStatus(itemId, 'reserved');
            if (detailItem && detailItem.id === itemId) {
              setDetailItem((prev) => (prev ? { ...prev, status: 'reserved' } : null));
            }
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

      {/* 4. Modal de Alta de Nuevo Anticuario */}
      {isDealerFormOpen && (
        <DealerFormModal
          isOpen={isDealerFormOpen}
          onClose={() => setIsDealerFormOpen(false)}
          onSave={async (newDealer) => {
            setDealers((prev) => [...prev, newDealer]);
            setActiveDealer(newDealer);
            try {
              await saveDealerToFirestore(newDealer);
            } catch (e) {
              console.warn('Error saving dealer to Firestore:', e);
            }
          }}
        />
      )}

      {/* 5. Modal Confirmación Eliminar Piezas de Ejemplo */}
      {showDeleteSampleItemsModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-fadeIn">
            <div className="flex items-start space-x-3">
              <div className="p-2.5 bg-rose-100 text-rose-700 rounded-full shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-stone-900 font-serif">
                  ¿Eliminar todas las piezas de ejemplo?
                </h3>
                <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                  Se eliminarán permanentemente del catálogo y de la base de datos todas las piezas precargadas de demostración. Tus propias obras y libros catalogados se mantendrán intactos.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setShowDeleteSampleItemsModal(false)}
                className="px-4 py-2 border border-stone-300 text-stone-700 rounded-md text-xs font-semibold hover:bg-stone-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={async () => {
                  setShowDeleteSampleItemsModal(false);
                  await handleDeleteSampleItems();
                }}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-md text-xs font-semibold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Sí, Limpiar Piezas de Ejemplo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Modal para redactar o editar crónica en El Cuaderno */}
      {isArticleFormOpen && (
        <ArticleFormModal
          isOpen={isArticleFormOpen}
          onClose={() => {
            setIsArticleFormOpen(false);
            setArticleToEdit(null);
          }}
          onSave={handleSaveArticle}
          authorDefault={authenticatedDealer?.name || activeDealer.name}
          catalogItems={items}
          initialArticle={articleToEdit}
        />
      )}

      {/* 7. Modal de Identidad Visual y Monograma Oficial */}
      <LogoModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
      />

      {/* 8. Modal de Catálogo Automático de Pinterest Shopping */}
      <PinterestCatalogModal
        isOpen={isPinterestModalOpen}
        onClose={() => setIsPinterestModalOpen(false)}
        items={items}
      />

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-[#e5ddd1] py-8 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-serif font-bold text-stone-900 tracking-wider uppercase text-sm block">
              Articuarios • Plataforma de Arte & Antigüedades
            </span>
            <p className="mt-1 text-stone-400">
              Estándar de catalogación pericial, divulgación de oficios patrimoniales y verificación de procedencia.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-stone-600">
            {authenticatedDealer && (
              <>
                <button
                  onClick={() => setIsPinterestModalOpen(true)}
                  className="flex items-center space-x-1.5 text-red-800 hover:text-red-950 font-medium transition-colors cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  <span>Pinterest Shopping</span>
                </button>
                <button
                  onClick={() => setIsLogoModalOpen(true)}
                  className="flex items-center space-x-1 text-amber-900 hover:text-amber-700 font-medium transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>Monograma Oficial</span>
                </button>
              </>
            )}
            <button
              onClick={() => {
                setCurrentView('magazine');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center space-x-1 hover:text-amber-900 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-800" />
              <span className="font-medium text-stone-900">El Cuaderno del Articuario (Crónicas & Oficios)</span>
            </button>
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
              <span>Colección & Peritaje Exclusivo</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
