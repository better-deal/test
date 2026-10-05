const fallbackMenu = [
  { id: "chicken", category: "SOUP CURRY", name: "スープカレー チキン", description: "野菜とチキンを楽しめる、NorThの看板メニュー。", price: 1400, featured: true, sortOrder: 1 },
  { id: "cream", category: "SOUP CURRY", name: "スープカレー クリームカレー", price: 1400, sortOrder: 2 },
  { id: "pork", category: "SOUP CURRY", name: "スープカレー 豚しゃぶカレー", price: 1300, sortOrder: 3 },
  { id: "sausage", category: "SOUP CURRY", name: "スープカレー ウインナーカレー", price: 1100, sortOrder: 4 },
  { id: "vegetable", category: "SOUP CURRY", name: "スープカレー ベジタブルカレー", price: 1000, sortOrder: 5 },
  { id: "zangi", category: "ZANGI", name: "ザンギ", description: "トッピングでチーズ、甘辛、ホットチリなどにも。", price: 590, featured: false, accent: true, sortOrder: 6 },
  { id: "zangi-half", category: "ZANGI", name: "ザンギ ハーフ", price: 400, sortOrder: 7 },
  { id: "ramen-salad", category: "SALAD", name: "ラーメンサラダ", price: 600, sortOrder: 8 }
];

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const yen = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? `${number.toLocaleString("ja-JP")}円` : "";
};

const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));

function normalizeImageUrl(value) {
  const url = String(value ?? "").trim();
  if (!url) return "";

  // Accept normal GitHub file links pasted from the browser.
  const githubBlob = url.match(
    /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/
  );
  if (githubBlob) {
    const [, owner, repo, ref, path] = githubBlob;
    return `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${path}`;
  }

  return url;
}

function normalizeMenuItem(item, index) {
  const data = item?.data ?? item ?? {};
  return {
    id: item?.id ?? data.id ?? `menu-${index}`,
    category: data.category ?? data.genre ?? data.type ?? "MENU",
    name: data.name ?? data.title ?? data.menuName ?? "メニュー",
    description: data.description ?? data.excerpt ?? "",
    price: data.price ?? data.amount ?? data.priceYen ?? "",
    featured: Boolean(data.featured ?? data.isFeatured ?? index === 0),
    accent: Boolean(data.accent),
    image: normalizeImageUrl(
      data.image?.url ?? data.image_url ?? data.imageUrl ?? data.photoUrl ?? ""
    ),
    sortOrder: Number(data.sort_order ?? data.sortOrder ?? data.order ?? data.displayOrder ?? index + 1)
  };
}

function renderMenu(items, source) {
  const featureRoot = document.getElementById("menu-feature-root");
  const gridRoot = document.getElementById("menu-grid-root");
  const sourceNote = document.getElementById("menu-source-note");
  if (!featureRoot || !gridRoot) return;

  const sorted = items
    .map(normalizeMenuItem)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const featured = sorted.find((item) => item.featured) ?? sorted[0];
  const cards = sorted.filter((item) => item.id !== featured?.id);

  if (featured) {
    const imageStyle = featured.image
      ? ` style="background-image:url('${escapeHtml(featured.image)}');background-size:cover;background-position:center;"`
      : "";
    featureRoot.innerHTML = `
      <div class="menu-art large-art"${imageStyle}>
        ${featured.image ? "" : '<div class="bowl"></div><div class="curry"></div><div class="topping"></div>'}
      </div>
      <div class="menu-feature-copy">
        <span class="tag">${escapeHtml(featured.category)}</span>
        <h3>${escapeHtml(featured.name)}</h3>
        ${featured.description ? `<p>${escapeHtml(featured.description)}</p>` : ""}
        <strong>${yen(featured.price)}</strong>
      </div>`;
  } else {
    featureRoot.innerHTML = "";
  }

  gridRoot.innerHTML = cards.map((item) => `
    <article class="menu-card${item.accent ? " accent" : ""}">
      <span>${escapeHtml(item.category)}</span>
      <h3>${escapeHtml(item.name)}</h3>
      ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ""}
      <strong>${yen(item.price)}</strong>
    </article>`
  ).join("");

  if (sourceNote) {
    sourceNote.textContent = source === "emdash"
      ? "EmDashで管理しているメニュー情報を表示しています。"
      : "EmDash未接続のため、現在のサイト設定を表示しています。";
  }
}

async function loadMenu() {
  try {
    const response = await fetch("/api/menu", { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`menu API: ${response.status}`);
    const payload = await response.json();
    const items = Array.isArray(payload?.data?.items) ? payload.data.items : [];
    renderMenu(items.length ? items : fallbackMenu, payload?.source === "emdash" ? "emdash" : "fallback");
  } catch (error) {
    console.warn("EmDash menu load failed; using fallback menu.", error);
    renderMenu(fallbackMenu, "fallback");
  }
}

loadMenu();