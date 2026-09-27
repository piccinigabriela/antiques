import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Sun, 
  Contrast, 
  Palette, 
  Check, 
  RotateCcw, 
  Eye, 
  Sliders, 
  Maximize2,
  Layers,
  Wand2
} from 'lucide-react';

interface PhotoStudioModalProps {
  initialImageUrl: string;
  onClose: () => void;
  onApplyImage: (enhancedImageUrl: string) => void;
}

interface FilterSettings {
  brightness: number; // -50 to 50
  contrast: number; // -50 to 50
  warmth: number; // -50 to 50 (negative = cooler/whiter light, positive = warmer)
  saturation: number; // -50 to 50
  vignette: number; // 0 to 100
  studioBackdrop: boolean; // Studio neutral gradient backdrop
}

const DEFAULT_SETTINGS: FilterSettings = {
  brightness: 0,
  contrast: 0,
  warmth: 0,
  saturation: 0,
  vignette: 0,
  studioBackdrop: false,
};

export const PhotoStudioModal: React.FC<PhotoStudioModalProps> = ({
  initialImageUrl,
  onClose,
  onApplyImage,
}) => {
  const [settings, setSettings] = useState<FilterSettings>({
    brightness: 8,
    contrast: 14,
    warmth: -10, // slightly reduce yellow shop bulbs
    saturation: 6,
    vignette: 20,
    studioBackdrop: true,
  });

  const [isComparingOriginal, setIsComparingOriginal] = useState(false);
  const [activePreset, setActivePreset] = useState<string>('1stdibs');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Load the initial image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      originalImageRef.current = img;
      setImageLoaded(true);
      renderCanvas(settings, false);
    };
    img.src = initialImageUrl;
  }, [initialImageUrl]);

  // Re-render canvas whenever settings or compare state changes
  useEffect(() => {
    if (imageLoaded) {
      renderCanvas(isComparingOriginal ? DEFAULT_SETTINGS : settings, isComparingOriginal);
    }
  }, [settings, isComparingOriginal, imageLoaded]);

  const renderCanvas = (currentSettings: FilterSettings, forceOriginal = false) => {
    const canvas = canvasRef.current;
    const img = originalImageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions matching aspect ratio (capped for UI performance)
    const maxDim = 1200;
    let width = img.naturalWidth || 800;
    let height = img.naturalHeight || 800;

    if (width > maxDim || height > maxDim) {
      if (width > height) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
    }

    canvas.width = width;
    canvas.height = height;

    if (forceOriginal) {
      // Draw pristine original
      ctx.drawImage(img, 0, 0, width, height);
      return;
    }

    // 1. Studio backdrop layer if enabled
    if (currentSettings.studioBackdrop) {
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height * 0.45,
        width * 0.15,
        width / 2,
        height / 2,
        width * 0.85
      );
      bgGrad.addColorStop(0, '#faf8f5');
      bgGrad.addColorStop(0.7, '#f0ebe1');
      bgGrad.addColorStop(1, '#e3dbcd');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Prepare filter string for HTML5 canvas
    const b = 100 + currentSettings.brightness;
    const c = 100 + currentSettings.contrast;
    const s = 100 + currentSettings.saturation;
    const sepiaVal = currentSettings.warmth > 0 ? currentSettings.warmth * 0.4 : 0;
    const hueVal = currentSettings.warmth < 0 ? currentSettings.warmth * 0.2 : 0;

    ctx.save();
    ctx.filter = `brightness(${b}%) contrast(${c}%) saturate(${s}%) sepia(${sepiaVal}%) hue-rotate(${hueVal}deg)`;
    ctx.drawImage(img, 0, 0, width, height);
    ctx.restore();

    // 3. Studio Vignette Overlay
    if (currentSettings.vignette > 0) {
      const vRadius = Math.max(width, height) * 0.75;
      const vGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        vRadius * 0.4,
        width / 2,
        height / 2,
        vRadius
      );
      const vOpacity = (currentSettings.vignette / 100) * 0.45;
      vGrad.addColorStop(0, 'rgba(0,0,0,0)');
      vGrad.addColorStop(0.8, `rgba(40,32,24, ${vOpacity * 0.5})`);
      vGrad.addColorStop(1, `rgba(20,15,10, ${vOpacity})`);

      ctx.save();
      ctx.fillStyle = vGrad;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }
  };

  const applyPreset = (presetName: string) => {
    setActivePreset(presetName);
    switch (presetName) {
      case '1stdibs':
        setSettings({
          brightness: 8,
          contrast: 16,
          warmth: -12, // Neutralizes incandescent yellowish shop lights
          saturation: 8,
          vignette: 20,
          studioBackdrop: true,
        });
        break;
      case 'museum':
        setSettings({
          brightness: -4,
          contrast: 26,
          warmth: 8,
          saturation: 12,
          vignette: 45,
          studioBackdrop: false,
        });
        break;
      case 'wood':
        setSettings({
          brightness: 6,
          contrast: 20,
          warmth: 15, // Enriches mahogany and walnut patinas
          saturation: 22,
          vignette: 15,
          studioBackdrop: false,
        });
        break;
      case 'bronze':
        setSettings({
          brightness: 12,
          contrast: 28,
          warmth: 5,
          saturation: -5,
          vignette: 25,
          studioBackdrop: true,
        });
        break;
      case 'original':
        setSettings(DEFAULT_SETTINGS);
        break;
    }
  };

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const enhancedUrl = canvas.toDataURL('image/jpeg', 0.92);
    onApplyImage(enhancedUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        id="photo-studio-modal"
        className="relative bg-[#1a1816] text-stone-100 w-full max-w-5xl rounded-2xl shadow-2xl border border-stone-800 overflow-hidden flex flex-col max-h-[94vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-[#221f1c]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-900/40 border border-amber-600/50 flex items-center justify-center text-amber-400">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-serif text-lg font-bold text-stone-100">
                  Estudio Fotográfico de Producto
                </h2>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Estilo 1stdibs
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Optimiza la iluminación, balancea los tonos de local físico y resalta la pátina de la antigüedad.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: 2-column layout on desktop */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Canvas Preview Area */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-[#11100f] rounded-xl border border-stone-800 p-3 sm:p-4 min-h-[320px] relative">
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-lg">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[440px] object-contain rounded-md shadow-2xl transition-all"
              />
              
              {isComparingOriginal && (
                <div className="absolute top-3 left-3 bg-black/80 text-white text-xs px-2.5 py-1 rounded-md border border-white/20 font-medium">
                  Vista Original sin retocar
                </div>
              )}
            </div>

            {/* Quick Compare bar */}
            <div className="w-full mt-3 pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
              <button
                type="button"
                onMouseDown={() => setIsComparingOriginal(true)}
                onMouseUp={() => setIsComparingOriginal(false)}
                onTouchStart={() => setIsComparingOriginal(true)}
                onTouchEnd={() => setIsComparingOriginal(false)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-md transition-colors text-xs font-medium cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Mantener para ver original</span>
              </button>
              <span className="text-[11px] text-stone-400">
                Resolución nativa conservada
              </span>
            </div>
          </div>

          {/* Right Controls Area */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {/* Presets Grid */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-amber-400 mb-2.5 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Estilos de Iluminación Pericial</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => applyPreset('1stdibs')}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      activePreset === '1stdibs'
                        ? 'bg-amber-950/40 border-amber-500 text-white shadow-xs'
                        : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <div className="font-semibold text-xs text-amber-300 flex items-center justify-between">
                      <span>Estudio 1stdibs</span>
                      {activePreset === '1stdibs' && <Check className="w-3 h-3 text-amber-400" />}
                    </div>
                    <div className="text-[10px] text-stone-400 mt-0.5 leading-tight">
                      Luz de galería neutra, disimula fondos de tienda.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPreset('museum')}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      activePreset === 'museum'
                        ? 'bg-amber-950/40 border-amber-500 text-white shadow-xs'
                        : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <div className="font-semibold text-xs text-amber-300 flex items-center justify-between">
                      <span>Luz de Museo</span>
                      {activePreset === 'museum' && <Check className="w-3 h-3 text-amber-400" />}
                    </div>
                    <div className="text-[10px] text-stone-400 mt-0.5 leading-tight">
                      Contraste cinematográfico y halo focal suave.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPreset('wood')}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      activePreset === 'wood'
                        ? 'bg-amber-950/40 border-amber-500 text-white shadow-xs'
                        : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <div className="font-semibold text-xs text-amber-300 flex items-center justify-between">
                      <span>Maderas Nobles</span>
                      {activePreset === 'wood' && <Check className="w-3 h-3 text-amber-400" />}
                    </div>
                    <div className="text-[10px] text-stone-400 mt-0.5 leading-tight">
                      Enfatiza la veta en caoba, nogal y palisandro.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPreset('bronze')}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      activePreset === 'bronze'
                        ? 'bg-amber-950/40 border-amber-500 text-white shadow-xs'
                        : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <div className="font-semibold text-xs text-amber-300 flex items-center justify-between">
                      <span>Bronces y Plata</span>
                      {activePreset === 'bronze' && <Check className="w-3 h-3 text-amber-400" />}
                    </div>
                    <div className="text-[10px] text-stone-400 mt-0.5 leading-tight">
                      Claridad en cincelados sin sobreexponer reflejos.
                    </div>
                  </button>
                </div>
              </div>

              {/* Sliders Area */}
              <div className="bg-stone-900/70 border border-stone-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <span className="text-xs font-semibold text-stone-300 flex items-center space-x-1.5">
                    <Sliders className="w-3.5 h-3.5 text-stone-400" />
                    <span>Ajuste Fino Manual</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => applyPreset('original')}
                    className="text-[11px] text-stone-400 hover:text-stone-200 flex items-center space-x-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Restablecer</span>
                  </button>
                </div>

                {/* Brightness */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-stone-400">
                    <span className="flex items-center space-x-1">
                      <Sun className="w-3.5 h-3.5" />
                      <span>Luminosidad</span>
                    </span>
                    <span>{settings.brightness > 0 ? `+${settings.brightness}` : settings.brightness}</span>
                  </div>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    value={settings.brightness}
                    onChange={(e) => {
                      setActivePreset('custom');
                      setSettings((prev) => ({ ...prev, brightness: Number(e.target.value) }));
                    }}
                    className="w-full accent-amber-500 h-1.5 bg-stone-700 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Contrast */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-stone-400">
                    <span className="flex items-center space-x-1">
                      <Contrast className="w-3.5 h-3.5" />
                      <span>Contraste</span>
                    </span>
                    <span>{settings.contrast > 0 ? `+${settings.contrast}` : settings.contrast}</span>
                  </div>
                  <input
                    type="range"
                    min="-30"
                    max="50"
                    value={settings.contrast}
                    onChange={(e) => {
                      setActivePreset('custom');
                      setSettings((prev) => ({ ...prev, contrast: Number(e.target.value) }));
                    }}
                    className="w-full accent-amber-500 h-1.5 bg-stone-700 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Warmth (Color Temp) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-stone-400">
                    <span className="flex items-center space-x-1">
                      <Palette className="w-3.5 h-3.5" />
                      <span>Balance de Color (Luz Fría / Cálida)</span>
                    </span>
                    <span>{settings.warmth > 0 ? `+${settings.warmth}` : settings.warmth}</span>
                  </div>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    value={settings.warmth}
                    onChange={(e) => {
                      setActivePreset('custom');
                      setSettings((prev) => ({ ...prev, warmth: Number(e.target.value) }));
                    }}
                    className="w-full accent-amber-500 h-1.5 bg-stone-700 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Backdrop toggle */}
                <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-stone-300">Fondo de Estudio Suavizado</div>
                    <div className="text-[10px] text-stone-400">Atenúa fondos caóticos de local o depósito</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.studioBackdrop}
                    onChange={(e) => {
                      setActivePreset('custom');
                      setSettings((prev) => ({ ...prev, studioBackdrop: e.target.checked }));
                    }}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 bg-stone-800 border-stone-700"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-stone-800 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-stone-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExport}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-amber-900/30 transition-all flex items-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>Aplicar a la Ficha Técnica</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
