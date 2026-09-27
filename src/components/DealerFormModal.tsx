import React, { useState } from 'react';
import { Store, ShieldCheck, MapPin, Phone, KeyRound, Sparkles, X, PlusCircle } from 'lucide-react';
import { Dealer } from '../types';

interface DealerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dealer: Dealer) => void;
}

export const DealerFormModal: React.FC<DealerFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('Buenos Aires');
  const [address, setAddress] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [phone, setPhone] = useState('');
  const [instagram, setInstagram] = useState('');
  const [foundedYear, setFoundedYear] = useState<number>(1980);
  const [specialtiesText, setSpecialtiesText] = useState('Mobiliario Francés, Libros Antiguos, Bronces');
  const [accessPin, setAccessPin] = useState('1234');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=400');
  const [banner, setBanner] = useState('https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1200');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const cleanWhatsApp = whatsapp.replace(/\D/g, '') || '5491155551234';

    const newDealer: Dealer = {
      id: `dealer-${Date.now()}`,
      name: name.trim(),
      slug,
      tagline: tagline.trim() || 'Galería y Antigüedades Colegiadas',
      description: description.trim() || 'Espacio dedicado a la conservación, tasación y venta de piezas históricas y de alta época.',
      city: city.trim() || 'Buenos Aires',
      address: address.trim() || 'San Telmo, CABA',
      phone: phone.trim() || whatsapp,
      whatsapp: cleanWhatsApp,
      instagram: instagram.trim().replace(/^@/, '') || undefined,
      avatar,
      banner,
      foundedYear: Number(foundedYear) || 1990,
      specialties: specialtiesText.split(',').map(s => s.trim()).filter(Boolean),
      verified: true,
      accessPin: accessPin.trim() || '1234',
    };

    onSave(newDealer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#fcfbf9] border border-[#dcd4c7] rounded-md shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#eae3d6] bg-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-950">
                Incorporar Nuevo Anticuario / Galería
              </h2>
              <p className="text-xs text-stone-500">
                Alta de espacio comercial, vitrina digital y credencial de acceso
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 flex items-center justify-center text-lg"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs text-stone-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                Nombre de la Galería o Anticuario *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Antigüedades Don Carlos"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#d4cbbf] rounded text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                Lema o Bajada
              </label>
              <input
                type="text"
                placeholder="Ej: Mobiliario Francés, Libros Raros y Bronces"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#d4cbbf] rounded text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                Barrio / Ciudad
              </label>
              <input
                type="text"
                placeholder="San Telmo, CABA"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#d4cbbf] rounded text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                Dirección Física o Depósito
              </label>
              <input
                type="text"
                placeholder="Defensa 1040"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#d4cbbf] rounded text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                Año de Fundación
              </label>
              <input
                type="number"
                placeholder="1985"
                value={foundedYear}
                onChange={(e) => setFoundedYear(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-[#d4cbbf] rounded text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                WhatsApp Comercial *
              </label>
              <input
                type="text"
                required
                placeholder="5491112345678"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#d4cbbf] rounded text-stone-900 font-mono focus:outline-none focus:ring-1 focus:ring-amber-800"
              />
              <span className="text-[10px] text-stone-500 mt-0.5 block">
                Para consultas de clientes.
              </span>
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                Instagram (ej: allafoglia)
              </label>
              <input
                type="text"
                placeholder="@allafoglia"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#d4cbbf] rounded text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
              />
              <span className="text-[10px] text-stone-500 mt-0.5 block">
                Enlace directo a su perfil.
              </span>
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                PIN Secreto de Acceso *
              </label>
              <input
                type="text"
                required
                placeholder="1234"
                value={accessPin}
                onChange={(e) => setAccessPin(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#d4cbbf] rounded text-stone-900 font-mono tracking-widest focus:outline-none focus:ring-1 focus:ring-amber-800"
              />
              <span className="text-[10px] text-stone-500 mt-0.5 block">
                PIN para su panel privado.
              </span>
            </div>
          </div>

          <div>
            <label className="font-semibold text-stone-800 block mb-1">
              Especialidades (separadas por comas)
            </label>
            <input
              type="text"
              placeholder="Libros Antiguos, Mobiliario de Época, Platería Criolla"
              value={specialtiesText}
              onChange={(e) => setSpecialtiesText(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#d4cbbf] rounded text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
            />
          </div>

          <div>
            <label className="font-semibold text-stone-800 block mb-1">
              Reseña Histórica / Trayectoria del Anticuario
            </label>
            <textarea
              rows={2}
              placeholder="Describí brevemente la trayectoria del espacio, procedencia de sus piezas y enfoque curatorial..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#d4cbbf] rounded text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
            />
          </div>

          {/* Quick Preset Images */}
          <div className="pt-2 border-t border-[#eee7dc] flex items-center justify-between text-xs">
            <span className="text-stone-500">Se asignará foto de galería y banner editorial de alta definición automáticamente.</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#eae3d6] flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded text-xs font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#b45309] hover:bg-[#92400e] text-white rounded text-xs font-semibold shadow-xs flex items-center space-x-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Guardar y Dar de Alta Anticuario</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
