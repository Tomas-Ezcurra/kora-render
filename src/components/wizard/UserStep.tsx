import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Palette, Sofa, Check, Sparkles } from "lucide-react";
import { WizardData } from "@/types/wizard";

interface UserStepProps {
    data: WizardData;
    onChange: (data: WizardData) => void;
    onNext: () => void;
}

export default function UserStep({ data, onChange, onNext }: UserStepProps) {
    const [touched, setTouched] = useState(false);

    const livingStyles = [
        { id: "minimalista", label: "Minimalista", description: "Simple, funcional, sin ruido visual" },
        { id: "acogedor", label: "Acogedor", description: "Cálido, texturas y confort" },
        { id: "moderno", label: "Moderno", description: "Líneas limpias y actual" },
        { id: "bohemio", label: "Bohemio", description: "Ecléctico, artístico y libre" },
        { id: "elegante", label: "Elegante", description: "Sobrio, materiales premium" },
        { id: "relajado", label: "Relajado", description: "Sereno, tonos suaves" },
    ];


    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...data, userName: e.target.value });
        if (!touched) setTouched(true);
    };

    const handleLivingStyleChange = (styleId: string) => {
        onChange({ ...data, livingStyle: styleId });
    };

    const handlePersonalityToggle = (trait: string) => {
        const list = data.preferences || [];
        const newPreferences = list.includes(trait) ? list.filter(p => p !== trait) : [...list, trait];
        onChange({ ...data, preferences: newPreferences });
    };

    const isFormValid = Boolean(data.userName?.trim() && data.livingStyle);

    return (
        <div className="font-sans space-y-10">
            {/* Encabezado cálido */}
            <Card className="border border-white/60 bg-white/75 backdrop-blur-xl rounded-3xl shadow-xl">
                <CardContent className="px-6 md:px-10 py-10">
                    <div className="text-center max-w-2xl mx-auto">
                        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center mb-6 mx-auto shadow-lg">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 mb-3">
                            ¡Hola! Conozcámonos
                        </h2>
                        <p className="text-neutral-600 leading-relaxed">
                            Contanos un poco sobre vos para que la IA de Kora diseñe <span className="font-medium text-violet-700">renders hechos a tu medida</span>.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Nombre */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <Sofa className="w-5 h-5 text-neutral-600" />
                    <h3 className="text-lg font-semibold text-neutral-900">¿Cómo te llamás?</h3>
                </div>

                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-700/70" />
                    <Input
                        value={data.userName}
                        onChange={handleNameChange}
                        onBlur={() => setTouched(true)}
                        placeholder="Tu nombre"
                        aria-label="Tu nombre"
                        className={`pl-12 pr-4 h-12 text-[16px] rounded-2xl bg-white/85 border ${touched && !data.userName?.trim()
                            ? "border-rose-300 focus-visible:ring-rose-200"
                            : "border-neutral-200 focus-visible:ring-violet-200"
                            } focus-visible:ring-2 focus-visible:border-violet-400 transition`}
                    />
                </div>

                {data.userName?.trim() ? (
                    <div className="text-sm text-violet-700">
                        ¡Genial, <span className="font-medium">{data.userName}</span>! Sigamos con tu estilo.
                    </div>
                ) : touched ? (
                    <div className="text-sm text-rose-500">El nombre es requerido para continuar.</div>
                ) : null}
            </section>
            
            {/* CTA */}
            <div className="flex justify-end pt-4">
                <Button
                    onClick={onNext}
                    
                    className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white px-6 h-12 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                    {data.userName?.trim() ? `Continuar, ${data.userName}` : "Continuar"}
                </Button>
            </div>
        </div>
    );
}
