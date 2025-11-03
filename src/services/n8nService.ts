const N8N_WEBHOOK_URL = "/api/n8n/webhook";

// ---- Tipos de payloads ----
interface N8NInitialPayload {
  pagina: "inicial";
  caption: string;
  image: string; // base64
  userId: string;
}

interface N8NFeedbackPayload {
  pagina: "feedback";
  comentarios: string;
  seleccion_anterior: string;
  userId: string;
  image: string; // base64
}

// ---- Tipo de respuesta normalizado ----
interface N8NResponse {
  image_url?: string;
  style?: string;
  productos?: any[];
  status?: string;
  message?: string;
  usageMetadata?: unknown;
  [key: string]: unknown;
}

/**
 * Extrae la imagen generada desde la estructura de n8n
 * Busca en: candidates[0].content.parts[0].inlineData.data (base64 puro)
 */
function extractImageUrl(raw: any): string | undefined {
  try {
    // La respuesta viene como array, tomar el primer elemento
    const firstItem = Array.isArray(raw) ? raw[0] : raw;

    // Navegar la estructura anidada de n8n: [0].json.candidates[0]...
    const jsonData = firstItem?.json;
    const candidates = jsonData?.candidates;

    if (!Array.isArray(candidates) || candidates.length === 0) {
      console.log("[extractImageUrl] No se encontraron candidates");
      return undefined;
    }

    const firstCandidate = candidates[0];
    const parts = firstCandidate?.content?.parts;

    if (!Array.isArray(parts) || parts.length === 0) {
      console.log("[extractImageUrl] No se encontraron parts en candidate");
      return undefined;
    }

    // Buscar el part con inlineData
    for (const part of parts) {
      if (part?.inlineData?.data) {
        const base64Data = part.inlineData.data;
        const mimeType = part.inlineData.mimeType || "image/png";

        // Convertir a data URL
        if (typeof base64Data === "string" && base64Data.trim()) {
          console.log("[extractImageUrl] Imagen encontrada, mimeType:", mimeType);
          return `data:${mimeType};base64,${base64Data}`;
        }
      }
    }

    console.log("[extractImageUrl] No se encontró inlineData en parts");
    return undefined;
  } catch (error) {
    console.error("[extractImageUrl] Error al extraer imagen:", error);
    return undefined;
  }
}

/**
 * Extrae productos desde la estructura de n8n donde productos viene como objeto indexado
 * Estructura esperada: raw[0].json.productos como objeto con keys numéricas
 */
function extractProductsData(raw: any): any[] {
  try {
    // La respuesta viene como array, tomar el primer elemento
    const firstItem = Array.isArray(raw) ? raw[0] : raw;

    // Buscar productos en la estructura: [0].json.productos
    const productosObj = firstItem?.json?.productos || firstItem?.productos;

    if (!productosObj) {
      console.log("[extractProductsData] No se encontraron productos en la respuesta");
      return [];
    }

    console.log("[extractProductsData] Productos raw encontrados:", productosObj);

    // Convertir objeto indexado a array si es necesario
    if (typeof productosObj === 'object' && !Array.isArray(productosObj)) {
      console.log("[extractProductsData] Convirtiendo objeto indexado a array");
      const productsArray: any[] = [];

      // Ordenar las keys numéricas para mantener el orden
      const numericKeys = Object.keys(productosObj)
        .map(k => parseInt(k, 10))
        .filter(k => !isNaN(k))
        .sort((a, b) => a - b);

      numericKeys.forEach(key => {
        const product = productosObj[key];
        if (product && typeof product === 'object') {
          // Filtrar entradas que no son productos reales (debug, caption, binary, pairedItem)
          // Un producto real debe tener al menos 'product' o 'name'
          const isRealProduct =
            (product.product || product.name) &&
            !product.debug &&
            !product.caption &&
            !product.binary &&
            !product.pairedItem;

          if (!isRealProduct) {
            console.log(`[extractProductsData] Saltando entrada ${key} - no es un producto real:`, product);
            return; // Skip this entry
          }

          // Normalizar el campo de imagen si viene como objeto con base64
          if (product.image && typeof product.image === 'object') {
            console.log("[extractProductsData] Producto", key, "tiene imagen como objeto, normalizando...");
            const imgObj = product.image;
            if (imgObj.base64) {
              const mimeType = imgObj.mimeType || "image/jpeg";
              product.image = `data:${mimeType};base64,${imgObj.base64}`;
            } else {
              product.image = ""; // Sin imagen
            }
          }

          productsArray.push(product);
        }
      });

      console.log("[extractProductsData] Array convertido (después de filtrado), length:", productsArray.length);
      return productsArray;
    }

    // Si ya es un array, devolverlo directamente (con normalización y filtrado)
    if (Array.isArray(productosObj)) {
      console.log("[extractProductsData] Productos ya es array, length:", productosObj.length);
      return productosObj
        .filter(product => {
          // Filtrar productos reales
          const isRealProduct =
            (product.product || product.name) &&
            !product.debug &&
            !product.caption &&
            !product.binary &&
            !product.pairedItem;

          if (!isRealProduct) {
            console.log("[extractProductsData] Saltando producto - no es real:", product);
          }

          return isRealProduct;
        })
        .map(product => {
          // Normalizar imágenes
          if (product.image && typeof product.image === 'object') {
            const imgObj = product.image;
            if (imgObj.base64) {
              const mimeType = imgObj.mimeType || "image/jpeg";
              product.image = `data:${mimeType};base64,${imgObj.base64}`;
            } else {
              product.image = "";
            }
          }
          return product;
        });
    }

    console.log("[extractProductsData] Formato de productos no reconocido");
    return [];
  } catch (error) {
    console.error("[extractProductsData] Error al extraer productos:", error);
    return [];
  }
}

/**
 * Extrae el estilo desde la estructura de n8n
 */
function extractStyle(raw: any): string | undefined {
  try {
    // La respuesta viene como array, tomar el primer elemento
    const firstItem = Array.isArray(raw) ? raw[0] : raw;

    // Buscar style en: [0].json.style
    const style = firstItem?.json?.style || firstItem?.style;

    if (style && typeof style === "string") {
      console.log("[extractStyle] Estilo encontrado:", style);
      return style;
    }

    console.log("[extractStyle] No se encontró estilo en la respuesta");
    return undefined;
  } catch (error) {
    console.error("[extractStyle] Error al extraer estilo:", error);
    return undefined;
  }
}

/**
 * Normaliza la respuesta completa de n8n a un formato consistente
 */
function normalizeN8NResponse(raw: any): N8NResponse {
  console.log("[normalizeN8NResponse] Procesando respuesta raw:", raw);

  const imageUrl = extractImageUrl(raw);
  const style = extractStyle(raw);
  const productos = extractProductsData(raw);

  // Si no encontramos imagen, intentar fallbacks antiguos
  let finalImageUrl = imageUrl;
  if (!finalImageUrl) {
    console.log("[normalizeN8NResponse] Intentando fallbacks para imagen");
    const base64 =
      raw?.imageBase64 ||
      raw?.image_base64 ||
      raw?.image ||
      raw?.img ||
      raw?.[0]?.imageBase64;

    const mimeType = raw?.mimeType || raw?.mimetype || "image/png";

    if (typeof base64 === "string") {
      if (base64.startsWith("data:")) {
        finalImageUrl = base64;
      } else if (base64.trim()) {
        finalImageUrl = `data:${mimeType};base64,${base64}`;
      }
    }
  }

  const normalized: N8NResponse = {
    image_url: finalImageUrl,
    style,
    productos,
  };

  console.log("[normalizeN8NResponse] Respuesta normalizada:", {
    hasImage: !!normalized.image_url,
    style: normalized.style,
    productCount: normalized.productos?.length || 0,
  });

  return normalized;
}

// ---- Función para enviar el primer pedido ----
export async function sendInitialRequest(
  userId: string,
  caption: string,
  imageBase64: string
): Promise<N8NResponse> {
  const payload: N8NInitialPayload = {
    pagina: "inicial",
    caption,
    image: imageBase64,
    userId,
  };

  const res = await fetch(N8N_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`N8N webhook error: ${res.status} ${text}`);
  }

  const raw = await res.json();
  const normalized = normalizeN8NResponse(raw);

  if (!normalized.image_url) {
    throw new Error("Respuesta inválida de N8N: no se pudo extraer la imagen generada");
  }

  return normalized;
}

// ---- Función para enviar feedback ----
export async function sendFeedbackRequest(
  userId: string,
  feedback: string,
  previousSelection: string,
  imageBase64: string
): Promise<N8NResponse> {
  const payload: N8NFeedbackPayload = {
    pagina: "feedback",
    comentarios: feedback,
    seleccion_anterior: previousSelection,
    userId,
    image: imageBase64,
  };

  const res = await fetch(N8N_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`N8N webhook error: ${res.status} ${text}`);
  }

  const raw = await res.json();
  const normalized = normalizeN8NResponse(raw);

  if (!normalized.image_url) {
    throw new Error("Respuesta inválida de N8N: no se pudo extraer la imagen generada");
  }

  return normalized;
}
