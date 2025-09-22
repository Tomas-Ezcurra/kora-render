import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CheckCircle, DollarSign, Camera, Palette, User, Sparkles, MessageSquare } from "lucide-react";
import { WizardData } from "@/types/wizard";

interface ConfirmationStepProps {
    data: WizardData;
    onChange: (data: WizardData) => void;
    onSubmit: () => void;
    isSubmitting: boolean;
}

export default function ConfirmationStep({ data, onChange, onSubmit, isSubmitting }: ConfirmationStepProps) {
    const [customBudget, setCustomBudget] = useState("");

    const budgetOptions = [
        { id: "economico", label: "Económico", description: "Transformación básica", range: "$50 - $150", emoji: "💡" },
        { id: "equilibrado", label: "Equilibrado", description: "Buen balance calidad-precio", range: "$150 - $300", emoji: "⚖️" },
        { id: "premium", label: "Premium", description: "Renders de alta calidad", range: "$300 - $500", emoji: "✨" },
        { id: "personalizado", label: "Personalizado", description: "Dime tu presupuesto", range: "A medida", emoji: "🎯" }
    ];

    const handleBudgetChange = (budgetId: string) => {
        onChange({ ...data, budget: budgetId });
        if (budgetId !== "personalizado") {
            setCustomBudget("");
        }
    };

    const handleCustomBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomBudget(e.target.value);
        onChange({ ...data, budget: `personalizado:${e.target.value}` });
    };

    const getRoomLabel = (roomId: string) => {
        const rooms: Record<string, string> = {
            living: "Living",
            dormitorio: "Dormitorio",
            cocina: "Cocina",
            bano: "Baño",
            comedor: "Comedor",
            oficina: "Oficina"
        };
        return rooms[roomId] || roomId;
    };

    const getStyleLabel = (styleId: string) => {
        const styles: Record<string, string> = {
            moderno: "Moderno",
            contemporaneo: "Contemporáneo",
            escandinavo: "Escandinavo",
            bohemio: "Bohemio",
            industrial: "Industrial",
            clasico: "Clásico"
        };
        return styles[styleId] || styleId;
    };

    const isFormValid = data.budget && (data.budget !== "personalizado" || customBudget.trim());

    return (
        <div className="space-y-8">
            <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-violet-200 rounded-3xl flex items-center justify-center mb-6 mx-auto">
                    <Sparkles className="w-8 h-8 text-violet-600" />
                </div>
                <h2 className="text-2xl font-semibold text-neutral-800 mb-3">
                    {data.userName ? `Casi listo, ${data.userName}!` : "¡Casi listo!"}
                </h2>
                <p className="text-neutral-600 leading-relaxed max-w-md mx-auto">
                    Define tu presupuesto y confirma los detalles para crear tus renders personalizados
                </p>
            </div>

            {/* Budget Selection */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-5 h-5 text-neutral-600" />
                    <h3 className="text-lg font-semibold text-neutral-800">¿Cuál es tu presupuesto ideal?</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                    {budgetOptions.map((budget) => (
                        <Card
                            key={budget.id}
                            className={`cursor-pointer border-2 transition-all hover:shadow-md group ${data.budget.startsWith(budget.id)
                                    ? "border-violet-400 bg-violet-50 shadow-lg"
                                    : "border-neutral-200 hover:border-neutral-300"
                                }`}
                            onClick={() => handleBudgetChange(budget.id)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-2xl group-hover:scale-110 transition-transform">{budget.emoji}</span>
                                    <div className="font-medium text-neutral-800">{budget.label}</div>
                                </div>
                                <div className="text-sm text-neutral-600 mb-1">{budget.description}</div>
                                <div className="text-xs text-violet-600 font-medium">{budget.range}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {data.budget === "personalizado" && (
                    <div className="mt-4 p-4 bg-violet-50 rounded-xl">
                        <label className="block text-sm font-medium text-neutral-800 mb-2">
                            Tu presupuesto ideal (USD)
                        </label>
                        <Input
                            value={customBudget}
                            onChange={handleCustomBudgetChange}
                            placeholder="Ejemplo: $250"
                            className="bg-white border-violet-200 focus:border-violet-400 focus:ring-violet-400/20"
                        />
                    </div>
                )}
            </div>

            {/* Summary */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold text-neutral-800">Resumen de tu proyecto</h3>

                <div className="grid gap-4">
                    {/* User Info */}
                    <Card className="border-neutral-200">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <User className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium text-neutral-800 mb-1">Perfil</div>
                                    <div className="text-sm text-neutral-600">
                                        {data.userName} • Estilo: {data.livingStyle}
                                    </div>
                                    {data.preferences.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {data.preferences.slice(0, 3).map((pref) => (
                                                <Badge key={pref} variant="outline" className="text-xs">
                                                    {pref}
                                                </Badge>
                                            ))}
                                            {data.preferences.length > 3 && (
                                                <Badge variant="outline" className="text-xs">
                                                    +{data.preferences.length - 3} más
                                                </Badge>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Photos */}
                    <Card className="border-neutral-200">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Camera className="w-4 h-4 text-amber-600" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium text-neutral-800 mb-1">Fotos</div>
                                    <div className="text-sm text-neutral-600 mb-2">
                                        {data.photos.length} imagen{data.photos.length !== 1 ? 's' : ''} subida{data.photos.length !== 1 ? 's' : ''}
                                    </div>
                                    {data.photos.length > 0 && (
                                        <div className="flex gap-2">
                                            {data.photoPreviews.slice(0, 3).map((preview, index) => (
                                                <img
                                                    key={index}
                                                    src={preview}
                                                    alt={`Vista previa ${index + 1}`}
                                                    className="w-12 h-12 object-cover rounded-lg border-2 border-white shadow-sm"
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Style & Room */}
                    <Card className="border-neutral-200">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Palette className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium text-neutral-800 mb-1">Estilo y Espacio</div>
                                    <div className="text-sm text-neutral-600">
                                        {getStyleLabel(data.style)} • {getRoomLabel(data.room)}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Custom Prompt */}
                    {data.prompt && (
                        <Card className="border-neutral-200">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <MessageSquare className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-neutral-800 mb-1">Tu visión personalizada</div>
                                        <div className="text-sm text-neutral-600 line-clamp-3">
                                            "{data.prompt}"
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-neutral-200">
                <Button
                    onClick={onSubmit}
                    disabled={!isFormValid || isSubmitting}
                    className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white py-4 rounded-xl font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Creando tus renders...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            {data.userName ? `¡Crear renders, ${data.userName}!` : "¡Crear mis renders!"}
                        </div>
                    )}
                </Button>

                <p className="text-center text-xs text-neutral-500 mt-3">
                    Recibirás 2-4 renders personalizados en pocos minutos
                </p>
            </div>
        </div>
    );
}