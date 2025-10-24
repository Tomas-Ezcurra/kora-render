import { NextApiRequest, NextApiResponse } from "next";

const N8N_WEBHOOK_URL = "https://n8n.tucbbs.com.ar/webhook/c0205606-9a90-4050-a811-d03bab2f09b4";

// Increase body size limit to 50MB
export const config = {
    api: {
        bodyParser: {
            sizeLimit: "50mb",
        },
    },
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const payload = req.body;

        console.log("Forwarding request to n8n webhook...");
        console.log("Payload size:", JSON.stringify(payload).length, "bytes");

        // Forward the request to n8n webhook
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("N8N webhook error:", response.status, errorText);

            if (response.status === 413) {
                return res.status(413).json({
                    error: "La imagen es demasiado grande. Por favor, intenta con una imagen más pequeña.",
                    details: "Payload Too Large"
                });
            }

            return res.status(response.status).json({
                error: `N8N webhook error: ${response.status}`,
                details: errorText
            });
        }

        const data = await response.json();
        console.log("N8N webhook response received successfully");
        return res.status(200).json(data);

    } catch (error) {
        console.error("Error calling n8n webhook:", error);
        return res.status(500).json({
            error: "Error calling webhook",
            message: error instanceof Error ? error.message : "Unknown error"
        });
    }
}
