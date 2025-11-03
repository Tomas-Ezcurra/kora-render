import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
    CheckCircle2,
    MessageSquare,
    RefreshCw,
    Download,
    Share2,
    Tag,
} from "lucide-react";
import type { RenderProduct } from "@/types/products";

/** Convierte base64 puro a data URL; si ya es data: o http(s), lo deja igual */
function toDataUrl(image?: string, mimeType?: string) {
    if (!image || typeof image !== "string") return "";
    if (image.startsWith("data:") || image.startsWith("http")) return image;
    return `data:${mimeType || "image/jpeg"};base64,${image}`;
}

interface ResultStepProps {
    resultImageUrl: string;
    userName: string;
    onFeedback: (feedback: string) => void;
    onAccept: () => void;
    isProcessing: boolean;
    products?: RenderProduct[]; // <<--- DISPLAY
}

export default function ResultStep({
    resultImageUrl,
    userName,
    onFeedback,
    onAccept,
    isProcessing,
    products = [],
}: ResultStepProps) {
    const [feedback, setFeedback] = useState("");
    const [showFeedback, setShowFeedback] = useState(false);

    const handleSubmitFeedback = () => {
        if (feedback.trim()) {
            onFeedback(feedback);
            setFeedback("");
            setShowFeedback(false);
        }
    };

    const handleDownload = () => {
        const a = document.createElement("a");
        a.href = resultImageUrl;
        a.download = "render.png";
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    const handleShare = async () => {
        try {
            if ((navigator as any).share) {
                await (navigator as any).share({
                    title: "Mi render",
                    text: "Mirá cómo quedó mi render generado por IA",
                    url: resultImageUrl,
                });
                return;
            }
            window.open(resultImageUrl, "_blank");
        } catch {
            window.open(resultImageUrl, "_blank");
        }
    };

    /** UI para el listado de productos */
    const ProductsList = (
        <>
            {products.length === 0 ? (
                <div className="min-h-[240px] rounded-2xl bg-neutral-50/70 ring-1 ring-neutral-100 grid place-items-center text-sm text-neutral-500">
                    Próximamente verás aquí los productos detectados ✨
                </div>
            ) : (
                <ul className="grid grid-cols-1 gap-3">
                    {products.map((p) => {
                        const src = toDataUrl(p.image, p.mimeType);
                        const title = p.product || p.name || "Producto";
                        return (
                            <li
                                key={String(p.id ?? title)}
                                className="flex items-center gap-3 p-3 rounded-xl ring-1 ring-neutral-100 bg-white/80"
                            >
                                <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden ring-1 ring-neutral-200 bg-neutral-100">
                                    {src ? (
                                        <img
                                            src={src}
                                            alt={title}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="w-full h-full grid place-items-center text-xs text-neutral-400">
                                            S/IMG
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <div className="text-sm font-semibold text-neutral-900 truncate">
                                        {title}
                                    </div>
                                    {p.description && (
                                        <div className="text-xs text-neutral-600 line-clamp-2">
                                            {p.description}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 mt-1">
                                        {typeof p.price === "number" && (
                                            <div className="text-xs text-emerald-700">
                                                ${p.price.toFixed(2)}
                                            </div>
                                        )}
                                        {p.url && (
                                            <a
                                                href={p.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-blue-600 hover:underline"
                                            >
                                                Ver producto
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </>
    );

    return (
        <div className="space-y-8 overflow-x-hidden">
            {/* Header */}
            <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-200 rounded-3xl flex items-center justify-center mb-6 mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-semibold text-neutral-800 mb-3">
                    ¡Tu render está listo, {userName}!
                </h2>
                <p className="text-neutral-600 leading-relaxed max-w-md mx-auto">
                    Mira cómo la IA transformó tu espacio. ¿Te gusta el resultado?
                </p>
            </div>

            {/* Toolbar centrada arriba */}
            <div className="flex justify-center items-center mt-2">
                <div className="flex items-center gap-2 rounded-2xl bg-white text-white backdrop-blur-md px-4 py-2 shadow-lg">
                    <Button size="sm" onClick={handleDownload} className="text-black bg-white">
                        <Download className="w-4 h-4 mr-2" />
                        Descargar
                    </Button>
                    <div className="w-px h-5 bg-white" />
                    <Button size="sm" onClick={handleShare} className="text-black bg-white">
                        <Share2 className="w-4 h-4 mr-2" />
                        Compartir
                    </Button>
                </div>
            </div>

            {/* ===================== BLOQUE RENDER ===================== */}
            <section className="relative max-w-[1250px] w-full mx-auto">
                <Card className=" border-0 shadow-2xl rounded-3xl bg-gradient-to-br from-white to-neutral-50/50">
                    <CardContent className="p-0">
                        <div className="relative aspect-[4/3] bg-neutral-100">
                            <img
                                src={resultImageUrl}
                                alt="Render generado"
                                className="w-full h-full object-cover select-none"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Panel de productos FLOTANTE a la DERECHA */}
                <div className="overflow-x-hidden flex absolute top-4 left-full ml-16 2xl:ml-24">
                    <div className="w-[380px] 2xl:w-[420px]">
                        <Card className="border-0 rounded-3xl shadow-2xl bg-white/95 ring-1 ring-neutral-100">
                            <CardContent className="p-5">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="size-9 rounded-xl bg-emerald-50 text-emerald-700 grid place-items-center ring-1 ring-emerald-100">
                                        <Tag className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-neutral-900">
                                            Productos del render
                                        </h3>
                                        <p className="text-sm text-neutral-500">
                                            Aquí verás los ítems detectados y su precio de referencia.
                                        </p>
                                    </div>
                                </div>

                                {ProductsList}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Fallback del panel en mobile/tablet (no flotante) */}
            <section className="w-full">
                <div className="max-w-[1100px] mx-auto">
                    <Card className="border-0 rounded-3xl shadow-xl bg-white/95 ring-1 ring-neutral-100">
                        <CardContent className="p-5">
                            <div className="flex items-start gap-3 mb-3">
                                <div className="size-9 rounded-xl bg-emerald-50 text-emerald-700 grid place-items-center ring-1 ring-emerald-100">
                                    <Tag className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-neutral-900">
                                        Productos del render
                                    </h3>
                                    <p className="text-sm text-neutral-500">
                                        Aquí verás los ítems detectados y su precio de referencia.
                                    </p>
                                </div>
                            </div>

                            {ProductsList}
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Botones de acción */}
            <div className="space-y-4">
                {!showFeedback ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button
                            onClick={onAccept}
                            disabled={isProcessing}
                            className="px-6 py-6 rounded-2xl font-semibold text-lg text-white
                         bg-gradient-to-r from-teal-600 to-emerald-600
                         hover:from-teal-700 hover:to-emerald-700
                         shadow-lg hover:shadow-xl transition-all
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-500
                         disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <CheckCircle2 className="w-5 h-5 mr-2" />
                            ¡Me encanta! Aceptar
                        </Button>

                        <Button
                            onClick={() => setShowFeedback(true)}
                            disabled={isProcessing}
                            className="px-6 py-6 rounded-2xl font-semibold text-lg
                         text-white bg-gradient-to-r from-emerald-600 to-teal-600
                         hover:from-emerald-700 hover:to-teal-700
                         shadow-md hover:shadow-lg transition-all
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500
                         disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <MessageSquare className="w-5 h-5 mr-2" />
                            Dar feedback
                        </Button>
                    </div>
                ) : (
                    <Card className="border-2 border-violet-200 bg-violet-50/30 rounded-2xl">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center gap-2 text-violet-700">
                                <MessageSquare className="w-5 h-5" />
                                <h3 className="font-semibold">Comparte tu feedback</h3>
                            </div>

                            <Textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Describe qué te gustaría cambiar o mejorar en el render. Por ejemplo: 'Más luz natural', 'Cambiar color de paredes', etc."
                                className="min-h-[120px] bg-white border-violet-200 focus:border-violet-400 focus:ring-violet-400/20"
                                disabled={isProcessing}
                            />

                            <div className="flex gap-3">
                                <Button
                                    onClick={handleSubmitFeedback}
                                    disabled={!feedback.trim() || isProcessing}
                                    className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white"
                                >
                                    {isProcessing ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                            Regenerando...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="w-4 h-4 mr-2" />
                                            Regenerar con cambios
                                        </>
                                    )}
                                </Button>
                                <Button onClick={() => setShowFeedback(false)} variant="outline" disabled={isProcessing}>
                                    Cancelar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {isProcessing && (
                <div className="text-center text-sm text-neutral-500 animate-pulse">
                    <p>Procesando tu feedback y generando un nuevo render...</p>
                </div>
            )}
        </div>
    );
}
