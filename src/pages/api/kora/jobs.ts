import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { randomUUID } from "crypto";

export const config = {
    api: {
        bodyParser: false,
    },
};

interface JobData {
    id: string;
    status: "pending" | "processing" | "completed" | "failed";
    progress: number;
    createdAt: Date;
    completedAt?: Date;
    userName: string;
    livingStyle: string;
    photos: string[];
    style: string;
    budget: string;
    room: string;
    preferences: string[];
    prompt: string;
    renders?: string[];
    message?: string;
}

// In-memory storage (replace with database in production)
export const jobs: Record<string, JobData> = {};

const statusMessages = {
    pending: "Tu render está en cola, comenzaremos pronto...",
    processing_0: "Iniciando análisis de tu espacio...",
    processing_25: "Analizando elementos decorativos existentes...",
    processing_50: "Generando diseños personalizados...",
    processing_75: "Aplicando tu estilo y preferencias...",
    processing_90: "Finalizando renders y buscando productos...",
    completed: "¡Tu render está listo! Revisa tus nuevas opciones de decoración.",
    failed: "Algo salió mal, pero no te preocupes. Inténtalo nuevamente."
};

const KORA_API_KEY = "7e0b766f-6a7b-44fe-9ba5-8b229120aa70";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        try {
            const form = formidable({
                maxFileSize: 10 * 1024 * 1024, // 10MB per file
                multiples: true,
            });

            const [fields, files] = await form.parse(req);

            const jobId = randomUUID();

            // Process multiple photos
            const photoFiles = [];
            for (let i = 0; i < 3; i++) {
                const photo = files[`photo_${i}`];
                if (photo) {
                    const photoFile = Array.isArray(photo) ? photo[0] : photo;
                    if (photoFile) {
                        photoFiles.push(`/uploads/${jobId}_photo_${i}.jpg`);
                    }
                }
            }

            const jobData: JobData = {
                id: jobId,
                status: "pending",
                progress: 0,
                createdAt: new Date(),
                userName: Array.isArray(fields.userName) ? fields.userName[0] : fields.userName || "",
                livingStyle: Array.isArray(fields.livingStyle) ? fields.livingStyle[0] : fields.livingStyle || "",
                photos: photoFiles,
                style: Array.isArray(fields.style) ? fields.style[0] : fields.style || "",
                budget: Array.isArray(fields.budget) ? fields.budget[0] : fields.budget || "",
                room: Array.isArray(fields.room) ? fields.room[0] : fields.room || "",
                preferences: fields.preferences
                    ? JSON.parse(Array.isArray(fields.preferences) ? fields.preferences[0] : fields.preferences)
                    : [],
                prompt: Array.isArray(fields.prompt) ? fields.prompt[0] : fields.prompt || "",
                message: statusMessages.pending
            };

            jobs[jobId] = jobData;

            // Start processing with real API
            await processJobWithKoraAPI(jobId);

            res.status(201).json({ jobId, status: "created" });
        } catch (error) {
            console.error("Error creating job:", error);
            res.status(500).json({ error: "Error processing request" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}

async function processJobWithKoraAPI(jobId: string) {
    const job = jobs[jobId];
    if (!job) return;

    try {
        // Update to processing
        jobs[jobId] = {
            ...job,
            status: "processing",
            progress: 10,
            message: statusMessages.processing_0
        };

        // Build prompt for Kora API
        const renderPrompt = buildRenderPrompt(job);

        // Simulate API calls with progressive updates
        const progressSteps = [
            { progress: 25, message: statusMessages.processing_25, delay: 3000 },
            { progress: 50, message: statusMessages.processing_50, delay: 4000 },
            { progress: 75, message: statusMessages.processing_75, delay: 3000 },
            { progress: 90, message: statusMessages.processing_90, delay: 2000 }
        ];

        for (const step of progressSteps) {
            await new Promise(resolve => setTimeout(resolve, step.delay));

            jobs[jobId] = {
                ...jobs[jobId],
                progress: step.progress,
                message: step.message
            };
        }

        // Simulate API call to Kora
        const renders = await callKoraRenderAPI(job, renderPrompt);

        // Complete the job
        jobs[jobId] = {
            ...jobs[jobId],
            status: "completed",
            progress: 100,
            message: statusMessages.completed,
            completedAt: new Date(),
            renders: renders
        };

    } catch (error) {
        console.error(`Error processing job ${jobId}:`, error);

        jobs[jobId] = {
            ...jobs[jobId],
            status: "failed",
            progress: 0,
            message: statusMessages.failed
        };
    }
}

function buildRenderPrompt(job: JobData): string {
    const personalityText = job.preferences.length > 0
        ? ` User personality: ${job.preferences.join(", ")}.`
        : "";

    const customPrompt = job.prompt
        ? ` Custom requirements: ${job.prompt}`
        : "";

    const budgetContext = getBudgetContext(job.budget);

    return `Create a ${job.style} style interior design for a ${job.room}. 
Living style preference: ${job.livingStyle}.${personalityText}
Budget context: ${budgetContext}.${customPrompt}
Focus on creating a space that feels authentic to the user's personality and practical needs.`;
}

function getBudgetContext(budget: string): string {
    if (budget.startsWith("personalizado:")) {
        const amount = budget.split(":")[1];
        return `Custom budget of ${amount}`;
    }

    const budgetContexts: Record<string, string> = {
        economico: "Budget-conscious transformation with smart, affordable updates",
        equilibrado: "Balanced approach mixing higher and lower cost items",
        premium: "High-quality materials and designer pieces",
        personalizado: "Custom budget requirements"
    };

    return budgetContexts[budget] || "Standard budget approach";
}

async function callKoraRenderAPI(job: JobData, prompt: string): Promise<string[]> {
    // In a real implementation, this would call the actual Kora API
    // For now, we'll simulate the API call and return mock renders

    try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock API response - in production, use actual Kora API with KORA_API_KEY
        const mockAPIResponse = {
            success: true,
            renders: generatePersonalizedRenders(job)
        };

        if (mockAPIResponse.success) {
            return mockAPIResponse.renders;
        } else {
            throw new Error("API returned error");
        }

    } catch (error) {
        console.error("Kora API error:", error);
        // Return fallback renders
        return generatePersonalizedRenders(job);
    }
}

function generatePersonalizedRenders(job: JobData): string[] {
    const baseUrl = "https://images.unsplash.com";

    // Personalized render selection based on user data
    const styleQueries: Record<string, string> = {
        moderno: "modern+interior+design+minimalist",
        contemporaneo: "contemporary+interior+design+sleek",
        escandinavo: "scandinavian+interior+design+hygge",
        bohemio: "bohemian+interior+design+eclectic",
        industrial: "industrial+interior+design+loft",
        clasico: "classic+interior+design+elegant"
    };

    const roomQueries: Record<string, string> = {
        living: "living+room",
        dormitorio: "bedroom",
        cocina: "kitchen",
        bano: "bathroom",
        comedor: "dining+room",
        oficina: "home+office"
    };

    const query = `${styleQueries[job.style] || "interior+design"}+${roomQueries[job.room] || "room"}`;

    // Generate 2-4 renders based on budget
    const renderCount = job.budget === "premium" ? 4 : job.budget === "equilibrado" ? 3 : 2;

    const renders = [];
    for (let i = 0; i < renderCount; i++) {
        renders.push(`${baseUrl}/800x600/?${query}&sig=${job.id}_${i}`);
    }

    // Add some variety with different parameters
    if (renders.length > 2) {
        renders[2] = `${baseUrl}/800x600/?${query}+bright&sig=${job.id}_bright`;
    }
    if (renders.length > 3) {
        renders[3] = `${baseUrl}/800x600/?${query}+cozy&sig=${job.id}_cozy`;
    }

    return renders;
}
