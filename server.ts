import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import firebaseConfig from "./firebase-applet-config.json";
import { INITIAL_ITEMS, INITIAL_DEALERS } from "./src/data/mockData";
import { AntiqueItem } from "./src/types";

const app = express();
const PORT = 3000;

// Initialize Firebase App & Firestore in Node environment
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId)
  : getFirestore(firebaseApp);

// Increase payload limit to handle base64 antique images
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Helper to get GoogleGenAI client
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("La clave GEMINI_API_KEY no está configurada en las variables de entorno.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Helper to escape XML special characters
function escapeXml(str: string | undefined | null): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function escapeCsvField(str: string | undefined | null): string {
  if (!str) return '""';
  const cleaned = String(str).replace(/"/g, '""').replace(/\r?\n/g, " ");
  return `"${cleaned}"`;
}

// Google / Pinterest taxonomy category mapper (Numeric IDs preferred by Pinterest / Google Merchant)
function getGoogleCategory(cat: string): string {
  switch (cat) {
    case "Muebles":
      return "436"; // Antiques & Collectibles > Antique Furniture / 2047
    case "Arte y Pintura":
    case "Esculturas y Bronces":
      return "500044"; // Arts & Entertainment > Artwork
    case "Libros y Manuscritos":
      return "784"; // Media > Books
    case "Relojería":
      return "201"; // Apparel & Accessories > Jewelry > Watches
    case "Cerámica y Porcelana":
    case "Platería y Orfebrería":
    case "Objetos de Colección":
    default:
      return "436"; // Antiques & Collectibles
  }
}

// Fetch all live items from Firestore or fallback to mockData
async function fetchCurrentItems(): Promise<AntiqueItem[]> {
  try {
    const colRef = collection(db, "antique_items");
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const items: AntiqueItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({ id: docSnap.id, ...(data as any) });
      });
      if (items.length > 0) {
        return items;
      }
    }
  } catch (err) {
    console.warn("Aviso: No se pudo consultar Firestore en el backend, usando catálogo inicial:", err);
  }
  return INITIAL_ITEMS;
}

// Generate RSS 2.0 / Google Merchant / Pinterest XML Feed
function generatePinterestXml(items: AntiqueItem[], baseUrl: string): string {
  const channelTitle = "Articuarios • Alta Antigüedad & Piezas Históricas";
  const channelLink = baseUrl;
  const channelDesc = "Catálogo peritado de alta antigüedad, mobiliario de época, platería, porcelana y obras históricas en Buenos Aires.";

  const itemsXml = items
    .map((item) => {
      const itemUrl = `${baseUrl}/?item=${encodeURIComponent(item.id)}`;
      const mainImg = item.images && item.images.length > 0 ? item.images[0] : (item as any).imageUrl || "";
      const additionalImages = (item.images || []).slice(1, 10);
      const availability = item.status === "available" || item.status === "in_negotiation" ? "in stock" : "out of stock";
      const priceFormatted = `${Number(item.price || 0).toFixed(2)} ${item.currency || "USD"}`;
      const desc = `${item.description || item.title}. Época: ${item.period || "Histórica"}. Estilo: ${item.style || "Clásico"}. Origen: ${item.origin || "Buenos Aires"}.`;
      const googleCat = getGoogleCategory(item.category);

      const addImagesXml = additionalImages
        .filter((img) => Boolean(img))
        .map((img) => `      <g:additional_image_link>${escapeXml(img)}</g:additional_image_link>`)
        .join("\n");

      return `    <item>
      <g:id>${escapeXml(item.id)}</g:id>
      <g:title><![CDATA[${item.title}]]></g:title>
      <g:description><![CDATA[${desc}]]></g:description>
      <g:link>${escapeXml(itemUrl)}</g:link>
      <g:image_link>${escapeXml(mainImg)}</g:image_link>
${addImagesXml ? addImagesXml + "\n" : ""}      <g:price>${priceFormatted}</g:price>
      <g:availability>${availability}</g:availability>
      <g:condition>used</g:condition>
      <g:brand>Articuarios</g:brand>
      <g:google_product_category><![CDATA[${googleCat}]]></g:google_product_category>
      <g:product_type><![CDATA[${item.category}]]></g:product_type>
      <g:item_group_id>${escapeXml(item.category)}</g:item_group_id>
      <g:custom_label_0><![CDATA[${item.period || ""}]]></g:custom_label_0>
      <g:custom_label_1><![CDATA[${item.style || ""}]]></g:custom_label_1>
      <g:custom_label_2><![CDATA[${item.origin || ""}]]></g:custom_label_2>
      <g:custom_label_3><![CDATA[${item.condition || ""}]]></g:custom_label_3>
      <g:identifier_exists>no</g:identifier_exists>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>${escapeXml(channelTitle)}</title>
    <link>${escapeXml(channelLink)}</link>
    <description>${escapeXml(channelDesc)}</description>
${itemsXml}
  </channel>
</rss>`;
}

// Generate standard CSV Feed for Pinterest Shopping
function generatePinterestCsv(items: AntiqueItem[], baseUrl: string): string {
  const headers = [
    "id",
    "title",
    "description",
    "link",
    "image_link",
    "additional_image_link",
    "price",
    "availability",
    "condition",
    "brand",
    "google_product_category",
    "product_type",
    "item_group_id",
    "custom_label_0",
    "custom_label_1",
    "custom_label_2",
  ];

  const rows = items.map((item) => {
    const itemUrl = `${baseUrl}/?item=${encodeURIComponent(item.id)}`;
    const mainImg = item.images && item.images.length > 0 ? item.images[0] : (item as any).imageUrl || "";
    const addImg = (item.images || []).slice(1, 5).join(",");
    const availability = item.status === "available" || item.status === "in_negotiation" ? "in stock" : "out of stock";
    const priceFormatted = `${Number(item.price || 0).toFixed(2)} ${item.currency || "USD"}`;
    const desc = `${item.description || item.title}. Época: ${item.period || "Histórica"}. Estilo: ${item.style || "Clásico"}.`;
    const googleCat = getGoogleCategory(item.category);

    return [
      escapeCsvField(item.id),
      escapeCsvField(item.title),
      escapeCsvField(desc),
      escapeCsvField(itemUrl),
      escapeCsvField(mainImg),
      escapeCsvField(addImg),
      escapeCsvField(priceFormatted),
      escapeCsvField(availability),
      escapeCsvField("used"),
      escapeCsvField("Articuarios"),
      escapeCsvField(googleCat),
      escapeCsvField(item.category),
      escapeCsvField(item.category),
      escapeCsvField(item.period),
      escapeCsvField(item.style),
      escapeCsvField(item.origin),
    ].join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}

// Helper to determine the public base URL
function getBaseUrl(req: express.Request): string {
  const host = req.get("x-forwarded-host") || req.get("host") || "articuarios.store";
  const proto = req.get("x-forwarded-proto") || req.protocol || "https";
  return `${proto}://${host}`;
}

// Pinterest HTML file verification fallback
app.get("/pinterest-7108a073dcf7a7f7246d2952efcf4e0a.html", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send("pinterest-site-verification=7108a073dcf7a7f7246d2952efcf4e0a");
});

// Pinterest Shopping XML / RSS Feed
app.get(["/api/pinterest-feed.xml", "/api/pinterest-feed.rss", "/pinterest-feed.xml"], async (req, res) => {
  try {
    const items = await fetchCurrentItems();
    const baseUrl = getBaseUrl(req);
    const xml = generatePinterestXml(items, baseUrl);

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=180, s-maxage=300");
    res.send(xml);
  } catch (err: any) {
    console.error("Error al generar feed XML de Pinterest:", err);
    res.status(500).send(`Error generando feed XML: ${err.message}`);
  }
});

// Pinterest Shopping CSV Feed
app.get(["/api/pinterest-catalog.csv", "/pinterest-catalog.csv"], async (req, res) => {
  try {
    const items = await fetchCurrentItems();
    const baseUrl = getBaseUrl(req);
    const csv = generatePinterestCsv(items, baseUrl);

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'inline; filename="pinterest-catalog.csv"');
    res.setHeader("Cache-Control", "public, max-age=180, s-maxage=300");
    res.send(csv);
  } catch (err: any) {
    console.error("Error al generar feed CSV de Pinterest:", err);
    res.status(500).send(`Error generando feed CSV: ${err.message}`);
  }
});

// JSON endpoint for inspecting the feed status
app.get("/api/pinterest-catalog.json", async (req, res) => {
  try {
    const items = await fetchCurrentItems();
    const baseUrl = getBaseUrl(req);
    res.json({
      success: true,
      totalItems: items.length,
      availableItems: items.filter((i) => i.status === "available" || i.status === "in_negotiation").length,
      reservedOrSold: items.filter((i) => i.status === "reserved" || i.status === "sold").length,
      feedUrls: {
        xml: `${baseUrl}/api/pinterest-feed.xml`,
        csv: `${baseUrl}/api/pinterest-catalog.csv`,
      },
      lastGenerated: new Date().toISOString(),
      sampleItems: items.slice(0, 3).map((i) => ({
        id: i.id,
        title: i.title,
        price: `${i.price} ${i.currency}`,
        status: i.status,
        image: i.images?.[0] || "",
        link: `${baseUrl}/?item=${i.id}`,
      })),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Anticuarios & Co. API" });
});

// AI Endpoint: Analyze antique photographs and generate expert catalog sheet
app.post("/api/ai/analyze-antique", async (req, res) => {
  try {
    const { images, imageBase64, imageUrl, mimeType = "image/jpeg" } = req.body;

    // Collect all candidate images (support array of images or single image)
    const rawImages: string[] = [];
    if (Array.isArray(images) && images.length > 0) {
      for (const img of images) {
        if (typeof img === "string" && img.trim()) {
          rawImages.push(img.trim());
        }
      }
    } else if (imageBase64) {
      rawImages.push(imageBase64);
    } else if (imageUrl) {
      rawImages.push(imageUrl);
    }

    if (rawImages.length === 0) {
      return res.status(400).json({ error: "No se proporcionó ninguna imagen o URL de la pieza." });
    }

    // Limit to up to 8 images per item to prevent token and payload overload
    const imagesToProcess = rawImages.slice(0, 8);
    const imageParts: Array<{ inlineData: { mimeType: string; data: string } }> = [];

    for (const item of imagesToProcess) {
      let base64Data = "";
      let detectedMime = mimeType;

      if (item.startsWith("data:")) {
        base64Data = item.replace(/^data:image\/[a-z]+;base64,/, "");
        const match = item.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,/);
        if (match) {
          detectedMime = match[1];
        }
      } else if (item.startsWith("http://") || item.startsWith("https://")) {
        try {
          const imgRes = await fetch(item);
          if (imgRes.ok) {
            const arrayBuffer = await imgRes.arrayBuffer();
            base64Data = Buffer.from(arrayBuffer).toString("base64");
            detectedMime = imgRes.headers.get("content-type") || "image/jpeg";
          }
        } catch (fetchErr) {
          console.warn("No se pudo descargar imagen externa:", fetchErr);
        }
      } else {
        base64Data = item;
      }

      if (base64Data) {
        imageParts.push({
          inlineData: {
            mimeType: detectedMime || "image/jpeg",
            data: base64Data,
          },
        });
      }
    }

    if (imageParts.length === 0) {
      return res.status(400).json({ error: "No se pudieron procesar las fotografías provistas." });
    }

    const ai = getGeminiClient();

    const prompt = `Actúa como un eminente perito tasador, conservador de arte y bibliófilo colegiado, con amplia experiencia en casas de subastas internacionales (Sotheby's, Christie's, Drouot).
Se te proporcionan ${imageParts.length} fotografía(s) correspondientes a una misma antigüedad, libro histórico o pieza de colección para su catalogación oficial en 'Anticuarios & Co.'.

SI SE TRATA DE UN LIBRO, MANUSCRITO O DOCUMENTO HISTÓRICO:
- Analiza conjuntamente todas las imágenes disponibles:
  1. Portadilla / Portada interior (Página de título): extrae el título exacto con subtítulos, autor(es), traductor, prologuista, ilustrador, casa editorial, ciudad y año de publicación.
  2. Colofón o pie de imprenta (al final del volumen): revisa la imprenta/tipógrafo, fecha exacta de impresión, tirada o si es un ejemplar numerado.
  3. Encuadernación, lomo y tapas: identifica el tipo de encuadernación (ej: piel de época con nervios, marroquí, pergamino a la romana, tela editorial, holandesa con puntas, dorados al hierro o al fuego, cantos jaspeados o dorados).
  4. Páginas interiores, láminas o grabados: identifica técnicas gráficas (aguafuertes, xilografías, litografías) y el estado del papel (papel de hilo verjurado, manchas de humedad, moteado de óxido/foxing, ex-libris o anotaciones manuscritas).

SI SE TRATA DE UN MUEBLE, ESCULTURA, RELOJERÍA U OBJETO DE ARTE:
- Analiza vista general, ensambles, pátina, sellos, marcas de ebanista, punzones de orfebrería o herrajes.

Determina con precisión los siguientes campos:
1. title: Título formal de catalogación (ej: para libro: "Cervantes Saavedra, Miguel de - Don Quijote de la Mancha (Edición ilustrada por Gustavo Doré, Barcelona 1880)", o para mueble: "Cómoda Bombé de Época Luis XV...").
2. category: Selecciona exactamente una de las siguientes opciones:
   - "Libros y Manuscritos"
   - "Muebles"
   - "Relojería"
   - "Platería y Orfebrería"
   - "Arte y Pintura"
   - "Iluminación"
   - "Cerámica y Porcelana"
   - "Esculturas y Bronces"
   - "Objetos de Colección"
3. period: Época y datación histórica aproximada o exacta (ej: "Siglo XIX (1880)", o "Siglo XVIII (ca. 1765-1775)").
4. origin: Región, ciudad o imprenta/taller de procedencia (ej: "España (Barcelona, Montaner y Simón)", o "Francia (París)").
5. style: Estilo artístico, tipográfico o tipo de edición (ej: "Edición Romántica / Grabados en Madera al Boj", o "Rococó Francés Luis XV").
6. materials: Lista de materiales detectados (ej: para libro: ["Papel de hilo verjurado", "Piel de época con nervios", "Dorados al hierro", "Láminas en calcografía"]; para mueble: ["Palisandro", "Nogal", "Bronce dorado"]).
7. estimatedDimensions: Alto, ancho y profundidad estimados en centímetros proporcionales a este tipo de pieza o formato bibliográfico (In-folio, In-4to, In-8vo), junto con su peso estimado (ej: "3.2 kg" o "32 kg").
8. condition: Debe ser exactamente una de estas cuatro opciones:
   - "Excelente (sin restauraciones)"
   - "Muy bueno (pátina original de época)"
   - "Bueno (con leves marcas de uso histórico)"
   - "Restauración histórica documentada"
9. conditionDetails: Diagnóstico pericial de la conservación de la pátina, encuadernación, solidez de guardas, foxing u óxido, o ensambles visibles.
10. description: Reseña curatorial, bibliográfica y estética refinada (2-3 párrafos atractivos y académicos para coleccionistas).
11. estimatedValueUSD: Valor sugerido prudente de mercado en USD (número entero).
12. authenticityMarkers: Lista de 3 claves de autenticidad pericial que el comprador o anticuario debe comprobar físicamente (ej: marca de agua en papel verjurado, pie de imprenta en colofón, huellas de garlopa, sello de platero).
13. photoTips: Consejo breve para mejorar la toma fotográfica si alguna zona clave requirió más definición.`;

    let response;
    // Multimodal models with priority order according to gemini-api skill
    const candidateModels = ["gemini-2.5-flash", "gemini-flash-latest", "gemini-3.8-flash", "gemini-3.1-flash-lite"];
    let lastError: any = null;

    const schemaConfig = {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Título formal de la antigüedad o libro" },
          category: { type: Type.STRING, description: "Categoría de la pieza" },
          period: { type: Type.STRING, description: "Época y fecha estimada" },
          origin: { type: Type.STRING, description: "Origen, ciudad o imprenta" },
          style: { type: Type.STRING, description: "Estilo artístico o tipo de edición" },
          materials: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Materiales nobles detectados",
          },
          estimatedDimensions: {
            type: Type.OBJECT,
            properties: {
              height: { type: Type.NUMBER, description: "Alto estimado en cm" },
              width: { type: Type.NUMBER, description: "Ancho estimado en cm" },
              depth: { type: Type.NUMBER, description: "Profundidad estimado en cm" },
              weight: { type: Type.STRING, description: "Peso estimado" },
            },
            required: ["height", "width", "depth", "weight"],
          },
          condition: { type: Type.STRING, description: "Estado de conservación" },
          conditionDetails: { type: Type.STRING, description: "Detalles periciales de conservación" },
          description: { type: Type.STRING, description: "Descripción curatorial" },
          estimatedValueUSD: { type: Type.NUMBER, description: "Tasación estimada en USD" },
          authenticityMarkers: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Puntos clave de autenticidad",
          },
          photoTips: { type: Type.STRING, description: "Consejo fotográfico" },
        },
        required: [
          "title",
          "category",
          "period",
          "origin",
          "style",
          "materials",
          "estimatedDimensions",
          "condition",
          "conditionDetails",
          "description",
          "estimatedValueUSD",
          "authenticityMarkers",
        ],
      },
    };

    // Attempt with structured schema first
    for (const modelName of candidateModels) {
      try {
        console.log(`Intentando catalogación con modelo: ${modelName} (${imageParts.length} fotos)`);
        response = await ai.models.generateContent({
          model: modelName,
          contents: {
            parts: [...imageParts, { text: prompt }],
          },
          config: schemaConfig,
        });
        if (response && response.text) {
          break; // éxito
        }
      } catch (err: any) {
        console.warn(`Aviso: fallo en modelo ${modelName} (${err?.status || err?.message}), probando siguiente...`);
        lastError = err;
      }
    }

    // Fallback: If structured responseSchema failed across models due to high demand or schema limits, try plain JSON prompt
    if (!response || !response.text) {
      for (const modelName of candidateModels) {
        try {
          console.log(`Ruta de contingencia sin schema estricto en modelo: ${modelName}`);
          response = await ai.models.generateContent({
            model: modelName,
            contents: {
              parts: [
                ...imageParts,
                {
                  text: `${prompt}\n\nResponde ÚNICAMENTE con un JSON válido sin markdown ni explicaciones adicionales con los campos requeridos.`
                }
              ],
            },
          });
          if (response && response.text) {
            break;
          }
        } catch (fallbackErr: any) {
          console.warn(`Aviso en contingencia para ${modelName}:`, fallbackErr?.message);
        }
      }
    }

    if (!response || !response.text) {
      throw lastError || new Error("No se pudo obtener respuesta de los modelos de IA.");
    }

    let resultText = response.text.trim();
    // Clean potential markdown wrappers
    if (resultText.startsWith("```json")) {
      resultText = resultText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (resultText.startsWith("```")) {
      resultText = resultText.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    const catalogData = JSON.parse(resultText);
    return res.json({ success: true, data: catalogData });
  } catch (error: any) {
    console.error("Error al analizar antigüedad con Gemini:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Error al procesar las fotografías con la inteligencia artificial.",
    });
  }
});

// Start server and mount Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor Anticuarios & Co. escuchando en http://0.0.0.0:${PORT}`);
  });
}

startServer();
