import { AntiqueItem, Dealer, NegotiationOffer } from '../types';

export const INITIAL_DEALERS: Dealer[] = [
  {
    id: 'dealer-alla-foglia',
    name: 'Alla Foglia',
    slug: 'alla-foglia',
    tagline: 'Maestría en dorado a la hoja, marcos de alta época y diálogo con el interiorismo contemporáneo',
    description: 'Atelier de dorado al agua sobre bol de Armenia, bruñido con piedra de ágata y rescate de marcos y espejos de época. Galería curada de piezas históricas singulares integradas a la arquitectura moderna.',
    city: 'Buenos Aires, Argentina',
    address: 'Atelier & Galería Privada (Citas y Consultas)',
    phone: '+54 9 11 4822 9310',
    whatsapp: '5491148229310',
    instagram: 'allafoglia',
    avatar: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=200&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&auto=format&fit=crop&q=80',
    foundedYear: 2004,
    specialties: ['Dorado a la Hoja', 'Marcos Barrocos y Espejos', 'Bol de Armenia & Bruñido', 'Restauración de Marcos', 'Diálogo Contemporáneo'],
    verified: true,
    accessPin: '1234',
    email: 'contacto@allafoglia.com',
  },
  {
    id: 'dealer-casa-intaglieta',
    name: 'Casa Intaglieta',
    slug: 'casa-intaglieta',
    tagline: 'Venta y Liquidación de Residencia Señorial • Mobiliario Noble, Obras y Objetos de Familia',
    description: 'Venta integral del contenido de la distinguida residencia de la familia Intaglieta. Colección privada acumulada a lo largo de tres generaciones: pinacoteca, mobiliario europeo de talla noble, platería de mesa y luminarias históricas en perfecto estado de conservación.',
    city: 'Buenos Aires, Argentina',
    address: 'Residencia & Showroom Privado (Citas Previas)',
    phone: '+54 9 11 4822 9310',
    whatsapp: '5491148229310',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
    foundedYear: 1932,
    specialties: ['Liquidación de Residencia', 'Pintura Clásica Europea', 'Mobiliario Señorial', 'Platería & Cubertería de Gala'],
    verified: true,
    accessPin: '1234',
    email: 'contacto@casaintaglieta.com',
  },
  {
    id: 'dealer-san-telmo',
    name: 'Antigüedades Casa San Telmo',
    slug: 'casa-san-telmo',
    tagline: 'Mobiliario europeo de los siglos XVIII y XIX y orfebrería rioplatense',
    description: 'Tradición familiar desde 1978 en el corazón del casco histórico de San Telmo. Especializados en piezas de época barroca, luisina y orfebrería colonial con peritaje certificado.',
    city: 'Buenos Aires, Argentina',
    address: 'Defensa 1082, San Telmo',
    phone: '+54 9 11 4361 8890',
    whatsapp: '5491143618890',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&auto=format&fit=crop&q=80',
    foundedYear: 1978,
    specialties: ['Mobiliario Francés', 'Platería Criolla & Rioplatense', 'Bronces'],
    verified: true,
    accessPin: '2024',
    email: 'galeria@casasantelmo.com',
  },
  {
    id: 'dealer-deco-recoleta',
    name: 'Galería Art Déco & Siglo XX',
    slug: 'galeria-art-deco',
    tagline: 'Elegancia geométrica, lámparas francesas y mobiliario modernista',
    description: 'Colección selecta de piezas de las décadas de 1920 a 1950. Firmas históricas como Émile-Jacques Ruhlmann, René Lalique, Daum Nancy y maestros del movimiento moderno.',
    city: 'Buenos Aires, Argentina',
    address: 'Av. Alvear 1740, Recoleta',
    phone: '+54 9 11 4802 6540',
    whatsapp: '5491148026540',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=1200&auto=format&fit=crop&q=80',
    foundedYear: 1994,
    specialties: ['Art Déco 1925', 'Cristalería Lalique', 'Iluminación Francesa'],
    verified: true,
    accessPin: '5678',
    email: 'tasaciones@galeriadecorecoleta.com',
  },
  {
    id: 'dealer-desvan-imperial',
    name: 'El Desván Imperial & Relojería',
    slug: 'desvan-imperial',
    tagline: 'Maestría en relojes de antesala, autómatas y pintura clásica europea',
    description: 'Anticuario enfocado en la alta relojería suiza y francesa, bronces de salón con dorado al mercurio y pintura al óleo de escuelas flamenca e italiana.',
    city: 'Madrid / Buenos Aires',
    address: 'Calle Claudio Coello 45, Barrio Salamanca',
    phone: '+34 91 578 3312',
    whatsapp: '34915783312',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
    foundedYear: 1986,
    specialties: ['Alta Relojería Histórica', 'Pintura Siglos XVII-XIX', 'Marquetería Boulle'],
    verified: true,
    accessPin: '4321',
    email: 'antiguedades@desvanimperial.com',
  }
];

export const INITIAL_ITEMS: AntiqueItem[] = [
  {
    id: 'item-alla-foglia-1',
    sku: 'FOGLIA-01',
    title: 'Gran Espejo de Salón Barroco con Querubín Esculpido y Peana con Gavetas, Dorado al Agua con Pan de Oro Fino',
    category: 'Muebles',
    price: 4800,
    currency: 'USD',
    period: 'Siglo XVIII (ca. 1740) / Escuela Italiana',
    origin: 'Italia (Bolonia / Venecia)',
    style: 'Barroco Clásico',
    materials: ['Madera noble tallada a gubia', 'Dorado al agua sobre bol de Armenia', 'Bruñido a piedra de ágata', 'Luna de cristal azogado original biselado', 'Peana inferior con doble gaveta'],
    dimensions: {
      height: 128,
      width: 78,
      depth: 18,
      unit: 'cm',
      weight: '16 kg',
    },
    condition: 'Excelente (sin restauraciones)',
    conditionDetails: 'Extraordinaria preservación del dorado a la hoja antiguo sin repintes modernos. Talla profunda con volutas, hojas de acanto y coronación con querubín alado. Peana original con dos gavetas funcionales.',
    certificate: {
      hasCertificate: true,
      issuer: 'Taller Alla Foglia • Peritaje y Restauración',
      certificateNumber: 'FOGLIA-CERT-2024-01',
      yearCertified: '2024',
      appraiserName: 'Maestría en Conservación de Pan de Oro',
    },
    description: 'Pieza representativa del espíritu Articuario: la sublime convivencia entre la opulencia escultórica del siglo XVIII y la serenidad de la arquitectura contemporánea. Su copete coronado por un rostro alado, el movimiento sinuoso de los acantos calados y la pátina cálida del pan de oro sobre bol rojizo crean un punto focal insustituible sobre muros neutros o consolas modernas.',
    images: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1000&auto=format&fit=crop&q=80',
    ],
    status: 'available',
    dealerId: 'dealer-alla-foglia',
    location: 'Buenos Aires (Atelier Alla Foglia)',
    provenance: 'Colección particular Taller Alla Foglia (Recuperación y dorado al agua)',
    featured: true,
    createdAt: '2026-09-17T08:00:00Z',
  },
  {
    id: 'item-int-1',
    sku: 'INT-101',
    title: 'Gran Mesa de Comedor de Banquete Estilo Renacimiento en Roble Macizo Tallado con 10 Sillas Tapizadas',
    category: 'Muebles',
    price: 8500,
    currency: 'USD',
    period: 'Fines del Siglo XIX (ca. 1890)',
    origin: 'Italia (Florencia) / Residencia Intaglieta',
    style: 'Neorrenacimiento Italiano',
    materials: ['Roble macizo de Eslavonia', 'Tallas de cariátides y acanto', 'Tapicería en brocado de seda carmesí'],
    dimensions: {
      height: 79,
      width: 285,
      depth: 120,
      unit: 'cm',
      weight: '140 kg conjunto',
    },
    condition: 'Muy bueno (pátina original de época)',
    conditionDetails: 'Mesa de gran porte con dos patas escultóricas unidas por chambrana tallada. Pátina a la cera virgen intacta. El juego incluye 2 sillones de cabecera con apoyabrazos y 8 sillas de banquete firmes.',
    certificate: {
      hasCertificate: true,
      issuer: 'Asociación de Peritos Anticuarios y Tasadores',
      certificateNumber: 'INTAG-ESTATE-101',
      yearCertified: '2024',
      appraiserName: 'Dra. Silvina Argañaraz',
    },
    description: 'Pieza estelar del salón de comedor de Casa Intaglieta. Elaborada por encargo en talleres florentinos a fines del siglo XIX. La superficie presenta tableros alistonados con moldura perimetral en gola y faldón profusamente tallado.',
    images: [
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80',
    ],
    status: 'available',
    dealerId: 'dealer-casa-intaglieta',
    location: 'San Fernando (Prov. Bs. As.)',
    provenance: 'Colección privada Residencia Señorial Familia Intaglieta',
    featured: true,
    createdAt: '2026-09-13T09:00:00Z',
  },
  {
    id: 'item-int-2',
    sku: 'INT-102',
    title: 'Retrato al Óleo Señorial "Dama con Abanico de Nácar", Escuela Europea del Siglo XIX',
    category: 'Arte y Pintura',
    price: 6400,
    currency: 'USD',
    period: 'Siglo XIX (ca. 1875)',
    origin: 'Francia / Colección Familiar Intaglieta',
    style: 'Retrato Académico Decimonónico',
    materials: ['Óleo sobre tela de lino original', 'Marco francés en madera tallada y dorado a la hoja'],
    dimensions: {
      height: 115,
      width: 92,
      depth: 10,
      unit: 'cm',
      weight: '11 kg con marco',
    },
    condition: 'Excelente (sin restauraciones)',
    conditionDetails: 'Pintura conservada en ambiente controlado en la residencia. Marco dorado de época original sin faltantes de estuco.',
    certificate: {
      hasCertificate: true,
      issuer: 'Instituto de Tasaciones y Bellas Artes',
      certificateNumber: 'INTAG-ESTATE-102',
      yearCertified: '2023',
      appraiserName: 'Prof. Héctor M. Valenzuela',
    },
    description: 'Retrato de gran formato proveniente de la pinacoteca de Casa Intaglieta. Representa a una dama de alta sociedad vestida en seda azabache con mantilla de encaje de Bruselas y abanico de nácar finamente calado.',
    images: [
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
    ],
    status: 'available',
    dealerId: 'dealer-casa-intaglieta',
    location: 'San Fernando (Prov. Bs. As.)',
    provenance: 'Pinacoteca particular Familia Intaglieta',
    featured: true,
    createdAt: '2026-09-13T09:30:00Z',
  },
  {
    id: 'item-int-3',
    sku: 'INT-103',
    title: 'Guarnición de Chimenea Luis XVI: Reloj en Bronce Dorado al Mercurio y Par de Candelabros de 5 Luces',
    category: 'Relojería',
    price: 4900,
    currency: 'USD',
    period: 'Época Napoleón III (ca. 1870)',
    origin: 'Francia (París) / Residencia Intaglieta',
    style: 'Neoclásico Luis XVI',
    materials: ['Bronce fundido con dorado al mercurio', 'Mármol Blanco Estatuario de Carrara', 'Esfera esmaltada'],
    dimensions: {
      height: 54,
      width: 38,
      depth: 19,
      unit: 'cm',
      weight: '28 kg conjunto tríptico',
    },
    condition: 'Excelente (sin restauraciones)',
    conditionDetails: 'El reloj funciona perfectamente con sonería sobre campana de bronce. Se entrega con llave original de bronce y péndulo numerado.',
    certificate: {
      hasCertificate: true,
      issuer: 'Cámara Argentina de Anticuarios y Peritos de Arte',
      certificateNumber: 'INTAG-ESTATE-103',
      yearCertified: '2024',
      appraiserName: 'Jean-Luc Moreau',
    },
    description: 'Conjunto señorial completo de tres piezas que decoraba la chimenea principal de Casa Intaglieta. El reloj está coronado por un ánfora clásica y flanqueado por guirnaldas de laurel; los candelabros ostentan cinco brazos torneados con volutas.',
    images: [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    ],
    status: 'available',
    dealerId: 'dealer-casa-intaglieta',
    location: 'San Fernando (Prov. Bs. As.)',
    featured: true,
    createdAt: '2026-09-13T10:00:00Z',
  },
  {
    id: 'item-int-4',
    sku: 'INT-104',
    title: 'Juego de Cubertería de Gala Christofle para 12 Personas en Mueble Cubertero de Caoba (144 Piezas)',
    category: 'Platería y Orfebrería',
    price: 5800,
    currency: 'USD',
    period: 'Belle Époque (ca. 1910)',
    origin: 'Francia (París) / Residencia Intaglieta',
    style: 'Luis XV Malmaison',
    materials: ['Metal bañado en plata de alto micraje Christofle Orfèvre', 'Hojas de acero inoxidable', 'Mueble de caoba'],
    dimensions: {
      height: 45,
      width: 60,
      depth: 42,
      unit: 'cm',
      weight: '22 kg con mueble',
    },
    condition: 'Muy bueno (pátina original de época)',
    conditionDetails: 'Juego completo de 144 piezas sin faltantes. Punzones de balanza Christofle nítidos. Estuche mueble de tres cajones forrados en fieltro verde anti-deslustre original.',
    certificate: {
      hasCertificate: true,
      issuer: 'Goldsmiths & Silversmiths Historical Society',
      certificateNumber: 'CHR-INTAG-1910',
      yearCertified: '2024',
      appraiserName: 'Arthur Pendelton',
    },
    description: 'Servicio formal de mesa de la residencia Intaglieta para banquetes protocolares. Incluye cubiertos de entrada, principales, pescado, postre, café y 12 piezas de servicio especiales (cucharón sopero, pinzas de espárragos y paletas).',
    images: [
      'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800&auto=format&fit=crop&q=80',
    ],
    status: 'available',
    dealerId: 'dealer-casa-intaglieta',
    location: 'San Fernando (Prov. Bs. As.)',
    featured: true,
    createdAt: '2026-09-13T10:30:00Z',
  },
  {
    id: 'item-int-5',
    sku: 'INT-105',
    title: 'Gran Araña de Salón en Cristal de Bohemia Tallado con 12 Brazos y Lágrimas Facetadas',
    category: 'Iluminación',
    price: 6200,
    currency: 'USD',
    period: 'Principios del Siglo XX (ca. 1915)',
    origin: 'República Checa (Bohemia) / Residencia Intaglieta',
    style: 'Clásico Palaciego',
    materials: ['Cristal de Bohemia soplado y tallado a la rueda', 'Alma de latón dorado', 'Cúpula y platillos repujados'],
    dimensions: {
      height: 110,
      width: 90,
      depth: 90,
      unit: 'cm',
      weight: '26 kg',
    },
    condition: 'Excelente (sin restauraciones)',
    conditionDetails: 'Desmontada cuidadosamente del hall principal de Casa Intaglieta. Electrificación actualizada con cables siliconados ignífugos. Todos los caireles originales intactos.',
    certificate: {
      hasCertificate: true,
      issuer: 'Registro Europeo de Artes Decorativas',
      certificateNumber: 'BOH-INTAG-1915',
      yearCertified: '2023',
      appraiserName: 'Prof. Dr. Klaus Steiner',
    },
    description: 'Imponente luminaria de recepción. Sus doce brazos curvados en cristal macizo sostienen tulipas talladas con prismas que refractan el espectro lumínico de forma excepcional.',
    images: [
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&auto=format&fit=crop&q=80',
    ],
    status: 'available',
    dealerId: 'dealer-casa-intaglieta',
    featured: true,
    createdAt: '2026-09-13T11:00:00Z',
  },
  {
    id: 'item-1',
    sku: 'ANT-2841',
    title: 'Cómoda Commode Época Luis XV con Marquetería de Palisandro y Bronces Cincelados',
    category: 'Muebles',
    price: 6800,
    currency: 'USD',
    period: 'Luis XV (ca. 1750 - 1765)',
    origin: 'Francia (París)',
    style: 'Rococó / Luis XV',
    materials: ['Palisandro de Río', 'Palo de Rosa', 'Bronce dorado al mercurio', 'Mármol Rouge Royal'],
    dimensions: {
      height: 87,
      width: 124,
      depth: 58,
      unit: 'cm',
      weight: '62 kg',
    },
    condition: 'Muy bueno (pátina original de época)',
    conditionDetails: 'Conserva el mármol original intacto con ligero biselado de época. Bronces de origen con dorado al mercurio legítimo. Lustre a muñeca renovado respetando la goma laca antigua.',
    certificate: {
      hasCertificate: true,
      issuer: 'Cámara Argentina de Anticuarios y Peritos de Arte',
      certificateNumber: 'CAA-2024-8849-B',
      yearCertified: '2024',
      appraiserName: 'Prof. Héctor M. Valenzuela (Perito Judicial)',
    },
    description: 'Excepcional commode de dos cajones sin travesaño a la vista (sans traverse), con frente y laterales abombados. La superficie exterior presenta una sutil marquetería floral en maderas exóticas finamente contrastadas. Guarniciones en bronce con motivos rocalla cincelados a mano.',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
    ],
    status: 'available',
    dealerId: 'dealer-san-telmo',
    location: 'CABA (San Telmo)',
    featured: false,
    createdAt: '2026-08-15T10:00:00Z',
  },
  {
    id: 'item-2',
    sku: 'ANT-9104',
    title: 'Reloj de Sobremesa en Bronce Dorado al Mercurio y Mármol Verde de Mar',
    category: 'Relojería',
    price: 3450,
    currency: 'USD',
    period: 'Imperio Napoleónico (ca. 1810)',
    origin: 'Francia',
    style: 'Imperio Neoclásico',
    materials: ['Bronce al mercurio (Or-Moulu)', 'Mármol Verde de Mar', 'Esfera de esmalte blanco'],
    dimensions: {
      height: 48,
      width: 32,
      depth: 16,
      unit: 'cm',
      weight: '14 kg',
    },
    condition: 'Excelente (sin restauraciones)',
    conditionDetails: 'Mecanismo original de hilo de seda revisado y aceitado por maestro relojero. Sonería a horas y medias sobre campana de plata. Incluye llave y péndulo de origen.',
    certificate: {
      hasCertificate: true,
      issuer: 'Société Internationale d’Horlogerie Ancienne',
      certificateNumber: 'SIHA-FR-7120',
      yearCertified: '2023',
      appraiserName: 'Jean-Luc Moreau',
    },
    description: 'Reloj alegórico de la Astronomía coronado por la figura de Urania con esfera celeste y compás. La base de mármol verde presenta aplicaciones en bajo relieve de musas y guirnaldas de laurel.',
    images: [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    ],
    status: 'in_negotiation',
    dealerId: 'dealer-desvan-imperial',
    location: 'Tigre (Prov. Bs. As.)',
    featured: false,
    createdAt: '2026-08-20T14:30:00Z',
  },
  {
    id: 'item-6',
    sku: 'ANT-6623',
    title: 'Par de Jarrones Baluarte en Porcelana de Sèvres con Escenas Galantes y Bronces Rococó',
    category: 'Cerámica y Porcelana',
    price: 4900,
    currency: 'USD',
    period: 'Época Napoleón III (ca. 1865)',
    origin: 'Francia (Sèvres)',
    style: 'Napoleón III / Neorococó',
    materials: ['Porcelana pasta dura policromada', 'Esmalte azul cobalto real (Bleu de Roi)', 'Pan de oro 24k', 'Monturas de bronce cincelado'],
    dimensions: {
      height: 52,
      width: 22,
      depth: 18,
      unit: 'cm',
      weight: '8.5 kg el par',
    },
    condition: 'Excelente (sin restauraciones)',
    conditionDetails: 'Sin pelos, pelos de cocción, grietas ni faltantes en los oros. Marca de Sèvres en azul bajo vidriado con letras fecha.',
    certificate: {
      hasCertificate: true,
      issuer: 'Manufacture Nationale de Sèvres - Registro Histórico',
      certificateNumber: 'SEV-N3-1865-PAIR',
      yearCertified: '2023',
      appraiserName: 'Pierre de la Roche',
    },
    description: 'Impresionante par de urnas de coleccionista. Cada jarrón muestra en su anverso una pintura al esmalte firmada de damas y caballeros en jardines palaciegos, y en el reverso paisajes bucólicos enmarcados en ricos arabescos dorados.',
    images: [
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=800&auto=format&fit=crop&q=80',
    ],
    status: 'available',
    dealerId: 'dealer-san-telmo',
    featured: false,
    createdAt: '2026-09-05T12:00:00Z',
  },
  {
    id: 'item-7',
    sku: 'ANT-1092',
    title: 'Escultura en Bronce "El Arquero Olímpico" con Pátina Marrón y Verde Florentina',
    category: 'Esculturas y Bronces',
    price: 3800,
    currency: 'USD',
    period: 'Art Déco (ca. 1928)',
    origin: 'Francia / Bélgica',
    style: 'Art Déco Clásico',
    materials: ['Bronce fundición a la cera perdida', 'Peana escalonada en mármol Portoro negro y dorado'],
    dimensions: {
      height: 42,
      width: 55,
      depth: 17,
      unit: 'cm',
      weight: '12 kg',
    },
    condition: 'Muy bueno (pátina original de época)',
    conditionDetails: 'Fundición de época con sello de taller fundidor "Fonderie des Artistes - Paris". Hermosa pátina bitono preservada.',
    certificate: {
      hasCertificate: false,
    },
    description: 'Dinámica representación anatómica de un arquero tensando el arco. Las líneas tensas y la musculatura estilizada ejemplifican la transición del heroísmo clásico a la estética moderna de entreguerras.',
    images: [
      'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&auto=format&fit=crop&q=80',
    ],
    status: 'available',
    dealerId: 'dealer-deco-recoleta',
    featured: false,
    createdAt: '2026-09-08T18:10:00Z',
  },
  {
    id: 'item-8',
    sku: 'ANT-5531',
    title: 'Secrétaire à Abattant Biedermeier en Raíz de Abedul Flameada y Ébano',
    category: 'Muebles',
    price: 5200,
    currency: 'USD',
    period: 'Biedermeier (ca. 1835)',
    origin: 'Austria (Viena)',
    style: 'Biedermeier Vienés',
    materials: ['Chapa de raíz de abedul rubio', 'Filetes de ébano macizo', 'Cajonería secreta en madera de peral'],
    dimensions: {
      height: 142,
      width: 98,
      depth: 46,
      unit: 'cm',
      weight: '48 kg',
    },
    condition: 'Bueno (con leves marcas de uso histórico)',
    conditionDetails: 'Mantiene las cerraduras de trébol originales en hierro forjado y llaves de latón. Interior arquitectónico con columnillas y 6 cajones secretos ocultos.',
    certificate: {
      hasCertificate: true,
      issuer: 'Wiener Kunstakademie - Peritaje de Mobiliario',
      certificateNumber: 'WKA-AT-1835-B',
      yearCertified: '2020',
      appraiserName: 'Prof. Dr. Klaus Steiner',
    },
    description: 'Elegancia arquitectónica sobria típica del Biedermeier austríaco. El frente abatible se abre revelando un suntuoso escritorio forrado en tafilete de cuero verde repujado en oro y un "teatro" central de cajoncillos.',
    images: [
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
    ],
    status: 'available',
    dealerId: 'dealer-desvan-imperial',
    featured: true,
    createdAt: '2026-09-10T10:00:00Z',
  },
  {
    id: 'item-book-1',
    sku: 'LIB-301',
    title: 'Don Quijote de la Mancha (Edición Monumental de Lujo ilustrada por Gustave Doré, 2 Tomos)',
    category: 'Libros y Manuscritos',
    price: 1850,
    currency: 'USD',
    period: 'Siglo XIX (ca. 1880)',
    origin: 'Barcelona, España / Biblioteca Particular San Telmo',
    style: 'Encuadernación Romántica / Clásica',
    materials: ['Papel de hilo satinado', 'Encuadernación en media piel de zapa con nervios y hierros dorados', 'Cortes tintados'],
    dimensions: {
      height: 38,
      width: 29,
      depth: 14,
      unit: 'cm',
      weight: '9 kg (ambos tomos)',
    },
    condition: 'Excelente (sin restauraciones)',
    conditionDetails: 'Ejemplar en impecable estado de conservación, sin picaduras ni manchas de humedad ácida. Incluye la totalidad de las láminas a toda página al aguafuerte de Gustave Doré.',
    certificate: {
      hasCertificate: true,
      issuer: 'Sociedad Iberoamericana de Bibliofilia y Manuscritos',
      certificateNumber: 'BIB-1880-DQ-02',
      yearCertified: '2023',
      appraiserName: 'Prof. Gonzalo de la Serna',
    },
    description: 'Magna edición en folio mayor de la obra cumbre de Cervantes. Contiene las célebres 120 ilustraciones xilográficas y 257 viñetas de Gustave Doré grabadas por H. Pisan. Una de las piezas bibliofílicas más deseadas por coleccionistas de letras.',
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
    ],
    status: 'available',
    dealerId: 'dealer-san-telmo',
    featured: true,
    createdAt: '2026-09-15T11:00:00Z',
  },
  {
    id: 'item-book-2',
    sku: 'LIB-302',
    title: 'L’Encyclopédie de Diderot et d’Alembert: Recueil de Planches sur les Sciences et les Arts (Tomo III Original)',
    category: 'Libros y Manuscritos',
    price: 3400,
    currency: 'USD',
    period: 'Siglo XVIII (ca. 1765)',
    origin: 'París, Francia',
    style: 'Ilustración Francesa / Siglo de las Luces',
    materials: ['Papel verjurado con marcas de agua de molino', 'Encuadernación en tafilete de época con lomo en piel de becerro'],
    dimensions: {
      height: 42,
      width: 28,
      depth: 6,
      unit: 'cm',
      weight: '4.5 kg',
    },
    condition: 'Muy bueno (pátina original de época)',
    conditionDetails: 'Encuadernación de época original con escudos dorados en el lomo. Todos los grabados desplegables sobre botánica, relojería, ebanistería y astronomía en excelente estado.',
    certificate: {
      hasCertificate: true,
      issuer: 'Asociación Internacional de Libreros Anticuarios (ILAB)',
      certificateNumber: 'ILAB-FR-1765-DID',
      yearCertified: '2022',
      appraiserName: 'Étienne Laurent',
    },
    description: 'Volumen original de gran formato de la célebre Enciclopedia Francesa que cambió el pensamiento universal. Incluye más de 200 grabados calcográficos en cobre minuciosamente detallados sobre artes mecánicas, arquitectura y diseño de mobiliario del siglo XVIII.',
    images: [
      'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&auto=format&fit=crop&q=80',
    ],
    status: 'available',
    dealerId: 'dealer-casa-intaglieta',
    featured: true,
    createdAt: '2026-09-15T12:00:00Z',
  },
  {
    id: 'item-sold-archive-1',
    sku: 'ARC-701',
    title: 'Cómoda Francesa de Dos Cajones Sans Traverse con Marquetería Floral y Bronces Rocalla Luis XV',
    category: 'Muebles',
    price: 12500,
    currency: 'USD',
    period: 'Época Luis XV (ca. 1760)',
    origin: 'Francia (París)',
    style: 'Rococó / Luis XV',
    materials: ['Palo de rosa', 'Palisandro', 'Bronce dorado al fuego', 'Mármol Breccia original'],
    dimensions: {
      height: 86,
      width: 130,
      depth: 58,
      unit: 'cm',
      weight: '65 kg',
    },
    condition: 'Excelente (sin restauraciones)',
    conditionDetails: 'Extraordinaria conservación de la marquetería de flores en maderas frutales. Tapa de mármol con moldura en pico de cuervo original.',
    certificate: {
      hasCertificate: true,
      issuer: 'Cámara Francesa de Peritos Anticuarios',
      certificateNumber: 'PER-FR-1760-LXV',
      yearCertified: '2021',
      appraiserName: 'Maître Jean-Pierre Dubois',
    },
    description: 'Magistral cómoda de alta época parisina con marquetería de follaje y flores exóticas. Estampilla atribuida a maestro ebanista del Faubourg Saint-Antoine. Obra cumbre adjudicada a una distinguida colección privada antes de su catalogación pública.',
    images: [
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80',
    ],
    status: 'sold',
    hidePrice: true,
    dealerId: 'dealer-alla-foglia',
    location: 'Buenos Aires (Colección Particular)',
    provenance: 'Colección privada Residencia Familia Quintana (Adjudicada en subasta privada)',
    featured: false,
    createdAt: '2026-08-10T10:00:00Z',
  }
];

export const INITIAL_OFFERS: NegotiationOffer[] = [
  {
    id: 'offer-1',
    itemId: 'item-2',
    itemTitle: 'Reloj de Sobremesa en Bronce Dorado al Mercurio y Mármol Verde de Mar',
    itemSku: 'ANT-9104',
    itemImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    originalPrice: 3450,
    currency: 'USD',
    dealerId: 'dealer-desvan-imperial',
    buyerName: 'Arq. Marcelo Benítez',
    buyerPhone: '+54 9 11 5900 1234',
    offeredPrice: 2900,
    counterOfferPrice: 3150,
    status: 'countered',
    messages: [
      {
        id: 'msg-1',
        sender: 'buyer',
        senderName: 'Arq. Marcelo Benítez',
        message: 'Buenas tardes. Me interesa la pieza para un proyecto de interiorismo clásico. ¿Aceptaría una oferta de contado de $2,900 USD?',
        amount: 2900,
        timestamp: '2026-09-12T15:30:00Z',
      },
      {
        id: 'msg-2',
        sender: 'dealer',
        senderName: 'El Desván Imperial',
        message: 'Estimado Arq. Benítez, agradecemos su propuesta. Teniendo en cuenta que el escape y sonería están recién calibrados con repuestos legítimos, podemos cerrar en un término medio de $3,150 USD.',
        amount: 3150,
        timestamp: '2026-09-12T17:15:00Z',
      }
    ],
    createdAt: '2026-09-12T15:30:00Z',
    updatedAt: '2026-09-12T17:15:00Z',
  }
];

// Local storage keys
const STORAGE_ITEMS_KEY = 'anticuario_items_v3';
const STORAGE_DEALERS_KEY = 'anticuario_dealers_v3';
const STORAGE_OFFERS_KEY = 'anticuario_offers_v3';
const STORAGE_INIT_KEY = 'anticuario_catalog_initialized_v3';

export const SAMPLE_ITEM_IDS = INITIAL_ITEMS.map((it) => it.id);

export function getStoredItems(): AntiqueItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_ITEMS_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Ensure Alla Foglia's mirror piece is included
        const hasAllaFoglia = parsed.some((it) => it.id === 'item-alla-foglia-1');
        if (!hasAllaFoglia && INITIAL_ITEMS.some((it) => it.id === 'item-alla-foglia-1')) {
          const fogliaItem = INITIAL_ITEMS.find((it) => it.id === 'item-alla-foglia-1')!;
          return [fogliaItem, ...parsed];
        }
        return parsed;
      }
    }

    const isInitialized = localStorage.getItem(STORAGE_INIT_KEY);
    if (isInitialized === 'true') {
      return [];
    }

    // Try migration from v2 if available
    const rawV2 = localStorage.getItem('anticuario_items_v2');
    if (rawV2 !== null) {
      const parsedV2 = JSON.parse(rawV2);
      if (Array.isArray(parsedV2)) {
        saveStoredItems(parsedV2);
        return parsedV2;
      }
    }
  } catch (e) {
    console.warn('Failed to load items from storage', e);
  }
  return INITIAL_ITEMS;
}

export function saveStoredItems(items: AntiqueItem[]): void {
  try {
    localStorage.setItem(STORAGE_ITEMS_KEY, JSON.stringify(items));
    localStorage.setItem(STORAGE_INIT_KEY, 'true');
  } catch (e) {
    console.warn('Failed to save items to storage', e);
  }
}

export const SAMPLE_DEALER_IDS = [
  'dealer-casa-intaglieta',
  'dealer-san-telmo',
  'dealer-deco-recoleta',
  'dealer-desvan-imperial',
];

export function getStoredDealers(): Dealer[] {
  try {
    const raw = localStorage.getItem(STORAGE_DEALERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Filter out duplicate workshop profile if user's real Allafoglia profile exists
        const cleaned = parsed.filter((d: Dealer) => {
          // If a dealer is literally named with "Taller de Dorado" and there's another Alla Foglia profile, drop the workshop
          const isWorkshopNamed = d.name.toLowerCase().includes('taller de dorado');
          const hasAnotherFoglia = parsed.some(
            (other: Dealer) =>
              other.id !== d.id &&
              (other.name.toLowerCase().includes('allafoglia') ||
                other.name.toLowerCase().includes('alla foglia') ||
                other.slug?.toLowerCase().includes('alla-foglia'))
          );
          if (isWorkshopNamed && hasAnotherFoglia) {
            return false;
          }
          return true;
        });

        // Ensure each dealer has accessPin, email and instagram
        const updated = cleaned.map((d: Dealer) => {
          const initial = INITIAL_DEALERS.find((init) => init.id === d.id);
          return {
            ...d,
            accessPin: d.accessPin || initial?.accessPin || '1234',
            email: d.email || initial?.email || `${d.slug || 'anticuario'}@galeria.com`,
            instagram: d.instagram || initial?.instagram,
          };
        });

        // Ensure at least Alla Foglia exists once
        const hasFoglia = updated.some(
          (d) =>
            d.id === 'dealer-alla-foglia' ||
            d.name.toLowerCase().includes('allafoglia') ||
            d.name.toLowerCase().includes('alla foglia')
        );
        if (!hasFoglia) {
          const allaFoglia = INITIAL_DEALERS.find((d) => d.id === 'dealer-alla-foglia');
          if (allaFoglia) {
            return [allaFoglia, ...updated];
          }
        }
        return updated;
      }
    }
  } catch (e) {
    console.warn('Failed to load dealers from storage', e);
  }
  return INITIAL_DEALERS;
}

export function saveStoredDealers(dealers: Dealer[]): void {
  try {
    localStorage.setItem(STORAGE_DEALERS_KEY, JSON.stringify(dealers));
  } catch (e) {
    console.warn('Failed to save dealers to storage', e);
  }
}

export function getStoredOffers(): NegotiationOffer[] {
  try {
    const raw = localStorage.getItem(STORAGE_OFFERS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to load offers from storage', e);
  }
  return INITIAL_OFFERS;
}

export function saveStoredOffers(offers: NegotiationOffer[]): void {
  try {
    localStorage.setItem(STORAGE_OFFERS_KEY, JSON.stringify(offers));
  } catch (e) {
    console.warn('Failed to save offers to storage', e);
  }
}
