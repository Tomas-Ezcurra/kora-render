import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud, Image, ArrowRight, Camera, Plus, X, AlertCircle } from "lucide-react";
import { WizardData } from "@/types/wizard";
import { Textarea } from "@/components/ui/textarea";

interface PhotoUploadProps {
    data: WizardData;
    onChange: (data: WizardData) => void;
    onNext: () => void;
}

export default function PhotoUpload({ data, onChange, onNext }: PhotoUploadProps) {
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (files: FileList | File[]) => {
        setError("");

        const fileArray = Array.from(files);
        const validFiles: File[] = [];
        const newPreviews: string[] = [];

        // Validar archivos
        for (const file of fileArray) {
            if (!file.type.startsWith("image/")) {
                setError("Solo se permiten imágenes válidas");
                continue;
            }

            if (file.size > 10 * 1024 * 1024) {
                setError("Las imágenes deben ser menores a 10MB");
                continue;
            }

            if (data.photos.length + validFiles.length >= 3) {
                setError("Máximo 3 imágenes permitidas");
                break;
            }

            validFiles.push(file);
        }

        if (validFiles.length === 0) return;

        // Crear previews
        validFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = e.target?.result as string;
                newPreviews.push(preview);

                if (newPreviews.length === validFiles.length) {
                    onChange({
                        ...data,
                        photos: [...data.photos, ...validFiles],
                        photoPreviews: [...data.photoPreviews, ...newPreviews]
                    });
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileSelect(files);
        }
    };

    const removePhoto = (index: number) => {
        const newPhotos = data.photos.filter((_, i) => i !== index);
        const newPreviews = data.photoPreviews.filter((_, i) => i !== index);

        onChange({
            ...data,
            photos: newPhotos,
            photoPreviews: newPreviews
        });

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange({
            ...data,
            prompt: e.target.value
        });
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl flex items-center justify-center mb-6 mx-auto">
                    <Camera className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-2xl font-semibold text-neutral-800 mb-3">Sube tus fotos</h2>
                <p className="text-neutral-600 leading-relaxed max-w-md mx-auto">
                    Comparte hasta 3 imágenes de tu espacio para crear renders más precisos.
                </p>
            </div>

            {/* Upload Area */}
            {data.photos.length < 3 && (
                <div
                    className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer ${dragActive
                            ? "border-purple-400 bg-purple-50"
                            : "border-neutral-300 hover:border-purple-300 hover:bg-purple-25"
                        }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                            <Plus className="w-6 h-6 text-neutral-400" />
                        </div>
                        <div>
                            <p className="text-lg font-medium text-neutral-700 mb-1">
                                {data.photos.length === 0 ? "Arrastra tus fotos aquí" : "Agregar más fotos"}
                            </p>
                            <p className="text-sm text-neutral-500">
                                O haz click para seleccionar ({data.photos.length}/3)
                            </p>
                            <p className="text-xs text-neutral-400 mt-2">
                                PNG, JPG, WEBP hasta 10MB cada una
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Photo Grid */}
            {data.photos.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.photoPreviews.map((preview, index) => (
                        <Card key={index} className="overflow-hidden bg-gradient-to-br from-white to-neutral-50/50 border-0 shadow-lg group">
                            <CardContent className="p-0 relative">
                                <img
                                    src={preview}
                                    alt={`Foto ${index + 1}`}
                                    className="w-full h-48 object-cover"
                                />
                                <Button
                                    onClick={() => removePhoto(index)}
                                    size="sm"
                                    variant="outline"
                                    className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                                    <div className="flex items-center gap-2 text-white text-sm">
                                        <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                                        Foto {index + 1}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Prompt Input */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                        Describe tu visión (opcional)
                    </h3>
                    <p className="text-sm text-neutral-600 mb-4">
                        Comparte detalles específicos sobre cómo te gustaría ver tu espacio transformado.
                    </p>
                </div>

                <Textarea
                    value={data.prompt}
                    onChange={handlePromptChange}
                    placeholder="Ejemplo: Me gustaría un estilo más moderno con colores neutros, agregar plantas, cambiar la iluminación por algo más cálido, y crear un rincón de lectura acogedor..."
                    className="min-h-[100px] bg-white/80 border-neutral-200 focus:border-amber-400 focus:ring-amber-400/20"
                />

                {data.prompt && (
                    <div className="flex items-center gap-2 text-emerald-600 text-sm">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        Descripción agregada - esto ayudará a crear renders más personalizados.
                    </div>
                )}
            </div>

            {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 rounded-xl text-red-700">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileInput}
                className="hidden"
            />

            <div className="flex justify-between pt-6">
                <div />
                <Button
                    onClick={onNext}
                    disabled={data.photos.length === 0}
                    className="bg-gradient-to-r from-purple-500 to-purple-500 hover:from-pruple-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Continuar
                </Button>
            </div>
        </div>
    );
}