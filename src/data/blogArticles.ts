import { BlogArticle } from '../types';

export const INITIAL_ARTICLES: BlogArticle[] = [
  {
    id: 'art-dorado-hoja-espejo-barroco',
    slug: 'luz-viva-del-pan-de-oro-espejo-barroco',
    title: 'La luz viva del pan de oro: por qué un gran espejo barroco transforma cualquier espacio contemporáneo',
    subtitle: 'Secretos de taller sobre el bol de Armenia, la piedra de ágata y el diálogo entre tres siglos de historia y la arquitectura de hoy.',
    category: 'Oficios & Restauración',
    readTime: '6 min de lectura',
    author: 'Alla Foglia • Taller de Dorado (@allafoglia)',
    authorRole: 'Maestros Doradores y Articuarios',
    date: 'Septiembre 2026',
    coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Pocas cosas conmueven tanto la mirada en un ambiente contemporáneo como la irrupción de un marco antiguo dorado a la hoja. Lejos de saturar, la textura del oro fino y la voluptuosidad de la talla le devuelven al espacio moderno la profundidad, el misterio y el calor que las superficies industriales han borrado.',
    featured: true,
    tags: ['Dorado a la hoja', 'Barroco', 'Bol de Armenia', 'Interiorismo', 'Espejos antiguos', 'Restauración', 'Alla Foglia'],
    relatedCategories: ['Muebles', 'Esculturas y Bronces', 'Arte y Pintura'],
    relatedItemIds: ['item-alla-foglia-1', 'item-int-2', 'item-int-3'],
    sections: [
      {
        sectionTitle: '1. El diálogo magnético entre dos mundos',
        paragraphs: [
          'Entrar a un departamento de líneas contemporáneas —con sus muros lisos en tonos neutros, sus ventanales amplios y sus pisos despojados de madera o microcemento— y toparse con un gran espejo barroco dorado a la hoja produce una fascinación inmediata. No es una contradicción decorativa: es un acto de alta armonía.',
          'La arquitectura contemporánea sobresale por la pureza ortogonal y la calma visual, pero en ocasiones corre el riesgo de sentirse aséptica o carente de gravitación emocional. Es allí donde el marco barroco actúa como un corazón palpitante: rompe la linealidad con sus curvas vegetales, sus hojas de acanto y sus claroscuros esculpidos a gubia, aportando un anclaje temporal irrepetible.'
        ],
        quote: '«Una pieza con siglos de historia no compite con el diseño contemporáneo: le otorga la dimensión de la memoria y la nobleza que ningún mueble recién salido de fábrica puede simular.»'
      },
      {
        sectionTitle: '2. Bajo el oro: el rito invisible del bol de Armenia',
        paragraphs: [
          'Quien contempla un dorado antiguo rara vez sospecha la paciente estratigrafía que lo sostiene. En el dorado tradicional al agua (el método noble descripto ya por Cennino Cennini en su célebre tratado del siglo XIV), el oro no se adhiere directamente sobre la madera.',
          'Primero se aplican múltiples capas de yeso fino diluido con cola orgánica de conejo, raspadas y lijadas a mano con paciencia infinita hasta obtener una superficie tan tersa como el marfil. Sobre ese lecho blanco se asienta el secreto del color: el bol de Armenia.',
          'El bol es una arcilla volcánica finísima, tradicionalmente en tonos rojo óxido, siena o amarillo ocre. Además de actuar como colchón elástico para recibir el oro, es el responsable del alma de la pieza: con el paso de las décadas y los siglos, en las aristas más expuestas donde la lámina metálica sufre un desgaste natural por el roce suave, asoma esa pátina rojiza y cálida que distingue al dorado auténtico de cualquier imitación con esmalte sintético.'
        ],
        tipBox: 'El detalle del experto: Si observas un marco y notas que en los desgastes asoma una tonalidad rojiza cálida y suave (el bol), estás ante un dorado al agua clásico. Las pinturas doradas modernas envejecen tornándose verdosas, grises o descascaradas en placas plásticas.'
      },
      {
        sectionTitle: '3. El soplado de la hoja y el milagro del bruñido a ágata',
        paragraphs: [
          'Trabajar el pan de oro exige una respiración contenida y un respeto reverencial por la materia. Las hojas de oro fino tienen un espesor inferior a una fracción de micrón; cualquier corriente de aire mínima en el taller las disolvería en el vacío.',
          'El artesano las corta sobre la almohadilla de gamuza con un cuchillo de hoja ancha, las levanta valiéndose de la electricidad estática de la polonesa (un pincel chato de pelos de marta que se frota suavemente contra la mejilla o el cabello) y las deposita sobre la madera humedecida con agua colada.',
          'Pero la magia definitiva ocurre durante el bruñido: cuando la humedad alcanza el punto justo de secado, se desliza con firmeza una piedra de ágata montada en mango de madera (o el tradicional diente de perro de los antiguos ebanistas). La presión compacta el oro contra el bol, cerrando los poros y convirtiendo una superficie opaca en un espejo metálico resplandeciente.',
          'El maestro dorador nunca bruñe todo el marco por igual: deja los fondos tallados en oro mate y resalta solo los relieves y las volutas con el ágata. Ese juego de luz y sombra es lo que hace que el marco parezca emitir una vibración dorada interior cuando le da la luz natural.'
        ]
      },
      {
        sectionTitle: '4. Dónde y cómo ubicarlo en un hogar actual',
        paragraphs: [
          'Para que un espejo barroco o rococó despliegue toda su fuerza en un hogar moderno, no hace falta recrear un palacete de época. Al contrario, las mejores resoluciones son las más despojadas:',
          '• En el recibidor o entrada: suspendido sobre una consola contemporánea de hierro negro o mármol simple. Genera una primera impresión memorable y duplica la luz de bienvenida.',
          '• Apoyado en el suelo: si el marco supera el metro sesenta de altura, apoyarlo directamente sobre el piso, con una leve inclinación contra la pared principal del living o vestidor, transmite una elegancia desenfadada, culta y muy actual (el sello de los grandes interioristas europeos).',
          '• Sobre una chimenea o estante minimalista: contrastando con líneas puras y una selección de libros o una cerámica escultórica contemporánea.'
        ]
      },
      {
        sectionTitle: '5. Conservación: el cuidado respetuoso en casa',
        paragraphs: [
          'Un marco dorado a la hoja que ha sobrevivido dos o tres siglos puede conservarse intacto por generaciones más si se respetan unas pocas reglas de oro.',
          'El peor enemigo del dorado al agua son los limpiadores comerciales de vidrios, los aerosoles lustramuebles y la humedad excesiva. Jamás apliques alcoholes ni paños húmedos sobre el marco: disolverían la cola orgánica subyacente y arrancarían las hojas de oro.',
          'Para el mantenimiento cotidiano, basta con un plumero de pluma natural muy suave o una brocha de pelo de marta para quitar el polvo acumulado en las molduras. El cristal del espejo debe limpiarse humedeciendo apenas un paño de microfibra, evitando que el líquido escurra hacia los bordes en contacto con la madera dorada.'
        ],
        tipBox: 'Regla de taller: Nunca intentes «hacer brillar» un marco antiguo con productos abrillantadores. El valor y la emoción de la pieza residen en su pátina intacta, en ese brillo profundo y atenuado por los siglos que ninguna fábrica moderna puede comprar.'
      }
    ]
  },
  {
    id: 'art-lustre-muneca-goma-laca',
    slug: 'secreto-lustre-muneca-goma-laca',
    title: 'El secreto del lustre a muñeca: la profundidad viva que el barniz moderno nunca pudo igualar',
    subtitle: 'Cómo las escamas de secreción vegetal y el alcohol puro crean un cristal líquido que alimenta la veta de la madera centenaria.',
    category: 'Oficios & Restauración',
    readTime: '5 min de lectura',
    author: 'Taller de Ebanistería Histórica',
    authorRole: 'Restauradores Colegiados',
    date: 'Agosto 2026',
    coverImage: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Cuando tocas una mesa inglesa de caoba o un secreter de nogal del siglo XIX lustrado a muñeca, sientes la calidez directa de la madera, no una película de plástico. Descubre el oficio del lustre francés (*au tampon*) y por qué sigue siendo insuperable.',
    featured: false,
    tags: ['Goma laca', 'Lustre a muñeca', 'Ebanistería', 'Nogal', 'Caoba', 'Pátina'],
    relatedCategories: ['Muebles', 'Objetos de Colección'],
    relatedItemIds: ['item-int-1', 'item-2', 'item-int-5'],
    sections: [
      {
        sectionTitle: '1. El tacto que ninguna laca sintética puede replicar',
        paragraphs: [
          'Los barnices poliuretánicos y las lacas catalizadas modernas fueron inventados para la rapidez industrial: cubren la madera con un escudo plástico impenetrable, uniforme y frío al tacto. En cambio, el mueble antiguo respira.',
          'El lustre francés (*vernis au tampon*) utiliza la goma laca natural disuelta en alcohol etílico de alta graduación. A diferencia de las pinturas que se asientan encima, la goma laca penetra en la fibra leñosa, refractando la luz desde el interior de la veta y confiriéndole ese efecto tornasolado tridimensional tan característico de las maderas nobles como la pluma de caoba, el jacarandá o la raíz de nogal.'
        ]
      },
      {
        sectionTitle: '2. El rito de la muñeca y la piedra pómez',
        paragraphs: [
          'La «muñeca» es una almohadilla hecha con lana natural envuelta en un lienzo de algodón fino sin pelusa. El ebanista no pinta con pinceladas rectas: describe movimientos en espiral, ochos y círculos infinitos, alimentando el interior de la muñeca con unas pocas gotas de barniz y una gota mínima de aceite mineral puro para que deslice sin frenarse.',
          'Antes de dar brillo, se tapan los poros de la madera espolvoreando polvo finísimo de piedra pómez volcánica molida, que al rozarse con el alcohol forma una pasta translúcida perfecta que sella la superficie sin tapar el dibujo de las fibras.'
        ],
        tipBox: 'Mantenimiento en el hogar: Una mesa con lustre a muñeca solo necesita una frotada periódica con una franela seca y limpia. Una o dos veces al año, una nuez de cera virgen de abejas de buena calidad devolverá la tersura y protegerá el mueble.'
      }
    ]
  },
  {
    id: 'art-eclecticismo-culto-interiorismo',
    slug: 'arte-eclecticismo-culto-antiguedades-hogar-moderno',
    title: 'El arte del eclecticismo culto: cómo hacer convivir épocas sin saturar tu casa',
    subtitle: 'Claves de composición visual, puntos focales y equilibrio para que tu espacio no parezca un decorado de época ni un showroom impersonal.',
    category: 'Interiorismo & Eclecticismo',
    readTime: '5 min de lectura',
    author: 'Curaduría Editorial Articuarios',
    authorRole: 'Especialistas en Diseño y Patrimonio',
    date: 'Julio 2026',
    coverImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'El eclecticismo no consiste en acumular recuerdos, sino en orquestar contrastes precisos. Aprende las reglas de proporción que emplean los grandes arquitectos de París y Londres para mezclar un sillón contemporáneo con una cómoda Luis XV o un reloj de pie victoriano.',
    featured: false,
    tags: ['Eclecticismo', 'Decoración', 'Muebles de Época', 'Contemporáneo', 'Armonía'],
    relatedCategories: ['Muebles', 'Iluminación', 'Arte y Pintura'],
    relatedItemIds: ['item-2', 'item-8', 'item-7'],
    sections: [
      {
        sectionTitle: '1. La regla del 80 / 20 en la ambientación',
        paragraphs: [
          'Uno de los errores más frecuentes al incorporar antigüedades es creer que hay que comprometerse con un estilo total: o todo moderno, o todo de época. Los espacios más sofisticados del mundo rompen esa frontera.',
          'La fórmula que recomiendan los interioristas de vanguardia es el principio del 80/20: una envolvente de arquitectura y mobiliario sobrio contemporáneo (80%) que sirve de marco neutro para que dos o tres piezas históricas de altísima calidad (20%) se conviertan en las auténticas protagonistas.',
          'Cuando un mueble antiguo no tiene que competir visualmente con otros diez de la misma época, su diseño se aprecia con la misma nitidez que una escultura en una galería de arte.'
        ]
      },
      {
        sectionTitle: '2. Crear contrastes de materiales',
        paragraphs: [
          'El secreto está en el diálogo de texturas: el vidrio templado y el lino crudo resaltan la densidad de una madera centenaria; el hormigón a la vista gana calidez frente al bronce fundido al mercurio; y las lámparas modernas de luz cálida proyectan sombras fascinantes sobre tallas barrocas o molduras doradas.'
        ]
      }
    ]
  },
  {
    id: 'art-nobleza-patina-plateria-orfebreria',
    slug: 'nobleza-patina-plata-antigua-coleccionistas',
    title: 'La nobleza de la pátina: por qué los grandes coleccionistas jamás pulen la plata al espejo',
    subtitle: 'El lenguaje del tiempo en la orfebrería: punzones de platero, contrastes de ley y el valor de los micro-relieves en penumbra.',
    category: 'Guías de Coleccionismo',
    readTime: '4 min de lectura',
    author: 'Gabinete de Platería & Metales Nobles',
    authorRole: 'Peritos en Orfebrería Histórica',
    date: 'Junio 2026',
    coverImage: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'En la platería de los siglos XVIII y XIX, el brillo deslumbrante y uniforme es un síntoma de pulido excesivo que borra los cincelados originales. Los verdaderos conocedores buscan la pátina: ese tono acerado y suave que solo los años de uso respetuoso saben otorgar.',
    featured: false,
    tags: ['Platería', 'Orfebrería', 'Punzones', 'Pátina', 'Plata 925', 'Coleccionismo'],
    relatedCategories: ['Platería y Orfebrería', 'Objetos de Colección'],
    relatedItemIds: ['item-int-4', 'item-1', 'item-6'],
    sections: [
      {
        sectionTitle: '1. El error del pulido abrasivo',
        paragraphs: [
          'Es instinto de muchos principiantes frotar enérgicamente una sopera de plata o un juego de cubiertos de época con pastas abrasivas hasta lograr un reflejo blanco enceguecedor. Sin embargo, ese proceso desgasta irremediablemente los detalles del cincelado, desdibuja los punzones de orfebre y resta valor histórico a la pieza.',
          'La plata antigua debe conservar sus sombras en los huecos de la ornamentación. Esa suave oxidación controlada en las hendiduras crea el volumen óptico que el orfebre concibió al trabajar el metal a martillo.'
        ],
        tipBox: 'Consejo para limpiar plata en casa: Evita sumergir las piezas en baños químicos ácidos instantáneos. Lava con agua tibia y jabón neutro, seca con un paño suave de franela y, si es necesario, emplea una crema para platería con protectores de brillo no abrasiva, frotando con delicadeza sin forzar los rincones cincelados.'
      }
    ]
  },
  {
    id: 'art-anatomia-libro-antiguo-papel-verjurado',
    slug: 'anatomia-libro-antiguo-papel-verjurado-piel',
    title: 'Iniciación al libro antiguo: del papel de trapo verjurado a las encuadernaciones en plena piel',
    subtitle: 'Secretos de los talleres tipográficos clásicos: pontizones, corondeles, nervios cosidos y el perfume de siglos entre páginas.',
    category: 'Curiosidades Históricas',
    readTime: '5 min de lectura',
    author: 'Círculo de Bibliófilos & Manuscritos',
    authorRole: 'Especialistas en Libros de Época',
    date: 'Mayo 2026',
    coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
    excerpt: '¿Por qué un libro impreso en 1650 conserva sus hojas blancas y flexibles, mientras que un diario de hace cuarenta años ya se deshace amarillo? La clave está en los trapos de lino, los telares manuales y el respeto por el oficio de encuadernar.',
    featured: false,
    tags: ['Libros antiguos', 'Papel verjurado', 'Encuadernación en piel', 'Tipografía', 'Incunables'],
    relatedCategories: ['Libros y Manuscritos'],
    relatedItemIds: ['item-3', 'item-int-2', 'item-int-1'],
    sections: [
      {
        sectionTitle: '1. El papel que desafía a los siglos',
        paragraphs: [
          'Antes de la industrialización del papel a base de pulpa de madera en el siglo XIX (cargada de lignina y ácidos destructivos), el papel se fabricaba a mano con trapos viejos de lino y algodón sumergidos en agua y triturados en tinas de piedra.',
          'Al mirar una hoja antigua a trasluz, se observan con claridad unas líneas verticales y horizontales finísimas: son los «pontizones» y «corondeles» dejados por el molde de alambre de la formadora. Al no contener ácidos, este papel no se corroe: permanece flexible, sonoro al tacto y blanco después de trescientos o cuatrocientos años.'
        ]
      },
      {
        sectionTitle: '2. El lomo con nervios y la piel con dorados a fuego',
        paragraphs: [
          'En las encuadernaciones en tafilete, marroquí o becerro de época, los lomos exhiben orgullosos esos resaltos llamados «nervios». No son decorativos: son las auténticas cuerdas o tiras de cuero vegetal sobre las cuales el artesano cosió a mano cada cuadernillo del volumen.',
          'Tocar un libro antiguo es estrechar la mano de impresores, grabadores y lectores que ya no están, pero cuya voz sigue viva e intacta en las páginas.'
        ]
      }
    ]
  }
];

export const STORAGE_KEY_ARTICLES = 'anticuarios_blog_articles_v1';

export function getStoredArticles(): BlogArticle[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ARTICLES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((art: BlogArticle) => {
          const init = INITIAL_ARTICLES.find((ia) => ia.id === art.id);
          if (init && (!art.relatedItemIds || art.relatedItemIds.length === 0) && init.relatedItemIds) {
            return { ...art, relatedItemIds: init.relatedItemIds };
          }
          return art;
        });
      }
    }
  } catch (e) {
    console.warn('Error reading stored articles:', e);
  }
  return INITIAL_ARTICLES;
}

export function saveStoredArticles(articles: BlogArticle[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(articles));
  } catch (e) {
    console.warn('Error saving articles to storage:', e);
  }
}
