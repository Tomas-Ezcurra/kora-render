import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";

interface LoadingStepProps {
    userName: string;
}

export default function LoadingStep({ userName }: LoadingStepProps) {
    const [loadingText, setLoadingText] = useState("Analizando tu espacio");

    useEffect(() => {
        const messages = [
            "Analizando tu espacio",
            "Generando ideas creativas",
            "Construyendo tu render personalizado",
            "Aplicando los toques finales"
        ];

        let index = 0;
        const interval = setInterval(() => {
            index = (index + 1) % messages.length;
            setLoadingText(messages[index]);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-8">
            <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-fuchsia-200 rounded-3xl flex items-center justify-center mb-6 mx-auto animate-pulse">
                    <Sparkles className="w-8 h-8 text-violet-600" />
                </div>
                <h2 className="text-2xl font-semibold text-neutral-800 mb-3">
                    ¡Creando magia, {userName}!
                </h2>
                <p className="text-neutral-600 leading-relaxed max-w-md mx-auto">
                    Nuestro modelo de IA está trabajando en tu render personalizado. Esto puede tomar unos minutos.
                </p>
            </div>

            <Card className="border border-violet-200/50 bg-gradient-to-br from-violet-50/50 to-fuchsia-50/30 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden">
                <CardContent className="p-8">
                    <div className="space-y-6">
                        <div className="flex items-center justify-center gap-3">
                            <Loader2 className="w-6 h-6 text-violet-600 animate-spin" />
                            <span className="text-lg font-medium text-violet-700">{loadingText}...</span>
                        </div>

                        <div className="w-full h-2 bg-violet-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full animate-[progress_2s_ease-in-out_infinite]"
                                style={{ width: "60%" }} />
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4">
                            {[
                                { icon: "🎨", text: "Estilo personalizado" },
                                { icon: "🏠", text: "Análisis espacial" },
                                { icon: "✨", text: "Detalles únicos" },
                                { icon: "🖼️", text: "Render HD" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-neutral-600">
                                    <span className="text-xl">{item.icon}</span>
                                    <span>{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="text-center text-sm text-neutral-500">
                <p>Por favor, no cierres esta ventana. Te notificaremos cuando esté listo.</p>
            </div>
        </div>
    );
}
