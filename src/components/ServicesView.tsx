import React, { useState } from 'react';
import { Truck, Sparkles, Award, Phone, ShieldCheck, CheckCircle2, ChevronRight, Ruler, AlertCircle } from 'lucide-react';
import { Dealer } from '../types';

interface ServicesViewProps {
  dealers: Dealer[];
  onSelectDealer?: (dealer: Dealer) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ dealers, onSelectDealer }) => {
  const [activeTab, setActiveTab] = useState<'fletes' | 'restauracion' | 'peritaje'>('fletes');

  // Find coordinator dealer (José / San Telmo / first dealer)
  const coordinatorDealer =
    dealers.find((d) => d.slug?.includes('san-telmo') || d.name?.toLowerCase().includes('san telmo')) ||
    dealers[0];

  const coordinatorPhone = coordinatorDealer?.whatsapp || '5491143618890';
  const coordinatorName = coordinatorDealer?.name || 'Dirección de Logística y Servicios Articuarios';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Editorial Header */}
      <div className="bg-white border border-[#e5ddd1] rounded-2xl p-6 sm:p-8 shadow-2xs relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#b45309] uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Ecosistema de Confianza & Oficios Colegiados</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-stone-950 font-normal tracking-tight mb-3">
            Servicios Especializados: Fletes de Arte, Restauración y Peritaje
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Una pieza histórica o de gran porte no se traslada ni se interviene de forma automática. Cada detalle, saliente de marquetería, peso de bronce o fragilidad de cristal requiere evaluación mano a mano, personal idóneo y embalaje a medida.
          </p>
        </div>

        {/* Coordination badge */}
        <div className="mt-6 pt-4 border-t border-[#f0ebe3] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-stone-600">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
            <span>Coordinación general de servicios a cargo de: <strong className="text-stone-900">{coordinatorName}</strong></span>
          </div>
          <a
            href={`https://wa.me/${coordinatorPhone}?text=${encodeURIComponent('Hola, me comunico desde Articuarios para consultar sobre coordinación de servicios especializados.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 text-emerald-800 font-semibold hover:underline"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mesa de Enlace Directa por WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-[#e5ddd1] pb-px overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('fletes')}
          className={`flex items-center space-x-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'fletes'
              ? 'border-[#b45309] text-[#b45309] bg-amber-50/50'
              : 'border-transparent text-stone-600 hover:text-stone-950 hover:bg-stone-50'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>1. Fletes Especializados</span>
        </button>

        <button
          onClick={() => setActiveTab('restauracion')}
          className={`flex items-center space-x-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'restauracion'
              ? 'border-[#b45309] text-[#b45309] bg-amber-50/50'
              : 'border-transparent text-stone-600 hover:text-stone-950 hover:bg-stone-50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>2. Restauración & Conservación</span>
        </button>

        <button
          onClick={() => setActiveTab('peritaje')}
          className={`flex items-center space-x-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'peritaje'
              ? 'border-[#b45309] text-[#b45309] bg-amber-50/50'
              : 'border-transparent text-stone-600 hover:text-stone-950 hover:bg-stone-50'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>3. Peritajes & Certificación</span>
        </button>
      </div>

      {/* TAB 1: FLETES ESPECIALIZADOS */}
      {activeTab === 'fletes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-[#e8e2d8] rounded-xl p-6 sm:p-8 space-y-4 shadow-2xs">
              <div className="flex items-center space-x-3 text-amber-900">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-amber-800" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-bold text-stone-900">
                    Logística y Traslado de Piezas Históricas y Frágiles
                  </h2>
                  <p className="text-xs text-stone-500">Mobiliario de época, mármoles, arañas de cristal y esculturas pesadas</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                El transporte de obras de arte no admite cotizaciones estándar ni choferes de mudanza convencional. Cada pieza tiene salientes talladas, aplicaciones de bronce dorado, cristales facetados o mármoles de cantera que exigen estibado vertical y fijación técnica.
              </p>

              <div className="bg-[#faf8f5] border border-[#eee7dc] rounded-lg p-4 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center space-x-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                  <span>Protocolo de Cotización Mano a Mano</span>
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Para cotizar un flete no usamos calculadoras automáticas: el anticuario coordinador evalúa con usted vía fotos y medidas exactas:
                </p>
                <ul className="text-xs text-stone-600 space-y-1.5 list-disc list-inside">
                  <li><strong>Dimensiones y salientes:</strong> Voladizos, molduras o mármoles desmontables.</li>
                  <li><strong>Accesibilidad de origen y destino:</strong> Pisos por escalera, puertas señoriales o izajes técnicos.</li>
                  <li><strong>Tipo de embalaje:</strong> Mantas acolchadas térmicas, cantoneras de polietileno expandido o cajón de madera a medida.</li>
                </ul>
              </div>

              {/* Action WhatsApp */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${coordinatorPhone}?text=${encodeURIComponent('Hola José, necesito coordinar y cotizar un flete especializado para una pieza de arte/antigüedad. Te paso las fotos, medidas y zonas de retiro/entrega.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-xs font-bold shadow-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Cotizar Flete Mano a Mano por WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Info Box */}
          <div className="space-y-4">
            <div className="bg-[#faf8f5] border border-[#e8e2d8] rounded-xl p-6 space-y-4">
              <h3 className="font-serif text-base font-bold text-stone-900">Coberturas Habituales</h3>
              <ul className="space-y-2.5 text-xs text-stone-700">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>CABA y Corredor Norte:</strong> San Telmo, Recoleta, Palermo, Belgrano, San Isidro.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Countries & Zonas Privadas:</strong> Pilar, Tigre, Canning, La Plata.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Despachos al Interior:</strong> Embalaje reforzado para transporte de larga distancia.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RESTAURACION */}
      {activeTab === 'restauracion' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-[#e8e2d8] rounded-xl p-6 sm:p-8 space-y-4 shadow-2xs">
              <div className="flex items-center space-x-3 text-amber-900">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-800" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-bold text-stone-900">
                    Talleres de Restauración y Puesta en Valor
                  </h2>
                  <p className="text-xs text-stone-500">Oficios tradicionales de ebanistería, sonería y orfebrería</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                Conservar la pátina original es la regla de oro del coleccionismo. Nuestros talleres asociados aplican técnicas históricas respetando los materiales de la época de fabricación de la pieza.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 bg-[#faf8f5] border border-[#eee7dc] rounded-md space-y-1">
                  <h4 className="text-xs font-bold text-stone-900">Lustre a Muñeca Francés</h4>
                  <p className="text-[11px] text-stone-600">Goma laca virgen descerada aplicada con muñequilla de algodón. Brillo noble y transparente sin plastificar.</p>
                </div>

                <div className="p-3.5 bg-[#faf8f5] border border-[#eee7dc] rounded-md space-y-1">
                  <h4 className="text-xs font-bold text-stone-900">Relojería Histórica</h4>
                  <p className="text-[11px] text-stone-600">Puesta a punto de escapes, limpieza por ultrasonido de sonerías de París, péndulos y campanas de bronce.</p>
                </div>

                <div className="p-3.5 bg-[#faf8f5] border border-[#eee7dc] rounded-md space-y-1">
                  <h4 className="text-xs font-bold text-stone-900">Dorado a la Hoja y Bronces</h4>
                  <p className="text-[11px] text-stone-600">Restauración de marcos barrocos con oro fino al agua y limpieza artesanal de ormoulú (dorado al mercurio).</p>
                </div>

                <div className="p-3.5 bg-[#faf8f5] border border-[#eee7dc] rounded-md space-y-1">
                  <h4 className="text-xs font-bold text-stone-900">Encuadernación de Libros</h4>
                  <p className="text-[11px] text-stone-600">Lavado y desacidificación de papel de hilo, cosido tradicional en telar y tafiletes de época con nervios.</p>
                </div>
              </div>

              {/* Action WhatsApp */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${coordinatorPhone}?text=${encodeURIComponent('Hola José, me comunico para consultar por un trabajo de restauración/conservación para una pieza. Te paso fotos del estado actual.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-md text-xs font-bold shadow-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>Consultar Trabajo de Restauración por WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-[#faf8f5] border border-[#e8e2d8] rounded-xl p-6 space-y-3">
              <h3 className="font-serif text-base font-bold text-stone-900">Presupuesto sin cargo</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Envíe fotos en primer plano de los sectores a restaurar (marquetería levantada, faltantes de moldura o reloj detenido) para recibir un diagnóstico previo.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PERITAJE */}
      {activeTab === 'peritaje' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-[#e8e2d8] rounded-xl p-6 sm:p-8 space-y-4 shadow-2xs">
              <div className="flex items-center space-x-3 text-amber-900">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Award className="w-5 h-5 text-amber-800" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-bold text-stone-900">
                    Certificación, Dictámenes y Tasaciones Patrimoniales
                  </h2>
                  <p className="text-xs text-stone-500">Peritos colegiados para compraventas, sucesiones y pólizas de seguro</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                Brindamos dictámenes periciales técnicos para certificar la autenticidad, autoría, datación y estado de conservación de obras de arte, mobiliario palaciego, platería colonial y libros raros.
              </p>

              <div className="space-y-3 text-xs text-stone-700">
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span><strong>Ficha Técnica Pericial:</strong> Análisis de materiales, ensambles de cola de milano, marcas de ebanista, punzones de platería o firmas pictóricas.</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span><strong>Tasación a Valor de Mercado:</strong> Evaluación real de liquidación o reposición para divisiones hereditarias o cobertura de seguros de arte.</span>
                </div>
              </div>

              {/* Action WhatsApp */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${coordinatorPhone}?text=${encodeURIComponent('Hola José, preciso solicitar un informe de peritaje o tasación oficial para una pieza/colección.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-md text-xs font-bold shadow-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>Solicitar Peritaje o Tasación por WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-[#faf8f5] border border-[#e8e2d8] rounded-xl p-6 space-y-3">
              <h3 className="font-serif text-base font-bold text-stone-900">Confidencialidad Absoluta</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Todo análisis pericial de colecciones particulares se realiza bajo estricto secreto profesional y reserva de identidad.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
