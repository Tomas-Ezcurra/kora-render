import { NextApiRequest, NextApiResponse } from "next";

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

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { id } = req.query;

    if (req.method === "GET") {
        if (typeof id !== "string") {
            return res.status(400).json({ error: "Invalid job ID" });
        }

        // Mock recommendations based on job style and room
        const recommendations = generateMockRecommendations(id);

        res.status(200).json({ recommendations });
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}

function generateMockRecommendations(jobId: string): Recommendation[] {
    const mockProducts: Product[] = [
        {
            id: "sofa-1",
            name: "Sofá Modular Oslo",
            price: 890000,
            image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
            brand: "Nordic Home",
            category: "Sofás",
            description: "Sofá modular de 3 puestos en lino natural",
            url: "https://example.com/product/sofa-1",
            inStock: true
        },
        {
            id: "coffee-table-1",
            name: "Mesa de Centro Roble",
            price: 320000,
            image: "https://images.unsplash.com/photo-1549497538-303791108f95?w=400&h=300&fit=crop",
            brand: "Wood Works",
            category: "Mesas",
            description: "Mesa de centro en madera maciza de roble",
            url: "https://example.com/product/coffee-table-1",
            inStock: true
        },
        {
            id: "lamp-1",
            name: "Lámpara de Piso Minimalista",
            price: 180000,
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
            brand: "Light Studio",
            category: "Iluminación",
            description: "Lámpara de piso con diseño minimalista",
            url: "https://example.com/product/lamp-1",
            inStock: true
        },
        {
            id: "rug-1",
            name: "Alfombra Texturizada",
            price: 250000,
            image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=300&fit=crop",
            brand: "Textile Co",
            category: "Alfombras",
            description: "Alfombra de lana con textura natural",
            url: "https://example.com/product/rug-1",
            inStock: false
        },
        {
            id: "plant-1",
            name: "Monstera Deliciosa",
            price: 45000,
            image: "https://images.unsplash.com/photo-1545241047-6083a3684587?w=400&h=300&fit=crop",
            brand: "Green Life",
            category: "Plantas",
            description: "Planta monstera en maceta de cerámica",
            url: "https://example.com/product/plant-1",
            inStock: true
        },
        {
            id: "cushion-1",
            name: "Cojines Decorativos (Set x4)",
            price: 120000,
            image: "https://images.unsplash.com/photo-1586023492984-7e79840fcfe1?w=400&h=300&fit=crop",
            brand: "Comfort Plus",
            category: "Cojines",
            description: "Set de 4 cojines en tonos neutros",
            url: "https://example.com/product/cushion-1",
            inStock: true
        }
    ];

    return [
        {
            id: "rec-1",
            title: "Look Completo Minimalista",
            description: "Todo lo que necesitas para transformar tu espacio con estilo moderno",
            products: [mockProducts[0], mockProducts[1], mockProducts[2], mockProducts[4]],
            totalPrice: 1435000
        },
        {
            id: "rec-2",
            title: "Accesorios y Detalles",
            description: "Elementos decorativos para dar los toques finales",
            products: [mockProducts[3], mockProducts[5], mockProducts[4]],
            totalPrice: 415000
        },
        {
            id: "rec-3",
            title: "Iluminación y Ambiente",
            description: "Crea la atmósfera perfecta con estos elementos",
            products: [mockProducts[2], mockProducts[4]],
            totalPrice: 225000
        }
    ];
}
