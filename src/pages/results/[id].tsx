import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    Download,
    Share2,
    Heart,
    ShoppingCart,
    MessageCircle,
    ExternalLink,
    Sparkles,
    Eye,
    AlertCircle
} from "lucide-react";

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    brand: string;
    category: string;
    description: string;
    url: string;
    inStock: boolean;
}

interface Recommendation {
    id: string;
    title: string;
    description: string;
    products: Product[];
    totalPrice: number;
}

interface JobData {
    id: string;
    status: string;
    style: string;
    room: string;
    budget: string;
    preferences: string[];
    renders?: string[];
}

export default function ResultsPage() {
    const router = useRouter();
    const { id } = router.query;
    const [job, setJob] = useState<JobData | null>(null);
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedRender, setSelectedRender] = useState(0);
    const [cart, setCart] = useState<Product[]>([]);
    const [savedRenders, setSavedRenders] = useState<string[]>([]);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                // Fetch job details
                const jobResponse = await fetch(`/api/kora/jobs/${id}`);
                if (jobResponse.ok) {
                    const jobData = await jobResponse.json();
                    setJob(jobData);
                }

                // Fetch recommendations
                const recResponse = await fetch(`/api/kora/jobs/${id}/recommendations`);
                if (recResponse.ok) {
                    const { recommendations: recData } = await recResponse.json();
                    setRecommendations(recData);
                }
            } catch (err) {
                setError("Error cargando los resultados");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const addToCart = (product: Product) => {
        if (!cart.find(item => item.id === product.id)) {
            setCart([...cart, product]);
        }
    };

    const removeFromCart = (productId: string) => {
        setCart(cart.filter(item => item.id !== productId));
    };

    const toggleSaved = (renderId: string) => {
        setSavedRenders(prev =>
            prev.includes(renderId)
                ? prev.filter(id => id !== renderId)
                : [...prev, renderId]
        );
    };

    const shareWhatsApp = () => {
        const message = `¡Mira mis renders de decoración con Kora! ${window.location.href}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
    };

    const shareCart = () => {
        const products = cart.map(p => `• ${p.name} - $${p.price.toLocaleString()}`).join('\n');
        const total = cart.reduce((sum, p) => sum + p.price, 0);
        const message = `¡Encontré estos productos perfectos para mi espacio!\n\n${products}\n\nTotal: $${total.toLocaleString()}\n\nVisto en Kora: ${window.location.href}`;

        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0,
        }).format(price);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-neutral-600">Cargando tus renders...</p>
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
                        <h2 className="text-xl font-semibold text-neutral-800 mb-2">Renders no encontrados</h2>
                        <p className="text-neutral-600 mb-6">{error}</p>
                        <Button onClick={() => router.push("/")} className="w-full">
                            Crear nuevo render
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const mockRenders = job.renders || [
        "https://images.unsplash.com/photo-1586023492984-7e79840fcfe1?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1591825113563-ed7d7fbc1e9f?w=800&h=600&fit=crop"
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
            {/* Header */}
            <header className="px-4 md:px-6 lg:px-8 py-6 border-b border-neutral-200/60">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between">
                        <Button
                            onClick={() => router.push("/")}
                            variant="ghost"
                            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-800"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Nuevo render
                        </Button>

                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-semibold text-neutral-800">Kora</span>
                        </div>

                        <div className="flex items-center gap-2">
                            {cart.length > 0 && (
                                <Button
                                    onClick={shareCart}
                                    variant="outline"
                                    size="sm"
                                    className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                                >
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Compartir carrito ({cart.length})
                                </Button>
                            )}
                            <Button
                                onClick={shareWhatsApp}
                                variant="outline"
                                size="sm"
                            >
                                <Share2 className="w-4 h-4 mr-2" />
                                Compartir
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Success Banner */}
            <div className="px-4 md:px-6 lg:px-8 py-6">
                <div className="max-w-6xl mx-auto">
                    <Card className="border-0 shadow-lg shadow-emerald-200/50 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-emerald-800 mb-1">
                                        ¡Tu render está listo!
                                    </h2>
                                    <p className="text-emerald-700">
                                        Explora tus {mockRenders.length} diseños personalizados y los productos que puedes comprar
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Main Content */}
            <main className="px-4 md:px-6 lg:px-8 pb-20">
                <div className="max-w-6xl mx-auto space-y-12">
                    {/* Renders Gallery */}
                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-semibold text-neutral-800 mb-2">Tus renders</h2>
                                <p className="text-neutral-600">
                                    Estilo {job.style} • {job.room} • Presupuesto {job.budget}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                    <Download className="w-4 h-4 mr-2" />
                                    Descargar
                                </Button>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Main Render */}
                            <div className="lg:col-span-2">
                                <Card className="overflow-hidden border-0 shadow-xl shadow-neutral-200/50">
                                    <CardContent className="p-0 relative">
                                        <img
                                            src={mockRenders[selectedRender]}
                                            alt={`Render ${selectedRender + 1}`}
                                            className="w-full h-[400px] lg:h-[500px] object-cover"
                                        />
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <Button
                                                onClick={() => toggleSaved(mockRenders[selectedRender])}
                                                size="sm"
                                                variant="outline"
                                                className="bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white"
                                            >
                                                <Heart
                                                    className={`w-4 h-4 ${savedRenders.includes(mockRenders[selectedRender]) ? 'fill-red-500 text-red-500' : ''}`}
                                                />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Render Thumbnails */}
                            <div className="space-y-4">
                                <h3 className="font-medium text-neutral-800">Todas las opciones</h3>
                                <div className="space-y-3">
                                    {mockRenders.map((render, index) => (
                                        <Card
                                            key={index}
                                            className={`cursor-pointer border-2 transition-all hover:shadow-lg ${selectedRender === index
                                                    ? "border-amber-400 shadow-lg"
                                                    : "border-neutral-200 hover:border-neutral-300"
                                                }`}
                                            onClick={() => setSelectedRender(index)}
                                        >
                                            <CardContent className="p-0">
                                                <img
                                                    src={render}
                                                    alt={`Render ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded-lg"
                                                />
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Products Section */}
                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-semibold text-neutral-800 mb-2">Productos recomendados</h2>
                                <p className="text-neutral-600">Encuentra y compra los elementos de tus renders</p>
                            </div>
                            {cart.length > 0 && (
                                <Badge className="bg-amber-100 text-amber-800 border-amber-200 px-3 py-1">
                                    {cart.length} productos en carrito
                                </Badge>
                            )}
                        </div>

                        <div className="space-y-8">
                            {recommendations.map((rec) => (
                                <Card key={rec.id} className="border-0 shadow-lg shadow-neutral-200/50">
                                    <CardContent className="p-8">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h3 className="text-xl font-semibold text-neutral-800 mb-2">{rec.title}</h3>
                                                <p className="text-neutral-600">{rec.description}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-neutral-800">
                                                    {formatPrice(rec.totalPrice)}
                                                </div>
                                                <div className="text-sm text-neutral-500">Total del set</div>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {rec.products.map((product) => (
                                                <Card
                                                    key={product.id}
                                                    className="border border-neutral-200 hover:shadow-md transition-all"
                                                >
                                                    <CardContent className="p-4">
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="w-full h-48 object-cover rounded-lg mb-4"
                                                        />
                                                        <div className="space-y-3">
                                                            <div>
                                                                <h4 className="font-medium text-neutral-800">{product.name}</h4>
                                                                <p className="text-sm text-neutral-600">{product.brand}</p>
                                                            </div>

                                                            <div className="flex items-center justify-between">
                                                                <div className="text-lg font-semibold text-neutral-800">
                                                                    {formatPrice(product.price)}
                                                                </div>
                                                                <Badge
                                                                    variant={product.inStock ? "secondary" : "outline"}
                                                                    className={product.inStock ? "bg-emerald-100 text-emerald-800" : ""}
                                                                >
                                                                    {product.inStock ? "Disponible" : "Sin stock"}
                                                                </Badge>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <Button
                                                                    onClick={() => addToCart(product)}
                                                                    disabled={!product.inStock || cart.some(item => item.id === product.id)}
                                                                    size="sm"
                                                                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
                                                                >
                                                                    <ShoppingCart className="w-4 h-4 mr-1" />
                                                                    {cart.some(item => item.id === product.id) ? "Agregado" : "Agregar"}
                                                                </Button>
                                                                <Button
                                                                    onClick={() => window.open(product.url, "_blank")}
                                                                    size="sm"
                                                                    variant="outline"
                                                                >
                                                                    <ExternalLink className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
