// ...existing code...
const N8N_WEBHOOK_URL =
  "https://n8n.tucbbs.com.ar/webhook/c0205606-9a90-4050-a811-d03bab2f09b4";

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

// ---- Tipo de respuesta ----
interface N8NResponse {
  image_url?: string; // URL lista para usar en <img src=...>
  status?: string;
  message?: string;
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

  // 👇 Parseamos la respuesta y usamos un nombre distinto para evitar choque con el parámetro
  const {
    imageBase64: returnedImageBase64,
    mimeType,
    message,
    status,
  } = await res.json();
  if (!returnedImageBase64) {
    throw new Error("Respuesta inválida de N8N: falta imageBase64");
  }

  const image_url = `data:${mimeType || "image/png"};base64,${returnedImageBase64}`;
  return { image_url, status, message };
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

  const {
    imageBase64: returnedImageBase64,
    mimeType,
    message,
    status,
  } = await res.json();
  if (!returnedImageBase64) {
    throw new Error("Respuesta inválida de N8N: falta imageBase64");
  }

  const image_url = `data:${mimeType || "image/png"};base64,${returnedImageBase64}`;
  return { image_url, status, message };
}

