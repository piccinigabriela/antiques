import React, { useState } from 'react';
import { 
  X, 
  Award, 
  Save, 
  Image as ImageIcon, 
  Upload, 
  Building2, 
  Sparkles, 
  Wand2, 
  Loader2, 
  CheckCircle2, 
  Sliders, 
  AlertCircle,
  HelpCircle,
  Lightbulb,
  MapPin,
  BookOpen,
  Trash2,
  Star,
  Plus,
  Layers,
  Landmark,
  Eye,
  EyeOff
} from 'lucide-react';
import { AntiqueItem, CategoryType, ConservationState, Dealer } from '../types';
import { PhotoStudioModal } from './PhotoStudioModal';

interface ItemFormModalProps {
  initialItem?: AntiqueItem | null;
  activeDealer: Dealer;
  dealers?: Dealer[];
  onClose: () => void;
  onSave: (item: AntiqueItem) => void;
}

const CATEGORIES: CategoryType[] = [
  'Muebles',
  'Relojería',
  'Platería y Orfebrería',
  'Arte y Pintura',
  'Iluminación',
  'Cerámica y Porcelana',
  'Esculturas y Bronces',
  'Libros y Manuscritos',
  'Objetos de Colección',
];

const CONSERVATION_STATES: ConservationState[] = [
  'Excelente (sin restauraciones)',
  'Muy bueno (pátina original de época)',
  'Bueno (con leves marcas de uso histórico)',
  'Restauración histórica documentada',
];

const SAMPLE_ANTIQUE_IMAGES = [
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800',
  'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=800',
  'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800',
  'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800',
  'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800',
  'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800',
  'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800',
];

export const ItemFormModal: React.FC<ItemFormModalProps> = ({
  initialItem,
  activeDealer,
  dealers = [],
  onClose,
  onSave,
}) => {
  const isEditing = !!initialItem;

  const [selectedDealerId, setSelectedDealerId] = useState<string>(
    initialItem?.dealerId || activeDealer.id
  );
  const [title, setTitle] = useState(initialItem?.title || '');
  const [sku, setSku] = useState(initialItem?.sku || `ANT-${Math.floor(1000 + Math.random() * 9000)}`);
  const [category, setCategory] = useState<CategoryType>(initialItem?.category || 'Muebles');
  const [price, setPrice] = useState<number>(initialItem?.price || 2500);
  const [currency] = useState<'USD' | 'EUR'>(initialItem?.currency || 'USD');
  const [period, setPeriod] = useState(initialItem?.period || 'Siglo XIX (ca. 1880)');
  const [origin, setOrigin] = useState(initialItem?.origin || 'Francia (París)');
  const [location, setLocation] = useState(initialItem?.location || activeDealer.city.split(',')[0] || 'CABA (Buenos Aires)');
  const [style, setStyle] = useState(initialItem?.style || 'Neoclásico / Rococó');
  const [materialsStr, setMaterialsStr] = useState(
    initialItem ? initialItem.materials.join(', ') : 'Caoba maciza, Bronce cincelado, Mármol'
  );
  const [height, setHeight] = useState<number>(initialItem?.dimensions.height || 85);
  const [width, setWidth] = useState<number>(initialItem?.dimensions.width || 110);
  const [depth, setDepth] = useState<number>(initialItem?.dimensions.depth || 50);
  const [weight, setWeight] = useState(initialItem?.dimensions.weight || '35 kg');
  const [condition, setCondition] = useState<ConservationState>(
    initialItem?.condition || 'Muy bueno (pátina original de época)'
  );
  const [conditionDetails, setConditionDetails] = useState(
    initialItem?.conditionDetails || 'Pieza con pátina noble homogénea. Estructura firme sin desajustes ni carcoma.'
  );
  const [hasCertificate, setHasCertificate] = useState(initialItem?.certificate.hasCertificate || false);
  const [issuer, setIssuer] = useState(initialItem?.certificate.issuer || 'Cámara de Anticuarios y Peritos de Arte');
  const [certificateNumber, setCertificateNumber] = useState(
    initialItem?.certificate.certificateNumber || `PER-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [appraiserName, setAppraiserName] = useState(
    initialItem?.certificate.appraiserName || 'Perito Tasador Colegiado'
  );
  const [description, setDescription] = useState(
    initialItem?.description ||
      'Excelente pieza de colección con rica historia documental. Conserva los herrajes y terminaciones originales.'
  );
  const [images, setImages] = useState<string[]>(() => {
    if (initialItem?.images && initialItem.images.length > 0) {
      return initialItem.images;
    }
    return [SAMPLE_ANTIQUE_IMAGES[Math.floor(Math.random() * SAMPLE_ANTIQUE_IMAGES.length)]];
  });
  const [targetStudioIndex, setTargetStudioIndex] = useState<number>(0);
  const [urlInput, setUrlInput] = useState<string>('');
  const [status, setStatus] = useState<AntiqueItem['status']>(initialItem?.status || 'available');
  const [provenance, setProvenance] = useState<string>(initialItem?.provenance || '');
  const [hidePrice, setHidePrice] = useState<boolean>(initialItem?.hidePrice ?? (initialItem?.status === 'sold'));
  const [isHidden, setIsHidden] = useState<boolean>(initialItem?.isHidden ?? (initialItem?.status === 'hidden' || false));

  // AI Cataloging & Photo Studio State
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [aiLoadingMessage, setAiLoadingMessage] = useState('Examinando ensamble y estilo artístico...');
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiReport, setAiReport] = useState<{
    authenticityMarkers: string[];
    photoTips?: string;
  } | null>(null);
  const [showPhotoStudio, setShowPhotoStudio] = useState(false);

  const handleAutoCatalogWithAI = async (overrideImages?: string[]) => {
    const targetImages = overrideImages || images;
    if (!targetImages || targetImages.length === 0) {
      setAiError('Por favor sube o selecciona al menos una fotografía antes de iniciar la catalogación.');
      return;
    }

    setAiError(null);
    setIsAnalyzingAI(true);
    
    const isBook = category === 'Libros y Manuscritos';
    setAiLoadingMessage(
      isBook 
        ? `Analizando portada interior, colofón y encuadernación (${targetImages.length} fotos)...` 
        : `Escaneando proporciones, ensambles y estilo artístico (${targetImages.length} fotos)...`
    );

    const timer1 = setTimeout(() => {
      setAiLoadingMessage(
        isBook
          ? 'Identificando autor, título formal, editorial, fecha de impresión y técnicas gráficas...'
          : 'Determinando época histórica, estilo arquitectónico y escuela de origen...'
      );
    }, 1400);

    const timer2 = setTimeout(() => {
      setAiLoadingMessage('Redactando ficha técnica curatorial y estimación de mercado...');
    }, 2800);

    try {
      let res = await fetch('/api/ai/analyze-antique', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          images: targetImages,
        }),
      });

      // If momentary high load, do an immediate silent retry with the server's contingency path
      if (!res.ok && res.status >= 500) {
        setAiLoadingMessage('Ruta alternativa activada: reintentando análisis pericial...');
        await new Promise((r) => setTimeout(r, 1200));
        res = await fetch('/api/ai/analyze-antique', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            images: targetImages,
          }),
        });
      }

      clearTimeout(timer1);
      clearTimeout(timer2);

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'No se pudo completar el análisis pericial.');
      }

      const data = json.data;
      if (data.title) setTitle(data.title);
      if (data.category && CATEGORIES.includes(data.category)) setCategory(data.category);
      if (data.period) setPeriod(data.period);
      if (data.origin) setOrigin(data.origin);
      if (data.style) setStyle(data.style);
      if (Array.isArray(data.materials)) setMaterialsStr(data.materials.join(', '));
      if (data.estimatedDimensions) {
        if (data.estimatedDimensions.height) setHeight(data.estimatedDimensions.height);
        if (data.estimatedDimensions.width) setWidth(data.estimatedDimensions.width);
        if (data.estimatedDimensions.depth) setDepth(data.estimatedDimensions.depth);
        if (data.estimatedDimensions.weight) setWeight(data.estimatedDimensions.weight);
      }
      if (data.condition && CONSERVATION_STATES.includes(data.condition)) {
        setCondition(data.condition);
      }
      if (data.conditionDetails) setConditionDetails(data.conditionDetails);
      if (data.description) setDescription(data.description);
      if (data.estimatedValueUSD && typeof data.estimatedValueUSD === 'number') {
        setPrice(data.estimatedValueUSD);
      }

      setAiReport({
        authenticityMarkers: data.authenticityMarkers || [],
        photoTips: data.photoTips,
      });
    } catch (err: any) {
      console.error('Error in AI analysis:', err);
      let msg = err.message || 'Error de conexión con el servicio pericial de IA.';
      if (msg.includes('503') || msg.includes('high demand') || msg.includes('UNAVAILABLE')) {
        msg = 'Alta demanda momentánea en la red de IA. Hemos activado la ruta de contingencia; por favor pulsa nuevamente en «Catalogar con Foto (IA)».';
      }
      setAiError(msg);
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  const handleMultipleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const rawDataUrl = reader.result;
          // Optimize/compress image client-side to ensure instant transfer, reliable Firestore persistence and AI compatibility
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxDimension = 1000; // Optimal resolution for web display and under 300KB for Firestore
            let w = img.width;
            let h = img.height;
            if (w > maxDimension || h > maxDimension) {
              if (w > h) {
                h = Math.round((h * maxDimension) / w);
                w = maxDimension;
              } else {
                w = Math.round((w * maxDimension) / h);
                h = maxDimension;
              }
            }
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, w, h);
              const compressed = canvas.toDataURL('image/jpeg', 0.82);
              setImages((prev) => [...prev, compressed]);
            } else {
              setImages((prev) => [...prev, rawDataUrl]);
            }
          };
          img.onerror = () => {
            setImages((prev) => [...prev, rawDataUrl]);
          };
          img.src = rawDataUrl;
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleAddUrlImage = () => {
    if (urlInput.trim()) {
      setImages((prev) => [...prev, urlInput.trim()]);
      setUrlInput('');
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetPrimaryImage = (indexToPrimary: number) => {
    setImages((prev) => {
      const selected = prev[indexToPrimary];
      const rest = prev.filter((_, idx) => idx !== indexToPrimary);
      return [selected, ...rest];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const materials = materialsStr
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);

    const updatedItem: AntiqueItem = {
      id: initialItem?.id || `item-${Date.now()}`,
      sku,
      title,
      category,
      price,
      currency,
      period,
      origin,
      style,
      materials,
      dimensions: {
        height,
        width,
        depth,
        unit: 'cm',
        weight: weight || undefined,
      },
      condition,
      conditionDetails,
      certificate: {
        hasCertificate,
        issuer: hasCertificate ? issuer : undefined,
        certificateNumber: hasCertificate ? certificateNumber : undefined,
        appraiserName: hasCertificate ? appraiserName : undefined,
        yearCertified: hasCertificate ? new Date().getFullYear().toString() : undefined,
      },
      description,
      images: images.length > 0 ? images : [SAMPLE_ANTIQUE_IMAGES[0]],
      status: isHidden && status === 'available' ? 'hidden' : status,
      dealerId: selectedDealerId || activeDealer.id,
      location: location.trim() || undefined,
      provenance: provenance.trim() || undefined,
      hidePrice: hidePrice || status === 'sold',
      isHidden: isHidden || status === 'hidden',
      featured: initialItem?.featured || false,
      createdAt: initialItem?.createdAt || new Date().toISOString(),
    };

    onSave(updatedItem);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div 
        id="item-form-modal"
        className="relative bg-[#fcfbf9] w-full max-w-4xl rounded-xl shadow-2xl border border-[#e2dacf] overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#f6f2eb] border-b border-[#e5ddd1] shrink-0">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#b45309]">
              {dealers.find(d => d.id === selectedDealerId)?.name || activeDealer.name}
            </span>
            <h2 className="font-serif text-xl font-bold text-[#1c1917]">
              {isEditing ? 'Editar Ficha Técnica de Anticuario' : 'Incorporar Nueva Pieza al Catálogo'}
            </h2>
          </div>
          <button
            onClick={onClose}
            id="close-item-form-modal-btn"
            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* VIP Module: Peritaje Asistido por IA & Estudio Digital */}
          <div className="bg-gradient-to-r from-[#211d18] via-[#2d2720] to-[#1c1917] rounded-xl p-5 text-stone-100 border border-amber-900/40 shadow-lg relative overflow-hidden">
            {/* Background luxury accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center space-x-2">
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Módulo Pro Anticuarios</span>
                  </span>
                  <span className="text-[11px] text-stone-400">
                    Gemini Vision Multimodal • Soporte Multifoto
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-amber-100">
                  Catalogación Pericial con IA & Estudio de Fotografía
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Sube una o varias fotos (para libros: tapa, portada interior y colofón; para muebles: ensamble y sellos). La IA cruzará todas las imágenes para redactar la ficha técnica y datación en 3 segundos.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  disabled={isAnalyzingAI || images.length === 0}
                  onClick={() => handleAutoCatalogWithAI()}
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-md transition-all flex items-center space-x-2 cursor-pointer"
                >
                  {isAnalyzingAI ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-200" />
                      <span>Analizando ({images.length} fotos)...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 text-amber-200" />
                      <span>⚡ Catalogar con Fotos (IA) {images.length > 0 && `(${images.length})`}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTargetStudioIndex(0);
                    setShowPhotoStudio(true);
                  }}
                  className="px-3.5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg border border-stone-700 transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>🎨 Retoque 1stdibs</span>
                </button>
              </div>
            </div>

            {/* In-progress loading banner */}
            {isAnalyzingAI && (
              <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center space-x-3 text-xs text-amber-300 animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{aiLoadingMessage}</span>
              </div>
            )}

            {/* Error banner if any */}
            {aiError && (
              <div className="mt-3 pt-3 border-t border-red-900/40 text-xs text-red-300 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{aiError}</span>
              </div>
            )}

            {/* AI Report Card when completed */}
            {aiReport && (
              <div className="mt-4 pt-3 border-t border-amber-900/40 bg-amber-950/30 rounded-lg p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between text-amber-300 font-semibold">
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Ficha Catalogada Exitosamente • Señas de Autenticidad Detectadas:</span>
                  </div>
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider">Peritaje Asistido</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-stone-300">
                  {aiReport.authenticityMarkers.map((marker, idx) => (
                    <div key={idx} className="bg-stone-900/80 border border-stone-800 rounded p-2 text-[11px] flex items-start space-x-1.5">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{marker}</span>
                    </div>
                  ))}
                </div>
                {aiReport.photoTips && (
                  <div className="text-[11px] text-stone-400 flex items-center space-x-1.5 pt-1">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span><strong>Consejo pericial / fotográfico:</strong> {aiReport.photoTips}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 1: Basic Info & Pricing */}
          <div className="bg-white border border-[#e5ddd1] rounded-lg p-5 space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900 border-b border-stone-200 pb-2">
              1. Identificación y Valoración
            </h3>

            {/* Anticuario selector */}
            {dealers.length > 0 && (
              <div className="bg-[#fcfaf6] border border-[#e8dfd3] p-3 rounded-md">
                <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#b45309]" />
                  <span>Anticuario / Colección Responsable de la Pieza *</span>
                </label>
                <select
                  value={selectedDealerId}
                  onChange={(e) => setSelectedDealerId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md text-xs font-medium text-stone-900 focus:ring-1 focus:ring-[#b45309]"
                >
                  {dealers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.city})
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-stone-500 block mt-1">
                  Las consultas y negociaciones de esta pieza se coordinarán por el WhatsApp de este anticuario.
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Título Descriptivo de la Pieza *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Cómoda Commode Época Luis XV con Marquetería..."
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-md text-sm text-stone-900 focus:ring-2 focus:ring-[#b45309]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Referencia / SKU de Anticuario *
                </label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-md text-sm font-mono text-stone-900 focus:ring-2 focus:ring-[#b45309]/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Categoría de Anticuario *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryType)}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-md text-sm text-stone-900 focus:ring-2 focus:ring-[#b45309]/50"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Precio de Lista (USD) {status !== 'sold' && '*'}
                </label>
                <input
                  type="number"
                  required={status !== 'sold'}
                  min={0}
                  value={price || ''}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder={status === 'sold' ? 'Opcional (No se muestra al público)' : '2500'}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-md text-sm font-serif font-bold text-stone-900 focus:ring-2 focus:ring-[#b45309]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Estado de Inventario
                </label>
                <select
                  value={status}
                  onChange={(e) => {
                    const newStatus = e.target.value as AntiqueItem['status'];
                    setStatus(newStatus);
                    if (newStatus === 'sold') {
                      setHidePrice(true);
                    }
                    if (newStatus === 'hidden') {
                      setIsHidden(true);
                    }
                  }}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-md text-sm text-stone-900 focus:ring-2 focus:ring-[#b45309]/50 font-medium"
                >
                  <option value="available">Disponible</option>
                  <option value="in_negotiation">En Negociación</option>
                  <option value="reserved">Reservado</option>
                  <option value="sold">Vendido (Archivo / Colección Privada)</option>
                  <option value="hidden">Oculto / Pausado (No visible en catálogo)</option>
                </select>
              </div>
            </div>

            {/* Configuración de Visibilidad & Privacidad */}
            <div className="pt-3 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Toggle Ocultar Producto */}
              <div className={`p-3 rounded-lg border transition-all ${
                isHidden || status === 'hidden'
                  ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                  : 'bg-[#faf8f5] border-stone-200 text-stone-800'
              }`}>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isHidden || status === 'hidden'}
                    onChange={(e) => {
                      setIsHidden(e.target.checked);
                      if (!e.target.checked && status === 'hidden') {
                        setStatus('available');
                      }
                    }}
                    className="mt-0.5 rounded text-amber-700 focus:ring-amber-600"
                  />
                  <div>
                    <span className="text-xs font-bold flex items-center space-x-1.5">
                      {isHidden || status === 'hidden' ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-amber-700" />
                          <span>Producto Oculto del Catálogo</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Producto Visible en el Catálogo</span>
                        </>
                      )}
                    </span>
                    <p className="text-[11px] text-stone-600 mt-0.5 leading-tight">
                      {isHidden || status === 'hidden'
                        ? 'La pieza NO aparecerá en el catálogo público ni en búsquedas. Solo tú podrás verla en tu panel de anticuario para reactivarla cuando quieras.'
                        : 'La pieza se muestra públicamente en Articuarios y en la sincronización de Pinterest.'}
                    </p>
                  </div>
                </label>
              </div>

              {/* Toggle Ocultar Precio */}
              <div className={`p-3 rounded-lg border transition-all ${
                hidePrice || status === 'sold'
                  ? 'bg-stone-100 border-stone-300 text-stone-800'
                  : 'bg-[#faf8f5] border-stone-200 text-stone-800'
              }`}>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hidePrice || status === 'sold'}
                    onChange={(e) => setHidePrice(e.target.checked)}
                    className="mt-0.5 rounded text-[#b45309] focus:ring-[#b45309]"
                  />
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">
                      Ocultar Precio al Público
                    </span>
                    <p className="text-[11px] text-stone-600 mt-0.5 leading-tight">
                      {status === 'sold'
                        ? 'Automático para ventas históricas: figurará como «Vendido • Archivo de Colección» sin valor numérico.'
                        : 'La pieza se exhibe con la leyenda «Consultar tasación privada».'}
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: Specific Antique Technical Fields */}
          <div className="bg-white border border-[#e5ddd1] rounded-lg p-5 space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900 border-b border-stone-200 pb-2 flex items-center justify-between">
              <span>2. Ficha Técnica Especializada de Anticuario</span>
              <span className="text-xs text-[#92400e] bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-sans font-normal">
                Datos clave para tasación y venta pericial
              </span>
            </h3>

            {/* Procedencia / Colección de Pertenencia */}
            <div className="bg-[#fcfaf5] border border-amber-200/90 p-3.5 rounded-md space-y-1.5">
              <label className="block text-xs font-bold text-amber-950 flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <Landmark className="w-4 h-4 text-amber-800" />
                  <span>Pertenece a / Procedencia / Colección de Origen (Opcional)</span>
                </span>
                <span className="text-[10px] text-amber-800 font-normal">
                  Ej: Colección privada de...
                </span>
              </label>
              <input
                type="text"
                value={provenance}
                onChange={(e) => setProvenance(e.target.value)}
                placeholder="Ej: Colección privada de la familia Alvear / Colección particular / Acervo histórico..."
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md text-sm text-stone-900 focus:ring-2 focus:ring-[#b45309]/50 placeholder:text-stone-400 font-serif"
              />
              <p className="text-[11px] text-stone-500">
                Aparecerá destacado en la ficha de la pieza para certificar origen, linaje o pinacoteca de pertenencia.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Época / Período *
                </label>
                <input
                  type="text"
                  required
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  placeholder="Ej: Siglo XIX (ca. 1880), Mid-Century 1960s..."
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-md text-sm text-stone-900 focus:ring-2 focus:ring-[#b45309]/50"
                />
                {/* Era shortcuts */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  <button
                    type="button"
                    onClick={() => { setPeriod('Siglo XIX (ca. 1880)'); if(!style) setStyle('Neoclásico / Victoriano'); }}
                    className="text-[10px] px-1.5 py-0.5 bg-stone-100 hover:bg-amber-100 text-stone-700 rounded transition-colors"
                  >
                    + Siglo XIX
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPeriod('Art Déco (ca. 1930)'); if(!style) setStyle('Art Déco Francés'); }}
                    className="text-[10px] px-1.5 py-0.5 bg-stone-100 hover:bg-amber-100 text-stone-700 rounded transition-colors"
                  >
                    + Art Déco
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPeriod('Mid-Century Modern (ca. 1960)'); if(!style) setStyle('Mid-Century Modernista'); }}
                    className="text-[10px] px-1.5 py-0.5 bg-stone-100 hover:bg-amber-100 text-stone-700 rounded transition-colors"
                  >
                    + Mid-Century 60s
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPeriod('Vintage Siglo XX (ca. 1970)'); if(!style) setStyle('Diseño Vintage Siglo XX'); }}
                    className="text-[10px] px-1.5 py-0.5 bg-stone-100 hover:bg-amber-100 text-stone-700 rounded transition-colors"
                  >
                    + Vintage 70s
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Procedencia Geográfica / Taller *
                </label>
                <input
                  type="text"
                  required
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="Ej: Francia (París), Italia (Milán)..."
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-md text-sm text-stone-900 focus:ring-2 focus:ring-[#b45309]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Estilo o Movimiento Artístico *
                </label>
                <input
                  type="text"
                  required
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  placeholder="Ej: Rococó, Mid-Century, Art Déco..."
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-md text-sm text-stone-900 focus:ring-2 focus:ring-[#b45309]/50"
                />
              </div>
            </div>

            {/* Ubicación de la Pieza (Localización física) */}
            <div className="bg-[#fbf9f6] border border-[#ded6c9] p-3.5 rounded-md">
              <label className="block text-xs font-semibold text-stone-800 mb-1 flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-[#b45309]" />
                  <span>Ubicación Geográfica de la Pieza (Para visitas y fletes) *</span>
                </span>
                <span className="text-[11px] text-stone-500 font-normal">
                  Ej: CABA, San Fernando, Tigre, Mendoza...
                </span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ej: CABA (Capital Federal), San Fernando (Prov. Bs. As.), Tigre, Mendoza..."
                  className="flex-1 px-3 py-2 bg-white border border-stone-300 rounded-md text-sm text-stone-900 focus:ring-2 focus:ring-[#b45309]/50 font-medium"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-[10px] text-stone-400 self-center mr-1">Sugerencias rápidas:</span>
                {['CABA (Capital Federal)', 'San Fernando (Prov. Bs. As.)', 'Tigre (Prov. Bs. As.)', 'San Isidro', 'Mendoza', 'Córdoba'].map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setLocation(loc)}
                    className="text-[11px] px-2 py-0.5 bg-white hover:bg-amber-50 hover:border-amber-300 border border-stone-200 text-stone-700 rounded transition-colors cursor-pointer"
                  >
                    {loc}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-stone-500 mt-1.5">
                * Por seguridad solo se indica la zona o localidad en la ficha. La dirección exacta para visitas se coordina por privado.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Materiales y Técnicas de Manufactura (separados por coma)
              </label>
              <input
                type="text"
                value={materialsStr}
                onChange={(e) => setMaterialsStr(e.target.value)}
                placeholder="Ej: Palisandro de Río, Bronce al mercurio, Mármol Portoro, Pan de oro 24k"
                className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-md text-sm text-stone-900 focus:ring-2 focus:ring-[#b45309]/50"
              />
            </div>

            {/* Dimensiones */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Dimensiones Físicas y Peso
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <span className="text-[11px] text-stone-500">Alto (cm)</span>
                  <input
                    type="number"
                    value={height || ''}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-[#faf8f5] border border-stone-300 rounded text-sm text-stone-900"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-stone-500">Ancho (cm)</span>
                  <input
                    type="number"
                    value={width || ''}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-[#faf8f5] border border-stone-300 rounded text-sm text-stone-900"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-stone-500">Profundidad (cm)</span>
                  <input
                    type="number"
                    value={depth || ''}
                    onChange={(e) => setDepth(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-[#faf8f5] border border-stone-300 rounded text-sm text-stone-900"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-stone-500">Peso aproximado</span>
                  <input
                    type="text"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Ej: 24 kg"
                    className="w-full px-2.5 py-1.5 bg-[#faf8f5] border border-stone-300 rounded text-sm text-stone-900"
                  />
                </div>
              </div>
            </div>

            {/* Estado de Conservación */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Estado de Conservación y Pátina *
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ConservationState)}
                className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-md text-sm text-stone-900 mb-2"
              >
                {CONSERVATION_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>

              <textarea
                rows={2}
                value={conditionDetails}
                onChange={(e) => setConditionDetails(e.target.value)}
                placeholder="Detalle pericial: desgastes propios del paso del tiempo, intervenciones históricas, estabilidad..."
                className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-md text-xs text-stone-900"
              ></textarea>
            </div>
          </div>

          {/* Section 3: Certificado de Autenticidad */}
          <div className="bg-white border border-[#e5ddd1] rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-[#b45309]" />
                <h3 className="font-serif font-bold text-base text-stone-900">
                  3. Certificado de Autenticidad & Peritaje
                </h3>
              </div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasCertificate}
                  onChange={(e) => setHasCertificate(e.target.checked)}
                  className="rounded text-[#b45309] focus:ring-[#b45309] w-4 h-4"
                />
                <span className="text-xs font-semibold text-stone-800">
                  ¿Tiene Certificado Pericial Oficial?
                </span>
              </label>
            </div>

            {!hasCertificate ? (
              <p className="text-[11px] text-stone-500 italic">
                Dejar sin marcar si la pieza no cuenta con documentación pericial formal. La ficha se publicará limpia e impecable, sin mostrar espacios vacíos ni evidenciar que no está certificada.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 animate-fadeIn">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Entidad Emisora / Cámara
                  </label>
                  <input
                    type="text"
                    value={issuer}
                    onChange={(e) => setIssuer(e.target.value)}
                    placeholder="Ej: Cámara Argentina de Anticuarios"
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-md text-xs text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Número de Registro / Certificado
                  </label>
                  <input
                    type="text"
                    value={certificateNumber}
                    onChange={(e) => setCertificateNumber(e.target.value)}
                    placeholder="Ej: CAA-2024-9104"
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-md text-xs text-stone-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Perito Tasador Responsable
                  </label>
                  <input
                    type="text"
                    value={appraiserName}
                    onChange={(e) => setAppraiserName(e.target.value)}
                    placeholder="Ej: Prof. Héctor Valenzuela"
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-md text-xs text-stone-900"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Imagen y Reseña */}
          <div className="bg-white border border-[#e5ddd1] rounded-lg p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-200 pb-2 gap-2">
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900 flex items-center space-x-2">
                  <span>4. Fotografías de la Pieza (Galería Multifoto) y Reseña</span>
                </h3>
                <p className="text-xs text-stone-500">
                  Sube múltiples fotos para capturar portada, colofón, lomo, grabados o sellos de procedencia.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-amber-100 text-amber-900 font-semibold px-2.5 py-1 rounded-full border border-amber-300 flex items-center space-x-1">
                  <Layers className="w-3.5 h-3.5 text-[#b45309]" />
                  <span>{images.length} {images.length === 1 ? 'fotografía' : 'fotografías'}</span>
                </span>
              </div>
            </div>

            {/* Specialized Guide for Books & Multi-faceted Antiques */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-3.5 text-xs text-stone-700 space-y-2">
              <div className="flex items-start space-x-2">
                <BookOpen className="w-4 h-4 text-[#b45309] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-stone-900">
                    ¿Cómo subir las fotos de un Libro Antiguo o Manuscrito para catalogar?
                  </p>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Los datos de un libro están dispersos en distintas partes. Te recomendamos seleccionar y subir juntos:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1">
                    <div className="bg-white/90 p-2 rounded border border-amber-200 text-[11px]">
                      <span className="font-bold text-[#b45309]">1. Tapa y Lomo:</span>
                      <p className="text-stone-600 mt-0.5">Encuadernación (piel, pergamino, nervios, dorados).</p>
                    </div>
                    <div className="bg-white/90 p-2 rounded border border-amber-200 text-[11px]">
                      <span className="font-bold text-[#b45309]">2. Portada Interior:</span>
                      <p className="text-stone-600 mt-0.5">Autor, título formal, editorial, imprenta y ciudad.</p>
                    </div>
                    <div className="bg-white/90 p-2 rounded border border-amber-200 text-[11px]">
                      <span className="font-bold text-[#b45309]">3. Colofón final:</span>
                      <p className="text-stone-600 mt-0.5">Fecha exacta de impresión y ejemplar numerado.</p>
                    </div>
                    <div className="bg-white/90 p-2 rounded border border-amber-200 text-[11px]">
                      <span className="font-bold text-[#b45309]">4. Grabados / Papel:</span>
                      <p className="text-stone-600 mt-0.5">Láminas, aguafuertes y estado (foxing, barbas).</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-amber-900/80 italic pt-0.5">
                    ✨ Gemini Vision cruzará todas las fotografías en simultáneo para redactar la ficha pericial bibliográfica.
                  </p>
                </div>
              </div>
            </div>

            {/* Upload Controls Bar */}
            <div className="space-y-3 bg-[#faf8f5] p-3.5 rounded-lg border border-stone-200">
              <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
                {/* Multi file upload button */}
                <label className="px-4 py-2.5 bg-[#b45309] hover:bg-[#92400e] text-white rounded-md text-xs font-semibold flex items-center justify-center space-x-2 cursor-pointer shadow-xs transition-colors shrink-0">
                  <Upload className="w-4 h-4" />
                  <span>Subir fotos (selecciona una o varias)</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleMultipleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Paste URL input */}
                <div className="flex-1 flex items-center gap-1.5">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddUrlImage();
                      }
                    }}
                    placeholder="O pegar URL web de otra imagen..."
                    className="flex-1 px-3 py-2 bg-white border border-stone-300 rounded-md text-xs text-stone-900 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddUrlImage}
                    disabled={!urlInput.trim()}
                    className="px-3 py-2 bg-stone-200 hover:bg-stone-300 disabled:opacity-50 text-stone-800 rounded-md text-xs font-semibold flex items-center space-x-1 shrink-0 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar</span>
                  </button>
                </div>

                {/* AI Catalog Button inside section */}
                <button
                  type="button"
                  disabled={isAnalyzingAI || images.length === 0}
                  onClick={() => handleAutoCatalogWithAI()}
                  className="px-3.5 py-2.5 bg-amber-100 hover:bg-amber-200 border border-amber-300 text-[#92400e] rounded-md text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors shrink-0 cursor-pointer"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Catalogar Todo ({images.length})</span>
                </button>
              </div>

              {/* Sample antique images picker */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1">
                <span className="text-[11px] text-stone-500 flex items-center shrink-0">
                  <ImageIcon className="w-3 h-3 mr-1 text-stone-400" />
                  Muestras de prueba:
                </span>
                {SAMPLE_ANTIQUE_IMAGES.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    title="Añadir fotografía de muestra"
                    onClick={() => {
                      setImages((prev) => [...prev, img]);
                    }}
                    className="w-9 h-9 rounded overflow-hidden border border-stone-300 hover:border-[#b45309] shrink-0 transition-all hover:scale-105"
                  >
                    <img src={img} alt="Sample" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Uploaded Images Gallery Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-600">
                <span className="font-semibold">
                  Fotografías cargadas ({images.length}):
                </span>
                <span className="text-[11px] text-stone-400">
                  * La primera foto es la Tapa o Imagen de Portada en la tienda
                </span>
              </div>

              {images.length === 0 ? (
                <div className="p-8 border-2 border-dashed border-stone-300 rounded-lg text-center bg-stone-50/50">
                  <ImageIcon className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-stone-700">No hay fotos cargadas todavía</p>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Sube las fotos de tu libro o pieza para que la IA extraiga los datos automáticamente.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className={`relative group bg-stone-100 rounded-lg border overflow-hidden transition-all shadow-2xs flex flex-col ${
                        index === 0 ? 'border-[#b45309] ring-2 ring-[#b45309]/30' : 'border-stone-300 hover:border-stone-400'
                      }`}
                    >
                      {/* Image Preview */}
                      <div className="relative aspect-4/3 bg-stone-200 overflow-hidden">
                        <img
                          src={img}
                          alt={`Foto ${index + 1}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />

                        {/* Top badge */}
                        <div className="absolute top-1.5 left-1.5">
                          {index === 0 ? (
                            <span className="bg-[#b45309] text-white font-bold text-[10px] px-2 py-0.5 rounded shadow flex items-center space-x-1">
                              <Star className="w-3 h-3 fill-white" />
                              <span>1. Tapa / Principal</span>
                            </span>
                          ) : (
                            <span className="bg-stone-900/80 text-white text-[10px] px-2 py-0.5 rounded">
                              Foto #{index + 1}
                            </span>
                          )}
                        </div>

                        {/* Quick Retouch on hover */}
                        <button
                          type="button"
                          onClick={() => {
                            setTargetStudioIndex(index);
                            setShowPhotoStudio(true);
                          }}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-semibold cursor-pointer"
                        >
                          <Sliders className="w-4 h-4 mb-1 text-amber-300" />
                          <span>Retocar Iluminación</span>
                        </button>
                      </div>

                      {/* Control bar for each photo */}
                      <div className="p-2 bg-white flex items-center justify-between border-t border-stone-200 text-xs">
                        {index !== 0 ? (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(index)}
                            className="text-[11px] text-[#b45309] hover:text-[#92400e] font-semibold flex items-center space-x-1"
                            title="Hacer que esta foto sea la portada principal"
                          >
                            <Star className="w-3 h-3" />
                            <span>Principal</span>
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                            Portada
                          </span>
                        )}

                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              setTargetStudioIndex(index);
                              setShowPhotoStudio(true);
                            }}
                            className="text-stone-600 hover:text-stone-900 p-1"
                            title="Retocar en Estudio Digital"
                          >
                            <Sliders className="w-3.5 h-3.5 text-stone-500 hover:text-[#b45309]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="text-stone-400 hover:text-red-600 p-1"
                            title="Eliminar esta foto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Reseña Histórica y Descripción Narrativa
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Narrativa histórica, procedencia anterior de colecciones privadas, detalles artísticos..."
                className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-md text-xs text-stone-900"
              ></textarea>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#e5ddd1] flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              id="save-item-btn"
              type="submit"
              className="py-2.5 px-6 bg-[#b45309] hover:bg-[#92400e] text-white text-xs font-semibold rounded-md transition-colors flex items-center space-x-2 shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Guardar Cambios en la Ficha' : 'Publicar Pieza en el Catálogo'}</span>
            </button>
          </div>
        </form>

        {/* Photo Studio Modal */}
        {showPhotoStudio && (
          <PhotoStudioModal
            initialImageUrl={images[targetStudioIndex] || images[0] || ''}
            onClose={() => setShowPhotoStudio(false)}
            onApplyImage={(enhancedUrl) => {
              setImages((prev) =>
                prev.map((img, i) => (i === targetStudioIndex ? enhancedUrl : img))
              );
            }}
          />
        )}
      </div>
    </div>
  );
};
