import React, { useState, useEffect } from 'react';
import { X, Copy, Check, ExternalLink, Sparkles, ShoppingBag, RefreshCw, Layers, ArrowRight, ShieldCheck, Download } from 'lucide-react';
import { AntiqueItem } from '../types';

interface PinterestCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: AntiqueItem[];
}

export const PinterestCatalogModal: React.FC<PinterestCatalogModalProps> = ({
  isOpen,
  onClose,
  items,
}) => {
  const [copiedFormat, setCopiedFormat] = useState<'xml' | 'csv' | null>(null);
  const [originUrl, setOriginUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOriginUrl(window.location.origin);
    }
  }, []);

  if (!isOpen) return null;

  const xmlFeedUrl = `${originUrl || 'https://articuarios.store'}/api/pinterest-feed.xml`;
  const csvFeedUrl = `${originUrl || 'https://articuarios.store'}/api/pinterest-catalog.csv`;

  const availableCount = items.filter((i) => i.status === 'available' || i.status === 'in_negotiation').length;
  const totalCount = items.length;

  const handleCopy = (url: string, format: 'xml' | 'csv') => {
    navigator.clipboard.writeText(url);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between bg-[#faf8f5]">
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1 text-xs uppercase tracking-widest font-mono text-red-700 font-semibold">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Pinterest Shopping</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="text-xs text-stone-500 font-sans">Feed de Datos Activo</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif text-stone-900 tracking-wide mt-1">
              Catálogo Automático para Pinterest
            </h2>
            <p className="text-xs text-stone-600 font-light mt-0.5">
              Sincroniza tus antigüedades como <strong>Pines de Producto Comprables</strong> con precio, fotos y stock en tiempo real.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-200/70 text-stone-500 hover:text-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Status Badge & Metrics */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-stone-50 rounded-xl border border-stone-200/80">
            <div className="text-center">
              <span className="text-xs text-stone-500 block">Total de Piezas</span>
              <span className="text-xl font-bold font-mono text-stone-900">{totalCount}</span>
            </div>
            <div className="text-center border-x border-stone-200">
              <span className="text-xs text-emerald-700 block">En Stock / Disponibles</span>
              <span className="text-xl font-bold font-mono text-emerald-800">{availableCount}</span>
            </div>
            <div className="text-center">
              <span className="text-xs text-stone-500 block">Frecuencia Sync</span>
              <span className="text-xs font-semibold text-stone-800 uppercase mt-1 inline-block bg-white px-2 py-0.5 rounded border border-stone-200">
                Automática 24/7
              </span>
            </div>
          </div>

          {/* Primary Option: XML Feed URL */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-900 flex items-center space-x-1.5">
                <span className="px-1.5 py-0.5 bg-red-100 text-red-800 rounded text-[10px] uppercase font-mono font-bold">
                  Recomendado
                </span>
                <span>URL de Origen de Datos (XML / RSS 2.0)</span>
              </label>
              <a
                href={xmlFeedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-amber-800 hover:text-amber-900 hover:underline flex items-center space-x-1"
              >
                <span>Inspeccionar XML</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-stone-100 border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-mono text-stone-800 truncate select-all">
                {xmlFeedUrl}
              </div>
              <button
                onClick={() => handleCopy(xmlFeedUrl, 'xml')}
                className="flex items-center space-x-1.5 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-medium transition-all shadow-xs cursor-pointer active:scale-95"
              >
                {copiedFormat === 'xml' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar URL</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-stone-500">
              Pega este enlace en la pantalla de <strong>"Añade la fuente de datos de tu catálogo"</strong> de Pinterest.
            </p>
          </div>

          {/* Step by step instructions matching the user's Pinterest screen */}
          <div className="p-4 bg-[#faf8f5] rounded-xl border border-[#eee7de] space-y-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-800" />
              <span>Pasos para configurarlo en Pinterest (Solo se hace una vez):</span>
            </h4>
            <ol className="space-y-2 text-xs text-stone-700 list-decimal list-inside font-light">
              <li className="leading-relaxed">
                En tu pantalla de Pinterest (donde dice <strong>Importar productos / Catálogos</strong>), haz clic en el botón <strong>"Catálogos →"</strong>.
              </li>
              <li className="leading-relaxed">
                En el campo <strong>"URL de la fuente de datos"</strong>, pega la URL que copiaste arriba (<code className="bg-stone-200 px-1 py-0.5 rounded text-[11px] font-mono">/api/pinterest-feed.xml</code>).
              </li>
              <li className="leading-relaxed">
                En <strong>Formato de archivo</strong> selecciona <em>XML (RSS 2.0)</em> o <em>Detección automática</em>.
              </li>
              <li className="leading-relaxed">
                En <strong>País / Moneda</strong> elige <em>Argentina / USD (o tu moneda)</em> y confirma.
              </li>
              <li className="leading-relaxed">
                <strong>¡Listo!</strong> Pinterest validará el archivo y convertirá todas tus antigüedades en <strong>Pines Comprables</strong> que se actualizan solos todos los días.
              </li>
            </ol>
          </div>

          {/* Alternative Format: CSV Download */}
          <div className="pt-2 border-t border-stone-200/80 flex items-center justify-between text-xs text-stone-600">
            <div>
              <span className="font-medium text-stone-800">¿Prefieres formato CSV?</span>
              <p className="text-[11px] text-stone-500">También disponible para carga manual o backup en planilla.</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleCopy(csvFeedUrl, 'csv')}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-700 transition-colors flex items-center space-x-1 cursor-pointer"
              >
                {copiedFormat === 'csv' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copiar CSV</span>
              </button>
              <a
                href={csvFeedUrl}
                download="pinterest-catalog.csv"
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-700 transition-colors flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar CSV</span>
              </a>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50 flex items-center justify-between">
          <span className="text-[11px] text-stone-500">
            Compatible con Google Merchant, Pinterest Shopping y Meta Commerce.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-100 cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
