import React from 'react';
import { X, ShieldAlert, Truck, Eye, CheckCircle2, MessageCircle, FileText } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div 
        className="relative bg-[#fcfbf9] w-full max-w-2xl rounded-xl shadow-2xl border border-[#e2dacf] overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#f7f2ea] border-b border-[#e5ddd1] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-[#b45309]" />
            <h2 className="font-serif text-lg font-bold text-stone-900">
              Condiciones de Venta, Retiro & Políticas del Catálogo
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-md transition-colors cursor-pointer"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-stone-700 leading-relaxed">
          
          {/* Item 1: Venta Final */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-4 space-y-2">
            <div className="flex items-center space-x-2 font-serif font-bold text-amber-950 text-sm">
              <ShieldAlert className="w-4 h-4 text-amber-800 shrink-0" />
              <span>1. Naturaleza de las Piezas y Venta Final (Sin Devolución)</span>
            </div>
            <p className="text-amber-900/90 text-xs sm:text-xs leading-relaxed">
              Tratándose de objetos históricos, mobiliario de época, antigüedades y obras de arte únicas de segundo uso, <strong>todas las ventas son definitivas (venta final en el estado en que se encuentran)</strong>. Una vez retirada o entregada la pieza a conformidad del comprador o comisionista, no se aceptan devoluciones, reembolsos ni cambios posteriores bajo ninguna circunstancia.
            </p>
          </div>

          {/* Item 2: Inspección Previa */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 font-serif font-bold text-stone-900">
              <Eye className="w-4 h-4 text-stone-700 shrink-0" />
              <span>2. Inspección Previa y Asesoramiento Detallado</span>
            </div>
            <p className="text-stone-600 text-xs">
              Alentamos y promovemos que cada interesado solicite todas las fotografías de detalle adicionales, videos de estado, medidas exactas o coordine una visita presencial al showroom para examinar la pátina, desgastes de época y estructura antes de formalizar la compra.
            </p>
          </div>

          {/* Item 3: Envíos y Fletes */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 font-serif font-bold text-stone-900">
              <Truck className="w-4 h-4 text-[#b45309] shrink-0" />
              <span>3. Envíos, Fletes y Traslados: Estrictamente a Convenir</span>
            </div>
            <p className="text-stone-600 text-xs">
              La plataforma no incluye envíos automatizados ni asume compromisos de flete predeterminados. <strong>La modalidad de retiro en local o contratación de flete particular queda estrictamente a convenir entre comprador y vendedor</strong> por privado. Los costos, embalajes especiales y seguros de traslado corren por cuenta y orden del comprador según lo pactado con el anticuario.
            </p>
          </div>

          {/* Item 4: Coordinación Directa */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 font-serif font-bold text-stone-900">
              <MessageCircle className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>4. Coordinación Directa por WhatsApp</span>
            </div>
            <p className="text-stone-600 text-xs">
              Articuarios funciona como catálogo de exhibición y mesa de enlace patrimonial. Cada acuerdo, método de pago convenido (transferencia, efectivo o internacional) y fecha de retiro se formaliza directamente de común acuerdo con el anticuario responsable de la pieza.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#f6f2eb] border-t border-[#e5ddd1] flex items-center justify-between shrink-0">
          <span className="text-[11px] text-stone-500 font-serif">
            Articuarios • Transparencia & Oficio Patrimonial
          </span>
          <button
            onClick={onClose}
            className="py-1.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
