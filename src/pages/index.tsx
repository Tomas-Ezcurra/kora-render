import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Sparkles, ArrowRight, CheckCircle } from "lucide-react";
import { useRouter } from "next/router";

export default function HomePage() {
    const router = useRouter();
    const [isStarting, setIsStarting] = useState(false);

    const handleStartRender = async () => {
        setIsStarting(true);
        await new Promise((r) => setTimeout(r, 800));
        router.push("/wizard");
    };

    // Mismo contenido, ahora con una única paleta violeta
    const features = [
        {
            icon: Camera,
            title: "Sube tu foto",
            description: "Con una foto bien iluminada, empezamos al instante.",
            gradient: "from-violet-100 to-violet-200",
            iconColor: "text-violet-700",
            tip: "Tip: una foto bien iluminada mejora el resultado."
        },
        {
            icon: Sparkles,
            title: "IA personalizada",
            description: "Elegí estilos y preferencias para un resultado único.",
            gradient: "from-violet-100 to-violet-200",
            iconColor: "text-violet-700",
            tip: "Podés combinar estilos (nórdico, minimal, boho…)."
        },
        {
            icon: CheckCircle,
            title: "Compra directo",
            description: "Todo lo que ves en el render está listo para comprar.",
            gradient: "from-violet-100 to-violet-200",
            iconColor: "text-violet-700",
            tip: "Guardá favoritos y recibí el carrito listo para pagar."
        }
    ];

    return (
        <div className="min-h-screen font-sans bg-gradient-to-br from-violet-50 via-white to-violet-50">
            {/* Header sutil (glass) */}
            <header className="sticky top-3 z-50 px-4 md:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="relative rounded-2xl border border-white/40 bg-gradient-to-r from-white/30 via-violet-50/30 to-white/30 backdrop-blur-xl shadow-[0_8px_30px_rgba(80,40,180,0.12)] px-4 md:px-6 py-3">
                        <div className="flex items-center justify-between gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-md">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div className="leading-none">
                                    <span className="text-xl font-bold text-neutral-900">Kora</span>
                                    <span className="ml-2 text-[11px] tracking-wide font-semibold text-violet-700">RENDER</span>
                                </div>
                            </div>

                            <Button
                                onClick={handleStartRender}
                                disabled={isStarting}
                                className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white px-4 py-2 shadow-md"
                            >
                                {isStarting ? "Iniciando..." : "Crear mi render"}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="px-4 md:px-6 lg:px-8 pb-20">
                {/* Hero con tu background */}
                <section className="relative overflow-hidden rounded-3xl max-w-7xl mx-auto mt-8" aria-label="Kora hero">
                    <div
                        className="absolute inset-0 bg-center bg-cover"
                        style={{
                            backgroundImage:
                                "url('https://res.cloudinary.com/dfrhrnwwi/image/upload/v1758134089/Free_Vector___Blue_blurred_background_design_h2wclx.jpg')",
                        }}
                        aria-hidden="true"
                    />
                    {/* Velos para legibilidad */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/78 to-white/70" />
                    <div className="absolute -inset-x-32 -top-40 h-80 bg-gradient-to-b from-violet-300/25 to-transparent blur-3xl" />
                    <div className="relative z-10 text-center px-6 py-20 md:py-28">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-xl rounded-full text-sm text-neutral-800 font-medium mb-8 border border-violet-200/60 shadow-sm">
                            <Sparkles className="w-4 h-4 text-violet-700" />
                            Renders de decoración con IA
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-sans font-semibold text-neutral-900 mb-8 leading-tight">
                            Tu espacio,
                            <span className="block font-semibold font-sans bg-gradient-to-r from-violet-700 via-fuchsia-600 to-violet-600 bg-clip-text text-transparent">
                                tu esencia
                            </span>
                        </h1>

                        <p className="text-lg md:text-2xl text-neutral-700 mb-10 max-w-3xl mx-auto leading-relaxed">
                            Sube una foto de tu espacio y obtené renders profesionales con productos reales que podés comprar al instante.
                        </p>

                        <Button
                            onClick={handleStartRender}
                            disabled={isStarting}
                            size="lg"
                            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white px-8 py-6 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 disabled:opacity-70"
                        >
                            {isStarting ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Iniciando...
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Camera className="w-6 h-6" />
                                    Crear mi render gratis
                                    <ArrowRight className="w-6 h-6" />
                                </div>
                            )}
                        </Button>
                    </div>
                </section>

                {/* ¿Cómo funciona? — Tarjetas (paleta violeta) */}
                <section id="como-funciona" className="mb-20 mt-16">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 mb-2">¿Cómo funciona?</h2>
                        <p className="text-lg md:text-xl text-neutral-600">Tres pasos simples, cerca tuyo de principio a fin.</p>
                    </div>

                    <div className="max-w-7xl mx-auto">
                        <div className="grid md:grid-cols-3 gap-6">
                            {features.map((f, i) => (
                                <Card
                                    key={i}
                                    className="border-0 shadow-xl shadow-neutral-200/50 hover:shadow-2xl hover:shadow-neutral-200/70 transition-all duration-500 hover:-translate-y-1 bg-white/85 backdrop-blur rounded-3xl ring-1 ring-violet-100/70"
                                >
                                    <CardContent className="p-7">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-16 h-16 shrink-0 bg-gradient-to-br ${f.gradient} rounded-2xl flex items-center justify-center shadow-md`}>
                                                <f.icon className={`w-8 h-8 ${f.iconColor}`} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs font-bold">
                                                        {i + 1}
                                                    </span>
                                                    <h3 className="text-xl font-semibold text-neutral-900">{f.title}</h3>
                                                </div>
                                                <p className="text-neutral-700">{f.description}</p>
                                                <p className="mt-3 text-sm text-neutral-500">{f.tip}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Final (igual) */}
                <section id="cta-final" className="text-center mt-16">
                    <Card className="border border-white/50 bg-white/75 backdrop-blur-xl rounded-3xl shadow-2xl">
                        <CardContent className="p-12 md:p-16">
                            <div className="max-w-2xl mx-auto">
                                <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-xl">
                                    <Sparkles className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                                    ¿Listo para transformar tu espacio?
                                </h2>
                                <p className="text-lg md:text-xl text-neutral-600 mb-8 leading-relaxed">
                                    Unite a miles de personas que ya renovaron sus hogares con Kora.
                                </p>
                                <Button
                                    onClick={handleStartRender}
                                    disabled={isStarting}
                                    size="lg"
                                    className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white px-8 py-6 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                                >
                                    {isStarting ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Iniciando...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <Camera className="w-6 h-6" />
                                            Comenzar ahora – Gratis
                                            <ArrowRight className="w-6 h-6" />
                                        </div>
                                    )}
                                </Button>
                                <p className="text-sm text-neutral-500 mt-4">Sin compromisos • Resultados en 5 minutos</p>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </main>

            {/* Footer a tono con el header */}
            <footer className="px-4 md:px-6 lg:px-8 py-10">
                <div className="max-w-7xl mx-auto">
                    <div className="relative rounded-2xl border border-white/40 bg-gradient-to-r from-white/25 via-violet-50/25 to-white/25 backdrop-blur-xl shadow-[0_8px_30px_rgba(80,40,180,0.10)] px-5 md:px-7 py-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <span className="font-bold text-neutral-900">Kora</span>
                                    <span className="text-xs text-violet-700 font-medium ml-1">RENDER</span>
                                </div>
                            </div>

                            <div className="text-sm text-neutral-600 order-3 md:order-2">
                                © 2025 Kora. Transformando espacios con inteligencia artificial.
                            </div>

                            <div className="flex items-center gap-6 text-sm text-neutral-700 order-2 md:order-3">
                                <a href="#" className="hover:text-neutral-900 transition-colors">Privacidad</a>
                                <a href="#" className="hover:text-neutral-900 transition-colors">Términos</a>
                                <a href="#" className="hover:text-neutral-900 transition-colors">Soporte</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
