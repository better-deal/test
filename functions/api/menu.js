const FALLBACK_ITEMS = [
  { id: "chicken", data: { category: "SOUP CURRY", name: "スープカレー チキン", description: "野菜とチキンを楽しめる、NorThの看板メニュー。", price: 1400, featured: true, sortOrder: 1 } },
  { id: "cream", data: { category: "SOUP CURRY", name: "スープカレー クリームカレー", price: 1400, sortOrder: 2 } },
  { id: "pork", data: { category: "SOUP CURRY", name: "スープカレー 豚しゃぶカレー", price: 1300, sortOrder: 3 } },
  { id: "sausage", data: { category: "SOUP CURRY", name: "スープカレー ウインナーカレー", price: 1100, sortOrder: 4 } },
  { id: "vegetable", data: { category: "SOUP CURRY", name: "スープカレー ベジタブルカレー", price: 1000, sortOrder: 5 } },
  { id: "zangi", data: { category: "ZANGI", name: "ザンギ", description: "トッピングでチーズ、甘辛、ホットチリなどにも。", price: 590, accent: true, sortOrder: 6 } },
  { id: "zangi-half", data: { category: "ZANGI", name: "ザンギ ハーフ", price: 400, sortOrder: 7 } },
  { id: "ramen-salad", data: { category: "SALAD", name: "ラーメンサラダ", price: 600, sortOrder: 8 } }
];

export async function onRequestGet(context) {
  const corsHeaders = {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  };

  const apiBase = String(\n    context.env?.EMDASH_API_URL ??\n      "https://north-emdash.komure-dad.workers.dev"\n  ).replace(/\/$/, "");
  const token = String(context.env?.EMDASH_TOKEN ?? "");
  const collection = String(context.env?.EMDASH_COLLECTION ?? "products");

  if (!apiBase || !token) {
    return new Response(JSON.stringify({
      success: true,
      source: "fallback",
      reason: "EmDash environment variables are not configured.",
      data: { items: FALLBACK_ITEMS }
    }), { headers: corsHeaders });
  }

  try {
    const url = `${apiBase}/_emdash/api/content/${encodeURIComponent(collection)}`;
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`EmDash API returned ${response.status}`);
    }

    const payload = await response.json();
    const items = Array.isArray(payload?.data?.items) ? payload.data.items : [];

    return new Response(JSON.stringify({
      success: true,
      source: "emdash",
      data: { items }
    }), { headers: corsHeaders });
  } catch (error) {
    return new Response(JSON.stringify({
      success: true,
      source: "fallback",
      reason: error instanceof Error ? error.message : "EmDash request failed.",
      data: { items: FALLBACK_ITEMS }
    }), { headers: corsHeaders });
  }
}
