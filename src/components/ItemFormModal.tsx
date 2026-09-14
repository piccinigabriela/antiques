import React, { useState } from 'react';
import { X, Award, Save, Image as ImageIcon, Upload, Building2 } from 'lucide-react';
import { AntiqueItem, CategoryType, ConservationState, Dealer } from '../types';

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
  const [imageUrl, setImageUrl] = useState(
    initialItem?.images[0] || SAMPLE_ANTIQUE_IMAGES[Math.floor(Math.random() * SAMPLE_ANTIQUE_IMAGES.length)]
  );
  const [status, setStatus] = useState<AntiqueItem['status']>(initialItem?.status || 'available');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
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
      images: [imageUrl],
      status,
      dealerId: selectedDealerId || activeDealer.id,
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
                  Precio de Lista (USD) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={price || ''}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-md text-sm font-serif font-bold text-stone-900 focus:ring-2 focus:ring-[#b45309]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Estado de Inventario
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as AntiqueItem['status'])}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-md text-sm text-stone-900 focus:ring-2 focus:ring-[#b45309]/50"
                >
                  <option value="available">Disponible</option>
                  <option value="in_negotiation">En Negociación</option>
                  <option value="reserved">Reservado</option>
                  <option value="sold">Vendido</option>
                </select>
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Época / Período Histórico *
                </label>
                <input
                  type="text"
                  required
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  placeholder="Ej: Luis XV (ca. 1750), Art Déco 1930..."
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-md text-sm text-stone-900 focus:ring-2 focus:ring-[#b45309]/50"
                />
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
                  placeholder="Ej: Francia (París), Inglaterra (Londres)..."
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
                  placeholder="Ej: Rococó, Biedermeier, Bauhaus..."
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-md text-sm text-stone-900 focus:ring-2 focus:ring-[#b45309]/50"
                />
              </div>
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
            <h3 className="font-serif font-bold text-base text-stone-900 border-b border-stone-200 pb-2">
              4. Fotografía y Reseña Histórica
            </h3>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Fotografía Principal de la Pieza *
              </label>
              
              <div className="flex flex-col sm:flex-row gap-3 items-start">
                {/* Thumbnail preview */}
                {imageUrl && (
                  <div className="w-24 h-24 rounded-lg overflow-hidden border border-stone-300 shrink-0 bg-stone-100 relative group shadow-2xs">
                    <img
                      src={imageUrl}
                      alt="Vista previa"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] text-center py-0.5">
                      Vista previa
                    </span>
                  </div>
                )}

                <div className="flex-1 w-full space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      required
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Pegar URL de la imagen o subir archivo..."
                      className="flex-1 px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-md text-xs text-stone-900 font-mono"
                    />

                    <label className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-md text-xs font-semibold flex items-center justify-center space-x-1.5 cursor-pointer border border-stone-300 transition-colors shrink-0">
                      <Upload className="w-3.5 h-3.5 text-[#b45309]" />
                      <span>Subir desde dispositivo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Sample antique images picker */}
                  <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1">
                    <span className="text-[11px] text-stone-500 flex items-center shrink-0">
                      <ImageIcon className="w-3 h-3 mr-1 text-stone-400" />
                      O elegir muestra:
                    </span>
                    {SAMPLE_ANTIQUE_IMAGES.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setImageUrl(img)}
                        className={`w-8 h-8 rounded overflow-hidden border shrink-0 transition-all ${
                          imageUrl === img ? 'border-[#b45309] ring-2 ring-[#b45309]/30' : 'border-stone-300 hover:border-stone-400'
                        }`}
                      >
                        <img src={img} alt="Sample" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
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
      </div>
    </div>
  );
};
