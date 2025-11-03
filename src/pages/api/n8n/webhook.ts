import type { NextApiRequest, NextApiResponse } from "next";

const INITIAL_WEBHOOK =
    process.env.N8N_INITIAL_WEBHOOK_URL ||
    "https://n8n.tucbbs.com.ar/webhook/c0205606-9a90-4050-a811-d03bab2f09b4";

const FEEDBACK_WEBHOOK =
    process.env.N8N_FEEDBACK_WEBHOOK_URL ||
    "https://n8n.tucbbs.com.ar/webhook/feedback-kora";

type Data = any;

export const config = {
    api: {
        bodyParser: {
            sizeLimit: "12mb",
        },
    },
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        const body = (req.body ?? {}) as Record<string, unknown>;
        const pagina =
            typeof body?.pagina === "string" ? (body.pagina as string) : undefined;

        const target = pagina === "feedback" ? FEEDBACK_WEBHOOK : INITIAL_WEBHOOK;

        const upstream = await fetch(target, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const status = upstream.status;
        const text = await upstream.text().catch(() => "");
        const contentType = upstream.headers.get("content-type") || "";

        let payload: any;
        try {
            if (contentType.includes("application/json")) {
                payload = JSON.parse(text);
            } else {
                payload = JSON.parse(text);
            }
        } catch {
            payload = { raw: text };
        }

        return res.status(status).json(payload);
    } catch (error: any) {
        return res
            .status(502)
            .json({ message: "Proxy error to n8n", error: error?.message || "unknown" });
    }
}
