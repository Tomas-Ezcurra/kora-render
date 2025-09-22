import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, CheckCircle, AlertCircle, Sparkles } from "lucide-react";

interface JobData {
    id: string;
    status: "pending" | "processing" | "completed" | "failed";
    progress: number;
    createdAt: string;
    completedAt?: string;
    style: string;
    budget: string;
    room: string;
    preferences: string[];
    renders?: string[];
    message?: string;
}

export default function JobStatusPage() {
    const router = useRouter();
    const { id } = router.query;
    const [job, setJob] = useState<JobData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;

        const fetchJobStatus = async () => {
            try {
                const response = await fetch(`/api/kora/jobs/${id}`);
                if (response.ok) {
                    const jobData = await response.json();
                    setJob(jobData);

                    // If completed, redirect to results
                    if (jobData.status === "completed") {
                        router.push(`/results/${id}`);
                        return;
                    }
                } else {
                    setError("No pudimos encontrar tu trabajo");
                }
            } catch (err) {
                setError("Error conectando con el servidor");
            } finally {
                setLoading(false);
            }
        };

        fetchJobStatus();

        // Poll for updates if not completed
        const interval = setInterval(fetchJobStatus, 3000);

        return () => clearInterval(interval);
    }, [id, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-neutral-600">Cargando tu trabajo...</p>
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
                <Card className="max-w-md mx-auto border-0 shadow-xl">
                    <CardContent className="p-8 text-center">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-neutral-800 mb-2">Ups, algo salió mal</h2>
                        <p className="text-neutral-600 mb-6">{error}</p>
                        <Button onClick={() => router.push("/")} className="w-full">
                            Volver al inicio
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending": return "text-amber-600";
            case "processing": return "text-blue-600";
            case "completed": return "text-emerald-600";
            case "failed": return "text-red-600";
            default: return "text-neutral-600";
        }
    };

    const getStatusBg = (status: string) => {
        switch (status) {
            case "pending": return "bg-amber-100";
            case "processing": return "bg-blue-100";
            case "completed": return "bg-emerald-100";
            case "failed": return "bg-red-100";
            default: return "bg-neutral-100";
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
            {/* Header */}
            <header className="px-4 md:px-6 lg:px-8 py-6 border-b border-neutral-200/60">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center justify-between">
                        <Button
                            onClick={() => router.push("/")}
                            variant="ghost"
                            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-800"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Inicio
                        </Button>

                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-semibold text-neutral-800">Kora</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="px-4 md:px-6 lg:px-8 py-12">
                <div className="max-w-2xl mx-auto space-y-8">
                    {/* Status Header */}
                    <div className="text-center">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${getStatusBg(job.status)} ${getStatusColor(job.status)}`}>
                            {job.status === "processing" && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
                            {job.status === "pending" && <Clock className="w-4 h-4" />}
                            {job.status === "completed" && <CheckCircle className="w-4 h-4" />}
                            {job.status === "failed" && <AlertCircle className="w-4 h-4" />}

                            {job.status === "pending" && "En cola"}
                            {job.status === "processing" && "Procesando"}
                            {job.status === "completed" && "Completado"}
                            {job.status === "failed" && "Error"}
                        </div>

                        <h1 className="text-3xl font-semibold text-neutral-800 mb-3">
                            Creando tu render
                        </h1>
                        <p className="text-neutral-600 leading-relaxed">
                            {job.message || "Trabajando en tu diseño personalizado..."}
                        </p>
                    </div>

                    {/* Progress Card */}
                    <Card className="border-0 shadow-xl shadow-neutral-200/50 bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-8">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-neutral-600">Progreso</span>
                                    <span className="font-medium text-neutral-800">{job.progress}%</span>
                                </div>

                                <Progress
                                    value={job.progress}
                                    className="h-3"
                                />

                                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-neutral-100">
                                    <div>
                                        <div className="text-sm font-medium text-neutral-700 mb-1">Iniciado</div>
                                        <div className="text-neutral-800">{formatTime(job.createdAt)}</div>
                                    </div>

                                    <div>
                                        <div className="text-sm font-medium text-neutral-700 mb-1">Tiempo estimado</div>
                                        <div className="text-neutral-800">3-5 minutos</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Job Details */}
                    <Card className="border-0 shadow-lg shadow-neutral-200/50 bg-gradient-to-br from-white to-neutral-50/50">
                        <CardContent className="p-6">
                            <h3 className="font-semibold text-neutral-800 mb-4">Detalles del trabajo</h3>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="text-neutral-600 mb-1">Estilo</div>
                                    <div className="text-neutral-800 capitalize">{job.style}</div>
                                </div>

                                <div>
                                    <div className="text-neutral-600 mb-1">Espacio</div>
                                    <div className="text-neutral-800 capitalize">{job.room}</div>
                                </div>

                                <div>
                                    <div className="text-neutral-600 mb-1">Presupuesto</div>
                                    <div className="text-neutral-800 capitalize">{job.budget}</div>
                                </div>

                                <div>
                                    <div className="text-neutral-600 mb-1">ID de trabajo</div>
                                    <div className="text-neutral-800 font-mono text-xs">{job.id}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Loading Animation */}
                    {job.status === "processing" && (
                        <Card className="border-0 shadow-lg shadow-neutral-200/50 bg-gradient-to-br from-blue-50 to-indigo-50">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex space-x-1">
                                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
                                    </div>
                                    <div>
                                        <div className="font-medium text-blue-800">Nuestro equipo está trabajando</div>
                                        <div className="text-sm text-blue-600">Aplicando inteligencia artificial a tu espacio</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Failed State */}
                    {job.status === "failed" && (
                        <Card className="border-0 shadow-lg shadow-neutral-200/50 bg-gradient-to-br from-red-50 to-pink-50">
                            <CardContent className="p-6 text-center">
                                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                <h3 className="font-semibold text-neutral-800 mb-2">No pudimos completar tu render</h3>
                                <p className="text-neutral-600 text-sm mb-4">
                                    Algo salió mal durante el proceso. No te preocupes, puedes intentar nuevamente.
                                </p>
                                <Button onClick={() => router.push("/wizard")} className="w-full">
                                    Intentar nuevamente
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
}
