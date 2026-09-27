import React, { useState, useEffect } from 'react';
import { X, Feather, Sparkles, Image as ImageIcon, Plus, Trash2, Link2, Search, Check, Upload, Edit3 } from 'lucide-react';
import { BlogArticle, ArticleCategory, AntiqueItem } from '../types';

interface ArticleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (article: BlogArticle) => void;
  authorDefault?: string;
  catalogItems?: AntiqueItem[];
  initialArticle?: BlogArticle | null;
}

export const ArticleFormModal: React.FC<ArticleFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  authorDefault = 'Anticuario & Maestro de Taller',
  catalogItems = [],
  initialArticle = null,
}) => {
  const isEditing = Boolean(initialArticle);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<ArticleCategory>('Oficios & Restauración');
  const [readTime, setReadTime] = useState('5 min de lectura');
  const [author, setAuthor] = useState(authorDefault);
  const [authorRole, setAuthorRole] = useState('Restaurador y Anticuario Colegiado');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80');
  const [excerpt, setExcerpt] = useState('');
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [searchCatalogQuery, setSearchCatalogQuery] = useState('');
  const [sections, setSections] = useState<{ sectionTitle: string; paragraphs: string; quote: string; tipBox: string }[]>([
    {
      sectionTitle: '1. El oficio y su memoria',
      paragraphs: '',
      quote: '',
      tipBox: '',
    },
  ]);
  const [tags, setTags] = useState('Dorado, Taller, Oficios, Antigüedades');

  // Populate form fields when modal opens or initialArticle changes
  useEffect(() => {
    if (initialArticle) {
      setTitle(initialArticle.title || '');
      setSubtitle(initialArticle.subtitle || '');
      setCategory(initialArticle.category || 'Oficios & Restauración');
      setReadTime(initialArticle.readTime || '5 min de lectura');
      setAuthor(initialArticle.author || authorDefault);
      setAuthorRole(initialArticle.authorRole || 'Restaurador y Anticuario Colegiado');
      setCoverImage(initialArticle.coverImage || '');
      setExcerpt(initialArticle.excerpt || '');
      setSelectedItemIds(initialArticle.relatedItemIds || []);
      setTags(initialArticle.tags ? initialArticle.tags.join(', ') : '');
      setSections(
        initialArticle.sections && initialArticle.sections.length > 0
          ? initialArticle.sections.map((s) => ({
              sectionTitle: s.sectionTitle || '',
              paragraphs: Array.isArray(s.paragraphs) ? s.paragraphs.join('\n\n') : '',
              quote: s.quote || '',
              tipBox: s.tipBox || '',
            }))
          : [
              {
                sectionTitle: '1. El oficio y su memoria',
                paragraphs: '',
                quote: '',
                tipBox: '',
              },
            ]
      );
    } else {
      setTitle('');
      setSubtitle('');
      setCategory('Oficios & Restauración');
      setReadTime('5 min de lectura');
      setAuthor(authorDefault);
      setAuthorRole('Restaurador y Anticuario Colegiado');
      setCoverImage('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80');
      setExcerpt('');
      setSelectedItemIds([]);
      setTags('Dorado, Taller, Oficios, Antigüedades');
      setSections([
        {
          sectionTitle: '1. El oficio y su memoria',
          paragraphs: '',
          quote: '',
          tipBox: '',
        },
      ]);
    }
  }, [initialArticle, isOpen, authorDefault]);

  if (!isOpen) return null;

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setCoverImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredCatalogItems = catalogItems.filter((it) => {
    if (!searchCatalogQuery.trim()) return true;
    const q = searchCatalogQuery.toLowerCase();
    return (
      it.title.toLowerCase().includes(q) ||
      it.style.toLowerCase().includes(q) ||
      it.period.toLowerCase().includes(q) ||
      it.category.toLowerCase().includes(q)
    );
  });

  const handleAddSection = () => {
    setSections((prev) => [
      ...prev,
      {
        sectionTitle: `${prev.length + 1}. Nuevo apartado`,
        paragraphs: '',
        quote: '',
        tipBox: '',
      },
    ]);
  };

  const handleRemoveSection = (index: number) => {
    if (sections.length <= 1) return;
    setSections((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim()) return;

    const savedArticle: BlogArticle = {
      ...(initialArticle || {}),
      id: initialArticle ? initialArticle.id : `art-${Date.now()}`,
      slug: initialArticle?.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title: title.trim(),
      subtitle: subtitle.trim(),
      category,
      readTime: readTime.trim() || '4 min de lectura',
      author: author.trim() || 'Anticuario Colegiado',
      authorRole: authorRole.trim() || 'Especialista en Patrimonio',
      date: initialArticle?.date || new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
      coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
      excerpt: excerpt.trim(),
      sections: sections.map((s) => ({
        sectionTitle: s.sectionTitle.trim() || undefined,
        paragraphs: s.paragraphs
          .split('\n\n')
          .map((p) => p.trim())
          .filter(Boolean),
        quote: s.quote.trim() || undefined,
        tipBox: s.tipBox.trim() || undefined,
      })),
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      relatedItemIds: selectedItemIds.length > 0 ? selectedItemIds : undefined,
      featured: initialArticle ? initialArticle.featured : false,
    };

    onSave(savedArticle);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 animate-fadeIn">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-[#faf8f5] rounded-t-xl shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-stone-900 text-amber-300 flex items-center justify-center">
              {isEditing ? <Edit3 className="w-4 h-4" /> : <Feather className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-serif text-lg font-normal text-stone-900">
                {isEditing ? 'Editar crónica del Cuaderno' : 'Redactar nueva crónica para El Cuaderno del Articuario'}
              </h3>
              <p className="text-xs text-stone-500">
                {isEditing
                  ? 'Modifica el contenido, títulos, anécdotas de taller, consejos o piezas vinculadas.'
                  : 'Comparte anécdotas de taller, guías de estilo, secretos de restauración o curiosidades históricas.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-stone-700 flex-1">
          {/* Main Info */}
          <div className="space-y-4">
            <div>
              <label className="block font-medium text-stone-900 mb-1">Título de la Crónica *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: El misterio del dorado al agua y la arcilla de Armenia..."
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-amber-800 text-stone-900 text-sm font-serif"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-900 mb-1">Subtítulo o Frase Guía</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Ej: Cómo una pieza tallada hace tres siglos dialoga con un ambiente actual..."
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-amber-800 text-stone-900 text-xs italic"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-stone-900 mb-1">Categoría Temática</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ArticleCategory)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-amber-800 text-stone-900 text-xs bg-white"
                >
                  <option value="Oficios & Restauración">Oficios & Restauración</option>
                  <option value="Interiorismo & Eclecticismo">Interiorismo & Eclecticismo</option>
                  <option value="Guías de Coleccionismo">Guías de Coleccionismo</option>
                  <option value="Curiosidades Históricas">Curiosidades Históricas</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-stone-900 mb-1">Tiempo de Lectura Estimado</label>
                <input
                  type="text"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  placeholder="Ej: 5 min de lectura"
                  className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-amber-800 text-stone-900 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-stone-900 mb-1">Firma / Autor</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Tu nombre o Galería"
                  className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-amber-800 text-stone-900 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-900 mb-1">Rol o Oficio</label>
                <input
                  type="text"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  placeholder="Ej: Maestro Dorador y Ebanista"
                  className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-amber-800 text-stone-900 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-stone-900 mb-1">Imagen de Portada</label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/... o sube una foto de tu taller"
                  className="flex-1 px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-amber-800 text-stone-900 text-xs"
                />
                <label className="cursor-pointer px-3.5 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-md text-stone-800 text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors shrink-0">
                  <Upload className="w-3.5 h-3.5 text-stone-600" />
                  <span>Subir Foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
              {coverImage && (
                <div className="mt-2 w-full h-24 sm:h-32 rounded-lg overflow-hidden border border-stone-200 bg-stone-100 relative">
                  <img
                    src={coverImage}
                    alt="Vista previa de portada"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1.5 right-2 px-2 py-0.5 bg-black/60 text-white rounded text-[10px] backdrop-blur-xs">
                    Vista previa de portada
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block font-medium text-stone-900 mb-1">Copete o Introducción Destacada *</label>
              <textarea
                required
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="El párrafo inicial que atrapará la curiosidad del lector..."
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-amber-800 text-stone-900 text-xs leading-relaxed"
              />
            </div>
          </div>

          {/* Sections Builder */}
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <h4 className="font-serif text-sm font-semibold text-stone-950">
                Secciones del Artículo
              </h4>
              <button
                type="button"
                onClick={handleAddSection}
                className="inline-flex items-center space-x-1 text-xs text-amber-800 hover:text-amber-950 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Sección</span>
              </button>
            </div>

            {sections.map((sec, idx) => (
              <div key={idx} className="p-4 bg-[#faf8f5] border border-stone-200 rounded-lg space-y-3 relative">
                {sections.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSection(idx)}
                    className="absolute top-3 right-3 text-stone-400 hover:text-rose-600 transition-colors"
                    title="Eliminar sección"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <div>
                  <label className="block font-medium text-stone-800 mb-1">Subtítulo de la sección</label>
                  <input
                    type="text"
                    value={sec.sectionTitle}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSections((prev) => prev.map((s, i) => (i === idx ? { ...s, sectionTitle: val } : s)));
                    }}
                    placeholder="Ej: 2. El misterio del bol rojo..."
                    className="w-full px-3 py-1.5 border border-stone-300 rounded bg-white text-stone-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-800 mb-1">Párrafos (separa párrafos con doble salto de línea)</label>
                  <textarea
                    rows={4}
                    value={sec.paragraphs}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSections((prev) => prev.map((s, i) => (i === idx ? { ...s, paragraphs: val } : s)));
                    }}
                    placeholder="Escribe aquí el relato o explicación detallada..."
                    className="w-full px-3 py-1.5 border border-stone-300 rounded bg-white text-stone-900 text-xs leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Cita destacada (opcional)</label>
                    <input
                      type="text"
                      value={sec.quote}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSections((prev) => prev.map((s, i) => (i === idx ? { ...s, quote: val } : s)));
                      }}
                      placeholder="«Una frase poética o memorable...»"
                      className="w-full px-2.5 py-1.5 border border-stone-300 rounded bg-white text-stone-900 text-xs italic"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Consejo de taller (opcional)</label>
                    <input
                      type="text"
                      value={sec.tipBox}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSections((prev) => prev.map((s, i) => (i === idx ? { ...s, tipBox: val } : s)));
                      }}
                      placeholder="Regla de oro de conservación..."
                      className="w-full px-2.5 py-1.5 border border-stone-300 rounded bg-white text-stone-900 text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Linked Products Selector Section */}
          {catalogItems.length > 0 && (
            <div className="p-4 bg-[#faf8f5] border border-[#ede7de] rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block font-medium text-stone-900 text-xs flex items-center space-x-1.5">
                    <Link2 className="w-3.5 h-3.5 text-amber-800" />
                    <span>Vincular piezas del catálogo a esta crónica ({selectedItemIds.length} seleccionadas)</span>
                  </label>
                  <p className="text-[11px] text-stone-500">
                    Obras de arte y antigüedades recomendadas que aparecerán al final de la lectura.
                  </p>
                </div>
                {selectedItemIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedItemIds([])}
                    className="text-[11px] text-rose-700 hover:underline cursor-pointer"
                  >
                    Limpiar selección
                  </button>
                )}
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchCatalogQuery}
                  onChange={(e) => setSearchCatalogQuery(e.target.value)}
                  placeholder="Filtrar piezas por nombre, estilo o época..."
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-300 rounded text-xs text-stone-900"
                />
              </div>

              <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
                {filteredCatalogItems.slice(0, 15).map((item) => {
                  const isChecked = selectedItemIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleItemSelection(item.id)}
                      className={`flex items-center space-x-2.5 p-2 rounded border text-xs cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-amber-50/70 border-amber-600 text-amber-950 font-medium'
                          : 'bg-white border-stone-200 text-stone-800 hover:bg-stone-50'
                      }`}
                    >
                      <div className="w-9 h-9 rounded bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                        <img
                          src={item.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-xs">{item.title}</p>
                        <p className="text-[10px] text-stone-500 font-light truncate">
                          {item.period} • {item.style} • USD ${item.price.toLocaleString('es-AR')}
                        </p>
                      </div>
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 text-[10px] ${
                          isChecked
                            ? 'bg-amber-800 border-amber-800 text-white'
                            : 'border-stone-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label className="block font-medium text-stone-900 mb-1">Etiquetas (separadas por comas)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Dorado, Taller, Barroco, Maderas, Conservación"
              className="w-full px-3 py-2 border border-stone-300 rounded-md text-stone-900 text-xs"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-stone-300 rounded-md text-stone-700 hover:bg-stone-50 font-medium cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-stone-950 hover:bg-stone-800 text-white rounded-md font-medium shadow-xs flex items-center space-x-1.5 cursor-pointer"
            >
              {isEditing ? (
                <>
                  <Check className="w-3.5 h-3.5 text-amber-300" />
                  <span>Guardar Cambios</span>
                </>
              ) : (
                <>
                  <Feather className="w-3.5 h-3.5 text-amber-400" />
                  <span>Publicar en El Cuaderno del Articuario</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
