import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Tag, Sparkles, ArrowRight, Share2, Check, ArrowLeft, PlusCircle, Feather, Eye, Link2, SlidersHorizontal, Edit3, Trash2, ExternalLink, Send } from 'lucide-react';
import { BlogArticle, ArticleCategory, AntiqueItem, Dealer } from '../types';
import { LinkProductsModal } from './LinkProductsModal';

interface MagazineViewProps {
  articles: BlogArticle[];
  catalogItems: AntiqueItem[];
  dealers: Dealer[];
  onOpenItemDetail: (item: AntiqueItem) => void;
  onSelectCategoryFilter?: (category: string) => void;
  onOpenArticleCreateModal?: () => void;
  onOpenArticleEditModal?: (article: BlogArticle) => void;
  onDeleteArticle?: (articleId: string) => void;
  selectedArticleId?: string | null;
  onSelectArticle?: (article: BlogArticle | null) => void;
  onUpdateArticle?: (updatedArticle: BlogArticle) => void;
}

export const MagazineView: React.FC<MagazineViewProps> = ({
  articles,
  catalogItems,
  onOpenItemDetail,
  onOpenArticleCreateModal,
  onOpenArticleEditModal,
  onDeleteArticle,
  selectedArticleId,
  onSelectArticle,
  onUpdateArticle,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [internalSelectedArticle, setInternalSelectedArticle] = useState<BlogArticle | null>(() => {
    if (selectedArticleId) {
      return articles.find((a) => a.id === selectedArticleId || a.slug === selectedArticleId) || null;
    }
    return null;
  });
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedToSubstack, setCopiedToSubstack] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  // Keep internalSelectedArticle synchronized with updated articles array
  useEffect(() => {
    if (selectedArticleId) {
      const found = articles.find((a) => a.id === selectedArticleId || a.slug === selectedArticleId);
      setInternalSelectedArticle(found || null);
    } else if (internalSelectedArticle) {
      const found = articles.find((a) => a.id === internalSelectedArticle.id);
      setInternalSelectedArticle(found || null);
    }
  }, [articles, selectedArticleId]);

  const activeArticle = internalSelectedArticle;

  const categories: string[] = [
    'Todos',
    'Oficios & Restauración',
    'Interiorismo & Eclecticismo',
    'Guías de Coleccionismo',
    'Curiosidades Históricas',
  ];

  const filteredArticles = articles.filter((art) => {
    if (activeCategory === 'Todos') return true;
    return art.category === activeCategory;
  });

  const featuredArticle = articles.find((a) => a.featured) || articles[0];
  const regularArticles = filteredArticles.filter((a) => a.id !== (activeCategory === 'Todos' ? featuredArticle?.id : ''));

  const handleOpenArticle = (article: BlogArticle) => {
    setInternalSelectedArticle(article);
    if (onSelectArticle) onSelectArticle(article);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseArticle = () => {
    setInternalSelectedArticle(null);
    if (onSelectArticle) onSelectArticle(null);
  };

  const handleShareArticle = (art: BlogArticle) => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleExportToSubstack = (art: BlogArticle) => {
    // Generate clean, beautifully formatted Markdown/text suitable for Substack post editor
    let markdown = `# ${art.title}\n\n`;
    if (art.subtitle) {
      markdown += `*${art.subtitle}*\n\n`;
    }
    markdown += `**Por ${art.author}** (${art.authorRole}) • Publicado en El Cuaderno del Articuario\n\n`;
    markdown += `---\n\n`;
    markdown += `> ${art.excerpt}\n\n`;

    art.sections.forEach((section) => {
      if (section.sectionTitle) {
        markdown += `## ${section.sectionTitle}\n\n`;
      }
      section.paragraphs.forEach((p) => {
        markdown += `${p}\n\n`;
      });
      if (section.quote) {
        markdown += `> "${section.quote}"\n\n`;
      }
      if (section.tipBox) {
        markdown += `💡 **Nota del Taller de Restauración:**\n${section.tipBox}\n\n`;
      }
    });

    // Add footer linking back to catalog and Articuarios gallery
    markdown += `---\n\n`;
    markdown += `*Publicación original de **El Cuaderno del Articuario** (@articuarios). Visita nuestra galería y catálogo de antigüedades certificadas.*`;

    navigator.clipboard?.writeText(markdown);
    setCopiedToSubstack(true);
    setTimeout(() => setCopiedToSubstack(false), 4000);

    // Open Substack post editor for @articuarios in a new tab
    window.open('https://articuarios.substack.com/publish/post', '_blank', 'noopener,noreferrer');
  };

  // Find related catalog items for the active article (prioritizing explicit handpicked items)
  const getRelatedCatalogItems = (article: BlogArticle) => {
    if (article.relatedItemIds && article.relatedItemIds.length > 0) {
      const explicit = catalogItems.filter((it) => article.relatedItemIds!.includes(it.id));
      if (explicit.length > 0) return explicit;
    }
    if (!article.relatedCategories || article.relatedCategories.length === 0) {
      return catalogItems.slice(0, 3);
    }
    const matching = catalogItems.filter((it) => 
      article.relatedCategories?.includes(it.category) ||
      article.tags.some((t) => it.style.toLowerCase().includes(t.toLowerCase()) || it.materials.some((m) => m.toLowerCase().includes(t.toLowerCase())))
    );
    return (matching.length > 0 ? matching : catalogItems).slice(0, 3);
  };

  return (
    <div className="space-y-12 pb-20 animate-fadeIn">
      {/* 1. ARTICLE FULL READING VIEW */}
      {activeArticle ? (
        <article className="max-w-4xl mx-auto bg-white border border-[#e8e2d8] rounded-xl overflow-hidden shadow-xs">
          {/* Top Bar Navigation */}
          <div className="p-4 sm:p-6 border-b border-[#f0eae1] flex items-center justify-between bg-[#faf8f5]">
            <button
              type="button"
              onClick={handleCloseArticle}
              className="inline-flex items-center space-x-2 text-xs font-semibold text-stone-700 hover:text-stone-950 transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Volver a todas las crónicas</span>
            </button>

            <div className="flex items-center space-x-2 sm:space-x-2.5">
              {/* Substack Export Button */}
              <button
                type="button"
                onClick={() => handleExportToSubstack(activeArticle)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-[#ff6719]/10 hover:bg-[#ff6719]/20 text-[#ff6719] border border-[#ff6719]/30 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                title="Copia el artículo listo para Substack y abre el editor de @articuarios"
              >
                {copiedToSubstack ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">¡Copiado para Substack!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Llevar a Substack</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleShareArticle(activeArticle)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md border border-stone-200 text-stone-600 hover:text-stone-950 hover:bg-white text-xs font-medium transition-all cursor-pointer"
                title="Copiar enlace de este artículo"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? '¡Enlace copiado!' : 'Compartir'}</span>
              </button>

              {onOpenArticleEditModal && (
                <button
                  type="button"
                  onClick={() => onOpenArticleEditModal(activeArticle)}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-md bg-stone-900 hover:bg-stone-800 text-amber-200 hover:text-white text-xs font-medium transition-all cursor-pointer shadow-2xs"
                  title="Editar título, redacción, notas de taller, consejos o fotos"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                  <span>Editar Crónica</span>
                </button>
              )}

              {onDeleteArticle && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`¿Estás seguro de que deseas eliminar la crónica "${activeArticle.title}"?`)) {
                      onDeleteArticle(activeArticle.id);
                      handleCloseArticle();
                    }
                  }}
                  className="p-1.5 rounded-md border border-stone-200 text-stone-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Eliminar crónica"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Hero Header */}
          <div className="px-6 sm:px-12 pt-8 pb-6 sm:pt-12 sm:pb-8 space-y-4">
            <div className="flex items-center space-x-3 text-xs">
              <span className="px-2.5 py-1 bg-amber-100/70 text-amber-900 rounded font-medium tracking-wide uppercase text-[10px]">
                {activeArticle.category}
              </span>
              <span className="text-stone-400">•</span>
              <span className="flex items-center space-x-1 text-stone-500 text-[11px]">
                <Clock className="w-3 h-3" />
                <span>{activeArticle.readTime}</span>
              </span>
              <span className="text-stone-400">•</span>
              <span className="text-stone-500 text-[11px]">{activeArticle.date}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-stone-950 leading-tight">
              {activeArticle.title}
            </h1>

            <p className="text-base sm:text-lg text-stone-600 font-light leading-relaxed font-serif italic border-l-2 border-amber-800/40 pl-4 py-1">
              {activeArticle.subtitle}
            </p>

            <div className="flex items-center space-x-3 pt-4 border-t border-[#f0eae1]">
              <div className="w-10 h-10 rounded-full bg-stone-900 text-amber-100 flex items-center justify-center font-serif text-sm font-semibold">
                <Feather className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-900">{activeArticle.author}</p>
                <p className="text-[11px] text-stone-500">{activeArticle.authorRole}</p>
              </div>
            </div>
          </div>

          {/* Large Hero Image */}
          <div className="relative aspect-16/9 sm:aspect-21/9 w-full bg-stone-100 overflow-hidden border-y border-[#ede7de]">
            <img
              src={activeArticle.coverImage}
              alt={activeArticle.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Editorial Content Body */}
          <div className="px-6 sm:px-14 py-10 sm:py-14 space-y-8 text-stone-800 leading-relaxed text-sm sm:text-base font-light">
            {/* Excerpt Lead */}
            <p className="text-base sm:text-xl font-serif text-stone-900 leading-relaxed font-normal bg-[#fbfaf8] p-5 sm:p-6 rounded-lg border border-[#eee8df] shadow-2xs">
              {activeArticle.excerpt}
            </p>

            {/* Sections */}
            {activeArticle.sections.map((section, idx) => (
              <div key={`section-${idx}`} className="space-y-4 pt-4">
                {section.sectionTitle && (
                  <h2 className="font-serif text-xl sm:text-2xl font-normal text-stone-950 pt-2 border-b border-[#f0eae1] pb-2">
                    {section.sectionTitle}
                  </h2>
                )}

                {section.paragraphs.map((p, pIdx) => (
                  <p key={`p-${idx}-${pIdx}`} className="text-stone-700 leading-relaxed">
                    {p}
                  </p>
                ))}

                {section.quote && (
                  <blockquote className="my-6 p-5 sm:p-6 bg-[#f7f4ee] border-l-4 border-amber-800 rounded-r-lg text-stone-900 font-serif italic text-base sm:text-lg">
                    {section.quote}
                  </blockquote>
                )}

                {section.tipBox && (
                  <div className="my-6 p-4 sm:p-5 bg-amber-50/60 border border-amber-200/80 rounded-lg flex items-start space-x-3 text-xs sm:text-sm text-amber-950">
                    <Sparkles className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                    <div className="leading-relaxed">
                      <strong className="font-semibold block text-amber-900 mb-1">Nota del Maestro Restaurador:</strong>
                      {section.tipBox}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Tags Ribbon */}
            <div className="pt-8 border-t border-[#f0eae1] flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-stone-500 flex items-center space-x-1 mr-2">
                <Tag className="w-3.5 h-3.5" />
                <span>Temas:</span>
              </span>
              {activeArticle.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-stone-100 text-stone-700 rounded-full text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Substack Newsletter Banner */}
            <div className="my-8 p-6 sm:p-7 rounded-xl bg-gradient-to-br from-[#faf7f2] to-[#f4eee4] border border-[#e8dccb] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center space-x-2 text-[#ff6719] text-xs font-semibold uppercase tracking-wider">
                  <Send className="w-3.5 h-3.5" />
                  <span>El Cuaderno en Substack • @articuarios</span>
                </div>
                <h4 className="font-serif text-lg font-normal text-stone-900">
                  ¿Te apasiona la historia del arte y los oficios de taller?
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Suscríbete a nuestra newsletter para recibir crónicas exclusivas, procesos de doradura al agua y guías de autentificación directo en tu casilla de correo.
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <a
                  href="https://articuarios.substack.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-[#ff6719] hover:bg-[#e55913] text-white rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 shadow-xs"
                >
                  <span>Abrir @articuarios</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Related Catalog Items Box */}
            <div className="mt-12 p-6 sm:p-8 bg-[#faf8f5] border border-[#ede7de] rounded-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e5ddd1] pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-serif text-lg sm:text-xl font-normal text-stone-950">
                      Piezas del catálogo vinculadas con esta lectura
                    </h3>
                    {activeArticle.relatedItemIds && activeArticle.relatedItemIds.length > 0 && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full text-[10px] font-semibold tracking-wide">
                        {activeArticle.relatedItemIds.length} elegidas
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Obras históricas originales del catálogo que dialogan directamente con este oficio o estilo.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(true)}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-white hover:bg-stone-50 border border-stone-300 hover:border-amber-800 text-stone-800 hover:text-amber-950 rounded-md text-xs font-medium transition-all shadow-2xs cursor-pointer shrink-0"
                >
                  <Link2 className="w-3.5 h-3.5 text-amber-800" />
                  <span>Elegir / Modificar piezas</span>
                </button>
              </div>

              {getRelatedCatalogItems(activeArticle).length === 0 ? (
                <div className="text-center py-8 bg-white border border-dashed border-stone-300 rounded-lg p-6 space-y-3">
                  <p className="text-xs text-stone-500">Aún no hay piezas del catálogo vinculadas a esta lectura.</p>
                  <button
                    type="button"
                    onClick={() => setIsLinkModalOpen(true)}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-md text-xs font-medium transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Elegir piezas del catálogo</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {getRelatedCatalogItems(activeArticle).map((item) => (
                    <div
                      key={`rel-${item.id}`}
                      onClick={() => onOpenItemDetail(item)}
                      className="bg-white border border-[#e8e2d8] rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col"
                    >
                      <div className="relative aspect-square bg-[#fbfaf8] overflow-hidden">
                        <img
                          src={item.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 left-2">
                          <span className="px-1.5 py-0.5 bg-stone-950/80 text-white text-[9px] uppercase font-semibold rounded-xs">
                            {item.period}
                          </span>
                        </div>
                      </div>
                      <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                        <div>
                          <h4 className="font-serif text-xs font-medium text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-1">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-stone-500 font-light truncate mt-0.5">
                            {item.style} • {item.origin}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-[#f0eae1] flex items-center justify-between text-xs">
                          <span className="font-semibold text-stone-950 font-mono">
                            USD ${item.price.toLocaleString('es-AR')}
                          </span>
                          <span className="text-[10px] text-amber-800 group-hover:underline flex items-center space-x-0.5 font-medium">
                            <span>Ver pieza</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </article>
      ) : (
        /* 2. ARTICLES INDEX & MAGAZINE OVERVIEW */
        <>
          {/* Editorial Masthead */}
          <div className="text-center max-w-3xl mx-auto space-y-3 pt-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#f5efe6] border border-[#e8dccb] rounded-full text-amber-900 text-xs font-medium">
              <BookOpen className="w-3.5 h-3.5 text-amber-800" />
              <span>El Cuaderno del Articuario • Crónicas & Oficios</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-normal text-stone-950 tracking-tight">
              Apreciar la materia y el tiempo
            </h1>
            <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed">
              Un espacio de lectura pausada: secretos de antiguos talleres, el arte del dorado a la hoja, la alquimia del lustre a muñeca y cómo habitar el presente con piezas que tienen alma.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
              {onOpenArticleCreateModal && (
                <button
                  type="button"
                  onClick={onOpenArticleCreateModal}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-medium transition-colors shadow-xs cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Publicar nueva crónica</span>
                </button>
              )}

              <a
                href="https://articuarios.substack.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#ff6719]/10 hover:bg-[#ff6719]/20 text-[#d84e09] border border-[#ff6719]/30 rounded-full text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                title="Visitar @articuarios en Substack"
              >
                <Send className="w-3.5 h-3.5 text-[#ff6719]" />
                <span>Suscribirse en Substack (@articuarios)</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-start sm:justify-center space-x-2 overflow-x-auto scrollbar-none pb-2 pt-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-stone-950 text-white shadow-xs'
                      : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* FEATURED LEAD ARTICLE (Special hero showcase) */}
          {activeCategory === 'Todos' && featuredArticle && (
            <div
              onClick={() => handleOpenArticle(featuredArticle)}
              className="bg-white border border-[#e8e2d8] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group grid grid-cols-1 lg:grid-cols-12"
            >
              <div className="lg:col-span-7 relative aspect-16/10 lg:aspect-auto min-h-[280px] sm:min-h-[380px] bg-stone-100 overflow-hidden">
                <img
                  src={featuredArticle.coverImage}
                  alt={featuredArticle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 bg-stone-950/90 text-amber-300 text-[10px] uppercase font-bold tracking-widest rounded-xs backdrop-blur-xs flex items-center space-x-1.5">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Crónica Destacada</span>
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between bg-[#fdfbf7] space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2.5 text-xs text-stone-500">
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-medium text-[10px] uppercase">
                      {featuredArticle.category}
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1 text-[11px]">
                      <Clock className="w-3 h-3" />
                      <span>{featuredArticle.readTime}</span>
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl text-stone-950 font-normal leading-snug group-hover:text-amber-900 transition-colors">
                    {featuredArticle.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed line-clamp-4">
                    {featuredArticle.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#ede7de] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-stone-900 block">{featuredArticle.author}</span>
                    <span className="text-[10px] text-stone-400">{featuredArticle.authorRole}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {onOpenArticleEditModal && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenArticleEditModal(featuredArticle);
                        }}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 bg-white hover:bg-stone-100 text-stone-700 hover:text-stone-900 border border-stone-300 rounded text-xs font-medium transition-colors shadow-2xs"
                        title="Editar crónica destacada"
                      >
                        <Edit3 className="w-3 h-3 text-amber-800" />
                        <span>Editar</span>
                      </button>
                    )}
                    <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-900 group-hover:translate-x-1 transition-transform">
                      <span>Leer crónica</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* REGULAR ARTICLES GRID */}
          <div className="space-y-6">
            <div className="flex items-baseline justify-between border-b border-[#e8e2d8] pb-3">
              <h2 className="font-serif text-2xl font-normal text-stone-950">
                {activeCategory === 'Todos' ? 'Todas las Crónicas & Ensayos' : activeCategory}
              </h2>
              <span className="text-xs text-stone-500">
                {regularArticles.length} {regularArticles.length === 1 ? 'artículo' : 'artículos'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => handleOpenArticle(article)}
                  className="bg-white border border-[#e8e2d8] rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-16/10 bg-[#fbfaf8] overflow-hidden">
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2 py-0.5 bg-stone-900/80 text-white text-[9px] uppercase font-semibold rounded-xs backdrop-blur-xs">
                          {article.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-2.5">
                      <div className="flex items-center space-x-2 text-[11px] text-stone-400">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{article.readTime}</span>
                        </span>
                        <span>•</span>
                        <span>{article.date}</span>
                      </div>

                      <h3 className="font-serif text-lg text-stone-950 group-hover:text-amber-900 transition-colors font-normal leading-snug line-clamp-2">
                        {article.title}
                      </h3>

                      <p className="text-xs text-stone-600 font-light leading-relaxed line-clamp-3">
                        {article.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 py-3.5 border-t border-[#f0eae1] bg-[#fcfbf9] flex items-center justify-between text-xs">
                    <span className="text-[11px] text-stone-500 truncate max-w-[130px]">
                      {article.author}
                    </span>
                    <div className="flex items-center space-x-2">
                      {onOpenArticleEditModal && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenArticleEditModal(article);
                          }}
                          className="p-1 text-stone-400 hover:text-stone-900 hover:bg-stone-200/70 rounded transition-colors"
                          title="Editar crónica"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <span className="text-amber-900 font-medium group-hover:translate-x-1 transition-transform flex items-center space-x-1 text-xs">
                        <span>Leer</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Link Products Modal */}
      {isLinkModalOpen && activeArticle && (
        <LinkProductsModal
          isOpen={isLinkModalOpen}
          onClose={() => setIsLinkModalOpen(false)}
          article={activeArticle}
          catalogItems={catalogItems}
          onSave={(updated) => {
            setInternalSelectedArticle(updated);
            if (onUpdateArticle) onUpdateArticle(updated);
          }}
        />
      )}
    </div>
  );
};
