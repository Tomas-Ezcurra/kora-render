const N8N_WEBHOOK_URL = "https://n8n.tucbbs.com.ar/webhook/c0205606-9a90-4050-a811-d03bab2f09b4";

interface N8NInitialPayload {
    pagina: "inicial";
    caption: string;
    image: string;
    userId: string;
}

interface N8NFeedbackPayload {
    pagina: "feedback";
    comentarios: string;
    seleccion_anterior: string;
    userId: string;
    image: string;
}

interface N8NResponse {
    image_url?: string;
    status?: string;
    message?: string;
}

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

    const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`N8N webhook error: ${response.status}`);
    }

    return response.json();
}

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

    const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`N8N webhook error: ${response.status}`);
    }

    return response.json();
}
