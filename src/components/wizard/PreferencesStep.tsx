import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, Home, Heart, Sparkles, MessageSquare } from "lucide-react";
import { WizardData } from "@/types/wizard";
import { useState } from "react";

interface PreferencesStepProps {
    data: WizardData;
    onChange: (data: WizardData) => void;
    onNext: () => void;
}

export default function PreferencesStep({ data, onChange, onNext }: PreferencesStepProps) {
    const [errors, setErrors] = useState({ style: false, room: false });
    const styles = [
        { id: "moderno", label: "Moderno", description: "Líneas limpias y minimalistas", gradient: "from-slate-100 to-slate-200", icon: "🏢" },
        { id: "contemporaneo", label: "Contemporáneo", description: "Actual y sofisticado", gradient: "from-gray-100 to-gray-200", icon: "✨" },
        { id: "escandinavo", label: "Escandinavo", description: "Funcional y acogedor", gradient: "from-blue-100 to-blue-200", icon: "🏔️" },
        { id: "bohemio", label: "Bohemio", description: "Ecléctico y artístico", gradient: "from-purple-100 to-purple-200", icon: "🎨" },
        { id: "industrial", label: "Industrial", description: "Urbano y robusto", gradient: "from-neutral-100 to-neutral-200", icon: "🏭" },
        { id: "clasico", label: "Clásico", description: "Elegante y atemporal", gradient: "from-amber-100 to-amber-200", icon: "👑" }
    ];

    const rooms = [
        { id: "living", label: "Living", icon: "🛋️", description: "Sala de estar" },
        { id: "dormitorio", label: "Dormitorio", icon: "🛏️", description: "Habitación principal" },
        { id: "cocina", label: "Cocina", icon: "🍳", description: "Área de cocina" },
        { id: "bano", label: "Baño", icon: "🛁", description: "Cuarto de baño" },
        { id: "comedor", label: "Comedor", icon: "🍽️", description: "Área de comedor" },
        { id: "oficina", label: "Oficina", icon: "💼", description: "Espacio de trabajo" }
    ];

    const designPreferences = [
        { id: "plantas", label: "Plantas y naturaleza", icon: "🌱" },
        { id: "colores-neutros", label: "Colores neutros", icon: "🤍" },
        { id: "luz-natural", label: "Mucha luz natural", icon: "☀️" },
        { id: "espacios-amplios", label: "Espacios amplios", icon: "📏" },
        { id: "arte", label: "Arte en paredes", icon: "🖼️" },
        { id: "texturas", label: "Texturas suaves", icon: "🧸" },
        { id: "materiales-naturales", label: "Materiales naturales", icon: "🌳" },
        { id: "colores-vibrantes", label: "Colores vibrantes", icon: "🌈" },
        { id: "vintage", label: "Muebles vintage", icon: "🪑" },
        { id: "iluminacion-calida", label: "Iluminación cálida", icon: "💡" },
        { id: "alfombras", label: "Alfombras y tapetes", icon: "🧩" },
        { id: "espejos", label: "Espejos decorativos", icon: "🪞" }
    ];

    const handleStyleChange = (styleId: string) => {
        onChange({ ...data, style: styleId });
    };

    const handleRoomChange = (roomId: string) => {
        onChange({ ...data, room: roomId });
    };

    const handlePreferenceToggle = (preferenceId: string) => {
        const newPreferences = data.preferences.includes(preferenceId)
            ? data.preferences.filter(p => p !== preferenceId)
            : [...data.preferences, preferenceId];

        onChange({ ...data, preferences: newPreferences });
    };

    const isFormValid = data.style && data.room;

    return (
        <div className="space-y-8">
            <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-3xl flex items-center justify-center mb-6 mx-auto">
                    <Palette className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-semibold text-neutral-800 mb-3">
                    {data.userName ? `Perfecto ${data.userName}, ` : ""}define tu estilo
                </h2>
                <p className="text-neutral-600 leading-relaxed max-w-md mx-auto">
                    Cuéntanos tus gustos para crear renders que se adapten perfectamente a ti
                </p>
            </div>

            {/* Tipo de Espacio */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                    <Home className="w-5 h-5 text-neutral-600" />
                    <h3 className="text-lg font-semibold text-neutral-800">¿Qué espacio quieres transformar?</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {rooms.map((room) => (
                        <Card
                            key={room.id}
                            className={`cursor-pointer border-2 transition-all hover:shadow-md group ${data.room === room.id
                                    ? "border-emerald-400 bg-emerald-50 shadow-lg"
                                    : "border-neutral-200 hover:border-neutral-300"
                                }`}
                            onClick={() => handleRoomChange(room.id)}
                        >
                            <CardContent className="p-4 text-center">
                                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{room.icon}</div>
                                <div className="text-sm font-medium text-neutral-800 mb-1">{room.label}</div>
                                <div className="text-xs text-neutral-600">{room.description}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Estilo */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neutral-800">¿Qué estilo te inspira más?</h3>
                <div className="grid md:grid-cols-2 gap-3">
                    {styles.map((style) => (
                        <Card
                            key={style.id}
                            className={`cursor-pointer border-2 transition-all hover:shadow-md group ${data.style === style.id
                                    ? "border-emerald-400 bg-emerald-50 shadow-lg"
                                    : "border-neutral-200 hover:border-neutral-300"
                                }`}
                            onClick={() => handleStyleChange(style.id)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`w-10 h-10 bg-gradient-to-br ${style.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <span className="text-lg">{style.icon}</span>
                                    </div>
                                    <div className="font-medium text-neutral-800">{style.label}</div>
                                </div>
                                <div className="text-sm text-neutral-600">{style.description}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Preferencias de diseño */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neutral-800">¿Qué elementos te gustan?</h3>
                <p className="text-sm text-neutral-600">Selecciona todos los que te interesen</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {designPreferences.map((preference) => (
                        <Badge
                            key={preference.id}
                            variant={data.preferences.includes(preference.id) ? "default" : "outline"}
                            className={`cursor-pointer px-3 py-3 text-sm transition-all hover:shadow-sm flex items-center gap-2 justify-center ${data.preferences.includes(preference.id)
                                    ? "bg-emerald-500 text-white hover:bg-emerald-600"
                                    : "hover:bg-emerald-50 hover:border-emerald-300"
                                }`}
                            onClick={() => handlePreferenceToggle(preference.id)}
                        >
                            <span>{preference.icon}</span>
                            {preference.label}
                        </Badge>
                    ))}
                </div>

                {data.preferences.length > 0 && (
                    <div className="text-emerald-600 text-sm p-3 bg-emerald-50 rounded-lg">
                        ¡Excelente! Has seleccionado {data.preferences.length} preferencias que nos ayudarán a personalizar tus renders
                    </div>
                )}
            </div>

            <div className="flex justify-between pt-6">
                <div />
                <Button
                    onClick={onNext}
                    disabled={!isFormValid}
                    className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Continuar
                </Button>
            </div>
        </div>
    );
}