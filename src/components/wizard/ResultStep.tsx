import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, MessageSquare, RefreshCw, Download, Share2 } from "lucide-react";

interface ResultStepProps {
    resultImageUrl: string;
    userName: string;
    onFeedback: (feedback: string) => void;
    onAccept: () => void;
    isProcessing: boolean;
}

export default function ResultStep({
    resultImageUrl,
    userName,
    onFeedback,
    onAccept,
    isProcessing
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

    return (
        <div className="space-y-8">
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

            {/* Result Image */}
            <Card className="overflow-hidden border-0 shadow-2xl rounded-3xl bg-gradient-to-br from-white to-neutral-50/50">
                <CardContent className="p-0">
                    <div className="relative aspect-[4/3] bg-neutral-100">
                        <img
                            src={resultImageUrl}
                            alt="Render generado"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4 flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                className="bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Descargar
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white"
                            >
                                <Share2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-4">
                {!showFeedback ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button
                            onClick={onAccept}
                            disabled={isProcessing}
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-6 rounded-2xl font-medium text-lg shadow-lg"
                        >
                            <CheckCircle2 className="w-5 h-5 mr-2" />
                            ¡Me encanta! Aceptar
                        </Button>

                        <Button
                            onClick={() => setShowFeedback(true)}
                            disabled={isProcessing}
                            variant="outline"
                            className="border-2 border-violet-200 hover:bg-violet-50 text-violet-700 px-6 py-6 rounded-2xl font-medium text-lg"
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
                                placeholder="Describe qué te gustaría cambiar o mejorar en el render. Por ejemplo: 'Me gustaría más luz natural', 'Cambiar el color de las paredes', 'Agregar más plantas', etc."
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
                                <Button
                                    onClick={() => setShowFeedback(false)}
                                    variant="outline"
                                    disabled={isProcessing}
                                >
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
