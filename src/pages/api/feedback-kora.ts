import type { NextApiRequest, NextApiResponse } from "next";

const N8N_FEEDBACK_URL = "https://n8n.tucbbs.com.ar/webhook/feedback-kora";

// Aumenta límite para evitar 413 del lado de Next
export const config = {
    api: {
        bodyParser: {
            sizeLimit: "50mb",
        },
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const payload = req.body;

        // Opcional: log de tamaño
        // console.log("feedback payload bytes:", JSON.stringify(payload).length);

        const r = await fetch(N8N_FEEDBACK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!r.ok) {
            const text = await r.text().catch(() => "");
            // Propaga códigos útiles (incluido 413)
            return res.status(r.status).json({ error: `n8n error ${r.status}`, details: text });
        }

        const data = await r.json();
        return res.status(200).json(data);
    } catch (e: any) {
        return res.status(500).json({ error: "Proxy error", message: e?.message || "unknown" });
    }
}
