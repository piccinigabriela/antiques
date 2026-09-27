import React, { useState } from 'react';
import { X, Download, Check, Sparkles, Instagram, Eye, Copy } from 'lucide-react';
import { ArticuariosMonogram } from './ArticuariosMonogram';

interface LogoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoModal: React.FC<LogoModalProps> = ({ isOpen, onClose }) => {
  const [selectedVariant, setSelectedVariant] = useState<'seal-dark' | 'seal-light' | 'cartouche' | 'minimal'>('seal-dark');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isExportingPng, setIsExportingPng] = useState(false);

  if (!isOpen) return null;

  const variants = [
    {
      id: 'seal-dark',
      name: 'Sello Circular Nocturno (Gold & Charcoal)',
      description: 'Recomendado #1: Ideal para foto de perfil en Instagram y Pinterest (avatar circular de alta distinción).',
      file: '/articuarios-seal.svg',
      bgColor: 'bg-[#1c1917]',
      textColor: 'text-stone-100',
    },
    {
      id: 'seal-light',
      name: 'Sello Circular Claro (Marfil & Bronce)',
      description: 'Excelente para fondos claros, membretes y packaging.',
      file: '/articuarios-seal-light.svg',
      bgColor: 'bg-[#faf8f5]',
      textColor: 'text-stone-900',
    },
    {
      id: 'cartouche',
      name: 'Cartela Marfil (Monograma Principal)',
      description: 'Ideal para marca de agua en fotos de productos, web y encabezados.',
      file: '/articuarios-monogram.svg',
      bgColor: 'bg-[#faf8f5]',
      textColor: 'text-stone-900',
    },
    {
      id: 'minimal',
      name: 'Monograma "A" Lineal',
      description: 'Letra con serifa sobria, sin voluptuosidades, proporción áurea.',
      file: '/articuarios-monogram.svg',
      bgColor: 'bg-white',
      textColor: 'text-stone-900',
    },
  ] as const;

  const current = variants.find((v) => v.id === selectedVariant) || variants[0];

  const handleDownload = (filePath: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPng = async (filePath: string, fileName: string) => {
    try {
      setIsExportingPng(true);
      const resp = await fetch(filePath);
      const svgText = await resp.text();
      const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
      const blobURL = window.URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        const size = 1080;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, size, size);
          canvas.toBlob((blob) => {
            if (blob) {
              const pngUrl = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = pngUrl;
              link.download = fileName.replace(/\.svg$/, '.png');
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              window.URL.revokeObjectURL(pngUrl);
            }
            setIsExportingPng(false);
          }, 'image/png');
        } else {
          setIsExportingPng(false);
        }
        window.URL.revokeObjectURL(blobURL);
      };
      img.onerror = () => {
        setIsExportingPng(false);
        handleDownload(filePath, fileName);
      };
      img.src = blobURL;
    } catch {
      setIsExportingPng(false);
      handleDownload(filePath, fileName);
    }
  };

  const handleCopySvgUrl = (filePath: string) => {
    const fullUrl = `${window.location.origin}${filePath}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-[#faf8f5]">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase tracking-widest font-mono text-amber-800 font-semibold">Identidad Visual</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
              <span className="text-xs text-stone-500">Vectorial de Alta Resolución</span>
            </div>
            <h2 className="text-2xl font-serif text-stone-900 tracking-wide mt-1">
              Monograma Oficial de Articuarios
            </h2>
            <p className="text-xs text-stone-600 font-light mt-0.5">
              Tipografía con serifa sobria, refinada y no voluptuosa, concebida para peritaje y alta antigüedad.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-200/70 text-stone-500 hover:text-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Visualizer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Left: Preview Box */}
            <div className="flex flex-col items-center justify-center p-8 rounded-xl border border-stone-200 shadow-inner bg-gradient-to-b from-stone-50/50 to-stone-100/50">
              <div className="relative group flex items-center justify-center">
                {selectedVariant === 'minimal' ? (
                  <div className="w-48 h-48 flex items-center justify-center text-stone-900">
                    <ArticuariosMonogram className="w-40 h-40" />
                  </div>
                ) : (
                  <img
                    src={current.file}
                    alt={current.name}
                    className="w-48 h-48 object-contain drop-shadow-md rounded-2xl transition-transform duration-300 group-hover:scale-105"
                  />
                )}
              </div>

              {/* Instagram Profile Simulator */}
              <div className="mt-4 pt-4 border-t border-stone-200/60 w-full flex items-center justify-center space-x-3 text-stone-500 text-xs">
                <Instagram className="w-4 h-4 text-pink-600" />
                <span>Simulación en perfil circular:</span>
                <div className="w-8 h-8 rounded-full overflow-hidden border border-stone-300 shadow-sm flex items-center justify-center bg-stone-900">
                  <img src="/articuarios-seal.svg" alt="Preview circle" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* Right: Variant Details & Actions */}
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400">Variante activa</span>
                <h3 className="text-lg font-serif text-stone-900 font-medium">{current.name}</h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">{current.description}</p>
              </div>

              {/* Selector Tabs */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-medium text-stone-700 block">Elegir versión:</label>
                <div className="grid grid-cols-2 gap-2">
                  {variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v.id as any)}
                      className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                        selectedVariant === v.id
                          ? 'border-amber-800 bg-amber-50/50 text-amber-950 font-medium shadow-sm'
                          : 'border-stone-200 hover:border-stone-300 bg-white text-stone-600'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span
                          className={`w-3.5 h-3.5 rounded-full border border-stone-300 inline-block shrink-0 ${
                            v.id === 'seal-dark' ? 'bg-stone-900' : 'bg-[#faf8f5]'
                          }`}
                        />
                        <span className="truncate">{v.name.split('(')[0]}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 space-y-2">
                <button
                  onClick={() => handleDownloadPng(current.file, `${current.id}-1080px.png`)}
                  disabled={isExportingPng}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-800 to-amber-900 hover:from-amber-700 hover:to-amber-800 text-white font-medium py-2.5 px-4 rounded-xl text-xs tracking-wider uppercase transition-all shadow-md active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-amber-200" />
                  <span>
                    {isExportingPng ? 'Generando PNG...' : 'Descargar PNG para Redes (1080x1080 px)'}
                  </span>
                </button>

                <button
                  onClick={() => handleDownload(current.file, `${current.id}.svg`)}
                  className="w-full flex items-center justify-center space-x-2 bg-stone-900 hover:bg-stone-800 text-stone-200 font-medium py-2.5 px-4 rounded-xl text-xs tracking-wider uppercase transition-all shadow-sm active:scale-[0.99] cursor-pointer"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Descargar Archivo Vectorial (SVG)</span>
                </button>

                <button
                  onClick={() => handleCopySvgUrl(current.file)}
                  className="w-full flex items-center justify-center space-x-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium py-2 px-4 rounded-xl text-xs transition-all cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? '¡Enlace copiado al portapapeles!' : 'Copiar URL directa del archivo'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Social Media Guide */}
          <div className="bg-[#faf8f5] rounded-xl p-4 border border-[#eee7de] text-xs text-stone-700 space-y-1.5">
            <div className="font-semibold text-stone-900 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Cómo usarlo en tus redes:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-stone-600 font-light pl-1">
              <li>
                <strong>Instagram & Pinterest:</strong> El <em>Sello Circular Nocturno</em> o <em>Claro</em> calza perfecto en el recorte circular de los perfiles.
              </li>
              <li>
                <strong>Catálogo & Web:</strong> Ya se encuentra integrado como ícono oficial de la pestaña (favicon) y en la barra superior junto al nombre.
              </li>
              <li>
                <strong>Marca de agua / historias:</strong> La <em>Cartela Marfil</em> o el <em>Monograma Lineal</em> pueden colocarse en la esquina de las fotos de tus piezas.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50 flex items-center justify-between">
          <span className="text-[11px] text-stone-500">Diseñado con proporción clásica romana y trazos de serifa plana.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-100"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
