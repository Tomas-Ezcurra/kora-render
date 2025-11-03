import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";
import UserStep from "@/components/wizard/UserStep";
import PhotoUpload from "@/components/wizard/PhotoUpload";
import LoadingStep from "@/components/wizard/LoadingStep";
import ResultStep from "@/components/wizard/ResultStep";
import { WizardData } from "@/types/wizard";
import { sendInitialRequest, sendFeedbackRequest } from "@/services/n8nService";
import { compressImage, formatFileSize, estimateBase64Size } from "@/lib/imageCompression";
import type { RenderProduct } from "@/types/products";

const BG_URL =
    "https://res.cloudinary.com/dfrhrnwwi/image/upload/v1758134089/Free_Vector___Blue_blurred_background_design_h2wclx.jpg";

const PRODUCTS_KEY = "kora_render_products_v1";

type WizardStep = "profile" | "photos" | "loading" | "result";

/** Mock products para testing (se usarán si n8n no devuelve productos) */
const MOCK_PRODUCTS: RenderProduct[] = [
    {
        id: "mock-1",
        name: "Sofá Modular Gris",
        product: "Sofá Modular Gris",
        description: "Sofá de 3 cuerpos con tela premium, diseño moderno y cómodo",
        price: 450000,
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
    },
    {
        id: "mock-2",
        name: "Mesa de Centro Madera",
        product: "Mesa de Centro Madera",
        description: "Mesa baja de madera natural con acabado mate, estilo nórdico",
        price: 120000,
        image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=400&fit=crop",
    },
    {
        id: "mock-3",
        name: "Lámpara de Pie LED",
        product: "Lámpara de Pie LED",
        description: "Lámpara ajustable con luz LED cálida, diseño minimalista",
        price: 75000,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
    },
];

/** Extrae productos desde la respuesta normalizada de n8nService */
function extractProducts(resp: any): RenderProduct[] {
    if (!resp) {
        console.log("[extractProducts] Respuesta vacía, usando productos mock");
        return MOCK_PRODUCTS;
    }

    console.log("[extractProducts] Respuesta normalizada recibida:", resp);

    // Los productos ya vienen completamente normalizados desde n8nService
    // (imágenes convertidas a data URLs, campos validados, etc.)
    const rawProducts = resp.productos;

    if (!Array.isArray(rawProducts)) {
        console.log("[extractProducts] productos no es un array, usando mock");
        console.log("[extractProducts] Tipo recibido:", typeof rawProducts, rawProducts);
        return MOCK_PRODUCTS;
    }

    if (rawProducts.length === 0) {
        console.log("[extractProducts] Array de productos vacío, usando mock");
        return MOCK_PRODUCTS;
    }

    // Los productos ya están normalizados, solo asegurar que tienen el formato correcto
    const normalized = rawProducts.map((p: any, idx: number) => ({
        id: p.id ?? idx,
        product: p.product ?? p.name ?? `Producto ${idx + 1}`,
        name: p.product ?? p.name ?? `Producto ${idx + 1}`,
        description: p.description ?? "",
        image: p.image ?? "",
        mimeType: p.mimeType ?? "image/jpeg",
        price: p.price,
        url: p.url,
    })) as RenderProduct[];

    console.log("[extractProducts] ✅ Productos reales extraídos:", normalized.length, "productos");
    console.log("[extractProducts] Primer producto:", normalized[0]);

    return normalized;
}

export default function WizardPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<WizardStep>("profile");
    const [wizardData, setWizardData] = useState<WizardData>({
        photos: [],
        photoPreviews: [],
        style: "",
        budget: "",
        room: "",
        preferences: [],
        prompt: "",
        userName: "",
        userStyle: "",
        livingStyle: "",
        userId: undefined,
    });

    const [resultImageUrl, setResultImageUrl] = useState("");
    const [products, setProducts] = useState<RenderProduct[]>([]); // <<--- DISPLAY
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");

    const steps = [
        { key: "profile" as const, number: 1, title: "Perfil", description: "Conozcámonos" },
        { key: "photos" as const, number: 2, title: "Fotos", description: "Sube tu espacio" },
    ];

    // Cargar productos guardados (mock) al montar
    useEffect(() => {
        if (typeof window === "undefined") return;
        try {
            const saved = localStorage.getItem(PRODUCTS_KEY);
            if (saved) {
                const parsed = JSON.parse(saved) as RenderProduct[];
                if (Array.isArray(parsed) && parsed.length > 0) setProducts(parsed);
            }
        } catch { }
    }, []);

    // Guardar productos cuando existan
    useEffect(() => {
        if (typeof window === "undefined") return;
        try {
            if (products.length > 0) {
                localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
            }
        } catch { }
    }, [products]);

    const handleProfileNext = () => {
        setCurrentStep("photos");
    };

    const handlePhotosNext = async () => {
        if (!wizardData.userId) {
            setError("Error: No se encontró el ID de usuario. Por favor, vuelve al paso anterior.");
            return;
        }

        setCurrentStep("loading");
        setError("");
        setIsProcessing(true);

        try {
            // 1) Comprimir
            const firstImageBase64 = await compressImage(
                wizardData.photos[0],
                1920,
                1080,
                0.85
            );

            const estimatedSize = estimateBase64Size(firstImageBase64);
            if (estimatedSize > 10 * 1024 * 1024) {
                throw new Error("La imagen es demasiado grande incluso después de la compresión. Por favor, intenta con una imagen más pequeña.");
            }

            // 2) Llamado a n8n
            const resp = await sendInitialRequest(
                wizardData.userId,
                wizardData.prompt,
                firstImageBase64
            );

            const img = (resp as any)?.image_url;
            if (!img) throw new Error("No se recibió URL de imagen en la respuesta");

            // Extraer productos directamente del JSON de n8n (ya vienen procesados)
            const finalProducts = extractProducts(resp);
            console.log("[wizard] Productos recibidos de n8n:", finalProducts);

            setResultImageUrl(img);
            setProducts(finalProducts);
            setCurrentStep("result");
        } catch (err) {
            console.error("Error al enviar solicitud inicial:", err);
            const errorMessage = err instanceof Error
                ? err.message
                : "Hubo un error al generar tu render. Por favor, intenta nuevamente.";
            setError(errorMessage);
            setCurrentStep("photos");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleFeedback = async (feedback: string) => {
        if (!wizardData.userId) {
            setError("Error: No se encontró el ID de usuario.");
            return;
        }

        setIsProcessing(true);
        setError("");

        try {
            const firstImageBase64 = await compressImage(
                wizardData.photos[0],
                1920,
                1080,
                0.85
            );

            const estimatedSize = estimateBase64Size(firstImageBase64);
            if (estimatedSize > 10 * 1024 * 1024) {
                throw new Error("La imagen es demasiado grande incluso después de la compresión.");
            }

            const resp = await sendFeedbackRequest(
                wizardData.userId,
                feedback,
                resultImageUrl,
                firstImageBase64
            );

            if (!resp?.image_url) {
                throw new Error("No se recibió URL de imagen en la respuesta de feedback");
            }

            // Extraer productos directamente del JSON de n8n
            const finalProducts = extractProducts(resp);
            console.log("[wizard] Productos recibidos de n8n (feedback):", finalProducts);

            setResultImageUrl(resp.image_url);
            setProducts(finalProducts);
        } catch (err) {
            console.error("Error al enviar feedback:", err);
            const errorMessage = err instanceof Error
                ? err.message
                : "Hubo un error al regenerar tu render. Por favor, intenta nuevamente.";
            setError(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleAccept = () => {
        router.push("/");
    };

    const handleBack = () => {
        if (currentStep === "photos") {
            setCurrentStep("profile");
        } else if (currentStep === "profile") {
            router.push("/");
        }
    };

    const getCurrentStepNumber = () => {
        const stepMap: Record<WizardStep, number> = {
            profile: 1,
            photos: 2,
            loading: 2,
            result: 2,
        };
        return stepMap[currentStep];
    };

    const showBackButton = currentStep === "profile" || currentStep === "photos";
    const showStepIndicator = currentStep === "profile" || currentStep === "photos";

    return (
        <div className="relative min-h-screen font-sans">
            <div
                className="absolute inset-0 -z-10 bg-center bg-cover"
                style={{ backgroundImage: `url('${BG_URL}')` }}
                aria-hidden="true"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/85 via-white/80 to-white/70" />
            <div className="absolute -z-10 max-w-[100vw] overflow-x-hidden -inset-x-32 -top-40 h-80 bg-gradient-to-b from-violet-300/25 to-transparent blur-3xl" />

            {showStepIndicator && (
                <header className="sticky top-0 z-40 px-4 md:px-6 lg:px-8 pt-4 pb-3">
                    <div className="max-w-7xl mx-auto">
                        <div className="relative rounded-2xl border border-white/40 bg-gradient-to-r from-white/30 via-violet-50/30 to-white/30 backdrop-blur-xl shadow-[0_8px_30px_rgba(80,40,180,0.12)] px-3 md:px-5 py-3">
                            <div className="flex items-center gap-4">
                                {showBackButton && (
                                    <Button
                                        onClick={handleBack}
                                        variant="ghost"
                                        className="shrink-0 flex items-center gap-2 text-neutral-700 hover:text-neutral-900"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                        <span className="hidden sm:inline">Volver</span>
                                    </Button>
                                )}

                                <ol className="flex-1 grid grid-cols-2 gap-2" aria-label="Progreso del asistente">
                                    {steps.map((s, idx) => {
                                        const active = getCurrentStepNumber() === s.number;
                                        const done = getCurrentStepNumber() > s.number;
                                        return (
                                            <li key={s.key} className="flex items-center justify-center" aria-current={active ? "step" : undefined}>
                                                <div className="flex items-center gap-3">
                                                    <span
                                                        className={[
                                                            "inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold",
                                                            active ? "text-white bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-md"
                                                                : done ? "text-violet-800 bg-violet-200"
                                                                    : "text-violet-700 bg-violet-100",
                                                        ].join(" ")}
                                                    >
                                                        {s.number}
                                                    </span>
                                                    <div className="hidden sm:block leading-tight">
                                                        <div className={`text-sm ${active ? "text-neutral-900 font-semibold" : "text-neutral-800"}`}>
                                                            {s.title}
                                                        </div>
                                                        <div className="text-xs text-neutral-500">{s.description}</div>
                                                    </div>
                                                </div>
                                                {idx < steps.length - 1 && (
                                                    <div className="hidden lg:block w-8 h-px bg-gradient-to-r from-violet-200 to-transparent ml-3" />
                                                )}
                                            </li>
                                        );
                                    })}
                                </ol>

                                <div className="w-10" />
                            </div>
                        </div>
                    </div>
                </header>
            )}

            <main className="px-4 md:px-6 lg:px-8 py-10 md:py-12">
                <div className="max-w-[800px] mx-auto">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {(currentStep === "profile" || currentStep === "photos") && (
                        <Card className="border border-white/60 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl">
                            <CardContent className="p-6 md:p-10">
                                {currentStep === "profile" && (
                                    <UserStep
                                        data={wizardData}
                                        onChange={setWizardData}
                                        onNext={handleProfileNext}
                                    />
                                )}
                                {currentStep === "photos" && (
                                    <PhotoUpload
                                        data={wizardData}
                                        onChange={setWizardData}
                                        onNext={handlePhotosNext}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {currentStep === "loading" && (
                        <Card className="border border-white/60 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl">
                            <CardContent className="p-6 md:p-10">
                                <LoadingStep userName={wizardData.userName} />
                            </CardContent>
                        </Card>
                    )}

                    {currentStep === "result" && (
                        <Card className="border border-white/60 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl">
                            <CardContent className="p-6 md:p-10">
                                <ResultStep
                                    resultImageUrl={resultImageUrl}
                                    userName={wizardData.userName}
                                    onFeedback={handleFeedback}
                                    onAccept={handleAccept}
                                    isProcessing={isProcessing}
                                    products={products}          // <<--- PASO EL DISPLAY
                                />
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
}

