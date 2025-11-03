import type { RenderProduct } from "@/types/products";
const sb = supabase as any;

const getEnvStr = (v?: string) => (typeof v === "string" ? v.trim() : "");
const envList = (envVal: string, defaults: string[]) => (envVal ? [envVal, ...defaults] : defaults);

const TABLE_CANDIDATES = [
    getEnvStr(process.env.NEXT_PUBLIC_PRODUCTS_TABLE),
    "products",
    "catalog",
    "items",
    "productos",
    "catalog_items",
].filter(Boolean) as string[];

const NAME_COLS = envList(getEnvStr(process.env.NEXT_PUBLIC_PRODUCTS_NAME_COL), ["name", "title", "product_name", "product"]);
const DESC_COLS = envList(getEnvStr(process.env.NEXT_PUBLIC_PRODUCTS_DESC_COL), ["description", "desc", "details", "summary", "short_description"]);
const IMAGE_COLS = envList(getEnvStr(process.env.NEXT_PUBLIC_PRODUCTS_IMAGE_COL), ["image_url", "image", "thumbnail", "photo_url", "cover", "url", "picture"]);
const PRICE_COLS = envList(getEnvStr(process.env.NEXT_PUBLIC_PRODUCTS_PRICE_COL), ["price", "amount", "cost", "usd_price", "ars_price"]);
const URL_COLS = envList(getEnvStr(process.env.NEXT_PUBLIC_PRODUCTS_URL_COL), ["url", "link", "permalink", "product_url"]);
const MATCH_STRATEGY = getEnvStr(process.env.NEXT_PUBLIC_PRODUCTS_MATCH_STRATEGY) || "name_first";

function pickString(source: Record<string, unknown>, keys: string[]): string | undefined {
    for (const k of keys) {
        const v = source?.[k];
        if (typeof v === "string" && v.trim()) return v;
    }
    return undefined;
}

function pickNumber(source: Record<string, unknown>, keys: string[]): number | undefined {
    for (const k of keys) {
        const v = source?.[k];
        if (typeof v === "number" && Number.isFinite(v)) return v;
    }
    return undefined;
}

function toDataUrlIfBase64(image?: string, mimeType = "image/jpeg"): string | undefined {
    if (!image || typeof image !== "string") return undefined;
    if (image.startsWith("http") || image.startsWith("data:")) return image;
    return `data:${mimeType};base64,${image}`;
}

function mergeProduct(base: RenderProduct, row: Record<string, unknown>): RenderProduct {
    const resolvedName = pickString(row, NAME_COLS) || base.product || base.name;
    const resolvedDesc = pickString(row, DESC_COLS) || base.description;
    const resolvedImg = pickString(row, IMAGE_COLS) || base.image;
    const resolvedPrice = pickNumber(row, PRICE_COLS) ?? base.price;
    const resolvedUrl = pickString(row, URL_COLS);

    const imageFinal = toDataUrlIfBase64(resolvedImg, base.mimeType || "image/jpeg") || base.image;

    return {
        id: (row?.["id"] as string | number | undefined) ?? base.id,
        product: resolvedName,
        name: resolvedName,
        description: resolvedDesc,
        image: imageFinal,
        mimeType: base.mimeType,
        price: resolvedPrice,
        url: resolvedUrl,
    };
}

async function querySingle<T = any>(table: string, builder: (q: any) => any): Promise<T | null> {
    try {
        let q = sb.from(table).select("*");
        q = builder(q).limit(1);
        const { data, error } = await q;
        if (error) {
            console.warn("[productService] Query error on table", table, "->", error.message);
            return null;
        }
        if (Array.isArray(data) && data.length > 0) return data[0] as T;
        return null;
    } catch (e) {
        console.warn("[productService] Query failure on table", table, e);
        return null;
    }
}

async function findRowByName(table: string, name: string): Promise<Record<string, unknown> | null> {
    const term = name.trim();
    if (!term) return null;

    for (const col of NAME_COLS) {
        const row = await querySingle<Record<string, unknown>>(table, (q: any) =>
            q.ilike(col, `%${term}%`)
        );
        if (row) return row;
    }
    return null;
}

async function findRowById(table: string, id: string | number): Promise<Record<string, unknown> | null> {
    return await querySingle<Record<string, unknown>>(table, (q: any) => q.eq("id", id));
}

async function findBestRow(p: RenderProduct): Promise<{ row: Record<string, unknown> | null; table?: string }> {
    const name = (p.product || p.name || "").trim();
    for (const table of TABLE_CANDIDATES) {
        const tryByName = async () => (name ? await findRowByName(table, name) : null);
        const tryById = async () => (p.id !== undefined && p.id !== null ? await findRowById(table, p.id as any) : null);

        if (MATCH_STRATEGY === "id_first") {
            const byId = await tryById();
            if (byId) return { row: byId, table };
            const byName = await tryByName();
            if (byName) return { row: byName, table };
        } else {
            const byName = await tryByName();
            if (byName) return { row: byName, table };
            const byId = await tryById();
            if (byId) return { row: byId, table };
        }
    }
    return { row: null, table: undefined };
}

export async function enrichProductsWithSupabase(extracted: RenderProduct[]): Promise<RenderProduct[]> {
    try {
        if (!Array.isArray(extracted) || extracted.length === 0) return [];

        console.log("[productService] Enriqueciendo", extracted.length, "productos con Supabase");

        const results: RenderProduct[] = [];
        for (const p of extracted) {
            const { row } = await findBestRow(p);
            if (row) {
                const merged = mergeProduct(p, row);
                results.push(merged);
            } else {
                results.push(p);
            }
        }

        console.log("[productService] Finalizados. Con matches:", results.filter(r => r.url || typeof r.price === "number").length);
        return results;
    } catch (e) {
        console.warn("[productService] enrichProductsWithSupabase falló, devolviendo productos base", e);
        return extracted;
    }
}
