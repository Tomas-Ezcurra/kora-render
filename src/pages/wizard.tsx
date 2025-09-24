import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";
import UserStep from "@/components/wizard/UserStep";
import PhotoUpload from "@/components/wizard/PhotoUpload";
import ConfirmationStep from "@/components/wizard/ConfirmationStep";
import { WizardData } from "@/types/wizard";

const BG_URL =
    "https://res.cloudinary.com/dfrhrnwwi/image/upload/v1758134089/Free_Vector___Blue_blurred_background_design_h2wclx.jpg";

export default function WizardPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [wizardData, setWizardData] = useState < WizardData > ({
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
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const steps = [
        { number: 1, title: "Perfil", description: "Conozcámonos" },
        { number: 2, title: "Fotos", description: "Sube tu espacio" },
        { number: 3, title: "Confirmar", description: "Revisa y lanza" },
    ] as const;

    const handleNext = () => currentStep < 4 && setCurrentStep((s) => s + 1);
    const handleBack = () => (currentStep > 1 ? setCurrentStep((s) => s - 1) : router.push("/"));

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            wizardData.photos.forEach((photo, index) => formData.append(`photo_${index}`, photo));
            formData.append("userName", wizardData.userName);
            formData.append("livingStyle", wizardData.livingStyle);
            formData.append("style", wizardData.style);
            formData.append("budget", wizardData.budget);
            formData.append("room", wizardData.room);
            formData.append("prompt", wizardData.prompt);

            const response = await fetch("/api/kora/jobs", { method: "POST", body: formData });
            if (!response.ok) throw new Error("Error creating job");
            const { jobId } = await response.json();
            router.push(`/job/${jobId}`);
        } catch (err) {
            console.error("Error submitting wizard:", err);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative min-h-screen font-sans">
            {/* Background (misma imagen que el home) */}
            <div
                className="absolute inset-0 -z-10 bg-center bg-cover"
                style={{ backgroundImage: `url('${BG_URL}')` }}
                aria-hidden="true"
            />
            {/* Velos para legibilidad */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/85 via-white/80 to-white/70" />
            <div className="absolute -z-10 -inset-x-32 -top-40 h-80 bg-gradient-to-b from-violet-300/25 to-transparent blur-3xl" />

            {/* Header (glass, sticky, paleta violeta) */}
            <header className="sticky top-0 z-40 px-4 md:px-6 lg:px-8 pt-4 pb-3">
                <div className="max-w-7xl mx-auto">
                    <div
                        className="relative rounded-2xl border border-white/40
              bg-gradient-to-r from-white/30 via-violet-50/30 to-white/30
              backdrop-blur-xl shadow-[0_8px_30px_rgba(80,40,180,0.12)]
              px-3 md:px-5 py-3"
                    >
                        <div className="flex items-center gap-4">
                            {/* Volver */}
                            <Button
                                onClick={handleBack}
                                variant="ghost"
                                className="shrink-0 flex items-center gap-2 text-neutral-700 hover:text-neutral-900"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span className="hidden sm:inline">Volver</span>
                            </Button>

                            {/* Steps */}
                            <ol className="flex-1 grid grid-cols-4 gap-2" aria-label="Progreso del asistente">
                                {steps.map((s, idx) => {
                                    const active = currentStep === s.number;
                                    const done = currentStep > s.number;
                                    return (
                                        <li
                                            key={s.number}
                                            className="flex items-center justify-center"
                                            aria-current={active ? "step" : undefined}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={[
                                                        "inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold",
                                                        active
                                                            ? "text-white bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-md"
                                                            : done
                                                                ? "text-violet-800 bg-violet-200"
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
                                            {/* Conector */}
                                            {idx < steps.length - 1 && (
                                                <div className="hidden lg:block w-8 h-px bg-gradient-to-r from-violet-200 to-transparent ml-3" />
                                            )}
                                        </li>
                                    );
                                })}
                            </ol>

                            {/* Spacer para balancear layout */}
                            <div className="w-10" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="px-4 md:px-6 lg:px-8 py-10 md:py-12">
                <div className="max-w-2xl mx-auto">
                    <Card className="border border-white/60 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl">
                        <CardContent className="p-6 md:p-10">
                            {currentStep === 1 && (
                                <UserStep data={wizardData} onChange={setWizardData} onNext={handleNext} />
                            )}
                            {currentStep === 2 && (
                                <PhotoUpload data={wizardData} onChange={setWizardData} onNext={handleNext} />
                            )}
                            {currentStep === 3 && (
                                <ConfirmationStep
                                    data={wizardData}
                                    onChange={setWizardData}
                                    onSubmit={handleSubmit}
                                    isSubmitting={isSubmitting}
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}

